import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  PhoneCall, 
  Clock, 
  Menu, 
  X, 
  Calendar, 
  Search, 
  ShieldAlert, 
  Heart, 
  MapPin, 
  ChevronRight,
  Globe
} from 'lucide-react';
import { hospitalInfo } from '../../data';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const navigate = useNavigate();

  const closeMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Departments', path: '/departments' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'Services', path: '/services' },
    { label: 'Facilities', path: '/facilities' },
    { label: 'Patient Resources', path: '/patient-resources' },
    { label: 'Health & Updates', path: '/health' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <header className="site-header">
      {/* 24x7 Emergency & Helpline Top Bar */}
      <div className="emergency-topbar">
        <div className="container emergency-topbar-content">
          <div className="emergency-tag">
            <ShieldAlert size={15} />
            <span>24×7 Emergency & Trauma Care Available</span>
          </div>

          <div className="emergency-links">
            <a 
              href={`tel:${hospitalInfo.emergencyPhone.replace(/\D/g, '') || '0000000000'}`}
              className="emergency-link-item" 
              title="Call Emergency Telephone"
              style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <PhoneCall size={14} color="#f87171" />
              <span>Emergency: <strong>{hospitalInfo.emergencyPhone}</strong></span>
            </a>

            <span className="emergency-link-item" style={{ display: 'none' /* Tablet+ only */ }}>
              <Clock size={14} />
              <span>OPD: 08:00 AM – 08:00 PM</span>
            </span>

            {/* Language Selector Architecture */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                aria-label="Language selection"
              >
                <Globe size={13} />
                <span>{selectedLang}</span>
              </button>

              {langDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: '#ffffff',
                    color: 'var(--color-text-main)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--color-border-subtle)',
                    zIndex: 100,
                    minWidth: '110px',
                    overflow: 'hidden'
                  }}
                >
                  {['English', 'தமிழ் (Tamil)', 'हिंदी (Hindi)'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang.split(' ')[0]);
                        setLangDropdown(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '6px 12px',
                        background: 'none',
                        border: 'none',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        color: 'var(--color-text-main)'
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="container">
        <div className="header-inner">
          {/* Logo / Brand */}
          <Link to="/" className="brand-logo" onClick={closeMenu}>
            <div className="brand-icon-box" aria-hidden="true">
              <Heart size={24} strokeWidth={2.4} fill="rgba(255,255,255,0.15)" />
            </div>
            <div className="brand-text">
              <span className="brand-title">IndoStates</span>
              <span className="brand-subtitle">Hospital</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="header-actions">
            {/* Global Search Button */}
            <button
              onClick={() => navigate('/search')}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)' }}
              aria-label="Search IndoStates Hospital"
              title="Search Doctors, Specialties, Services"
            >
              <Search size={18} />
            </button>

            {/* Emergency Button */}
            <Link
              to="/emergency"
              className="btn btn-emergency btn-sm"
              title="Emergency and trauma care information"
            >
              <ShieldAlert size={16} />
              <span className="hide-on-mobile">Emergency</span>
            </Link>

            {/* Primary Appointment CTA */}
            <Link
              to="/appointments"
              className="btn btn-primary btn-sm"
            >
              <Calendar size={16} />
              <span>Book Appointment</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div 
            className="mobile-drawer-backdrop" 
            onClick={closeMenu} 
            aria-hidden="true" 
          />
          <aside className="mobile-drawer" aria-label="Mobile Navigation Menu">
            <div className="mobile-drawer-header">
              <div className="brand-logo">
                <div className="brand-icon-box" style={{ width: 36, height: 36 }}>
                  <Heart size={20} strokeWidth={2.4} />
                </div>
                <div className="brand-text">
                  <span className="brand-title" style={{ fontSize: '1.15rem' }}>IndoStates</span>
                  <span className="brand-subtitle">Hospital</span>
                </div>
              </div>
              <button
                onClick={closeMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px',
                  cursor: 'pointer',
                  color: 'var(--color-text-main)'
                }}
                aria-label="Close mobile menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Quick Mobile Action Shortcuts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <Link
                to="/appointments"
                onClick={closeMenu}
                className="btn btn-primary btn-block"
              >
                <Calendar size={16} />
                <span>Book Appointment</span>
              </Link>
              <Link
                to="/emergency"
                onClick={closeMenu}
                className="btn btn-emergency btn-block"
              >
                <ShieldAlert size={16} />
                <span>24x7 Emergency Care</span>
              </Link>
            </div>

            {/* Mobile Navigation List */}
            <nav style={{ flex: 1 }}>
              <ul className="mobile-nav-list">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      onClick={closeMenu}
                      className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                    >
                      <ChevronRight size={16} color="var(--color-primary-light)" />
                      <span>{link.label}</span>
                    </NavLink>
                  </li>
                ))}
                <li>
                  <NavLink
                    to="/insurance"
                    onClick={closeMenu}
                    className="mobile-nav-link"
                  >
                    <ChevronRight size={16} color="var(--color-primary-light)" />
                    <span>Insurance & Cashless Desk</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/health-packages"
                    onClick={closeMenu}
                    className="mobile-nav-link"
                  >
                    <ChevronRight size={16} color="var(--color-primary-light)" />
                    <span>Health Checkup Packages</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/gallery"
                    onClick={closeMenu}
                    className="mobile-nav-link"
                  >
                    <ChevronRight size={16} color="var(--color-primary-light)" />
                    <span>Hospital Campus Gallery</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/international-patients"
                    onClick={closeMenu}
                    className="mobile-nav-link"
                  >
                    <ChevronRight size={16} color="var(--color-primary-light)" />
                    <span>International Patients</span>
                  </NavLink>
                </li>
              </ul>
            </nav>

            {/* Contact quick links in drawer footer */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <PhoneCall size={14} color="var(--color-primary)" />
                <a 
                  href={`tel:${hospitalInfo.generalPhone.replace(/\D/g, '') || '0000000000'}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Helpline: {hospitalInfo.generalPhone}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="var(--color-primary)" />
                <span>{hospitalInfo.addressLine1}, {hospitalInfo.city}</span>
              </div>
            </div>
          </aside>
        </>
      )}
    </header>
  );
};
