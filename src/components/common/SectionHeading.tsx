import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface SectionHeadingProps {
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'emergency';
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  actionText?: string;
  actionPath?: string;
  id?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeType = 'primary',
  title,
  subtitle,
  align = 'center',
  actionText,
  actionPath,
  id
}) => {
  const isCentered = align === 'center';

  return (
    <div
      id={id}
      style={{
        display: 'flex',
        flexDirection: isCentered ? 'column' : 'row',
        alignItems: isCentered ? 'center' : 'flex-end',
        justifyContent: 'space-between',
        textAlign: isCentered ? 'center' : 'left',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      <div style={{ maxWidth: isCentered ? '740px' : '650px', width: '100%' }}>
        {badge && (
          <div style={{ marginBottom: '0.65rem' }}>
            <span className={`badge badge-${badgeType}`}>{badge}</span>
          </div>
        )}
        <h2 style={{ marginBottom: subtitle ? '0.5rem' : 0 }}>{title}</h2>
        {subtitle && (
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      {actionText && actionPath && (
        <div style={{ paddingBottom: isCentered ? '0' : '0.25rem' }}>
          <Link
            to={actionPath}
            className="btn btn-outline btn-sm"
            style={{ fontWeight: 600 }}
          >
            <span>{actionText}</span>
            <ChevronRight size={15} />
          </Link>
        </div>
      )}
    </div>
  );
};
