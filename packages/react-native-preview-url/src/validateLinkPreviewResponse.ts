import type { LinkPreviewResponse, PreviewImage } from './types';
import { isValidHttpUrl } from './utils/isValidHttpUrl';

const invalidResponse = (message: string): never => {
  throw new TypeError(`Invalid link preview response: ${message}`);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const optionalString = (value: unknown, field: string): string | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'string') return value;
  return invalidResponse(`"${field}" must be a string`);
};

const optionalDimension = (
  value: unknown,
  field: string
): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value;
  }
  return invalidResponse(`"${field}" must be a positive finite number`);
};

const parseImages = (value: unknown): PreviewImage[] | undefined => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return invalidResponse('"images" must be an array');

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
  if (
    Array.isArray(value) &&
    value.every((favicon): favicon is string => typeof favicon === 'string')
  ) {
    return value;
  }
  return invalidResponse('"favicons" must be an array of strings');
};

export const validateLinkPreviewResponse = (
  value: unknown
): LinkPreviewResponse => {
  if (!isRecord(value)) return invalidResponse('body must be an object');

  const rawUrl = value.url;
  if (typeof rawUrl !== 'string' || !isValidHttpUrl(rawUrl)) {
    return invalidResponse('"url" must be a valid http(s) URL');
  }
  const url = rawUrl;

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
