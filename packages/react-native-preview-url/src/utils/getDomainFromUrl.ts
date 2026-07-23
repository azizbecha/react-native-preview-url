export function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch (_) {
    return '';
  }
}
