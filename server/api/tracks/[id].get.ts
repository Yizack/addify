export default defineEventHandler(async (event) => {
  const { secure } = await requireUserSession(event);
  const { oauth } = useRuntimeConfig(event);

  const params = await getValidatedRouterParams(event, z.object({
    id: z.string().min(1)
  }).parse);

  const spotifyAPI = new Spotify({
    clientId: oauth.spotify.clientId,
    clientSecret: oauth.spotify.clientSecret,
    accessToken: secure?.accessToken
  });

  await spotifyAPI.refreshUserToken(secure!.refreshToken);

  const track = await spotifyAPI.getTrack(params.id);

  return {
    name: track.name,
    artists: track.artists.map(artist => ({
      name: artist.name,
      id: artist.id
    })),
    album: {
      name: track.album.name,
      images: track.album.images
    }
  };
});
