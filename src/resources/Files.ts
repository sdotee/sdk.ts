/*!*
 * Copyright (c) 2026 S.EE Development Team
 *
 * This source code is licensed under the MIT License,
 * which is located in the LICENSE file in the source tree's root directory.
 *
 * File: Files.ts
 * Author: S.EE Development Team <dev@s.ee>
 */

import { BaseResource } from './Base';
import type { AxiosRequestConfig } from 'axios';
import type {
  FileUploadResponse,
  FileDeleteResponse,
  FileDomainListResponse,
  HistoryParams,
  FileHistoryResponse,
  PrivateFileUrlResponse,
  CreateLargeFileUploadRequest,
  CreateLargeFileUploadResponse,
  LargeFileUploadProgressResponse,
  CompleteLargeFileUploadResponse,
  ApiResponse,
  TusUploadStatus,
} from '../types';

export class Files extends BaseResource {
  /**
   * Upload a file
   * @param file - The file to upload (FormData, Stream, or Buffer depending on environment)
   * @param options - Additional axios config (e.g. headers for multipart/form-data)
   * @returns Promise<FileUploadResponse>
   */
  async upload(file: unknown, options?: AxiosRequestConfig): Promise<FileUploadResponse> {
    const response = await this.client.post<FileUploadResponse>('/file/upload', file, options);
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
    const response = await this.client.get<FileDomainListResponse>('/file/domains');
    return response.data;
  }

  async history(params: HistoryParams = {}): Promise<FileHistoryResponse> {
    const response = await this.client.get<FileHistoryResponse>('/files', { params });
    return response.data;
  }

  async getPrivateDownloadUrl(fileId: number): Promise<PrivateFileUrlResponse> {
    const response = await this.client.get<PrivateFileUrlResponse>('/file/private/download-url', {
      params: { file_id: fileId },
    });
    return response.data;
  }

  async createLargeUpload(
    request: CreateLargeFileUploadRequest,
  ): Promise<CreateLargeFileUploadResponse> {
    const response = await this.client.post<CreateLargeFileUploadResponse>(
      '/file/large-file/create',
      request,
    );
    return response.data;
  }

  async uploadChunk(
    uploadId: string,
    chunk: unknown,
    uploadOffset: number,
    config: AxiosRequestConfig = {},
  ): Promise<TusUploadStatus> {
    const response = await this.client.patch(`/file/large-file-tus/${uploadId}`, chunk, {
      ...config,
      headers: {
        'Content-Type': 'application/offset+octet-stream',
        'Tus-Resumable': '1.0.0',
        'Upload-Offset': uploadOffset,
        ...config.headers,
      },
    });
    return this.readTusStatus(response.headers);
  }

  async getLargeUploadStatus(uploadId: string): Promise<TusUploadStatus> {
    const response = await this.client.head(`/file/large-file-tus/${uploadId}`, {
      headers: { 'Tus-Resumable': '1.0.0' },
    });
    return this.readTusStatus(response.headers);
  }

  async deleteLargeUpload(uploadId: string): Promise<void> {
    await this.client.delete(`/file/large-file-tus/${uploadId}`, {
      headers: { 'Tus-Resumable': '1.0.0' },
    });
  }

  async getLargeUploadProgress(uploadId: string): Promise<LargeFileUploadProgressResponse> {
    const response = await this.client.get<LargeFileUploadProgressResponse>(
      '/file/large-file/progress',
      {
        params: { upload_id: uploadId },
      },
    );
    return response.data;
  }

  async completeLargeUpload(uploadId: string): Promise<CompleteLargeFileUploadResponse> {
    const response = await this.client.post<CompleteLargeFileUploadResponse>(
      '/file/large-file/complete',
      {
        upload_id: uploadId,
      },
    );
    return response.data;
  }

  async cancelLargeUpload(uploadId: string): Promise<ApiResponse> {
    const response = await this.client.delete<ApiResponse>('/file/large-file/cancel', {
      data: { upload_id: uploadId },
    });
    return response.data;
  }

  private readTusStatus(headers: Record<string, unknown>): TusUploadStatus {
    const uploadLength = headers['upload-length'];
    return {
      upload_offset: Number(headers['upload-offset'] ?? 0),
      ...(uploadLength === undefined ? {} : { upload_length: Number(uploadLength) }),
    };
  }
}
