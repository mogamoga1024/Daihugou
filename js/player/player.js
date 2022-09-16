
class Player {
    name = "";
    rank = Rank.Heimin;
    cardList = [];
    isTurn = false;
    isNowPass = false;
    isRankDecided = false;

    constructor(name) {
        this.name = name;
    }

    exchangeCardList() {
        return [];
    };

    /**
     * 場に出すカードを返す。
     * 副作用で手札からそのカードがなくなる。
     * @returns 
     */
    outputHand(battleFieldHand) {
        return [];
    }

    onRevolution() {}

    onGameFinish() {}
}
