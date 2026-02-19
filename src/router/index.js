import { createRouter, createWebHistory } from "vue-router";
import { authenticated, getConfigs } from "@/middleware";
import { useAuth } from "../stores/authStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/maintenance",
      name: "maintenance",
      component: () => import("../views/MaintenancePage.vue"),
      meta: {
        title: "Maintenance",
        layout: "empty",
        requiresAuth: true,
      },
    },
    {
      path: "/",
      name: "Users",
      component: () => import("../views/users/IndexPage.vue"),
      meta: {
        title: "Users",
        layout: "default",
        requiresAuth: true,
        noQueryRecreate: true,
      },
    },
    {
      path: "/users",
      name: "users.index",
      component: () => import("../views/users/IndexPage.vue"),
      meta: {
        title: "Users",
        layout: "default",
        requiresAuth: true,
      },
    },
    {
      path: "/users/create",
      name: "users.create",
      component: () => import("../views/users/CreatePage.vue"),
      meta: {
        title: "Create User",
        layout: "default",
        requiresAuth: true,
      },
    },
    {
      path: "/users/:id/edit",
      name: "users.edit",
      component: () => import("../views/users/EditPage.vue"),
      meta: {
        title: "Edit User",
        layout: "default",
        requiresAuth: true,
      },
    },
    {
      path: "/telegram-messages",
      name: "telegram-messages.index",
      component: () => import("../views/telegram-messages/IndexPage.vue"),
      meta: {
        title: "Telegram Messages",
        layout: "default",
        requiresAuth: true,
      },
    },
    {
      path: "/telegram-messages/create",
      name: "telegram-messages.create",
      component: () => import("../views/telegram-messages/CreatePage.vue"),
      meta: {
        title: "Telegram Messages Creating",
        layout: "default",
        requiresAuth: true,
      },
    },
    {
      path: "/settings",
      name: "settings.index",
      component: () => import("../views/settings/IndexPage.vue"),
      meta: {
        title: "Settings",
        layout: "default",
        requiresAuth: true,
      },
    },
    {
      path: "/settings/change-password",
      name: "settings.changePassword",
      component: () => import("../views/settings/ChangePasswordPage.vue"),
      meta: {
        title: "Change Password",
        layout: "default",
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/auth/LoginPage.vue"),
      meta: {
        title: "Login",
        layout: "empty",
      },
    },
    {
      path: "/logout",
      name: "Logout",
      component: () => import("../views/auth/LogoutPage.vue"),
      meta: {
        title: "Logout",
        layout: "empty",
      },
    },
    {
      path: "/not-found",
      name: "notFound",
      component: () => import("../views/errors/NotFoundPage.vue"),
      meta: {
        title: "404",
        layout: "empty",
        requiresAuth: true,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      // redirect: "/",
      redirect: () => {
        // catch all redirect to 404
        return { name: "notFound" };
      },
    },
  ],
  linkExactActiveClass: "exact-active",
});

// use middleware to check auth
router.beforeEach(authenticated);
router.beforeEach((to, from, next) => {
  const authStore = useAuth();
  if (
    to.path === "/" &&
    authStore.user &&
    authStore.is("internal balances access")
  ) {
    next("/customers?type=cash");
  }
  if (
    (to.path === "/" || to.path === "/cashbox-operations") &&
    authStore.user &&
    authStore.is("world cashier access")
  ) {
    next("/customers?type=world_balance");
  }
  if (
    (to.path === "/" || to.path === "/cryptocurrency-operations") &&
    authStore.user &&
    authStore.is("security")
  ) {
    next("/cashbox-operations");
  }
  document.title = to.meta.title;
  next();
});

router.beforeEach(getConfigs);
// router.afterEach(updateNotifications);

export default router;
