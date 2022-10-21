
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
            isHighSpeed: EnvConfig.isHighSpeed,
            isRevolution: false,
            canGoToNextGame: false
        }
    },
    created() {
        // カード画像の先読み込み
        CardFactory.initCardList();
        const allCardList = CardFactory.getAllCardList();
        for (const card of allCardList){
            const img = document.createElement("img");
            img.src = card.imagePath;
        }
    },
    async mounted() {
        GameManager.init(this.playerList, this);
        await GameManager.startGame();
    },
    watch: {
        isHighSpeed(val) {
            EnvConfig.isHighSpeed = val;
        }
    },
    computed: {
        battleFieldCardContainerWidth() {
            // カード一覧のコンテナの幅: 800
            // 他の値はテキトー
            return Math.min(100 + 80 * (this.battleFieldHand.length - 1), 800);
        },
        playerCardListWidth() {
            // カードの幅: 150
            // カード一覧のコンテナの幅: 800
            return Math.min((this.player.cardList.length - 1) * (150 / 1.5) + 150, 800);
        },
        playerList() {
            return [this.player, ...this.anotherPlayerList];
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
        async goToNextGame() {
            this.canGoToNextGame = false;
            this.isRevolution = false;
            this.battleFieldHand = [];

            await GameManager.startGame();
        }
    }
};
