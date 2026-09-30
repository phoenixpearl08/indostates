export interface LegalSection {
  title: string;
  lastUpdated: string;
  reviewNotice: string;
  paragraphs: { heading?: string; body: string }[];
}

export const legalData: Record<string, LegalSection> = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'September 2026',
    reviewNotice: 'NOTICE: This privacy statement is a prototype draft provided for website layout and architectural demonstration. It must be customized, reviewed, and approved by IndoStates Hospital legal and compliance teams prior to public production deployment.',
    paragraphs: [
      {
        heading: '1. Introduction & Scope',
        body: 'IndoStates Hospital ("we", "our", or "the Hospital") respects your personal privacy and is committed to protecting any personal and health-related information you share through this website. This Privacy Policy outlines our procedures regarding the collection, use, and disclosure of information gathered through our public web portal.'
      },
      {
        heading: '2. Information We Collect Online',
        body: 'Through our appointment request forms, contact inquiries, and feedback portals, we may collect basic identifying details such as your name, telephone number, email address, preferred appointment date, and clinical specialty requested. We do not store sensitive personal financial credentials or complete electronic health records on this public frontend portal.'
      },
      {
        heading: '3. Purpose of Information Collection',
        body: 'Information provided through website forms is utilized strictly to: (a) schedule, coordinate, and confirm outpatient appointments; (b) respond to customer inquiries and feedback; (c) facilitate patient communications regarding hospital services; and (d) comply with statutory healthcare regulations.'
      },
      {
        heading: '4. Confidentiality & Medical Privacy',
        body: 'Patient confidentiality is fundamental to our clinical ethics. Your details are never sold, rented, or traded with third-party commercial advertisers. Information is only accessible to authorized hospital coordinators and clinical staff tasked with scheduling your care.'
      },
      {
        heading: '5. Security Protocols',
        body: 'We implement industry-standard administrative, physical, and technical safeguards including SSL/TLS encryption, secure server hosting, and role-based data access to protect information transmitted across our web interfaces.'
      }
    ]
  },
  terms: {
    title: 'Terms & Conditions of Website Use',
    lastUpdated: 'September 2026',
    reviewNotice: 'NOTICE: These terms represent a standard framework for the IndoStates Hospital website prototype. Official institutional terms and conditions must be formally vetted by hospital legal counsel.',
    paragraphs: [
      {
        heading: '1. Acceptance of Terms',
        body: 'By accessing or utilizing the IndoStates Hospital website, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions and our Privacy Policy.'
      },
      {
        heading: '2. Informational Purpose Only',
        body: 'All content provided on this website—including health articles, medical specialty overviews, and physician bios—is published strictly for general educational and informational purposes. It is not intended as a substitute for professional medical diagnosis, advice, or treatment.'
      },
      {
        heading: '3. Appointment Requests vs. Formal Confirmation',
        body: 'Submission of an appointment request via this website signifies an expression of interest for a consultation slot. An appointment is legally and clinically confirmed only when hospital scheduling staff verify doctor availability and contact you via phone, SMS, or official email.'
      },
      {
        heading: '4. Emergency Situations',
        body: 'In the event of an acute medical emergency, chest pain, trauma, or breathing difficulty, do not use online forms. Immediately contact the 24x7 emergency helpline or proceed directly to the nearest hospital emergency department.'
      },
      {
        heading: '5. Intellectual Property',
        body: 'All brand names, trademarks, logos, texts, and graphics displayed on this website are the property of IndoStates Hospital and may not be reproduced or distributed without prior written consent.'
      }
    ]
  },
  cookies: {
    title: 'Cookie Policy',
    lastUpdated: 'September 2026',
    reviewNotice: 'NOTICE: Cookie policy draft for prototype testing. Must align with local digital privacy mandates upon production deployment.',
    paragraphs: [
      {
        heading: '1. What Are Cookies?',
        body: 'Cookies are small text files stored on your computer or mobile device when you visit web pages. They help web systems remember your preferences, session state, and enhance user experience.'
      },
      {
        heading: '2. How We Use Cookies',
        body: 'IndoStates Hospital utilizes essential cookies necessary for website navigation, user session persistence, and anonymized analytics to observe general website traffic patterns and improve performance.'
      },
      {
        heading: '3. Managing Cookie Preferences',
        body: 'You may modify your browser settings to refuse or delete cookies at any time. Disabling essential cookies may result in certain features of the site functioning sub-optimally.'
      }
    ]
  },
  'medical-disclaimer': {
    title: 'Medical & Clinical Disclaimer',
    lastUpdated: 'September 2026',
    reviewNotice: 'CRITICAL HEALTHCARE NOTICE: Please read this clinical disclaimer carefully before relying on any health information published on this website.',
    paragraphs: [
      {
        heading: 'No Doctor-Patient Relationship Established',
        body: 'Browsing this website, reading health blogs, or submitting an online contact/appointment form does not constitute or establish a doctor-patient clinical relationship between you and IndoStates Hospital or any individual healthcare professional.'
      },
      {
        heading: 'Not Medical Advice',
        body: 'The articles, FAQs, package descriptions, and health information presented on this website are for educational and awareness purposes only. Never disregard professional medical counsel or delay seeking it because of something you have read on this website.'
      },
      {
        heading: 'Emergency Protocol',
        body: 'If you believe you may be experiencing a medical emergency, immediately call our 24x7 Emergency Room, call local emergency medical services, or visit the nearest emergency trauma facility.'
      },
      {
        heading: 'Accuracy of Medical Information',
        body: 'While clinical teams endeavor to keep medical information current, medical sciences evolve rapidly. IndoStates Hospital makes no warranties regarding absolute completeness or infallibility of general articles.'
      }
    ]
  },
  accessibility: {
    title: 'Accessibility Statement',
    lastUpdated: 'September 2026',
    reviewNotice: 'IndoStates Hospital is committed to ensuring digital accessibility for patients and visitors of all abilities.',
    paragraphs: [
      {
        heading: 'Our Commitment',
        body: 'We strive to conform to the World Wide Web Consortium’s (W3C) Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards across all digital touchpoints.'
      },
      {
        heading: 'Accessible Features Implemented',
        body: 'Key accessibility considerations in this portal include: high text contrast ratios, scalable typography, keyboard navigability across all menus and interactive forms, descriptive ARIA attributes, semantic HTML landmarks, and support for screen-reading software.'
      },
      {
        heading: 'Assistance & Feedback',
        body: 'If you encounter any difficulty accessing any aspect of this website, please contact our patient relations desk. We continually evaluate and enhance our digital accessibility.'
      }
    ]
  }
};
