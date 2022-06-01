
module.exports = {
    data() {
        return {
            player: new Player("YOU"),
            anotherPlayerList: [
                new Player("CPU1"),
                new Player("CPU2"),
                new Player("CPU3"),
            ],
            battleFieldCardList: []
        }
    },
    created() {
        Dearler.dealCardList(this.playerList);
    },
    async mounted() {
        await GameManager.exchangeCardListScene(this.playerList);
    },
    computed: {
        playerList() {
            return [this.player, ...this.anotherPlayerList];
        },
        battleFieldCardContainerWidth() {
            // 値はテキトー
            return Math.min(100 + 80 * (this.battleFieldCardList.length - 1), 800);
        }
    },
    methods: {
        cardClick(index) {
            const card = this.player.cardList[index];

            if (card.isSelected) {
                this.player.cardList.forEach(c => {
                    c.isSelected = false;
                });
            }
            else {
                card.isSelected = true;
            }
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
