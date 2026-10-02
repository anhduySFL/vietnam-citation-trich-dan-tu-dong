import type { CitationItem } from '../types/citation';
import { extractDoi, resolveDoi } from './doiResolver';
import { validateSafeUrl } from './ssrfProtection';
import { parseHtmlMetadata } from './htmlMetadataParser';

export async function fetchMetadata(rawInput: string): Promise<CitationItem> {
  const input = rawInput.trim();
  if (!input) {
    throw new Error('Vui lòng nhập đường dẫn URL hoặc mã DOI.');
  }

  // 1. Check if input is a DOI
  const doi = extractDoi(input);
  if (doi && (!input.startsWith('http') || input.includes('doi.org'))) {
    try {
      return await resolveDoi(doi);
    } catch (err: any) {
      // If DOI resolution fails, provide clear message
      throw new Error(`Lỗi nhận diện DOI: ${err?.message || 'Không thể lấy thông tin từ mã DOI này.'}`);
    }
  }

  // 2. Validate URL & SSRF
  const check = validateSafeUrl(input);
  if (!check.isValid || !check.sanitizedUrl) {
    throw new Error(check.error || 'URL không hợp lệ hoặc không an toàn.');
  }

  const targetUrl = check.sanitizedUrl;

  // 3. Try server-side API proxy first (bypasses CORS and respects SSRF protection)
  try {
    const apiRes = await fetch(`/api/fetch-metadata?url=${encodeURIComponent(targetUrl)}`);
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && data.item) {
        return data.item;
      }
      if (data && data.html) {
        return parseHtmlMetadata(data.html, targetUrl);
      }
    } else {
      const errJson = await apiRes.json().catch(() => null);
      if (errJson?.error) {
        throw new Error(errJson.error);
      }
    }
  } catch (err: any) {
    // If it was an explicit server error like SSRF, rethrow
    if (err.message && err.message.includes('riêng tư')) {
      throw err;
    }
    // Otherwise fallback to client-side fetch attempt
  }

  // 4. Client-side fetch fallback
  try {
    const clientRes = await fetch(targetUrl, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml'
      }
    });

    if (!clientRes.ok) {
      throw new Error(`Trang web phản hồi mã lỗi ${clientRes.status}.`);
    }

    const html = await clientRes.text();
    return parseHtmlMetadata(html, targetUrl);
  } catch {
    throw new Error(
      'Không thể tự động đọc đầy đủ thông tin từ liên kết này (có thể do trang web chặn crawler hoặc yêu cầu đăng nhập).'
    );
  }
}
