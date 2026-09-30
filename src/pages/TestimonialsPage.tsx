import React from 'react';
import { Link } from 'react-router-dom';
import { testimonialsData } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { Heart, Star, AlertCircle, Calendar, MessageSquare } from 'lucide-react';

export const TestimonialsPage: React.FC = () => {
  return (
    <div>
      <SEO
        title="Patient Experiences & Testimonials"
        description="Patient reflections, care recovery stories, and feedback from families treated at IndoStates Hospital."
        keywords="patient testimonials, patient stories, healthcare experiences, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Patient Testimonials' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Patient Voice</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              Patient Experiences & Healing Stories
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Reflections from individuals and families who placed their trust in IndoStates Hospital during surgical recoveries, cardiac emergencies, and outpatient consultations.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Institutional Testimonials Notice */}
          <div className="demo-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '2px' }}>
              <AlertCircle size={16} />
              <span>Simulated Patient Testimonial Placeholders</span>
            </div>
            <span>
              The testimonials presented below are demonstration placeholders for web architecture evaluation. Official patient testimonials will be published upon verified institutional consent and patient privacy authorizations.
            </span>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '2rem', marginBottom: '3.5rem' }}>
            {testimonialsData.map((test) => (
              <div key={test.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--color-warning)', fontSize: '1.1rem' }}>
                    {'★'.repeat(test.rating)}
                  </div>
                  <span className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>
                    {test.departmentName.split(' ')[0]} Care
                  </span>
                </div>

                <blockquote style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, flex: 1, marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  "{test.feedback}"
                </blockquote>

                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                      {test.patientName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {test.treatmentType} • {test.location}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    {test.date}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback CTA */}
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              padding: '2.5rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              Have You Received Care at IndoStates Hospital?
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '560px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem' }}>
              Your feedback helps our clinical and nursing teams continually refine hospital workflows, communication, and patient experience.
            </p>
            <Link to="/contact" className="btn btn-outline">
              <MessageSquare size={16} />
              <span>Share Patient Feedback</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
