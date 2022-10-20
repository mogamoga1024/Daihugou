
class Thinking {
    _handList = [];
    get handList() {
        return this._handList;
    }

    constructor(handList) {
        this._handList = handList;
    }

    outputHandIfHandInBattleField(battleField, handCount, strongestCardPower, shouldRevolution) {
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

    get strongestHandPower() {
        return Hand.power(this.strongestHand);
    }

    existsMaybeStrongestHand(power) {
        return this.strongestHandPower >= power - 1
    }
}
