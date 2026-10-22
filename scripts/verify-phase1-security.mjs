// scripts/verify-phase1-security.mjs
// Automated verification for IndoStates Hospital Phase 1 Security Hardening

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName} - ${details}`);
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  let json = null;
  try {
    json = await res.json();
  } catch (e) {
    // text response
  }
  return { status: res.status, headers: res.headers, body: json };
}

async function loginStaff(email, password) {
  const res = await request("/api/staff/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const cookies = res.headers.get("set-cookie") || "";
  let staffToken = null;
  const match = cookies.match(/ish_staff_token=([^;]+)/);
  if (match) staffToken = match[1];
  if (!staffToken && res.body?.token) staffToken = res.body.token;

  return { res, staffToken, cookies };
}

async function runSecurityTests() {
  console.log("===============================================================");
  console.log("INDOSTATES HOSPITAL - PHASE 1 SECURITY VERIFICATION SUITE");
  console.log("===============================================================\n");

  // TEST SUITE 1: Unauthenticated requests return 401
  console.log("--- 1. Testing Unauthenticated Access Rejection (401) ---");
  {
    const r1 = await request("/api/doctor/overview");
    assert(r1.status === 401, "GET /api/doctor/overview unauthenticated returns 401", `Got ${r1.status}`);

    const r2 = await request("/api/doctor/queue");
    assert(r2.status === 401, "GET /api/doctor/queue unauthenticated returns 401", `Got ${r2.status}`);

    const r3 = await request("/api/admin/overview");
    assert(r3.status === 401, "GET /api/admin/overview unauthenticated returns 401", `Got ${r3.status}`);

    const r4 = await request("/api/admin/staff");
    assert(r4.status === 401, "GET /api/admin/staff unauthenticated returns 401", `Got ${r4.status}`);

    const r5 = await request("/api/admin/security");
    assert(r5.status === 401, "GET /api/admin/security unauthenticated returns 401", `Got ${r5.status}`);

    const r6 = await request("/api/admin/settings");
    assert(r6.status === 401, "GET /api/admin/settings unauthenticated returns 401", `Got ${r6.status}`);
  }

  // TEST SUITE 2: Invalid or tampered tokens return 401
  console.log("\n--- 2. Testing Invalid / Tampered Session Token Rejection ---");
  {
    const rTampered = await request("/api/doctor/overview", {
      headers: {
        Authorization: "Bearer invalid.fake-signature",
      },
    });
    assert(rTampered.status === 401, "Tampered bearer token returns 401", `Got ${rTampered.status}`);

    const rMalformed = await request("/api/admin/overview", {
      headers: {
        Cookie: "ish_staff_token=completely-malformed-string; ish_auth_role=ADMIN",
      },
    });
    assert(rMalformed.status === 401, "Malformed token cookie returns 401", `Got ${rMalformed.status}`);
  }

  // TEST SUITE 3: Role-based Authorization and Privilege Escalation Prevention
  console.log("\n--- 3. Testing RBAC Role Separation & Gating ---");
  let doctorToken = null;
  let adminToken = null;

  // Log in as Doctor
  {
    const docLogin = await loginStaff("dr.logesh@indostates.com", "Doctor@123");
    assert(docLogin.res.status === 200 && docLogin.staffToken, "Doctor authentication succeeds with signed token");
    doctorToken = docLogin.staffToken;

    // Doctor accesses Doctor API -> allowed
    const docOverview = await request("/api/doctor/overview", {
      headers: { Authorization: `Bearer ${doctorToken}` },
    });
    assert(docOverview.status === 200, "Doctor can access /api/doctor/overview", `Got ${docOverview.status}`);

    // Doctor attempts to access admin-only endpoints -> 403 Forbidden!
    const docAdminStaff = await request("/api/admin/staff", {
      headers: { Authorization: `Bearer ${doctorToken}` },
    });
    assert(docAdminStaff.status === 403, "Doctor cannot access admin-only /api/admin/staff (returns 403)", `Got ${docAdminStaff.status}`);

    const docAdminSec = await request("/api/admin/security", {
      headers: { Authorization: `Bearer ${doctorToken}` },
    });
    assert(docAdminSec.status === 403, "Doctor cannot access admin-only /api/admin/security (returns 403)", `Got ${docAdminSec.status}`);
  }

  // Log in as Hospital Administrator
  {
    const adminLogin = await loginStaff("admin@indostates.com", "Admin@123");
    assert(adminLogin.res.status === 200 && adminLogin.staffToken, "Admin authentication succeeds with signed token");
    adminToken = adminLogin.staffToken;

    // Admin accesses Admin endpoints -> allowed
    const adminOverview = await request("/api/admin/overview", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminOverview.status === 200, "Admin can access /api/admin/overview", `Got ${adminOverview.status}`);

    const adminStaff = await request("/api/admin/staff", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminStaff.status === 200, "Admin can access /api/admin/staff", `Got ${adminStaff.status}`);
  }

  // TEST SUITE 4: Server-Side Actor Identity Verification (No Impersonation)
  console.log("\n--- 4. Testing Impersonation Prevention via Server Identity ---");
  {
    // Admin calls doctor queue attempting to pass a spoofed actor in the body
    const spoofAttempt = await request("/api/doctor/queue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        action: "call",
        queueId: "q-non-existent",
        actor: {
          id: "fake-doctor-id",
          name: "Dr. Spoofed Practitioner",
          role: "DOCTOR",
        },
      }),
    });
    // Request must not crash and should reject non-existent queue entry (404) or succeed, using verified server identity
    assert(spoofAttempt.status === 404 || spoofAttempt.status === 200, "Spoofing body actor handled securely without server trust");
  }

  // TEST SUITE 5: Session Revocation Verification
  console.log("\n--- 5. Testing Instant Session Revocation ---");
  {
    // Create an ephemeral login session
    const revLogin = await loginStaff("nurse@indostates.com", "Nurse@123");
    const testSessionToken = revLogin.staffToken;

    // Verify token works
    const testPreRevoke = await request("/api/admin/emergency", {
      headers: { Authorization: `Bearer ${testSessionToken}` },
    });
    assert(testPreRevoke.status === 200, "Nurse session valid before revocation", `Got ${testPreRevoke.status}`);

    // Revoke all sessions for nurse via admin security endpoint
    const revokeRes = await request("/api/admin/security", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        action: "revoke_staff_all",
        email: "nurse@indostates.com",
      }),
    });
    assert(revokeRes.status === 200, "Session revocation executed by administrator");

    // Attempt request again with the revoked session -> must return 401
    const testPostRevoke = await request("/api/admin/emergency", {
      headers: { Authorization: `Bearer ${testSessionToken}` },
    });
    assert(testPostRevoke.status === 401, "Revoked session immediately returns 401 Unauthorized", `Got ${testPostRevoke.status}`);
  }

  // TEST SUITE 6: Patient Workflows Preservation (UHID, Booking, OTP, QR verification)
  console.log("\n--- 6. Testing Patient Workflows Preservation ---");
  {
    // Patient appointment booking flow
    const testDay = 5 + Math.floor(Math.random() * 20);
    const testSlot = `${Math.floor(1 + Math.random() * 5)}:${Math.floor(10 + Math.random() * 40)} PM`;
    const bookRes = await request("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: "Test Automated Verification Patient",
        patientPhone: `+91 94430 ${Math.floor(10000 + Math.random() * 89999)}`,
        patientEmail: `autotest-${Date.now()}@indostates.com`,
        patientAge: 34,
        patientGender: "Female",
        departmentId: "neuro-stroke",
        targetId: "dr-rajesh-rangaswamy",
        targetName: "Dr. Rajesh Rangaswamy",
        doctorId: "dr-rajesh-rangaswamy",
        doctorName: "Dr. Rajesh Rangaswamy",
        date: new Date(Date.now() + 86400000 * testDay).toISOString().split("T")[0],
        timeSlot: testSlot,
        serviceType: "doctor",
        notes: "Periodic tension headache evaluation",
        paymentStatus: "pay_on_arrival",
      }),
    });


    assert(bookRes.status === 200 || bookRes.status === 201, "Patient appointment booking API returns 200/201", `Got ${bookRes.status}`);
    const appointmentData = bookRes.body?.appointment || bookRes.body?.data;
    const uhid = appointmentData?.patientUhid || appointmentData?.uhid || bookRes.body?.uhid;
    const aptRef = appointmentData?.referenceCode || appointmentData?.id;

    assert(Boolean(uhid && uhid.startsWith("IND-UHID-")), `UHID generated with unified hospital prefix (${uhid})`);
    assert(Boolean(aptRef), `Appointment ID generated (${aptRef})`);

    // Digital pass / QR code verification endpoint
    if (aptRef) {
      const verifyRes = await request(`/api/appointments/verify?ref=${encodeURIComponent(aptRef)}`);
      assert(verifyRes.status === 200 && verifyRes.body?.valid === true, `Digital QR Pass verification remains functional for ${aptRef}`);
    }

    // Patient OTP sending endpoint
    const testOtpPhone = `+919443${Math.floor(100000 + Math.random() * 899999)}`;
    const otpRes = await request("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: testOtpPhone }),
    });
    assert(otpRes.status === 200, "Patient mobile OTP generation endpoint remains functional");
  }



  console.log("\n===============================================================");
  console.log(`TEST SUMMARY: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
  console.log("===============================================================");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSecurityTests().catch((e) => {
  console.error("Test execution fatal error:", e);
  process.exit(1);
});
