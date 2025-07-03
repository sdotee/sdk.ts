import axios, {AxiosInstance, AxiosResponse, HttpStatusCode} from "axios";
import {
    SdkConfig,
    UrlShortenRequest,
    UrlShortenResponse,
    ApiError,
    UrlShortenDeleteRequest,
    DomainListResponse,
    UrlShortenUpdateRequest,
} from "./types";
import {UrlShortenerError, NetworkError} from "./errors";
import {Validator} from "./validator";
import * as process from "node:process";
import {UserAgent} from "./version";

export class UrlShortenSDK {
    private client: AxiosInstance;
    private config: SdkConfig;

    constructor(config: SdkConfig) {
        if (config.baseUrl === undefined || config.baseUrl === "") {
            config.baseUrl = process.env.API_BASE_URL || "https://s.ee";
        }

        this.config = config;
        this.client = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout || 10000,
            headers: {
                Authorization: `${config.apiKey}`,
                "Content-Type": "application/json",
                "User-Agent": UserAgent,
            },
        });

        if (process.env.HTTP_PROXY != "" && process.env.HTTP_PROXY !== undefined) {
            // Parse proxy URL (e.g., http://127.0.0.1:1080)
            try {
                const proxyUrl = new URL(process.env.HTTP_PROXY);
                this.client.defaults.proxy = {
                    host: proxyUrl.hostname,
                    port: parseInt(proxyUrl.port, 10),
                };
                // console.log("Proxy configured:", this.client.defaults.proxy);
            } catch (error) {
                console.warn("Invalid proxy URL format:", process.env.HTTP_PROXY);
            }
        }

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.client.interceptors.response.use(
            (response: any) => response,
            (error: any) => {
                if (error.response) {
                    const apiError: ApiError = {
                        code: error.response.data?.code || "UNKNOWN_ERROR",
                        message: error.response.data?.message || "An unknown error occurred",
                    };
                    throw new UrlShortenerError(apiError);
                } else if (error.request) {
                    throw new NetworkError("Network error: Unable to reach the server", error.response?.status);
                } else {
                    throw new NetworkError("Request configuration error");
                }
            }
        );
    }

    /**
     * Create a shortened URL
     * @param request - The URL shortening request
     * @returns Promise<UrlShortenResponse> - The shortened URL response
     */
    async create(request: UrlShortenRequest): Promise<UrlShortenResponse> {
        // Validate input
        Validator.validateUrl(request.target_url);

        try {
            const response: AxiosResponse<UrlShortenResponse> = await this.client.post("/api/v1/shorten", request);

            if (!response) {
                throw new UrlShortenerError({
                    message: `Failed to create short URL, status code is not Ok`,
                    code: "API_ERROR",
                });
            }

            return {
                ...response.data,
            };
        } catch (error) {
            if (error instanceof UrlShortenerError || error instanceof NetworkError) {
                throw error;
            }
            console.info(error);
            throw new NetworkError("Failed to create short URL");
        }
    }

    /**
     * Delete a shortened URL
     * @returns Promise<DeleteUrlResponse> - The deletion response
     * @param request
     */
    async delete(request: UrlShortenDeleteRequest): Promise<UrlShortenResponse> {
        try {
            const response: AxiosResponse<UrlShortenResponse> = await this.client.delete(`/api/v1/shorten`, {
                data: request,
            });
            return response.data;
        } catch (error) {
            if (error instanceof UrlShortenerError || error instanceof NetworkError) {
                throw error;
            }
            throw new NetworkError("Failed to delete short URL");
        }
    }

    async update(request: UrlShortenUpdateRequest): Promise<UrlShortenResponse> {
        try {
            const response: AxiosResponse<UrlShortenResponse> = await this.client.put("/api/v1/shorten", request);
            return response.data;
        } catch (error) {
            if (error instanceof UrlShortenerError || error instanceof NetworkError) {
                throw error;
            }

            throw new NetworkError("Failed to update short URL");
        }
    }

    async listDomains(): Promise<DomainListResponse> {
        try {
            const response: AxiosResponse<DomainListResponse> = await this.client.get("/api/v1/domains");
            if (response.status === HttpStatusCode.Ok) {
                return response.data;
            } else {
                throw new UrlShortenerError({
                    code: "API_ERROR",
                    message: `Failed to fetch domains`,
                });
            }
        } catch (error) {
            if (error instanceof UrlShortenerError || error instanceof NetworkError) {
                throw error;
            }
            throw new NetworkError("Failed to fetch domains");
        }
    }

    /**
     * Update the SDK configuration
     * @param newConfig - The new configuration
     */
    public updateConfig(newConfig: Partial<SdkConfig>): void {
        this.config = {...this.config, ...newConfig};

        if (newConfig.baseUrl) {
            this.client.defaults.baseURL = newConfig.baseUrl;
        }

        if (newConfig.apiKey) {
            this.client.defaults.headers["Authorization"] = `${newConfig.apiKey}`;
        }

        if (newConfig.timeout) {
            this.client.defaults.timeout = newConfig.timeout;
        }
    }
}
