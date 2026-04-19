export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  isProduction: process.env.NODE_ENV === 'production',
};
