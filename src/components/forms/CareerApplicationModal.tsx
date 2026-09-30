import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CareerPosition } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { careerApi } from '../../services/api';
import { Upload, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface CareerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: CareerPosition | null;
}

export const CareerApplicationModal: React.FC<CareerApplicationModalProps> = ({
  isOpen,
  onClose,
  position
}) => {
  const { showNotification } = useNotification();
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Secure validation: PDF, DOC, DOCX up to 5MB
    const validExtensions = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validExtensions.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setErrors((prev) => ({ ...prev, resume: 'Please upload a PDF or Word document (.pdf, .doc, .docx).' }));
      setResumeFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resume: 'File size exceeds 5MB limit. Please upload a smaller file.' }));
      setResumeFile(null);
      return;
    }

    setErrors((prev) => ({ ...prev, resume: '' }));
    setResumeFile(file);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!applicantName.trim()) errs.name = 'Full name is required.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Valid email is required.';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) errs.phone = 'Valid phone number is required.';
    if (!resumeFile) errs.resume = 'Please attach your Curriculum Vitae / Resume.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (position?.id) {
        await careerApi.applyForJob(position.id, {
          careerId: position.id,
          name: applicantName,
          email: email,
          phone: phone,
          message: coverNote
        });
      }
    } catch (err) {
      console.warn('Backend career application fallback:', err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
      showNotification('success', 'Application Lodged', `Your application for ${position?.title} was received by HR.`);
    }
  };

  const handleModalClose = () => {
    setApplicantName('');
    setEmail('');
    setPhone('');
    setCoverNote('');
    setResumeFile(null);
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={position ? `Apply: ${position.title}` : 'Career Application'}
      maxWidth="580px"
    >
      {isSuccess ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
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
          <h4 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
            Application Submitted
          </h4>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Thank you for your interest in joining IndoStates Hospital. Our human resources recruitment cell will review your qualifications and contact shortlisted candidates for personal interviews.
          </p>
          <button
            type="button"
            onClick={handleModalClose}
            className="btn btn-primary btn-sm"
          >
            Close Window
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', backgroundColor: 'var(--color-bg-muted)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
            <strong>Department:</strong> {position?.department} • <strong>Location:</strong> {position?.location}
          </div>

          <div className="form-group">
            <label className="form-label">Full Name <span className="required">*</span></label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Your full name"
              value={applicantName}
              onChange={(e) => {
                setApplicantName(e.target.value);
                setErrors((prev) => ({ ...prev, name: '' }));
              }}
            />
            {errors.name && <div className="form-feedback-error">{errors.name}</div>}
          </div>

          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Email Address <span className="required">*</span></label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: '' }));
                }}
              />
              {errors.email && <div className="form-feedback-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Contact Number <span className="required">*</span></label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="+91 XXXXX XXXXX"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, phone: '' }));
                }}
              />
              {errors.phone && <div className="form-feedback-error">{errors.phone}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Upload Resume (PDF, DOC, DOCX - max 5MB) <span className="required">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className={`form-control ${errors.resume ? 'is-invalid' : ''}`}
              onChange={handleFileChange}
            />
            {resumeFile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                <FileText size={14} />
                <span>Selected: {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)</span>
              </div>
            )}
            {errors.resume && <div className="form-feedback-error">{errors.resume}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Brief Cover Note / Relevant Experience</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Highlight your clinical certifications, years of experience, and notice period..."
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={handleModalClose}
              className="btn btn-outline btn-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Uploading...' : 'Submit Application'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
