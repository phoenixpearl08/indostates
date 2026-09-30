import React, { useState } from 'react';
import { ShieldAlert, PhoneCall, MapPin, X } from 'lucide-react';
import { hospitalInfo } from '../../data';

export const EmergencyFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside 
      aria-label="Quick Emergency Assistance"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '1.5rem',
        zIndex: 90
      }}
    >
      {isOpen && (
        <div 
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            border: '2px solid var(--color-emergency)',
            padding: '1.25rem',
            width: '280px',
            marginBottom: '0.75rem',
            animation: 'fadeIn 200ms ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-emergency)', fontWeight: 700, fontSize: '0.9rem' }}>
              <ShieldAlert size={18} />
              <span>Emergency Medical Desk</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              aria-label="Close emergency shortcut"
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
            Immediate clinical evaluation, emergency triage, and urgent consultation support.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a
              href={`tel:${hospitalInfo.emergencyPhone.replace(/\D/g, '') || '0000000000'}`}
              className="btn btn-emergency btn-sm btn-block"
            >
              <PhoneCall size={14} />
              <span>Call: {hospitalInfo.emergencyPhone}</span>
            </a>

            <a
              href={hospitalInfo.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm btn-block"
            >
              <MapPin size={14} />
              <span>Get Directions to ER</span>
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-emergency)',
          color: '#ffffff',
          border: '2px solid #ffffff',
          boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform var(--transition-fast)'
        }}
        aria-label="Toggle 24x7 Emergency Contact Details"
        title="24x7 Emergency Care Hotline"
      >
        <ShieldAlert size={26} />
      </button>
    </aside>
  );
};
