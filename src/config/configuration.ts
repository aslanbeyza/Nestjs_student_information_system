export default () => ({
  port: process.env.PORT || '3000',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || '27017',
    name: process.env.DATABASE_NAME || 'ogrenci_bilgi_sistemi',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m', // Access token kısa süreli
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // Refresh token uzun süreli
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false,
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@example.com',
  },
  app: {
    name: process.env.APP_NAME || 'Öğrenci Bilgi Sistemi',
    url: process.env.APP_URL || 'http://localhost:3000',
  },
});
