import axios from "axios";
import { SeeSDK } from "../sdk";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const client = {
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    head: jest.fn(),
    interceptors: { response: { use: jest.fn() } },
    defaults: { headers: {} as Record<string, string> },
};

mockedAxios.create = jest.fn(() => client as never);

describe("Swagger synchronized resources", () => {
    let sdk: SeeSDK;

    beforeEach(() => {
        jest.clearAllMocks();
        sdk = new SeeSDK({ baseUrl: "https://s.ee/api/v1", apiKey: "test-key" });
    });

    it("requests URL history and visit statistics with query parameters", async () => {
        client.get.mockResolvedValue({ data: { code: 200, data: [], message: "ok" } });

        await sdk.url.history({ page: 2 });
        await sdk.url.visitStats({ domain: "s.ee", slug: "demo", period: "monthly" });

        expect(client.get).toHaveBeenNthCalledWith(1, "/links", { params: { page: 2 } });
        expect(client.get).toHaveBeenNthCalledWith(2, "/link/visit-stat", {
            params: { domain: "s.ee", slug: "demo", period: "monthly" },
        });
    });

    it("serializes simple-mode tag IDs using Swagger CSV format", async () => {
        client.get.mockResolvedValue({ data: "https://s.ee/demo" });

        await sdk.url.createSimple({
            signature: "test-key",
            url: "https://example.com",
            tag_ids: [1, 2, 3],
        });

        expect(client.get).toHaveBeenCalledWith("/shorten", {
            params: {
                signature: "test-key",
                url: "https://example.com",
                tag_ids: "1,2,3",
            },
        });
    });

    it("uses the Swagger request bodies for QR codes, bio pages, and token checks", async () => {
        client.post.mockResolvedValue({ data: { code: 200, data: {}, message: "ok" } });
        client.delete.mockResolvedValue({ data: { code: 200, data: null, message: "ok" } });

        await sdk.qrcode.create({ target_url: "https://example.com", title: "Example" });
        await sdk.bio.delete(42);
        await sdk.account.checkToken("token-value");

        expect(client.post).toHaveBeenNthCalledWith(1, "/qrcode", {
            target_url: "https://example.com",
            title: "Example",
        });
        expect(client.delete).toHaveBeenCalledWith("/bio", { data: { id: 42 } });
        expect(client.post).toHaveBeenNthCalledWith(2, "/token/check", { token: "token-value" });
    });

    it("requests a private file URL using file_id", async () => {
        client.get.mockResolvedValue({ data: { code: 200, data: {}, message: "ok" } });

        await sdk.file.getPrivateDownloadUrl(123);

        expect(client.get).toHaveBeenCalledWith("/file/private/download-url", {
            params: { file_id: 123 },
        });
    });

    it("uploads a TUS chunk with protocol headers and returns the new offset", async () => {
        client.patch.mockResolvedValue({
            headers: { "upload-offset": "1024", "upload-length": "4096" },
        });

        const result = await sdk.file.uploadChunk("upload-1", Buffer.from("data"), 512);

        expect(client.patch).toHaveBeenCalledWith(
            "/file/large-file-tus/upload-1",
            expect.any(Buffer),
            {
                headers: {
                    "Content-Type": "application/offset+octet-stream",
                    "Tus-Resumable": "1.0.0",
                    "Upload-Offset": 512,
                },
            },
        );
        expect(result).toEqual({ upload_offset: 1024, upload_length: 4096 });
    });

    it("completes and cancels a large upload using its upload ID", async () => {
        client.post.mockResolvedValue({ data: { code: 200, data: {}, message: "ok" } });
        client.delete.mockResolvedValue({ data: { code: 200, data: null, message: "ok" } });

        await sdk.file.completeLargeUpload("upload-1");
        await sdk.file.cancelLargeUpload("upload-1");

        expect(client.post).toHaveBeenCalledWith("/file/large-file/complete", { upload_id: "upload-1" });
        expect(client.delete).toHaveBeenCalledWith("/file/large-file/cancel", {
            data: { upload_id: "upload-1" },
        });
    });

    it("maps file history and large-upload lifecycle endpoints", async () => {
        client.get.mockResolvedValue({ data: { code: 200, data: {}, message: "ok" } });
        client.post.mockResolvedValue({ data: { code: 200, data: {}, message: "ok" } });
        client.head.mockResolvedValue({ headers: { "upload-offset": "128" } });
        client.delete.mockResolvedValue({ status: 204 });

        await sdk.file.history({ page: 3 });
        await sdk.file.createLargeUpload({ file_name: "video.mp4", file_size: 1024 });
        await sdk.file.getLargeUploadProgress("upload-1");
        const status = await sdk.file.getUploadStatus("upload-1");
        await sdk.file.deleteLargeUpload("upload-1");

        expect(client.get).toHaveBeenNthCalledWith(1, "/files", { params: { page: 3 } });
        expect(client.post).toHaveBeenCalledWith("/file/large-file/create", {
            file_name: "video.mp4",
            file_size: 1024,
        });
        expect(client.get).toHaveBeenNthCalledWith(2, "/file/large-file/progress", {
            params: { upload_id: "upload-1" },
        });
        expect(client.head).toHaveBeenCalledWith("/file/large-file-tus/upload-1", {
            headers: { "Tus-Resumable": "1.0.0" },
        });
        expect(client.delete).toHaveBeenCalledWith("/file/large-file-tus/upload-1", {
            headers: { "Tus-Resumable": "1.0.0" },
        });
        expect(status).toEqual({ upload_offset: 128 });
    });
});
