import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { careersData } from '../data';
import { CareerPosition } from '../types';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { CareerApplicationModal } from '../components/forms/CareerApplicationModal';
import { SEO } from '../components/common/SEO';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  HeartHandshake, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CareersPage: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState<CareerPosition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyClick = (pos: CareerPosition) => {
    setSelectedPosition(pos);
    setIsModalOpen(true);
  };

  return (
    <div>
      <SEO
        title="Careers & Medical Job Opportunities"
        description="Join the clinical and healthcare administrative team at IndoStates Hospital. Current openings for consultants, nursing staff, technicians, and administration."
        keywords="hospital jobs, medical careers, nursing vacancies, consultant doctor openings, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Careers at IndoStates' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Join Our Team</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              Careers at IndoStates Hospital
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Join a dedicated community of clinical practitioners, critical care nurses, diagnostic technologists, and administrative healthcare professionals passionate about patient recovery.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Institutional Culture Highlights */}
          <div className="grid grid-cols-3" style={{ gap: '1.75rem', marginBottom: '3.5rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <Sparkles size={24} color="var(--color-primary)" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                Clinical Rigor & Ethics
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Work in an environment upholding evidence-based medical guidelines, patient safety charters, and collaborative peer learning.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <Award size={24} color="var(--color-secondary)" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                Professional Growth
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Continuous medical education (CME) seminars, clinical workshop sponsorships, and clear leadership progression paths.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <HeartHandshake size={24} color="#047857" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                Compassionate Culture
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Supportive nursing shifts, fair compensation, staff health benefits, and an institutional culture built on mutual respect.
              </p>
            </div>
          </div>

          {/* Current Job Openings */}
          <div style={{ marginBottom: '2rem' }}>
            <span className="badge badge-secondary">Active Positions</span>
            <h2 style={{ fontSize: '1.6rem', marginTop: '0.35rem', color: 'var(--color-primary-dark)' }}>
              Open Healthcare & Clinical Roles ({careersData.length})
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3.5rem' }}>
            {careersData.map((position) => (
              <div 
                key={position.id}
                className="card"
                style={{ padding: '1.75rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="badge badge-primary">{position.department}</span>
                      <span className="badge badge-secondary">{position.employmentType}</span>
                    </div>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                      <Link to={`/careers/${position.slug}`} style={{ color: 'inherit' }}>
                        {position.title}
                      </Link>
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link to={`/careers/${position.slug}`} className="btn btn-outline btn-sm">
                      <span>View Details</span>
                      <ChevronRight size={14} />
                    </Link>
                    <button 
                      onClick={() => handleApplyClick(position)}
                      className="btn btn-primary btn-sm"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {position.summary}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.82rem', color: 'var(--color-text-muted)', flexWrap: 'wrap', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Briefcase size={14} color="var(--color-primary-light)" />
                    <span><strong>Experience:</strong> {position.experienceRequired}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} color="var(--color-primary-light)" />
                    <span>{position.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} color="var(--color-primary-light)" />
                    <span>Posted: {position.postedDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* General Inquiries */}
          <div 
            style={{
              backgroundColor: 'var(--color-bg-base)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              textAlign: 'center'
            }}
          >
            <h4 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              Don’t See a Suitable Role Matching Your Profile?
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '540px', margin: '0 auto 1.25rem auto' }}>
              We are constantly seeking outstanding clinical consultants, medical officers, and nursing specialists. Send your CV to our talent acquisition cell at <strong>[HOSPITAL TO PROVIDE CAREERS EMAIL]</strong>.
            </p>
          </div>

          {/* Application Modal */}
          <CareerApplicationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            position={selectedPosition}
          />
        </div>
      </section>
    </div>
  );
};
