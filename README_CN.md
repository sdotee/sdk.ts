# See URL Shortener SDK

一个基于 TypeScript 的 URL 缩短服务 SDK，为 See 短链接服务提供完整的 API 封装。

## 功能特性

- ✅ 创建短链接（支持自定义域名和短码）
- ✅ 删除短链接
- ✅ 更新短链接（修改目标链接和标题）
- ✅ 获取可用域名列表
- ✅ 完整的 TypeScript 类型支持
- ✅ 输入验证
- ✅ 错误处理和重试机制
- ✅ 可配置的 HTTP 客户端
- ✅ 完整的单元测试
- ✅ 支持环境变量配置

## 安装

```bash
npm install url-shortener-sdk
# 或者
pnpm install url-shortener-sdk
```

## 快速开始

### 基本使用

```typescript
import { UrlShortenSDK } from 'url-shortener-sdk';

// 初始化 SDK
const sdk = new UrlShortenSDK({
  baseUrl: 'https://s.ee', // 默认值，可以省略
  apiKey: 'your-api-key',
  timeout: 10000 // 可选，默认 10 秒
});

// 或者使用环境变量（API_BASE_URL）
const sdk = new UrlShortenSDK({
  apiKey: 'your-api-key'
});

// 获取可用域名列表
try {
  const domains = await sdk.listDomains();
  console.log('可用域名:', domains.data.domains);
} catch (error) {
  console.error('获取域名失败:', error.message);
}

// 创建短链接
try {
  const result = await sdk.create({
    domain: 'ba.sh',
    target_url: 'https://example.com/very/long/url',
    custom_slug: 'my-link', // 可选
    title: '我的链接' // 可选
  });
  
  console.log('短链接已创建:', result.data.short_url);
  console.log('短码:', result.data.slug);
} catch (error) {
  console.error('创建失败:', error.message);
}

// 更新短链接
try {
  const result = await sdk.update({
    domain: 'ba.sh',
    slug: 'my-link',
    target_url: 'https://new-target.com',
    title: '更新后的标题'
  });
  console.log('更新成功:', result.data.short_url);
} catch (error) {
  console.error('更新失败:', error.message);
}

// 删除短链接
try {
  const result = await sdk.delete({
    domain: 'ba.sh',
    slug: 'my-link'
  });
  console.log('删除成功:', result.message);
} catch (error) {
  console.error('删除失败:', error.message);
}
```

## API 参考

### UrlShortenSDK

#### 构造函数

```typescript
new UrlShortenSDK(config: SdkConfig)
```

**SdkConfig 参数:**

| 参数    | 类型   | 必需 | 描述                              |
| ------- | ------ | ---- | --------------------------------- |
| baseUrl | string | ❌    | API 基础 URL，默认 'https://s.ee' |
| apiKey  | string | ✅    | API 密钥                          |
| timeout | number | ❌    | 请求超时时间（毫秒），默认 10000  |

#### 方法

##### create(request: UrlShortenRequest): Promise<UrlShortenResponse>

创建一个新的短链接。

**UrlShortenRequest 参数:**

| 参数        | 类型   | 必需 | 描述             |
| ----------- | ------ | ---- | ---------------- |
| domain      | string | ✅    | 使用的域名       |
| target_url  | string | ✅    | 要缩短的目标 URL |
| custom_slug | string | ❌    | 自定义短链接代码 |
| title       | string | ❌    | 链接标题         |

**返回值 UrlShortenResponse:**

```typescript
{
  code: number;     // 响应状态码
  message: string;  // 响应消息
  data: {
    short_url: string;    // 生成的短链接
    slug: string;         // 短链接代码
    custom_slug?: string; // 自定义短码（如果设置）
  }
}
```

##### delete(request: UrlShortenDeleteRequest): Promise<UrlShortenResponse>

删除指定的短链接。

**UrlShortenDeleteRequest 参数:**

| 参数   | 类型   | 必需 | 描述         |
| ------ | ------ | ---- | ------------ |
| domain | string | ✅    | 短链接的域名 |
| slug   | string | ✅    | 短链接的代码 |

##### update(request: UrlShortenUpdateRequest): Promise<UrlShortenResponse>

更新指定的短链接。

**UrlShortenUpdateRequest 参数:**

| 参数       | 类型   | 必需 | 描述         |
| ---------- | ------ | ---- | ------------ |
| domain     | string | ✅    | 短链接的域名 |
| slug       | string | ✅    | 短链接的代码 |
| target_url | string | ✅    | 新的目标 URL |
| title      | string | ✅    | 新的链接标题 |

##### listDomains(): Promise<DomainListResponse>

获取可用的域名列表。

**返回值 DomainListResponse:**

