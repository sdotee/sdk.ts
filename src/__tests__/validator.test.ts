import { Validator } from '../validator';
import { ValidationError } from '../errors';

describe('Validator', () => {
    describe('validateUrl', () => {
        it('should validate correct URLs', () => {
            expect(() => Validator.validateUrl('https://example.com')).not.toThrow();
            expect(() => Validator.validateUrl('http://test.org/path')).not.toThrow();
            expect(() => Validator.validateUrl('https://www.google.com/search?q=test')).not.toThrow();
        });

        it('should throw error for invalid URLs', () => {
            expect(() => Validator.validateUrl('')).toThrow(ValidationError);
            expect(() => Validator.validateUrl('not-a-url')).toThrow(ValidationError);
            expect(() => Validator.validateUrl('ftp://example.com')).toThrow(ValidationError);
            expect(() => Validator.validateUrl('javascript:alert(1)')).toThrow(ValidationError);
        });

        it('should throw error for non-string URLs', () => {
            expect(() => Validator.validateUrl(null as any)).toThrow(ValidationError);
            expect(() => Validator.validateUrl(undefined as any)).toThrow(ValidationError);
            expect(() => Validator.validateUrl(123 as any)).toThrow(ValidationError);
        });

        it('should throw error for too long URLs', () => {
            const longUrl = `https://example.com/${  'a'.repeat(2050)}`;
            expect(() => Validator.validateUrl(longUrl)).toThrow(ValidationError);
        });
    });

    describe('validateCustomCode', () => {
        it('should validate correct custom codes', () => {
            expect(() => Validator.validateCustomCode('abc')).not.toThrow();
            expect(() => Validator.validateCustomCode('test123')).not.toThrow();
            expect(() => Validator.validateCustomCode('my-short-url')).not.toThrow();
            expect(() => Validator.validateCustomCode('custom_code_123')).not.toThrow();
        });

        it('should throw error for invalid custom codes', () => {
            expect(() => Validator.validateCustomCode('ab')).toThrow(ValidationError);
            expect(() => Validator.validateCustomCode('a'.repeat(21))).toThrow(ValidationError);
            expect(() => Validator.validateCustomCode('test with spaces')).toThrow(ValidationError);
            expect(() => Validator.validateCustomCode('test@code')).toThrow(ValidationError);
            expect(() => Validator.validateCustomCode('test.code')).toThrow(ValidationError);
        });

        it('should throw error for non-string custom codes', () => {
            // expect(() => Validator.validateCustomCode(123 as any)).toThrow(ValidationError);
            expect(() => Validator.validateCustomCode(null as any)).toThrow(ValidationError);
        });
    });

    describe('validateId', () => {
        it('should validate correct IDs', () => {
            expect(() => Validator.validateId('abc123')).not.toThrow();
            expect(() => Validator.validateId('test-id')).not.toThrow();
            expect(() => Validator.validateId('12345')).not.toThrow();
        });

        it('should throw error for invalid IDs', () => {
            expect(() => Validator.validateId('')).toThrow(ValidationError);
            expect(() => Validator.validateId('   ')).toThrow(ValidationError);
            // expect(() => Validator.validateId(null as any)).toThrow(ValidationError);
            expect(() => Validator.validateId(undefined as any)).toThrow(ValidationError);
        });
    });
});
