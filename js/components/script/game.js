
module.exports = {
    data() {
        return {
            player: new Human("YOU"),
            // anotherPlayerListのPlayerはユーザー（= 画面の前の君のこと）の次のターン順になっている。
            anotherPlayerList: [
                new Cpu("CPU1"),
                new Cpu("CPU2"),
                new Cpu("CPU3"),
            ],
            battleFieldCardList: []
        }
    },
    created() {
        Dearler.dealCardList(this.playerList());
    },
    async mounted() {
        //const leaderIndex = Common.randomInt(this.playerList().length);
        const leaderIndex = 0; // debug
        await GameManager.startGame(this.playerList(), leaderIndex);
    },
    computed: {
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
        },
        playerList() {
            // computedのほうだと順番が狂った。謎
            return [this.player, ...this.anotherPlayerList];
        }
    }
};
