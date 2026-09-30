import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { legalData } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { ShieldAlert, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const pathKey = location.pathname.replace('/', '') || 'privacy';
  const section = legalData[pathKey] || legalData['privacy'];

  return (
    <div>
      <SEO
        title={`${section.title} — Governance & Compliance`}
        description={`IndoStates Hospital ${section.title}. Institutional healthcare governance, compliance, and patient disclosures.`}
        keywords={`hospital ${section.title}, medical legal, compliance, IndoStates Hospital`}
      />
      <Breadcrumb items={[{ label: section.title }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Governance & Compliance</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              {section.title}
            </h1>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Effective Date: {section.lastUpdated} • IndoStates Hospital Institutional Governance
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '840px' }}>
          {/* Institutional Legal Notice */}
          <div className="demo-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '2px' }}>
              <AlertTriangle size={16} />
              <span>Institutional Legal Verification Notice</span>
            </div>
            <span>{section.reviewNotice}</span>
          </div>

          {/* Quick Legal Switcher Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '1rem' }}>
            {[
              { path: '/privacy', label: 'Privacy Policy' },
              { path: '/terms', label: 'Terms & Conditions' },
              { path: '/cookies', label: 'Cookie Policy' },
              { path: '/medical-disclaimer', label: 'Medical Disclaimer' },
              { path: '/accessibility', label: 'Accessibility Statement' }
            ].map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`btn btn-sm ${location.pathname === tab.path ? 'btn-primary' : 'btn-ghost'}`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Legal Document Paragraphs */}
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            {section.paragraphs.map((p, idx) => (
              <div key={idx} style={{ marginBottom: '2rem' }}>
                {p.heading && (
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
                    {p.heading}
                  </h3>
                )}
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
