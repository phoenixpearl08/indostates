import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { healthArticlesData } from '../data';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ArticleCard } from '../components/common/ArticleCard';
import { MedicalDisclaimerBanner } from '../components/common/MedicalDisclaimerBanner';
import { SEO } from '../components/common/SEO';
import { Search, Clock, ArrowRight, User } from 'lucide-react';

export const HealthBlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Preventive Health', 'Heart Health', 'Women’s Health', 'Children’s Health', 'Senior Care', 'Nutrition'];

  const featuredArticle = healthArticlesData.find((a) => a.isFeatured) || healthArticlesData[0];

  const filteredArticles = healthArticlesData.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div>
      <SEO
        title="Health Articles & Clinical Insights"
        description="Evidence-based medical articles, doctor advice, and wellness guides published by clinical specialists at IndoStates Hospital."
        keywords="health blog, medical articles, doctor health tips, wellness, IndoStates Hospital"
      />
      <Breadcrumb items={[{ label: 'Health & Clinical Insights' }]} />

      <section className="section-sm" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Patient Education</span>
            <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              Health Articles & Medical Insights
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Evidence-based health guidance and wellness awareness prepared by the IndoStates Hospital clinical advisory panel to empower healthy living.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Medical Disclaimer Alert */}
          <MedicalDisclaimerBanner compact />

          {/* Featured Article Hero (When no search active) */}
          {!searchQuery && selectedCategory === 'All' && featuredArticle && (
            <div 
              className="card"
              style={{
                padding: '2.5rem',
                margin: '2rem 0 3rem 0',
                background: 'linear-gradient(135deg, #f0f7ff, #ffffff)',
                border: '1px solid var(--color-border-medium)'
              }}
            >
              <div style={{ maxWidth: '820px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary">Featured Article</span>
                  <span className="badge badge-secondary">{featuredArticle.category}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={12} />
                    <span>{featuredArticle.readTime}</span>
                  </span>
                </div>

                <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', marginBottom: '0.85rem', color: 'var(--color-primary-dark)' }}>
                  <Link to={`/health/${featuredArticle.slug}`} style={{ color: 'inherit' }}>
                    {featuredArticle.title}
                  </Link>
                </h2>

                <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  {featuredArticle.excerpt}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    <User size={14} color="var(--color-primary)" />
                    <span>By {featuredArticle.authorName} ({featuredArticle.publishedDate})</span>
                  </div>

                  <Link to={`/health/${featuredArticle.slug}`} className="btn btn-primary btn-sm">
                    <span>Read Complete Article</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Search & Category Filter Toolbar */}
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              boxShadow: 'var(--shadow-xs)',
              border: '1px solid var(--color-border-subtle)',
              marginBottom: '2.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search 
                size={18} 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} 
              />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="Search articles, symptoms, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-3">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div 
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--color-border-medium)',
                padding: '3.5rem 1.5rem',
                textAlign: 'center'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                No health articles match your search
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
                Try searching for different symptoms or reset the category filter to explore all clinical insights.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="btn btn-outline btn-sm"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
