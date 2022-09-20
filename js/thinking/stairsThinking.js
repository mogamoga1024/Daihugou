
class StairsThinking extends Thinking {
    outputHandIfNoHandInBattleField() {
        // TODO
        return [];
    }

    outputHandIfHandInBattleField(battleFieldHand, handCount, strongestCardPower) {
        let selectedHand = [];

        const tmpStairsHandList = this._handList.filter(h =>
            h.length === battleFieldHand.length &&
            h[0].power > battleFieldHand[0].power
        );

        if (tmpStairsHandList.length === 0) {
            // 場に出せる役がない場合、パスする
        }
        else if (
            handCount === 2 &&
            tmpStairsHandList.last().last().power === strongestCardPower
        ) {
            // 2役で最強の役を持っている場合、最強の役をだす
            selectedHand = tmpStairsHandList.last();
        }
        else {
            // 2役以外 または 2役で最強の役を持っていない場合

            const hand = tmpStairsHandList[0]
            if (hand.last().power === strongestCardPower) {
                // 最強の役しかない場合、応手しない
            }
            else {
                // 弱い役で応手する
                selectedHand = hand;
            }
        }

        return selectedHand;
    }

    get strongestCardPower() {
        return this.strongestHand.last().power;
    }
}
