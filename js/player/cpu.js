
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
            // TODO
            selectedCardList = [this.cardList[0]];
        }
        else {
            const bfHand = Hand.cardListToHand(battleFieldCardList);

            switch (bfHand) {
                case Hand.Single:
                    // TODO とりあえず強いカード
                    for (const card of this.cardList) {
                        if (battleFieldCardList[0].power < card.power) {
                            selectedCardList = [card];
                            break;
                        }
                    }
                    break;
                case Hand.Multi:
                    break;
                case Hand.Stairs:
                    break;
            
                default:
                    throw new Error("存在しない役");
            }
        }

        // 手札の更新
        if (selectedCardList.length > 0) {
            this.cardList = this.cardList.filter(c => selectedCardList.indexOf(c) === -1);
        }

        return selectedCardList;
    }

    _cardDivision() {
        // とりあえず multi → stairs → single の順で分割する。
        // 本当は組数が最小になるように分割したいが…

        // TODO 一旦、Jokerは考慮しない

        const tmpCardList = this.cardList;

        // multi
        this._multiCardList = [];
        let prevCard = tmpCardList[0];
        let tmpMultiCardList = [prevCard];

        for (let i = 1; i < tmpCardList.length; i++) {
            const card = tmpCardList[i];
            if (prevCard.power === card.power) {
                tmpMultiCardList.push(card);
                if (i === tmpCardList.length - 1) {
                    this._multiCardList.push(tmpMultiCardList);
                }
            }
            else if (tmpMultiCardList.length >= 2) {
                this._multiCardList.push(tmpMultiCardList);
                tmpMultiCardList = [card];
            }
            prevCard = card;
        }

        // for (const card of tmpCardList) {
            
        // }

    }
}
