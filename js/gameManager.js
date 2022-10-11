
class GameManager {
    static #playerList = [];
    static #vm = null;
    static #latestOutputCardPlayer = null;
    static #ranking = 1;

    static init(playerList, vm) {
        this.#playerList = playerList;
        this.#vm = vm;
        this.#latestOutputCardPlayer = null;
        this.#ranking = 1;
    }

    static async startGame(leaderIndex) {
        let playerIndex = leaderIndex;

        log("【ゲーム開始】");

        this.#playerList.forEach(p => p.onGameStart());

        Dearler.dealCardList(this.#playerList);
        
        // debug
        // CardFactory.initCardList();
        // this.#playerList[0].cardList = CardFactory.getCardList("d3, h3, s4, s5, d5, s6, s7, h8, sJ, cJ, sK, c1, d1");
        // this.#playerList[1].cardList = CardFactory.getCardList("c5, h7, d8, c9, sQ, cQ, dQ, hQ, cK, dK, s1, h1, s2");
        // this.#playerList[2].cardList = CardFactory.getCardList("c3, c4, h6, s8, c8, s9, h9, sT, cT, hT, dJ, hK, d2");
        // this.#playerList[3].cardList = CardFactory.getCardList("s3, d4, h4, h5, c6, d6, c7, d7, d9, dT, hJ, c2, h2");
        
        // debug ゲーム進行確認用
        // CardFactory.initCardList();
        // this.#playerList[0].cardList = CardFactory.getCardList("d3");
        // this.#playerList[1].cardList = CardFactory.getCardList("d4");
        // this.#playerList[2].cardList = CardFactory.getCardList("d5");
        // this.#playerList[3].cardList = CardFactory.getCardList("d6");

        for (const player of this.#playerList) {
            // debug用
            log(`%c${player.name}	初期手札	${Common.cardListToString(player.cardList)}`, "color: crimson");
        }

        while (this.#playerList.filter(p => !p.isRankDecided).length > 1) {
            playerIndex = await this.startTurn(playerIndex);
        }

        const lastPlayer = this.#playerList[playerIndex];
        lastPlayer.rank = Rank.getRank(this.#ranking);
        lastPlayer.isRankDecided = true;
        this.#ranking = 1;

        log("【ゲーム終了】");

        this.#playerList.forEach(p => p.onGameFinish());
        this.#vm.canGoToNextGame = true;
    }

    static async startTurn(playerIndex) {
        const player = this.#playerList[playerIndex];

        player.isTurn = true;
        
        // 場を流すかどうか
        if (
            this.#latestOutputCardPlayer === player ||
            this.#latestOutputCardPlayer !== null && this.#latestOutputCardPlayer.isRankDecided && player.isNowPass
        ) {
            this.#vm.battleFieldHand = [];
            this.#playerList.forEach(p => p.isNowPass = false);
            await Common.sleep();
        }

        player.isNowPass = false;

        const hand = await player.outputHand(this.#vm.battleFieldHand);

        if (hand.length > 0) {
            log(`${player.name}	場に出したカード	${Common.cardListToString(hand)}`);

            // TODO Joker未考慮
            // 革命判定
            if (
                hand.length === 4 &&
                hand[0].power === hand[1].power &&
                hand[1].power === hand[2].power &&
                hand[2].power === hand[3].power
            ) {
                log(`${player.name}	革命！`);
                this.revolution();
            }

            this.#vm.battleFieldHand = hand;
            this.#latestOutputCardPlayer = player;

            hand.forEach(c => c.isDead = true);

            if (player.cardList.length === 0) {
                log(`${player.name}	あがり`);
                player.rank = Rank.getRank(this.#ranking++);
                player.isRankDecided = true;
                this.#playerList.forEach(p => p.isNowPass = false);
            }
        }
        else {
            log(`${player.name}	パス`);
            player.isNowPass = true;
        }

        await Common.sleep();

        // TODO

        player.isTurn = false;

        return this.#nextPlayerIndex(playerIndex);
    }

    static #nextPlayerIndex(currentPlayerIndex) {
        let nextPlayerIndex = currentPlayerIndex;
        
        do {
            nextPlayerIndex = (nextPlayerIndex + 1) % this.#playerList.length;
            if (!this.#playerList[nextPlayerIndex].isRankDecided) {
                return nextPlayerIndex;
            }
        }
        while (nextPlayerIndex !== currentPlayerIndex);

        return nextPlayerIndex;
    }

    static async exchangeCardListScene() {
        // TODO
    }

    static revolution() {
        this.#vm.isRevolution = !this.#vm.isRevolution;
        const allCardList = CardFactory.getAllCardList();
        for (const card of allCardList) {
            if (card.constructor === Joker) {
                continue;
            }
            card.power *= -1;
        }
        this.#playerList.forEach(p => p.onRevolution());
    }
}
