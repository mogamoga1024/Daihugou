
class Human extends Player {
    resolveSelectExchangeCardList = null;
    resolveExhangeCardListResultConfirm = null;
    resolveOutputCardList = null;

    async selectExchangeCardList() {
        const selectedCardList = await new Promise(resolve => {
            this.resolveSelectExchangeCardList = resolve;
        });

        this.cardList.forEach(card => {
            card.isSelected = false;
        });

        return selectedCardList;
    }

    async exhangeCardListResultConfirm() {
        await new Promise(resolve => {
            this.resolveExhangeCardListResultConfirm = resolve;
        });
    }

    async outputHand() {
        const selectedHand = await new Promise(resolve => {
            this.resolveOutputCardList = resolve;
        });

        this.cardList.forEach(card => {
            card.isSelected = false;
        });

        return selectedHand;
    }

    canOutputHand(battleFieldHand, selectedHand) {
        const bfHandKind = Hand.handKindFrom(battleFieldHand);
        const handKind = Hand.handKindFrom(selectedHand);

        if (selectedHand.length === 0 || battleFieldHand.length === 0 && handKind !== Hand.None) {
            return true;
        }

        if (handKind !== bfHandKind || selectedHand.length !== battleFieldHand.length) return false;

        switch (bfHandKind) {
            case Hand.Single:
            case Hand.Multi:
            case Hand.Stairs:
                return selectedHand[0].power > battleFieldHand[0].power;
            default:
                throw new Error("存在しない役");
        }
    }

    selectExchangeCardListFromUI() {
        if (this.resolveSelectExchangeCardList !== null) {
            const selectedCardList = this.cardList.filter(c => c.isSelected);
            this.resolveSelectExchangeCardList(selectedCardList);
            this.resolveSelectExchangeCardList = null;
        }
    }

    exhangeCardListResultConfirmFromUI() {
        if (this.resolveExhangeCardListResultConfirm !== null) {
            this.resolveExhangeCardListResultConfirm();
            this.resolveExhangeCardListResultConfirm = null;
        }
    }

    outputCardListFromUI(battleFieldHand) {
        if (this.resolveOutputCardList !== null) {
            const selectedHand = [];
            const tmpCardList = [];

            for (const card of this.cardList) {
                if (card.isSelected) {
                    card.isSelected = false;
                    selectedHand.push(card);
                }
                else {
                    tmpCardList.push(card);
                }
            }

            if (this.canOutputHand(battleFieldHand, selectedHand) === false) {
                return;
            }

            this.cardList = tmpCardList;

            this.resolveOutputCardList(selectedHand);
            this.resolveOutputCardList = null;
        }
    }
}
