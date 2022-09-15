
class Cpu extends Player {
    _singleCardList = [];
    _multiCardList = [];
    _stairsCardList = [];

    exchangeCardList() {
        // TODO
        return [];
    }

    outputCardList(battleFieldCardList) {
        // TODO

        if (
            this._singleCardList.length === 0 &&
            this._multiCardList.length === 0 &&
            this._stairsCardList.length === 0
        ) {
            this._cardDivision();
        }

        // 仮

        let selectedCardList = [];
        if (this.cardList.length === 0) return [];

        if (battleFieldCardList.length === 0) {
            // TODO 親のとき
            selectedCardList = [this.cardList[0]];
        }
        else {
            const bfHand = Hand.cardListToHand(battleFieldCardList);

            let targetCard = null;
            switch (bfHand) {
                case Hand.Single:
                    if (this._singleCardList.length === 0) {
                        return [];
                    }

                    if (
                        this._handCount === 2 &&
                        this._singleCardList[this._singleCardList.length - 1].power === this._strongestCardPower
                    ) {
                        targetCard = this._singleCardList[this._singleCardList.length - 1];
                    }
                    else {
                        targetCard = this._singleCardList[0];
                    }

                    this._singleCardList = this._singleCardList.filter(c => c !== targetCard);
                    return [targetCard];

                case Hand.Multi:
                    if (this._multiCardList.length === 0) {
                        return [];
                    }

                    const tmpMultiCardList = this._multiCardList.filter(c => c.length === battleFieldCardList.length);

                    if (
                        this._handCount === 2 &&
                        tmpMultiCardList[tmpMultiCardList.length - 1][0].power === this._strongestCardPower
                    ) {
                        targetCard = tmpMultiCardList[tmpMultiCardList.length - 1];
                    }
                    else {
                        targetCard = tmpMultiCardList[0];
                    }

                    this._multiCardList = this._multiCardList.filter(c => c !== targetCard);
                    return targetCard;

                case Hand.Stairs:
                    break;
            
                default:
                    throw new Error("存在しない役");
            }
        }

        // 手札の更新
        if (selectedCardList.length > 0) {
            this.cardList = this.cardList.filter(c => selectedCardList.indexOf(c) === -1);
            if (this.cardList.length === 0) {
                this._singleCardList = this._multiCardList = this._stairsCardList = [];
            }
        }

        return selectedCardList;
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
        this._multiCardList = [];
        if (cardList.length === 0) return cardList;
        let prevCard = cardList[0];
        let multiCard = [prevCard];

        for (let i = 1; i < cardList.length; i++) {
            const card = cardList[i];
            if (prevCard.power === card.power) {
                multiCard.push(card);
                if (i === cardList.length - 1) {
                    this._multiCardList.push(multiCard);
                }
            }
            else if (multiCard.length >= 2) {
                this._multiCardList.push(multiCard);
                multiCard = [card];
            }
            else {
                multiCard = [card];
            }
            prevCard = card;
        }

        for (const multiCard of this._multiCardList) {
            cardList = cardList.filter(c => multiCard.indexOf(c) === -1);
        }
        
        return cardList;
    }

    _cardStairsDivision(cardList) {
        this._stairsCardList = [];
        if (cardList.length === 0) return cardList;
        let prevCard = cardList[0];
        let stairsCard = [prevCard];

        for (let i = 1; i < cardList.length; i++) {
            const card = cardList[i];
            if (prevCard.suit === card.suit && card.power - prevCard.power === 1) {
                stairsCard.push(card);
                if (i === cardList.length - 1 && stairsCard.length >= 3) {
                    this._stairsCardList.push(stairsCard);
                }
            }
            else if (stairsCard.length >= 3) {
                this._stairsCardList.push(stairsCard);
                stairsCard = [card];
            }
            else {
                stairsCard = [card];
            }
            prevCard = card;
        }

        for (const stairsCard of this._stairsCardList) {
            cardList = cardList.filter(c => stairsCard.indexOf(c) === -1);
        }
        
        return cardList;
    }

    _cardSingleDivision(cardList) {
        this._singleCardList = cardList;
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
        if (this._singleCardList.length > 0) {
            return this._singleCardList[0];
        }
        else if (this._multiCardList.length > 0) {
            return this._multiCardList[0];
        }
        else if (this._stairsCardList.length > 0) {
            return this._stairsCardList[0];
        }
        throw new Error("該当なし");
    }

    get _handCount() {
        return this._singleCardList.length + this._multiCardList.length + this._stairsCardList.length;
    }
}
