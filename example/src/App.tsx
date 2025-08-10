import { LinkPreview } from 'react-native-preview-url';

export default function App() {
  return (
    <LinkPreview
      url="https://discord.com"
      onError={(e) => console.log(e)}
      onSuccess={(data) => console.log(data)}
      titleLines={1}
      descriptionLines={4}
    />
  );
}
