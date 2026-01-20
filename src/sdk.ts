/*!*
 * Copyright (c) 2026 S.EE Development Team
 *
 * This source code is licensed under the MIT License,
 * which is located in the LICENSE file in the source tree's root directory.
 *
 * File: sdk.ts
 * Author: S.EE Development Team <dev@s.ee>
 * File Created: 2025-11-29 22:19:57
 *
 * Modified By: S.EE Development Team <dev@s.ee>
 * Last Modified: 2026-01-20 16:42:25
 */

import axios, { AxiosInstance } from "axios";
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
import * as process from "node:process";
import { UserAgent } from "./version";
import { Url } from "./resources/Url";
import { Text } from "./resources/Text";
import { Files } from "./resources/Files";

export class SeeSDK {
    private client: AxiosInstance;
    private config: SdkConfig;

    public url: Url;
    public text: Text;
    public file: Files;

    constructor(config: SdkConfig) {
        if (config.baseUrl === undefined || config.baseUrl === "") {
            config.baseUrl = process.env.SEE_API_BASE || "https://s.ee/api/v1";
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

        this.url = new Url(this.client);
        this.text = new Text(this.client);
        this.file = new Files(this.client);
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
     * @deprecated Use `sdk.url.create` instead
     */
    async create(request: UrlShortenRequest): Promise<UrlShortenResponse> {
        return this.url.create(request);
    }

    /**
     * Delete a shortened URL
     * @param request - The delete request
     * @returns Promise<any>
     * @deprecated Use `sdk.url.delete` instead
     */
    async delete(request: UrlShortenDeleteRequest): Promise<UrlShortenResponse> {
        return this.url.delete(request);
    }

    /**
     * Update a shortened URL
     * @param request - The update request
     * @returns Promise<any>
     * @deprecated Use `sdk.url.update` instead
     */
    async update(request: UrlShortenUpdateRequest): Promise<UrlShortenResponse> {
        return this.url.update(request);
    }

    /**
     * List available domains
     * @returns Promise<DomainListResponse>
     * @deprecated Use `sdk.url.listDomains` instead
     */
    async listDomains(): Promise<DomainListResponse> {
        return this.url.listDomains();
    }

    /**
     * List Available Tags
     * @deprecated Use `sdk.url.listTags` instead
     */
    async listTags(): Promise<TagsResponse> {
        return this.url.listTags();
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
