// Country dial codes for the phone-number selector. `len` is the expected
// national-number length used for validation.

export interface Country {
  code: string;
  name: string;
  dial: string;
  flag: string;
  len: number;
}

export const COUNTRIES: Country[] = [
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳", len: 10 },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸", len: 10 },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧", len: 10 },
  { code: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪", len: 9 },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬", len: 8 },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪", len: 11 },
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬", len: 10 },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺", len: 9 },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

/** Returns an error message if the phone is invalid for the country, else null. */
export function validatePhone(phone: string, country: Country): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "Phone number is required";
  if (!/^\d+$/.test(digits)) return "Only digits are allowed";
  if (digits.length !== country.len) {
    return `Enter a valid ${country.len}-digit number for ${country.name}`;
  }
  return null;
}
