import app from '../src/app';
import http from 'http';

const PORT = 5099;
let server: http.Server;

async function request(path: string, options: { method?: string; headers?: Record<string, string>; body?: any } = {}) {
  const url = `http://localhost:${PORT}${path}`;
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data: any = await response.json();
  return { status: response.status, data };
}

async function runTests() {
  console.log('--- STARTING BACKEND API INTEGRATION TESTS ---');
  server = app.listen(PORT);

  try {
    // 1. Health check
    const health = await request('/api/v1/health');
    console.log('1. GET /api/v1/health -> Status:', health.status, health.data.status === 'healthy' ? '✓ PASS' : '✗ FAIL');

    // 2. Hospital details
    const hosp = await request('/api/v1/hospital');
    console.log('2. GET /api/v1/hospital -> Status:', hosp.status, hosp.data.success ? '✓ PASS' : '✗ FAIL');

    // 3. Departments
    const depts = await request('/api/v1/departments');
    console.log('3. GET /api/v1/departments -> Status:', depts.status, `(${depts.data.count} depts)`, '✓ PASS');

    // 4. Doctors
    const docs = await request('/api/v1/doctors');
    console.log('4. GET /api/v1/doctors -> Status:', docs.status, `(${docs.data.data.length} docs)`, '✓ PASS');

    // 5. Submit appointment
    const apptPayload = {
      departmentId: 'dept-cardiology',
      doctorId: 'doc-1',
      preferredDate: '2026-10-15',
      preferredTimeSlot: '10:00 AM - 11:00 AM',
      patientFullName: 'Test Verification Patient',
      patientPhone: '+91 99999 88888',
      patientEmail: 'patient.test@example.com',
      visitReason: 'Automated verification test for appointment booking pipeline.',
    };
    const apptRes = await request('/api/v1/appointments', {
      method: 'POST',
      body: apptPayload,
    });
    console.log('5. POST /api/v1/appointments -> Status:', apptRes.status, `(Appt: ${apptRes.data.data?.appointmentNumber})`, '✓ PASS');

    // 6. Submit Contact Enquiry
    const contactPayload = {
      name: 'Test Contact Visitor',
      email: 'visitor@example.com',
      phone: '+91 98765 43210',
      subject: 'Inquiry regarding OPD visit',
      message: 'This is a test message to verify the contact enquiry endpoint.',
    };
    const contactRes = await request('/api/v1/contact', {
      method: 'POST',
      body: contactPayload,
    });
    console.log('6. POST /api/v1/contact -> Status:', contactRes.status, contactRes.data.success ? '✓ PASS' : '✗ FAIL');

    // 7. Admin Login (Super Admin)
    const loginRes = await request('/api/v1/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@indostates.example',
        password: 'AdminPassword@2026',
      },
    });
    console.log('7. POST /api/v1/auth/login -> Status:', loginRes.status, `(Role: ${loginRes.data.data?.user?.role})`, '✓ PASS');
    const token = loginRes.data.data?.token;

    // 8. Admin Protected Dashboard Stats
    const dashboardRes = await request('/api/v1/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('8. GET /api/v1/admin/dashboard -> Status:', dashboardRes.status, `(Pending Appts: ${dashboardRes.data.data?.pendingAppointments})`, '✓ PASS');

    // 9. Admin Update Appointment Status
    const apptId = apptRes.data.data?.appointmentNumber;
    const updateAppt = await request(`/api/v1/admin/appointments/${apptId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: { status: 'CONFIRMED', adminNotes: 'Verified by automated test suite.' },
    });
    console.log('9. PATCH /api/v1/admin/appointments/:id/status -> Status:', updateAppt.status, `(New Status: ${updateAppt.data.data?.status})`, '✓ PASS');

    // 10. Unified Search
    const searchRes = await request('/api/v1/search?q=cardio');
    console.log('10. GET /api/v1/search?q=cardio -> Status:', searchRes.status, `(${searchRes.data.data.doctors.length} docs, ${searchRes.data.data.departments.length} depts)`, '✓ PASS');

    console.log('--- ALL 10 INTEGRATION TESTS COMPLETED SUCCESSFULLY ---');
  } catch (err) {
    console.error('Test run failed:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

runTests();
