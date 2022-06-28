
class Hand {
    static None = Symbol("None");
    static Single = Symbol("Single");
    static Multi = Symbol("Multi");
    static Stairs = Symbol("Stairs");
    static MaybeStairs = Symbol("MaybeStairs");

    static cardListToHand(cardList) {
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
        else {
            let prevCard = cardList[0];
            let maybeStairs = false;
            for (let i = 1; i < cardList.length; i++) {
                const card = cardList[i];
                if (card.suit !== prevCard.suit) {
                    return this.None;
                }
                else if (card.power - prevCard.power !== 1) {
                    maybeStairs = true;
                }
                prevCard = card;
            }
            return maybeStairs ? this.MaybeStairs : this.Stairs;
        }
    }
}
