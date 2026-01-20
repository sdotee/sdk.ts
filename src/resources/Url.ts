/*!*
 * Copyright (c) 2026 S.EE Development Team
 *
 * This source code is licensed under the MIT License,
 * which is located in the LICENSE file in the source tree's root directory.
 *
 * File: Url.ts
 * Author: S.EE Development Team <dev@s.ee>
 */

import type { AxiosResponse} from "axios";
import { HttpStatusCode } from "axios";
import { BaseResource } from "./Base";
import type {
    UrlShortenRequest,
    UrlShortenResponse,
    UrlShortenDeleteRequest,
    UrlShortenUpdateRequest,
    DomainListResponse,
    TagsResponse,
} from "../types";
import { Validator } from "../validator";
import { SeeServiceError, NetworkError } from "../errors";

export class Url extends BaseResource {
    /**
     * Create a shortened URL
     * @param request - The URL shortening request
     * @returns Promise<UrlShortenResponse>
     */
    async create(request: UrlShortenRequest): Promise<UrlShortenResponse> {
        // Validate input
        Validator.validateUrl(request.target_url);

        try {
            const response: AxiosResponse<UrlShortenResponse> = await this.client.post("/shorten", request);

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
     * @param request - The delete request
     * @returns Promise<UrlShortenResponse>
     */
    async delete(request: UrlShortenDeleteRequest): Promise<UrlShortenResponse> {
        try {
            const response: AxiosResponse<UrlShortenResponse> = await this.client.delete(`/shorten`, {
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

    /**
     * Update a shortened URL
     * @param request - The update request
     * @returns Promise<UrlShortenResponse>
     */
    async update(request: UrlShortenUpdateRequest): Promise<UrlShortenResponse> {
        try {
            const response: AxiosResponse<UrlShortenResponse> = await this.client.put("/shorten", request);
            return response.data;
        } catch (error) {
            if (error instanceof SeeServiceError || error instanceof NetworkError) {
                throw error;
            }

            throw new NetworkError("Failed to update short URL");
        }
    }

    /**
     * List available domains
     * @returns Promise<DomainListResponse>
     */
    async listDomains(): Promise<DomainListResponse> {
        try {
            const response: AxiosResponse<DomainListResponse> = await this.client.get("/domains");
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
            const response: AxiosResponse<TagsResponse> = await this.client.get("/tags");
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
}
