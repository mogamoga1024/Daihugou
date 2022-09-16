
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
            battleFieldHand: [
                // CardFactory.createCard("d3"),
                // //CardFactory.createCard("s3"),
                // CardFactory.createCard("d4"),
                // CardFactory.createCard("d5"),
            ],
            isRevolution: false
        }
    },
    created() {
        Dearler.dealCardList(this.playerList());

        // debug
        //this.player.cardList = CardFactory.createCardList("s3, s4, s5, s6, s9, sT, dJ, dQ, dK, d1");
        //this.player.cardList = CardFactory.createCardList("Joker1");
    },
    async mounted() {
        //const leaderIndex = Common.randomInt(this.playerList().length);
        const leaderIndex = 0; // debug
        await GameManager.startGame(this.playerList(), leaderIndex, this);
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
