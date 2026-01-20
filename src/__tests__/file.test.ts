import { SeeSDK } from "../sdk";
import axios from "axios";
import { UserAgent } from "../version";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockAxiosInstance = {
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
        response: {
            use: jest.fn(),
        },
    },
    defaults: {
        headers: {}
    }
};

mockedAxios.create = jest.fn(() => mockAxiosInstance as any);

describe("SeeSDK - Files", () => {
    let sdk: SeeSDK;
    const config = {
        baseUrl: "https://s.ee",
        apiKey: "test-key",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        sdk = new SeeSDK(config);
    });

    describe("upload", () => {
        it("should upload file successfully", async () => {
            const fileData = "fake-file-content";
            // In real usage this might be FormData or Buffer
            const expectedResponse = {
                code: 0,
                data: {
                    delete: "del-key",
                    file_id: 123,
                    filename: "test.png",
                    hash: "abc",
                    height: 100,
                    page: "p",
                    path: "/p",
                    size: 1024,
                    storename: "s",
                    upload_status: 1,
                    url: "https://s.ee/f/abc",
                    width: 100
                },
                message: "Success"
            };

            mockAxiosInstance.post.mockResolvedValue({ data: expectedResponse });

            // User would pass headers usually
            const options = { headers: { "Content-Type": "text/plain" } };

            const result = await sdk.file.upload(fileData, options);

            expect(mockAxiosInstance.post).toHaveBeenCalledWith("/file/upload", fileData, options);
            expect(result).toEqual(expectedResponse);
        });
    });

    describe("delete", () => {
        it("should delete file successfully", async () => {
            const fileHash = "abc";
            const expectedResponse = {
                code: "200",
                message: "Deleted",
                success: true
            };

            mockAxiosInstance.get.mockResolvedValue({ data: expectedResponse });

            const result = await sdk.file.delete(fileHash);

            expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/file/delete/${fileHash}`);
            expect(result).toEqual(expectedResponse); // Delete returns full response according to types
        });
    });

    describe("listDomains", () => {
        it("should return list of file domains", async () => {
            const expectedResponse = {
                code: 0,
                data: {
                    domains: ["s.ee"]
                },
                message: "Success"
            };

            mockAxiosInstance.get.mockResolvedValue({ data: expectedResponse });

            const result = await sdk.file.listDomains();

            expect(mockAxiosInstance.get).toHaveBeenCalledWith("/file/domains");
            expect(result).toEqual(expectedResponse);
        });
    });
});
