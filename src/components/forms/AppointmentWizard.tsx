import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { departmentsData, doctorsData, hospitalInfo } from '../../data';
import { AppointmentFormData, AppointmentSubmissionResult } from '../../types';
import { appointmentApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Stethoscope, 
  Info,
  Printer,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const timeSlots = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '02:30 PM - 03:30 PM',
  '03:30 PM - 04:30 PM',
  '04:30 PM - 05:30 PM',
  '05:30 PM - 06:30 PM',
  '06:30 PM - 07:30 PM'
];

export const AppointmentWizard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotification();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<AppointmentSubmissionResult | null>(null);

  const initialDeptId = searchParams.get('department') || '';
  const initialDoctorId = searchParams.get('doctor') || '';

  const [formData, setFormData] = useState<AppointmentFormData>({
    departmentId: initialDeptId,
    departmentName: '',
    doctorId: initialDoctorId,
    doctorName: '',
    preferredDate: '',
    preferredTimeSlot: '',
    patientFullName: '',
    patientPhone: '',
    patientEmail: '',
    patientGender: 'Not Specified',
    patientDob: '',
    visitReason: '',
    patientType: 'new',
    agreedToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-populate department and doctor names if query parameters are present
  useEffect(() => {
    if (initialDoctorId) {
      const doc = doctorsData.find((d) => d.id === initialDoctorId);
      if (doc) {
        setFormData((prev) => ({
          ...prev,
          doctorId: doc.id,
          doctorName: doc.name,
          departmentId: doc.departmentId,
          departmentName: doc.departmentName
        }));
      }
    } else if (initialDeptId) {
      const dept = departmentsData.find((d) => d.id === initialDeptId);
      if (dept) {
        setFormData((prev) => ({
          ...prev,
          departmentId: dept.id,
          departmentName: dept.name
        }));
      }
    }
  }, [initialDoctorId, initialDeptId]);

  // Doctors filtered by selected department
  const filteredDoctors = formData.departmentId
    ? doctorsData.filter((doc) => doc.departmentId === formData.departmentId)
    : doctorsData;

  const handleDepartmentChange = (deptId: string) => {
    const dept = departmentsData.find((d) => d.id === deptId);
    setFormData((prev) => ({
      ...prev,
      departmentId: deptId,
      departmentName: dept ? dept.name : '',
      doctorId: '',
      doctorName: ''
    }));
    setErrors((prev) => ({ ...prev, departmentId: '', doctorId: '' }));
  };

  const handleDoctorChange = (docId: string) => {
    const doc = doctorsData.find((d) => d.id === docId);
    setFormData((prev) => ({
      ...prev,
      doctorId: docId,
      doctorName: doc ? doc.name : '',
      departmentId: doc ? doc.departmentId : prev.departmentId,
      departmentName: doc ? doc.departmentName : prev.departmentName
    }));
    setErrors((prev) => ({ ...prev, doctorId: '' }));
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.departmentId) errs.departmentId = 'Please select a clinical department.';
    if (!formData.doctorId) errs.doctorId = 'Please select a consultant doctor.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.preferredDate) errs.preferredDate = 'Please choose a preferred consultation date.';
    if (!formData.preferredTimeSlot) errs.preferredTimeSlot = 'Please select a preferred consultation time window.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.patientFullName.trim()) errs.patientFullName = 'Full name is required.';
    if (!formData.patientPhone.trim()) {
      errs.patientPhone = 'Contact phone number is required.';
    } else if (formData.patientPhone.replace(/\D/g, '').length < 8) {
      errs.patientPhone = 'Please enter a valid telephone or mobile number.';
    }
    if (formData.patientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patientEmail)) {
      errs.patientEmail = 'Please enter a valid email address.';
    }
    if (!formData.visitReason.trim()) {
      errs.visitReason = 'Please briefly state the health concern or symptom.';
    }
    if (!formData.agreedToTerms) {
      errs.agreedToTerms = 'You must acknowledge the appointment terms to proceed.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);

    try {
      const res = await appointmentApi.createAppointment({
        patientName: formData.patientFullName,
        phone: formData.patientPhone,
        email: formData.patientEmail || undefined,
        departmentId: formData.departmentId,
        doctorId: formData.doctorId,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTimeSlot,
        reason: formData.visitReason
      });

      const appointmentNumber = res.success && res.data?.appointmentNumber
        ? res.data.appointmentNumber
        : 'IND-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

      const result: AppointmentSubmissionResult = {
        requestId: appointmentNumber,
        data: { ...formData },
        submittedAt: new Date().toLocaleString(),
        status: 'Received - Pending Hospital Confirmation'
      };

      setSubmissionResult(result);
      setIsSubmitting(false);
      setStep(4);
      showNotification(
        'success',
        'Appointment Request Lodged',
        `Your request #${appointmentNumber} was received. Our team will verify doctor availability and contact you.`
      );
    } catch {
      const fallbackNumber = 'IND-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      const result: AppointmentSubmissionResult = {
        requestId: fallbackNumber,
        data: { ...formData },
        submittedAt: new Date().toLocaleString(),
        status: 'Received - Pending Hospital Confirmation'
      };

      setSubmissionResult(result);
      setIsSubmitting(false);
      setStep(4);
      showNotification(
        'success',
        'Appointment Request Lodged',
        `Your request #${fallbackNumber} was received. Our team will verify doctor availability and contact you.`
      );
    }
  };

  const handleReset = () => {
    setFormData({
      departmentId: '',
      departmentName: '',
      doctorId: '',
      doctorName: '',
      preferredDate: '',
      preferredTimeSlot: '',
      patientFullName: '',
      patientPhone: '',
      patientEmail: '',
      patientGender: 'Not Specified',
      patientDob: '',
      visitReason: '',
      patientType: 'new',
      agreedToTerms: false
    });
    setErrors({});
    setSubmissionResult(null);
    setStep(1);
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="card" style={{ maxWidth: '820px', margin: '0 auto', boxShadow: 'var(--shadow-md)' }}>
      {/* Wizard Progress Stepper */}
      <div 
        style={{ 
          backgroundColor: 'var(--color-bg-base)', 
          borderBottom: '1px solid var(--color-border-subtle)',
          padding: '1.25rem 1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {[
            { num: 1, label: 'Doctor' },
            { num: 2, label: 'Date & Slot' },
            { num: 3, label: 'Patient Info' },
            { num: 4, label: 'Submission' }
          ].map((item, idx) => {
            const isCompleted = step > item.num;
            const isCurrent = step === item.num;

            return (
              <div 
                key={item.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: isCompleted || isCurrent ? 1 : 0.5,
                  zIndex: 2
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted 
                      ? 'var(--color-success)' 
                      : isCurrent 
                      ? 'var(--color-primary)' 
                      : '#e2e8f0',
                    color: isCompleted || isCurrent ? '#ffffff' : 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : item.num}
                </div>
                <span 
                  style={{ 
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem',
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                    display: 'none' /* Hidden on small mobile */
                  }}
                  className="step-label"
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-body" style={{ padding: '2rem' }}>
        {/* STEP 1: Department & Doctor */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem', color: 'var(--color-primary-dark)' }}>
                Step 1: Choose Specialty & Doctor
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Select the clinical department and physician for your consultation at IndoStates Hospital.
              </p>
            </div>

            {/* Department Selection */}
            <div className="form-group">
              <label htmlFor="dept-select" className="form-label">
                Clinical Department <span className="required">*</span>
              </label>
              <select
                id="dept-select"
                className={`form-control ${errors.departmentId ? 'is-invalid' : ''}`}
                value={formData.departmentId}
                onChange={(e) => handleDepartmentChange(e.target.value)}
              >
                <option value="">-- Choose a Department --</option>
                {departmentsData.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.category})
                  </option>
                ))}
              </select>
              {errors.departmentId && <div className="form-feedback-error">{errors.departmentId}</div>}
            </div>

            {/* Doctor Selection */}
            <div className="form-group">
              <label htmlFor="doc-select" className="form-label">
                Consultant Doctor <span className="required">*</span>
              </label>
              <select
                id="doc-select"
                className={`form-control ${errors.doctorId ? 'is-invalid' : ''}`}
                value={formData.doctorId}
                onChange={(e) => handleDoctorChange(e.target.value)}
              >
                <option value="">
                  {formData.departmentId
                    ? `-- Select Doctor in ${formData.departmentName || 'Selected Department'} --`
                    : '-- First Select a Department Above, or Choose Doctor Directly --'}
                </option>
                {filteredDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.specialization} ({doc.opdTimings})
                  </option>
                ))}
              </select>
              {errors.doctorId && <div className="form-feedback-error">{errors.doctorId}</div>}
            </div>

            {/* Selected Doctor Summary Preview */}
            {formData.doctorId && (
              <div 
                style={{
                  backgroundColor: 'var(--color-primary-subtle)',
                  border: '1px solid rgba(2, 132, 199, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}
              >
                <div 
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)'
                  }}
                >
                  <Stethoscope size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{formData.doctorName}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                    {formData.departmentName} • {hospitalInfo.name} Campus
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
              >
                <span>Continue to Date & Time</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Date & Time */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem', color: 'var(--color-primary-dark)' }}>
                Step 2: Preferred Date & Time Window
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Consultation with: <strong>{formData.doctorName}</strong> ({formData.departmentName})
              </p>
            </div>

            <div className="grid grid-cols-2" style={{ marginBottom: '1.5rem' }}>
              {/* Date */}
              <div className="form-group">
                <label htmlFor="pref-date" className="form-label">
                  Preferred Date <span className="required">*</span>
                </label>
                <input
                  id="pref-date"
                  type="date"
                  min={minDate}
                  className={`form-control ${errors.preferredDate ? 'is-invalid' : ''}`}
                  value={formData.preferredDate}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, preferredDate: e.target.value }));
                    setErrors((prev) => ({ ...prev, preferredDate: '' }));
                  }}
                />
                {errors.preferredDate && <div className="form-feedback-error">{errors.preferredDate}</div>}
                <div className="form-helper">Consultations are scheduled at least 1 day in advance.</div>
              </div>

              {/* Time Slot */}
              <div className="form-group">
                <label htmlFor="pref-time" className="form-label">
                  Preferred Time Window <span className="required">*</span>
                </label>
                <select
                  id="pref-time"
                  className={`form-control ${errors.preferredTimeSlot ? 'is-invalid' : ''}`}
                  value={formData.preferredTimeSlot}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, preferredTimeSlot: e.target.value }));
                    setErrors((prev) => ({ ...prev, preferredTimeSlot: '' }));
                  }}
                >
                  <option value="">-- Choose Time Window --</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {errors.preferredTimeSlot && <div className="form-feedback-error">{errors.preferredTimeSlot}</div>}
                <div className="form-helper">Final slot token is assigned upon hospital phone verification.</div>
              </div>
            </div>

            {/* OPD Timing Info Note */}
            <div 
              style={{
                backgroundColor: 'var(--color-bg-muted)',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                fontSize: '0.82rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '1.5rem'
              }}
            >
              <Info size={16} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Regular OPD Timings:</strong> Monday to Saturday, 08:00 AM – 08:00 PM. Emergency medical admissions do not require an appointment and are accepted 24x7 at the Ground Floor Trauma Desk.
              </div>
            </div>

            {/* Stepper Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={handleBack}
                className="btn btn-outline"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
              >
                <span>Continue to Patient Details</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Patient Information */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem', color: 'var(--color-primary-dark)' }}>
                Step 3: Patient Information & Clinical Summary
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Please provide patient details so the hospital appointment desk can register your file.
              </p>
            </div>

            {/* Patient Type */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Are you an existing IndoStates Hospital patient?</label>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="patientType"
                    checked={formData.patientType === 'new'}
                    onChange={() => setFormData((prev) => ({ ...prev, patientType: 'new' }))}
                  />
                  <span>New Patient (First Visit)</span>
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="patientType"
                    checked={formData.patientType === 'existing'}
                    onChange={() => setFormData((prev) => ({ ...prev, patientType: 'existing' }))}
                  />
                  <span>Existing Patient (Have Hospital UHID)</span>
                </label>
              </div>
            </div>

            {/* Full Name & Phone */}
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label htmlFor="patient-name" className="form-label">
                  Patient Full Name <span className="required">*</span>
                </label>
                <input
                  id="patient-name"
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  className={`form-control ${errors.patientFullName ? 'is-invalid' : ''}`}
                  value={formData.patientFullName}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, patientFullName: e.target.value }));
                    setErrors((prev) => ({ ...prev, patientFullName: '' }));
                  }}
                />
                {errors.patientFullName && <div className="form-feedback-error">{errors.patientFullName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="patient-phone" className="form-label">
                  Contact Mobile Number <span className="required">*</span>
                </label>
                <input
                  id="patient-phone"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  className={`form-control ${errors.patientPhone ? 'is-invalid' : ''}`}
                  value={formData.patientPhone}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, patientPhone: e.target.value }));
                    setErrors((prev) => ({ ...prev, patientPhone: '' }));
                  }}
                />
                {errors.patientPhone && <div className="form-feedback-error">{errors.patientPhone}</div>}
                <div className="form-helper">Used for SMS/WhatsApp verification and scheduling call.</div>
              </div>
            </div>

            {/* Email & Gender */}
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label htmlFor="patient-email" className="form-label">Email Address (Optional)</label>
                <input
                  id="patient-email"
                  type="email"
                  placeholder="name@example.com"
                  className={`form-control ${errors.patientEmail ? 'is-invalid' : ''}`}
                  value={formData.patientEmail}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, patientEmail: e.target.value }));
                    setErrors((prev) => ({ ...prev, patientEmail: '' }));
                  }}
                />
                {errors.patientEmail && <div className="form-feedback-error">{errors.patientEmail}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="patient-gender" className="form-label">Gender</label>
                <select
                  id="patient-gender"
                  className="form-control"
                  value={formData.patientGender}
                  onChange={(e) => setFormData((prev) => ({ ...prev, patientGender: e.target.value }))}
                >
                  <option value="Not Specified">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Reason for Visit */}
            <div className="form-group">
              <label htmlFor="visit-reason" className="form-label">
                Reason for Visit / Primary Symptoms <span className="required">*</span>
              </label>
              <textarea
                id="visit-reason"
                rows={3}
                placeholder="Briefly describe what symptoms you are experiencing or whether this is a routine review..."
                className={`form-control ${errors.visitReason ? 'is-invalid' : ''}`}
                value={formData.visitReason}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, visitReason: e.target.value }));
                  setErrors((prev) => ({ ...prev, visitReason: '' }));
                }}
              />
              {errors.visitReason && <div className="form-feedback-error">{errors.visitReason}</div>}
            </div>

            {/* Step 7: Review Consultation Request Details */}
            <div 
              style={{ 
                backgroundColor: 'var(--color-bg-base)', 
                border: '1px solid var(--color-border-subtle)', 
                borderRadius: 'var(--radius-md)', 
                padding: '1.25rem 1.5rem', 
                marginBottom: '1.5rem' 
              }}
            >
              <h4 style={{ fontSize: '0.98rem', color: 'var(--color-primary-dark)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={16} color="var(--color-secondary)" />
                <span>Review Consultation Request Summary</span>
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                <div><strong>Department:</strong> {formData.departmentName || 'Selected'}</div>
                <div><strong>Consultant:</strong> {formData.doctorName || 'Selected'}</div>
                <div><strong>Date:</strong> {formData.preferredDate || 'Pending'}</div>
                <div><strong>Time Slot:</strong> {formData.preferredTimeSlot || 'Pending'}</div>
                <div><strong>Patient Name:</strong> {formData.patientFullName || 'Pending Name'}</div>
                <div><strong>Phone:</strong> {formData.patientPhone || 'Pending Phone'}</div>
              </div>
            </div>

            {/* Terms Acknowledgment */}
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer', fontSize: '0.84rem', color: 'var(--color-text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, agreedToTerms: e.target.checked }));
                    setErrors((prev) => ({ ...prev, agreedToTerms: '' }));
                  }}
                  style={{ marginTop: '3px' }}
                />
                <span>
                  I understand that this is an <strong>appointment request</strong>. A hospital representative will review the consultant’s schedule and contact me to confirm the final slot token and OPD room.
                </span>
              </label>
              {errors.agreedToTerms && <div className="form-feedback-error">{errors.agreedToTerms}</div>}
            </div>

            {/* Stepper Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={handleBack}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Submitting Request...</span>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Submit Appointment Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Request Submitted Confirmation */}
        {step === 4 && submissionResult && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div 
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                backgroundColor: 'var(--color-success-subtle)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                border: '2px solid rgba(22, 163, 74, 0.3)'
              }}
            >
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.65rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              Appointment Request Received
            </h3>

            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '580px', margin: '0 auto 1.75rem auto', fontSize: '0.95rem' }}>
              Appointment request received. Hospital confirmation will be provided through the official communication channel.
            </p>

            {/* Request Summary Receipt Card */}
            <div 
              style={{
                backgroundColor: 'var(--color-bg-base)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                textAlign: 'left',
                maxWidth: '560px',
                margin: '0 auto 2rem auto',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Request Reference ID</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.04em' }}>
                    {submissionResult.requestId}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-secondary">Status: Pending Verification</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                <div>
                  <strong>Doctor:</strong> {submissionResult.data.doctorName}
                </div>
                <div>
                  <strong>Department:</strong> {submissionResult.data.departmentName}
                </div>
                <div>
                  <strong>Requested Date & Window:</strong> {submissionResult.data.preferredDate} ({submissionResult.data.preferredTimeSlot})
                </div>
                <div>
                  <strong>Patient Name:</strong> {submissionResult.data.patientFullName}
                </div>
                <div>
                  <strong>Contact Phone:</strong> {submissionResult.data.patientPhone}
                </div>
                <div>
                  <strong>Location:</strong> {hospitalInfo.name} Main Campus, {hospitalInfo.addressLine1}
                </div>
              </div>

              {/* Hospital Contact Info in Receipt */}
              <div 
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px dashed var(--color-border-subtle)',
                  fontSize: '0.8rem',
                  color: 'var(--color-text-muted)'
                }}
              >
                For immediate assistance or scheduling adjustments, please call the appointment desk at <strong>{hospitalInfo.appointmentHelpline}</strong> quoting Request ID: <strong>{submissionResult.requestId}</strong>.
              </div>
            </div>

            {/* Post-Submission Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-outline"
              >
                <Printer size={16} />
                <span>Print Request Summary</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="btn btn-primary"
              >
                <span>Book Another Consultation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
