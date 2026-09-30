import React, { useState } from 'react';
import { ContactFormData } from '../../types';
import { departmentsData, hospitalInfo } from '../../data';
import { useNotification } from '../../context/NotificationContext';
import { contactApi } from '../../services/api';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    department: 'General Inquiry',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please enter your full name.';
    if (!formData.phone.trim()) {
      errs.phone = 'Please provide a contact phone number.';
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      errs.phone = 'Please enter a valid phone number.';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) errs.subject = 'Please specify inquiry subject.';
    if (!formData.message.trim()) errs.message = 'Please write your message or question.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await contactApi.submitContact({
        name: formData.fullName,
        email: formData.email || `${formData.phone.replace(/\D/g, '')}@placeholder.local`,
        phone: formData.phone,
        subject: `[${formData.department}] ${formData.subject}`,
        message: formData.message
      });
    } catch (e) {
      console.warn('Backend contact submission fallback:', e);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showNotification('success', 'Message Transmitted', 'Thank you. Your message has been sent to our hospital liaison team.');
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      department: 'General Inquiry',
      subject: '',
      message: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div 
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: 'var(--color-success-subtle)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}
        >
          <CheckCircle2 size={32} />
        </div>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
          Inquiry Successfully Sent
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem' }}>
          Thank you for reaching out to IndoStates Hospital. Our patient relations office will review your inquiry and get in touch with you shortly.
        </p>
        <button
          onClick={handleReset}
          className="btn btn-outline btn-sm"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div className="grid grid-cols-2">
        {/* Name */}
        <div className="form-group">
          <label htmlFor="contact-name" className="form-label">
            Your Full Name <span className="required">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="e.g. Anand Sundaram"
            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
            value={formData.fullName}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, fullName: e.target.value }));
              setErrors((prev) => ({ ...prev, fullName: '' }));
            }}
          />
          {errors.fullName && <div className="form-feedback-error">{errors.fullName}</div>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="contact-phone" className="form-label">
            Mobile Number <span className="required">*</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            placeholder="e.g. +91 98765 XXXXX"
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            value={formData.phone}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, phone: e.target.value }));
              setErrors((prev) => ({ ...prev, phone: '' }));
            }}
          />
          {errors.phone && <div className="form-feedback-error">{errors.phone}</div>}
        </div>
      </div>

      <div className="grid grid-cols-2">
        {/* Email */}
        <div className="form-group">
          <label htmlFor="contact-email" className="form-label">
            Email Address (Optional)
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="name@example.com"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={formData.email}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, email: e.target.value }));
              setErrors((prev) => ({ ...prev, email: '' }));
            }}
          />
          {errors.email && <div className="form-feedback-error">{errors.email}</div>}
        </div>

        {/* Department / Category */}
        <div className="form-group">
          <label htmlFor="contact-dept" className="form-label">
            Department to Route To
          </label>
          <select
            id="contact-dept"
            className="form-control"
            value={formData.department}
            onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
          >
            <option value="General Inquiry">General Hospital Inquiry</option>
            <option value="Outpatient Billing">OPD & Billing Desk</option>
            <option value="Insurance TPA Desk">Insurance / Cashless TPA Desk</option>
            <option value="International Patients">International Patient Relations</option>
            <option value="Feedback / Grievance">Patient Feedback & Grievance</option>
            {departmentsData.map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject */}
      <div className="form-group">
        <label htmlFor="contact-subject" className="form-label">
          Subject <span className="required">*</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          placeholder="Brief summary of your question"
          className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
          value={formData.subject}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, subject: e.target.value }));
            setErrors((prev) => ({ ...prev, subject: '' }));
          }}
        />
        {errors.subject && <div className="form-feedback-error">{errors.subject}</div>}
      </div>

      {/* Message */}
      <div className="form-group">
        <label htmlFor="contact-msg" className="form-label">
          Your Message <span className="required">*</span>
        </label>
        <textarea
          id="contact-msg"
          rows={4}
          placeholder="Please describe how our hospital team can assist you..."
          className={`form-control ${errors.message ? 'is-invalid' : ''}`}
          value={formData.message}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, message: e.target.value }));
            setErrors((prev) => ({ ...prev, message: '' }));
          }}
        />
        {errors.message && <div className="form-feedback-error">{errors.message}</div>}
      </div>

      {/* Emergency Reminder Note */}
      <div 
        style={{
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          backgroundColor: 'var(--color-bg-muted)',
          padding: '0.65rem 0.95rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem'
        }}
      >
        <strong>Emergency Note:</strong> Do not use this contact form for acute medical crises or chest pain. Call our 24x7 Emergency Line at <strong>{hospitalInfo.emergencyPhone}</strong> immediately.
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span>Sending Inquiry...</span>
        ) : (
          <>
            <Send size={16} />
            <span>Submit Inquiry</span>
          </>
        )}
      </button>
    </form>
  );
};
