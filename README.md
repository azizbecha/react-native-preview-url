# React Native Preview Url
A React Native library that provides an easy way to fetch and display link previews using the `useUrlPreview` hook and a customizable `<LinkPreview />` component.
It uses our own open-source free open source API `azizbecha-link-preview-api` available on GitHub at [https://github.com/azizbecha/link-preview-api](https://github.com/azizbecha/link-preview-api).

<p>You can use the API for free without an API key or host it yourself if you prefer.</p>
<img src="https://github.com/user-attachments/assets/ca1b0f21-0c47-4894-ae84-6c48fd5401cd" width="300" style="flex: 1" />


## Features

- Fetches metadata (title, description, images, favicons, etc.) from URLs
- Customizable preview component with styles and fallback support
- Supports timeout and error handling
- Handles URL validation and loading states

## Installation

```bash
npm install react-native-preview-url
# or
yarn add react-native-preview-url
```

## Usage

### useUrlPreview Hook

```tsx
import { useUrlPreview } from 'react-native-preview-url';

const { loading, data, error } = useUrlPreview('https://github.com');
```

### `<LinkPreview />` Component

```tsx
import React from 'react';
import { LinkPreview } from 'react-native-preview-url';

export const Example = () => (
  <LinkPreview
    url="https://github.com"
    timeout={3000} // optional, default timeout in ms
    onSuccess={(metadata) => console.log(metadata)}
    onError={(error) => console.error(error)}
    onPress={() => console.log('Pressed preview')}
    containerStyle={{ margin: 16, borderRadius: 8, backgroundColor: '#fff' }}
    imageStyle={{ borderRadius: 8, height: 150 }}
    titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
    descriptionStyle={{ fontSize: 14, color: '#555' }}
    urlStyle={{ fontSize: 12, color: 'grey' }}
    titleLines={2}
    descriptionLines={3}
    showUrl={true}
    hideImage={false}
  />
);
```

## Props

| Prop               | Type                                  | Required | Default             | Description                                          |
| ------------------ | ------------------------------------- | -------- | ------------------- | ---------------------------------------------------- |
| `url`              | `string`                              | Yes      | -                   | The URL to fetch metadata for                        |
| `timeout`          | `number`                              | No       | `3000`              | Fetch timeout in milliseconds                        |
| `onSuccess`        | `(data: LinkPreviewResponse) => void` | No       | -                   | Callback when data is successfully fetched           |
| `onError`          | `(error: string) => void`             | No       | -                   | Callback when fetching metadata fails                |
| `onPress`          | `(url: string) => void`               | No       | -                   | Callback when the preview component is pressed       |
| `containerStyle`   | `ViewStyle`                           | No       | -                   | Style for the container view                         |
| `imageStyle`       | `ImageStyle`                          | No       | -                   | Style for the preview image                          |
| `titleStyle`       | `TextStyle`                           | No       | -                   | Style for the title text                             |
| `descriptionStyle` | `TextStyle`                           | No       | -                   | Style for the description text                       |
| `urlStyle`         | `TextStyle`                           | No       | -                   | Style for the URL text                               |
| `titleLines`       | `number`                              | No       | 2                   | Number of lines for title text truncation            |
| `descriptionLines` | `number`                              | No       | 4                   | Number of lines for description text truncation      |
| `showUrl`          | `boolean`                             | No       | `true`              | Whether to show the URL domain below the description |
| `hideImage`        | `boolean`                             | No       | `false`             | Whether to hide the preview image                    |
| `visible`          | `boolean`                             | No       | `true`              | Whether to show or hide the preview component        |
| `loaderComponent`  | `ReactNode`                           | No       | `ActivityIndicator` | Custom loading component                             |
| `fallbackImage`    | `ImageSourcePropType`                 | No       | `undefined`         | Fallback image in case the website doesn't have one  |

## Example Response Object

```json
{
  "status": 200,
  "title": "azizbecha - Overview",
  "description": "I'm fixing bugs now, I'll write a bio later. azizbecha has 26 repositories available. Follow their code on GitHub.",
  "url": "https://github.com/azizbecha",
  "images": [
    "https://avatars.githubusercontent.com/u/63454940?v=4?s=400"
  ],
  "favicons": [
    "https://github.githubassets.com/favicons/favicon.svg"
  ],
  "mediaType": "profile",
  "contentType": "text/html",
  "siteName": "GitHub"
}
```

## License

MIT License
