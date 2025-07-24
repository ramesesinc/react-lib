import CryptoJS from "crypto-js";

export function generateHmacMD5(seed: string, v: string) {
  const hmac = CryptoJS.HmacMD5(v, seed);
  return hmac.toString();
}

// Utility to merge class names, similar to clsx or classnames
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}
