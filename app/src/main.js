import { createApp } from "vue";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/components.css";
import "./style.css";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");
