export function getDomainFromUrl(url: string): string {
  if (!url) return '';

  // Check if URL has a valid protocol (http://, https://, etc.)
  const protocolMatch = url.match(/^[a-z][a-z0-9+.-]*:\/\//i);
  if (!protocolMatch) return '';

  // Remove protocol
  const urlWithoutProtocol = url.substring(protocolMatch[0].length);

  // Extract domain/hostname (everything before / or ? or # or :port)
  const domain = urlWithoutProtocol.split(/[/?#:]/)[0];

  return domain || '';
}
