export class Spotify {
  apiURL: string;
  apiTokenURL: string;
  accessToken: string | null;
  clientId: string;
  clientSecret: string;
  constructor (options: {
    clientId: string;
    clientSecret: string;
    accessToken?: string;
  }) {
    this.apiURL = "https://api.spotify.com/v1";
    this.apiTokenURL = "https://accounts.spotify.com/api/token";
    this.accessToken = options.accessToken || null;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
  }

  async generateToken () {
    const basicAuth = btoa(`${this.clientId}:${this.clientSecret}`);
    const response = await $fetch<{ access_token: string }>(this.apiTokenURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`
      },
      body: new URLSearchParams({
        grant_type: "client_credentials"
      }).toString()
    });
    this.accessToken = response.access_token;
  }

  async refreshUserToken (refreshToken: string) {
    const basicAuth = btoa(`${this.clientId}:${this.clientSecret}`);
    const response = await $fetch<{ access_token: string, refresh_token: string }>(this.apiTokenURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: this.clientId
      }).toString()
    });
    this.accessToken = response.access_token;
    return response;
  }

  async getPlaylists (options: SpotifyPlaylistOptions) {
    const response = await $fetch<SpotifyPlaylist>("/me/playlists", {
      baseURL: this.apiURL,
      query: options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });

    return response;
  }

  async getTrack (trackId: string) {
    const response = await $fetch<SpotifyTrack>(`/tracks/${trackId}`, {
      baseURL: this.apiURL,
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });
    return response;
  }

  async addToPlaylist (playlistId: string, options: { trackId: string, position?: number }) {
    await $fetch(`/playlists/${playlistId}/tracks`, {
      method: "POST",
      baseURL: this.apiURL,
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      },
      body: {
        uris: [`spotify:track:${options.trackId}`],
        position: options.position
      }
    });

    return;
  }
}
