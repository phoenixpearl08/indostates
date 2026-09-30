import React, { useState } from 'react';
import { galleryData } from '../data';
import { GalleryItem } from '../types';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Modal } from '../components/common/Modal';
import { SEO } from '../components/common/SEO';
import { 
  Building2, 
  Scissors, 
  Activity, 
  ShieldAlert, 
  HeartPulse, 
  Stethoscope, 
  FlaskConical, 
  Bed, 
  Users,
  Eye,
  Camera
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 size={36} />,
  Scissors: <Scissors size={36} />,
  Activity: <Activity size={36} />,
  ShieldAlert: <ShieldAlert size={36} />,
  HeartPulse: <HeartPulse size={36} />,
  Stethoscope: <Stethoscope size={36} />,
  FlaskConical: <FlaskConical size={36} />,
  Bed: <Bed size={36} />,
  Users: <Users size={36} />
};

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Hospital', 'Facilities', 'Events', 'Health camps', 'Doctors'];

  const filteredItems = galleryData.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  return (
    <div>
      <SEO
        title="Campus & Facility Gallery"
        description="Photo gallery showcasing IndoStates Hospital's advanced medical infrastructure, modern patient rooms, operating suites, and community outreach."
        keywords="hospital gallery, medical infrastructure photos, OT photos, ICU photos, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Campus & Facility Gallery' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Visual Tour</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              IndoStates Hospital Campus Gallery
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Explore our state-of-the-art clinical environment, modular operation suites, diagnostic facilities, intensive care telemetry bays, and community health camps.
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
                {cat === 'All' ? 'All Areas' : cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid or Empty State */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-3">
              {filteredItems.map((item) => (
                <div 
                  key={item.id}
                  className="card"
                  style={{ cursor: 'pointer', overflow: 'hidden' }}
                  onClick={() => setActiveItem(item)}
                >
                  {/* Visual Representation Graphic */}
                  <div 
                    style={{
                      height: '180px',
                      background: `linear-gradient(135deg, ${item.accentColor}15, ${item.accentColor}30)`,
                      borderBottom: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.accentColor,
                      position: 'relative'
                    }}
                  >
                    {iconMap[item.icon] || <Camera size={36} />}
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {item.category}
                    </span>

                    <div 
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        color: 'var(--color-text-main)'
                      }}
                    >
                      <Eye size={12} />
                      <span>View</span>
                    </div>
                  </div>

                  <div className="card-body" style={{ padding: '1.25rem' }}>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card card-static" style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '580px', margin: '0 auto' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Camera size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>No Gallery Records in this Category</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Visual records for this category are being updated or archived. Explore all campus facilities or schedule an in-person orientation tour.
              </p>
              <button onClick={() => setSelectedCategory('All')} className="btn btn-outline btn-sm">
                View All Visual Tours
              </button>
            </div>
          )}

          {/* Lightbox Modal */}
          {activeItem && (
            <Modal
              isOpen={Boolean(activeItem)}
              onClose={() => setActiveItem(null)}
              title={activeItem.title}
              maxWidth="650px"
            >
              <div>
                <div 
                  style={{
                    height: '240px',
                    borderRadius: 'var(--radius-md)',
                    background: `linear-gradient(135deg, ${activeItem.accentColor}20, ${activeItem.accentColor}40)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: activeItem.accentColor,
                    marginBottom: '1.25rem',
                    border: '1px solid var(--color-border-subtle)'
                  }}
                >
                  {iconMap[activeItem.icon] || <Camera size={48} />}
                  <div style={{ marginTop: '0.75rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                    IndoStates Hospital • {activeItem.category}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>{activeItem.category}</span>
                  <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {activeItem.caption}
                  </p>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.75rem' }}>
                  * All patient identity privacy standards strictly maintained in institutional campus visual records.
                </div>
              </div>
            </Modal>
          )}

          {/* Consistent CTA Banner */}
          <div className="card card-static" style={{ marginTop: '4rem', padding: '2.5rem', background: 'linear-gradient(135deg, var(--color-primary-dark), #0369a1)', color: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ maxWidth: '650px' }}>
                <span className="badge badge-secondary" style={{ marginBottom: '0.75rem' }}>Patient & Visitor Services</span>
                <h3 style={{ color: '#ffffff', marginBottom: '0.5rem', fontSize: '1.45rem' }}>
                  Need to Visit IndoStates Hospital Campus?
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Schedule an outpatient appointment or consult our patient admissions desk for physical navigation and assistance.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="/appointments" className="btn btn-secondary">
                  Book Appointment
                </a>
                <a href="/contact" className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}>
                  Campus Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
