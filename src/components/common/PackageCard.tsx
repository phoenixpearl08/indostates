import React from 'react';
import { Link } from 'react-router-dom';
import { HealthPackage } from '../../types';
import { Check, Calendar, PhoneCall, Sparkles } from 'lucide-react';

export const PackageCard: React.FC<{ pkg: HealthPackage }> = ({ pkg }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {pkg.badge && (
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <Sparkles size={11} />
            <span>{pkg.badge}</span>
          </span>
        </div>
      )}

      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem', color: 'var(--color-primary-dark)', paddingRight: pkg.badge ? '5rem' : '0' }}>
          {pkg.title}
        </h3>

        <div style={{ fontSize: '0.82rem', color: 'var(--color-secondary-dark)', fontWeight: 600, marginBottom: '0.85rem' }}>
          Ideal for: {pkg.targetGroup}
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
          {pkg.shortDesc}
        </p>

        {/* Pricing Notice */}
        <div 
          style={{ 
            backgroundColor: 'var(--color-bg-muted)', 
            padding: '0.65rem 0.95rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1.25rem',
            border: '1px solid var(--color-border-subtle)'
          }}
        >
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Pricing & Inquiries
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {pkg.priceDisplay}
          </div>
        </div>

        {/* Tests Included Preview */}
        <div style={{ marginBottom: '1.5rem', flex: 1 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
            Key Diagnostics Included ({pkg.testsIncluded.length}):
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
            {pkg.testsIncluded.slice(0, 5).map((test, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                <Check size={14} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>{test}</span>
              </li>
            ))}
            {pkg.testsIncluded.length > 5 && (
              <li style={{ color: 'var(--color-primary-light)', fontSize: '0.78rem', fontWeight: 600, paddingLeft: '1.3rem' }}>
                + {pkg.testsIncluded.length - 5} additional clinical tests & physician review
              </li>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', gap: '0.65rem' }}>
          <Link
            to={`/appointments?package=${pkg.id}`}
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
          >
            <Calendar size={14} />
            <span>Book Checkup</span>
          </Link>
          <Link
            to="/contact"
            className="btn btn-outline btn-sm"
            style={{ flex: 1 }}
          >
            <PhoneCall size={14} />
            <span>Inquire</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
