import React from 'react';
import { Link } from 'react-router-dom';
import { hospitalInfo } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  HeartHandshake,
  Activity,
  Ambulance
} from 'lucide-react';

export const EmergencyPage: React.FC = () => {
  return (
    <div>
      <SEO
        title="Emergency & Trauma Care Desk"
        description={`Emergency medical response, trauma stabilization, and ambulance helpline: ${hospitalInfo.emergencyPhone}. IndoStates Hospital emergency department.`}
        keywords="emergency hospital, ambulance helpline, trauma care, acute clinical care, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Emergency & Trauma Care' }]} />

      {/* High Visibility Emergency Hero Banner */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%)',
          color: '#ffffff',
          padding: '4rem 0'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 700 }}>
              <ShieldAlert size={16} />
              <span>EMERGENCY & TRAUMA CARE DESK</span>
            </div>

            <h1 style={{ color: '#ffffff', marginBottom: '1rem', lineHeight: 1.15 }}>
              Emergency Medical Care & Acute Clinical Triage
            </h1>

            <p style={{ color: '#fecaca', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              For acute medical conditions, sudden chest pain, stroke symptoms, respiratory distress, or traumatic injuries, our emergency facility coordinates clinical resuscitation and specialist intervention.
            </p>

            {/* Direct Action Emergency Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a 
                href={`tel:${hospitalInfo.emergencyPhone.replace(/\D/g, '') || '0000000000'}`}
                className="btn btn-emergency btn-lg"
                style={{ backgroundColor: '#ffffff', color: '#b91c1c', borderColor: '#ffffff', boxShadow: 'var(--shadow-lg)' }}
              >
                <PhoneCall size={20} color="#b91c1c" />
                <span>Call Emergency: {hospitalInfo.emergencyPhone}</span>
              </a>

              <a
                href={hospitalInfo.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg"
                style={{ color: '#ffffff', borderColor: '#ffffff' }}
              >
                <MapPin size={18} />
                <span>Get Driving Directions</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Emergency Helplines & Location Box */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-3" style={{ gap: '2rem', marginBottom: '3.5rem' }}>
            {/* Box 1: Emergency Helplines */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-emergency)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-emergency-subtle)', color: 'var(--color-emergency)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <PhoneCall size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
                Emergency Contact Desks
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>24x7 Emergency Line</div>
                  <strong style={{ color: 'var(--color-emergency)', fontSize: '1.1rem' }}>{hospitalInfo.emergencyPhone}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Mobile ICU Ambulance</div>
                  <strong style={{ color: 'var(--color-primary-dark)', fontSize: '1.05rem' }}>{hospitalInfo.ambulancePhone}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>General Hospital Exchange</div>
                  <span>{hospitalInfo.generalPhone}</span>
                </div>
              </div>
            </div>

            {/* Box 2: Physical Location */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-primary)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <MapPin size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
                Emergency Bay Location
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Ground Floor, Dedicated East Gate Entry with covered vehicular drop-off and gentle stretcher ramps.
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
                {hospitalInfo.addressLine1},<br />
                {hospitalInfo.addressLine2},<br />
                {hospitalInfo.city} - {hospitalInfo.pincode}
              </div>
            </div>

            {/* Box 3: Immediate Capabilities */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-secondary)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Activity size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
                Trauma Capabilities
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={15} color="var(--color-secondary)" />
                  <span>Resuscitation bays with crash carts</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={15} color="var(--color-secondary)" />
                  <span>Acute Coronary Cath Lab protocol</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={15} color="var(--color-secondary)" />
                  <span>Rapid Acute Stroke Thrombolysis</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={15} color="var(--color-secondary)" />
                  <span>Poly-trauma stabilization team</span>
                </li>
              </ul>
            </div>
          </div>

          {/* What to Do in an Emergency Guidelines */}
          <div className="grid grid-cols-2" style={{ gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="badge badge-emergency" style={{ marginBottom: '0.75rem' }}>Emergency Guidance</span>
              <h2 style={{ marginBottom: '1.25rem', color: 'var(--color-primary-dark)' }}>
                Important Steps During a Medical Emergency
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    1
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                      Call Emergency Response Immediately
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                      Do not wait for symptoms to resolve on their own. Dial our emergency hotline or request an Advanced Life Support ambulance.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    2
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                      Keep the Patient Calm and Seated / Lying Down
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                      Loosen tight clothing around the neck and chest. If chest pain or breathlessness is present, keep the patient in an upright supported sitting posture.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    3
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                      Do Not Administer Unverified Home Remedies or Oral Fluids
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                      Avoid giving water, food, or unprescribed pills to an unconscious or drowsy patient to prevent choking or aspiration.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    4
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                      Bring Past Medical Records & Medications
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.55 }}>
                      If possible, bring recent ECGs, discharge summaries, ongoing prescriptions, and insurance cards to facilitate prompt treatment decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Crucial Hospital Instructions Note */}
            <div 
              style={{
                backgroundColor: 'var(--color-bg-base)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <AlertTriangle size={20} color="var(--color-emergency)" />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-emergency)', margin: 0 }}>
                  Hospital Emergency Instructions
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p style={{ margin: 0 }}>
                  <strong>Zero Waiting for Triage:</strong> IndoStates Hospital follows an internationally structured triage system. Patients arriving with critical airway, breathing, circulation, or cardiac compromise are moved directly to resuscitation bays ahead of administrative paperwork.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Consent & Emergency Stabilization:</strong> In life-threatening emergencies, immediate life-saving stabilization is initiated immediately by our emergency physicians in accordance with medical ethics and national healthcare guidelines.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Attendant Access:</strong> To prevent overcrowding and infection in resuscitation bays, one family member is accommodated at a time while patient evaluations are in progress.
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                <a
                  href={`tel:${hospitalInfo.emergencyPhone.replace(/\D/g, '') || '0000000000'}`}
                  className="btn btn-emergency btn-block"
                >
                  <PhoneCall size={16} />
                  <span>Call Emergency Helpline Directly</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
