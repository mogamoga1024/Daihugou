
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

        const bfHandKind = Hand.cardListToHandKind(battleFieldCardList);
        const handKind = Hand.cardListToHandKind(selectedCardList);

        if (selectedCardList.length === 0 || battleFieldCardList.length === 0 && handKind !== Hand.None) {
            return true;
        }

        if (handKind !== bfHandKind || selectedCardList.length !== battleFieldCardList.length) return false;

        switch (bfHandKind) {
            case Hand.Single:
            case Hand.Multi:
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
