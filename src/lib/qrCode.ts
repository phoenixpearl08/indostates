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
 * Helper to construct the canonical verification URL
 */
export function getAppointmentVerificationUrl(
  idOrCode: string,
  origin?: string
): string {
  const base =
    origin ||
    (typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://indostates.com");
  return `${base}/booking/verify/${idOrCode}`;
}
