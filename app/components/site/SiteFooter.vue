<template>
  <USeparator class="h-px" />
  <UFooter>
    <template #left>
      <p class="text-muted text-sm">© {{ new Date().getFullYear() }}, Yizack Rangel.</p>
    </template>

    <template #right>
      <UButton
        icon="simple-icons:github"
        color="neutral"
        variant="ghost"
        :to="SITE.github.repo"
        target="_blank"
        aria-label="GitHub"
      />
    </template>
  </UFooter>
</template>
