import { jwtDecode } from "jwt-decode";

/**
 * Decode a JWT token and return it's content data as an object.
 *
 * @param {string} token
 * @returns
 * @throws
 */
export function decodeJWTToken(token) {
    let result = {};
  
    // Token
    result.accessToken = token;
  
    // Decode JWT Token
    const tokenContent = jwtDecode(token);
  
    // Token Expiry
    result.accessTokenExpiry = new Date(tokenContent.exp * 1000);
  
    // User
    result.user = {
      id: tokenContent.sub,
      email: tokenContent.email,
      username: tokenContent.preferred_username,
      roles: tokenContent.roles
    };
  
    return result;
  };
