import { Text, View, StyleSheet } from 'react-native';
import { useUrlPreview } from 'react-native-preview-url';

export default function App() {
  const { loading, data, error } = useUrlPreview('https://github.com');

  return (
    <View style={styles.container}>
      <Text>Loading: {JSON.stringify(loading)} </Text>
      <Text>Data: {JSON.stringify(data)}</Text>
      <Text>Error: {JSON.stringify(error)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
