// Verification script for IndoStates Hospital endpoints
const http = require("http");

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: path,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let resData = "";
        res.on("data", (chunk) => (resData += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(resData) });
          } catch {
            resolve({ status: res.statusCode, headers: res.headers, raw: resData });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: path,
        method: "GET",
      },
      (res) => {
        let resData = "";
        res.on("data", (chunk) => (resData += chunk));
        res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, data: resData }));
      }
    );
    req.on("error", reject);
    req.end();
  });
}

async function runTests() {
  console.log("=== STARTING INDOSTATES HOSPITAL AUTOMATED VERIFICATION ===");

  // 1. Doctor Login & Role-Based Redirection
  console.log("\n[TEST 1] Testing Doctor Login (dr.logesh@indostates.com)...");
  const docLogin = await post("/api/auth/login", {
    email: "dr.logesh@indostates.com",
    password: "Doctor@123",
  });
  console.log("Status:", docLogin.status);
  console.log("Response:", docLogin.data);
  console.log("Expected redirectUrl: /doctor/dashboard");
  const docSuccess = docLogin.status === 200 && docLogin.data.redirectUrl === "/doctor/dashboard" && docLogin.data.user.role === "doctor";
  console.log("Doc Login Passed?", docSuccess ? "PASS" : "FAIL");

  // 2. Admin Login & Role-Based Redirection
  console.log("\n[TEST 2] Testing Admin Login (admin@indostates.com)...");
  const adminLogin = await post("/api/auth/login", {
    email: "admin@indostates.com",
    password: "Admin@123",
  });
  console.log("Status:", adminLogin.status);
  console.log("Response:", adminLogin.data);
  console.log("Expected redirectUrl: /admin/dashboard");
  const adminSuccess = adminLogin.status === 200 && adminLogin.data.redirectUrl === "/admin/dashboard" && adminLogin.data.user.role === "admin";
  console.log("Admin Login Passed?", adminSuccess ? "PASS" : "FAIL");

  // 3. Patient Login & Redirection
  console.log("\n[TEST 3] Testing Patient Login (patient@indostates.com)...");
  const patientLogin = await post("/api/auth/login", {
    email: "patient@indostates.com",
    password: "Patient@123",
  });
  console.log("Status:", patientLogin.status);
  console.log("Response:", patientLogin.data);
  console.log("Expected redirectUrl: /portal/patient");
  const patientSuccess = patientLogin.status === 200 && patientLogin.data.redirectUrl === "/portal/patient" && patientLogin.data.user.role === "patient";
  console.log("Patient Login Passed?", patientSuccess ? "PASS" : "FAIL");

  // 4. Invalid Password Authentication Denial
  console.log("\n[TEST 4] Testing Invalid Credentials Denial...");
  const invalidLogin = await post("/api/auth/login", {
    email: "admin@indostates.com",
    password: "WrongPassword!999",
  });
  console.log("Status:", invalidLogin.status);
  console.log("Response:", invalidLogin.data);
  const invalidSuccess = invalidLogin.status === 401;
  console.log("Denial Passed?", invalidSuccess ? "PASS" : "FAIL");

  // 5. Check SVG Avatars Served Successfully
  console.log("\n[TEST 5] Checking SVG Doctor Avatars on Server...");
  const avatarRajesh = await get("/images/avatars/doctor-rajesh.svg");
  const avatarLogesh = await get("/images/avatars/doctor-logesh.svg");
  const avatarVani = await get("/images/avatars/doctor-vani.svg");
  const avatarFallback = await get("/images/avatars/doctor-fallback.svg");
  console.log("doctor-rajesh.svg status:", avatarRajesh.status);
  console.log("doctor-logesh.svg status:", avatarLogesh.status);
  console.log("doctor-vani.svg status:", avatarVani.status);
  console.log("doctor-fallback.svg status:", avatarFallback.status);
  const avatarsSuccess = avatarRajesh.status === 200 && avatarLogesh.status === 200 && avatarVani.status === 200 && avatarFallback.status === 200;
  console.log("Avatars Available?", avatarsSuccess ? "PASS" : "FAIL");

  // 6. Booking System: Create Appointment & Validate Slot Persistence
  console.log("\n[TEST 6] Testing Booking Creation via /api/appointments...");
  const appointmentPayload = {
    patientName: "Ramesh Sharma",
    patientPhone: "+91 98765 43210",
    patientEmail: "ramesh.sharma@example.com",
    patientAge: 42,
    patientGender: "Male",
    serviceType: "doctor",
    targetId: "dr-logesh-thirumalaisamy",
    targetName: "Dr. Logesh Thirumalaisamy",
    doctorId: "dr-logesh-thirumalaisamy",
    doctorName: "Dr. Logesh Thirumalaisamy",
    appointmentDate: "2026-10-19", // Next Monday
    timeSlot: `11:${String(Math.floor(Math.random() * 50) + 10).padStart(2, "0")} AM`,
    notes: "Follow-up consultation for respiratory symptom check.",
  };

  const bookingRes = await post("/api/appointments", appointmentPayload);
  console.log("Booking Status:", bookingRes.status);
  console.log("Booking Response:", bookingRes.data);
  const bookingSuccess = bookingRes.status === 200 && bookingRes.data.success === true && bookingRes.data.appointment.referenceCode;
  console.log("Booking Succeeded?", bookingSuccess ? "PASS" : "FAIL");

  // 7. Booking System: Double-Booking / Slot Collision Prevention
  console.log("\n[TEST 7] Testing Double-Booking Collision Prevention (same doctor, date, slot)...");
  const duplicateRes = await post("/api/appointments", appointmentPayload);
  console.log("Duplicate Booking Status:", duplicateRes.status);
  console.log("Duplicate Booking Response:", duplicateRes.data);
  const duplicatePrevented = duplicateRes.status === 409;
  console.log("Double Booking Successfully Prevented?", duplicatePrevented ? "PASS" : "FAIL");

  // 8. Booking System: Past Date Prevention
  console.log("\n[TEST 8] Testing Past Date Booking Rejection...");
  const pastDatePayload = {
    ...appointmentPayload,
    appointmentDate: "2023-01-01",
    timeSlot: "11:00 AM",
  };
  const pastRes = await post("/api/appointments", pastDatePayload);
  console.log("Past Date Status:", pastRes.status);
  console.log("Past Date Response:", pastRes.data);
  const pastPrevented = pastRes.status === 400;
  console.log("Past Date Successfully Rejected?", pastPrevented ? "PASS" : "FAIL");

  // 9. Doctors Listing Page Check: No Doctor Fees
  console.log("\n[TEST 9] Checking Public Doctors Page HTML for Consultation Fees...");
  const doctorsPage = await get("/doctors");
  const hasFeeInHtml = /₹\s*\d+\s*Consultation/i.test(doctorsPage.data) || /consultation\s*fee/i.test(doctorsPage.data);
  console.log("Found Consultation Fee in /doctors?", hasFeeInHtml ? "YES (VIOLATION)" : "NO (VERIFIED CLEAN)");

  // 10. QR Verification API: Verify Created Booking & Privacy Masking
  console.log("\n[TEST 10] Testing QR Verification API (/api/appointments/verify)...");
  const refCode = bookingRes.data?.appointment?.referenceCode;
  const verifyRes = await get(`/api/appointments/verify?id=${encodeURIComponent(refCode)}`);
  let verifyData = {};
  try {
    verifyData = JSON.parse(verifyRes.data);
  } catch {}
  console.log("Verify Status:", verifyRes.status);
  console.log("Verify Response:", verifyData);
  const verifySuccess =
    verifyRes.status === 200 &&
    verifyData.valid === true &&
    verifyData.appointment?.referenceCode === refCode &&
    verifyData.appointment?.patientNameMasked?.includes("***") &&
    verifyData.appointment?.patientPhoneMasked?.includes("***");
  console.log("QR Verification Passed & Data Masked?", verifySuccess ? "PASS" : "FAIL");

  // 11. Google Lens Canonical Page Check: /booking/verify/[id]
  console.log("\n[TEST 11] Checking Google Lens / Mobile QR Verification Page Route...");
  const verifyPage = await get(`/booking/verify/${encodeURIComponent(refCode)}`);
  console.log("Verification Page HTTP Status:", verifyPage.status);
  const verifyPageValid =
    verifyPage.status === 200 &&
    (verifyPage.data.includes("Verification") || verifyPage.data.includes("Indo States Health"));
  console.log("Public Verification Page Loads?", verifyPageValid ? "PASS" : "FAIL");

  // 12. Cancelled Status QR Invalidation Check
  console.log("\n[TEST 12] Testing Status Transition: Cancel Appointment & Invalidate QR Check-In...");
  const cancelReq = await post("/api/appointments", {
    id: bookingRes.data?.appointment?.id,
    status: "cancelled",
  }).catch(() => null);
  // Also call PATCH directly
  const patchReq = await new Promise((resolve) => {
    const data = JSON.stringify({ id: bookingRes.data?.appointment?.id, status: "cancelled" });
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/appointments",
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) },
      },
      (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => resolve({ status: res.statusCode }));
      }
    );
    req.write(data);
    req.end();
  });
  console.log("PATCH status to cancelled:", patchReq.status);

  const reVerifyRes = await get(`/api/appointments/verify?id=${encodeURIComponent(refCode)}`);
  let reVerifyData = {};
  try {
    reVerifyData = JSON.parse(reVerifyRes.data);
  } catch {}
  console.log("Post-Cancellation Verify Response:", reVerifyData);
  const cancelReflected = reVerifyData.valid === false && reVerifyData.status === "cancelled";
  console.log("Cancelled Appointment Correctly Invalidated for Check-in?", cancelReflected ? "PASS" : "FAIL");

  // 13. Gemini AI Endpoint Check
  console.log("\n[TEST 13] Testing Gemini AI Chatbot Route (/api/chat)...");
  const chatRes = await post("/api/chat", {
    message: "What emergency services and trauma facilities does IndoStates offer?",
    history: [],
    language: "en",
  });
  console.log("Chat Status:", chatRes.status);
  const content = chatRes.data.content || chatRes.data.reply;
  console.log("Chat Reply Preview:", content ? content.slice(0, 120) + "..." : chatRes.data);
  const chatSuccess = chatRes.status === 200 && !!content;
  console.log("Chatbot Responded Grounded Info?", chatSuccess ? "PASS" : "FAIL");

  console.log("\n=== ALL TESTS COMPLETE ===");
}

runTests().catch(console.error);
