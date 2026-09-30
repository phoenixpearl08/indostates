import React, { useEffect } from 'react';
import { hospitalInfo } from '../../data';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'profile';
  schema?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  schema
}) => {
  useEffect(() => {
    // Dynamic Page Title
    const formattedTitle = title 
      ? `${title} | ${hospitalInfo.name}`
      : `${hospitalInfo.name} — ${hospitalInfo.tagline}`;
    document.title = formattedTitle;

    // Meta Description
    const metaDescription = description || hospitalInfo.subtagline;
    let descElem = document.querySelector('meta[name="description"]');
    if (!descElem) {
      descElem = document.createElement('meta');
      descElem.setAttribute('name', 'description');
      document.head.appendChild(descElem);
    }
    descElem.setAttribute('content', metaDescription);

    // Meta Keywords
    if (keywords) {
      let keyElem = document.querySelector('meta[name="keywords"]');
      if (!keyElem) {
        keyElem = document.createElement('meta');
        keyElem.setAttribute('name', 'keywords');
        document.head.appendChild(keyElem);
      }
      keyElem.setAttribute('content', keywords);
    }

    // OpenGraph Title & Description
    const ogTitleElem = document.querySelector('meta[property="og:title"]');
    if (ogTitleElem) ogTitleElem.setAttribute('content', formattedTitle);

    const ogDescElem = document.querySelector('meta[property="og:description"]');
    if (ogDescElem) ogDescElem.setAttribute('content', metaDescription);

    const ogTypeElem = document.querySelector('meta[property="og:type"]');
    if (ogTypeElem) ogTypeElem.setAttribute('content', ogType);

    // Canonical Link
    const currentUrl = canonicalUrl || window.location.href;
    let canonicalElem = document.querySelector('link[rel="canonical"]');
    if (canonicalElem) {
      canonicalElem.setAttribute('href', currentUrl);
    }

    // Dynamic Schema Injection (if provided)
    let scriptTag: HTMLScriptElement | null = null;
    if (schema) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.setAttribute('data-dynamic-seo', 'true');
      scriptTag.textContent = JSON.stringify(schema);
      document.head.appendChild(scriptTag);
    }

    return () => {
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [title, description, keywords, canonicalUrl, ogType, schema]);

  return null;
};
