export interface InsuranceProcessStep {
  stepNumber: number;
  title: string;
  description: string;
}

export const insuranceDeskData = {
  title: 'Insurance & Cashless Hospitalization Desk',
  intro: 'IndoStates Hospital features a dedicated 24x7 Insurance & TPA Coordination Cell located on the Ground Floor, assisting patients and families with seamless cashless claims processing and reimbursement documentation.',
  disclaimer: 'NOTE: Insurance empanelment, cashless approvals, and admissible expenses are subject to the specific terms and exclusions of your individual insurance policy and third-party administrator (TPA) guidelines. [HOSPITAL TO PROVIDE OFFICIAL EMPANELED TPA / INSURER LIST PRIOR TO LAUNCH].',
  
  requiredDocuments: [
    'Original Health Insurance Card or Digital Policy Certificate',
    'Government-issued Photo ID of Patient (Aadhaar / Voter ID / Passport)',
    'Employee ID Card (if covered under Corporate Group Policy)',
    'Treating Consultant’s Admission Advice Note indicating diagnosis and treatment plan',
    'Relevant previous medical records, prescription history, and diagnostic reports',
    'Duly signed Pre-Authorization Request Form (available at our TPA Desk)'
  ],

  processPlanned: [
    {
      stepNumber: 1,
      title: 'Consultation & Admission Advice',
      description: 'Visit the treating consultant at IndoStates Hospital OPD. If admission or surgery is recommended, obtain the formal Admission Advice note.'
    },
    {
      stepNumber: 2,
      title: 'Submission to TPA Desk',
      description: 'Visit the TPA Helpdesk at least 48 to 72 hours before planned hospitalization with your insurance documents and pre-authorization form.'
    },
    {
      stepNumber: 3,
      title: 'Pre-Authorization Transmission',
      description: 'Our insurance coordination officers review medical documentation and submit the pre-authorization request electronically to your insurer or TPA.'
    },
    {
      stepNumber: 4,
      title: 'Approval & Admission',
      description: 'Upon receiving initial approval letter from the insurer, you can proceed with scheduled hospital admission on the designated date.'
    },
    {
      stepNumber: 5,
      title: 'Discharge & Final Settlement',
      description: 'At the time of discharge, final hospital bills and clinical summaries are sent for final settlement. Non-medical expenses and co-pays are settled directly at billing.'
    }
  ],

  processEmergency: [
    {
      stepNumber: 1,
      title: 'Immediate Clinical Stabilization',
      description: 'Emergency patient care takes foremost priority. The patient is stabilized immediately in the Emergency and Trauma Centre.'
    },
    {
      stepNumber: 2,
      title: 'TPA Notification within 24 Hours',
      description: 'Family or attendant submits insurance card and policy details to the 24x7 Emergency TPA Desk within 24 hours of hospital admission.'
    },
    {
      stepNumber: 3,
      title: 'Priority Query Resolution',
      description: 'Our hospital insurance team responds rapidly to insurer medical queries to secure emergency cashless approval.'
    }
  ],

  tpaDeskHours: 'Open 24 Hours for Emergency Admissions | General Queries: 08:00 AM – 08:00 PM',
  contactExtension: '[HOSPITAL TO PROVIDE TPA EXTENSION / HELPLINE]',
  directEmail: '[HOSPITAL TO PROVIDE INSURANCE EMAIL]'
};
