
class Cpu extends Player {
    _singleThinking = null;
    _multiThinking = null;
    _stairsThinking = null;

    exchangeCardList() {
        // TODO
        return [];
    }

    outputHand(battleFieldHand) {
        if (this.cardList.length === 0) {
            throw new Error("すでにあがってる");
        }

        if (
            this._singleThinking === null ||
            this._multiThinking  === null ||
            this._stairsThinking === null
        ) {
            this._cardDivision();
        }

        let selectedHand = [];
        const handCount = this._handCount;
        const strongestCardPower = CardFactory.getStrongestCardPower();
        const maybeLastOutputHand = this._maybeLastOutputHand;
        
        if (battleFieldHand.length === 0) {
            // 親番

            const thinkingList = [this._singleThinking, this._multiThinking, this._stairsThinking];

            // 最後の1役
            // → それをだす
            if (handCount === 1) {
                for (const thinking of thinkingList) {
                    if (thinking.existsHand) {
                        selectedHand = thinking.weakestHand;
                        break;
                    }
                }
            }
            // 最後の2役
            else if (handCount === 2) {
                selectedHand = (() => {
                    // 最強の役あり
                    // → 最強の役をだす
                    for (const thinking of thinkingList) {
                        if (thinking.existsHand && thinking.strongestCardPower === strongestCardPower) {
                            return thinking.strongestHand;
                        }
                    }
                    // 最強の役なし
                    // → 弱い役をだす
                    for (const thinking of thinkingList) {
                        if (thinking.existsHand && thinking.weakestHand === maybeLastOutputHand) {
                            return thinking.weakestHand;
                        }
                    }
                })();
            }
            // 3組以上 かつ 革命すべき場合
            else if (this._shouldRevolution()) {
                selectedHand = (() => {
                    // 最強の役あり
                    // → 最強の役をだす
                    for (const thinking of thinkingList) {
                        if (thinking.existsHand && thinking.strongestCardPower === strongestCardPower) {
                            return thinking.strongestHand;
                        }
                    }
                    // 最強の役なし
                    // → 革命する
                    return this._multiThinking.handList.filter(h => h.length >= 4).last();
                })();
            }
            // 3組以上 かつ 革命すべきでない かつ 最強の役を持っている場合
            else if (
                this._singleThinking.existsHand && this._singleThinking.strongestCardPower === strongestCardPower ||
                this._multiThinking.existsHand && this._multiThinking.strongestCardPower === strongestCardPower ||
                this._stairsThinking.existsHand && this._stairsThinking.strongestCardPower === strongestCardPower
            ) {
                for (const thinking of thinkingList) {
                    // 最後に出す予定の役、最強の役を取り除く
                    const tmpHandList = thinking.handList.filter(h => h !== maybeLastOutputHand && Hand.power(h) !== strongestCardPower);
                    // 最後に出す役、最強の役以外で最弱の役をだす
                    if (tmpHandList.length > 0) {
                        selectedHand = tmpHandList[0];
                        break;
                    }
                }
            }
            // 3組以上 かつ 革命すべきでない かつ 最強の役を持っていない場合
            else {
                // 最後に出す予定の役をだす
                selectedHand = maybeLastOutputHand;
            }
        }
        else {
            // 子番（応手）

            const bfHandKind = Hand.handKindFrom(battleFieldHand);

            let thinking = null;
            switch (bfHandKind) {
                case Hand.Single: thinking = this._singleThinking; break;
                case Hand.Multi:  thinking = this._multiThinking;  break;
                case Hand.Stairs: thinking = this._stairsThinking; break;
                default: throw new Error("存在しない役");
            }
            selectedHand = thinking.outputHandIfHandInBattleField(battleFieldHand, handCount, strongestCardPower, this._shouldRevolution());
        }

        // 手札の更新
        if (selectedHand.length > 0) {
            this.cardList = this.cardList.filter(c => selectedHand.indexOf(c) === -1);
            let thinking = null;
            switch (Hand.handKindFrom(selectedHand)) {
                case Hand.Single: thinking = this._singleThinking; break;
                case Hand.Multi:  thinking = this._multiThinking;  break;
                case Hand.Stairs: thinking = this._stairsThinking; break;
                default: throw new Error("存在しない役");
            }
            thinking.removeHand(selectedHand);
        }

        return selectedHand;
    }

