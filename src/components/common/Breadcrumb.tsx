import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav 
      aria-label="Breadcrumb"
      style={{
        padding: '0.85rem 0',
        fontSize: '0.85rem',
        color: 'var(--color-text-muted)',
        borderBottom: '1px solid var(--color-border-subtle)',
        marginBottom: '1.5rem'
      }}
    >
      <div className="container">
        <ol 
          style={{ 
            listStyle: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '0.45rem', 
            margin: 0, 
            padding: 0 
          }}
        >
          <li style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Link 
              to="/" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)' }}
            >
              <Home size={14} />
              <span>Home</span>
            </Link>
          </li>

          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <ChevronRight size={13} color="#94a3b8" />
                {isLast || !item.path ? (
                  <span 
                    aria-current="page" 
                    style={{ fontWeight: 600, color: 'var(--color-text-main)' }}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.path} style={{ color: 'var(--color-text-muted)' }}>
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
