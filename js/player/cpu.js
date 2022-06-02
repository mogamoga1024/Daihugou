
class Cpu extends Player {
    exchangeCardList() {
        // TODO
        return [];
    }

    outputCardList(battleFieldCardList) {
        // TODO

        // 仮

        let selectedCardList = [];
        if (this.cardList.length > 0) {
            selectedCardList = [this.cardList[0]];
            this.cardList = this.cardList.filter(c => selectedCardList.indexOf(c) === -1);
        }

        return selectedCardList;
    }
}
