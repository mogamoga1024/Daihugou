
class MultiThinking extends Thinking {
    outputHandIfNoHandInBattleField() {
        // TODO
        return [];
    }

    outputHandIfHandInBattleField(battleFieldHand, handCount, strongestCardPower) {
        let selectedHand = [];

        const tmpMultiHandList = this._handList.filter(h =>
            h.length === battleFieldHand.length &&
            h[0].power > battleFieldHand[0].power
        );

        if (tmpMultiHandList.length === 0) {
            // パスする // TODO 考えもの
        }
        else if (
            handCount === 2 &&
            tmpMultiHandList.last()[0].power === strongestCardPower
        ) {
            // 2役で最強の役を持っている場合、最強の役をだす
            selectedHand = tmpMultiHandList.last();
        }
        else {
            // 2役以外 または 2役で最強の役を持っていない場合

            const hand = tmpMultiHandList[0]
            if (hand[0].power === strongestCardPower) {
                // 最強の役しかない場合、応手しない
            }
            else {
                // 弱い役で応手する
                selectedHand = hand;
            }
        }
        return selectedHand;
    }
}
