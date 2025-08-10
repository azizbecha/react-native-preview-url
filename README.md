# react-native-preview-url

A React Native component to generate rich link previews by fetching metadata (title, description, images) from URLs. Easily integrate customizable and lightweight link previews into your app.

## Installation

```sh
npm install react-native-preview-url
```

## Usage

### Props

- url (required)
- timeout (optional)
- onSuccess(metadata => console.log(metdata))
- onError(e => console.log(e))
- titleLines: number
- descriptionLines: number
- onPress: () => void
- containerStyle: ViewStyle
- imageContainerStyle: ViewStyle
- titleStyle: TextStyle
- descriptionStyle: TextStyle
- showUrl: boolean
- hideImage?: boolean = false
- loaderComponent: React.ReactNode
- fallbackImage: ImageSource

- baseUrl(later)
- imageComponent
- placeholderImage

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
