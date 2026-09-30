import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { departmentsData, doctorsData } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { DoctorCard } from '../components/common/DoctorCard';
import { SEO } from '../components/common/SEO';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Building2, 
  Stethoscope, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const DepartmentDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const department = departmentsData.find((d) => d.slug === slug);

  if (!department) {
    return <Navigate to="/departments" replace />;
  }

  // Find associated doctors
  const departmentDoctors = doctorsData.filter((doc) => doc.departmentId === department.id);

  return (
    <div>
      <SEO
        title={`${department.name} — Department Overview`}
        description={department.overview.slice(0, 160)}
        keywords={`${department.name}, ${department.keyServices.join(', ')}, IndoStates Hospital`}
        ogType="website"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'MedicalSpecialty',
          name: department.name,
          description: department.shortDesc
        }}
      />
      <Breadcrumb
        items={[
          { label: 'Departments', path: '/departments' },
          { label: department.name }
        ]}
      />

      {/* Department Header */}
      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '850px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">{department.category} Specialty</span>
              <span className="badge badge-secondary">IndoStates Hospital</span>
            </div>

            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              {department.name}
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {department.tagline}
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to={`/appointments?department=${department.id}`} className="btn btn-primary">
                <Calendar size={16} />
                <span>Book Appointment in {department.name.split(' ')[0]}</span>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                <Clock size={16} color="var(--color-primary-light)" />
                <span><strong>OPD Timings:</strong> {department.opdTimings}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Services */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-3" style={{ gap: '2.5rem' }}>
            {/* Left 2 Cols: Overview, Services, Treatments */}
            <div style={{ gridColumn: 'span 2' }}>
              {/* Department Overview */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
                  Department Overview
                </h2>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                  {department.overview}
                </p>
              </div>

              {/* Key Diagnostic & Clinical Services */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
                  Key Services & Diagnostic Procedures
                </h3>
                <div 
                  style={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: 'var(--radius-lg)', 
                    border: '1px solid var(--color-border-subtle)', 
                    padding: '1.5rem' 
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    {department.keyServices.map((service, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Common Conditions & Treatments */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
                  Conditions Treated & Clinical Programs
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  {department.commonTreatments.map((treatment, idx) => (
                    <span 
                      key={idx}
                      style={{
                        backgroundColor: 'var(--color-bg-base)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.45rem 0.95rem',
                        fontSize: '0.85rem',
                        color: 'var(--color-text-secondary)',
                        fontWeight: 500
                      }}
                    >
                      {treatment}
                    </span>
                  ))}
                </div>
              </div>

              {/* Department FAQs */}
              {department.faqs && department.faqs.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
                    Frequently Asked Questions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {department.faqs.map((faq, idx) => (
                      <div 
                        key={idx}
                        className="card"
                        style={{ padding: '1.25rem 1.5rem' }}
                      >
                        <h4 style={{ fontSize: '1rem', color: 'var(--color-text-main)', marginBottom: '0.45rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <HelpCircle size={18} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{faq.question}</span>
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-secondary)', paddingLeft: '1.6rem', lineHeight: 1.6 }}>
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Facilities, Quick Booking Card */}
            <div>
              {/* Facilities Available in Dept */}
              <div 
                className="card"
                style={{ padding: '1.75rem', marginBottom: '1.5rem', backgroundColor: 'var(--color-bg-surface)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Building2 size={20} color="var(--color-primary)" />
                  <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-primary-dark)' }}>
                    Dedicated Infrastructure
                  </h4>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {department.facilitiesAvailable.map((fac, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      <CheckCircle2 size={15} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{fac}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Book Appointment Card */}
              <div 
                style={{
                  backgroundColor: 'var(--color-primary-dark)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <h4 style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  Consult a Specialist
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Request an outpatient consultation slot with our {department.name.toLowerCase()} physicians.
                </p>
                <Link 
                  to={`/appointments?department=${department.id}`} 
                  className="btn btn-secondary btn-block"
                >
                  <Calendar size={16} />
                  <span>Book Appointment</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Department Specialists */}
          <div style={{ marginTop: '3.5rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '3rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="badge badge-primary">Consultants</span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '0.35rem', color: 'var(--color-primary-dark)' }}>
                Doctors in {department.name}
              </h2>
            </div>

            {departmentDoctors.length > 0 ? (
              <div className="grid grid-cols-3">
                {departmentDoctors.map((doc) => (
                  <DoctorCard key={doc.id} doctor={doc} />
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)' }}>
                Consultant schedules being updated. Contact the hospital appointment desk for direct scheduling.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
