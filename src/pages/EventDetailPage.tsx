import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { healthEventsData, hospitalInfo } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { useNotification } from '../context/NotificationContext';
import { SEO } from '../components/common/SEO';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Building2, 
  UserCheck, 
  ArrowLeft,
  Send,
  AlertCircle
} from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { showNotification } = useNotification();
  const event = healthEventsData.find((e) => e.slug === slug);

  const [attendeeName, setAttendeeName] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [numberOfAttendees, setNumberOfAttendees] = useState('1');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!event) {
    return <Navigate to="/events" replace />;
  }

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName.trim() || !attendeePhone.trim()) {
      setErrorMsg('Please enter your full name and phone number.');
      return;
    }

    setIsSubmitted(true);
    showNotification('success', 'Event Registration Received', `You have registered for ${event.title}. Our coordinator will send SMS details.`);
  };

  return (
    <div>
      <SEO
        title={`${event.title} — Community Health Event`}
        description={`${event.shortDesc} Date: ${event.date}, Time: ${event.time}, Venue: ${event.venue}. Organized by IndoStates Hospital.`}
        keywords={`health event, ${event.title}, health camp, medical awareness, IndoStates Hospital`}
      />
      <Breadcrumb
        items={[
          { label: 'Events & Camps', path: '/events' },
          { label: event.title }
        ]}
      />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <span className={`badge ${event.category === 'Camp' ? 'badge-primary' : 'badge-secondary'}`}>
                {event.category}
              </span>
              {event.isUpcoming ? (
                <span className="badge badge-secondary">Upcoming Program</span>
              ) : (
                <span className="badge badge-neutral">Concluded Event</span>
              )}
            </div>

            <h1 style={{ marginBottom: '1rem', color: 'var(--color-primary-dark)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
              {event.title}
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {event.shortDesc}
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-3" style={{ gap: '2.5rem' }}>
            {/* Left 2 Cols: Details & Activities */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                  Event Overview & Objectives
                </h2>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                  Organized by the Department of {event.departmentName}, this program is part of IndoStates Hospital’s community health charter to bring specialized clinical screening and preventative awareness directly to community members.
                </p>
              </div>

              {/* Key Activities */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                  What Attendees Can Expect:
                </h3>
                <div 
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border-subtle)',
                    padding: '1.5rem'
                  }}
                >
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {event.details.map((detail, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                        <CheckCircle2 size={16} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link to="/events" className="btn btn-outline btn-sm">
                <ArrowLeft size={14} />
                <span>Back to Events & Camps</span>
              </Link>
            </div>

            {/* Right Col: Logistics & Registration Card */}
            <div>
              <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '1.25rem' }}>
                  Schedule & Venue
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <Calendar size={16} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Date:</strong>
                      <div>{event.date}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <Clock size={16} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Timings:</strong>
                      <div>{event.time}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <MapPin size={16} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Venue:</strong>
                      <div>{event.venue}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <Building2 size={16} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Organizing Department:</strong>
                      <div>{event.departmentName}</div>
                    </div>
                  </div>
                </div>

                {/* Registration Form */}
                <div id="register" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.25rem' }}>
                  {event.registrationOpen ? (
                    isSubmitted ? (
                      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <CheckCircle2 size={32} color="var(--color-success)" style={{ margin: '0 auto 0.5rem auto' }} />
                        <div style={{ fontWeight: 700, color: 'var(--color-success)' }}>Registration Recorded</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                          We look forward to welcoming you on {event.date}.
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleRegistration}>
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
                          Free Registration / Seat Reservation
                        </h4>

                        {errorMsg && (
                          <div style={{ color: 'var(--color-emergency)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                            {errorMsg}
                          </div>
                        )}

                        <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                          <input
                            type="text"
                            placeholder="Your Name *"
                            className="form-control"
                            style={{ fontSize: '0.85rem' }}
                            value={attendeeName}
                            onChange={(e) => setAttendeeName(e.target.value)}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                          <input
                            type="tel"
                            placeholder="Mobile Number *"
                            className="form-control"
                            style={{ fontSize: '0.85rem' }}
                            value={attendeePhone}
                            onChange={(e) => setAttendeePhone(e.target.value)}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                          <select
                            className="form-control"
                            style={{ fontSize: '0.85rem' }}
                            value={numberOfAttendees}
                            onChange={(e) => setNumberOfAttendees(e.target.value)}
                          >
                            <option value="1">1 Attendee</option>
                            <option value="2">2 Attendees</option>
                            <option value="3">3 Attendees</option>
                            <option value="Family">Family Group (4+)</option>
                          </select>
                        </div>

                        <button type="submit" className="btn btn-primary btn-sm btn-block">
                          <Send size={14} />
                          <span>Reserve Spot</span>
                        </button>
                      </form>
                    )
                  ) : (
                    <div style={{ backgroundColor: 'var(--color-bg-muted)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Registration for this concluded session is closed.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
