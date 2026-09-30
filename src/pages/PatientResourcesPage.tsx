import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { faqsData, hospitalInfo } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { 
  Users, 
  FileText, 
  ShieldCheck, 
  HelpCircle, 
  Clock, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  ChevronRight,
  HeartHandshake
} from 'lucide-react';

export const PatientResourcesPage: React.FC = () => {
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('All');

  const faqCategories = ['All', 'Appointments', 'Admission', 'Insurance', 'Reports', 'General'];

  const filteredFaqs = faqsData.filter((faq) => {
    return activeFaqCategory === 'All' || faq.category === activeFaqCategory;
  });

  return (
    <div>
      <SEO
        title="Patient & Visitor Resources, FAQs & Guidelines"
        description="Patient guide, admission checklists, visitor guidelines, and hospital FAQs at IndoStates Hospital."
        keywords="patient guide, visitor rules, hospital admission checklist, FAQs, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Patient & Visitor Resources' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Patient Support</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              Patient Resources & Visitor Guide
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Helpful information to guide your outpatient visit, hospital admission, visiting hours, insurance documentation, and patient rights.
            </p>
          </div>
        </div>
      </section>

      {/* Guide Blocks Grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-3" style={{ gap: '1.75rem', marginBottom: '4rem' }}>
            {/* New Patient Guide */}
            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                New Patient Information
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', flex: 1, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                First-time visitors should arrive 15 minutes before scheduled appointments to complete simple registration and open a unique hospital ID (UHID).
              </p>
              <Link to="/appointments" className="btn btn-outline btn-sm">
                <span>Book First Visit</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Admission Information */}
            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <FileText size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                Admission & Discharge
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', flex: 1, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Planned surgical and medical admissions require a doctor’s admission note, photo ID, and pre-authorization documents if claiming cashless insurance.
              </p>
              <Link to="/insurance" className="btn btn-outline btn-sm">
                <span>Insurance / TPA Desk</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Visitor Guidelines */}
            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Clock size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                Visitor Hours & Guidelines
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', flex: 1, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                General Wards: 04:30 PM – 07:00 PM daily. ICU/CCU visits are restricted strictly to 05:00 PM – 06:00 PM (1 family attendant) to protect sterile healing.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Sanitize hands at each ward entry.
              </div>
            </div>

            {/* Insurance & Billing */}
            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: '#ede9fe', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <CreditCard size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                Billing & Transparent Estimates
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', flex: 1, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                We provide itemized billing and upfront financial counseling prior to elective surgical procedures. Digital and card payment options are supported.
              </p>
              <Link to="/insurance" className="btn btn-outline btn-sm">
                <span>Cashless Procedures</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Medical Records & Reports */}
            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                Medical Records & Lab Reports
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', flex: 1, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Collect your diagnostic reports from the central Ground Floor Diagnostics counter or request digital dispatch through verified patient phone numbers.
              </p>
              <Link to="/diagnostics" className="btn btn-outline btn-sm">
                <span>Diagnostics Info</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Patient Rights & Safety */}
            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <HeartHandshake size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                Patient Rights & Responsibilities
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', flex: 1, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Every patient has the right to respectful, confidential care, complete informed consent before treatment, and clear itemized billing disclosures.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                [HOSPITAL PATIENT CHARTER TO BE CONFIRMED]
              </div>
            </div>
          </div>

          {/* Patient Rights Charter Table */}
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-xs)',
              marginBottom: '4rem'
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="badge badge-primary">Institutional Charter</span>
              <h2 style={{ fontSize: '1.5rem', marginTop: '0.35rem', color: 'var(--color-primary-dark)' }}>
                Patient Rights & Responsibilities at IndoStates Hospital
              </h2>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '2.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                  Your Rights as a Patient:
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>Right to receive considerate, respectful, and compassionate care regardless of background.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>Right to complete privacy and strict confidentiality of medical records.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>Right to know the identity and professional qualification of treating doctors.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>Right to give informed consent after being explained treatment benefits and potential risks.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                  Your Responsibilities as a Patient:
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <CheckCircle2 size={16} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>Provide accurate and complete medical history, previous medications, and known drug allergies.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <CheckCircle2 size={16} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>Follow the agreed treatment plan, clinical recommendations, and post-discharge medications.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <CheckCircle2 size={16} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>Respect hospital visiting hours, quiet zones, and smoke-free campus policies.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <CheckCircle2 size={16} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>Treat hospital healthcare professionals, nurses, and fellow patients with dignity.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Comprehensive FAQs Section */}
          <div>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <span className="badge badge-secondary">Knowledge Base</span>
              <h2 style={{ fontSize: '1.65rem', marginTop: '0.35rem', color: 'var(--color-primary-dark)' }}>
                Frequently Asked Questions
              </h2>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {faqCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFaqCategory(cat)}
                  className={`btn btn-sm ${activeFaqCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredFaqs.map((faq, idx) => (
                <div key={idx} className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <HelpCircle size={18} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{faq.question}</span>
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', paddingLeft: '1.65rem', lineHeight: 1.6 }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
