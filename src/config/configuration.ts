export default () => ({
  port: process.env.PORT || '3000',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || '27017',
    name: process.env.DATABASE_NAME || 'ogrenci_bilgi_sistemi',
  },
});
