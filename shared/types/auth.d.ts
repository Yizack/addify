declare module "#auth-utils" {
  interface User {
    id: string;
    display_name: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
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
