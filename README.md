# S.EE Typescript SDK

A TypeScript SDK for the S.EE service platform with support for URL shortening and more.


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
  baseUrl: 'https://s.ee',
  apiKey: 'your-api-key'
});
```

### URL Shortener Module

#### List Available Domains

```typescript
try {
  const domains = await sdk.listDomains();
  console.log('Available domains:', domains.data.domains);
} catch (error) {
  console.error('Failed to get domains:', error.message);
}
```

#### Create Short URL

```typescript
try {
  const result = await sdk.create({
    domain: 'ba.sh',
    target_url: 'https://example.com/very/long/url',
    custom_slug: 'my-link', // Optional
    title: 'My Link' // Optional
  });
  
  console.log('Short URL created:', result.data.short_url);
  console.log('Slug:', result.data.slug);
} catch (error) {
  console.error('Creation failed:', error.message);
}
```

#### Update Short URL

```typescript
try {
  const result = await sdk.update({
    domain: 'ba.sh',
    slug: 'my-link',
    target_url: 'https://new-target.com',
    title: 'Updated Title'
  });
  console.log('Update successful:', result.data.short_url);
} catch (error) {
  console.error('Update failed:', error.message);
}
```

#### Delete Short URL

```typescript
try {
  const result = await sdk.delete({
    domain: 'ba.sh',
    slug: 'my-link'
  });
  console.log('Delete successful:', result.message);
} catch (error) {
  console.error('Delete failed:', error.message);
}
```

## API Reference

### SeeSDK

#### Constructor

```typescript
new SeeSDK(config: SdkConfig)
```

**Parameters:**

| Name    | Type   | Default        |
| ------- | ------ | -------------- |
| baseUrl | string | 'https://s.ee' |
| apiKey  | string | Required       |
| timeout | number | 10000          |

#### Methods - URL Shortener Module

##### create(request: UrlShortenRequest): Promise<UrlShortenResponse>

Create a new short URL.

**UrlShortenRequest Parameters:**

| Name        | Type   | Required | Description           |
| ----------- | ------ | -------- | --------------------- |
| domain      | string | Yes      | Domain to use         |
| target_url  | string | Yes      | Target URL to shorten |
| custom_slug | string | No       | Custom short code     |
| title       | string | No       | Link title            |

**Returns UrlShortenResponse:**

```typescript
{
  code: number;     // Response status code
  message: string;  // Response message
  data: {
    short_url: string;    // Generated short URL
    slug: string;         // Short code
    custom_slug?: string; // Custom slug (if set)
  }
}
```

##### delete(request: UrlShortenDeleteRequest): Promise<UrlShortenResponse>

Delete a specified short URL.

**UrlShortenDeleteRequest Parameters:**

| Name   | Type   | Required | Description       |
| ------ | ------ | -------- | ----------------- |
| domain | string | Yes      | Domain of the URL |
| slug   | string | Yes      | Short code        |

##### update(request: UrlShortenUpdateRequest): Promise<UrlShortenResponse>

Update a specified short URL.

**UrlShortenUpdateRequest Parameters:**

| Name       | Type   | Required | Description       |
| ---------- | ------ | -------- | ----------------- |
| domain     | string | Yes      | Domain of the URL |
| slug       | string | Yes      | Short code        |
| target_url | string | Yes      | New target URL    |
| title      | string | Yes      | New link title    |

##### listDomains(): Promise<DomainListResponse>

Get the list of available domains.

**Returns DomainListResponse:**

```typescript
{
  code: number;     // Response status code
  message: string;  // Response message
  data: {
    domains: string[]; // Array of available domains
  }
}
```

##### updateConfig(newConfig: Partial<SdkConfig>): void

Update SDK configuration.

**Parameter:**
- `newConfig`: Partial config object, only provide fields to update

## Error Handling

```typescript
import { ValidationError, NetworkError, SeeServiceError } from 'see-sdk';

try {
  await sdk.create({ domain: 'ba.sh', target_url: 'https://example.com' });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Validation error:', error.message);
  } else if (error instanceof NetworkError) {
    console.log('Network error:', error.message);
  } else if (error instanceof SeeServiceError) {
    console.log('API error:', error.message);
  }
}
```

## Examples

### Batch Operations

```typescript
const urls = [
  { domain: 'ba.sh', target_url: 'https://example1.com' },
  { domain: 'ba.sh', target_url: 'https://example2.com' }
];

for (const url of urls) {
  try {
    const result = await sdk.create(url);
    console.log('Created:', result.data.short_url);
  } catch (error) {
    console.error('Failed:', error.message);
  }
}
```

### Complete Workflow

```typescript
const domain = 'ba.sh';

// Create
const created = await sdk.create({
  domain,
  target_url: 'https://example.com',
  custom_slug: 'my-link'
});

// Update
const updated = await sdk.update({
  domain,
  slug: created.data.slug,
  target_url: 'https://new-target.com'
});

// Delete
await sdk.delete({ domain, slug: created.data.slug });
```

## Architecture

Modular design for easy addition of new service modules. Includes full TypeScript type definitions.

## License

This repository is licensed under the MIT License, for more information, see the LICENSE file.

## Contributing

Issues and Pull Requests are welcome!

## Changelog

### 1.0.0
- Initial S.EE SDK release
- URL Shortener module with CRUD operations
- Full TypeScript support with validation and error handling
