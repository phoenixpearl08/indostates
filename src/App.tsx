import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { EmergencyFloatingButton } from './components/layout/EmergencyFloatingButton';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { DepartmentDetailPage } from './pages/DepartmentDetailPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { DoctorDetailPage } from './pages/DoctorDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { PatientResourcesPage } from './pages/PatientResourcesPage';
import { InsurancePage } from './pages/InsurancePage';
import { DiagnosticsPage } from './pages/DiagnosticsPage';
import { PharmacyPage } from './pages/PharmacyPage';
import { HealthPackagesPage } from './pages/HealthPackagesPage';
import { HealthBlogPage } from './pages/HealthBlogPage';
import { HealthArticleDetailPage } from './pages/HealthArticleDetailPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { CareersPage } from './pages/CareersPage';
import { CareerDetailPage } from './pages/CareerDetailPage';
import { InternationalPatientsPage } from './pages/InternationalPatientsPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { SearchPage } from './pages/SearchPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Lazy-loaded Admin Portal for performance and complete separation from public bundle
const AdminPage = React.lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <ScrollToTop />
          <Header />
          <main id="main-content" style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/departments/:slug" element={<DepartmentDetailPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/doctors/:slug" element={<DoctorDetailPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/facilities" element={<FacilitiesPage />} />
              <Route path="/emergency" element={<EmergencyPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/patient-resources" element={<PatientResourcesPage />} />
              <Route path="/insurance" element={<InsurancePage />} />
              <Route path="/diagnostics" element={<DiagnosticsPage />} />
              <Route path="/pharmacy" element={<PharmacyPage />} />
              <Route path="/health-packages" element={<HealthPackagesPage />} />
              <Route path="/health" element={<HealthBlogPage />} />
              <Route path="/health/:slug" element={<HealthArticleDetailPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:slug" element={<EventDetailPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/careers/:slug" element={<CareerDetailPage />} />
              <Route path="/international-patients" element={<InternationalPatientsPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Legal / Policy Routes */}
              <Route path="/privacy" element={<LegalPage />} />
              <Route path="/terms" element={<LegalPage />} />
              <Route path="/cookies" element={<LegalPage />} />
              <Route path="/medical-disclaimer" element={<LegalPage />} />
              <Route path="/accessibility" element={<LegalPage />} />

              {/* Global Search */}
              <Route path="/search" element={<SearchPage />} />

              {/* Architecturally Isolated Admin Portal with RBAC Route Guards */}
              <Route 
                path="/admin" 
                element={
                  <React.Suspense fallback={<div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading Admin Portal...</div>}>
                    <AdminPage />
                  </React.Suspense>
                } 
              />
              <Route 
                path="/admin/:tab" 
                element={
                  <React.Suspense fallback={<div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading Admin Portal...</div>}>
                    <AdminPage />
                  </React.Suspense>
                } 
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <EmergencyFloatingButton />
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default App;
