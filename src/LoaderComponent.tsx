import { ActivityIndicator, StyleSheet, View } from 'react-native';

export const LoaderComponent: React.FC = () => (
  <View style={styles.container}>
    <ActivityIndicator />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
