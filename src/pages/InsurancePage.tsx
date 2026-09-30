import React from 'react';
import { Link } from 'react-router-dom';
import { insuranceDeskData, hospitalInfo } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Mail, 
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const InsurancePage: React.FC = () => {
  return (
    <div>
      <SEO
        title="Insurance & Cashless Hospitalization Desk"
        description="Cashless hospitalisation procedures, TPA pre-authorization workflows, and claim documentation guidelines at IndoStates Hospital."
        keywords="health insurance, cashless hospitalization, TPA desk, medical claims, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Insurance & Cashless Facility' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Financial Guidance</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              Insurance & Cashless Hospitalization Desk
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {insuranceDeskData.intro}
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Institutional Compliance Notice */}
          <div className="demo-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '2px' }}>
              <AlertCircle size={16} />
              <span>Insurance Compliance Notice</span>
            </div>
            <span>{insuranceDeskData.disclaimer}</span>
          </div>

          <div className="grid grid-cols-3" style={{ gap: '2.5rem', marginBottom: '4rem' }}>
            {/* Left 2 Cols: Step-by-Step Workflows & Documents */}
            <div style={{ gridColumn: 'span 2' }}>
              {/* Planned Hospitalization Workflow */}
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">Planned Admissions</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Elective Surgeries & Treatments</span>
                </div>
                <h2 style={{ fontSize: '1.45rem', marginBottom: '1.5rem', color: 'var(--color-primary-dark)' }}>
                  Cashless Approval Workflow for Planned Hospitalization
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {insuranceDeskData.processPlanned.map((step) => (
                    <div 
                      key={step.stepNumber}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem'
                      }}
                    >
                      <div 
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-primary)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          flexShrink: 0
                        }}
                      >
                        {step.stepNumber}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                          {step.title}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Hospitalization Workflow */}
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-emergency">Emergency Admissions</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Trauma & Acute Illnesses</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', color: 'var(--color-primary-dark)' }}>
                  Cashless Approval Workflow for Emergency Admissions
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {insuranceDeskData.processEmergency.map((step) => (
                    <div 
                      key={step.stepNumber}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem'
                      }}
                    >
                      <div 
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-emergency)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          flexShrink: 0
                        }}
                      >
                        {step.stepNumber}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                          {step.title}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
                  Mandatory Documents Checklist
                </h3>
                <div 
                  style={{
                    backgroundColor: 'var(--color-bg-base)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border-subtle)',
                    padding: '1.75rem'
                  }}
                >
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {insuranceDeskData.requiredDocuments.map((doc, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                        <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Col: TPA Desk Contacts & Helpful Tips */}
            <div>
              <div 
                className="card"
                style={{ padding: '1.75rem', marginBottom: '1.75rem', position: 'sticky', top: '100px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <CreditCard size={22} color="var(--color-primary)" />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
                    TPA Helpdesk Contact
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
                  <div>
                    <strong>Desk Location:</strong>
                    <div>Ground Floor, Main Reception Lobby</div>
                  </div>
                  <div>
                    <strong>Operating Hours:</strong>
                    <div>{insuranceDeskData.tpaDeskHours}</div>
                  </div>
                  <div>
                    <strong>Direct Extension:</strong>
                    <div>{insuranceDeskData.contactExtension}</div>
                  </div>
                  <div>
                    <strong>Email:</strong>
                    <div>{insuranceDeskData.directEmail}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-bg-muted)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                  <strong>Tip for Patients:</strong> Non-medical items (e.g. registration charges, administrative packs, personal toiletries) are typically excluded by insurers and must be settled at billing.
                </div>

                <Link to="/contact" className="btn btn-outline btn-block">
                  <PhoneCall size={16} />
                  <span>Contact TPA Desk</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
