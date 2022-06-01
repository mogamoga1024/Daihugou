
class Player {
    name = "";
    rank = Rank.Heimin;
    cardList = [];
    isTurn = false;
    isRankDecided = false;

    constructor(name) {
        this.name = name;
    }

    exchangeCardList() {
        return [];
    };

    outputCardList() {
        return [];
    }
}
