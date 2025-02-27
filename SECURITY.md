# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within this portfolio website, please send an email to [YOUR_EMAIL]. All security vulnerabilities will be promptly addressed.

Please include the following information in your report:
- Type of vulnerability
- Full path of the affected file(s)
- Steps to reproduce the issue
- Possible impacts of the vulnerability

## Security Measures

This project implements several security measures:

1. **Environment Variables**: All sensitive data is stored in environment variables
2. **Input Validation**: All user inputs are validated and sanitized
3. **Authentication**: Admin routes are protected with secure authentication
4. **API Rate Limiting**: API endpoints are protected against abuse
5. **CORS Policy**: Strict CORS policy to prevent unauthorized access
6. **Content Security Policy**: Implements CSP headers
7. **Dependencies**: Regular security audits of npm packages

## Development Practices

- Dependencies are regularly updated
- Security patches are applied promptly
- Code is reviewed for security implications
- Production logs are monitored for suspicious activity
