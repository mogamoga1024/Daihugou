
class GameManager {
    static #playerList = [];
    static #vm = null;
    static #latestOutputCardPlayer = null;

    static async startGame(playerList, leaderIndex, vm) {
        this.#playerList = playerList;
        this.#vm = vm;
        let playerIndex = leaderIndex;

        log("【ゲーム開始】");

        while (this.#playerList.filter(p => !p.isRankDecided).length > 0) {
            playerIndex = await this.startTurn(playerIndex);

            //break; // debug
        }

        log("【ゲーム終了】");
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
            this.#vm.battleFieldCardList = [];
            this.#playerList.forEach(p => p.isNowPass = false);
            await Common.sleep();
        }

        player.isNowPass = false;

        const cardList = await player.outputCardList(this.#vm.battleFieldCardList);

        if (cardList.length > 0) {
            log(`場に出したカード: ${Common.cardListToString(cardList)}`);
            this.#vm.battleFieldCardList = cardList;
            this.#latestOutputCardPlayer = player;

            if (player.cardList.length === 0) {
                log("あがり");
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
