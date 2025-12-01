declare module "#auth-utils" {
  interface User {
    id: string;
    display_name: string;
  }

  interface UserSession {
    user?: User;
  }

  interface SecureSessionData {
    accessToken: string;
    refreshToken: string;
  }
}

export {};
