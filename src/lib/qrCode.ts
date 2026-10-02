import QRCode from "qrcode";

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

/**
 * Generate a high-resolution QR code data URL (PNG)
 * Encodes a valid URL compatible with Google Lens, Android camera, iPhone camera, and standard QR scanners.
 */
export async function generateQRCodeDataUrl(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const {
    width = 300,
    margin = 2,
    darkColor = "#0f172a", // Deep Navy
    lightColor = "#ffffff", // Pure White
  } = options;

  try {
    return await QRCode.toDataURL(text, {
      width,
      margin,
      errorCorrectionLevel: "M",
      color: {
        dark: darkColor,
        light: lightColor,
      },
    });
  } catch (err) {
    console.error("Failed to generate QR code data URL:", err);
    throw err;
  }
}

/**
 * Generate a standalone SVG string of the QR code
 */
export async function generateQRCodeSVG(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const {
    width = 300,
    margin = 2,
    darkColor = "#0f172a",
    lightColor = "#ffffff",
  } = options;

  try {
    return await QRCode.toString(text, {
      type: "svg",
      width,
      margin,
      errorCorrectionLevel: "M",
      color: {
        dark: darkColor,
        light: lightColor,
      },
    });
  } catch (err) {
    console.error("Failed to generate QR code SVG:", err);
    throw err;
  }
}

/**
 * Helper to get the canonical application base URL
 * 1. Prioritizes NEXT_PUBLIC_APP_URL environment variable in production
 * 2. Falls back to window.location.origin in client browser
 * 3. Falls back to http://localhost:3000 in local development
 */
export function getAppBaseUrl(overrideOrigin?: string): string {
  if (overrideOrigin && overrideOrigin.trim()) {
    return overrideOrigin.trim().replace(/\/+$/, "");
  }

  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}

/**
 * Helper to construct the canonical verification URL
 * Encodes: https://<domain>/booking/verify/<idOrCode> in production
 */
export function getAppointmentVerificationUrl(
  idOrCode: string,
  origin?: string
): string {
  const base = getAppBaseUrl(origin);
  return `${base}/booking/verify/${encodeURIComponent(idOrCode)}`;
}

