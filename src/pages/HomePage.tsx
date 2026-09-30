import React from 'react';
import { Link } from 'react-router-dom';
import { 
  hospitalInfo, 
  masterHospitalData,
  departmentsData, 
  doctorsData, 
  servicesData, 
  facilitiesData, 
  healthPackagesData, 
  healthArticlesData, 
  healthEventsData, 
  testimonialsData 
} from '../data';
import { SectionHeading } from '../components/common/SectionHeading';
import { DoctorCard } from '../components/common/DoctorCard';
import { DepartmentCard } from '../components/common/DepartmentCard';
import { ServiceCard } from '../components/common/ServiceCard';
import { PackageCard } from '../components/common/PackageCard';
import { ArticleCard } from '../components/common/ArticleCard';
import { EventCard } from '../components/common/EventCard';
import { SEO } from '../components/common/SEO';
import { 
  Calendar, 
  ShieldAlert, 
  Search, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Heart, 
  Activity, 
  Sparkles, 
  Users, 
  Building2,
  Stethoscope,
  Award,
  Navigation,
  FileText
} from 'lucide-react';

/**
 * ==============================================================================
 * INDOSTATES HOSPITAL — PUBLIC HOMEPAGE
 * ==============================================================================
 * This is a 100% PUBLIC PATIENT-FACING HOSPITAL LANDING PAGE.
 *
 * It contains NO dashboard cards, NO internal metrics, NO staff management UI.
 * Internal admin tools are strictly architecturally isolated under /admin.
 *
 * SECTION ORDER:
 * C. Hero Section
 * D. Quick Actions (6 patient-friendly public quick action links)
 * E. About IndoStates Hospital
 * F. Key Specialties / Departments
 * G. Featured Doctors
 * H. Hospital Services
 * I. Facilities & Infrastructure
 * J. Health Packages
 * K. Why Choose IndoStates Hospital (Trust Pillars)
 * L. Health Articles / Health Updates
 * M. Events / Health Camps
 * N. Patient Testimonials (Demo Preview)
 * O. Appointment Call-to-Action
 * P. Hospital Location & Campus Contact
 * ==============================================================================
 */

