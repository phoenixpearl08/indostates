import React from 'react';
import { Link } from 'react-router-dom';
import { HealthArticle } from '../../types';
import { Calendar, Clock, ChevronRight, User } from 'lucide-react';

export const ArticleCard: React.FC<{ article: HealthArticle }> = ({ article }) => {
  return (
    <article className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
            {article.category}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={12} />
            <span>{article.readTime}</span>
          </span>
        </div>

        <h3 style={{ fontSize: '1.18rem', marginBottom: '0.65rem', lineHeight: 1.35 }}>
          <Link to={`/health/${article.slug}`} style={{ color: 'inherit' }}>
            {article.title}
          </Link>
        </h3>

        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', flex: 1, marginBottom: '1.25rem', lineHeight: 1.6 }}>
          {article.excerpt}
        </p>

        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.85rem', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={13} color="var(--color-secondary)" />
            <span style={{ fontWeight: 500 }}>{article.authorName}</span>
          </div>

          <Link
            to={`/health/${article.slug}`}
            style={{ fontWeight: 600, color: 'var(--color-primary-light)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
          >
            <span>Read</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};
