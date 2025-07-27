export default {
    secret: process.env.JWT_SECRET || 'your-strong-secret-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    issuer: process.env.JWT_ISSUER || 'your-app-name',
};