export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('0')) {
    return '+234' + cleaned.slice(1);
  }
  
  if (!cleaned.startsWith('+')) {
    return '+' + cleaned;
  }
  
  return cleaned;
}

export function isValidE164(phone: string): boolean {
  const e164Regex = /^\+[1-9]\d{6,14}$/;
  return e164Regex.test(phone);
}

export function normalizePhoneNumber(phone: string): string | null {
  try {
    const normalized = formatPhoneNumber(phone);
    if (isValidE164(normalized)) {
      return normalized;
    }
    return null;
  } catch {
    return null;
  }
}
