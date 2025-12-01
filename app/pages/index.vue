<script setup lang="ts">
import type { SelectMenuItem } from "@nuxt/ui";

const { user } = useUserSession();

const { data: playlists } = await useFetch("/api/playlists", {
  immediate: !!user.value,
  key: "playlists",
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
});

const form = useFormState({
  playlist: "",
  trackUrl: "",
  position: 1
});

const items: SelectMenuItem[] = playlists.value?.map(item => ({
  label: item.name,
  value: item.id
})) || [];

const isLoading = ref(false);
const isOpenModal = ref(false);

const resetForm = () => {
  form.reset();
};
</script>

<template>
  <UContainer as="main" class="max-w-150">
    <UCard>
      <form v-if="user" class="space-y-4" @submit.prevent="isOpenModal = true">
        <h2 class="text-2xl text-center">
          <strong>Add to playlist</strong>
        </h2>

        <UFormField label="Playlist" name="playlist" required>
          <USelectMenu
            v-model="form.playlist"
            :items="items"
            size="xl"
            class="w-full"
            value-key="value"
            required
          />
        </UFormField>

        <UFormField label="Track URL" name="trackUrl" required>
          <UInput
            v-model="form.trackUrl"
            placeholder="https://open.spotify.com/track/6T2Qm0X0wV3uJXJL1JFF66"
            size="xl"
            class="w-full"
            type="url"
            required
          />
        </UFormField>

        <UFormField name="position" hint="Optional">
          <template #label>
            Position in Playlist
            <UPopover mode="hover">
              <UIcon name="lucide:circle-question-mark" class="inline-block ml-1" size="1.2rem" />
              <template #content>
                <div class="p-4 max-w-48 text-sm">
                  <span>Leave empty or '<code class="text-primary">0</code>' to add track at the end of the playlist, '<code class="text-primary">1</code>' will add the track at the beginning of the playlist.</span>
                </div>
              </template>
            </UPopover>
          </template>
          <UInput
            v-model="form.position"
            placeholder="1"
            size="xl"
            class="w-full"
            type="number"
          />
        </UFormField>

        <UButton
          block
          size="xl"
          color="primary"
          variant="subtle"
          leading-icon="simple-icons:spotify"
          :label="isLoading ? '' : 'Add to playlist'"
          type="submit"
          :loading="isLoading"
        />

        <PlaylistModal v-model="isOpenModal" :options="form" @add="resetForm" />
      </form>
      <div v-else class="text-center p-10">
        <h2 class="text-2xl font-semibold mb-4">
          Spotify account required
        </h2>
        <p class="mb-4">You need to be logged in with your Spotify account to add tracks to your playlists</p>
        <UButton
          size="xl"
          color="primary"
          leading-icon="simple-icons:spotify"
          label="Sign in with Spotify"
          to="/auth/spotify"
          external
        />
      </div>
    </UCard>
  </UContainer>
</template>
