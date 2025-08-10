# React Native Preview Url

A React Native library that provides an easy way to fetch and display link previews using the `useUrlPreview` hook and a customizable `<LinkPreview />` component.
It uses our own open-source free open source API `azizbecha-link-preview-api` available on GitHub at [https://github.com/azizbecha/link-preview-api](https://github.com/azizbecha/link-preview-api).

You can use the API for free without an API key or host it yourself if you prefer.

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
  "title": "GitHub · Build and ship software on a single, collaborative platform",
  "description": "Join the world's most widely adopted, AI-powered developer platform where millions of developers, businesses, and the largest open source community build software that advances humanity.",
  "url": "https://github.com/",
  "images": [
    "https://images.ctfassets.net/8aevphvgewt8/4UxhHBs2XnuyZ4lYQ83juV/b61529b087aeb4a318bda311edf4c345/home24.jpg"
  ],
  "favicons": ["https://github.githubassets.com/favicons/favicon.svg"],
  "mediaType": "object",
  "contentType": "text/html",
  "siteName": "GitHub"
}
```

## License

MIT License
