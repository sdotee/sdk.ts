import { SeeSDK, ValidationError, NetworkError, SeeServiceError } from '../src/index';
import * as process from "node:process";

async function main() {
    console.log('⚠️ Error Handling Example');

    const sdk = new SeeSDK({
        baseUrl: "https://s.ee",
        apiKey: "test-key"
    });

    console.log('\n1. Validation Error (Invalid URL)');
    try {
        await sdk.url.create({ target_url: 'not-a-valid-url', domain: 's.ee' });
    } catch (error) {
        if (error instanceof ValidationError) {
            console.log('Caught Expected Validation Error:', error.message);
        } else {
            console.log('Caught Unexpected Error:', error);
        }
    }

    console.log('\n2. Validation Error (Invalid Custom Slug)');
    try {
        await sdk.url.create({
            target_url: 'https://example.com',
            domain: 's.ee',
            custom_slug: 'ab' // Too short
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            console.log('Caught Expected Validation Error:', error.message);
        }
    }

    console.log('\n3. Network/API Error (Invalid API Key / Server Error)');
    // Creating a new SDK instance mainly to simulate connection issues if we pointed to a bad host
    const badSdk = new SeeSDK({
        baseUrl: "https://non-existent-api.example.com",
        apiKey: "key"
    });

    try {
        await badSdk.url.listDomains();
    } catch (error) {
        if (error instanceof NetworkError) {
            console.log('Caught Expected Network Error:', error.message);
        } else {
            console.log('Caught:', error); // Might be other network errors depending on environment
        }
    }
}

if (require.main === module) {
    main();
}
