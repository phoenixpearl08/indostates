import React from 'react';
import { Link } from 'react-router-dom';
import { hospitalInfo } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SectionHeading } from '../components/common/SectionHeading';
import { SEO } from '../components/common/SEO';
import { 
  Heart, 
  ShieldCheck, 
  Activity, 
  Award, 
  CheckCircle2, 
  Stethoscope, 
  Calendar, 
  Building2, 
  Users, 
  PhoneCall,
  Sparkles
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div>
      <SEO
        title="About Us — Mission, Vision & Care Model"
        description={`${hospitalInfo.name} — ${hospitalInfo.tagline}. Multi-disciplinary clinical hospital providing ethical, patient-centric care and modern medical infrastructure.`}
        keywords="about hospital, hospital mission, medical pillars, healthcare vision, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'About IndoStates Hospital' }]} />

      {/* Header Banner */}
      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Hospital Profile</span>
            <h1 style={{ marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
              About IndoStates Hospital
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {hospitalInfo.tagline} Built on foundations of clinical integrity, advanced patient safety, and compassionate care.
            </p>
          </div>
        </div>
      </section>

      {/* Institutional Mission & Vision */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="badge badge-secondary" style={{ marginBottom: '0.75rem' }}>Our Purpose</span>
              <h2 style={{ marginBottom: '1.25rem', color: 'var(--color-primary-dark)' }}>
                Committed to Patient Dignity, Clinical Excellence & Compassion
              </h2>
              <p style={{ lineHeight: 1.7, marginBottom: '1.25rem' }}>
                IndoStates Hospital was founded to provide transparent, multi-disciplinary healthcare services. Our medical institution bridges state-of-the-art diagnostic and surgical technology with warm bedside attention.
              </p>
              <p style={{ lineHeight: 1.7, color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                We believe that healing begins the moment a patient enters our doors. Every outpatient suite, surgical theatre, intensive care bed, and family waiting lounge is designed to promote calm, clarity, and rapid recovery.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/doctors" className="btn btn-primary">
                  <Stethoscope size={16} />
                  <span>Meet Our Specialists</span>
                </Link>
                <Link to="/appointments" className="btn btn-outline">
                  <Calendar size={16} />
                  <span>Book Appointment</span>
                </Link>
              </div>
            </div>

            {/* Vision & Values Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--color-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <Heart size={22} color="var(--color-primary)" />
                  <h3 style={{ margin: 0, fontSize: '1.18rem', color: 'var(--color-primary-dark)' }}>Our Vision</h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  To be the region’s most trusted healthcare destination, recognized for ethical medical practice, patient-centric clinical outcomes, and barrier-free access to advanced healthcare.
                </p>
              </div>

              <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--color-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={22} color="var(--color-secondary)" />
                  <h3 style={{ margin: 0, fontSize: '1.18rem', color: 'var(--color-secondary-dark)' }}>Our Core Values</h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  <li><strong>Compassion First:</strong> Treating every patient with empathy, dignity, and active listening.</li>
                  <li><strong>Clinical Rigor:</strong> Evidence-based diagnosis and adherence to strict medical ethics.</li>
                  <li><strong>Transparency:</strong> Clear communication regarding treatments, risks, and financial estimates.</li>
                  <li><strong>Safety & Hygiene:</strong> Stringent infection control protocols across all wards and OTs.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Pillars */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeading
            badge="Healthcare Pillars"
            title="The IndoStates Care Model"
            subtitle="Four guiding principles that shape our clinical workflows and patient experiences every day."
          />

          <div className="grid grid-cols-4">
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Stethoscope size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                Experienced Clinicians
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Multi-disciplinary senior consultants with decades of combined clinical and surgical experience in renowned medical institutions.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Building2 size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                Modern Infrastructure
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Laminar flow modular operating theatres, Level-3 ICU beds with central telemetry, and automated diagnostic laboratories.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: '#fee2e2', color: 'var(--color-emergency)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Activity size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                Emergency Preparedness
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Dedicated emergency department with clinical assessment, triage pathways, and acute resuscitation capability. [Specific service schedule to be verified by hospital].
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Users size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                Patient-Centricity
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Dedicated patient care coordinators, streamlined appointment queues, transparent billing assistance, and multilingual support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hospital Details & Campus Access */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Location & Access</span>
              <h2 style={{ marginBottom: '1.25rem', color: 'var(--color-primary-dark)' }}>
                Easy Campus Access & Patient Convenience
              </h2>
              <p style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
                IndoStates Hospital is conveniently situated to allow swift transit for ambulances and visiting patient families. The entire campus is barrier-free with gentle ramps, tactile guidance, wide corridors, and stretcher-sized elevators.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-secondary)" />
                  <span>Ample multi-bay visitor parking with designated accessible bays</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-secondary)" />
                  <span>Ground floor emergency drop-off with direct triage ramp</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-secondary)" />
                  <span>In-house pharmacy and diagnostic specimen collection</span>
                </div>
              </div>

              <Link to="/contact" className="btn btn-outline">
                <PhoneCall size={16} />
                <span>Contact Hospital Reception</span>
              </Link>
            </div>

            <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--color-bg-base)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
                Key Hospital Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <strong style={{ color: 'var(--color-text-main)' }}>Hospital Name:</strong>
                  <div style={{ color: 'var(--color-text-secondary)' }}>{hospitalInfo.name}</div>
                </div>
                <div>
                  <strong style={{ color: 'var(--color-text-main)' }}>Location:</strong>
                  <div style={{ color: 'var(--color-text-secondary)' }}>
                    {hospitalInfo.addressLine1}, {hospitalInfo.addressLine2}, {hospitalInfo.city} - {hospitalInfo.pincode}
                  </div>
                </div>
                <div>
                  <strong style={{ color: 'var(--color-text-main)' }}>OPD Consultation Hours:</strong>
                  <div style={{ color: 'var(--color-text-secondary)' }}>{hospitalInfo.opdHours}</div>
                </div>
                <div>
                  <strong style={{ color: 'var(--color-text-main)' }}>Emergency & Trauma:</strong>
                  <div style={{ color: 'var(--color-emergency)', fontWeight: 700 }}>{hospitalInfo.emergencyAvailability}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
