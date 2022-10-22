
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

    selectExchangeCardList() {
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

    onRevolution() {
        Common.sortCardList(this.cardList);
    }

    onGameStart() {
        this.cardList = [];
        this.isTurn = false;
        this.isNowPass = false;
        this.isRankDecided = false;
    }

    onGameFinish() {}
}
