import type { VercelRequest, VercelResponse } from '@vercel/node';

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  'metadata.google.internal',
  'instance-data',
  '169.254.169.254'
]);

function isPrivateIp(hostname: string): boolean {
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    return true;
  }
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
      return true;
    }
  }
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Thiếu tham số url.' });
  }

  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return res.status(400).json({ error: 'Định dạng URL không hợp lệ.' });
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return res.status(400).json({ error: 'Chỉ chấp nhận giao thức http:// hoặc https://' });
  }

  if (isPrivateIp(parsed.hostname.toLowerCase())) {
    return res.status(403).json({ error: 'Truy cập đến dải IP riêng tư hoặc localhost bị từ chối (SSRF Protection).' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(parsed.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8'
      },
      redirect: 'follow'
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(502).json({ error: `Website từ chối kết nối (Mã lỗi HTTP ${response.status}).` });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('xml') && !contentType.includes('json')) {
      return res.status(415).json({ error: 'Định dạng tài liệu không được hỗ trợ để đọc siêu dữ liệu.' });
    }

    // Limit read size to 2MB to prevent memory exhaustion
    const text = await response.text();
    const limitedText = text.slice(0, 2 * 1024 * 1024);

    return res.status(200).json({ html: limitedText });
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Hết thời gian chờ kết nối đến trang web (Timeout 8s).' });
    }
    return res.status(500).json({ error: `Không thể kết nối đến website: ${err.message || 'Lỗi mạng'}` });
  }
}
