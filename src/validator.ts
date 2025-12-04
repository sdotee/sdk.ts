/*!*
 * Copyright (c) 2025 S.EE Development Team
 *
 * This source code is licensed under the MIT License,
 * which is located in the LICENSE file in the source tree's root directory.
 *
 * File: validator.ts
 * Author: S.EE Development Team <dev@s.ee>
 * File Created: 2025-07-03 11:54:52
 *
 * Modified By: S.EE Development Team <dev@s.ee>
 * Last Modified: 2025-12-04 17:09:52
 */

import {ValidationError} from './errors';

export class Validator {
    static validateUrl(url: string): void {
        if (!url || typeof url !== 'string') {
            throw new ValidationError('URL is required and must be a string');
        }

        try {
            // Simple URL validation using regex for basic format checking
            const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
            if (!urlPattern.test(url)) {
                throw new ValidationError('Invalid URL format');
            }
        } catch {
            throw new ValidationError('Invalid URL format');
        }

        if (url.length > 2048) {
            throw new ValidationError('URL is too long (maximum 2048 characters)');
        }
    }

    static validateCustomCode(code: string): void {
        if (typeof code !== 'string') {
            throw new ValidationError('Custom code must be a string');
        }

        if (code.length < 3 || code.length > 20) {
            throw new ValidationError('Custom code must be between 3 and 20 characters');
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
            throw new ValidationError('Custom code can only contain letters, numbers, underscores, and hyphens');
        }
    }

    static validateId(id: string): void {
        if (typeof id !== 'string') {
            throw new ValidationError('ID must be a string');
        }

        if (id.trim().length === 0) {
            throw new ValidationError('ID cannot be empty');
        }
    }
}