    _cardDivision() {
        // とりあえず multi → stairs → single の順で分割する。
        // 本当は組数が最小になるように分割したいが…

        // TODO 一旦、Jokerは考慮しない

        const createMultiThinkingResult = this._createMultiThinking(this.cardList);
        const createStairsThinkingResult = this._createStairsThinking(createMultiThinkingResult.remainingCardList);
        const createSingleThinkingResult = this._createSingleThinking(createStairsThinkingResult.remainingCardList);

        this._singleThinking = createSingleThinkingResult.instance;
        this._multiThinking = createMultiThinkingResult.instance;
        this._stairsThinking = createStairsThinkingResult.instance;
    }

    _createMultiThinking(cardList) {
        if (cardList.length === 0) {
            return {
                instance: new MultiThinking([]),
                remainingCardList: cardList
            }
        };

        const multiHandList = [];
        let prevCard = cardList[0];
        let hand = [prevCard];

        for (let i = 1; i < cardList.length; i++) {
            const card = cardList[i];
            if (prevCard.power === card.power) {
                hand.push(card);
                if (i === cardList.length - 1) {
                    multiHandList.push(hand);
                }
            }
            else if (hand.length >= 2) {
                multiHandList.push(hand);
                hand = [card];
            }
            else {
                hand = [card];
            }
            prevCard = card;
        }

        for (const hand of multiHandList) {
            cardList = cardList.filter(c => hand.indexOf(c) === -1);
        }
        
        return {
            instance: new MultiThinking(multiHandList),
            remainingCardList: cardList
        };
    }

    _createStairsThinking(cardList) {
        if (cardList.length === 0) {
            return {
                instance: new StairsThinking([]),
                remainingCardList: cardList
            };
        }

        const stairsHandList = [];
        let prevCard = cardList[0];
        let hand = [prevCard];

        for (let i = 1; i < cardList.length; i++) {
            const card = cardList[i];
            if (prevCard.suit === card.suit && card.power - prevCard.power === 1) {
                hand.push(card);
                if (i === cardList.length - 1 && hand.length >= 3) {
                    stairsHandList.push(hand);
                }
            }
            else if (hand.length >= 3) {
                stairsHandList.push(hand);
                hand = [card];
            }
            else {
                hand = [card];
            }
            prevCard = card;
        }

        for (const hand of stairsHandList) {
            cardList = cardList.filter(c => hand.indexOf(c) === -1);
        }
        
        return {
            instance: new StairsThinking(stairsHandList),
            remainingCardList: cardList
        };
    }

    _createSingleThinking(cardList) {
        const singleHandList = cardList.map(c => [c]);
        return {
            instance: new SingleThinking(singleHandList),
            remainingCardList: []
        };
    }

    get _maybeLastOutputHand() {
        if (this._singleThinking.existsHand) {
            return this._singleThinking.weakestHand;
        }
        else if (this._multiThinking.existsHand) {
            return this._multiThinking.weakestHand;
        }
        else if (this._stairsThinking.existsHand) {
            return this._stairsThinking.weakestHand;
        }
        throw new Error("該当なし");
    }

    get _handCount() {
        return this._singleThinking.handList.length + this._multiThinking.handList.length + this._stairsThinking.handList.length;
    }

    onRevolution() {
        super.onRevolution();
        this._singleThinking = this._multiThinking = this._stairsThinking = null;
        this._cardDivision();
    }

    onGameFinish() {
        this._singleThinking = this._multiThinking = this._stairsThinking = null;
    }

    _shouldRevolution() {
        // 革命できない場合はfalse
        const revolutionHandList = this._multiThinking.handList.filter(h => h.length >= 4);

        if (revolutionHandList.length === 0) return false;

        // 革命のカードを取り除く
        const tmpCardList = this.cardList.filter(c => c.power !== revolutionHandList[0][0].power);

        // 革命の役しかない場合はtrue
        if (tmpCardList.length === 0) return true;

        const centerCardPower = CardFactory.getCenterCardPower();
        const lowerCount = tmpCardList.filter(c => c.power <= centerCardPower).length;
        const upperCount = tmpCardList.length - lowerCount;

        // 弱いカードが大半なら革命すべき
        // または革命後、確定であがれるならば革命すべき
        if (lowerCount - upperCount >= 2) {
            return true;
        }
        else {
            // 革命するから-1している
            if (this._handCount - 1 <= 2) {
                if (tmpCardList[0].power - CardFactory.getWeakestCardPower() >= CardFactory.getStrongestCardPower() - tmpCardList.last().power) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
    }
}
