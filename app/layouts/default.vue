<template>
  <div id="layout" class="min-h-screen flex flex-col">
    <SiteNavbar />
    <div class="py-6 flex-1">
      <slot />
    </div>
    <SiteFooter />
  </div>
</template>
