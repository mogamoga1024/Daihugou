
Config.useJoker = false; // MEMO: jokerの処理の実装に時間がかかりそうなので一旦falseにしておく

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: "/", component: httpVueLoader("./js/components/startComponent.vue") },
        { path: "/game", component: httpVueLoader("./js/components/gameComponent.vue") },
    ]
});

Vue.createApp().use(router).mount("#app");
