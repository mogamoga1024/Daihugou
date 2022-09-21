
class Hand {
    static None = Symbol("None");
    static Single = Symbol("Single");
    static Multi = Symbol("Multi");
    static Stairs = Symbol("Stairs");
    static MaybeStairs = Symbol("MaybeStairs");

    static handKindFrom(cardList) {
        if (cardList.length === 0) {
            return this.None;
        }
        if (cardList.length === 1) {
            return this.Single;
        }

        // TODO Joker未考慮
        
        if (cardList[0].power === cardList[1].power) {
            for (let i = 1; i < cardList.length; i++) {
                if (cardList[i].power !== cardList[0].power) return this.None;
            }
            return this.Multi;
        }
        else if (cardList.length < 3) {
            return this.None;
        }
        else {
            let prevCard = cardList[0];
            for (let i = 1; i < cardList.length; i++) {
                const card = cardList[i];
                if (card.suit !== prevCard.suit || card.power - prevCard.power !== 1) {
                    return this.None;
                }
                prevCard = card;
            }
            return this.Stairs;
        }
    }

    static power(hand) {
        const handKind = this.handKindFrom(hand);
        switch (handKind) {
            case this.Single:
            case this.Multi:
                return hand[0].power;
            case this.Stairs:
                return hand.last().power;
            default:
                throw new Error("想定外の役");
        }
    }
}
