import React, { useState } from 'react';
import { servicesData } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ServiceCard } from '../components/common/ServiceCard';
import { SEO } from '../components/common/SEO';
import { Search } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Critical Care', 'Clinical Care', 'Surgical Services', 'Diagnostics', 'Pharmacy', 'Preventive Health', 'Rehabilitation'];

  const filteredServices = servicesData.filter((srv) => {
    const matchesSearch =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.keyFeatures.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      selectedCategory === 'all' || srv.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div>
      <SEO
        title="Healthcare Services & Clinical Care"
        description="Comprehensive healthcare services at IndoStates Hospital, including emergency critical care, outpatient clinics, surgical suites, and diagnostic support."
        keywords="hospital services, emergency care, inpatient care, medical specialties, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Healthcare Services' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Clinical Offerings</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              Healthcare Services & Clinical Care
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              IndoStates Hospital provides an integrated continuum of medical services, ranging from emergency life support and minimally invasive surgery to automated laboratory testing and physical therapy.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filter Bar */}
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              boxShadow: 'var(--shadow-xs)',
              border: '1px solid var(--color-border-subtle)',
              marginBottom: '2.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search 
                size={18} 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} 
              />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="Search services, diagnostics, surgeries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                >
                  {cat === 'all' ? 'All Services' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-3">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div 
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--color-border-medium)',
                padding: '3.5rem 1.5rem',
                textAlign: 'center'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                No services found
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
                No medical service matches "{searchQuery}". Try searching by another keyword or reset the category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="btn btn-outline btn-sm"
              >
                Reset Service Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
