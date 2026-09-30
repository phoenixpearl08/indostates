import React, { useState } from 'react';
import { healthEventsData } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { EventCard } from '../components/common/EventCard';
import { SEO } from '../components/common/SEO';
import { Calendar, Users, HeartHandshake } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const [filterTab, setFilterTab] = useState<'all' | 'upcoming' | 'camps' | 'past'>('all');

  const filteredEvents = healthEventsData.filter((evt) => {
    if (filterTab === 'upcoming') return evt.isUpcoming;
    if (filterTab === 'past') return !evt.isUpcoming;
    if (filterTab === 'camps') return evt.category === 'Camp';
    return true;
  });

  return (
    <div>
      <SEO
        title="Health Camps, Awareness & Community Events"
        description="Community outreach programs, free health screening camps, workshops, and awareness seminars organized by IndoStates Hospital."
        keywords="health camps, community outreach, free checkup camp, hospital events, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Health Camps & Events' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Community Outreach</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              Health Camps, Awareness & Community Events
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              IndoStates Hospital regularly organizes free health screening camps, wellness workshops, and public awareness initiatives to promote preventative healthcare in the community.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button
              onClick={() => setFilterTab('all')}
              className={`btn btn-sm ${filterTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
            >
              All Events ({healthEventsData.length})
            </button>
            <button
              onClick={() => setFilterTab('upcoming')}
              className={`btn btn-sm ${filterTab === 'upcoming' ? 'btn-primary' : 'btn-outline'}`}
            >
              Upcoming ({healthEventsData.filter((e) => e.isUpcoming).length})
            </button>
            <button
              onClick={() => setFilterTab('camps')}
              className={`btn btn-sm ${filterTab === 'camps' ? 'btn-primary' : 'btn-outline'}`}
            >
              Free Screening Camps
            </button>
            <button
              onClick={() => setFilterTab('past')}
              className={`btn btn-sm ${filterTab === 'past' ? 'btn-primary' : 'btn-outline'}`}
            >
              Past Programs ({healthEventsData.filter((e) => !e.isUpcoming).length})
            </button>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-2">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
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
                No events currently scheduled in this category
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
                Check back soon or explore our other public wellness camps and community initiatives.
              </p>
              <button
                onClick={() => setFilterTab('all')}
                className="btn btn-outline btn-sm"
              >
                View All Events
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
