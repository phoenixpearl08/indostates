import React from 'react';
import { healthPackagesData, hospitalInfo } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { PackageCard } from '../components/common/PackageCard';
import { SEO } from '../components/common/SEO';
import { AlertCircle, Clock, CheckCircle2, PhoneCall } from 'lucide-react';

export const HealthPackagesPage: React.FC = () => {
  return (
    <div>
      <SEO
        title="Preventive Health Checkup Packages"
        description="Comprehensive master health checkups and preventive health packages at IndoStates Hospital. Early detection and lifestyle risk assessment."
        keywords="health packages, master health checkup, preventive screening, executive checkup, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Health Checkup Packages' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Preventive Wellness</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              Preventive Health Checkup Packages
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Early detection is the most effective safeguard against chronic cardiovascular, metabolic, and oncological ailments. Explore our tailored preventive screenings designed for men, women, executives, and senior citizens.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Institutional Pricing & Fasting Advice Banner */}
          <div className="demo-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '2px' }}>
              <AlertCircle size={16} />
              <span>Pricing Notice & Booking Instructions</span>
            </div>
            <span>
              Package prices shown are indicative placeholders for prototype evaluation. Please contact the preventive health desk at <strong>{hospitalInfo.appointmentHelpline}</strong> to confirm current institutional rates and scheduled arrival guidelines.
            </span>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-3" style={{ marginBottom: '3.5rem' }}>
            {healthPackagesData.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          {/* General Preparation Guidelines */}
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
              Guidelines for Your Health Checkup Visit
            </h3>

            <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Fasting:</strong> Maintain 10 to 12 hours of overnight fasting prior to your appointment. Plain water is permitted.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Morning Medications:</strong> Consult your doctor regarding whether to withhold morning blood pressure or diabetes medication until after fasting blood draws.</span>
                </li>
              </ul>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Comfortable Footwear:</strong> Wear comfortable walking shoes and light cotton apparel if undergoing a Treadmill Stress Test (TMT).</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Past Medical Dossier:</strong> Bring all recent blood reports, imaging scans, and current prescriptions for the physician review.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
