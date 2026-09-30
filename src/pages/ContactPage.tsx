import React from 'react';
import { hospitalInfo, departmentsData } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ContactForm } from '../components/forms/ContactForm';
import { SEO } from '../components/common/SEO';
import { 
  MapPin, 
  PhoneCall, 
  Mail, 
  Clock, 
  ShieldAlert, 
  ExternalLink, 
  Building2,
  Calendar
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div>
      <SEO
        title="Contact Us & Campus Directions"
        description={`Contact IndoStates Hospital administration, emergency desk (${hospitalInfo.emergencyPhone}), appointments (${hospitalInfo.appointmentHelpline}), and location directions.`}
        keywords="contact hospital, hospital phone, emergency phone, hospital address, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Contact Us & Location' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Hospital Helpdesk</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              Contact IndoStates Hospital & Campus Directions
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Our patient relations officers, appointment coordinators, and emergency staff are available to assist you.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-3" style={{ gap: '3rem', marginBottom: '4rem' }}>
            {/* Left 1 Col: Institutional Contact Details */}
            <div>
              <div 
                className="card"
                style={{ padding: '2rem', height: '100%' }}
              >
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem' }}>
                  Hospital Information
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9rem' }}>
                  {/* Address */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <MapPin size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: 'var(--color-text-main)' }}>Campus Address:</strong>
                      <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: 1.5 }}>
                        {hospitalInfo.name}<br />
                        {hospitalInfo.addressLine1},<br />
                        {hospitalInfo.addressLine2},<br />
                        {hospitalInfo.city} - {hospitalInfo.pincode}, {hospitalInfo.country}
                      </div>
                    </div>
                  </div>

                  {/* 24x7 Emergency */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <ShieldAlert size={20} color="var(--color-emergency)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: 'var(--color-emergency)' }}>24×7 Emergency Desk:</strong>
                      <div style={{ color: 'var(--color-emergency)', fontWeight: 700, marginTop: '2px' }}>
                        <a 
                          href={`tel:${hospitalInfo.emergencyPhone.replace(/\D/g, '') || '0000000000'}`}
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          {hospitalInfo.emergencyPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* General Exchange */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <PhoneCall size={20} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: 'var(--color-text-main)' }}>Hospital Board / Reception:</strong>
                      <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        <a 
                          href={`tel:${hospitalInfo.generalPhone.replace(/\D/g, '') || '0000000000'}`}
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          {hospitalInfo.generalPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Appointments Helpline */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <Calendar size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: 'var(--color-text-main)' }}>Appointment Desk:</strong>
                      <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        <a 
                          href={`tel:${hospitalInfo.appointmentHelpline.replace(/\D/g, '') || '0000000000'}`}
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          {hospitalInfo.appointmentHelpline}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <Mail size={20} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: 'var(--color-text-main)' }}>Official Email:</strong>
                      <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        <a 
                          href={`mailto:${hospitalInfo.email}`}
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          {hospitalInfo.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Timings */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <Clock size={20} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: 'var(--color-text-main)' }}>OPD Timings:</strong>
                      <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: 1.5 }}>
                        {hospitalInfo.opdHours}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.25rem' }}>
                  <a
                    href={hospitalInfo.googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-block btn-sm"
                  >
                    <MapPin size={15} />
                    <span>Open in Google Maps</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right 2 Cols: Interactive Contact Form */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <span className="badge badge-secondary">Direct Messaging</span>
                <h2 style={{ fontSize: '1.5rem', marginTop: '0.35rem', color: 'var(--color-primary-dark)' }}>
                  Send an Inquiry to Hospital Administration
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Have questions about medical departments, visiting rules, billing, or feedback? Submit your query below.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>

          {/* Location Map Placeholder / Navigation Guide */}
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-primary">Campus Navigation</span>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', margin: '0.35rem 0 0 0' }}>
                  Visiting IndoStates Hospital Campus
                </h3>
              </div>

              <a
                href={hospitalInfo.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                <MapPin size={15} />
                <span>Get Turn-by-Turn Directions</span>
                <ExternalLink size={13} />
              </a>
            </div>

            <div 
              style={{
                height: '240px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-base)',
                border: '1px solid var(--color-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)',
                textAlign: 'center',
                padding: '1.5rem'
              }}
            >
              <MapPin size={38} color="var(--color-primary-light)" style={{ marginBottom: '0.75rem' }} />
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                {hospitalInfo.name} Interactive Campus Location Map
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 0 1rem 0' }}>
                {hospitalInfo.addressLine1}, {hospitalInfo.addressLine2}, {hospitalInfo.city} - {hospitalInfo.pincode}
              </p>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Coordinates configured for verified Google Business & GPS mapping integration.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
