
class GameManager {
    static #playerList = [];
    static #vm = null;
    static #latestOutputCardPlayer = null;
    static #ranking = 1;

    static async startGame(playerList, leaderIndex, vm) {
        this.#playerList = playerList;
        this.#vm = vm;
        let playerIndex = leaderIndex;

        log("【ゲーム開始】");

        while (this.#playerList.filter(p => !p.isRankDecided).length > 1) {
            playerIndex = await this.startTurn(playerIndex);
        }

        const lastPlayer = this.#playerList[playerIndex];
        lastPlayer.rank = Rank.getRank(this.#ranking);
        lastPlayer.isRankDecided = true;
        this.#ranking = 1;

        log("【ゲーム終了】");

        this.#playerList.forEach(p => p.onGameFinish());
    }

    static async startTurn(playerIndex) {
        const player = this.#playerList[playerIndex];

        log(`【${player.name}のターン】`);
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
            log(`場に出したカード: ${Common.cardListToString(hand)}`);

            // TODO Joker未考慮
            // 革命判定
            if (
                hand.length === 4 &&
                hand[0].power === hand[1].power &&
                hand[1].power === hand[2].power &&
                hand[2].power === hand[3].power
            ) {
                log("革命！");
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

            this.#vm.battleFieldHand = hand;
            this.#latestOutputCardPlayer = player;

            hand.forEach(c => c.isDead = true);

            if (player.cardList.length === 0) {
                log("あがり");
                player.rank = Rank.getRank(this.#ranking++);
                player.isRankDecided = true;
                this.#playerList.forEach(p => p.isNowPass = false);
            }
        }
        else {
            log("パス");
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


}
