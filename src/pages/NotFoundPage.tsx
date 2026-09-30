import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEO } from '../components/common/SEO';
import { hospitalInfo } from '../data';
import { 
  FileQuestion, 
  Home, 
  Search, 
  Calendar, 
  ShieldAlert, 
  Stethoscope, 
  PhoneCall 
} from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div>
      <SEO
        title="404 — Page Not Found"
        description="The requested page could not be found on IndoStates Hospital."
      />
      <Breadcrumb items={[{ label: 'Page Not Found' }]} />

      <section className="section" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div 
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'var(--color-bg-muted)',
              color: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}
          >
            <FileQuestion size={44} />
          </div>

          <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-primary-dark)', lineHeight: 1, marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
            404
          </div>

          <h1 style={{ fontSize: '1.65rem', marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>
            Page Not Found
          </h1>

          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            The page or resource you are looking for might have been relocated, renamed, or is temporarily unavailable. Please check the URL or use the quick links below.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link to="/" className="btn btn-primary">
              <Home size={16} />
              <span>Return to Homepage</span>
            </Link>

            <Link to="/search" className="btn btn-outline">
              <Search size={16} />
              <span>Search Website</span>
            </Link>

            <Link to="/emergency" className="btn btn-emergency">
              <ShieldAlert size={16} />
              <span>Emergency Services</span>
            </Link>
          </div>

          {/* Quick Help Box */}
          <div 
            style={{
              backgroundColor: 'var(--color-bg-base)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              fontSize: '0.88rem',
              color: 'var(--color-text-secondary)'
            }}
          >
            Looking for urgent medical assistance or outpatient appointments? Call hospital reception at <strong>{hospitalInfo.generalPhone}</strong>.
          </div>
        </div>
      </section>
    </div>
  );
};
