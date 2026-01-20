import { SeeSDK } from "../sdk";
import axios from "axios";
import { UserAgent } from "../version";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockAxiosInstance = {
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
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

describe("SeeSDK - Text", () => {
    let sdk: SeeSDK;
    const config = {
        baseUrl: "https://s.ee",
        apiKey: "test-key",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        sdk = new SeeSDK(config);
    });

    describe("create", () => {
        it("should create text share successfully", async () => {
            const request = {
                content: "Hello World",
                title: "Test Note"
            };
            const expectedResponse = {
                code: 0,
                data: {
                    custom_slug: "",
                    short_url: "https://s.ee/abc",
                    slug: "abc"
                },
                message: "Success"
            };

            mockAxiosInstance.post.mockResolvedValue({ data: expectedResponse });

            const result = await sdk.text.create(request);

            expect(mockAxiosInstance.post).toHaveBeenCalledWith("/text", request);
            expect(result).toEqual(expectedResponse);
        });
    });

    describe("update", () => {
        it("should update text share successfully", async () => {
            const request = {
                content: "Updated Content",
                domain: "s.ee",
                slug: "abc",
                title: "Updated Title"
            };
            const expectedResponse = {
                code: 0,
                data: {
                    code: 0,
                    data: {
                        tags: []
                    },
                    message: "Updated"
                },
                message: "Success"
            };

            mockAxiosInstance.put.mockResolvedValue({ data: expectedResponse });

            const result = await sdk.text.update(request);

            expect(mockAxiosInstance.put).toHaveBeenCalledWith("/text", request);
            expect(result).toEqual(expectedResponse);
        });
    });

    describe("delete", () => {
        it("should delete text share successfully", async () => {
            const request = {
                domain: "s.ee",
                slug: "abc"
            };
            const expectedResponse = {
                code: 0,
                data: {
                    code: 0,
                    data: {
                        tags: []
                    },
                    message: "Deleted"
                },
                message: "Success"
            };

            mockAxiosInstance.delete.mockResolvedValue({ data: expectedResponse });

            const result = await sdk.text.delete(request);

            expect(mockAxiosInstance.delete).toHaveBeenCalledWith("/text", { data: request });
            expect(result).toEqual(expectedResponse);
        });
    });

    describe("listDomains", () => {
        it("should return list of domains", async () => {
            const expectedResponse = {
                code: 0,
                data: {
                    domains: ["s.ee"]
                },
                message: "Success"
            };

            mockAxiosInstance.get.mockResolvedValue({ data: expectedResponse });

            const result = await sdk.text.listDomains();

            expect(mockAxiosInstance.get).toHaveBeenCalledWith("/text/domains");
            expect(result).toEqual(expectedResponse);
        });
    });
});
