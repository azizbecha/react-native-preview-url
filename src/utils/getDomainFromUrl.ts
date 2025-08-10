export function getDomainFromUrl(url: string): string {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname;
  } catch (error) {
    console.error('Invalid URL:', error);
    return '';
  }
}
