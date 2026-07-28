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

import axios from "axios";
import type { AxiosInstance } from "axios";
import type {
    ApiError,
    DomainListResponse,
    SdkConfig,
    TagsResponse,
    UrlActionResponse,
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
import { Qrcode } from "./resources/Qrcode";
import { Bio } from "./resources/Bio";
import { Account } from "./resources/Account";

export class SeeSDK {
    private client: AxiosInstance;
    private config: SdkConfig;

    public url: Url;
    public text: Text;
    public file: Files;
    public qrcode: Qrcode;
    public bio: Bio;
    public account: Account;

    constructor(config: SdkConfig) {
        if (config.baseUrl === undefined || config.baseUrl === "") {
            const environmentBaseUrl = process.env.SEE_API_BASE;
            config.baseUrl = environmentBaseUrl === undefined || environmentBaseUrl === ""
                ? "https://s.ee/api/v1"
                : environmentBaseUrl;
        }

        this.config = config;
        this.client = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout ?? 10000,
            headers: {
                Authorization: `${config.apiKey}`,
                "Content-Type": "application/json",
                "User-Agent": UserAgent,
            },
        });

        if (process.env.HTTP_PROXY !== undefined && process.env.HTTP_PROXY !== "") {
            try {
                const proxyUrl = new URL(process.env.HTTP_PROXY);
                this.client.defaults.proxy = {
                    protocol: proxyUrl.protocol.replace(":", ""), // Remove the colon
                    host: proxyUrl.hostname,
                    port: parseInt(proxyUrl.port, 10),
                };
            } catch {
                console.warn("Invalid proxy URL format:", process.env.HTTP_PROXY);
            }
        }

        this.setupInterceptors();

        this.url = new Url(this.client);
        this.text = new Text(this.client);
        this.file = new Files(this.client);
        this.qrcode = new Qrcode(this.client);
        this.bio = new Bio(this.client);
        this.account = new Account(this.client);
    }

    private setupInterceptors(): void {
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    const apiError: ApiError = {
                        code: error.response.data?.code ?? "UNKNOWN_ERROR",
                        message: error.response.data?.message ?? "An unknown error occurred",
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
    async delete(request: UrlShortenDeleteRequest): Promise<UrlActionResponse> {
        return this.url.delete(request);
    }

    /**
     * Update a shortened URL
     * @param request - The update request
     * @returns Promise<any>
     * @deprecated Use `sdk.url.update` instead
     */
    async update(request: UrlShortenUpdateRequest): Promise<UrlActionResponse> {
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
