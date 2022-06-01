
class GameManager {
    static #playerList = [];

    static async startGame(playerList, leaderIndex) {
        this.#playerList = playerList;
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
