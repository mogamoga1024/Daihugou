
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
                // CardFactory.getCard("d3"),
                // //CardFactory.getCard("s3"),
                // CardFactory.getCard("d4"),
                // CardFactory.getCard("d5"),
            ],
            isRevolution: false
        }
    },
    created() {
        Dearler.dealCardList(this.playerList());

        // debug ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2
        //this.player.cardList = CardFactory.getCardList("s3, s4, s5, s6, s9, sT, dJ, dQ, dK, d1");
        //this.player.cardList = CardFactory.getCardList("Joker1");
        //this.player.cardList = CardFactory.getCardList("s4, c4, d4, h4, s9, sT, dJ, dQ, dK, d1");
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
