
module.exports = {
    data() {
        return {
            Scene: Scene,
            scene: Scene.Game,
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
        canExhangeCardList() {
            if (this.scene === Scene.ExchangeCardList) {
                if (this.player.rank.name === Rank.Hinmin.name || this.player.rank.name === Rank.Daihinmin.name) {
                    return true;
                }
                else {
                    return this.player.cardList.filter(c => c.isSelected).length === this.player.rank.exchangeCardCount;
                }
            }
            else {
                return false;
            }
        },
        canOutputHand() {
            for (const card of this.player.cardList) {
                if (card.isSelected) return true;
            }
            return false;
        }
    },
    methods: {
        clickCard(index) {
            const card = this.player.cardList[index];

            // カード交換時
            if (this.scene === Scene.ExchangeCardList) {
                // ランクが富豪か大富豪か
                if (this.player.rank.name === Rank.Hugou.name || this.player.rank.name === Rank.Daihugou.name) {
                    // 交換可能枚数まで選択しているか
                    if (this.player.cardList.filter(c => c.isSelected).length === this.player.rank.exchangeCardCount) {
                        // クリックしたカードがまだ選択されていないか
                        if (card.isSelected === false) {
                            return;
                        }
                    }
                }
                else {
                    return;
                }
            }
            else if (this.scene === Scene.ExchangeCardListResult) {
                return;
            }

            if (card.isSelected) {
                this.player.cardList.forEach(c => {
                    c.isSelected = false;
                });
            }
            else {
                card.isSelected = true;
            }
        },
        async exhangeCardList() {
            this.player.selectExchangeCardListFromUI();
        },
        async exhangeCardListResultConfirm() {
            this.player.exhangeCardListResultConfirmFromUI();
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
            this.scene = Scene.Game;
            this.isRevolution = false;
            this.battleFieldHand = [];

            await GameManager.startGame();
        }
    }
};
