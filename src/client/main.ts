import "./main.css";
import { createApp } from "vue";
import App from "./app.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./pages/home-page.vue";
import { BluetoothHttpInterceptor } from "./vue-plugin/bluetooth-http-interceptor";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomePage },
    { path: "/:path(.*)*", redirect: "/" },
  ],
});

createApp(App).use(router).use(BluetoothHttpInterceptor, { url: "bollerwagen.v3" }).mount("#app");
