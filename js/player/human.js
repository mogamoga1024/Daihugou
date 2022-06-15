
class Human extends Player {
    resolveOutputCardList = null;

    exchangeCardList() {
        // TODO
        return [];
    }

    async outputCardList(battleFieldCardList) {
        this.findOutputableCardList(battleFieldCardList);

        const selectedCardList = await new Promise(resolve => {
            this.resolveOutputCardList = resolve;
        });

        this.cardList.forEach(card => {
            card.canSelect = true;
            card.isSelected = false;
        });

        return selectedCardList;
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

    findOutputableCardList(battleFieldCardList, justNowSelectedCard = null) {
        const bfHand = Hand.cardListToHand(battleFieldCardList);

        // TODO Joker, 革命, 縛りは未考慮

        const selectedCardList = this.cardList.filter(c => c.isSelected);
        const selectedHand = Hand.cardListToHand(selectedCardList);
        let outputableCardList = [];

        if (bfHand === Hand.None) {
            if (selectedHand === Hand.None) {
                selectedCardList.forEach(c => {
                    c.isSelected = (c === justNowSelectedCard);
                });
            }

            outputableCardList = this.cardList;
        }
        if (bfHand === Hand.Single) {
            if (selectedHand !== Hand.Single) {
                selectedCardList.forEach(c => {
                    c.isSelected = (c === justNowSelectedCard);
                });
            }
            
            if (justNowSelectedCard !== null) {
                outputableCardList = [justNowSelectedCard];
            }
            else {
                outputableCardList = this.cardList.filter(c => c.power > battleFieldCardList[0].power);
            }
        }
        if (bfHand === Hand.Multi) {
            if (selectedHand !== Hand.Single && selectedHand !== Hand.Multi) {
                selectedCardList.forEach(c => {
                    c.isSelected = (c === justNowSelectedCard);
                });
            }

            let outputableCardList = [];
            let tmpCardList = [];
            let prevCardPower = null;
            for (const card of this.cardList) {
                if (card.power <= battleFieldCardList[0].power) {
                    continue;
                }
                else if (prevCardPower === null) {
                    prevCardPower = card.power;
                }

                if (card.power === prevCardPower) {
                    tmpCardList.push(card);
                }
                else {
                    if (tmpCardList.length >= battleFieldCardList.length) {
                        outputableCardList = outputableCardList.concat(tmpCardList);
                    }
                    tmpCardList = [card];
                    prevCardPower = card.power;
                }
            }
            if (tmpCardList.length >= battleFieldCardList.length) {
                outputableCardList = outputableCardList.concat(tmpCardList);
            }
            outputableCardList = outputableCardList;
        }
        if (bfHand === Hand.Stairs) {
            let suitCardListDic = {
                [Suit.Spade.name]: [],
                [Suit.Club.name]: [],
                [Suit.Diamond.name]: [],
                [Suit.Heart.name]: []
            };
            let outputableCardList = [];
            for (const card of this.cardList) {
                if (card.power <= battleFieldCardList[0].power) continue;

                const suitCardList = suitCardListDic[card.suit.name];
                if (suitCardList.length === 0) {
                    suitCardList.push(card);
                }
                else {
                    const prevCard = suitCardList[suitCardList.length - 1];
                    if (card.power - prevCard.power === 1) {
                        suitCardList.push(card);
                    }
                    else {
                        if (suitCardList.length >= battleFieldCardList.length) {
                            outputableCardList = outputableCardList.concat(suitCardList);
                        }
                        suitCardListDic[card.suit.name] = [card];
                    }
                }
            }
            for (const key in suitCardListDic) {
                const suitCardList = suitCardListDic[key];
                if (suitCardList.length >= battleFieldCardList.length) {
                    outputableCardList = outputableCardList.concat(suitCardList);
                }
            }
            outputableCardList = Common.sortcardList(outputableCardList);
        }

        this.cardList.forEach(card => {
            if (outputableCardList.indexOf(card) === -1) {
                card.canSelect = false;
                card.isSelected = false;
            }
            else {
                card.canSelect = true;
            }
        });
    }
}
