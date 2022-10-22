
class GameManager {
    static #gameCount = 0;
    static #playerList = []; // index:0の要素はHumanクラスであること
    static #vm = null;
    static #latestOutputCardPlayer = null;
    static #ranking = 1;
    static #lastPlayerIndex = 0;

    static init(playerList, vm) {
        this.#playerList = playerList;
        this.#vm = vm;
        this.#latestOutputCardPlayer = null;
        this.#ranking = 1;
    }

    static async startGame(leaderIndex = this.#lastPlayerIndex) {
        let playerIndex = leaderIndex;
        
        log("【ゲーム開始】");

        this.#gameCount++;
        this.#playerList.forEach(p => p.onGameStart());

        Dearler.dealCardList(this.#playerList);
        
        // debug バグ取り用
        // CardFactory.initCardList();
        // this.#playerList[0].cardList = CardFactory.getCardList("d3, h3, s4, s5, d5, s6, s7, h8, sJ, cJ, sK, c1, d1");
        // this.#playerList[1].cardList = CardFactory.getCardList("c5, h7, d8, c9, sQ, cQ, dQ, hQ, cK, dK, s1, h1, s2");
        // this.#playerList[2].cardList = CardFactory.getCardList("c3, c4, h6, s8, c8, s9, h9, sT, cT, hT, dJ, hK, d2");
        // this.#playerList[3].cardList = CardFactory.getCardList("s3, d4, h4, h5, c6, d6, c7, d7, d9, dT, hJ, c2, h2");
        
        // debug ゲーム進行確認用
        // CardFactory.initCardList();
        // this.#playerList[0].cardList = CardFactory.getCardList("s3, c3, d3");
        // this.#playerList[1].cardList = CardFactory.getCardList("s4, c4, d4");
        // this.#playerList[2].cardList = CardFactory.getCardList("s5, c5, d5");
        // this.#playerList[3].cardList = CardFactory.getCardList("s6, c6, d6");

        // debug 手札のレイアウト
        // CardFactory.initCardList(new RuleConfig(true));
        // this.#playerList[0].cardList = CardFactory.getCardList("s3, s4, s5, s6, s7, s8, s9, sT, sJ, sQ, sK, s1, s2, Joker1");
        // this.#playerList[0].cardList = CardFactory.getCardList("s3, s4, s5, s6, s7, s8");
        // this.#playerList[0].cardList = CardFactory.getCardList("s3, s4");

        // debug用
        for (const player of this.#playerList) {
            log(`%c${player.name}	初期手札	${Common.cardListToString(player.cardList)}`, "color: crimson");
        }

        // カードの交換
        if (this.#gameCount > 1) {
            await this.exchangeCardList();
        }

        // ゲーム開始時、CPUが最初のカードを出す前に少し待つ
        // 何も出ていない場をユーザーに見せたいため
        if (this.#playerList[playerIndex].constructor === Cpu) {
            await Common.sleep();
        }

        while (this.#playerList.filter(p => !p.isRankDecided).length > 1) {
            playerIndex = await this.startTurn(playerIndex);
        }

        const lastPlayer = this.#playerList[playerIndex];
        lastPlayer.rank = Rank.getRank(this.#ranking);
        lastPlayer.isRankDecided = true;
        this.#ranking = 1;
        this.#lastPlayerIndex = playerIndex;

        log("【ゲーム終了】");

        // debug用
        for (const player of this.#playerList) {
            if (player.cardList.length > 0) {
                log(`%c${player.name}	残りの手札	${Common.cardListToString(player.cardList)}`, "color: crimson");
            }
        }

        this.#playerList.forEach(p => p.onGameFinish());
        this.#vm.scene = Scene.GoToNextGame;
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

        if (player.constructor === Human) {
            // パスボタンを非活性にするため、ターン終了後にwait
            player.isTurn = false;
            await Common.sleep();
        }
        else {
            // CPUの名前を赤色にするため、wait後にターン終了
            await Common.sleep();
            player.isTurn = false;
        }
        
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

    static async exchangeCardList() {
        log("【カード交換開始】");
        
        this.#vm.scene = Scene.ExchangeCardList;

        // debug
        // this.#playerList[0].rank = Rank.Daihinmin;
        // this.#playerList[1].rank = Rank.Hinmin;
        // this.#playerList[2].rank = Rank.Hugou;
        // this.#playerList[3].rank = Rank.Daihugou;
        // debug
        // this.#playerList[0].rank = Rank.Daihugou;
        // this.#playerList[1].rank = Rank.Hugou;
        // this.#playerList[2].rank = Rank.Hinmin;
        // this.#playerList[3].rank = Rank.Daihinmin;

        const human = this.#playerList[0];
        if (human.rank.name === Rank.Hinmin.name || human.rank.name === Rank.Daihinmin.name) {
            for (let i = 0; i < human.rank.exchangeCardCount; i++) {
                human.cardList[human.cardList.length - 1 - i].isSelected = true;
            }
        }

        let daihugou  = {player: null, exchangeCardList: []};
        let hugou     = {player: null, exchangeCardList: []};
        let hinmin    = {player: null, exchangeCardList: []};
        let daihinmin = {player: null, exchangeCardList: []};
        for (const player of this.#playerList) {
            const cardList = await player.selectExchangeCardList();
            switch (player.rank.name) {
                case Rank.Daihugou.name:  daihugou.player  = player; daihugou.exchangeCardList  = cardList; break;
                case Rank.Hugou.name:     hugou.player     = player; hugou.exchangeCardList     = cardList; break;
                case Rank.Hinmin.name:    hinmin.player    = player; hinmin.exchangeCardList    = cardList; break;
                case Rank.Daihinmin.name: daihinmin.player = player; daihinmin.exchangeCardList = cardList; break;
            }
            // debug用
            log(`%c${player.name}	交換するカード	${Common.cardListToString(cardList)}`, "color: crimson");
        }

        const tmpDaihugouCardList = daihugou.player.cardList.filter(c => daihugou.exchangeCardList.indexOf(c) === -1).concat(daihinmin.exchangeCardList);
        const tmpHugouCardList = hugou.player.cardList.filter(c => hugou.exchangeCardList.indexOf(c) === -1).concat(hinmin.exchangeCardList);
        const tmpHinminCardList = hinmin.player.cardList.filter(c => hinmin.exchangeCardList.indexOf(c) === -1).concat(hugou.exchangeCardList);
        const tmpDaihinminCardList = daihinmin.player.cardList.filter(c => daihinmin.exchangeCardList.indexOf(c) === -1).concat(daihugou.exchangeCardList);

        daihugou.player.cardList = Common.sortCardList(tmpDaihugouCardList);
        hugou.player.cardList = Common.sortCardList(tmpHugouCardList);
        hinmin.player.cardList = Common.sortCardList(tmpHinminCardList);
        daihinmin.player.cardList = Common.sortCardList(tmpDaihinminCardList);

        this.#vm.scene = Scene.Game;

        log("【カード交換終了】");

        // debug用
        for (const player of this.#playerList) {
            log(`%c${player.name}	交換後の手札	${Common.cardListToString(player.cardList)}`, "color: crimson");
        }
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
