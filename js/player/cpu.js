
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
        const strongestCardPower = this._strongestCardPower;
        const maybeLastOutputHand = this._maybeLastOutputHand;
        
        if (battleFieldHand.length === 0) {
            // 親番

            // 最後の1役
            // → それをだす
            if (handCount === 1) {
                if (this._singleThinking.handList.length > 0) {
                    selectedHand = this._singleThinking.handList[0];
                }
                else if (this._multiThinking.handList.length > 0) {
                    selectedHand = this._multiThinking.handList[0];
                }
                else if (this._stairsThinking.handList.length > 0) {
                    selectedHand = this._stairsThinking.handList[0];
                }
            }
            // 最後の2役
            else if (handCount === 2) {
                // 最強の役あり
                // → 最強の役をだす
                if (
                    this._singleThinking.handList.length > 0 &&
                    this._singleThinking.handList.last()[0].power === strongestCardPower
                ) {
                    selectedHand = this._singleThinking.handList.last();
                }
                else if (
                    this._multiThinking.handList.length > 0 &&
                    this._multiThinking.handList.last()[0].power === strongestCardPower
                ) {
                    selectedHand = this._multiThinking.handList.last();
                }
                else if (
                    this._stairsThinking.handList.length > 0 &&
                    this._stairsThinking.handList.last().last().power === strongestCardPower
                ) {
                    selectedHand = this._stairsThinking.handList.last();
                }
                // 最強の役なし
                // → 弱い役をだす
                else if (
                    this._singleThinking.handList.length > 0 &&
                    this._singleThinking.handList[0] === maybeLastOutputHand
                ) {
                    selectedHand = this._singleThinking.handList[0];
                }
                else if (
                    this._multiThinking.handList.length > 0 &&
                    this._multiThinking.handList[0] === maybeLastOutputHand
                ) {
                    selectedHand = this._multiThinking.handList[0];
                }
                else if (
                    this._stairsThinking.handList.length > 0 &&
                    this._stairsThinking.handList[0] === maybeLastOutputHand
                ) {
                    selectedHand = this._stairsThinking.handList[0];
                }
            }
            // 3組以上
            // → ・基本的に最後に出す役、最強の役以外で最弱の役をだす
            //   ・最強の役を持っていない場合は最後に出す予定の役はさっさと切っていい
            //   ・革命する予定があるなら最強の役はさっさと切っていい
            else {
                const tmpSingleHandList = this._singleThinking.handList.filter(h => h !== maybeLastOutputHand && h[0].power !== strongestCardPower);
                const tmpMultiHandList = this._multiThinking.handList.filter(h => h !== maybeLastOutputHand && h[0].power !== strongestCardPower);
                const tmpStairsHandList = this._stairsThinking.handList.filter(h => h !== maybeLastOutputHand && h.last().power !== strongestCardPower);

                if (
                    this._singleThinking.handList.length > 0 && this._singleThinking.handList.last()[0].power === strongestCardPower ||
                    this._multiThinking.handList.length > 0 && this._multiThinking.handList.last()[0].power === strongestCardPower ||
                    this._stairsThinking.handList.length > 0 && this._stairsThinking.handList.last().last().power === strongestCardPower
                ) {
                    // 最強の役を持っている場合、最後に出す役、最強の役以外で最弱の役をだす

                    if (tmpSingleHandList.length > 0) {
                        selectedHand = tmpSingleHandList[0];
                    }
                    else if (tmpMultiHandList.length > 0) {
                        selectedHand = tmpMultiHandList[0];
                    }
                    else if (tmpStairsHandList.length > 0) {
                        selectedHand = tmpStairsHandList[0];
                    }
                }
                else {
                    // 最強の役を持っていない場合は最後に出す予定の役をだす
                    selectedHand = maybeLastOutputHand;
                }
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
            selectedHand = thinking.outputHandIfHandInBattleField(battleFieldHand, handCount, strongestCardPower);
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

    get _strongestCardPower() {
        let strongestCard = null;
        for (const card of CardFactory.allCardList) {
            if (card.obj.isDead) {
                continue;
            }
            if (strongestCard === null) {
                strongestCard = card.obj;
                continue;
            }
            if (strongestCard.power < card.obj.power) {
                strongestCard = card.obj;
            }
        }
        if (strongestCard === null) {
            throw new Error("すでにゲームが終わっている");
        }
        return strongestCard.power;
    }

    get _maybeLastOutputHand() {
        if (this._singleThinking.handList.length > 0) {
            return this._singleThinking.handList[0];
        }
        else if (this._multiThinking.handList.length > 0) {
            return this._multiThinking.handList[0];
        }
        else if (this._stairsThinking.handList.length > 0) {
            return this._stairsThinking.handList[0];
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
        // 革命できる かつ 弱いカードが大半なら革命すべき

        const revolutionHandList = this._multiThinking.handList.filter(h => h.length === 4);

        if (revolutionHandList.length === 0) return false;

        let cardList = this.cardList;
        for (const hand of revolutionHandList) {
            cardList = cardList.filter(c => c.power !== hand[0].power);
        }

        const centerCardPower = CardFactory.getCard("s9").power;
        cardList = cardList.filter(c => c.power !== centerCardPower);
        const lowerCount = cardList.filter(c => c.power !== centerCardPower).length;
        const upperCount = cardList.length - lowerCount;

        return lowerCount - upperCount >= 2;
    }
}
