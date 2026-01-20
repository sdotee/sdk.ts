import { SeeSDK } from '../src/index';
import * as process from "node:process";
import * as fs from 'fs';
import * as path from 'path';
// import FormData from 'form-data'; // Required for Node.js environment

async function main() {
    console.log('📁 File Sharing Example');

    const sdk = new SeeSDK({
        baseUrl: process.env.SEE_API_BASE || "https://s.ee",
        apiKey: process.env.SEE_API_KEY || "",
        timeout: 10000
    });

    try {
        console.log('\n1. List file domains');
        const domains = await sdk.file.listDomains();
        console.log('Domains:', domains.data.domains);

        console.log('\n2. Upload a file');
        // Note: Real file upload requires 'form-data' package in Node.js and a real file.
        // This is a conceptual example.
        /*
        const filePath = path.join(__dirname, 'test-file.txt');
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, 'Hello See SDK File Upload!');
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        const uploadResult = await sdk.file.upload(form, {
            headers: form.getHeaders()
        });

        console.log('Uploaded:', uploadResult.data.url);
        console.log('Delete Key:', uploadResult.data.delete);

        // Cleanup local test file
        // fs.unlinkSync(filePath);
        */
        console.log('(Skipped actual upload due to missing dependencies/file in this environment)');

        console.log('\n3. Delete a file (using a placeholder ID)');
        // In a real scenario, use the ID or hash returned from upload
        // await sdk.file.delete('some-file-hash-or-id');
        console.log('(Skipped actual delete)');

    } catch (error: any) {
        console.error('Error:', error.message || error);
    }
}

if (require.main === module) {
    main();
}
