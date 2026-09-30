import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const MedicalDisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          backgroundColor: 'var(--color-bg-muted)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.65rem 1rem',
          fontSize: '0.78rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.45
        }}
      >
        <ShieldCheck size={16} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Clinical Disclaimer:</strong> Content is published solely for patient education and does not substitute direct medical consultation, diagnosis, or personalized prescription.
        </span>
      </div>
    );
  }

  return (
    <div 
      style={{
        backgroundColor: '#f8fafc',
        borderLeft: '4px solid var(--color-primary-light)',
        borderTop: '1px solid var(--color-border-subtle)',
        borderRight: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        marginTop: '2rem',
        marginBottom: '2rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem' }}>
        <AlertTriangle size={18} color="var(--color-primary)" />
        <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--color-text-main)' }}>
          IndoStates Hospital Clinical & Educational Disclaimer
        </h4>
      </div>
      <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
        The healthcare information and educational resources made available on this website are intended solely for general awareness and should never replace qualified clinical judgment, clinical examination, or doctor advice. In the case of acute emergency symptoms, sudden chest discomfort, or injury, contact 24x7 Emergency immediately or visit your nearest hospital trauma center.
      </p>
    </div>
  );
};
