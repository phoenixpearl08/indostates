import React, { useState } from 'react';
import { 
  Building2, 
  Stethoscope, 
  Activity, 
  Bed, 
  Calendar, 
  FileText, 
  Camera, 
  ShieldCheck, 
  Image as ImageIcon 
} from 'lucide-react';

export type ImageCategory = 
  | 'hospital' 
  | 'doctor' 
  | 'department' 
  | 'facility' 
  | 'service' 
  | 'event' 
  | 'gallery' 
  | 'article' 
  | 'logo';

export interface HospitalImageProps {
  src?: string | null;
  alt: string;
  category?: ImageCategory;
  aspectRatio?: '16/9' | '4/3' | '3/2' | '3/4' | '1/1' | string;
  placeholderText?: string;
  className?: string;
  style?: React.CSSProperties;
  objectFit?: 'cover' | 'contain';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  showBadge?: boolean;
}

const categoryIcons: Record<ImageCategory, React.ReactNode> = {
  hospital: <Building2 size={28} />,
  doctor: <Stethoscope size={30} />,
  department: <Activity size={28} />,
  facility: <Bed size={28} />,
  service: <ShieldCheck size={28} />,
  event: <Calendar size={28} />,
  gallery: <Camera size={28} />,
  article: <FileText size={28} />,
  logo: <Building2 size={24} />
};

export const HospitalImage: React.FC<HospitalImageProps> = ({
  src,
  alt,
  category = 'hospital',
  aspectRatio = '16/9',
  placeholderText,
  className = '',
  style = {},
  objectFit = 'cover',
  rounded = 'md',
  showBadge = true
}) => {
  const [hasError, setHasError] = useState(false);

  const borderRadiusMap = {
    none: '0',
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    full: '50%'
  };

  const isPlaceholder = !src || hasError;

  return (
    <div
      className={`hospital-image-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: aspectRatio,
        borderRadius: borderRadiusMap[rounded],
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg-muted)',
        border: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
      role="img"
      aria-label={alt}
    >
      {!isPlaceholder ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: objectFit,
            display: 'block'
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            color: 'var(--color-text-secondary)',
            userSelect: 'none'
          }}
        >
          {/* Subtle medical blueprint watermark */}
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1.5px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              marginBottom: '0.65rem',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            {categoryIcons[category] || <ImageIcon size={26} />}
          </div>

          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--color-text-main)',
              lineHeight: 1.35,
              maxWidth: '240px',
              marginBottom: '0.35rem'
            }}
          >
            {placeholderText || 'Official hospital image to be provided'}
          </div>

          {showBadge && (
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-text-muted)',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              [HOSPITAL TO PROVIDE]
            </span>
          )}
        </div>
      )}
    </div>
  );
};
