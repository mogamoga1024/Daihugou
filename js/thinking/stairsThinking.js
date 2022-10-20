
class StairsThinking extends Thinking {
    outputHandIfHandInBattleField(battleFieldHand, handCount, strongestCardPower, shouldRevolution) {
        let selectedHand = [];

        const tmpStairsHandList = this._handList.filter(h =>
            h.length === battleFieldHand.length &&
            h[0].power > battleFieldHand[0].power
        );

        if (tmpStairsHandList.length === 0) {
            // 場に出せる役がない場合、パスする
        }
        // 残り2役の場合
        else if (handCount === 2) {
            const strongestHandPower = tmpStairsHandList.last().last().power;
            // 最強の役を持っている場合
            // ※ 最強の役から1低い役でも最強と見なす
            if (strongestHandPower === strongestCardPower || strongestHandPower === strongestCardPower - 1) {
                // 最強の役をだす
                selectedHand = tmpStairsHandList.last();
            }
            // 最強の役を持っていない場合
            else {
                // 弱い役をだす
                selectedHand = tmpStairsHandList[0];
            }
        }
        // 残り3役以上
        // 革命すべき場合
        else if (shouldRevolution) {
            // 最強の役をだす
            selectedHand = tmpStairsHandList.last();
        }
        // 革命すべきでない場合
        else {
            const hand = tmpStairsHandList[0];
            if (hand.last().power === strongestCardPower || hand.last().power === strongestCardPower - 1) {
                // 最強の役しかない場合、パスする
                // ※ 最強の役から1低い役でも最強と見なす
            }
            else {
                // 弱い役をだす
                selectedHand = hand;
            }
        }

        return selectedHand;
    }
}
