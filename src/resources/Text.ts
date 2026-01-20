/*!*
 * Copyright (c) 2025 S.EE Development Team
 *
 * This source code is licensed under the MIT License,
 * which is located in the LICENSE file in the source tree's root directory.
 *
 * File: Text.ts
 * Author: S.EE Development Team <dev@s.ee>
 */

import { BaseResource } from "./Base";
import {
    TextCreateRequest,
    TextCreateResponse,
    TextUpdateRequest,
    TextActionResponse,
    TextDeleteRequest,
    TextDomainListResponse,
} from "../types";

export class Text extends BaseResource {
    /**
     * Create a text share
     * @param request - The text creation request
     * @returns Promise<TextCreateResponse>
     */
    async create(request: TextCreateRequest): Promise<TextCreateResponse> {
        const response = await this.client.post<TextCreateResponse>("/text", request);
        return response.data;
    }

    /**
     * Update a text share
     * @param request - The update request
     * @returns Promise<TextActionResponse>
     */
    async update(request: TextUpdateRequest): Promise<TextActionResponse> {
        const response = await this.client.put<TextActionResponse>("/text", request);
        return response.data;
    }

    /**
     * Delete a text share
     * @param request - The delete request
     * @returns Promise<TextActionResponse>
     */
    async delete(request: TextDeleteRequest): Promise<TextActionResponse> {
        const response = await this.client.delete<TextActionResponse>("/text", { data: request });
        return response.data;
    }

    /**
     * Get text domains
     * @returns Promise<TextDomainListResponse>
     */
    async listDomains(): Promise<TextDomainListResponse> {
        const response = await this.client.get<TextDomainListResponse>("/text/domains");
        return response.data;
    }
}
