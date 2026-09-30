import React from 'react';
import { Facility } from '../../types';
import { MapPin, Clock, CheckCircle2 } from 'lucide-react';

export const FacilityCard: React.FC<{ facility: Facility }> = ({ facility }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <span className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>
            {facility.category}
          </span>
          {facility.badge && (
            <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
              {facility.badge}
            </span>
          )}
        </div>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
          {facility.title}
        </h3>

        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
          {facility.shortDesc}
        </p>

        {facility.highlights && facility.highlights.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
            {facility.highlights.slice(0, 3).map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                <CheckCircle2 size={14} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.85rem', marginTop: 'auto', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.3rem' }}>
            <MapPin size={13} color="var(--color-primary-light)" />
            <span>{facility.floor}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Clock size={13} color="var(--color-primary-light)" />
            <span>{facility.timings}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
