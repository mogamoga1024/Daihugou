
class Cpu extends Player {
    exchangeCardList() {
        // TODO
        return [];
    }

    outputCardList(battleFieldCardList) {
        // TODO

        // 仮

        let selectedCardList = [];
        if (this.cardList.length === 0) return [];

        if (battleFieldCardList.length === 0) {
            // TODO
            selectedCardList = [this.cardList[0]];
        }
        else {
            const bfHand = Hand.cardListToHand(battleFieldCardList);

            switch (bfHand) {
                case Hand.Single:
                    // TODO とりあえず強いカード
                    for (const card of this.cardList) {
                        if (battleFieldCardList[0].power < card.power) {
                            selectedCardList = [card];
                            break;
                        }
                    }
                    break;
                case Hand.Multi:
                    break;
                case Hand.Stairs:
                    break;
            
                default:
                    throw new Error("存在しない役");
            }
        }

        // 手札の更新
        if (selectedCardList.length > 0) {
            this.cardList = this.cardList.filter(c => selectedCardList.indexOf(c) === -1);
        }

        return selectedCardList;
    }
}
