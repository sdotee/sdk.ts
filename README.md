# S.EE Typescript SDK

A TypeScript SDK for the S.EE content sharing platform, supporting URL shortening, text and file sharing, QR codes, bio pages, and account usage APIs.

## Installation

```bash
npm i see-sdk
# or
pnpm i see-sdk
```

For more information, visit the npm page: https://www.npmjs.com/package/see-sdk

## Quick Start

```typescript
import { SeeSDK } from 'see-sdk';

const sdk = new SeeSDK({
  baseUrl: 'https://s.ee/api/v1', // optional, defaults to 'https://s.ee/api/v1'
  apiKey: 'your-api-key'
});
```

## Modules

The SDK is organized into modules for different content types:

- `sdk.url`: URL Shortening operations
- `sdk.text`: Text Sharing operations
- `sdk.file`: File Sharing operations
- `sdk.qrcode`: QR Code operations
- `sdk.bio`: Bio Page operations
- `sdk.account`: Token validation and account usage

*(Note: Older top-level methods like `sdk.create` are deprecated but still supported for backward compatibility)*

### URL Shortener

See [examples/url-shortener.ts](examples/url-shortener.ts) for a complete example.

```typescript
const result = await sdk.url.create({
  domain: 'ba.sh',
  target_url: 'https://example.com',
  custom_slug: 'my-link'
});
```

### Text Sharing

See [examples/text-sharing.ts](examples/text-sharing.ts) for a complete example.

```typescript
const result = await sdk.text.create({
  content: 'Shared text content',
  title: 'My Title'
});
```

### File Sharing

See [examples/file-sharing.ts](examples/file-sharing.ts) for a complete example.

```typescript
// Requires FormData (e.g. 'form-data' package in Node.js)
const result = await sdk.file.upload(formData);
```

Large files use the TUS workflow exposed by `createLargeUpload`, `uploadChunk`, and `completeLargeUpload`.

## API Reference

### SeeSDK

#### Constructor

```typescript
new SeeSDK(config: SdkConfig)
```

**Parameters:**

| Name    | Type   | Default               |
| ------- | ------ | --------------------- |
| baseUrl | string | 'https://s.ee/api/v1' |
| apiKey  | string | Required              |
| timeout | number | 10000          |

### URL Methods (`sdk.url`)

- `create(request: UrlShortenRequest): Promise<UrlShortenResponse>`
- `createSimple(request: UrlShortenSimpleRequest): Promise<UrlShortenResponse | string>`
- `update(request: UrlShortenUpdateRequest): Promise<UrlShortenResponse>`
- `delete(request: UrlShortenDeleteRequest): Promise<UrlShortenResponse>`
- `listDomains(): Promise<DomainListResponse>`
- `listTags(): Promise<TagsResponse>`
- `history(params?: HistoryParams): Promise<LinkHistoryResponse>`
- `visitStats(params: LinkVisitStatParams): Promise<LinkVisitStatResponse>`

### Text Methods (`sdk.text`)

- `create(request: TextCreateRequest): Promise<TextCreateResponse>`
- `update(request: TextUpdateRequest): Promise<TextActionResponse>`
- `delete(request: TextDeleteRequest): Promise<TextActionResponse>`
- `listDomains(): Promise<TextDomainListResponse>`
- `history(params?: HistoryParams): Promise<TextHistoryResponse>`

### File Methods (`sdk.file`)

- `upload(file: unknown, options?: AxiosRequestConfig): Promise<FileUploadResponse>`
- `delete(id: string): Promise<FileDeleteResponse>`
- `listDomains(): Promise<FileDomainListResponse>`
- `history(params?: HistoryParams): Promise<FileHistoryResponse>`
- `getPrivateDownloadUrl(fileId: number): Promise<PrivateFileUrlResponse>`
- `createLargeUpload(request: CreateLargeFileUploadRequest): Promise<CreateLargeFileUploadResponse>`
- `uploadChunk(uploadId, chunk, uploadOffset, config?): Promise<TusUploadStatus>`
- `getLargeUploadStatus(uploadId: string): Promise<TusUploadStatus>`
- `getLargeUploadProgress(uploadId: string): Promise<LargeFileUploadProgressResponse>`
- `completeLargeUpload(uploadId: string): Promise<CompleteLargeFileUploadResponse>`
- `cancelLargeUpload(uploadId: string): Promise<ApiResponse>`
- `deleteLargeUpload(uploadId: string): Promise<void>`

### QR Code Methods (`sdk.qrcode`)

- `create(request: QrcodeCreateRequest): Promise<QrcodeCreateResponse>`
- `delete(request: QrcodeDeleteRequest): Promise<ApiResponse>`
- `history(params?: HistoryParams): Promise<QrcodeHistoryResponse>`

### Bio Page Methods (`sdk.bio`)

- `create(request: BioPageCreateRequest): Promise<BioPageCreateResponse>`
- `update(request: BioPageUpdateRequest): Promise<ApiResponse>`
- `delete(id: number): Promise<ApiResponse>`
- `history(params?: HistoryParams): Promise<BioPageHistoryResponse>`

### Account Methods (`sdk.account`)

- `checkToken(token: string): Promise<TokenCheckResponse>`
- `usage(): Promise<UsageResponse>`

## Error Handling

See [examples/error-handling.ts](examples/error-handling.ts) for detailed error handling scenarios.

```typescript
import { ValidationError, NetworkError, SeeServiceError } from 'see-sdk';

try {
  await sdk.url.create({ ... });
} catch (error) {
  if (error instanceof ValidationError) {
    // Check your input
  } else if (error instanceof NetworkError) {
    // Check your connection
  } else if (error instanceof SeeServiceError) {
    // Check API response
  }
}
```

## License

This repository is licensed under the MIT License, for more information, see the LICENSE file.
