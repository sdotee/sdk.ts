import {ApiError} from './types';

export class UrlShortenerError extends Error {
    public readonly code: string;
    public readonly details?: any;

    constructor(error: ApiError) {
        super(error.message);
        this.name = 'UrlShortenerError';
        this.code = error.code;
        this.details = error.data || "No additional details provided";
    }
}

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class NetworkError extends Error {
    constructor(message: string, public readonly statusCode?: number) {
        super(message);
        this.name = 'NetworkError';
    }
}
