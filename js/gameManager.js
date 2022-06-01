
class GameManager {
    static #playerList = [];

    static async startGame(playerList, leaderIndex) {
        this.#playerList = playerList;
        let playerIndex = leaderIndex;

        log("【ゲーム開始】");

        if (1) return;

        while (playerList.filter(p => !p.isRankDecided) > 0) {
            const player = playerList[playerIndex];
            playerIndex = await this.startTurn(player);
        }

        log("【ゲーム終了】");
    }

    static async startTurn(player) {

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
