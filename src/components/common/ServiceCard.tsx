import React from 'react';
import { Link } from 'react-router-dom';
import { MedicalService } from '../../types';
import { ChevronRight, Clock } from 'lucide-react';

export const ServiceCard: React.FC<{ service: MedicalService }> = ({ service }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.5rem' }}>
        <div style={{ marginBottom: '0.85rem' }}>
          <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
            {service.category}
          </span>
        </div>

        <h3 style={{ fontSize: '1.18rem', marginBottom: '0.45rem' }}>
          <Link to={`/services/${service.slug}`} style={{ color: 'inherit' }}>
            {service.title}
          </Link>
        </h3>

        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', flex: 1, marginBottom: '1.25rem', lineHeight: 1.55 }}>
          {service.shortDesc}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          <Clock size={13} color="var(--color-secondary)" />
          <span>{service.availability}</span>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.85rem', marginTop: 'auto' }}>
          <Link
            to={`/services/${service.slug}`}
            className="btn btn-outline btn-sm btn-block"
          >
            <span>Learn More</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
