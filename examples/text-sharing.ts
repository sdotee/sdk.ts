import { SeeSDK } from '../src/index';
import * as process from "node:process";

async function main() {
    console.log('📝 Text Sharing Example');

    const sdk = new SeeSDK({
        baseUrl: process.env.SEE_API_BASE || "https://s.ee",
        apiKey: process.env.SEE_API_KEY || "",
        timeout: 10000
    });

    try {
        console.log('\n1. List text domains');
        const domains = await sdk.text.listDomains();
        console.log('Domains:', domains.data.domains);

        console.log('\n2. Create a text share');
        const textShare = await sdk.text.create({
            content: "This is a sample text content shared via See SDK.",
            title: "My Shared Note"
        });
        console.log('Created:', textShare.data.short_url);
        console.log('Slug:', textShare.data.slug);

        console.log('\n3. Update the text share');
        const updated = await sdk.text.update({
            domain: 's.ee',
            slug: textShare.data.slug,
            content: "This content has been updated via the SDK.",
            title: "Updated Note Title"
        });
        console.log('Updated:', updated.message);

        console.log('\n4. Delete the text share');
        const deleted = await sdk.text.delete({
            domain: 's.ee',
            slug: textShare.data.slug
        });
        console.log('Deleted:', deleted.message);

    } catch (error: any) {
        console.error('Error:', error.message || error);
    }
}

if (require.main === module) {
    main();
}
