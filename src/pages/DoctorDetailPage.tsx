import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { doctorsData } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { DoctorProfile } from '../components/common/DoctorProfile';
import { SEO } from '../components/common/SEO';

export const DoctorDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const doctor = doctorsData.find((d) => d.slug === slug);

  if (!doctor) {
    return <Navigate to="/doctors" replace />;
  }

  return (
    <div>
      <SEO
        title={`${doctor.name} — ${doctor.designation || doctor.title}`}
        description={`Consult ${doctor.name}, ${doctor.designation || doctor.title} in ${doctor.department || doctor.departmentName} at IndoStates Hospital.`}
        keywords={`${doctor.name}, ${doctor.specialization}, ${doctor.department || doctor.departmentName}, doctor appointment, IndoStates Hospital`}
        ogType="profile"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Physician',
          name: doctor.name,
          medicalSpecialty: doctor.specialization,
          worksFor: {
            '@type': 'Hospital',
            name: 'IndoStates Hospital'
          }
        }}
      />

      <Breadcrumb
        items={[
          { label: 'Doctors', path: '/doctors' },
          { label: doctor.name }
        ]}
      />

      <section className="section">
        <div className="container">
          <DoctorProfile doctor={doctor} />
        </div>
      </section>
    </div>
  );
};

