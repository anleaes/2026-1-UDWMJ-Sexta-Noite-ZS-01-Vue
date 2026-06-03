import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/RegisterView.vue"),
    },
    {
      path: "/cliente/listar-filmes",
      name: "cliente-listar-filmes",
      component: () => import("@/views/cliente/ClienteListarFilmesView.vue"),
      meta: { requiresAuth: true, role: "cliente" },
    },
    {
      path: "/admin",
      name: "admin-home",
      component: () => import("@/views/admin/AdminHomeView.vue"),
      meta: { requiresAuth: true, role: "administrador" },
    },
    {
      path: "/admin/listar-filmes",
      name: "admin-listar-filmes",
      component: () => import("@/views/admin/AdminListarFilmesView.vue"),
      meta: { requiresAuth: true, role: "administrador" },
    },
    {
      path: "/admin/cadastrar-filme",
      name: "admin-cadastrar-filme",
      component: () => import("@/views/admin/AdminCadastrarFilmeView.vue"),
      meta: { requiresAuth: true, role: "administrador" },
    },
    {
      path: "/admin/editar-filme",
      name: "admin-editar-filme",
      component: () => import("@/views/admin/AdminEditarFilmeView.vue"),
      meta: { requiresAuth: true, role: "administrador" },
    },
    {
      path: "/admin/listar-generos",
      name: "admin-generos",
      component: () => import("@/views/admin/AdminGenerosView.vue"),
      meta: { requiresAuth: true, role: "administrador" },
    },
    {
      path: "/admin/listar-assentos",
      name: "admin-assentos",
      component: () => import("@/views/admin/AdminAssentosView.vue"),
      meta: { requiresAuth: true, role: "administrador" },
    },
    {
      path: "/cliente/listar-filmes",
      name: "cliente-listar-filmes",
      component: () => import("@/views/cliente/ClienteListarFilmesView.vue"),
      meta: { requiresAuth: true, role: "cliente" },
    },
    {
      path: "/cliente/escolher-sessao",
      name: "cliente-escolher-sessao",
      component: () => import("@/views/cliente/ClienteEscolherSessaoView.vue"),
      meta: { requiresAuth: true, role: "cliente" },
    },
    {
      path: "/cliente/comprar-ingresso",
      name: "cliente-comprar-ingresso",
      component: () => import("@/views/cliente/ClienteComprarIngressoView.vue"),
      meta: { requiresAuth: true, role: "cliente" },
    },
    {
      path: "/cliente/compra-confirmacao",
      name: "cliente-confirmacao",
      component: () => import("@/views/cliente/ClienteConfirmacaoView.vue"),
      meta: { requiresAuth: true, role: "cliente" },
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (!to.meta.requiresAuth) {
    return true;
  }

  if (auth.user.tipo === "guest") {
    return "/login";
  }

  if (to.meta.role === "administrador" && auth.user.tipo !== "administrador") {
    return "/cliente/listar-filmes";
  }

  if (to.meta.role === "cliente" && auth.user.tipo === "administrador") {
    return "/admin";
  }

  return true;
});

export default router;
