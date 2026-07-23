import type { LinkPreviewResponse, PreviewImage } from './types';
import { isValidHttpUrl } from './utils/isValidHttpUrl';

const invalidResponse = (message: string): never => {
  throw new TypeError(`Invalid link preview response: ${message}`);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const optionalString = (value: unknown, field: string): string | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') {
    invalidResponse(`"${field}" must be a string`);
  }
  return value;
};

const optionalDimension = (
  value: unknown,
  field: string
): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    invalidResponse(`"${field}" must be a positive finite number`);
  }
  return value;
};

const parseImages = (value: unknown): PreviewImage[] | undefined => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) invalidResponse('"images" must be an array');

  return value.map((image, index) => {
    if (!isRecord(image)) invalidResponse(`"images[${index}]" must be an object`);

    const url = image.url;
    if (typeof url !== 'string' || !isValidHttpUrl(url)) {
      invalidResponse(`"images[${index}].url" must be a valid http(s) URL`);
    }

    const width = optionalDimension(image.width, `images[${index}].width`);
    const height = optionalDimension(image.height, `images[${index}].height`);
    return { url, width, height };
  });
};

const parseFavicons = (value: unknown): string[] | undefined => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some((favicon) => typeof favicon !== 'string')) {
    invalidResponse('"favicons" must be an array of strings');
  }
  return value as string[];
};

export const validateLinkPreviewResponse = (
  value: unknown
): LinkPreviewResponse => {
  if (!isRecord(value)) invalidResponse('body must be an object');

  const url = value.url;
  if (typeof url !== 'string' || !isValidHttpUrl(url)) {
    invalidResponse('"url" must be a valid http(s) URL');
  }

  return {
    url,
    title: optionalString(value.title, 'title'),
    description: optionalString(value.description, 'description'),
    images: parseImages(value.images),
    favicons: parseFavicons(value.favicons),
    mediaType: optionalString(value.mediaType, 'mediaType'),
    contentType: optionalString(value.contentType, 'contentType'),
    siteName: optionalString(value.siteName, 'siteName'),
  };
};
