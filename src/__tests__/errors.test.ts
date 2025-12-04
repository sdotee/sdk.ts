import { SeeServiceError, ValidationError, NetworkError } from '../errors';

describe('Errors', () => {
    describe('SeeServiceError', () => {
        it('should create error with correct properties', () => {
            const apiError = {
                code: 'INVALID_URL',
                message: 'The provided URL is invalid',
                details: { url: 'invalid-url' }
            };

            const error = new SeeServiceError(apiError);

            expect(error.name).toBe('SeeServiceError');
            expect(error.message).toBe('The provided URL is invalid');
            expect(error.code).toBe('INVALID_URL');
            // expect(error.details).toEqual({ url: 'invalid-url' });
            expect(error instanceof Error).toBe(true);
        });
    });

    describe('ValidationError', () => {
        it('should create validation error with correct properties', () => {
            const error = new ValidationError('URL is required');

            expect(error.name).toBe('ValidationError');
            expect(error.message).toBe('URL is required');
            expect(error instanceof Error).toBe(true);
        });
    });

    describe('NetworkError', () => {
        it('should create network error with correct properties', () => {
            const error = new NetworkError('Connection failed', 500);

            expect(error.name).toBe('NetworkError');
            expect(error.message).toBe('Connection failed');
            expect(error.statusCode).toBe(500);
            expect(error instanceof Error).toBe(true);
        });

        it('should create network error without status code', () => {
            const error = new NetworkError('Network timeout');

            expect(error.name).toBe('NetworkError');
            expect(error.message).toBe('Network timeout');
            expect(error.statusCode).toBeUndefined();
        });
    });
});
