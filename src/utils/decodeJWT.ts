
// Interface for decoded JWT payload (only for token expiry check)
interface JwtPayload {
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

// Helper function to decode JWT token (only for checking expiry)
export const decodeJWT = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};