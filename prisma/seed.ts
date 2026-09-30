import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- INDOSTATES HOSPITAL DATABASE SEED START ---');

  // 1. Roles & Permissions (Phase 19)
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Full institutional administrative privileges' },
    { name: 'HOSPITAL_ADMIN', description: 'Hospital clinical and operational management' },
    { name: 'CONTENT_MANAGER', description: 'Editorial and health updates publisher' },
    { name: 'APPOINTMENT_MANAGER', description: 'Outpatient consultation verification desk' },
  ];

  for (const roleData of roles) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
  }
  console.log('✓ RBAC Roles seeded');

  // 2. Admin Users (Phase 18)
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
  const apptManagerRole = await prisma.role.findUnique({ where: { name: 'APPOINTMENT_MANAGER' } });

  if (superAdminRole) {
    const adminPasswordHash = await bcrypt.hash('AdminPassword@2026', 10);
    await prisma.adminUser.upsert({
      where: { email: 'admin@indostates.example' },
      update: {},
      create: {
        name: 'Super Administrator',
        email: 'admin@indostates.example',
        passwordHash: adminPasswordHash,
        roleId: superAdminRole.id,
        status: 'ACTIVE',
      },
    });
  }

  if (apptManagerRole) {
    const apptPasswordHash = await bcrypt.hash('ApptPassword@2026', 10);
    await prisma.adminUser.upsert({
      where: { email: 'appointments@indostates.example' },
      update: {},
      create: {
        name: 'Appointment Coordinator',
        email: 'appointments@indostates.example',
        passwordHash: apptPasswordHash,
        roleId: apptManagerRole.id,
        status: 'ACTIVE',
      },
    });
  }
  console.log('✓ Initial Admin Users seeded');

  // 3. Hospital Record (Phase 5)
  const existingHospital = await prisma.hospital.findFirst();
  if (!existingHospital) {
    await prisma.hospital.create({
      data: {
        name: 'IndoStates Hospital',
        tagline: 'Compassionate Care. Advanced Healthcare.',
        description: 'IndoStates Hospital provides multi-specialty clinical care, 24x7 emergency resuscitation, advanced diagnostics, and dedicated specialist consultations.',
        address: '[HOSPITAL TO PROVIDE STREET ADDRESS]',
        city: '[HOSPITAL TO PROVIDE CITY]',
        state: '[HOSPITAL TO PROVIDE STATE]',
        pincode: '[PINCODE]',
        phone: '+91 [HOSPITAL TO PROVIDE GENERAL PHONE]',
        emergencyPhone: '+91 [HOSPITAL TO PROVIDE EMERGENCY NUMBER]',
        email: '[HOSPITAL TO PROVIDE OFFICIAL EMAIL]',
        workingHours: '[HOSPITAL TO CONFIRM: Mon–Sat 08:00 AM – 08:00 PM | Emergency 24/7]',
        googleMapsUrl: 'https://maps.google.com/?q=IndoStates+Hospital',
      },
    });
  }
  console.log('✓ Hospital Profile seeded');

  // 4. Departments (Phase 6)
  const depts = [
    { name: 'Cardiology & Vascular Sciences', slug: 'cardiology', shortDescription: 'Heart care, clinical cardiology, and ECG diagnostics.' },
    { name: 'Neurology & Neurosciences', slug: 'neurology', shortDescription: 'Diagnostic neurology, stroke rehabilitation, and nerve disorder management.' },
    { name: 'Orthopaedics & Joint Reconstruction', slug: 'orthopedics', shortDescription: 'Joint replacement, trauma care, and musculoskeletal care.' },
    { name: 'Paediatrics & Neonatal Care', slug: 'pediatrics', shortDescription: 'Child wellness, immunizations, and paediatric clinical care.' },
    { name: 'Obstetrics & Gynaecology', slug: 'gynecology', shortDescription: 'Maternal health, antenatal care, and comprehensive women’s wellness.' },
    { name: 'Emergency & Critical Care Medicine', slug: 'emergency-medicine', shortDescription: '24×7 acute trauma resuscitation and critical care triage.' },
  ];

  for (const dept of depts) {
    await prisma.department.upsert({
      where: { slug: dept.slug },
      update: {},
      create: {
        name: dept.name,
        slug: dept.slug,
        shortDescription: dept.shortDescription,
        description: `The Department of ${dept.name} at IndoStates Hospital delivers expert diagnostics and compassionate therapeutic management. [Hospital to confirm clinical scope].`,
        status: 'ACTIVE',
      },
    });
  }
  console.log('✓ Departments seeded');

  console.log('--- INDOSTATES HOSPITAL DATABASE SEED COMPLETED ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
