
class MultiThinking extends Thinking {
    outputHandIfHandInBattleField(battleFieldHand, handCount, strongestCardPower, shouldRevolution) {
        let selectedHand = [];

        const tmpMultiHandList = this._handList.filter(h =>
            h.length === battleFieldHand.length &&
            h[0].power > battleFieldHand[0].power
        );

        if (tmpMultiHandList.length === 0) {
            // 場に出せる役がない場合、パスする
        }
        // 残り2役の場合
        else if (handCount === 2) {
            // 最強の役を持っている場合
            if (tmpMultiHandList.last()[0].power === strongestCardPower) {
                // 最強の役をだす
                selectedHand = tmpMultiHandList.last();
            }
            // 最強の役を持っていない場合
            else {
                // 弱い役をだす
                selectedHand = tmpMultiHandList[0];
            }
        }
        // 残り3役以上
        // 革命すべき場合
        else if (shouldRevolution) {
            // 最強の役をだす
            selectedHand = tmpMultiHandList.last();
        }
        // 革命すべきでない場合
        else {
            const hand = tmpMultiHandList[0]
            if (hand[0].power === strongestCardPower) {
                // 最強の役しかない場合、パスする
            }
            else {
                // 弱い役をだす
                selectedHand = hand;
            }
        }
        return selectedHand;
    }

    get strongestCardPower() {
        return this.strongestHand[0].power;
    }
}
