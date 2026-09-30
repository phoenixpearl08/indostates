import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { servicesData, departmentsData, doctorsData } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { DoctorCard } from '../components/common/DoctorCard';
import { SEO } from '../components/common/SEO';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Building2, 
  PhoneCall, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  // Related departments
  const relatedDepartments = departmentsData.filter((d) =>
    service.relatedDepartmentIds.includes(d.id)
  );

  // Related doctors
  const relatedDoctors = doctorsData.filter((doc) =>
    service.relatedDepartmentIds.includes(doc.departmentId)
  ).slice(0, 3);

  return (
    <div>
      <SEO
        title={`${service.title} — Healthcare Service`}
        description={`${service.shortDesc} Learn about clinical criteria, key features, and specialized departments at IndoStates Hospital.`}
        keywords={`healthcare service, ${service.title}, medical treatments, IndoStates Hospital`}
      />
      <Breadcrumb
        items={[
          { label: 'Services', path: '/services' },
          { label: service.title }
        ]}
      />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">{service.category}</span>
              <span className="badge badge-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <Clock size={12} />
                <span>{service.availability}</span>
              </span>
            </div>

            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              {service.title}
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {service.shortDesc}
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/appointments" className="btn btn-primary">
                <Calendar size={16} />
                <span>Request Appointment</span>
              </Link>
              <Link to="/contact" className="btn btn-outline">
                <PhoneCall size={16} />
                <span>Hospital Inquiries</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-3" style={{ gap: '2.5rem' }}>
            {/* Left 2 Cols */}
            <div style={{ gridColumn: 'span 2' }}>
              {/* Overview */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
                  Service Overview & Scope of Care
                </h2>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                  {service.overview}
                </p>
              </div>

              {/* Who It Is For */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
                  Who Can Benefit from this Service?
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
                    {service.whoItIsFor.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                        <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Features */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
                  Key Features & Standards
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {service.keyFeatures.map((feat, idx) => (
                    <div 
                      key={idx}
                      style={{
                        backgroundColor: 'var(--color-bg-base)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        fontSize: '0.88rem',
                        color: 'var(--color-text-main)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem'
                      }}
                    >
                      <ShieldCheck size={16} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Associated Departments */}
            <div>
              <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={18} color="var(--color-primary)" />
                  <span>Associated Departments</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {relatedDepartments.map((dept) => (
                    <Link
                      key={dept.id}
                      to={`/departments/${dept.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: 'var(--color-bg-base)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        color: 'var(--color-text-main)',
                        fontWeight: 500
                      }}
                    >
                      <span>{dept.name}</span>
                      <ArrowRight size={14} color="var(--color-primary-light)" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Inquiry Action */}
              <div 
                style={{
                  backgroundColor: 'var(--color-bg-muted)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}
              >
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Questions regarding this service?</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  Our hospital front desk is ready to assist you with scheduling, preparation guidelines, and doctor queries.
                </p>
                <Link to="/contact" className="btn btn-outline btn-sm btn-block">
                  Contact Hospital Desk
                </Link>
              </div>
            </div>
          </div>

          {/* Related Doctors */}
          {relatedDoctors.length > 0 && (
            <div style={{ marginTop: '3.5rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '3rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="badge badge-primary">Consultants</span>
                <h3 style={{ fontSize: '1.5rem', marginTop: '0.35rem', color: 'var(--color-primary-dark)' }}>
                  Doctors Providing {service.title}
                </h3>
              </div>

              <div className="grid grid-cols-3">
                {relatedDoctors.map((doc) => (
                  <DoctorCard key={doc.id} doctor={doc} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
