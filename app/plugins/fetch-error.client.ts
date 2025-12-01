export default defineNuxtPlugin({
  name: "fetch-error",
  parallel: true,
  async setup () {
    const toast = useToast();

    globalThis.$fetch = $fetch.create({
      onResponseError: ({ response }) => {
        const description = response.status === 500 ? "Unknown error occurred" : response._data.message;
        toast.add({ title: SITE.name, description, color: "error" });
      }
    });
  }
});
