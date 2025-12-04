#!/usr/bin/env ts-node

import { SeeSDK, ValidationError, NetworkError, SeeServiceError } from '../src';
import * as process from "node:process";

/**
 * 演示如何使用 URL 缩短 SDK
 */
async function demo() {
    console.log('🚀 SEE SDK 演示\n');

    // 初始化 SDK
    const sdk = new SeeSDK({
        baseUrl: process.env.URL_SHORTENER_API_BASE || "https://s.ee",  // 这里应该是真实的API地址
        apiKey: process.env.URL_SHORTENER_API_KEY || "",
        timeout: 10000
    });

    console.log('✅ See SDK 初始化完成');

    // 演示 1: 创建基本短链接
    console.log('\n📝 演示 1: 创建基本短链接');
    try {
        const result1 = await createBasicShortUrl(sdk);
        console.log('结果:', result1);
    } catch (error) {
        handleError(error);
    }

    // 演示 2: 创建自定义代码的短链接
    console.log('\n📝 演示 2: 创建自定义代码的短链接');
    try {
        const result2 = await createCustomShortUrl(sdk);
        console.log('结果:', result2);
    } catch (error) {
        handleError(error);
    }

    // 演示 4: 验证错误处理
    console.log('\n📝 演示 3: 错误处理');
    await demonstrateErrorHandling(sdk);

    console.log('\n🎉 演示完成！');
}

/**
 * 创建基本短链接
 */
async function createBasicShortUrl(sdk: SeeSDK) {
    return await sdk.create({
        target_url: 'https://github.com/typescript-tutorial/typescript-tutorial',
        domain: 's.ee',
    });
}

/**
 * 创建自定义代码的短链接
 */
async function createCustomShortUrl(sdk: SeeSDK) {
    try {
        await sdk.delete({
            domain: 's.ee',
            slug: 'ts-docs'
        })
    } catch (error) {
        if (error instanceof ValidationError) {
            console.log('   ❌ 删除现有短链接失败:', error.message);
        } else {
            console.log('   ❌ 删除现有短链接时发生错误:', error);
        }
    }

    return await sdk.create({
        target_url: 'https://www.typescriptlang.org/docs/',
        domain: 's.ee',
        custom_slug: 'ts-docs',
        title: 'TypeScript Documentation',
    });
}


/**
 * 演示错误处理
 */
async function demonstrateErrorHandling(sdk: SeeSDK) {
    // 测试 1: 无效的URL
    console.log('   测试无效URL...');
    try {
        await sdk.create({target_url: 'invalid-url', domain: "s.ee"});
    } catch (error) {
        if (error instanceof ValidationError) {
            console.log('   ✅ 捕获到验证错误:', error.message);
        }
    }

    // 测试 2: 无效的自定义代码
    console.log('   测试无效自定义代码...');
    try {
        await sdk.create({
            target_url: 'https://example.com',
            domain: 's.ee',
            custom_slug: 'ab' // 太短
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            console.log('   ✅ 捕获到验证错误:', error.message);
        }
    }

    // 测试 3: 无效的ID
    console.log('   测试无效ID...');
    try {
        await sdk.delete({
            "domain": "s.ee",
            "slug": "nonexistent-slug"
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            console.log('   ✅ 捕获到验证错误:', error.message);
        }
    }
}

/**
 * 错误处理函数
 */
function handleError(error: any) {
    if (error instanceof ValidationError) {
        console.log('❌ 验证错误:', error.message);
    } else if (error instanceof NetworkError) {
        console.log('❌ 网络错误:', error.message);
        if (error.statusCode) {
            console.log('   状态码:', error.statusCode);
        }
    } else if (error instanceof SeeServiceError) {
        console.log('❌ API 错误:', error.message);
        console.log('   错误代码:', error.code);
        if (error.details) {
            console.log('   错误详情:', error.details);
        }
    } else {
        console.log('❌ 未知错误:', error.message);
    }
}

/**
 * 配置更新演示
 */
function demonstrateConfigUpdate(sdk: SeeSDK) {
    console.log('\n🔧 演示配置更新');

    // 更新部分配置
    sdk.updateConfig({
        apiKey: 'new-api-key-67890',
        timeout: 15000
    });

    console.log('✅ 配置已更新');
}

// 如果直接运行此文件，则执行演示
if (require.main === module) {
    demo().catch(console.error);
}

export {demo};
