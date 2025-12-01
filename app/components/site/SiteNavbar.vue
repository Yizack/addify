<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const { user, clear } = useUserSession();

const userMenu: DropdownMenuItem[][] = [
  [
    {
      label: "Logout",
      icon: "lucide:log-out",
      onSelect: clear
    }
  ]
];
</script>

<template>
  <UHeader
    mode="modal"
    class="w-full top-0 py-1 z-50 border-0 backdrop-blur-sm border-b border-default"
    :toggle="false"
  >
    <template #left>
      <ULink raw to="/" class="text-xl font-bold">
        {{ SITE.name }}
      </ULink>
    </template>

    <template #right>
      <UColorModeButton />

      <UDropdownMenu v-if="user" :items="userMenu" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }">
        <UButton
          :label="user.display_name"
          trailing-icon="lucide:chevron-down"
          variant="subtle"
          color="neutral"
          class="rounded-lg"
        >
          <template #leading>
            <UAvatar v-if="user.images?.[0]?.url" :src="user.images?.[0]?.url" :alt="user.display_name" size="2xs" />
            <UAvatar v-else :alt="user.display_name" size="2xs" class="bg-accented" />
          </template>
        </UButton>
      </UDropdownMenu>
    </template>
  </UHeader>
</template>
