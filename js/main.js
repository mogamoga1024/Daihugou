
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/', component: httpVueLoader('./js/components/startComponent.vue') },
        { path: '/game', component: httpVueLoader('./js/components/gameComponent.vue') },
    ]
});

Vue.createApp().use(router).mount("#app");
