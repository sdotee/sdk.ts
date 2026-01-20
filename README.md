# S.EE Typescript SDK

A TypeScript SDK for the S.EE content sharing platform, supporting URL shortening, text sharing, and file sharing.

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
- `update(request: UrlShortenUpdateRequest): Promise<UrlShortenResponse>`
- `delete(request: UrlShortenDeleteRequest): Promise<UrlShortenResponse>`
- `listDomains(): Promise<DomainListResponse>`
- `listTags(): Promise<TagsResponse>`

### Text Methods (`sdk.text`)

- `create(request: TextCreateRequest): Promise<TextCreateResponse>`
- `update(request: TextUpdateRequest): Promise<TextActionResponse>`
- `delete(request: TextDeleteRequest): Promise<TextActionResponse>`
- `listDomains(): Promise<TextDomainListResponse>`

### File Methods (`sdk.file`)

- `upload(file: any, options?: any): Promise<FileUploadResponse>`
- `delete(id: string): Promise<FileDeleteResponse>`
- `listDomains(): Promise<FileDomainListResponse>`

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
