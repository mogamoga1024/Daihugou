
class CardFactory {
    static #isInitialized = false;
    static #cardList = [];
    
    static get allCardList() {
        return this.#cardList;
    }

    static initCardList(ruleConfig = RuleConfig.default) {
        this.#isInitialized = true;
        this.#cardList = [];

        const imageFolderPath = "./assets/card";
        const suitList = [Suit.Spade, Suit.Club, Suit.Diamond, Suit.Heart];
        for (const suit of suitList) {
            const initial = suit.name[0];

            this.#cardList.push({name: `${initial}3`, obj: new Card(suit, "3",  `${initial}3`, -6,  `${imageFolderPath}/${suit.name}/card_${suit.name}_3.png`) });
            this.#cardList.push({name: `${initial}4`, obj: new Card(suit, "4",  `${initial}4`, -5,  `${imageFolderPath}/${suit.name}/card_${suit.name}_4.png`) });
            this.#cardList.push({name: `${initial}5`, obj: new Card(suit, "5",  `${initial}5`, -4,  `${imageFolderPath}/${suit.name}/card_${suit.name}_5.png`) });
            this.#cardList.push({name: `${initial}6`, obj: new Card(suit, "6",  `${initial}6`, -3,  `${imageFolderPath}/${suit.name}/card_${suit.name}_6.png`) });
            this.#cardList.push({name: `${initial}7`, obj: new Card(suit, "7",  `${initial}7`, -2,  `${imageFolderPath}/${suit.name}/card_${suit.name}_7.png`) });
            this.#cardList.push({name: `${initial}8`, obj: new Card(suit, "8",  `${initial}8`, -1,  `${imageFolderPath}/${suit.name}/card_${suit.name}_8.png`) });
            this.#cardList.push({name: `${initial}9`, obj: new Card(suit, "9",  `${initial}9`, 0,   `${imageFolderPath}/${suit.name}/card_${suit.name}_9.png`) });
            this.#cardList.push({name: `${initial}T`, obj: new Card(suit, "T",  `${initial}T`, 1,   `${imageFolderPath}/${suit.name}/card_${suit.name}_10.png`)});
            this.#cardList.push({name: `${initial}J`, obj: new Card(suit, "J",  `${initial}J`, 2,   `${imageFolderPath}/${suit.name}/card_${suit.name}_11.png`)});
            this.#cardList.push({name: `${initial}Q`, obj: new Card(suit, "Q",  `${initial}Q`, 3,   `${imageFolderPath}/${suit.name}/card_${suit.name}_12.png`)});
            this.#cardList.push({name: `${initial}K`, obj: new Card(suit, "K",  `${initial}K`, 4,   `${imageFolderPath}/${suit.name}/card_${suit.name}_13.png`)});
            this.#cardList.push({name: `${initial}1`, obj: new Card(suit, "1",  `${initial}1`, 5,   `${imageFolderPath}/${suit.name}/card_${suit.name}_1.png`) });
            this.#cardList.push({name: `${initial}2`, obj: new Card(suit, "2",  `${initial}2`, 6,   `${imageFolderPath}/${suit.name}/card_${suit.name}_2.png`) });
        }
        if (ruleConfig.useJoker) {
            this.#cardList.push({name: "Joker1", obj: new Joker("Joker1",  99,  `${imageFolderPath}/card_joker.png`)});
            this.#cardList.push({name: "Joker2", obj: new Joker("Joker2",  99,  `${imageFolderPath}/card_joker.png`)});   
        }
    }

    static createAllCardList() {
        if (this.#isInitialized === false) {
            throw new Error("CardFactory#initCardListでの初期化処理が必要");
        }
        return this.#cardList.map(c => c.obj);
    }

    /**
     * name: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2
     * @param {string} name 
     * @returns 
     */
    static createCard(name) {
        if (this.#isInitialized === false) {
            throw new Error("CardFactory#initCardListでの初期化処理が必要");
        }
        const cardList = this.#cardList.filter(c => c.name === name).map(c => c.obj);
        if (cardList.length === 0) {
            throw new Error(`${name}のカードが存在しない`);
        }
        return cardList[0];
    }

    static createCardList(strNameList) {
        if (this.#isInitialized === false) {
            throw new Error("CardFactory#initCardListでの初期化処理が必要");
        }
        const nameList = strNameList.split(",").map(name => name.trim());
        const cardList = nameList.map(name => this.createCard(name));
        return Common.sortCardList(cardList);
    }

    static getWeakestCardPower() {
        let weakestCard = null;
        for (const card of this.allCardList) {
            if (card.obj.isDead) {
                continue;
            }
            if (weakestCard === null) {
                weakestCard = card.obj;
                continue;
            }
            if (weakestCard.power > card.obj.power) {
                weakestCard = card.obj;
            }
        }
        if (weakestCard === null) {
            throw new Error("すでにゲームが終わっている");
        }
        return weakestCard.power;
    }

    static getStrongestCardPower() {
        let strongestCard = null;
        for (const card of this.allCardList) {
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

    static getCenterCardPower() {
        return this.createCard("s9").power;
    }
}
