
const App = {
    data() {
        return {
            player: new Player("YOU"),
            anotherPlayerList: [
                new Player("CPU1"),
                new Player("CPU2"),
                new Player("CPU3"),
            ],
            battleFieldCardList: [
                // CardFactory.createCard("s1"),
                // CardFactory.createCard("s2"),
                // CardFactory.createCard("dK"),
                // CardFactory.createCard("s1"),
                // CardFactory.createCard("s2"),
            ]
        }
    },
    created() {
        Dearler.dealCardList([this.player, ...this.anotherPlayerList]);
    },
    mounted() {

    },
    computed: {
        battleFieldCardContainerWidth() {
            return Math.min(100 + 80 * (this.battleFieldCardList.length - 1), 800);
        }
    },
    methods: {
        cardClick(index) {
            const card = this.player.cardList[index];
            card.isSelected = !card.isSelected;
        },
        selectedCardReset() {
            this.player.cardList.forEach(c => {
                c.isSelected = false;
            });
        },
        outputCardList() {
            const selectedCardList = [];
            const tmpCardList = [];

            for (const card of this.player.cardList) {
                if (card.isSelected) {
                    card.isSelected = false;
                    selectedCardList.push(card);
                }
                else {
                    tmpCardList.push(card);
                }
            }

            this.battleFieldCardList = selectedCardList;
            this.player.cardList = tmpCardList;
        }
    }
};

Vue.createApp(App).mount("#app");
