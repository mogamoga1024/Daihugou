
class Human extends Player {
    resolveOutputCardList = null;

    exchangeCardList() {
        // TODO
        return [];
    }

    async outputCardList(battleFieldCardList) {
        const outputableCardList = this.findOutputableCardList(battleFieldCardList);

        this.cardList.forEach(card => {
            if (outputableCardList.indexOf(card) === -1) {
                card.canSelect = false;
                card.isSelected = false;
            }
        });

        return await new Promise(resolve => {
            this.resolveOutputCardList = resolve;
        });
    }

    outputCardListFromUI() {
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

            this.cardList = tmpCardList;

            this.resolveOutputCardList(selectedCardList);
            this.resolveOutputCardList = null;
        }
    }

    findOutputableCardList(battleFieldCardList) {
        const bfHand = Hand.cardListToHand(battleFieldCardList);

        // TODO Joker, 革命, 縛りは未考慮

        if (bfHand === Hand.None) {
            return this.cardList;
        }
        if (bfHand === Hand.Single) {
            return this.cardList.filter(c => c.power > battleFieldCardList[0].power);
        }
        if (bfHand === Hand.Multi) {
            let outputableCardList = [];
            let tmpCardList = [];
            let prevCardPower = null;
            for (const card of this.cardList) {
                if (card.power <= battleFieldCardList[0].power) continue;

                if (card.power === prevCardPower) {
                    tmpCardList.push(card);
                }
                else {
                    if (tmpCardList.length >= battleFieldCardList.length) {
                        outputableCardList = outputableCardList.concat(tmpCardList);
                    }
                    tmpCardList = [];
                    prevCardPower = card.power;
                }
            }
            if (tmpCardList.length >= battleFieldCardList.length) {
                outputableCardList = outputableCardList.concat(tmpCardList);
            }
            return outputableCardList;
        }
        if (bfHand === Hand.Stairs) {
            // TODO
        }

        throw new Error("仮にこのエラーが出たら、Handの分岐が足りない");
    }
}
