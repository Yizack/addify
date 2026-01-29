<script setup lang="ts">
const props = defineProps<{
  options: {
    playlist: string;
    trackUrl: string;
    position: number;
  };
}>();

const emit = defineEmits(["add"]);

const toast = useToast();

const { data: playlists } = useNuxtData<SpotifyPlaylist["items"]>("playlists");

const trackId = computed(() => props.options.trackUrl.split("track/")[1]?.split("?")[0] || "");
const playlist = computed(() => playlists.value?.find(p => p.id === props.options.playlist));
const isValidLink = computed(() => props.options.trackUrl.includes("spotify.com/track/"));

const isOpen = defineModel<boolean>();
const isFetchingTrack = ref(false);

type SpotifyTrackData = Pick<SpotifyTrack, "name" | "artists" | "album">;
const track = ref<SpotifyTrackData>();

const fetchTrack = () => {
  if (!isValidLink.value) {
    isOpen.value = false;
    toast.add({
      title: "Invalid URL",
      description: "Please provide a valid Spotify track link",
      color: "error"
    });
    return;
  }

  let data = useCachedData<SpotifyTrackData>(`track:${trackId.value}`);

  if (!data) {
    isFetchingTrack.value = true;
    $fetch<SpotifyTrackData>(`/api/tracks/${trackId.value}`).then((trackData) => {
      data = trackData;
      track.value = data;
      useCachedData(`track:${trackId.value}`, () => trackData);
    }).catch(() => {}).finally(() => {
      isFetchingTrack.value = false;
    });

    return;
  }

  track.value = data;
};

watch(isOpen, (open) => {
  if (open && props.options.trackUrl) fetchTrack();
});

const isLoading = ref(false);

const addToPlaylist = async () => {
  if (!playlist.value || !trackId.value) return;

  isLoading.value = true;

  await $fetch(`/api/playlists/${playlist.value.id}`, {
    method: "POST",
    body: {
      trackId: trackId.value,
      position: props.options.position
    }
  }).then(() => {
    isOpen.value = false;
    toast.add({
      title: "Success",
      description: `Track added to "${playlist.value?.name}" playlist`,
      color: "success"
    });
    emit("add");
  }).catch(() => {}).finally(() => {
    isLoading.value = false;
  });
};
</script>

<template>
  <UModal v-if="playlist" v-model:open="isOpen" title="Details">
    <template #body>
      <div class="space-y-6">
        <!-- Playlist Info -->
        <div class="flex flex-col sm:flex-row gap-4">
          <ULink
            :to="`https://open.spotify.com/playlist/${playlist.id}`"
            target="_blank"
            class="text-center"
          >
            <UAvatar
              :src="playlist.images?.[0]?.url"
              :alt="playlist.name"
              size="xl"
              class="size-36 rounded-md"
            />
          </ULink>
          <div class="flex-1 space-y-1">
            <h4 class="text-lg font-semibold sm:text-start text-center">
              <ULink
                :to="`https://open.spotify.com/playlist/${playlist.id}`"
                target="_blank"
                class="hover:underline text-current"
              >
                {{ playlist.name }}
              </ULink>
            </h4>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p v-if="playlist.description" class="text-sm text-muted line-clamp-4" v-html="playlist.description" />
            <div class="flex items-center gap-2 text-sm">
              <UIcon name="lucide:user" class="size-4" />
              <ULink
                :to="`https://open.spotify.com/user/${playlist.owner.id}`"
                target="_blank"
                class="hover:underline hover:text-primary text-current"
              >
                {{ playlist.owner.display_name }}
              </ULink>
              <span>•</span>
              <span>{{ playlist.tracks.total }} tracks</span>
            </div>
          </div>
        </div>

        <USeparator />

        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="lucide:circle-check" class="size-5 text-success" />
            <span class="font-medium">Track will be added</span>
          </div>
          <div class="text-sm text-muted">
            Position: {{ options.position || 'End of playlist' }}
          </div>
        </div>

        <UCard class="[&>div]:p-3">
          <div v-if="track && !isFetchingTrack" class="flex items-start gap-3">
            <UAvatar
              :src="track.album.images?.[0]?.url"
              :alt="track.name"
              size="md"
              class="size-12 rounded-md"
            />
            <div class="flex-1 min-w-0">
              <div class="font-medium mb-1 truncate">
                {{ track.name }}
              </div>
              <div class="text-sm truncate">
                <template v-for="(artist, index) in track.artists" :key="artist.id">
                  <ULink
                    :to="`https://open.spotify.com/artist/${artist.id}`"
                    target="_blank"
                    class="hover:underline hover:text-primary"
                  >
                    {{ artist.name }}
                  </ULink>
                  <span v-if="index < track.artists.length - 1">, </span>
                </template>
              </div>
            </div>
          </div>
          <div v-else class="flex items-start gap-3">
            <USkeleton class="size-12 rounded-full" />
            <div class="flex-1 min-w-0 space-y-2">
              <USkeleton class="h-5 w-3/4" />
              <USkeleton class="h-4 w-1/2" />
            </div>
          </div>
        </UCard>
      </div>
    </template>
    <template #footer>
      <form class="flex flex-col sm:flex-row gap-2 w-full" @submit.prevent="addToPlaylist">
        <UButton
          color="neutral"
          variant="subtle"
          label="Cancel"
          size="xl"
          block
          @click="isOpen = false"
        />
        <UButton
          color="primary"
          :label="isLoading ? '' : 'Confirm'"
          size="xl"
          block
          type="submit"
          :loading="isLoading"
          :disabled="!track || isFetchingTrack"
        />
      </form>
    </template>
  </UModal>
</template>
