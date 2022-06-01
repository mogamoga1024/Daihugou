
class GameManager {
    static #playerList = [];
    static #battleFieldCardList = [];

    static async startGame(playerList, leaderIndex, battleFieldCardList) {
        this.#playerList = playerList;
        this.#battleFieldCardList = battleFieldCardList;
        let playerIndex = leaderIndex;

        log("【ゲーム開始】");

        while (playerList.filter(p => !p.isRankDecided).length > 0) {
            playerIndex = await this.startTurn(playerIndex);

            //break; // debug
        }

        log("【ゲーム終了】");
    }

    static async startTurn(playerIndex) {
        const player = this.#playerList[playerIndex];

        log(`【${player.name}のターン】`);
        player.isTurn = true;

        const cardList = await player.outputCardList();

        if (cardList.length > 0) {
            //this.#battleFieldCardList = cardList;
            this.#battleFieldCardList.push(cardList[0]);
        }
        else {
            log("パス");
        }

        await Common.sleep(); // debug

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

    static async exchangeCardListScene(playerList) {
        // TODO
    }


}
