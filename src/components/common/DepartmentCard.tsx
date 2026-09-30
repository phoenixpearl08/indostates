import React from 'react';
import { Link } from 'react-router-dom';
import { Department } from '../../types';
import { 
  HeartPulse, 
  Brain, 
  Bone, 
  Baby, 
  Stethoscope, 
  Scissors, 
  HeartHandshake, 
  Activity, 
  Eye, 
  Headphones, 
  Sparkles, 
  ShieldAlert, 
  ChevronRight,
  UserCheck
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  HeartPulse: <HeartPulse size={28} />,
  Brain: <Brain size={28} />,
  Bone: <Bone size={28} />,
  Baby: <Baby size={28} />,
  Stethoscope: <Stethoscope size={28} />,
  Scissors: <Scissors size={28} />,
  HeartHandshake: <HeartHandshake size={28} />,
  Activity: <Activity size={28} />,
  Eye: <Eye size={28} />,
  Headphones: <Headphones size={28} />,
  Sparkles: <Sparkles size={28} />,
  ShieldAlert: <ShieldAlert size={28} />
};

export const DepartmentCard: React.FC<{ department: Department }> = ({ department }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-hidden="true"
          >
            {iconMap[department.icon] || <Stethoscope size={28} />}
          </div>

          <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
            {department.category}
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.45rem', color: 'var(--color-text-main)' }}>
          <Link to={`/departments/${department.slug}`} style={{ color: 'inherit' }}>
            {department.name}
          </Link>
        </h3>

        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', flex: 1, marginBottom: '1.25rem', lineHeight: 1.55 }}>
          {department.shortDesc}
        </p>

        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            to={`/departments/${department.slug}`}
            style={{ fontSize: '0.86rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
          >
            <span>Overview</span>
            <ChevronRight size={14} />
          </Link>

          <Link
            to={`/doctors?department=${department.id}`}
            style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <UserCheck size={14} color="var(--color-secondary)" />
            <span>Doctors</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
