import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { healthArticlesData } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ArticleCard } from '../components/common/ArticleCard';
import { MedicalDisclaimerBanner } from '../components/common/MedicalDisclaimerBanner';
import { SEO } from '../components/common/SEO';
import { Calendar, Clock, User, Tag, ArrowLeft, Share2 } from 'lucide-react';

export const HealthArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = healthArticlesData.find((a) => a.slug === slug);

  if (!article) {
    return <Navigate to="/health" replace />;
  }

  const relatedArticles = healthArticlesData
    .filter((a) => a.id !== article.id && a.category === article.category)
    .concat(healthArticlesData.filter((a) => a.id !== article.id && a.category !== article.category))
    .slice(0, 3);

  return (
    <div>
      <SEO
        title={article.title}
        description={article.excerpt}
        keywords={`${article.tags.join(', ')}, ${article.category}, health tips, IndoStates Hospital`}
        ogType="article"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          headline: article.title,
          description: article.excerpt,
          author: {
            '@type': 'Organization',
            name: 'IndoStates Hospital Clinical Advisory Panel'
          },
          publisher: {
            '@type': 'Hospital',
            name: 'IndoStates Hospital'
          }
        }}
      />

      <Breadcrumb
        items={[
          { label: 'Health Articles', path: '/health' },
          { label: article.title }
        ]}
      />

      <article className="section-sm">
        <div className="container" style={{ maxWidth: '860px' }}>
          {/* Header Metadata */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <span className="badge badge-primary">{article.category}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <Clock size={13} />
                <span>{article.readTime}</span>
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--color-primary-dark)', marginBottom: '1rem', lineHeight: 1.25 }}>
              {article.title}
            </h1>

            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 0',
                borderTop: '1px solid var(--color-border-subtle)',
                borderBottom: '1px solid var(--color-border-subtle)',
                flexWrap: 'wrap',
                gap: '1rem',
                fontSize: '0.88rem',
                color: 'var(--color-text-muted)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={15} color="var(--color-primary)" />
                <span><strong>Reviewed by:</strong> {article.authorName} ({article.authorRole})</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={15} />
                <span>Published: {article.publishedDate}</span>
              </div>
            </div>
          </div>

          {/* Lead Excerpt */}
          <p 
            style={{
              fontSize: '1.15rem',
              color: 'var(--color-text-main)',
              lineHeight: 1.7,
              fontWeight: 500,
              marginBottom: '2rem',
              borderLeft: '4px solid var(--color-secondary)',
              paddingLeft: '1.25rem',
              backgroundColor: 'var(--color-bg-base)',
              padding: '1rem 1.25rem',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0'
            }}
          >
            {article.excerpt}
          </p>

          {/* Article Paragraphs */}
          <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            {article.content.map((paragraph, idx) => (
              <p key={idx} style={{ margin: 0 }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Tag size={16} color="var(--color-text-muted)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Tags:</span>
            {article.tags.map((tag) => (
              <span 
                key={tag}
                style={{
                  backgroundColor: 'var(--color-bg-base)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-text-secondary)'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Clinical Disclaimer Banner */}
          <MedicalDisclaimerBanner />

          {/* Bottom Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.5rem' }}>
            <Link to="/health" className="btn btn-outline btn-sm">
              <ArrowLeft size={14} />
              <span>Back to All Articles</span>
            </Link>

            <Link to="/appointments" className="btn btn-primary btn-sm">
              <Calendar size={14} />
              <span>Consult a Doctor</span>
            </Link>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--color-border-subtle)' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem' }}>
                Related Health Guidance
              </h3>
              <div className="grid grid-cols-3">
                {relatedArticles.map((rel) => (
                  <ArticleCard key={rel.id} article={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};
