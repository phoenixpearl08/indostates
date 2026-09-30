import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';

interface DoctorPhotoPlaceholderProps {
  photoUrl?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'portrait';
  showBadge?: boolean;
}

export const DoctorPhotoPlaceholder: React.FC<DoctorPhotoPlaceholderProps> = ({
  photoUrl,
  name,
  size = 'md',
  showBadge = true
}) => {
  const [hasError, setHasError] = useState(false);

  // Portrait mode: full rectangular 3:4 aspect ratio for doctor profiles
  if (size === 'portrait') {
    const isImageAvailable = Boolean(photoUrl) && !hasError;

    return (
      <div
        style={{
          width: '100%',
          maxWidth: '320px',
          aspectRatio: '3/4',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: 'var(--color-bg-muted)',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
        role="img"
        aria-label={`Official photograph of ${name}`}
      >
        {isImageAvailable ? (
          <img
            src={photoUrl!}
            alt={`Official portrait of ${name}`}
            loading="lazy"
            decoding="async"
            onError={() => setHasError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
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
              padding: '1.5rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              color: 'var(--color-text-secondary)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '2px solid var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
                marginBottom: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Stethoscope size={34} />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--color-text-main)',
                lineHeight: 1.4,
                marginBottom: '0.45rem',
                maxWidth: '220px'
              }}
            >
              Official hospital image to be provided
            </div>

            {showBadge && (
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  padding: '3px 8px',
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
  }

  // Circular avatar modes
  const sizeMap = {
    sm: { container: 52, icon: 26, fontSize: '0.65rem' },
    md: { container: 74, icon: 34, fontSize: '0.7rem' },
    lg: { container: 130, icon: 60, fontSize: '0.75rem' }
  };

  const currentSize = sizeMap[size as 'sm' | 'md' | 'lg'] || sizeMap.md;

  if (photoUrl && !hasError) {
    return (
      <div 
        style={{
          width: currentSize.container,
          height: currentSize.container,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid var(--color-primary-light)',
          flexShrink: 0
        }}
      >
        <img
          src={photoUrl}
          alt={`Portrait of ${name}`}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
      <div
        style={{
          width: currentSize.container,
          height: currentSize.container,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative'
        }}
        aria-label={`Official photograph placeholder for ${name}`}
      >
        <Stethoscope size={currentSize.icon} />
      </div>

      {showBadge && (
        <span 
          style={{
            fontSize: currentSize.fontSize,
            color: 'var(--color-text-muted)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            textAlign: 'center',
            maxWidth: size === 'lg' ? '140px' : '90px',
            lineHeight: 1.2
          }}
        >
          [Photo to be provided]
        </span>
      )}
    </div>
  );
};
