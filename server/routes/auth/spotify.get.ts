export default defineOAuthSpotifyEventHandler({
  config: {
    scope: [
      "playlist-read-private",
      "playlist-modify-public",
      "playlist-modify-private"
    ]
  },
  async onSuccess (event, { user, tokens }) {
    const session = {
      user: {
        id: user.id,
        display_name: user.display_name,
        images: user.images
      },
      secure: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token
      }
    };

    await setUserSession(event, session);

    return sendRedirect(event, "/");
  },
  onError (event, error) {
    console.warn("Spotify OAuth error:", error);
  }
});
