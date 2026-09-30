import React from 'react';
import { Link } from 'react-router-dom';
import { Doctor } from '../../types';
import { DoctorPhotoPlaceholder } from './DoctorPhotoPlaceholder';
import { Calendar, Clock, MapPin, Award, ChevronRight, AlertCircle, ShieldCheck } from 'lucide-react';

export const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Demo status watermark badge */}
      {doctor.isDemoPlaceholder && (
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
          <span 
            className="badge badge-neutral" 
            style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid var(--color-border-medium)' }}
          >
            Demo Profile
          </span>
        </div>
      )}

      {/* Top Banner & Photo Placeholder Header */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #f0f7ff, #e0f2fe)', 
          padding: '1.25rem', 
          borderBottom: '1px solid var(--color-border-subtle)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}
      >
        <DoctorPhotoPlaceholder
          photoUrl={doctor.profilePhoto}
          name={doctor.name}
          size="md"
          showBadge={true}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '2px', flexWrap: 'wrap' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
              {doctor.departmentName.split(' ')[0]}
            </span>
          </div>

          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-main)', marginBottom: '2px', lineHeight: 1.3 }}>
            <Link to={`/doctors/${doctor.slug}`} style={{ color: 'inherit' }}>
              {doctor.name}
            </Link>
          </h3>

          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0, fontWeight: 500 }}>
            {doctor.qualification}
          </p>
        </div>
      </div>

      {/* Card Details */}
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
        <div style={{ marginBottom: '0.85rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-dark)', marginBottom: '0.2rem' }}>
            {doctor.title}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <Award size={13} color="var(--color-secondary)" />
            <span>{doctor.experienceYears}</span>
          </div>
          {doctor.subSpecialization && (
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Sub-specialty: {doctor.subSpecialization}
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.85rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', marginBottom: '0.35rem' }}>
            <Clock size={13} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span><strong>OPD:</strong> {doctor.opdTimings}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
            <MapPin size={13} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{doctor.opdRoom}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.65rem' }}>
          <Link
            to={`/doctors/${doctor.slug}`}
            className="btn btn-outline btn-sm"
            style={{ flex: 1 }}
          >
            <span>Profile</span>
            <ChevronRight size={13} />
          </Link>
          <Link
            to={`/appointments?doctor=${doctor.id}`}
            className="btn btn-primary btn-sm"
            style={{ flex: 1.3 }}
          >
            <Calendar size={14} />
            <span>Book Visit</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
