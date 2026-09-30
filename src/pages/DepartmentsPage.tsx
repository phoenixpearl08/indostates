import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { departmentsData } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SectionHeading } from '../components/common/SectionHeading';
import { DepartmentCard } from '../components/common/DepartmentCard';
import { SEO } from '../components/common/SEO';
import { Search, Filter, Stethoscope, Calendar } from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'clinical' | 'surgical'>('all');

  const filteredDepartments = useMemo(() => {
    return departmentsData.filter((dept) => {
      const matchesSearch =
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.keyServices.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || dept.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div>
      <SEO
        title="Clinical & Surgical Departments"
        description="Explore multi-specialty clinical departments at IndoStates Hospital, including Cardiology, Neurology, Orthopedics, and Laparoscopic Surgery."
        keywords="hospital departments, clinical care, cardiology, neurology, surgery, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Clinical Departments' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '780px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Specialized Care</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              Medical & Surgical Departments
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              IndoStates Hospital houses comprehensive clinical specialties equipped with modern diagnostic units, outpatient consulting suites, and multi-disciplinary doctors.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Search & Filter Toolbar */}
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
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 320px' }}>
              <Search 
                size={18} 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} 
              />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="Search departments, treatments, or conditions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
              >
                All Departments ({departmentsData.length})
              </button>
              <button
                onClick={() => setSelectedCategory('clinical')}
                className={`btn btn-sm ${selectedCategory === 'clinical' ? 'btn-primary' : 'btn-outline'}`}
              >
                Clinical Specialties
              </button>
              <button
                onClick={() => setSelectedCategory('surgical')}
                className={`btn btn-sm ${selectedCategory === 'surgical' ? 'btn-primary' : 'btn-outline'}`}
              >
                Surgical Specialties
              </button>
            </div>
          </div>

          {/* Results Grid */}
          {filteredDepartments.length > 0 ? (
            <div className="grid grid-cols-3">
              {filteredDepartments.map((dept) => (
                <DepartmentCard key={dept.id} department={dept} />
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
              <Stethoscope size={44} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                No departments found
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
                No clinical department matches "{searchQuery}". Try searching by another keyword or reset the category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="btn btn-outline btn-sm"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Appointment CTA Section */}
      <section 
        style={{ 
          background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', 
          color: '#ffffff', 
          padding: '3.5rem 0' 
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <span className="badge badge-secondary" style={{ marginBottom: '0.85rem' }}>Clinical Consultations</span>
            <h2 style={{ color: '#ffffff', marginBottom: '0.75rem' }}>
              Schedule an Outpatient Consultation
            </h2>
            <p style={{ color: '#e0f2fe', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Select your clinical department and preferred consultant to request an appointment slot. Our coordination desk will verify availability and confirm your token.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/appointments" className="btn btn-secondary">
                <Calendar size={16} />
                <span>Book Appointment Online</span>
              </Link>
              <Link to="/doctors" className="btn btn-outline" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
                <Stethoscope size={16} />
                <span>Browse Doctor Directory</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
