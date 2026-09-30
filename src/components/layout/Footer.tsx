import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldAlert, 
  Clock, 
  ExternalLink
} from 'lucide-react';
import { hospitalInfo } from '../../data';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Hospital Overview */}
          <div>
            <div className="brand-logo" style={{ marginBottom: '1.25rem' }}>
              <div className="brand-icon-box" style={{ background: '#0284c7' }}>
                <Heart size={22} color="#ffffff" strokeWidth={2.4} />
              </div>
              <div className="brand-text">
                <span className="brand-title" style={{ color: '#ffffff', fontSize: '1.3rem' }}>IndoStates</span>
                <span className="brand-subtitle" style={{ color: '#38bdf8' }}>Hospital</span>
              </div>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Delivering patient-first multi-specialty healthcare, 24x7 emergency and trauma resuscitation, and advanced clinical diagnostics with compassionate expertise.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={15} color="#38bdf8" />
                <span>24×7 Emergency & Critical Care Services</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={15} color="#f87171" />
                <span>Emergency Desk: {hospitalInfo.emergencyPhone}</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {hospitalInfo.socialLinks.facebook && (
                <a 
                  href={hospitalInfo.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#94a3b8', padding: '7px', borderRadius: '50%', background: '#0f2942', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="IndoStates Hospital Facebook"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {hospitalInfo.socialLinks.instagram && (
                <a 
                  href={hospitalInfo.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#94a3b8', padding: '7px', borderRadius: '50%', background: '#0f2942', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="IndoStates Hospital Instagram"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {hospitalInfo.socialLinks.linkedin && (
                <a 
                  href={hospitalInfo.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#94a3b8', padding: '7px', borderRadius: '50%', background: '#0f2942', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="IndoStates Hospital LinkedIn"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              )}
              {hospitalInfo.socialLinks.youtube && (
                <a 
                  href={hospitalInfo.socialLinks.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#94a3b8', padding: '7px', borderRadius: '50%', background: '#0f2942', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="IndoStates Hospital YouTube"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/about">About IndoStates</Link></li>
              <li><Link to="/departments">Clinical Departments</Link></li>
              <li><Link to="/doctors">Find a Doctor</Link></li>
              <li><Link to="/services">Healthcare Services</Link></li>
              <li><Link to="/facilities">Hospital Facilities</Link></li>
              <li><Link to="/health-packages">Health Checkup Packages</Link></li>
              <li><Link to="/gallery">Campus & Facility Gallery</Link></li>
              <li><Link to="/careers">Careers & Openings</Link></li>
              <li><Link to="/testimonials">Patient Experiences</Link></li>
            </ul>
          </div>

          {/* Column 3: Patient Care */}
          <div>
            <h4 className="footer-heading">Patient Care</h4>
            <ul className="footer-links">
              <li><Link to="/appointments">Book an Appointment</Link></li>
              <li><Link to="/emergency">Emergency & Trauma 24x7</Link></li>
              <li><Link to="/insurance">Insurance & Cashless Desk</Link></li>
              <li><Link to="/diagnostics">Laboratory & Diagnostics</Link></li>
              <li><Link to="/pharmacy">24x7 In-house Pharmacy</Link></li>
              <li><Link to="/patient-resources">Patient & Visitor Guide</Link></li>
              <li><Link to="/international-patients">International Patients</Link></li>
              <li><Link to="/health">Health Articles & Updates</Link></li>
              <li><Link to="/events">Health Camps & Events</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div>
            <h4 className="footer-heading">Contact & Location</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <MapPin size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  {hospitalInfo.addressLine1},<br />
                  {hospitalInfo.addressLine2},<br />
                  {hospitalInfo.city} - {hospitalInfo.pincode}, {hospitalInfo.country}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <PhoneCall size={17} color="#38bdf8" style={{ flexShrink: 0 }} />
                <a 
                  href={`tel:${hospitalInfo.generalPhone.replace(/\D/g, '') || '0000000000'}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Board: {hospitalInfo.generalPhone}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ShieldAlert size={17} color="#f87171" style={{ flexShrink: 0 }} />
                <a 
                  href={`tel:${hospitalInfo.emergencyPhone.replace(/\D/g, '') || '0000000000'}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Emergency: {hospitalInfo.emergencyPhone}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={17} color="#38bdf8" style={{ flexShrink: 0 }} />
                <a 
                  href={`mailto:${hospitalInfo.email}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {hospitalInfo.email}
                </a>
              </div>

              <div style={{ marginTop: '0.75rem' }}>
                <a
                  href={hospitalInfo.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ color: '#38bdf8', borderColor: '#38bdf8' }}
                >
                  <MapPin size={14} />
                  <span>Get Driving Directions</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Demo Notice */}
        <div 
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1.25rem',
            fontSize: '0.8rem',
            color: '#94a3b8',
            marginBottom: '2rem',
            lineHeight: 1.5
          }}
        >
          <strong style={{ color: '#fbbf24' }}>Notice to Hospital Management:</strong> This website preview utilizes structured placeholders and simulated demonstration data for doctors, timings, and contact numbers. Official clinical registries, hospital licenses, and accreditations must be verified and configured prior to production public launch.
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {currentYear} IndoStates Hospital. All rights reserved.
          </div>

          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/cookies">Cookie Policy</Link>
            <Link to="/medical-disclaimer">Medical Disclaimer</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
