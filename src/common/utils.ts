import CryptoJS from "crypto-js";

export function generateHmacMD5(seed: string, v: string) {
  const hmac = CryptoJS.HmacMD5(v, seed);
  return hmac.toString();
}

// Utility to merge class names, similar to clsx or classnames
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

const ENC_SEC_KEY = 'zAQc482290f4fb42306aa81cff053cbeb89e5f832e5c0649f0270ab9066e36dc69cWSx';

export const AES = {
  
  encrypt: (data: Record<string, any>) => {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENC_SEC_KEY).toString();
    return encrypted;
  },
  
  decrypt: (encryptedData: string) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENC_SEC_KEY);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  }
}
