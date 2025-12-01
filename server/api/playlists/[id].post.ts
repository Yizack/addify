export default defineEventHandler(async (event) => {
  const { secure } = await requireUserSession(event);
  const { oauth } = useRuntimeConfig(event);

  const params = await getValidatedRouterParams(event, z.object({
    id: z.string().min(1)
  }).parse);

  const body = await readValidatedBody(event, z.object({
    trackId: z.string().min(1),
    position: z.number().min(0).optional()
  }).parse);

  const spotifyAPI = new Spotify({
    clientId: oauth.spotify.clientId,
    clientSecret: oauth.spotify.clientSecret,
    accessToken: secure?.accessToken
  });

  await spotifyAPI.refreshUserToken(secure!.refreshToken);
  await spotifyAPI.addToPlaylist(params.id, {
    trackId: body.trackId,
    position: !body.position ? undefined : body.position - 1
  });
});
