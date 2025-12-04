/*!*
 * Copyright (c) 2025 S.EE Development Team
 *
 * This source code is licensed under the MIT License,
 * which is located in the LICENSE file in the source tree's root directory.
 *
 * File: errors.ts
 * Author: S.EE Development Team <dev@s.ee>
 * File Created: 2025-07-03 11:54:40
 *
 * Modified By: S.EE Development Team <dev@s.ee>
 * Last Modified: 2025-12-04 17:10:04
 */

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
