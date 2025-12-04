import { SeeSDK, ValidationError, NetworkError, SeeServiceError, UrlShortenResponse } from '../src/index';
import process from "node:process";

// 示例：基本使用
async function basicExample() {
    console.log('=== 基本使用示例 ===');

    // 初始化 SDK
    const sdk = new SeeSDK({
        baseUrl: process.env.URL_SHORTENER_API_BASE || "https://s.ee",  // 这里应该是真实的API地址
        apiKey: process.env.URL_SHORTENER_API_KEY || "",
        timeout: 10000
    });


    try {
        // 列出支持的域名列表
        const domainListResponse = await sdk.listDomains();
        console.log("\n获取域名列表成功");
        console.log(`- 代码: ${domainListResponse.code}`);
        console.log("- 支持的域名列表:", domainListResponse.data.domains.join(", "));

        // 创建短链接
        const createResult = await sdk.create({
            target_url: 'https://www.example.com/very/long/url/with/many/parameters?param1=value1&param2=value2',
            domain: 's.ee'
        });

        console.log('短链接创建成功:');
        console.log(`- 短链接: ${createResult.data.short_url}`);
        // console.log(`- 原始链接: ${createResult.originalUrl}`);
        console.log(`- 代码: ${createResult.code}`);
        // console.log(`- 创建时间: ${createResult.createdAt}`);

        const updateResult = await sdk.update({
            domain: 's.ee',
            slug: createResult.data.slug,
            target_url: 'https://www.example.com/updated/url',
            title: `Updated Title ${Date.now()}`
        });

        // console.info(updateResult);
        console.log("\n更新短链接成功:");
        console.log(`- 消息: ${updateResult.message}`);
        console.log(`- 代码: ${updateResult.code}`);

        // 删除短链接
        const deleteResult = await sdk.delete({
            slug: createResult.data.slug, domain: 's.ee'
        });

        console.log("\n删除结果:");
        console.log(`- 成功: ${deleteResult.code}`);
        console.log(`- 消息: ${deleteResult.message}`);
    } catch (error) {
        console.error('操作失败:', error);
    }
}

// 示例：错误处理
async function errorHandlingExample() {
    console.log("\n=== 错误处理示例 ===");

    const sdk = new SeeSDK({
        baseUrl: 'https://api.example-shortener.com',
        apiKey: 'your-api-key-here'
    });

    // 验证错误示例
    try {
        await sdk.create({
            target_url: 'invalid-url-format',
            domain: 's.ee'
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            console.log('捕获到验证错误:', error.message);
        }
    }

    // 自定义代码格式错误
    try {
        await sdk.create({
            target_url: 'https://example.com',
            domain: 's.ee',
            custom_slug: 'ab' // 太短
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            console.log('自定义代码验证错误:', error.message);
        }
    }

    // 网络错误示例（使用错误的 URL）
    const badSdk = new SeeSDK({
        baseUrl: 'https://non-existent-api.com',
        apiKey: 'test-key'
    });

    try {
        await badSdk.create({
            target_url: 'https://example.com',
            domain: 's.ee'
        });
    } catch (error) {
        if (error instanceof NetworkError) {
            console.log('捕获到网络错误:', error.message);
            console.log('状态码:', error.statusCode);
        }
    }
}

// 示例：批量操作
async function batchOperationExample() {
    console.log("\n=== 批量操作示例 ===");

    const sdk = new SeeSDK({
        baseUrl: process.env.URL_SHORTENER_API_BASE || "https://s.ee",  // 这里应该是真实的API地址
        apiKey: process.env.URL_SHORTENER_API_KEY || "",
        timeout: 10000
    });

    const urls = [
        'https://www.google.com',
        'https://www.github.com',
        'https://www.stackoverflow.com',
        'https://www.npm.com'
    ];

    const results: UrlShortenResponse[] = [];

    for (const url of urls) {
        try {
            const result = await sdk.create({
                target_url: url,
                domain: 's.ee'
            });
            results.push(result);
            console.log(`✅ ${url} -> ${result.data.short_url}`);
        } catch (error) {
            console.log(`❌ ${url} -> 失败: ${error}`);
        }
    }

    console.log("\n" + `批量操作完成，成功创建 ${results.length}/${urls.length} 个短链接`);
    return results;
}

// 示例：配置更新
async function configUpdateExample() {
    console.log("\n=== 配置更新示例 ===");

    const sdk = new SeeSDK({
        baseUrl: 'https://api.example-shortener.com',
        apiKey: 'initial-api-key',
        timeout: 5000
    });

    console.log('初始配置设置完成');

    // 更新 API 密钥
    sdk.updateConfig({
        apiKey: 'new-api-key'
    });
    console.log('API 密钥已更新');

    // 更新超时时间
    sdk.updateConfig({
        timeout: 15000
    });
    console.log('超时时间已更新为 15 秒');

    // 同时更新多个配置
    sdk.updateConfig({
        baseUrl: 'https://new-api.shortener.com',
        apiKey: 'updated-key',
        timeout: 20000
    });
    console.log('多个配置项已同时更新');
}

// 示例：重试机制
async function retryExample() {
    console.log("\n=== 重试机制示例 ===");

    const sdk = new SeeSDK({
        baseUrl: 'https://api.example-shortener.com',
        apiKey: 'your-api-key-here'
    });

    async function createWithRetry(url: string, maxRetries = 3) {
        let lastError;

        for (let i = 0; i < maxRetries; i++) {
            try {
                console.log(`尝试创建短链接 (第${i + 1}次)...`);
                const result = await sdk.create({target_url: url, domain: "s.ee"});
                console.log(`✅ 成功创建: ${result.data.short_url}`);
                return result;
            } catch (error) {
                lastError = error;

                if (error instanceof ValidationError) {
                    console.log('❌ 验证错误，不进行重试');
                    throw error;
                }

                if (i < maxRetries - 1) {
                    const delay = 1000 * Math.pow(2, i); // 指数退避
                    console.log(`❌ 失败，${delay}ms 后重试...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        console.log('❌ 达到最大重试次数，操作失败');
        throw lastError;
    }

    try {
        await createWithRetry('https://example.com/test-retry');
    } catch (error) {
        console.log('重试示例失败:', error);
    }
}

// 运行所有示例
async function runAllExamples() {
    console.log("See URL Shortener SDK 使用示例\n");

    // 注意：这些示例需要真实的 API 端点才能正常工作
    // 在实际使用中，请替换为您的真实 API 配置

    await basicExample();
    // await expirationExample();
    await errorHandlingExample();
    await batchOperationExample();
    await configUpdateExample();
    await retryExample();

    console.log("\n所有示例运行完成！");
}

// 如果直接运行此文件，则执行示例
if (require.main === module) {
    runAllExamples().catch(console.error);
}

export {
    basicExample,
    // expirationExample,
    errorHandlingExample,
    batchOperationExample,
    configUpdateExample,
    retryExample
};
