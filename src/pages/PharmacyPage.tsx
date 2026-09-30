import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { hospitalInfo } from '../data';
import { 
  Building2, 
  Clock, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  Thermometer, 
  FileText, 
  AlertCircle 
} from 'lucide-react';

export const PharmacyPage: React.FC = () => {
  return (
    <div>
      <SEO
        title="In-House Hospital Pharmacy"
        description="In-house licensed pharmacy at IndoStates Hospital. Genuine medications, temperature-controlled drug storage, surgical consumables, and expert pharmacist counseling."
        keywords="hospital pharmacy, 24x7 chemist, genuine medicines, prescription pharmacy, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Hospital Pharmacy' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Pharmaceutical Services</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              In-House Hospital Pharmacy & Medication Dispensation
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Providing genuine, temperature-controlled pharmaceuticals, surgical consumables, and prescribed medications directly managed by licensed hospital pharmacists. [Operating schedule to be confirmed by hospital].
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-3" style={{ gap: '2.5rem', marginBottom: '3.5rem' }}>
            {/* Left 2 Cols: Services & Standards */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.45rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
                  Comprehensive Pharmacy Services
                </h2>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                  The IndoStates Hospital Pharmacy is integrated with outpatient consulting rooms and inpatient wards, ensuring timely access to prescribed therapies without needing to leave the campus.
                </p>
              </div>

              {/* Service Capabilities */}
              <div className="grid grid-cols-2" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <ShieldCheck size={22} color="var(--color-primary)" style={{ marginBottom: '0.5rem' }} />
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                    100% Genuine Procurement
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                    Sourced directly from authorized manufacturers and certified distributors with strict batch traceability.
                  </p>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                  <Thermometer size={22} color="var(--color-secondary)" style={{ marginBottom: '0.5rem' }} />
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                    Monitored Cold Chain
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                    Calibrated 2°C to 8°C pharmaceutical refrigerators with power backup for insulins, vaccines, and biologics.
                  </p>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                  <Clock size={22} color="var(--color-emergency)" style={{ marginBottom: '0.5rem' }} />
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                    Emergency Ampoules & Consumables
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                    Critical resuscitation injections, surgical dressings, sutures, and orthopedic aids readily available 24x7.
                  </p>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                  <FileText size={22} color="var(--color-primary-light)" style={{ marginBottom: '0.5rem' }} />
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                    Pharmacist Counseling
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                    Qualified registered pharmacists explaining dosage frequency, administration timing, and precautions.
                  </p>
                </div>
              </div>

              {/* Prescription Requirements Notice */}
              <div 
                style={{
                  backgroundColor: 'var(--color-bg-base)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem'
                }}
              >
                <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <AlertCircle size={18} color="var(--color-primary)" />
                  <span>Prescription Dispensing Policy</span>
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  In accordance with the Drugs and Cosmetics Act and statutory medical regulations, scheduled antibiotics, cardiovascular drugs, and prescription medications are dispensed strictly against a valid, signed doctor’s prescription.
                </p>
              </div>
            </div>

            {/* Right Col: Location & Contact */}
            <div>
              <div 
                className="card"
                style={{ padding: '1.75rem', position: 'sticky', top: '100px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <Building2 size={22} color="var(--color-primary)" />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
                    Pharmacy Details
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                  <div>
                    <strong>Location:</strong>
                    <div>Ground Floor, Main Entrance Atrium (Facing OPD Lobby)</div>
                  </div>
                  <div>
                    <strong>Timings:</strong>
                    <div style={{ color: 'var(--color-success)', fontWeight: 700 }}>Open 24 Hours / 365 Days</div>
                  </div>
                  <div>
                    <strong>Internal Extension:</strong>
                    <div>Ext. 104 / 105</div>
                  </div>
                  <div>
                    <strong>Inquiries:</strong>
                    <div>{hospitalInfo.generalPhone}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-bg-muted)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                  <strong>Digital Ordering Ready:</strong> IndoStates Hospital frontend is designed to support upcoming digital prescription upload and patient pharmacy refills.
                </div>

                <Link to="/contact" className="btn btn-outline btn-block">
                  <PhoneCall size={16} />
                  <span>Pharmacy Counter Inquiry</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
