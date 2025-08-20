# See URL Shortener SDK

A TypeScript-based SDK for the See URL shortener service, providing a complete API wrapper.

## Features

- ✅ Create short URLs (supports custom domains and slugs)
- ✅ Delete short URLs
- ✅ Update short URLs (change target URL and title)
- ✅ List available domains
- ✅ Full TypeScript type support
- ✅ Input validation
- ✅ Error handling and retry mechanism
- ✅ Configurable HTTP client
- ✅ Comprehensive unit tests
- ✅ Environment variable configuration

## Installation

```bash
npm install url-shortener-sdk
# or
pnpm install url-shortener-sdk
```

## Quick Start

### Basic Usage

```typescript
import { UrlShortenSDK } from 'url-shortener-sdk';

// Initialize SDK
const sdk = new UrlShortenSDK({
  baseUrl: 'https://s.ee', // Default value, optional
  apiKey: 'your-api-key',
  timeout: 10000 // Optional, default is 10 seconds
});

// Or use environment variable (API_BASE_URL)
const sdk = new UrlShortenSDK({
  apiKey: 'your-api-key'
});

// List available domains
try {
  const domains = await sdk.listDomains();
  console.log('Available domains:', domains.data.domains);
} catch (error) {
  console.error('Failed to get domains:', error.message);
}

// Create short URL
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

// Update short URL
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

// Delete short URL
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

### UrlShortenSDK

#### Constructor

```typescript
new UrlShortenSDK(config: SdkConfig)
```

**SdkConfig Parameters:**

| Name    | Type   | Required | Description                          |
| ------- | ------ | -------- | ------------------------------------ |
| baseUrl | string | No       | API base URL, default 'https://s.ee' |
| apiKey  | string | Yes      | API key                              |
| timeout | number | No       | Request timeout (ms), default 10000  |

#### Methods

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

The SDK provides three main error types:

### ValidationError

Input validation error, thrown when parameters are invalid.

```typescript
import { ValidationError } from 'url-shortener-sdk';

try {
  await sdk.create({ 
    domain: 'ba.sh',
    target_url: 'invalid-url' 
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Validation error:', error.message);
  }
}
```

### NetworkError

Network request error, thrown when connection fails or times out.

```typescript
import { NetworkError } from 'url-shortener-sdk';

try {
  await sdk.create({ 
    domain: 'ba.sh',
    target_url: 'https://example.com' 
  });
} catch (error) {
  if (error instanceof NetworkError) {
    console.log('Network error:', error.message);
    console.log('Status code:', error.statusCode); // May be undefined
  }
}
```

### UrlShortenerError

API error, thrown when the server returns an error response.

```typescript
import { UrlShortenerError } from 'url-shortener-sdk';

try {
  await sdk.create({ 
    domain: 'ba.sh',
    target_url: 'https://example.com' 
  });
} catch (error) {
  if (error instanceof UrlShortenerError) {
    console.log('API error:', error.message);
    console.log('Error code:', error.code);
    console.log('Error details:', error.details);
  }
}
```

## Advanced Usage

### Environment Variable Configuration

SDK supports configuration via environment variables:

```bash
# .env file
API_BASE_URL=https://s.ee
API_KEY=your-api-key
```

```typescript
// When using environment variables, only provide apiKey
const sdk = new UrlShortenSDK({
  apiKey: process.env.API_KEY || 'your-api-key'
});
```

### Dynamic Configuration Update

```typescript
const sdk = new UrlShortenSDK({
  baseUrl: 'https://s.ee',
  apiKey: 'initial-key'
});

// Update config later
sdk.updateConfig({
  apiKey: 'new-api-key',
  timeout: 15000
});
```

### Batch Operation Example

```typescript
async function createMultipleUrls(urls: { domain: string, target_url: string, title?: string }[]) {
  const results = [];
  
  for (const urlData of urls) {
    try {
      const result = await sdk.create(urlData);
      results.push(result);
    } catch (error) {
      console.error(`Failed to create ${urlData.target_url}:`, error.message);
    }
  }
  
  return results;
}

// Usage example
const urlsToShorten = [
  { domain: 'ba.sh', target_url: 'https://example1.com', title: 'Example 1' },
  { domain: 'ba.sh', target_url: 'https://example2.com', title: 'Example 2' },
  { domain: 'ba.sh', target_url: 'https://example3.com', title: 'Example 3' }
];

const results = await createMultipleUrls(urlsToShorten);
```

### Complete Workflow Example

```typescript
async function completeWorkflow() {
  // 1. Get available domains
  const domains = await sdk.listDomains();
  const availableDomain = domains.data.domains[0];
  
  // 2. Create short URL
  const createResult = await sdk.create({
    domain: availableDomain,
    target_url: 'https://example.com',
    custom_slug: 'my-link',
    title: 'My Example Link'
  });
  
  console.log('Created:', createResult.data.short_url);
  
  // 3. Update short URL
  const updateResult = await sdk.update({
    domain: availableDomain,
    slug: createResult.data.slug,
    target_url: 'https://updated-example.com',
    title: 'Updated Title'
  });
  
  console.log('Updated:', updateResult.data.short_url);
  
  // 4. Delete short URL
  const deleteResult = await sdk.delete({
    domain: availableDomain,
    slug: createResult.data.slug
  });
  
  console.log('Deleted:', deleteResult.message);
}
```

### Error Retry Mechanism

```typescript
async function createWithRetry(
  request: { domain: string, target_url: string, title?: string }, 
  maxRetries = 3
) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await sdk.create(request);
    } catch (error) {
      lastError = error;
      
      if (error instanceof ValidationError) {
        // No retry for validation errors
        throw error;
      }
      
      if (i < maxRetries - 1) {
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
}
```

## Development

### Install dependencies

```bash
pnpm install
```

### Run tests

```bash
pnpm test
```

### Watch mode tests

```bash
pnpm test:watch
```

### Build

```bash
pnpm run build
```

### Lint

```bash
pnpm run lint
```

### Development mode

```bash
pnpm run dev
```

## Type Definitions

All TypeScript type definitions are included in the package. No need to install extra type packages.

## License

MIT

## Contributing

Issues and Pull Requests are welcome!

## Changelog

### 1.0.0
- Initial release
- Support for creating, deleting, and updating short URLs
- Support for listing available domains
- Full TypeScript support
- Input validation and error handling
- Support for custom domains and slugs
- Environment variable configuration
- Comprehensive unit test coverage
