import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewStyle } from 'react-native';

interface LinkPreviewSkeletonProps {
  containerStyle?: ViewStyle;
  showImage?: boolean;
  showUrl?: boolean;
}

interface SkeletonElementProps {
  style: ViewStyle;
  opacity: Animated.AnimatedInterpolation<string | number>;
}

const SkeletonElement: React.FC<SkeletonElementProps> = ({
  style,
  opacity,
}) => <Animated.View style={[style, styles.skeletonBase, { opacity }]} />;

export const LoaderComponent: React.FC<LinkPreviewSkeletonProps> = ({
  containerStyle,
  showImage = true,
  showUrl = true,
}) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnimation]);

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {showImage && (
        <SkeletonElement
          style={styles.imageSkeleton}
          opacity={shimmerOpacity}
        />
      )}

      <View style={styles.contentContainer}>
        {/* Title skeleton - 2 lines */}
        <SkeletonElement
          style={StyleSheet.flatten([
            styles.textSkeleton,
            styles.titleSkeleton,
          ])}
          opacity={shimmerOpacity}
        />
        <SkeletonElement
          style={StyleSheet.flatten([
            styles.textSkeleton,
            styles.titleSkeletonSecond,
          ])}
          opacity={shimmerOpacity}
        />

        {/* Description skeleton - 3 lines */}
        <View style={styles.descriptionContainer}>
          <SkeletonElement
            style={StyleSheet.flatten([
              styles.textSkeleton,
              styles.descriptionSkeleton,
            ])}
            opacity={shimmerOpacity}
          />
          <SkeletonElement
            style={StyleSheet.flatten([
              styles.textSkeleton,
              styles.descriptionSkeleton,
            ])}
            opacity={shimmerOpacity}
          />
          <SkeletonElement
            style={StyleSheet.flatten([
              styles.textSkeleton,
              styles.descriptionSkeletonLast,
            ])}
            opacity={shimmerOpacity}
          />
        </View>

        {/* URL skeleton */}
        {showUrl && (
          <SkeletonElement
            style={StyleSheet.flatten([
              styles.textSkeleton,
              styles.urlSkeleton,
            ])}
            opacity={shimmerOpacity}
          />
        )}
      </View>
    </View>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: { flexShrink: 1 },
  skeletonBase: {
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
  },
  imageSkeleton: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10,
  },
  textSkeleton: {
    height: 16,
    marginBottom: 4,
  } as const,
  titleSkeleton: {
    width: '85%',
    height: 18,
    marginBottom: 6,
  } as const,
  titleSkeletonSecond: {
    width: '60%',
    height: 18,
    marginBottom: 8,
  } as const,
  descriptionContainer: {
    marginBottom: 8,
  },
  descriptionSkeleton: {
    width: '100%',
    height: 14,
    marginBottom: 4,
  } as const,
  descriptionSkeletonLast: {
    width: '75%',
    height: 14,
    marginBottom: 4,
  } as const,
  urlSkeleton: {
    width: '40%',
    height: 12,
    marginTop: 4,
  } as const,
});