export const HomePage: React.FC = () => {
  const featuredDoctors = doctorsData.filter((d) => d.isFeatured).slice(0, 4);
  const featuredDepartments = departmentsData.slice(0, 6);
  const featuredServices = servicesData.slice(0, 3);
  const featuredPackages = healthPackagesData.slice(0, 3);
  const featuredArticles = healthArticlesData.slice(0, 3);
  const upcomingEvents = healthEventsData.filter((e) => e.isUpcoming).slice(0, 2);

  return (
    <div>
      <SEO />
      {/* =====================================================================
          C. HERO SECTION
          ===================================================================== */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #022c4d 0%, #03487f 60%, #0369a1 100%)',
          color: '#ffffff',
          paddingTop: '4.5rem',
          paddingBottom: '5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle geometric pattern overlay */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.07,
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '820px' }}>
            {/* Institution Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.12)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <ShieldAlert size={15} color="#93c5fd" />
              <span>Multi-Specialty Healthcare Services • IndoStates Hospital</span>
            </div>

            {/* Hospital Headline */}
            <h1 style={{ color: '#ffffff', marginBottom: '1rem', lineHeight: 1.15, fontWeight: 800 }}>
              {hospitalInfo.tagline}
            </h1>

            {/* Hospital Introduction */}
            <p style={{ color: '#e0f2fe', fontSize: 'clamp(1.05rem, 1.5vw, 1.25rem)', lineHeight: 1.6, marginBottom: '2.25rem', maxWidth: '700px' }}>
              {hospitalInfo.subtagline}
            </p>

            {/* Hero Patient CTAs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/appointments" className="btn btn-secondary btn-lg">
                <Calendar size={18} />
                <span>Book an Appointment</span>
              </Link>

              <Link to="/doctors" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
                <Stethoscope size={18} />
                <span>Find a Doctor</span>
              </Link>

              <Link to="/emergency" className="btn btn-emergency btn-lg">
                <ShieldAlert size={18} />
                <span>Emergency Services</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          D. QUICK ACTIONS (6 Public Patient Quick Action Cards)
          ===================================================================== */}
      <section style={{ transform: 'translateY(-2rem)', zIndex: 10, position: 'relative' }}>
        <div className="container">
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              padding: '1.25rem',
              border: '1px solid var(--color-border-subtle)'
            }}
          >
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                gap: '0.85rem' 
              }}
            >
              {/* 1. Book Appointment */}
              <Link 
                to="/appointments" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.85rem 1rem', 
                  backgroundColor: 'var(--color-bg-base)', 
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  transition: 'background var(--transition-fast)'
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Book Appointment</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Online consultation</div>
                </div>
              </Link>

              {/* 2. Find a Doctor */}
              <Link 
                to="/doctors" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.85rem 1rem', 
                  backgroundColor: 'var(--color-bg-base)', 
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none'
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Stethoscope size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Find a Doctor</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Search specialists</div>
                </div>
              </Link>

              {/* 3. Departments */}
              <Link 
                to="/departments" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.85rem 1rem', 
                  backgroundColor: 'var(--color-bg-base)', 
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none'
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Departments</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Clinical disciplines</div>
                </div>
              </Link>

              {/* 4. Emergency */}
              <Link 
                to="/emergency" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.85rem 1rem', 
                  backgroundColor: 'var(--color-emergency-subtle)', 
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  border: '1px solid var(--color-emergency-border)'
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#fee2e2', color: 'var(--color-emergency)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-emergency)' }}>Emergency</div>
                  <div style={{ fontSize: '0.75rem', color: '#991b1b' }}>Urgent care triage</div>
                </div>
              </Link>

              {/* 5. Contact */}
              <Link 
                to="/contact" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.85rem 1rem', 
                  backgroundColor: 'var(--color-bg-base)', 
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none'
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PhoneCall size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Contact Us</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Reception desk</div>
                </div>
              </Link>

              {/* 6. Directions */}
              <a 
                href="#hospital-location" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.85rem 1rem', 
                  backgroundColor: 'var(--color-bg-base)', 
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none'
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>Directions</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Campus location</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          E. ABOUT INDOSTATES HOSPITAL
          ===================================================================== */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '3.5rem' }}>
            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <span className="badge badge-primary">About IndoStates Hospital</span>
              </div>
              <h2 style={{ marginBottom: '1.25rem', color: 'var(--color-primary-dark)' }}>
                Dedicated to Patient Well-Being with Professional Care and Empathy
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                IndoStates Hospital provides multi-specialty healthcare services, coordinating outpatient consultations, diagnostics, and patient-centered clinical care.
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                Our medical teams support patients across general medicine, surgical disciplines, pediatric health, and critical evaluations with structured clinical attention.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', fontWeight: 600 }}>Qualified Medical Team</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', fontWeight: 600 }}>Diagnostic & OT Facilities</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', fontWeight: 600 }}>Emergency Medical Care</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', fontWeight: 600 }}>Patient-Centric Support</span>
                </div>
              </div>

              <Link to="/about" className="btn btn-outline">
                <span>Know More About Us</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Visual Institutional Card */}
            <div 
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-primary-dark)' }}>Our Core Mission</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>IndoStates Institutional Charter</div>
                </div>
              </div>

              <blockquote style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', borderLeft: '3px solid var(--color-secondary)', paddingLeft: '1rem' }}>
                "To deliver ethical, evidence-based, and compassionate healthcare that makes advanced medical excellence accessible and supportive for every patient and family we serve."
              </blockquote>

              <div style={{ backgroundColor: 'var(--color-bg-base)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Outpatient Schedule</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-main)' }}>{hospitalInfo.opdHours}</div>
                </div>
                <Link to="/contact" className="btn btn-ghost btn-sm">
                  <span>Visit Info</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          F. KEY SPECIALTIES / DEPARTMENTS
          ===================================================================== */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeading
            badge="Clinical Disciplines"
            title="Key Medical & Surgical Specialties"
            subtitle="Providing comprehensive diagnostic, outpatient, and surgical care across core healthcare disciplines."
            actionText="View All Departments"
            actionPath="/departments"
          />

          <div className="grid grid-cols-3">
            {featuredDepartments.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          G. FEATURED DOCTORS
          ===================================================================== */}
      <section className="section">
        <div className="container">
          <SectionHeading
            badge="Medical Team"
            title="Consult with Experienced Physicians"
            subtitle="Our clinical consultants bring years of dedicated patient care, diagnostic acumen, and surgical expertise."
            actionText="Browse Doctor Directory"
            actionPath="/doctors"
          />

          <div className="grid grid-cols-4">
            {featuredDoctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          H. HOSPITAL SERVICES
          ===================================================================== */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeading
            badge="Comprehensive Capabilities"
            title="Hospital Care & Medical Services"
            subtitle="From urgent emergency stabilization to minimally invasive procedures, clinical laboratories, and daycare services."
            actionText="Explore All Services"
            actionPath="/services"
          />

          <div className="grid grid-cols-3">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          I. FACILITIES & INFRASTRUCTURE
          ===================================================================== */}
      <section className="section">
        <div className="container">
          <SectionHeading
            badge="Infrastructure"
            title="Modern Patient-Centered Facilities"
            subtitle="Engineered for patient safety, clinical precision, hygienic recovery environments, and family convenience."
            actionText="View All Facilities"
            actionPath="/facilities"
          />

          <div className="grid grid-cols-4">
            {facilitiesData.slice(0, 4).map((fac) => (
              <div 
                key={fac.id}
                className="card"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ marginBottom: '0.75rem' }}>
                  <span className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>{fac.category}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                  {fac.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', flex: 1, lineHeight: 1.55 }}>
                  {fac.shortDesc}
                </p>
                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.75rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <span>{fac.floor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          J. HEALTH PACKAGES
          ===================================================================== */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeading
            badge="Preventive Healthcare"
            title="Tailored Health Checkup Packages"
            subtitle="Routine screening saves lives. Comprehensive evaluations designed for busy executives, seniors, and families."
            actionText="View All Health Packages"
            actionPath="/health-packages"
          />

          <div className="grid grid-cols-3">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          K. WHY CHOOSE INDOSTATES HOSPITAL (Trust Pillars)
          ===================================================================== */}
      <section className="section">
        <div className="container">
          <SectionHeading
            badge="Why IndoStates Hospital"
            title="Why Patients and Families Choose Us"
            subtitle="A patient-centric healthcare environment combining medical expertise, transparent ethics, and empathetic bedside care."
          />

          <div className="grid grid-cols-4" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid var(--color-primary)' }}>
              <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.15rem' }}>
                <Stethoscope size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                Experienced Specialists
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Senior medical consultants, surgeons, and physicians committed to clinical precision and evidence-based patient management.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid var(--color-secondary)' }}>
              <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.15rem' }}>
                <Heart size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-secondary-dark)', marginBottom: '0.5rem' }}>
                Patient Dignity & Care
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Empathetic communication, active listening, and continuous support to ensure you and your family feel secure at every visit.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid #0284c7' }}>
              <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.15rem' }}>
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                Modern Infrastructure
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Laminar flow surgical theatres, equipped diagnostic testing laboratories, and hygienic inpatient recovery accommodations.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid #16a34a' }}>
              <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.15rem' }}>
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                Ethical & Transparent
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Transparent clinical advice, clear billing coordination with insurance desks, and adherence to healthcare ethics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          L. HEALTH ARTICLES / HEALTH UPDATES
          ===================================================================== */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeading
            badge="Health Knowledge"
            title="Educational Articles & Clinical Insights"
            subtitle="Reliable healthcare guidance from our hospital clinical review team to help you make informed decisions."
            actionText="Read Health Articles"
            actionPath="/health"
          />

          <div className="grid grid-cols-3">
            {featuredArticles.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          M. EVENTS / HEALTH CAMPS
          ===================================================================== */}
      {upcomingEvents.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              badge="Community Outreach"
              title="Upcoming Health Camps & Workshops"
              subtitle="Participate in our free community screening camps and wellness sessions."
              actionText="View All Events"
              actionPath="/events"
            />

            <div className="grid grid-cols-2">
              {upcomingEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          N. PATIENT TESTIMONIALS (Demo Preview)
          ===================================================================== */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeading
            badge="Patient Experiences (Demonstration Preview)"
            title="Sample Patient Perspectives"
            subtitle="Illustrative feedback representations. Official hospital patient testimonials will be published following patient consent and institutional verification."
            actionText="View Testimonials"
            actionPath="/testimonials"
          />

          <div className="grid grid-cols-3">
            {testimonialsData.slice(0, 3).map((test) => (
              <div key={test.id} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: 'var(--color-warning)', fontSize: '1rem', marginBottom: '0.75rem' }}>
                  {'★'.repeat(test.rating)}
                </div>
                <blockquote style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem' }}>
                  "{test.feedback}"
                </blockquote>
                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                    {test.patientName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    {test.treatmentType} • {test.departmentName.split(' ')[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          O. APPOINTMENT CALL-TO-ACTION
          ===================================================================== */}
      <section 
        style={{ 
          background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', 
          color: '#ffffff', 
          padding: '4rem 0' 
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <span className="badge badge-secondary" style={{ marginBottom: '1rem' }}>Prompt Consultations</span>
            <h2 style={{ color: '#ffffff', marginBottom: '1rem' }}>
              Schedule Your Consultation with IndoStates Specialists
            </h2>
            <p style={{ color: '#e0f2fe', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Select your clinical specialty, preferred doctor, and time slot. Our scheduling coordinator will connect with you to confirm your appointment.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/appointments" className="btn btn-secondary btn-lg">
                <Calendar size={18} />
                <span>Book Appointment Online</span>
              </Link>
              <Link to="/emergency" className="btn btn-emergency btn-lg">
                <ShieldAlert size={18} />
                <span>Emergency Help: {hospitalInfo.emergencyPhone}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          P. HOSPITAL LOCATION / CONTACT SECTION
          ===================================================================== */}
      <section id="hospital-location" className="section">
        <div className="container">
          <SectionHeading
            badge="Hospital Campus"
            title="Location & Visiting Information"
            subtitle="IndoStates Hospital campus is planned for convenient vehicular access, dedicated emergency ambulance drop-off, and barrier-free patient mobility."
          />

          <div className="grid grid-cols-2" style={{ gap: '2.5rem', alignItems: 'stretch' }}>
            {/* Address & Timings Card */}
            <div className="card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>IndoStates Hospital Campus</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Main Healthcare Complex</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                  <div>
                    <strong style={{ color: 'var(--color-text-main)' }}>Hospital Address:</strong>
                    <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {masterHospitalData.address.street}, {masterHospitalData.address.area}, {masterHospitalData.address.city}, {masterHospitalData.address.state} - {masterHospitalData.address.pincode}
                    </div>
                  </div>

                  <div>
                    <strong style={{ color: 'var(--color-text-main)' }}>Outpatient (OPD) Consultation:</strong>
                    <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {hospitalInfo.opdHours}
                    </div>
                  </div>

                  <div>
                    <strong style={{ color: 'var(--color-emergency)' }}>Emergency & Trauma Desk:</strong>
                    <div style={{ color: 'var(--color-emergency)', fontWeight: 600, marginTop: '2px' }}>
                      {hospitalInfo.emergencyAvailability}
                    </div>
                  </div>

                  <div>
                    <strong style={{ color: 'var(--color-text-main)' }}>Telephone Switchboard:</strong>
                    <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      General: <a href={`tel:${hospitalInfo.generalPhone.replace(/\D/g, '') || '0000000000'}`} style={{ color: 'inherit', textDecoration: 'none' }}>{hospitalInfo.generalPhone}</a> | Emergency: <a href={`tel:${hospitalInfo.emergencyPhone.replace(/\D/g, '') || '0000000000'}`} style={{ color: 'inherit', textDecoration: 'none' }}>{hospitalInfo.emergencyPhone}</a>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <a 
                  href={hospitalInfo.googleMapsDirectionsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                >
                  <Navigation size={16} />
                  <span>Get Map Directions</span>
                </a>

                <Link to="/contact" className="btn btn-outline">
                  <PhoneCall size={16} />
                  <span>Contact Hospital Reception</span>
                </Link>
              </div>
            </div>

            {/* Campus Access Highlights Card */}
            <div 
              className="card" 
              style={{ 
                padding: '2.25rem', 
                backgroundColor: 'var(--color-bg-base)', 
                border: '1px solid var(--color-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '1.25rem' }}>
                  Patient & Visitor Conveniences
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <CheckCircle2 size={18} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: 'var(--color-text-main)' }}>Dedicated Emergency Drop-off:</strong>
                      <div>Immediate ambulance and patient drop-off ramp directly into the emergency triage suite.</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <CheckCircle2 size={18} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: 'var(--color-text-main)' }}>Barrier-Free Accessibility:</strong>
                      <div>Tactile indicators, gentle wheelchair ramps, and stretcher elevators connecting all clinical floors.</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <CheckCircle2 size={18} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: 'var(--color-text-main)' }}>In-House Pharmacy & Lab Specimen Desk:</strong>
                      <div>Ground-floor clinical facilities for immediate medication dispensing and laboratory specimen submission.</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <CheckCircle2 size={18} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: 'var(--color-text-main)' }}>Dedicated Visitor Parking:</strong>
                      <div>Multi-bay organized visitor parking with priority bays for mobility-assisted vehicles.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.25rem', marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Have an inquiry before visiting? Call our help desk or review <Link to="/patient-resources" style={{ fontWeight: 600 }}>Patient Resources</Link> for admission policies.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
