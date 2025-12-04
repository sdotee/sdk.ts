/*!*
 * Copyright (c) 2025 S.EE Development Team
 *
 * This source code is licensed under the MIT License,
 * which is located in the LICENSE file in the source tree's root directory.
 *
 * File: types.ts
 * Author: S.EE Development Team <dev@s.ee>
 * File Created: 2025-11-29 22:19:57
 *
 * Modified By: S.EE Development Team <dev@s.ee>
 * Last Modified: 2025-12-04 17:09:55
 */

export interface UrlShortenRequest {
    domain: string;
    target_url: string;
    custom_slug?: string;
    title?: string;
    expiration_redirect_url?: string;
    expire_at?: string;
    password?: string;
    tag_ids?: number[];
}

export interface UrlShortenDeleteRequest {
    domain: string,
    slug: string,
}

export interface UrlShortenUpdateRequest {
    domain: string,
    slug: string;
    target_url: string;
    title: string;
}

export interface UrlShortenResponse {
    code: number;
    message: string;

    data: {
        custom_slug?: string;
        short_url: string;
        slug: string;
    };
}

export interface Tag {
    id: number;
    name: string;
}

export interface TagsResponse {
    code: number;
    message: string;
    data: {
        tags: Tag[]
    };
}

export interface DomainListResponse {
    code: number;
    message: string;
    data: {
        domains: string[];
    }
}

// export interface DeleteUrlResponse {
//     success: boolean;
//     message: string;
// }

export interface SdkConfig {
    baseUrl: string;
    apiKey: string;
    timeout?: number;
}

export interface ApiError {
    code: string;
    message: string;
    data?: string;
}
