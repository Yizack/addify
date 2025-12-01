export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event);
  const { oauth } = useRuntimeConfig(event);

  const spotifyAPI = new Spotify({
    clientId: oauth.spotify.clientId,
    clientSecret: oauth.spotify.clientSecret,
    accessToken: secure?.accessToken
  });

  await spotifyAPI.refreshUserToken(secure!.refreshToken);

  const playlists = await spotifyAPI.getPlaylists({
    limit: 50
  });

  return playlists.items
    .filter(playlist => playlist.owner.id === user.id || playlist.collaborative)
    .map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      images: playlist.images,
      owner: {
        display_name: playlist.owner.display_name
      },
      tracks: {
        total: playlist.tracks.total
      }
    }));
});
