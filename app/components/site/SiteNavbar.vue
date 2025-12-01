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
          icon="lucide:user"
          trailing-icon="lucide:chevron-down"
          variant="subtle"
          color="neutral"
          class="rounded-lg"
        />
      </UDropdownMenu>
    </template>
  </UHeader>
</template>
