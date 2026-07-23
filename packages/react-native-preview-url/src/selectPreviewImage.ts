import type { PreviewImage } from './types';

const isHttpsImage = (image: PreviewImage): boolean => {
  try {
    return new URL(image.url).protocol === 'https:';
  } catch (_) {
    return false;
  }
};

const getArea = (image: PreviewImage): number => {
  if (
    typeof image.width !== 'number' ||
    typeof image.height !== 'number' ||
    image.width <= 0 ||
    image.height <= 0
  ) {
    return -1;
  }
  return image.width * image.height;
};

export const selectPreviewImage = (
  images: PreviewImage[] | undefined
): PreviewImage | undefined => {
  const validImages = images?.filter(isHttpsImage);
  if (!validImages?.length) return undefined;

  return validImages.reduce((best, image) =>
    getArea(image) > getArea(best) ? image : best
  );
};
