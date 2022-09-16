
class Cpu extends Player {
    _singleHandList = [];
    _multiHandList = [];
    _stairsHandList = [];

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
                    this._singleHandList.last().power === strongestCardPower
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
            // → 最後に出す役、最強の役以外で最弱の役をだす
            //   ただし、最強の役を持っていない場合は最後に出す予定のカードはさっさと切っていい
            else {
                const tmpSingleCardList = this._singleHandList.filter(h => h !== maybeLastOutputHand && h[0].power !== strongestCardPower);
                const tmpMultiCardList = this._multiHandList.filter(h => h !== maybeLastOutputHand && h[0].power !== strongestCardPower);
                const tmpStairsCardList = this._stairsHandList.filter(h => h !== maybeLastOutputHand && h.last().power !== strongestCardPower);

                if (
                    this._singleHandList.length > 0 && this._singleHandList.last()[0].power === strongestCardPower ||
                    this._multiHandList.length > 0 && this._multiHandList.last()[0].power === strongestCardPower ||
                    this._stairsHandList.length > 0 && this._stairsHandList.last().last().power === strongestCardPower
                ) {
                    if (tmpSingleCardList.length > 0) {
                        selectedHand = tmpSingleCardList[0];
                    }
                    else if (tmpMultiCardList.length > 0) {
                        selectedHand = tmpMultiCardList[0];
                    }
                    else if (tmpStairsCardList.length > 0) {
                        selectedHand = tmpStairsCardList[0];
                    }
                }
                else {
                    selectedHand = maybeLastOutputHand;
                }
            }
        }
        else {
            const bfHandKind = Hand.handKindFrom(battleFieldHand);

            switch (bfHandKind) {
                case Hand.Single:
                    const tmpSingleCardList = this._singleHandList.filter(h =>
                        h[0].power > battleFieldHand[0].power
                    );
                    if (tmpSingleCardList.length === 0) {
                        return [];
                    }

                    if (
                        handCount === 2 &&
                        tmpSingleCardList.last()[0].power === strongestCardPower
                    ) {
                        selectedHand = tmpSingleCardList.last();
                    }
                    else {
                        selectedHand = tmpSingleCardList[0];
                    }
                    break;

                case Hand.Multi:
                    const tmpMultiCardList = this._multiHandList.filter(h =>
                        h.length === battleFieldHand.length &&
                        h[0].power > battleFieldHand[0].power
                    );
                    if (tmpMultiCardList.length === 0) {
                        return []; // TODO 考えもの
                    }

                    if (
                        handCount === 2 &&
                        tmpMultiCardList.last()[0].power === strongestCardPower
                    ) {
                        selectedHand = tmpMultiCardList.last();
                    }
                    else {
                        selectedHand = tmpMultiCardList[0];
                    }
                    break;

                case Hand.Stairs:
                    const tmpStairsCardList = this._stairsHandList.filter(h =>
                        h.length === battleFieldHand.length &&
                        h[0].power > battleFieldHand[0].power
                    );
                    if (tmpStairsCardList.length === 0) {
                        return []; // TODO 考えもの
                    }

                    if (
                        handCount === 2 &&
                        tmpStairsCardList.last().last().power === strongestCardPower
                    ) {
                        selectedHand = tmpStairsCardList.last();
                    }
                    else {
                        selectedHand = tmpStairsCardList[0];
                    }
                    break;

                default:
                    throw new Error("存在しない役");
            }
        }

        // 手札の更新
        if (selectedHand.length > 0) {
            this.cardList = this.cardList.filter(c => selectedHand.indexOf(c) === -1);
            if (this.cardList.length === 0) {
                this._singleHandList = this._multiHandList = this._stairsHandList = [];
            }
        }

        switch (Hand.handKindFrom(selectedHand)) {
            case Hand.Single: this._singleHandList = this._singleHandList.filter(h => h !== selectedHand); break;
            case Hand.Multi:  this._multiHandList  = this._multiHandList.filter(h => h !== selectedHand);  break;
            case Hand.Stairs: this._stairsHandList = this._stairsHandList.filter(h => h !== selectedHand); break;
            default: throw new Error("存在しない役");
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

        tmpCardList = this._cardSingleDivision(tmpCardList);

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
}
