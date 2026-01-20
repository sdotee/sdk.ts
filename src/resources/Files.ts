/*!*
 * Copyright (c) 2026 S.EE Development Team
 *
 * This source code is licensed under the MIT License,
 * which is located in the LICENSE file in the source tree's root directory.
 *
 * File: Files.ts
 * Author: S.EE Development Team <dev@s.ee>
 */

import { BaseResource } from "./Base";
import type {
    FileUploadResponse,
    FileDeleteResponse,
    FileDomainListResponse
} from "../types";

export class Files extends BaseResource {
    /**
     * Upload a file
     * @param file - The file to upload (FormData, Stream, or Buffer depending on environment)
     * @param options - Additional axios config (e.g. headers for multipart/form-data)
     * @returns Promise<FileUploadResponse>
     */
    async upload(file: any, options?: any): Promise<FileUploadResponse> {
        const response = await this.client.post<FileUploadResponse>("/file/upload", file, options);
        return response.data;
    }

    /**
     * Delete a file
     * @param hash - The file ID or hash to delete
     * @returns Promise<FileDeleteResponse>
     */
    async delete(hash: string): Promise<FileDeleteResponse> {
        const response = await this.client.get<FileDeleteResponse>(`/file/delete/${hash}`);
        return response.data;
    }

    /**
     * Get file domains
     * @returns Promise<FileDomainListResponse>
     */
    async listDomains(): Promise<FileDomainListResponse> {
        const response = await this.client.get<FileDomainListResponse>("/file/domains");
        return response.data;
    }
}
