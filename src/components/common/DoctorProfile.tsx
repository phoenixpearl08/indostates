import React from 'react';
import { Link } from 'react-router-dom';
import { Doctor } from '../../types';
import { DoctorPhotoPlaceholder } from './DoctorPhotoPlaceholder';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Award, 
  GraduationCap, 
  CheckCircle2, 
  Languages, 
  AlertCircle, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

export const DoctorProfile: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  return (
    <div>
      {/* Demo Profile Notice Banner */}
      {doctor.isDemoPlaceholder && (
        <div className="demo-banner" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '2px' }}>
            <AlertCircle size={16} />
            <span>Prototype Demonstration Doctor Profile</span>
          </div>
          <span>
            This profile is an architectural demonstration placeholder. All consultant names, qualifications, consultation timings, and medical registrations are subject to official verification and institutional authorization by IndoStates Hospital management before public production launch.
          </span>
        </div>
      )}

      {/* Doctor Header Profile Card */}
      <div 
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, #ffffff, #f0f7ff)',
          border: '1px solid var(--color-border-medium)'
        }}
      >
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Photo / Placeholder */}
          <DoctorPhotoPlaceholder
            photoUrl={doctor.profilePhoto}
            name={doctor.name}
            size="lg"
            showBadge={true}
          />

          {/* Core Credentials */}
          <div style={{ flex: '1 1 360px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">{doctor.departmentName}</span>
              <span className="badge badge-secondary">{doctor.experienceYears}</span>
              {doctor.isDemoPlaceholder && (
                <span className="badge badge-neutral">Demo Registry</span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.3rem)', color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
              {doctor.name}
            </h1>

            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
              {doctor.title}
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              {doctor.qualification}
            </div>

            {doctor.subSpecialization && (
              <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-dark)', fontWeight: 500 }}>
                Special Focus: {doctor.subSpecialization}
              </div>
            )}
          </div>

          {/* Quick Consultation CTA */}
          <div>
            <Link to={`/appointments?doctor=${doctor.id}`} className="btn btn-primary btn-lg">
              <Calendar size={18} />
              <span>Book Consultation</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-3" style={{ gap: '2.5rem' }}>
        {/* Left 2 Cols: Biography, Expertise, Detailed Profile, Education */}
        <div style={{ gridColumn: 'span 2' }}>
          {/* Short Biography */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
              Clinical Biography & Overview
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
              {doctor.about}
            </p>
          </div>

          {/* Detailed Profile */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
              Detailed Professional Profile
            </h3>
            <div 
              style={{ 
                backgroundColor: '#ffffff', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--color-border-subtle)', 
                padding: '1.5rem',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)'
              }}
            >
              {doctor.detailedProfile}
            </div>
          </div>

          {/* Areas of Expertise */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
              Areas of Clinical Expertise
            </h3>
            <div 
              style={{ 
                backgroundColor: '#ffffff', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--color-border-subtle)', 
                padding: '1.5rem' 
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                {doctor.areasOfExpertise.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ fontSize: '0.88rem', color: 'var(--color-text-main)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education & Fellowships */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
              Medical Education & Credentials
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {doctor.education.map((edu, idx) => (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: 'var(--color-bg-base)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <GraduationCap size={18} color="var(--color-primary-light)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', fontWeight: 500 }}>{edu}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Consultation Schedule Card */}
        <div>
          <div 
            className="card"
            style={{ padding: '1.75rem', position: 'sticky', top: '100px' }}
          >
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--color-primary-dark)' }}>
              Consultation Schedule
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                  <Clock size={15} color="var(--color-primary-light)" />
                  <span style={{ fontWeight: 600 }}>OPD Timings</span>
                </div>
                <div style={{ color: 'var(--color-text-main)', fontWeight: 600, paddingLeft: '1.5rem', lineHeight: 1.4 }}>
                  {doctor.opdTimings}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                  <MapPin size={15} color="var(--color-primary-light)" />
                  <span style={{ fontWeight: 600 }}>OPD Location</span>
                </div>
                <div style={{ color: 'var(--color-text-main)', paddingLeft: '1.5rem' }}>
                  {doctor.opdRoom}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                  <Calendar size={15} color="var(--color-primary-light)" />
                  <span style={{ fontWeight: 600 }}>Availability Status</span>
                </div>
                <div style={{ color: 'var(--color-text-main)', paddingLeft: '1.5rem' }}>
                  {doctor.appointmentAvailability}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                  <Languages size={15} color="var(--color-primary-light)" />
                  <span style={{ fontWeight: 600 }}>Languages</span>
                </div>
                <div style={{ color: 'var(--color-text-main)', paddingLeft: '1.5rem' }}>
                  {doctor.languages.join(', ')}
                </div>
              </div>
            </div>

            <Link
              to={`/appointments?doctor=${doctor.id}`}
              className="btn btn-primary btn-block"
              style={{ marginBottom: '0.75rem' }}
            >
              <Calendar size={16} />
              <span>Book Consultation Slot</span>
            </Link>

            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
              Consultation slots are verified by the appointment desk before confirmation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
