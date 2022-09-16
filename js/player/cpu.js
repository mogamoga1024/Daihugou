
class Cpu extends Player {
    _singleHandList = [];
    _multiHandList = [];
    _stairsHandList = [];

    exchangeCardList() {
        // TODO
        return [];
    }

    outputCardList(battleFieldCardList) {
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
        const lastOutputCard = this._lastOutputCard;
        
        if (battleFieldCardList.length === 0) {
            if (handCount === 1 && this._singleHandList.length > 0) {
                selectedHand = this._singleHandList[0];
            }
            else if (handCount === 1 && this._multiHandList.length > 0) {
                selectedHand = this._multiHandList[0];
            }
            else if (handCount === 1 && this._stairsHandList.length > 0) {
                selectedHand = this._stairsHandList[0];
            }
            else if (
                handCount === 2 && this._singleHandList.length > 0 &&
                this._singleHandList.last().power === strongestCardPower
            ) {
                selectedHand = this._singleHandList.last();
            }
            else if (
                handCount === 2 && this._multiHandList.length > 0 &&
                this._multiHandList.last()[0].power === strongestCardPower
            ) {
                selectedHand = this._multiHandList.last();
            }
            else if (
                handCount === 2 && this._stairsHandList.length > 0 &&
                this._stairsHandList.last().last().power === strongestCardPower
            ) {
                selectedHand = this._stairsHandList.last();
            }
            else if (this._singleHandList.length >= 2 && this._singleHandList[0] === lastOutputCard) {
                selectedHand = this._singleHandList[1];
            }
            else if (this._multiHandList.length >= 2 && this._multiHandList[0] === lastOutputCard) {
                selectedHand = this._multiHandList[1];
            }
            else if (this._stairsHandList.length >= 2 && this._stairsHandList[0] === lastOutputCard) {
                selectedHand = this._stairsHandList[1];
            }
            else {
                // TODO
            }
        }
        else {
            const bfHandKind = Hand.cardListToHandKind(battleFieldCardList);

            switch (bfHandKind) {
                case Hand.Single:
                    const tmpSingleCardList = this._singleHandList.filter(c =>
                        c[0].power > battleFieldCardList[0].power
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
                    const tmpMultiCardList = this._multiHandList.filter(c =>
                        c.length === battleFieldCardList.length &&
                        c[0].power > battleFieldCardList[0].power
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
                    const tmpStairsCardList = this._stairsHandList.filter(c =>
                        c.length === battleFieldCardList.length &&
                        c[0].power > battleFieldCardList[0].power
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

        switch (Hand.cardListToHandKind(selectedHand)) {
            case Hand.Single: this._singleHandList = this._singleHandList.filter(c => c !== selectedHand); break;
            case Hand.Multi:  this._multiHandList = this._multiHandList.filter(c => c !== selectedHand);   break;
            case Hand.Stairs: this._stairsHandList = this._stairsHandList.filter(c => c !== selectedHand); break;
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

    get _lastOutputCard() {
        // 一番弱いカードを最後に出す
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
