import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { careersData } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { CareerApplicationModal } from '../components/forms/CareerApplicationModal';
import { SEO } from '../components/common/SEO';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  Building2, 
  Award,
  Send
} from 'lucide-react';

export const CareerDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const position = careersData.find((p) => p.slug === slug);

  if (!position) {
    return <Navigate to="/careers" replace />;
  }

  return (
    <div>
      <SEO
        title={`${position.title} (${position.department}) — Careers`}
        description={`Apply for ${position.title} in ${position.department} at IndoStates Hospital. ${position.employmentType} position, ${position.experienceRequired}.`}
        keywords={`career, ${position.title}, ${position.department}, hospital job, IndoStates Hospital`}
      />
      <Breadcrumb
        items={[
          { label: 'Careers', path: '/careers' },
          { label: position.title }
        ]}
      />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '850px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">{position.department}</span>
              <span className="badge badge-secondary">{position.employmentType}</span>
            </div>

            <h1 style={{ marginBottom: '1rem', color: 'var(--color-primary-dark)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
              {position.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.88rem', color: 'var(--color-text-muted)', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={16} color="var(--color-primary-light)" />
                <span>{position.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Briefcase size={16} color="var(--color-primary-light)" />
                <span>Experience: {position.experienceRequired}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={16} color="var(--color-primary-light)" />
                <span>Posted: {position.postedDate}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
            >
              <Send size={16} />
              <span>Apply for this Role</span>
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-3" style={{ gap: '2.5rem' }}>
            {/* Left 2 Cols: Summary, Responsibilities, Requirements */}
            <div style={{ gridColumn: 'span 2' }}>
              {/* Role Summary */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
                  Position Summary
                </h2>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                  {position.summary}
                </p>
              </div>

              {/* Responsibilities */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                  Key Responsibilities
                </h3>
                <div 
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border-subtle)',
                    padding: '1.5rem'
                  }}
                >
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {position.responsibilities.map((resp, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                        <CheckCircle2 size={16} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Requirements */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                  Qualifications & Requirements
                </h3>
                <div 
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border-subtle)',
                    padding: '1.5rem'
                  }}
                >
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {position.requirements.map((req, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                        <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link to="/careers" className="btn btn-outline btn-sm">
                <ArrowLeft size={14} />
                <span>Back to All Careers</span>
              </Link>
            </div>

            {/* Right Col: Quick Apply Card */}
            <div>
              <div 
                className="card"
                style={{ padding: '1.75rem', position: 'sticky', top: '100px' }}
              >
                <h4 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                  Interested in this position?
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Submit your application and attach your CV. Our hospital HR team reviews all applications with strict confidentiality.
                </p>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-primary btn-block"
                  style={{ marginBottom: '1rem' }}
                >
                  <Send size={16} />
                  <span>Apply Now</span>
                </button>

                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5, borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.75rem' }}>
                  IndoStates Hospital is an Equal Opportunity Healthcare Employer adhering to non-discriminatory recruitment standards.
                </div>
              </div>
            </div>
          </div>

          <CareerApplicationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            position={position}
          />
        </div>
      </section>
    </div>
  );
};
