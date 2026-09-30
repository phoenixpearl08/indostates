import React, { useState } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { hospitalInfo } from '../data';
import { useNotification } from '../context/NotificationContext';
import { 
  Globe, 
  Plane, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  PhoneCall, 
  Mail, 
  Send, 
  Hotel, 
  Languages, 
  ShieldCheck 
} from 'lucide-react';

export const InternationalPatientsPage: React.FC = () => {
  const { showNotification } = useNotification();
  const [patientName, setPatientName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [medicalQuery, setMedicalQuery] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !country.trim() || !email.trim()) return;

    setIsSubmitted(true);
    showNotification('success', 'International Inquiry Received', 'Our International Patient Care Cell will contact you with medical opinion details.');
  };

  return (
    <div>
      <SEO
        title="International Patients Services & Medical Travel"
        description="Comprehensive care support for overseas patients traveling to IndoStates Hospital. Visa assistance letters, language interpretation, airport transfers, and concierge desk."
        keywords="international patients, medical tourism, medical travel, overseas patient care, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'International Patients Care' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Global Healthcare</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              International Patient Services & Medical Travel
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              IndoStates Hospital welcomes cross-border visitors seeking high-quality clinical expertise, minimally invasive surgery, and comprehensive health evaluations with dedicated international liaison support.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Institutional Advisory */}
          <div className="demo-banner">
            <strong>International Coordination Note:</strong> Service offerings, medical visa assistance letters, and travel coordination are configured in accordance with national healthcare regulatory frameworks. Please verify travel guidelines prior to departure.
          </div>

          {/* Key Services for International Visitors */}
          <div className="grid grid-cols-4" style={{ gap: '1.5rem', marginBottom: '3.5rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <FileText size={24} color="var(--color-primary)" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
                Pre-Travel Medical Opinion
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                Share your existing medical scans for clinical review and preliminary cost/length-of-stay estimates.
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <Plane size={24} color="var(--color-secondary)" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
                Medical Visa Assistance
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                Issuance of official institutional invitation letters required for Indian Medical Visa applications.
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <Hotel size={24} color="#b45309" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
                Airport & Stay Coordination
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                Dedicated arrival pick-up coordination and guidance on nearby guest accommodations for family attendants.
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <Languages size={24} color="#6d28d9" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
                Language & Liaison Desk
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                Dedicated multilingual patient coordinators guiding registration, consultations, and currency exchange.
              </p>
            </div>
          </div>

          {/* Inquiry Form & Process */}
          <div className="grid grid-cols-2" style={{ gap: '3rem', alignItems: 'flex-start' }}>
            {/* Process Steps */}
            <div>
              <span className="badge badge-secondary" style={{ marginBottom: '0.75rem' }}>Step-by-Step</span>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem', color: 'var(--color-primary-dark)' }}>
                How to Plan Your Medical Travel to IndoStates
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    1
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>
                      Submit Medical Dossier & Inquiry
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                      Fill out the inquiry form or email diagnostic summaries and recent imaging reports to our international desk.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    2
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>
                      Physician Review & Clinical Plan
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                      Our senior consultant reviews your medical history, drafts a recommended clinical pathway, and provides indicative timelines.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    3
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>
                      Visa Processing & Travel Coordination
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                      We issue your institutional Medical Visa invitation letter and assist with arrival reception scheduling.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                International Patient Inquiry
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                Submit your query to receive personalized medical assistance and scheduling guidance.
              </p>

              {isSubmitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <CheckCircle2 size={40} color="var(--color-success)" style={{ margin: '0 auto 0.75rem auto' }} />
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                    Inquiry Received
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                    Our International Patient Relations Officer will email you within 24 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. John Doe"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="form-group">
                      <label className="form-label">Country of Residence <span className="required">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Kenya, UAE, UK"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address <span className="required">*</span></label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">WhatsApp / Contact Telephone</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+Country Code and Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Medical Condition / Treatment Required</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      placeholder="Describe primary diagnosis or procedure requested..."
                      value={medicalQuery}
                      onChange={(e) => setMedicalQuery(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">
                    <Send size={15} />
                    <span>Send International Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
