import { SeeSDK } from '../src/index';
import * as process from "node:process";

async function main() {
    console.log('🚀 URL Shortener Example');

    // Initialize SDK
    const sdk = new SeeSDK({
        baseUrl: process.env.SEE_API_BASE || "https://s.ee",
        apiKey: process.env.SEE_API_KEY || "",
        timeout: 10000
    });

    try {
        console.log('\n1. List available domains');
        const domains = await sdk.url.listDomains();
        console.log('Domains:', domains.data.domains);

        console.log('\n2. Create a basic short URL');
        const basicUrl = await sdk.url.create({
            target_url: 'https://github.com/typescript-tutorial/typescript-tutorial',
            domain: 's.ee',
        });
        console.log('Created:', basicUrl.data.short_url);

        console.log('\n3. Create a custom slug short URL');
        // Clean up if exists first (optional, mostly for running example multiple times)
        try {
            await sdk.url.delete({ domain: 's.ee', slug: 'ts-docs-example' });
        } catch { }

        const customUrl = await sdk.url.create({
            target_url: 'https://www.typescriptlang.org/docs/',
            domain: 's.ee',
            custom_slug: 'ts-docs-example',
            title: 'TypeScript Documentation',
        });
        console.log('Created Custom:', customUrl.data.short_url);

        console.log('\n4. Update the short URL');
        const updated = await sdk.url.update({
            domain: 's.ee',
            slug: customUrl.data.slug,
            target_url: 'https://www.typescriptlang.org/',
            title: 'TypeScript Home'
        });
        console.log('Updated:', updated.message);

        console.log('\n5. Delete the short URL');
        const deleted = await sdk.url.delete({
            domain: 's.ee',
            slug: customUrl.data.slug
        });
        console.log('Deleted:', deleted.message);

    } catch (error: any) {
        console.error('Error:', error.message || error);
    }
}

if (require.main === module) {
    main();
}
