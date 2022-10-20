
class Dearler {
    static dealCardList(_playerList) {
        const playerList = Array.from(_playerList);
        playerList.forEach(p => p.cardList = []);

        CardFactory.initCardList();
        const allCardList = CardFactory.getAllCardList();
        const allCardListIndexs = [];
        for (let i = 0; i < allCardList.length; i++) {
            allCardListIndexs.push(i);
        }

        // カードのシャッフル
        for (let i = 0; i < allCardListIndexs.length; i++) {
            const j = Common.randomInt(allCardListIndexs.length);
            const tmpIndex = allCardListIndexs[i];
            allCardListIndexs[i] = allCardListIndexs[j];
            allCardListIndexs[j] = tmpIndex;
        }

        // プレイヤーのシャッフル（端数の振り分けをランダムにするため）
        for (let i = 0; i < playerList.length; i++) {
            const j = Common.randomInt(playerList.length);
            const tmpPlayer = playerList[i];
            playerList[i] = playerList[j];
            playerList[j] = tmpPlayer;
        }

        // カードを配る
        let playerIndex = 0;
        for (const index of allCardListIndexs) {
            let player = playerList[playerIndex];
            playerIndex = (playerIndex + 1) % playerList.length;

            player.cardList.push(allCardList[index]);
        }

        playerList.forEach(p => Common.sortCardList(p.cardList));
    }
}
