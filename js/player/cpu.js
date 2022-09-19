
class Cpu extends Player {
    _singleHandList = [];
    _multiHandList = [];
    _stairsHandList = [];

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
            this._singleHandList.length === 0 &&
            this._multiHandList.length === 0 &&
            this._stairsHandList.length === 0
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
                if (this._singleHandList.length > 0) {
                    selectedHand = this._singleHandList[0];
                }
                else if (this._multiHandList.length > 0) {
                    selectedHand = this._multiHandList[0];
                }
                else if (this._stairsHandList.length > 0) {
                    selectedHand = this._stairsHandList[0];
                }
            }
            // 最後の2役
            else if (handCount === 2) {
                // 最強の役あり
                // → 最強の役をだす
                if (
                    this._singleHandList.length > 0 &&
                    this._singleHandList.last()[0].power === strongestCardPower
                ) {
                    selectedHand = this._singleHandList.last();
                }
                else if (
                    this._multiHandList.length > 0 &&
                    this._multiHandList.last()[0].power === strongestCardPower
                ) {
                    selectedHand = this._multiHandList.last();
                }
                else if (
                    this._stairsHandList.length > 0 &&
                    this._stairsHandList.last().last().power === strongestCardPower
                ) {
                    selectedHand = this._stairsHandList.last();
                }
                // 最強の役なし
                // → 弱い役をだす
                else if (
                    this._singleHandList.length > 0 &&
                    this._singleHandList[0] === maybeLastOutputHand
                ) {
                    selectedHand = this._singleHandList[0];
                }
                else if (
                    this._multiHandList.length > 0 &&
                    this._multiHandList[0] === maybeLastOutputHand
                ) {
                    selectedHand = this._multiHandList[0];
                }
                else if (
                    this._stairsHandList.length > 0 &&
                    this._stairsHandList[0] === maybeLastOutputHand
                ) {
                    selectedHand = this._stairsHandList[0];
                }
            }
            // 3組以上
            // → ・基本的に最後に出す役、最強の役以外で最弱の役をだす
            //   ・最強の役を持っていない場合は最後に出す予定の役はさっさと切っていい
            //   ・革命する予定があるなら最強の役はさっさと切っていい
            else {
                const tmpSingleHandList = this._singleHandList.filter(h => h !== maybeLastOutputHand && h[0].power !== strongestCardPower);
                const tmpMultiHandList = this._multiHandList.filter(h => h !== maybeLastOutputHand && h[0].power !== strongestCardPower);
                const tmpStairsHandList = this._stairsHandList.filter(h => h !== maybeLastOutputHand && h.last().power !== strongestCardPower);

                if (
                    this._singleHandList.length > 0 && this._singleHandList.last()[0].power === strongestCardPower ||
                    this._multiHandList.length > 0 && this._multiHandList.last()[0].power === strongestCardPower ||
                    this._stairsHandList.length > 0 && this._stairsHandList.last().last().power === strongestCardPower
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

            switch (bfHandKind) {
                case Hand.Single:
                    selectedHand = this._singleThinking.outputHandIfHandInBattleField(battleFieldHand, handCount, strongestCardPower);
                    break;

                case Hand.Multi:
                    selectedHand = this._multiThinking.outputHandIfHandInBattleField(battleFieldHand, handCount, strongestCardPower);
                    break;

                case Hand.Stairs:
                    const tmpStairsHandList = this._stairsHandList.filter(h =>
                        h.length === battleFieldHand.length &&
                        h[0].power > battleFieldHand[0].power
                    );
                    if (tmpStairsHandList.length === 0) {
                        selectedHand = []; // TODO 考えもの
                        break;
                    }

                    if (
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
                            selectedHand = [];
                        }
                        else {
                            // 弱い役で応手する
                            selectedHand = hand;
                        }
                    }
                    break;

                default:
                    throw new Error("存在しない役");
            }
        }

        // 手札の更新
        if (selectedHand.length > 0) {
            this.cardList = this.cardList.filter(c => selectedHand.indexOf(c) === -1);
            switch (Hand.handKindFrom(selectedHand)) {
                case Hand.Single: this._singleHandList = this._singleHandList.filter(h => h !== selectedHand); break;
                case Hand.Multi:  this._multiHandList  = this._multiHandList.filter(h => h !== selectedHand);  break;
                case Hand.Stairs: this._stairsHandList = this._stairsHandList.filter(h => h !== selectedHand); break;
                default: throw new Error("存在しない役");
            }
        }

        return selectedHand;
    }

    _cardDivision() {
        // とりあえず multi → stairs → single の順で分割する。
        // 本当は組数が最小になるように分割したいが…

        // TODO 一旦、Jokerは考慮しない

        let tmpCardList = this.cardList;

        tmpCardList = this._cardMultiDivision(tmpCardList);
        tmpCardList = this._cardStairsDivision(tmpCardList);
        this._cardSingleDivision(tmpCardList);

        this._singleThinking = new SingleThinking(this, this._singleHandList);
        this._multiThinking = new MultiThinking(this, this._multiHandList);
        this._stairsThinking = new StairsThinking(this, this._stairsHandList);
    }

    _cardMultiDivision(cardList) {
        this._multiHandList = [];
        if (cardList.length === 0) return cardList;
        let prevCard = cardList[0];
        let multiCard = [prevCard];

        for (let i = 1; i < cardList.length; i++) {
            const card = cardList[i];
            if (prevCard.power === card.power) {
                multiCard.push(card);
                if (i === cardList.length - 1) {
                    this._multiHandList.push(multiCard);
                }
            }
            else if (multiCard.length >= 2) {
                this._multiHandList.push(multiCard);
                multiCard = [card];
            }
            else {
                multiCard = [card];
            }
            prevCard = card;
        }

        for (const multiCard of this._multiHandList) {
            cardList = cardList.filter(c => multiCard.indexOf(c) === -1);
        }
        
        return cardList;
    }

    _cardStairsDivision(cardList) {
        this._stairsHandList = [];
        if (cardList.length === 0) return cardList;
        let prevCard = cardList[0];
        let stairsCard = [prevCard];

        for (let i = 1; i < cardList.length; i++) {
            const card = cardList[i];
            if (prevCard.suit === card.suit && card.power - prevCard.power === 1) {
                stairsCard.push(card);
                if (i === cardList.length - 1 && stairsCard.length >= 3) {
                    this._stairsHandList.push(stairsCard);
                }
            }
            else if (stairsCard.length >= 3) {
                this._stairsHandList.push(stairsCard);
                stairsCard = [card];
            }
            else {
                stairsCard = [card];
            }
            prevCard = card;
        }

        for (const stairsCard of this._stairsHandList) {
            cardList = cardList.filter(c => stairsCard.indexOf(c) === -1);
        }
        
        return cardList;
    }

    _cardSingleDivision(cardList) {
        this._singleHandList = cardList.map(c => [c]);
        return cardList;
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
        if (this._singleHandList.length > 0) {
            return this._singleHandList[0];
        }
        else if (this._multiHandList.length > 0) {
            return this._multiHandList[0];
        }
        else if (this._stairsHandList.length > 0) {
            return this._stairsHandList[0];
        }
        throw new Error("該当なし");
    }

    get _handCount() {
        return this._singleHandList.length + this._multiHandList.length + this._stairsHandList.length;
    }

    onRevolution() {
        super.onRevolution();
        this._singleHandList = this._multiHandList = this._stairsHandList = [];
        this._cardDivision();
    }

    onGameFinish() {
        this._singleHandList = this._multiHandList = this._stairsHandList = [];
    }

    _shouldRevolution() {
        // 革命できる かつ 弱いカードが大半なら革命すべき

        const revolutionHandList = this._multiHandList.filter(h => h.length === 4);

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
