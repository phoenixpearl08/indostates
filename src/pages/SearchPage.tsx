import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  doctorsData, 
  departmentsData, 
  servicesData, 
  facilitiesData, 
  healthArticlesData, 
  healthEventsData 
} from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { 
  Search, 
  Stethoscope, 
  Building2, 
  Activity, 
  FileText, 
  Calendar, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'doctors' | 'departments' | 'services' | 'articles' | 'events'>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
  };

  const cleanQuery = query.trim().toLowerCase();

  // Search results
  const results = useMemo(() => {
    if (!cleanQuery) {
      return {
        doctors: [],
        departments: [],
        services: [],
        articles: [],
        events: []
      };
    }

    const doctors = doctorsData.filter(
      (d) =>
        d.name.toLowerCase().includes(cleanQuery) ||
        d.specialization.toLowerCase().includes(cleanQuery) ||
        d.departmentName.toLowerCase().includes(cleanQuery) ||
        d.areasOfExpertise.some((a) => a.toLowerCase().includes(cleanQuery))
    );

    const departments = departmentsData.filter(
      (dept) =>
        dept.name.toLowerCase().includes(cleanQuery) ||
        dept.shortDesc.toLowerCase().includes(cleanQuery) ||
        dept.keyServices.some((s) => s.toLowerCase().includes(cleanQuery)) ||
        dept.commonTreatments.some((t) => t.toLowerCase().includes(cleanQuery))
    );

    const services = servicesData.filter(
      (s) =>
        s.title.toLowerCase().includes(cleanQuery) ||
        s.shortDesc.toLowerCase().includes(cleanQuery) ||
        s.keyFeatures.some((f) => f.toLowerCase().includes(cleanQuery))
    );

    const articles = healthArticlesData.filter(
      (a) =>
        a.title.toLowerCase().includes(cleanQuery) ||
        a.excerpt.toLowerCase().includes(cleanQuery) ||
        a.tags.some((t) => t.toLowerCase().includes(cleanQuery))
    );

    const events = healthEventsData.filter(
      (e) =>
        e.title.toLowerCase().includes(cleanQuery) ||
        e.shortDesc.toLowerCase().includes(cleanQuery)
    );

    return { doctors, departments, services, articles, events };
  }, [cleanQuery]);

  const totalResults =
    results.doctors.length +
    results.departments.length +
    results.services.length +
    results.articles.length +
    results.events.length;

  return (
    <div>
      <SEO
        title="Search Doctors, Departments & Services"
        description="Search IndoStates Hospital's clinical departments, medical specialists, hospital services, health packages, and health guides."
        keywords="search hospital, find doctor, medical specialties, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Site Search' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Hospital Directory</span>
            <h1 style={{ marginBottom: '1.25rem', color: 'var(--color-primary-dark)' }}>
              Search IndoStates Hospital
            </h1>

            {/* Main Search Input Form */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.75rem', height: '48px', fontSize: '1.05rem' }}
                  placeholder="Search doctors, cardiology, emergency, health packages, articles..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0 1.75rem' }}>
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {cleanQuery && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                Found <strong>{totalResults}</strong> result{totalResults !== 1 ? 's' : ''} for "{cleanQuery}"
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
                >
                  All Results ({totalResults})
                </button>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`btn btn-sm ${activeTab === 'doctors' ? 'btn-primary' : 'btn-outline'}`}
                >
                  Doctors ({results.doctors.length})
                </button>
                <button
                  onClick={() => setActiveTab('departments')}
                  className={`btn btn-sm ${activeTab === 'departments' ? 'btn-primary' : 'btn-outline'}`}
                >
                  Departments ({results.departments.length})
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`btn btn-sm ${activeTab === 'services' ? 'btn-primary' : 'btn-outline'}`}
                >
                  Services ({results.services.length})
                </button>
                <button
                  onClick={() => setActiveTab('articles')}
                  className={`btn btn-sm ${activeTab === 'articles' ? 'btn-primary' : 'btn-outline'}`}
                >
                  Health Articles ({results.articles.length})
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`btn btn-sm ${activeTab === 'events' ? 'btn-primary' : 'btn-outline'}`}
                >
                  Events & Camps ({results.events.length})
                </button>
              </div>
            </div>
          )}

          {/* Results Lists */}
          {cleanQuery ? (
            totalResults > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {/* Doctors Section */}
                {(activeTab === 'all' || activeTab === 'doctors') && results.doctors.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Stethoscope size={20} color="var(--color-primary)" />
                      <span>Doctors ({results.doctors.length})</span>
                    </h3>
                    <div className="grid grid-cols-2">
                      {results.doctors.map((doc) => (
                        <div key={doc.id} className="card" style={{ padding: '1.25rem' }}>
                          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                            <Link to={`/doctors/${doc.slug}`} style={{ color: 'inherit' }}>{doc.name}</Link>
                          </h4>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-light)', fontWeight: 600, marginBottom: '0.35rem' }}>
                            {doc.title} • {doc.departmentName}
                          </div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0 0 0.75rem 0' }}>
                            {doc.specialization} ({doc.experienceYears}+ years experience)
                          </p>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link to={`/doctors/${doc.slug}`} className="btn btn-outline btn-sm">Profile</Link>
                            <Link to={`/appointments?doctor=${doc.id}`} className="btn btn-primary btn-sm">Book Visit</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Departments Section */}
                {(activeTab === 'all' || activeTab === 'departments') && results.departments.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Building2 size={20} color="var(--color-secondary)" />
                      <span>Departments ({results.departments.length})</span>
                    </h3>
                    <div className="grid grid-cols-2">
                      {results.departments.map((dept) => (
                        <div key={dept.id} className="card" style={{ padding: '1.25rem' }}>
                          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                            <Link to={`/departments/${dept.slug}`} style={{ color: 'inherit' }}>{dept.name}</Link>
                          </h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                            {dept.shortDesc}
                          </p>
                          <Link to={`/departments/${dept.slug}`} className="btn btn-outline btn-sm">
                            <span>View Department</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services Section */}
                {(activeTab === 'all' || activeTab === 'services') && results.services.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Activity size={20} color="var(--color-primary)" />
                      <span>Services ({results.services.length})</span>
                    </h3>
                    <div className="grid grid-cols-2">
                      {results.services.map((srv) => (
                        <div key={srv.id} className="card" style={{ padding: '1.25rem' }}>
                          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                            <Link to={`/services/${srv.slug}`} style={{ color: 'inherit' }}>{srv.title}</Link>
                          </h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                            {srv.shortDesc}
                          </p>
                          <Link to={`/services/${srv.slug}`} className="btn btn-outline btn-sm">Learn More</Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Articles Section */}
                {(activeTab === 'all' || activeTab === 'articles') && results.articles.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={20} color="var(--color-secondary)" />
                      <span>Health Articles ({results.articles.length})</span>
                    </h3>
                    <div className="grid grid-cols-2">
                      {results.articles.map((art) => (
                        <div key={art.id} className="card" style={{ padding: '1.25rem' }}>
                          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>{art.category}</span>
                          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                            <Link to={`/health/${art.slug}`} style={{ color: 'inherit' }}>{art.title}</Link>
                          </h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                            {art.excerpt}
                          </p>
                          <Link to={`/health/${art.slug}`} className="btn btn-outline btn-sm">Read Article</Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Events Section */}
                {(activeTab === 'all' || activeTab === 'events') && results.events.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={20} color="#b45309" />
                      <span>Events & Camps ({results.events.length})</span>
                    </h3>
                    <div className="grid grid-cols-2">
                      {results.events.map((evt) => (
                        <div key={evt.id} className="card" style={{ padding: '1.25rem' }}>
                          <span className="badge badge-secondary" style={{ marginBottom: '0.4rem' }}>{evt.category}</span>
                          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                            <Link to={`/events/${evt.slug}`} style={{ color: 'inherit' }}>{evt.title}</Link>
                          </h4>
                          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                            {evt.date} • {evt.venue}
                          </div>
                          <Link to={`/events/${evt.slug}`} className="btn btn-outline btn-sm">Event Details</Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                <Search size={44} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                  No results found for "{cleanQuery}"
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
                  Please try another search keyword, check spelling, or browse by medical departments directly.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                  <Link to="/departments" className="btn btn-outline btn-sm">Browse Departments</Link>
                  <Link to="/doctors" className="btn btn-primary btn-sm">Find a Doctor</Link>
                </div>
              </div>
            )
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--color-text-muted)' }}>
              <p>Type keywords in the search bar above to look up doctors, specialties, treatments, and events.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
