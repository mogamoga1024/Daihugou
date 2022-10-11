
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
            battleFieldHand: [],
            isRevolution: false,
            canGoToNextGame: false
        }
    },
    created() {
        Dearler.dealCardList(this.playerList());

        // debug
        // CardFactory.initCardList();
        // this.player.cardList = CardFactory.getCardList("d3, h3, s4, s5, d5, s6, s7, h8, sJ, cJ, sK, c1, d1");
        // this.anotherPlayerList[0].cardList = CardFactory.getCardList("c5, h7, d8, c9, sQ, cQ, dQ, hQ, cK, dK, s1, h1, s2");
        // this.anotherPlayerList[1].cardList = CardFactory.getCardList("c3, c4, h6, s8, c8, s9, h9, sT, cT, hT, dJ, hK, d2");
        // this.anotherPlayerList[2].cardList = CardFactory.getCardList("s3, d4, h4, h5, c6, d6, c7, d7, d9, dT, hJ, c2, h2");
    },
    async mounted() {
        //const leaderIndex = Common.randomInt(this.playerList().length);
        const leaderIndex = 0; // debug
        GameManager.init(this.playerList(), this);
        await GameManager.startGame(leaderIndex);
    },
    computed: {
        battleFieldCardContainerWidth() {
            // 値はテキトー
            return Math.min(100 + 80 * (this.battleFieldHand.length - 1), 800);
        },
        canOutputHand() {
            for (const card of this.player.cardList) {
                if (card.isSelected) return true;
            }
            return false;
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
        outputHand() {
            this.player.outputCardListFromUI(this.battleFieldHand);
        },
        pass() {
            this.player.cardList.forEach(c => {
                c.isSelected = false;
            });
            this.player.outputCardListFromUI(this.battleFieldHand);
        },
        playerList() {
            // computedのほうだと順番が狂った。謎
            return [this.player, ...this.anotherPlayerList];
        }
    }
};
