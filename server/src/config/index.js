const isProduction = process.env.NODE_ENV === 'production';

const getCorsOrigin = () => {
  if (isProduction) {
    const corsOrigin = process.env.CORS_ORIGIN;
    if (corsOrigin) {
      return corsOrigin.split(',').map(o => o.trim());
    }
    return ['http://localhost:5173'];
  }
  return ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
};

export default {
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development'
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/teamflow'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_me',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_change_me',
    expire: process.env.JWT_EXPIRE || '15m',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d'
  },
  cors: {
    origin: getCorsOrigin(),
    credentials: true
  }
};
