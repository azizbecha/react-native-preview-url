export interface PreviewImage {
  url: string;
  width?: number;
  height?: number;
}

export interface LinkPreviewResponse {
  title?: string;
  description?: string;
  url: string;
  images?: PreviewImage[];
  favicons?: string[];
  mediaType?: string;
  contentType?: string;
  siteName?: string;
}
