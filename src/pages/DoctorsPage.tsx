import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doctorsData, departmentsData } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { DoctorCard } from '../components/common/DoctorCard';
import { SEO } from '../components/common/SEO';
import { Search, Stethoscope, SlidersHorizontal, UserCheck } from 'lucide-react';

export const DoctorsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialDept = searchParams.get('department') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(initialDept);
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [sortBy, setSortBy] = useState<'experience' | 'name'>('experience');

  const specializations = useMemo(() => {
    const specs = new Set<string>();
    doctorsData.forEach((d) => {
      if (d.specialization && !d.specialization.includes('[HOSPITAL')) {
        specs.add(d.specialization);
      }
    });
    return Array.from(specs).sort();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctorsData
      .filter((doc) => {
        const matchesSearch =
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.areasOfExpertise.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesDept =
          selectedDepartment === 'all' || doc.departmentId === selectedDepartment;

        const matchesSpec =
          selectedSpecialization === 'all' || doc.specialization === selectedSpecialization;

        return matchesSearch && matchesDept && matchesSpec;
      })
      .sort((a, b) => {
        if (sortBy === 'experience') {
          const expA = typeof a.experienceYears === 'number' ? a.experienceYears : parseInt(String(a.experienceYears) || '0', 10) || 0;
          const expB = typeof b.experienceYears === 'number' ? b.experienceYears : parseInt(String(b.experienceYears) || '0', 10) || 0;
          return expB - expA;
        }
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [searchQuery, selectedDepartment, selectedSpecialization, sortBy]);

  return (
    <div>
      <SEO
        title="Find a Doctor — Specialist Consultants"
        description="Search credentialed medical consultants and surgical specialists across clinical departments at IndoStates Hospital."
        keywords="hospital doctors, specialist consultants, cardiologist, neurologist, orthopedic surgeon, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Find a Doctor' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Medical Registry</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              Find a Doctor / Clinical Specialists
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Search across our medical team of senior consultants, surgeons, and physicians by specialty, qualification, and outpatient schedule.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Institutional Demo Notice */}
          <div className="demo-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '2px' }}>
              <UserCheck size={16} />
              <span>Simulated Doctor Profiles (Prototype Preview)</span>
            </div>
            <span>
              The physician profiles displayed below are realistic sample entries for system demonstration and layout review. Official hospital medical registrations and verified physician credentials will be integrated before public release.
            </span>
          </div>

          {/* Search, Filter & Sort Toolbar */}
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
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Search 
                size={18} 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} 
              />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="Search by doctor name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search doctors by name or keyword"
              />
            </div>

            {/* Department Filter Select */}
            <div style={{ flex: '1 1 200px' }}>
              <select
                className="form-control"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                aria-label="Filter by department"
              >
                <option value="all">All Departments ({doctorsData.length})</option>
                {departmentsData.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Specialization Filter Select */}
            <div style={{ flex: '1 1 200px' }}>
              <select
                className="form-control"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                aria-label="Filter by specialization"
              >
                <option value="all">All Specializations ({specializations.length})</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={16} color="var(--color-text-muted)" />
              <select
                className="form-control"
                style={{ minWidth: '160px' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'experience' | 'name')}
                aria-label="Sort doctors"
              >
                <option value="experience">Experience: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Results Summary Counter */}
          <div style={{ marginBottom: '1.5rem', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filteredDoctors.length}</strong> matching consultant{filteredDoctors.length !== 1 ? 's' : ''}
          </div>

          {/* Doctor Cards Grid */}
          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-3">
              {filteredDoctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
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
                No doctors match your query
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
                We couldn't find any doctors matching your search. Try changing the department filter or clearing the search terms.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDepartment('all');
                  setSelectedSpecialization('all');
                }}
                className="btn btn-outline btn-sm"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
