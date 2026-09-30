import http from 'http';

function post(path: string, body: any, headers: Record<string, string> = {}): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/v1' + path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          ...headers,
        },
      },
      (res) => {
        let buf = '';
        res.on('data', (chunk) => (buf += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 0, body: JSON.parse(buf) });
          } catch {
            resolve({ status: res.statusCode || 0, body: buf });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path: string, headers: Record<string, string> = {}): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/v1' + path,
        method: 'GET',
        headers,
      },
      (res) => {
        let buf = '';
        res.on('data', (chunk) => (buf += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 0, body: JSON.parse(buf) });
          } catch {
            resolve({ status: res.statusCode || 0, body: buf });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

function patch(path: string, body: any, headers: Record<string, string> = {}): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/v1' + path,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          ...headers,
        },
      },
      (res) => {
        let buf = '';
        res.on('data', (chunk) => (buf += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 0, body: JSON.parse(buf) });
          } catch {
            resolve({ status: res.statusCode || 0, body: buf });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`✓ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`✗ [FAIL] ${testName} - ${detail || ''}`);
  }
}

async function runRBACTestSuite() {
  console.log('====================================================');
  console.log('INDOSTATES HOSPITAL - AUTOMATED RBAC TEST SUITE');
  console.log('====================================================\n');

  // --- SECTION 1: AUTHENTICATION TESTS ---
  console.log('--- SECTION 1: AUTHENTICATION ---');

  // 1.1 Valid Super Admin login
  const saLogin = await post('/auth/login', {
    email: 'admin@indostates.example',
    password: 'AdminPassword@2026',
  });
  assert(saLogin.status === 200 && saLogin.body.data?.token, '1.1 Super Admin valid login returns 200 & JWT');
  const saToken = saLogin.body.data?.token;

  // 1.2 Valid Appointment Manager login
  const amLogin = await post('/auth/login', {
    email: 'appointments@indostates.example',
    password: 'ApptPassword@2026',
  });
  assert(amLogin.status === 200 && amLogin.body.data?.user?.role === 'APPOINTMENT_MANAGER', '1.2 Appointment Manager login returns 200 & role');
  const amToken = amLogin.body.data?.token;

  // 1.3 Valid Content Manager login
  const cmLogin = await post('/auth/login', {
    email: 'content@indostates.example',
    password: 'ContentPassword@2026',
  });
  assert(cmLogin.status === 200 && cmLogin.body.data?.user?.role === 'CONTENT_MANAGER', '1.3 Content Manager login returns 200 & role');
  const cmToken = cmLogin.body.data?.token;

  // 1.4 Invalid password
  const badPass = await post('/auth/login', {
    email: 'admin@indostates.example',
    password: 'WrongPassword123',
  });
  assert(badPass.status === 401, '1.4 Invalid password returns 401 Unauthorized');

  // 1.5 Missing credentials
  const missingCreds = await post('/auth/login', {
    email: 'admin@indostates.example',
  });
  assert(missingCreds.status === 400 || missingCreds.status === 401, '1.5 Missing password rejected with 400/401');

  // 1.6 Malformed / invalid token
  const badToken = await get('/admin/dashboard', { Authorization: 'Bearer invalid.tampered.token' });
  assert(badToken.status === 401, '1.6 Tampered JWT rejected with 401 Unauthorized');

  // 1.7 Missing auth header
  const noToken = await get('/admin/dashboard');
  assert(noToken.status === 401, '1.7 Unauthenticated request returns 401 Unauthorized');

  // --- SECTION 2: AUTHORIZATION & PERMISSION ENFORCEMENT ---
  console.log('\n--- SECTION 2: AUTHORIZATION & PERMISSIONS ---');

  // 2.1 Super Admin full access
  const saDash = await get('/admin/dashboard', { Authorization: `Bearer ${saToken}` });
  const saUsers = await get('/admin/users', { Authorization: `Bearer ${saToken}` });
  const saSettings = await get('/admin/settings', { Authorization: `Bearer ${saToken}` });
  const saLogs = await get('/admin/audit-logs', { Authorization: `Bearer ${saToken}` });
  assert(saDash.status === 200, '2.1 Super Admin authorized for Dashboard (200)');
  assert(saUsers.status === 200, '2.2 Super Admin authorized for User Management (200)');
  assert(saSettings.status === 200, '2.3 Super Admin authorized for System Settings (200)');
  assert(saLogs.status === 200, '2.4 Super Admin authorized for Audit Trail (200)');

  // 2.2 Appointment Manager permissions & boundaries
  const amDash = await get('/admin/dashboard', { Authorization: `Bearer ${amToken}` });
  const amAppts = await get('/admin/appointments', { Authorization: `Bearer ${amToken}` });
  const amUsers = await get('/admin/users', { Authorization: `Bearer ${amToken}` });
  const amSettings = await get('/admin/settings', { Authorization: `Bearer ${amToken}` });
  const amLogs = await get('/admin/audit-logs', { Authorization: `Bearer ${amToken}` });

  assert(amDash.status === 200, '2.5 Appointment Manager authorized for Dashboard (200)');
  assert(amAppts.status === 200, '2.6 Appointment Manager authorized for Appointments queue (200)');
  assert(amUsers.status === 403, '2.7 Appointment Manager FORBIDDEN from User Management (403)');
  assert(amSettings.status === 403, '2.8 Appointment Manager FORBIDDEN from System Settings (403)');
  assert(amLogs.status === 403, '2.9 Appointment Manager FORBIDDEN from Audit Trail (403)');

  // 2.3 Content Manager permissions & boundaries
  const cmDash = await get('/admin/dashboard', { Authorization: `Bearer ${cmToken}` });
  const cmEnquiries = await get('/admin/enquiries', { Authorization: `Bearer ${cmToken}` });
  const cmAppts = await get('/admin/appointments', { Authorization: `Bearer ${cmToken}` });
  const cmUsers = await get('/admin/users', { Authorization: `Bearer ${cmToken}` });
  const cmLogs = await get('/admin/audit-logs', { Authorization: `Bearer ${cmToken}` });

  assert(cmDash.status === 200, '2.10 Content Manager authorized for Dashboard (200)');
  assert(cmEnquiries.status === 200, '2.11 Content Manager authorized for Inquiries (200)');
  assert(cmAppts.status === 403, '2.12 Content Manager FORBIDDEN from Appointments queue (403)');
  assert(cmUsers.status === 403, '2.13 Content Manager FORBIDDEN from User Management (403)');
  assert(cmLogs.status === 403, '2.14 Content Manager FORBIDDEN from Audit Trail (403)');

  // --- SECTION 3: SESSION ISOLATION & INTEGRITY ---
  console.log('\n--- SECTION 3: SESSION ISOLATION & DATA INTEGRITY ---');

  // 3.1 /auth/me returns authoritative permissions
  const meRes = await get('/auth/me', { Authorization: `Bearer ${amToken}` });
  assert(
    meRes.status === 200 &&
    meRes.body.data?.permissions?.includes('APPOINTMENT_VIEW') &&
    !meRes.body.data?.permissions?.includes('USER_VIEW'),
    '3.1 /auth/me returns verified permissions for Appointment Manager'
  );

  // 3.2 Passwords & hashes are NEVER exposed in user responses
  assert(
    !meRes.body.data?.password && !meRes.body.data?.passwordHash,
    '3.2 User profile response NEVER exposes password or passwordHash'
  );

  const usersList = await get('/admin/users', { Authorization: `Bearer ${saToken}` });
  const anyPasswordExposed = usersList.body.data?.some((u: any) => u.password || u.passwordHash);
  assert(!anyPasswordExposed, '3.3 User list response NEVER exposes passwords or hashes');

  // 3.4 Cross-role session isolation
  // Logging out as Appointment Manager and logging in as Content Manager
  await post('/auth/logout', {}, { Authorization: `Bearer ${amToken}` });
  const freshMe = await get('/auth/me', { Authorization: `Bearer ${cmToken}` });
  assert(
    freshMe.body.data?.role === 'CONTENT_MANAGER' &&
    !freshMe.body.data?.permissions?.includes('APPOINTMENT_VIEW'),
    '3.4 Session switching does not leak permissions across roles'
  );

  console.log('\n====================================================');
  console.log(`RBAC TEST SUITE RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('====================================================');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runRBACTestSuite().catch((err) => {
  console.error('Fatal error running RBAC test suite:', err);
  process.exit(1);
});
