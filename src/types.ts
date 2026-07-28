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
  expire_at?: number;
  password?: string;
  tag_ids?: number[];
}

export interface UrlShortenDeleteRequest {
  domain: string;
  slug: string;
}

export interface UrlShortenUpdateRequest {
  domain: string;
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

export interface UrlShortenSimpleRequest {
  signature: string;
  url: string;
  domain?: string;
  custom_slug?: string;
  title?: string;
  tag_ids?: number[];
  password?: string;
  expire_at?: number;
  json?: boolean;
}

export interface Tag {
  id: number;
  name: string;
}

export interface TagsResponse {
  code: number;
  message: string;
  data: {
    tags: Tag[];
  };
}

export interface DomainListResponse {
  code: number;
  message: string;
  data: {
    domains: string[];
  };
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
  code: string | number;
  message: string;
  data?: unknown;
}

// Text Sharing Types

export interface TextCreateRequest {
  content: string;
  title: string;
  custom_slug?: string;
  domain?: string;
  expire_at?: number;
  password?: string;
  tag_ids?: number[];
  text_type?: 'plain_text' | 'source_code' | 'markdown';
}

export interface TextResponseData {
  custom_slug: string;
  short_url: string;
  slug: string;
}

export interface TextCreateResponse {
  code: number;
  data: TextResponseData;
  message: string;
}

export interface TextUpdateRequest {
  content: string;
  domain: string;
  slug: string;
  title: string;
}

export interface TextDeleteRequest {
  domain: string;
  slug: string;
}

export interface TextActionResponse {
  code: number;
  data?: unknown;
  message: string;
}

export interface TextDomainListResponse {
  code: number;
  data: {
    domains: string[];
  };
  message: string;
}

// File Sharing Types

export interface FileUploadResponse {
  code: number;
  data: {
    delete: string;
    file_id: number;
    filename: string;
    hash: string;
    height: number;
    mime_type: string;
    page: string;
    path: string;
    size: number;
    storename: string;
    thumb_url: string;
    upload_status: number;
    url: string;
    width: number;
  };
  message: string;
}

export interface FileDeleteResponse {
  code: string;
  message: string;
  success: boolean;
}

export interface FileDomainListResponse {
  code: number;
  data: {
    domains: string[];
  };
  message: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
  success?: boolean;
}

export interface HistoryParams {
  page?: number;
}

export interface LinkHistoryItem {
  created_at: number;
  domain: string;
  object_type: number;
  short_url: string;
  slug: string;
  target_url: string;
  title: string;
  visit_count: number;
}

export type LinkHistoryResponse = ApiResponse<LinkHistoryItem[]>;

export interface LinkVisitStatParams {
  domain: string;
  slug: string;
  period?: 'daily' | 'monthly' | 'totally';
}

export type LinkVisitStatResponse = ApiResponse<{ visit_count: number }>;

export interface TextHistoryItem {
  content_preview: string;
  created_at: number;
  domain: string;
  id: number;
  is_expired: boolean;
  short_url: string;
  slug: string;
  text_type: string;
  title: string;
}

export type TextHistoryResponse = ApiResponse<TextHistoryItem[]>;

export interface FileInfo {
  created_at?: number;
  delete: string;
  file_id: number;
  filename: string;
  hash: string;
  height: number;
  mime_type: string;
  page: string;
  path: string;
  size: number;
  storename: string;
  thumb_url: string;
  upload_status: number;
  url: string;
  width: number;
}

export type FileHistoryResponse = ApiResponse<FileInfo[]>;

export type FileUploadOptions = {
  domain?: string;
  custom_slug?: string;
};

export interface PrivateFileUrlParams {
  file_id: number;
}

export interface PrivateFileUrlData {
  expires_at: number;
  file_id: number;
  url: string;
}

export type PrivateFileUrlResponse = ApiResponse<PrivateFileUrlData>;

export interface CreateLargeFileUploadRequest {
  file_name: string;
  file_size: number;
  alias?: string;
  description?: string;
  domain?: string;
  expire_at?: number;
  file_hash?: string;
  is_private?: 0 | 1;
  mime_type?: string;
  password?: string;
  title?: string;
}

export interface CreateLargeFileUploadData {
  existing_file?: FileInfo;
  expires_at: number;
  fast_upload: boolean;
  file_size: number;
  id: number;
  upload_id: string;
  upload_url: string;
}

export type CreateLargeFileUploadResponse = ApiResponse<CreateLargeFileUploadData>;

export interface LargeFileUploadProgressData {
  created_at: number;
  file_name: string;
  file_size: number;
  progress: number;
  status: 1 | 2 | 3 | 4;
  updated_at: number;
  upload_id: string;
  uploaded_size: number;
}

export type LargeFileUploadProgressResponse = ApiResponse<LargeFileUploadProgressData>;
export type CompleteLargeFileUploadResponse = ApiResponse<{ file: FileInfo; short_link: string }>;

export interface TusUploadStatus {
  upload_offset: number;
  upload_length?: number;
}

export interface QrcodeCreateRequest {
  target_url: string;
  title: string;
  custom_slug?: string;
  domain?: string;
}

export interface QrcodeData {
  custom_slug?: string;
  pdf_url: string;
  png_url: string;
  short_url: string;
  slug: string;
  svg_url: string;
}

export type QrcodeCreateResponse = ApiResponse<QrcodeData>;

export interface QrcodeDeleteRequest {
  domain: string;
  slug: string;
}

export interface QrcodeHistoryItem extends Omit<QrcodeData, 'custom_slug'> {
  created_at: number;
  domain: string;
  scan_count: number;
  title: string;
}

export type QrcodeHistoryResponse = ApiResponse<{ qrcodes: QrcodeHistoryItem[]; total: number }>;

export interface BioCustomLink {
  title: string;
  url: string;
  description?: string;
}

export interface BioPageCreateRequest {
  title: string;
  custom_links?: BioCustomLink[];
  custom_slug?: string;
  description?: string;
  domain?: string;
  mastodon_url?: string;
  rss_url?: string;
}

export type BioPageCreateResponse = ApiResponse<{ bio_page_id: number; short_url: string }>;

export interface BioPageUpdateRequest {
  id: number;
  title: string;
  custom_links?: BioCustomLink[];
  description?: string;
  mastodon_url?: string;
  rss_url?: string;
}

export interface BioPageHistoryItem {
  created_at: number;
  custom_links: BioCustomLink[];
  description: string;
  domain: string;
  id: number;
  link: string;
  mastodon_url: string;
  rss_url: string;
  slug: string;
  title: string;
}

export type BioPageHistoryResponse = ApiResponse<{
  bio_pages: BioPageHistoryItem[];
  total: number;
}>;

export interface TokenCheckResponseData {
  expires_at: number;
  token: string;
  valid: boolean;
}

export type TokenCheckResponse = ApiResponse<TokenCheckResponseData>;

export interface UsageData {
  api_count_day: number;
  api_count_day_limit: number;
  api_count_month: number;
  api_count_month_limit: number;
  file_count: number;
  link_count_day: number;
  link_count_day_limit: number;
  link_count_month: number;
  link_count_month_limit: number;
  qrcode_count_day: number;
  qrcode_count_day_limit: number;
  qrcode_count_month: number;
  qrcode_count_month_limit: number;
  storage_usage_limit_mb: string;
  storage_usage_mb: string;
  text_count_day: number;
  text_count_day_limit: number;
  text_count_month: number;
  text_count_month_limit: number;
  upload_count_day: number;
  upload_count_day_limit: number;
  upload_count_month: number;
  upload_count_month_limit: number;
}

export type UsageResponse = ApiResponse<UsageData>;
