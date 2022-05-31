
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/', component: httpVueLoader('./js/components/gameComponent.vue') },
    ]
});

// const App = new Vue({
//     el: "#app",
//     router
// });

//Vue.createApp(App).mount("#app");
Vue.createApp().use(router).mount("#app");


