import React, { useState } from 'react';
import { facilitiesData } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { FacilityCard } from '../components/common/FacilityCard';
import { SEO } from '../components/common/SEO';
import { Building2, Search, CheckCircle2 } from 'lucide-react';

export const FacilitiesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Critical Care Infrastructure', 'Surgical Infrastructure', 'Emergency Infrastructure', 'Accommodation', 'Diagnostic Infrastructure', 'Support Infrastructure', 'Amenities'];

  const filteredFacilities = facilitiesData.filter((fac) => {
    return selectedCategory === 'all' || fac.category === selectedCategory;
  });

  return (
    <div>
      <SEO
        title="Hospital Facilities & Infrastructure"
        description="Explore the clinical and inpatient infrastructure of IndoStates Hospital, including modular operating theatres, Level-3 ICUs, emergency triage, and diagnostic facilities."
        keywords="hospital infrastructure, ICU facilities, modular OT, hospital rooms, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Hospital Facilities' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Campus Infrastructure</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              Hospital Facilities & Medical Infrastructure
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Engineered to support clinical precision and patient comfort. Explore our sterile surgical suites, critical care intensive care units, inpatient rooms, automated pathology lab, and barrier-free campus.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              >
                {cat === 'all' ? 'All Infrastructure' : cat}
              </button>
            ))}
          </div>

          {/* Facilities Grid or Empty State */}
          {filteredFacilities.length > 0 ? (
            <div className="grid grid-cols-3">
              {filteredFacilities.map((fac) => (
                <FacilityCard key={fac.id} facility={fac} />
              ))}
            </div>
          ) : (
            <div className="card card-static" style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '580px', margin: '0 auto' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Building2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>No Infrastructure Units in this Category</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Try selecting another category or view all hospital infrastructure units.
              </p>
              <button onClick={() => setSelectedCategory('all')} className="btn btn-outline btn-sm">
                View All Infrastructure
              </button>
            </div>
          )}

          {/* Consistent CTA Banner */}
          <div className="card card-static" style={{ marginTop: '4rem', padding: '2.5rem', background: 'linear-gradient(135deg, var(--color-primary-dark), #0369a1)', color: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ maxWidth: '650px' }}>
                <span className="badge badge-secondary" style={{ marginBottom: '0.75rem' }}>Clinical Care Access</span>
                <h3 style={{ color: '#ffffff', marginBottom: '0.5rem', fontSize: '1.45rem' }}>
                  Planning an Inpatient Admission or Consultation?
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Our patient care coordinators assist with room reservations, cashless insurance pre-authorizations, and doctor appointments.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="/appointments" className="btn btn-secondary">
                  Book Appointment
                </a>
                <a href="/contact" className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}>
                  Inquire With Admissions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
