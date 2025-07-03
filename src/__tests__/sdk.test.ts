import {UrlShortenSDK} from '../sdk';
import {UrlShortenerError, NetworkError, ValidationError} from '../errors';
import {UserAgent} from '../version';

import axios from 'axios';
import * as process from "node:process";


// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockAxiosInstance = {
    post: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    interceptors: {
        response: {
            use: jest.fn()
        }
    },
    defaults: {
        baseURL: '',
        timeout: 0,
        headers: {} as any
    }
};

mockedAxios.create = jest.fn(() => mockAxiosInstance as any);

describe('UrlShortenerSDK', () => {
    let sdk: UrlShortenSDK;
    const config = {
        baseUrl: process.env.URL_SHORTENER_API_BASE || 'https://s.ee',
        apiKey: process.env.URL_SHORTENER_API_KEY || '',
        timeout: 5000
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Create a fresh mock instance for each test
        const freshMockAxiosInstance = {
            post: jest.fn(),
            delete: jest.fn(),
            get: jest.fn(),
            interceptors: {
                response: {
                    use: jest.fn()
                }
            },
            defaults: {
                baseURL: config.baseUrl, // Initialize with config baseURL
                timeout: config.timeout,
                headers: {
                    'Authorization': `${config.apiKey}`,
                    'Content-Type': 'application/json',
                    'User-Agent': UserAgent
                } as any
            }
        };
        mockedAxios.create.mockReturnValue(freshMockAxiosInstance as any);
        Object.assign(mockAxiosInstance, freshMockAxiosInstance);

        sdk = new UrlShortenSDK(config);
    });

    describe('constructor', () => {
        it('should create SDK instance with correct configuration', () => {
            expect(mockedAxios.create).toHaveBeenCalledWith({
                baseURL: config.baseUrl,
                timeout: config.timeout,
                headers: {
                    'Authorization': `${config.apiKey}`,
                    'Content-Type': 'application/json',
                    'User-Agent': UserAgent
                }
            });
        });

        it('should use default timeout when not provided', () => {
            const configWithoutTimeout = {
                baseUrl: 'https://api.shortener.com',
                apiKey: 'test-api-key'
            };

            new UrlShortenSDK(configWithoutTimeout);

            expect(mockedAxios.create).toHaveBeenCalledWith({
                baseURL: configWithoutTimeout.baseUrl,
                timeout: 10000,
                headers: {
                    'Authorization': `${configWithoutTimeout.apiKey}`,
                    'Content-Type': 'application/json',
                    'User-Agent': UserAgent,
                }
            });
        });
    });

    describe('createShortUrl', () => {
        it('should create short URL successfully', async () => {
            const request = {
                target_url: 'https://example.com/very/long/url',
                domain: '2.sb'
            };

            const mockResponse = {
                code: '200',
                message: "success",
                data: {
                    "short_url": "https://2.sb/test123",
                    "slug": "test123",
                    "custom_slug": "hello-world",
                }
            };

            mockAxiosInstance.post.mockResolvedValue(mockResponse);
            const result = await sdk.create(request);

            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/shorten', request);
            // expect(result).toEqual(mockResponse);
        });

        it('should throw validation error for invalid URL', async () => {
            const request = {target_url: 'invalid-url', domain: "2.sb"};

            await expect(sdk.create(request)).rejects.toThrow(ValidationError);
            expect(mockAxiosInstance.post).not.toHaveBeenCalled();
        });

        it('should throw validation error for invalid custom code', async () => {
            const request = {
                target_url: 'https://example.com',
                domain: 'ab' // Too short
            };

            await expect(sdk.create(request)).rejects.toThrow(ValidationError);
            expect(mockAxiosInstance.post).not.toHaveBeenCalled();
        });
    });

    describe('deleteShortUrl', () => {
        it('should delete short URL successfully', async () => {
            const id = 'url123';
            const mockResponse = {
                data: {
                    success: true,
                    message: 'URL deleted successfully'
                }
            };

            mockAxiosInstance.delete.mockResolvedValue(mockResponse);

            const result = await sdk.delete({
                slug: id,
                domain: 's.ee'
            });

            // expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/api/v1/shorten`);
            expect(result).toEqual(mockResponse.data);
        });

        it('should throw validation error for invalid ID', async () => {
            await expect(sdk.delete({slug: "", domain: "s.ee"})).rejects.toThrow(ValidationError);
            expect(mockAxiosInstance.delete).not.toHaveBeenCalled();
        });
    });

    describe('listDomains', () => {
        it("listDomains should return a list of domains", async () => {
            const result = await sdk.listDomains();

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/domains');
            expect(result).toBeDefined();
        });
    });

    // describe('updateDomains', () => {
    //     it("updateDomains should update a domain", async () => {
    //         const result = await sdk.update({
    //             slug: '',
    //             target_url: 'https://example.com/updated-url',
    //             title: `Updated Title ${Date.now()}`,
    //             domain: 's.ee'
    //         });
    //
    //         expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/domains');
    //         expect(result).toBeDefined();
    //     });
    // });

    //
    // describe('getShortUrl', () => {
    //     it('should get short URL successfully', async () => {
    //         const id = 'url123';
    //         const mockResponse = {
    //             data: {
    //                 id: 'url123',
    //                 shortUrl: 'https://short.ly/abc123',
    //                 originalUrl: 'https://example.com',
    //                 code: 'abc123',
    //                 createdAt: '2023-10-01T12:00:00.000Z'
    //             }
    //         };
    //
    //         mockAxiosInstance.get.mockResolvedValue(mockResponse);
    //
    //         const result = await sdk.getShortUrl(id);
    //
    //         expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/urls/${id}`);
    //         expect(result).toEqual({
    //             id: 'url123',
    //             shortUrl: 'https://short.ly/abc123',
    //             originalUrl: 'https://example.com',
    //             code: 'abc123',
    //             createdAt: new Date('2023-10-01T12:00:00.000Z')
    //         });
    //     });
    //
    //     it('should throw validation error for invalid ID', async () => {
    //         await expect(sdk.getShortUrl('')).rejects.toThrow(ValidationError);
    //         expect(mockAxiosInstance.get).not.toHaveBeenCalled();
    //     });
    // });
    //
    // describe('updateConfig', () => {
    //     it('should update configuration', () => {
    //         const newConfig = {
    //             baseUrl: 'https://new-api.shortener.com',
    //             apiKey: 'new-api-key',
    //             timeout: 15000
    //         };
    //
    //         sdk.updateConfig(newConfig);
    //
    //         expect(mockAxiosInstance.defaults.baseURL).toBe(newConfig.baseUrl);
    //         expect(mockAxiosInstance.defaults.headers['Authorization']).toBe(`Bearer ${newConfig.apiKey}`);
    //         expect(mockAxiosInstance.defaults.timeout).toBe(newConfig.timeout);
    //     });
    //
    //     it('should update partial configuration', () => {
    //         const newConfig = {
    //             apiKey: 'updated-api-key'
    //         };
    //
    //         sdk.updateConfig(newConfig);
    //
    //         expect(mockAxiosInstance.defaults.headers['Authorization']).toBe(`Bearer ${newConfig.apiKey}`);
    //         expect(mockAxiosInstance.defaults.baseURL).toBe(config.baseUrl); // Should remain unchanged
    //     });
    // });
});
