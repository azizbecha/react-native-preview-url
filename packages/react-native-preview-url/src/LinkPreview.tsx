import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { LoaderComponent } from './LoaderComponent';

import { DEFAULT_TIMEOUT } from './constants';
import { useUrlPreview } from './useUrlPreview';
import { getDomainFromUrl } from './utils/getDomainFromUrl';
import type { LinkPreviewResponse } from './types';
import { selectPreviewImage } from './selectPreviewImage';

export interface LinkPreviewProps {
  url: string;
  timeout?: number;
  onError?: (error: string) => void;
  onSuccess?: (data: LinkPreviewResponse) => void;
  onPress?: (data: LinkPreviewResponse) => void;
  onPressError?: (error: Error) => void;
  titleLines?: number;
  descriptionLines?: number;
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  urlStyle?: TextStyle;
  showUrl?: boolean;
  hideImage?: boolean;
  visible?: boolean;
  loaderComponent?: React.ReactNode;
  fallbackImage?: ImageSourcePropType;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({
  url,
  timeout = DEFAULT_TIMEOUT,
  onError,
  onSuccess,
  onPress,
  onPressError,
  titleLines = 2,
  descriptionLines = 4,
  containerStyle,
  imageStyle,
  titleStyle,
  descriptionStyle,
  urlStyle,
  showUrl = true,
  hideImage = false,
  visible = true,
  loaderComponent,
  fallbackImage,
}) => {
  const { loading, data, error } = useUrlPreview(url, timeout);
  const [imageError, setImageError] = useState<boolean>(false);
  const activeImageUriRef = useRef<string | undefined>(undefined);

  // Read latest callbacks via refs so the success/error effects below can
  // depend only on `data`/`error`. Without this, an inline arrow at the call
  // site (which gets a fresh reference every render) would re-fire the effect
  // each render, and for an `error` that persists, drive an infinite loop.
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  });
  useEffect(() => {
    onErrorRef.current = onError;
  });

  const previewImage = selectPreviewImage(data?.images);
  const candidateImageUri = previewImage?.url;
  const imageUri = !imageError ? candidateImageUri : undefined;
  const imageSource = imageUri ? { uri: imageUri } : fallbackImage;
  const shouldRenderImage = !hideImage && imageSource !== undefined;
  activeImageUriRef.current = candidateImageUri;

  useEffect(() => {
    setImageError(false);
  }, [candidateImageUri]);

  useEffect(() => {
    if (data) {
      onSuccessRef.current?.(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      onErrorRef.current?.(error);
    }
  }, [error]);

  if (loading) {
    return <>{loaderComponent || <LoaderComponent />}</>;
  }

  if (error || !data || !visible) return null;

  const domain = getDomainFromUrl(data.url);
  const accessibilityText = [data.title, data.description]
    .filter(
      (value): value is string =>
        typeof value === 'string' && value.trim().length > 0
    )
    .join(', ');
  const accessibilityLabel =
    accessibilityText || `Link preview for ${domain || 'link'}`;
  const imageAccessibilityLabel = data.title
    ? `Preview image for ${data.title}`
    : `Preview image${domain ? ` for ${domain}` : ''}`;

  const handleImageError = (failedUri: string | undefined) => {
    if (failedUri && failedUri !== activeImageUriRef.current) return;
    setImageError(true);
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => {
        if (onPress) onPress(data);
        else {
          void Promise.resolve()
            .then(() => Linking.openURL(data.url))
            .catch((reason: unknown) => {
              const openError =
                reason instanceof Error ? reason : new Error(String(reason));
              onPressError?.(openError);
            });
        }
      }}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={domain ? `Opens ${domain}` : 'Opens link'}
    >
      {shouldRenderImage && (
        <Image
          source={imageSource}
          style={[
            styles.image,
            previewImage?.width && previewImage.height
              ? { aspectRatio: previewImage.width / previewImage.height }
              : undefined,
            imageStyle,
          ]}
          resizeMode="cover"
          onError={() => handleImageError(candidateImageUri)}
          accessibilityLabel={imageAccessibilityLabel}
        />
      )}
      <View style={styles.contentContainer}>
        <Text numberOfLines={titleLines} style={[styles.title, titleStyle]}>
          {data.title}
        </Text>
        <Text
          style={[styles.description, descriptionStyle]}
          numberOfLines={descriptionLines}
        >
          {data.description}
        </Text>

        {showUrl && (
          <Text style={[styles.link, urlStyle]} numberOfLines={1}>
            {getDomainFromUrl(data.url)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexShrink: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
    width: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    gap: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    flexShrink: 1,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
  link: {
    fontSize: 12,
    color: 'grey',
    marginTop: 8,
  },
});
