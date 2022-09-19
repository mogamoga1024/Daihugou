
class Thinking {
    _handList = [];
    get handList() {
        return this._handList;
    }

    constructor(handList) {
        this._handList = handList;
    }

    outputHandIfNoHandInBattleField() {
        return [];
    }

    outputHandIfHandInBattleField(battleField, handCount, strongestCardPower) {
        return [];
    }

    removeHand(hand) {
        this._handList = this._handList.filter(h => h !== hand);
    }
}
