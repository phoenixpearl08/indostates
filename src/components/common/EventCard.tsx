import React from 'react';
import { Link } from 'react-router-dom';
import { HealthEvent } from '../../types';
import { Calendar, Clock, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';

export const EventCard: React.FC<{ event: HealthEvent }> = ({ event }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <span className={`badge ${event.category === 'Camp' ? 'badge-primary' : 'badge-secondary'}`} style={{ fontSize: '0.72rem' }}>
            {event.category}
          </span>
          {event.isUpcoming ? (
            <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>Upcoming</span>
          ) : (
            <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Concluded</span>
          )}
        </div>

        <h3 style={{ fontSize: '1.18rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
          <Link to={`/events/${event.slug}`} style={{ color: 'inherit' }}>
            {event.title}
          </Link>
        </h3>

        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
          {event.shortDesc}
        </p>

        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.85rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} color="var(--color-primary-light)" />
            <span><strong>Date:</strong> {event.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={14} color="var(--color-primary-light)" />
            <span><strong>Time:</strong> {event.time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={14} color="var(--color-primary-light)" />
            <span>{event.venue}</span>
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
          <Link
            to={`/events/${event.slug}`}
            className="btn btn-outline btn-sm"
            style={{ flex: 1 }}
          >
            <span>Details</span>
            <ChevronRight size={13} />
          </Link>

          {event.registrationOpen ? (
            <Link
              to={`/events/${event.slug}#register`}
              className="btn btn-primary btn-sm"
              style={{ flex: 1.3 }}
            >
              <CheckCircle2 size={13} />
              <span>Register</span>
            </Link>
          ) : (
            <button disabled className="btn btn-ghost btn-sm" style={{ flex: 1.3 }}>
              <span>Closed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
