
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

    get existsHand() {
        return this._handList.length > 0
    }

    get weakestHand() {
        if (this.existsHand) {
            return this._handList[0];
        }
        else {
            throw new Error("handListが空");
        }
    }

    get strongestHand() {
        if (this.existsHand) {
            return this._handList.last();
        }
        else {
            throw new Error("handListが空");
        }
    }

    get strongestCardPower() {
        throw new Error("継承先で処理を書くこと");
    }
}
