/**
 * SSRF (Server-Side Request Forgery) Protection Utility
 */

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  'metadata.google.internal',
  'instance-data',
  '169.254.169.254'
]);

export interface SsrfCheckResult {
  isValid: boolean;
  sanitizedUrl?: string;
  error?: string;
}

export function validateSafeUrl(rawUrl: string): SsrfCheckResult {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, error: 'URL không được để trống.' };
  }

  let parsed: URL;
  try {
    let urlToParse = rawUrl.trim();
    if (!/^https?:\/\//i.test(urlToParse)) {
      urlToParse = 'https://' + urlToParse;
    }
    parsed = new URL(urlToParse);
  } catch {
    return { isValid: false, error: 'Định dạng URL không hợp lệ.' };
  }

  // Only allow HTTP and HTTPS
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { isValid: false, error: 'Chỉ chấp nhận giao thức http:// hoặc https://' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Check blocked hostnames
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    return { isValid: false, error: 'Truy cập đến địa chỉ nội bộ hoặc IP mạng cục bộ bị từ chối.' };
  }

  // Check IPv4 private and link-local ranges
  // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16
  const ipMatch = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ipMatch) {
    const octet1 = parseInt(ipMatch[1], 10);
    const octet2 = parseInt(ipMatch[2], 10);

    if (
      octet1 === 10 ||
      octet1 === 127 ||
      octet1 === 0 ||
      (octet1 === 172 && octet2 >= 16 && octet2 <= 31) ||
      (octet1 === 192 && octet2 === 168) ||
      (octet1 === 169 && octet2 === 254)
    ) {
      return { isValid: false, error: 'Truy cập đến dải IP riêng tư (Private IP) bị từ chối vì lý do an toàn.' };
    }
  }

  return {
    isValid: true,
    sanitizedUrl: parsed.toString()
  };
}
