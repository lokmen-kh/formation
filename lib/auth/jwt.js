import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_temporaire_access_token_base';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'secret_temporaire_refresh_token_base';

export function signAccessToken(payload) {
  // Expiration de 15 minutes pour l'access token
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload) {
  // Expiration de 7 jours pour le refresh token
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}