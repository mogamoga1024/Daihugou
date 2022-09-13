
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

    canOutputCardList(battleFieldCardList) {
        // TODO

        const bfHand = Hand.cardListToHand(battleFieldCardList);




        return true;
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

            if (this.canOutputCardList(battleFieldCardList) === false) {
                return;
            }

            this.cardList = tmpCardList;

            this.resolveOutputCardList(selectedCardList);
            this.resolveOutputCardList = null;
        }
    }
}
