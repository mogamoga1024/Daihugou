
class Human extends Player {
    resolveOutputCardList = null;

    exchangeCardList() {
        // TODO
        return [];
    }

    async outputCardList() {
        const selectedCardList = await new Promise(resolve => {
            this.resolveOutputCardList = resolve;
        });

        this.cardList.forEach(card => {
            card.isSelected = false;
        });

        return selectedCardList;
    }

    canOutputCardList(battleFieldCardList, selectedCardList) {
        // TODO

        const bfHand = Hand.cardListToHand(battleFieldCardList);
        const hand = Hand.cardListToHand(selectedCardList);

        if (battleFieldCardList.length === 0 && hand !== Hand.None) {
            return true;
        }

        if (hand !== bfHand || selectedCardList.length !== battleFieldCardList.length) return false;

        switch (bfHand) {
            case Hand.Single:
                return selectedCardList[0].power > battleFieldCardList[0].power;
            case Hand.Multi:
                return selectedCardList[0].power > battleFieldCardList[0].power;
            case Hand.Stairs:
                return selectedCardList[0].power > battleFieldCardList[0].power;
            default:
                throw new Error("存在しない役");
        }
    }

    outputCardListFromUI(battleFieldCardList) {
        if (this.resolveOutputCardList !== null) {
            const selectedCardList = [];
            const tmpCardList = [];

            for (const card of this.cardList) {
                if (card.isSelected) {
                    card.isSelected = false;
                    selectedCardList.push(card);
                }
                else {
                    tmpCardList.push(card);
                }
            }

            if (this.canOutputCardList(battleFieldCardList, selectedCardList) === false) {
                return;
            }

            this.cardList = tmpCardList;

            this.resolveOutputCardList(selectedCardList);
            this.resolveOutputCardList = null;
        }
    }
}