```typescript
{
  code: number;     // 响应状态码
  message: string;  // 响应消息
  data: {
    domains: string[]; // 可用域名数组
  }
}
```

##### updateConfig(newConfig: Partial<SdkConfig>): void

更新 SDK 配置。

**参数:**
- `newConfig`: 部分配置对象，只需提供要更新的字段

## 错误处理

SDK 提供了三种主要的错误类型：

### ValidationError

输入验证错误，当提供的参数不符合要求时抛出。

```typescript
import { ValidationError } from 'url-shortener-sdk';

try {
  await sdk.create({ 
    domain: 'ba.sh',
    target_url: 'invalid-url' 
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('验证错误:', error.message);
  }
}
```

### NetworkError

网络请求错误，当网络连接失败或超时时抛出。

```typescript
import { NetworkError } from 'url-shortener-sdk';

try {
  await sdk.create({ 
    domain: 'ba.sh',
    target_url: 'https://example.com' 
  });
} catch (error) {
  if (error instanceof NetworkError) {
    console.log('网络错误:', error.message);
    console.log('状态码:', error.statusCode); // 可能为 undefined
  }
}
```

### UrlShortenerError

API 错误，当服务器返回错误响应时抛出。

```typescript
import { UrlShortenerError } from 'url-shortener-sdk';

try {
  await sdk.create({ 
    domain: 'ba.sh',
    target_url: 'https://example.com' 
  });
} catch (error) {
  if (error instanceof UrlShortenerError) {
    console.log('API 错误:', error.message);
    console.log('错误代码:', error.code);
    console.log('错误详情:', error.details);
  }
}
```

## 高级用法

### 环境变量配置

SDK 支持通过环境变量进行配置：

```bash
# .env 文件
API_BASE_URL=https://s.ee
API_KEY=your-api-key
```

```typescript
// 使用环境变量时，只需提供 apiKey
const sdk = new UrlShortenSDK({
  apiKey: process.env.API_KEY || 'your-api-key'
});
```

### 动态配置更新

```typescript
const sdk = new UrlShortenSDK({
  baseUrl: 'https://s.ee',
  apiKey: 'initial-key'
});

// 稍后更新配置
sdk.updateConfig({
  apiKey: 'new-api-key',
  timeout: 15000
});
```

### 批量操作示例

```typescript
async function createMultipleUrls(urls: { domain: string, target_url: string, title?: string }[]) {
  const results = [];
  
  for (const urlData of urls) {
    try {
      const result = await sdk.create(urlData);
      results.push(result);
    } catch (error) {
      console.error(`创建 ${urlData.target_url} 失败:`, error.message);
    }
  }
  
  return results;
}

// 使用示例
const urlsToShorten = [
  { domain: 'ba.sh', target_url: 'https://example1.com', title: '示例1' },
  { domain: 'ba.sh', target_url: 'https://example2.com', title: '示例2' },
  { domain: 'ba.sh', target_url: 'https://example3.com', title: '示例3' }
];

const results = await createMultipleUrls(urlsToShorten);
```

### 完整工作流程示例

```typescript
async function completeWorkflow() {
  // 1. 获取可用域名
  const domains = await sdk.listDomains();
  const availableDomain = domains.data.domains[0];
  
  // 2. 创建短链接
  const createResult = await sdk.create({
    domain: availableDomain,
    target_url: 'https://example.com',
    custom_slug: 'my-link',
    title: '我的示例链接'
  });
  
  console.log('创建成功:', createResult.data.short_url);
  
  // 3. 更新短链接
  const updateResult = await sdk.update({
    domain: availableDomain,
    slug: createResult.data.slug,
    target_url: 'https://updated-example.com',
    title: '更新后的标题'
  });
  
  console.log('更新成功:', updateResult.data.short_url);
  
  // 4. 删除短链接
  const deleteResult = await sdk.delete({
    domain: availableDomain,
    slug: createResult.data.slug
  });
  
  console.log('删除成功:', deleteResult.message);
}
```

### 错误重试机制

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
        // 验证错误不需要重试
        throw error;
      }
      
      if (i < maxRetries - 1) {
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
}
```

## 开发

### 安装依赖

```bash
pnpm install
```

### 运行测试

```bash
pnpm test
```

### 监听模式测试

```bash
pnpm test:watch
```

### 构建

```bash
pnpm run build
```

### 代码检查

```bash
pnpm run lint
```

### 开发模式

```bash
pnpm run dev
```

## 类型定义

所有的 TypeScript 类型定义都包含在包中，无需额外安装类型包。

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### 1.0.0
- 初始版本发布
- 支持创建、删除和更新短链接
- 支持获取可用域名列表
- 完整的 TypeScript 支持
- 输入验证和错误处理
- 支持自定义域名和短码
- 支持环境变量配置
- 完整的单元测试覆盖
