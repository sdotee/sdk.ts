export interface UrlShortenRequest {
    domain: string;
    target_url: string;
    custom_slug?: string;
    title?: string;
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
        short_url: string;
        slug: string;
        custom_slug?: string;
    }
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
