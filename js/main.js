
const App = {
    data() {
        return {
            player: new Player("YOU"),
            anotherPlayerList: [
                new Player("CPU1"),
                new Player("CPU2"),
                new Player("CPU3"),
            ]
        }
    },
    created() {

    },
    mounted() {

    }
};

Vue.createApp(App).mount("#app");
