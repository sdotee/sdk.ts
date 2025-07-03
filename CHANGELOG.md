# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-01-01

### Added
- Initial release of URL Shortener SDK
- Core functionality for creating short URLs
- Core functionality for deleting short URLs
- Core functionality for retrieving short URL information
- Complete TypeScript support with type definitions
- Input validation for URLs, custom codes, and IDs
- Comprehensive error handling with custom error types
- Configurable HTTP client with timeout support
- Support for custom short codes
- Support for expiration dates
- Complete unit test suite with high coverage
- Detailed documentation and examples
- ESLint configuration for code quality
- Jest configuration for testing

### Features
- **UrlShortenerSDK Class**: Main SDK class with HTTP client configuration
- **URL Creation**: Create short URLs with optional custom codes and expiration
- **URL Deletion**: Delete existing short URLs by ID
- **URL Retrieval**: Get information about existing short URLs
- **Validation**: Input validation for all parameters
- **Error Handling**: Three types of errors (ValidationError, NetworkError, UrlShortenerError)
- **Configuration Management**: Update SDK configuration at runtime
- **TypeScript Support**: Full type safety and IntelliSense support

### Developer Experience
- Complete TypeScript type definitions
- Comprehensive unit tests (validator, errors, SDK)
- Example usage file with real-world scenarios
- ESLint configuration for consistent code style
- Jest configuration for testing
- Detailed README with API documentation
- Chinese language documentation support
