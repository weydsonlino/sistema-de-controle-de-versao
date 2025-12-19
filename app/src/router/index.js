import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/repositorio",
      name: "repositorio",
      component: () => import("../views/RepositorioView.vue"),
    },
    {
      path: "/repositorio/arquivo",
      name: "arquivo",
      component: () => import("../views/ArquivoView.vue"),
    },
  ],
});

export default router;
