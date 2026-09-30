import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SectionHeading } from '../components/common/SectionHeading';
import { SEO } from '../components/common/SEO';
import { hospitalInfo } from '../data';
import { 
  FlaskConical, 
  Activity, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  AlertCircle,
  PhoneCall,
  Search,
  ShieldCheck
} from 'lucide-react';

interface DiagnosticCategory {
  title: string;
  badge: string;
  description: string;
  commonTests: string[];
  preparation: string;
  reportingTime: string;
}

const diagnosticCategories: DiagnosticCategory[] = [
  {
    title: 'Biochemistry & Metabolic Panels',
    badge: 'Automated Pathology',
    description: 'High-throughput quantitative assessment of blood glucose, kidney function, liver enzymes, lipids, and serum electrolytes.',
    commonTests: [
      'Fasting & Post-Prandial Blood Glucose',
      'HbA1c (Glycated Hemoglobin)',
      'Complete Lipid Profile (Total, HDL, LDL, VLDL, Triglycerides)',
      'Liver Function Tests (SGOT, SGPT, Bilirubin, Protein)',
      'Renal Function Profile (Urea, Creatinine, Uric Acid)'
    ],
    preparation: '10 to 12 hours overnight fasting required for Lipid Profile and Fasting Blood Sugar.',
    reportingTime: 'Same day (within 4 to 6 hours)'
  },
  {
    title: 'Hematology & Clinical Coagulation',
    badge: 'Automated Pathology',
    description: 'Automated 5-part differential blood counts, hemoglobin evaluations, coagulation studies, and peripheral blood smears.',
    commonTests: [
      'Complete Blood Count (CBC) with Platelets & ESR',
      'Peripheral Blood Smear for Morphology',
      'Prothrombin Time (PT) & INR',
      'Blood Group & Rh Typing',
      'D-Dimer & Ferritin Markers'
    ],
    preparation: 'No mandatory fasting required for standard hemograms unless requested with metabolic panels.',
    reportingTime: 'Within 2 to 4 hours'
  },
  {
    title: 'Cardiovascular Diagnostics',
    badge: 'Non-Invasive Cardiology',
    description: 'Electrical and physiological functional assessment of myocardial performance, rhythm disturbances, and exercise tolerance.',
    commonTests: [
      '12-Lead Resting Electrocardiogram (ECG)',
      'Treadmill Stress Test (TMT / Stress ECG)',
      '2D Echocardiography with Color Doppler',
      '24-Hour Ambulatory Holter ECG Monitoring'
    ],
    preparation: 'Wear comfortable walking shoes for TMT. Avoid heavy meals 2 hours prior to stress testing.',
    reportingTime: 'ECG: Immediate | Echo & TMT: Same Day with Physician Review'
  },
  {
    title: 'Radiology & Ultrasound Imaging',
    badge: 'Imaging Services',
    description: 'High-resolution digital X-rays, abdomen and pelvic ultrasound, obstetrical scans, and vascular Doppler studies.',
    commonTests: [
      'Digital Radiography (Chest, Spine, Extremities)',
      'Ultrasound Whole Abdomen & Pelvis',
      'Obstetric Growth & Anomaly Scans',
      'Arterial & Venous Color Doppler Studies'
    ],
    preparation: 'Full urinary bladder (drinking water without urinating) required for pelvic ultrasound. 6 hours fasting for upper abdominal scans.',
    reportingTime: 'X-Ray: Within 1 hour | Ultrasound: Detailed report in 2 hours'
  }
];

export const DiagnosticsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = diagnosticCategories.filter((cat) => {
    return (
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.commonTests.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div>
      <SEO
        title="Diagnostics & Laboratory Services"
        description="Comprehensive diagnostic lab and imaging services at IndoStates Hospital. Automated biochemistry, hematology, microbiology, digital X-ray, and ultrasound."
        keywords="hospital lab, diagnostics center, blood tests, digital x-ray, ultrasound, pathology lab, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Diagnostics & Laboratory' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Precision Diagnostics</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              Laboratory Medicine & Diagnostic Imaging
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              IndoStates Hospital features automated clinical pathology analyzers, 24x7 emergency stat labs, and modern ultrasound and radiology suites adhering to strict quality controls.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Quick Timings & Report Collection Info Banner */}
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xs)',
              marginBottom: '2.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={24} color="var(--color-primary)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>Sample Collection Hours</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                  Outpatient Booth: 07:00 AM – 08:00 PM | Emergency Lab: 24×7
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={24} color="var(--color-secondary)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>Report Collection</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                  Ground Floor Diagnostics Desk (Show UHID / Bill Receipt)
                </div>
              </div>
            </div>

            <Link to="/appointments" className="btn btn-primary btn-sm">
              <Calendar size={14} />
              <span>Book Health Checkup</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', maxWidth: '480px', marginBottom: '2.5rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search diagnostic tests or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Diagnostic Categories */}
          <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
            {filtered.map((cat, idx) => (
              <div key={idx} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary">{cat.badge}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={12} />
                    <span>{cat.reportingTime}</span>
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                  {cat.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
                  {cat.description}
                </p>

                <div style={{ marginBottom: '1.25rem', flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                    Common Diagnostic Tests:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                    {cat.commonTests.map((test, tIdx) => (
                      <li key={tIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                        <CheckCircle2 size={14} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  <strong>Patient Preparation:</strong> {cat.preparation}
                </div>
              </div>
            ))}
          </div>

          {/* Future Integration Architecture Note */}
          <div style={{ marginTop: '3rem', backgroundColor: 'var(--color-bg-muted)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-subtle)' }}>
            <strong>Future Digital Integration:</strong> IndoStates Hospital website is architected for upcoming integration with direct online test booking, specimen home-collection scheduling, and secure authenticated patient report downloads.
          </div>
        </div>
      </section>
    </div>
  );
};
