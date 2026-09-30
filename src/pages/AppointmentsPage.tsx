import React from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { AppointmentWizard } from '../components/forms/AppointmentWizard';
import { hospitalInfo } from '../data';
import { SEO } from '../components/common/SEO';
import { Clock, PhoneCall, Calendar, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  return (
    <div>
      <SEO
        title="Book an Appointment — Outpatient Consultation Request"
        description={`Schedule an outpatient consultation with clinical specialists at IndoStates Hospital. Appointment Helpline: ${hospitalInfo.appointmentHelpline}.`}
        keywords="hospital appointment, book doctor online, OPD consultation, IndoStates Hospital appointment"
      />
      <Breadcrumb items={[{ label: 'Book an Appointment' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Outpatient Consultation</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              Request an Outpatient Doctor Appointment
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Schedule a consultation with our experienced clinical specialists. Choose your preferred specialty, doctor, and date in three simple steps.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Main Appointment Wizard Component */}
          <AppointmentWizard />

          {/* Supportive Information Section */}
          <div style={{ maxWidth: '820px', margin: '3.5rem auto 0 auto' }}>
            <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <Clock size={20} color="var(--color-primary)" style={{ marginBottom: '0.5rem' }} />
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                  OPD Timings
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Monday – Saturday: 08:00 AM – 08:00 PM. Emergency medical admissions accepted 24x7.
                </p>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <FileText size={20} color="var(--color-secondary)" style={{ marginBottom: '0.5rem' }} />
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                  What to Bring
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Government photo ID, current medication list, prior test records, and insurance card if applicable.
                </p>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <PhoneCall size={20} color="var(--color-primary-light)" style={{ marginBottom: '0.5rem' }} />
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                  Appointment Desk
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Prefer scheduling by phone? Call our appointment team directly at <strong>{hospitalInfo.appointmentHelpline}</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
