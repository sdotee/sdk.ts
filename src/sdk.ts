/*!*
 * Copyright (c) 2025 S.EE Development Team
 *
 * This source code is licensed under the MIT License,
 * which is located in the LICENSE file in the source tree's root directory.
 *
 * File: sdk.ts
 * Author: S.EE Development Team <dev@s.ee>
 * File Created: 2025-11-29 22:19:57
 *
 * Modified By: S.EE Development Team <dev@s.ee>
 * Last Modified: 2025-12-04 17:10:00
 */

import axios, { AxiosInstance, AxiosResponse, HttpStatusCode } from "axios";
import {
    ApiError,
    DomainListResponse,
    SdkConfig,
    TagsResponse,
    UrlShortenDeleteRequest,
    UrlShortenRequest,
    UrlShortenResponse,
    UrlShortenUpdateRequest,
} from "./types";
import { NetworkError, SeeServiceError } from "./errors";
import { Validator } from "./validator";
import * as process from "node:process";
import { UserAgent } from "./version";

export class SeeSDK {
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

        if (process.env.HTTP_PROXY !== undefined && process.env.HTTP_PROXY != "") {
            // this.client.defaults.httpsAgent = new https.Agent({
            //     rejectUnauthorized: false
            // });

            // Parse proxy URL (e.g., http://127.0.0.1:1080)
            try {
                const proxyUrl = new URL(process.env.HTTP_PROXY);
                this.client.defaults.proxy = {
                    protocol: proxyUrl.protocol.replace(":", ""), // Remove the colon
                    host: proxyUrl.hostname,
                    port: parseInt(proxyUrl.port, 10),
                };
                console.log("Proxy configured:", this.client.defaults.proxy);
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
                    throw new SeeServiceError(apiError);
                } else if (error.request) {
                    throw new NetworkError(error.message);
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
                throw new SeeServiceError({
                    message: `Failed to create short URL, status code is not Ok`,
                    code: "API_ERROR",
                });
            }

            return {
                ...response.data,
            };
        } catch (error) {
            if (error instanceof SeeServiceError || error instanceof NetworkError) {
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
            if (error instanceof SeeServiceError || error instanceof NetworkError) {
                throw error;
            }
            throw new NetworkError("Failed to update short URL");
        }
    }

    async update(request: UrlShortenUpdateRequest): Promise<UrlShortenResponse> {
        try {
            const response: AxiosResponse<UrlShortenResponse> = await this.client.put("/api/v1/shorten", request);
            return response.data;
        } catch (error) {
            if (error instanceof SeeServiceError || error instanceof NetworkError) {
                throw error;
            }

            throw new NetworkError("Failed to update short URL");
        }
    }

    async listDomains(): Promise<DomainListResponse> {
        try {
            const response: AxiosResponse<DomainListResponse> = await this.client.get("/api/v1/domains");
            if (response.data && response.status === HttpStatusCode.Ok) {
                return response.data;
            } else {
                throw new SeeServiceError({
                    code: "API_ERROR",
                    message: `Failed to fetch domains`,
                });
            }
        } catch (error) {
            if (error instanceof SeeServiceError || error instanceof NetworkError) {
                throw error;
            }
            throw new NetworkError("Failed to fetch domains");
        }
    }

    /**
     * List Available Tags
     */
    async listTags(): Promise<TagsResponse> {

        try {
            const response: AxiosResponse<TagsResponse> = await this.client.get("/api/v1/tags");
            if (response.data && response.status === HttpStatusCode.Ok) {
                return response.data;
            } else {
                throw new SeeServiceError({
                    code: "API_ERROR",
                    message: `Failed to fetch tags`,
                });
            }
        } catch (error) {
            if (error instanceof SeeServiceError || error instanceof NetworkError) {
                throw error;
            }
            throw new NetworkError("Failed to fetch tags");
        }
    }

    /**
     * Update the SDK configuration
     * @param newConfig - The new configuration
     */
    public updateConfig(newConfig: Partial<SdkConfig>): void {
        this.config = { ...this.config, ...newConfig };

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
