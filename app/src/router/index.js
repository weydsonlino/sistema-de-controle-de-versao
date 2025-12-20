import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../pages/DashboardView.vue"),
    },
    {
      path: "/repos",
      name: "repos",
      component: () => import("../pages/RepoListView.vue"),
    },
    {
      path: "/repos/novo",
      name: "repo-create",
      component: () => import("../pages/RepoFormView.vue"),
    },
    {
      path: "/repos/:id",
      name: "repo-detail",
      component: () => import("../pages/RepoDetailView.vue"),
    },
    {
      path: "/repos/:id/editar",
      name: "repo-edit",
      component: () => import("../pages/RepoFormView.vue"),
    },
    {
      path: "/repos/:id/arquivo",
      name: "file-editor",
      component: () => import("../pages/FileEditorView.vue"),
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
    {
      path: "/perfil",
      name: "perfil",
      component: () => import("../views/ProfileView.vue"),
    }
  ],
});

export default router;
