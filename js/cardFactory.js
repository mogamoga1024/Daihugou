
class CardFactory {
    static #cardList = [];
    
    static get allCardList() {
        return this.#cardList;
    }

    static #initCardList() {
        if (this.#cardList.length > 0) {
            this.#cardList.forEach(c => c.obj.isDead = false);
            return;
        }

        const imageFolderPath = "./assets/card";
        const suitList = [Suit.Spade, Suit.Club, Suit.Diamond, Suit.Heart];
        for (const suit of suitList) {
            const initial = suit.name[0];

            this.#cardList.push({name: `${initial}3`, obj: new Card(suit, "3",  `${initial}3`, 1,  `${imageFolderPath}/${suit.name}/card_${suit.name}_3.png`) });
            this.#cardList.push({name: `${initial}4`, obj: new Card(suit, "4",  `${initial}4`, 2,  `${imageFolderPath}/${suit.name}/card_${suit.name}_4.png`) });
            this.#cardList.push({name: `${initial}5`, obj: new Card(suit, "5",  `${initial}5`, 3,  `${imageFolderPath}/${suit.name}/card_${suit.name}_5.png`) });
            this.#cardList.push({name: `${initial}6`, obj: new Card(suit, "6",  `${initial}6`, 4,  `${imageFolderPath}/${suit.name}/card_${suit.name}_6.png`) });
            this.#cardList.push({name: `${initial}7`, obj: new Card(suit, "7",  `${initial}7`, 5,  `${imageFolderPath}/${suit.name}/card_${suit.name}_7.png`) });
            this.#cardList.push({name: `${initial}8`, obj: new Card(suit, "8",  `${initial}8`, 6,  `${imageFolderPath}/${suit.name}/card_${suit.name}_8.png`) });
            this.#cardList.push({name: `${initial}9`, obj: new Card(suit, "9",  `${initial}9`, 7,  `${imageFolderPath}/${suit.name}/card_${suit.name}_9.png`) });
            this.#cardList.push({name: `${initial}T`, obj: new Card(suit, "T",  `${initial}T`, 8,  `${imageFolderPath}/${suit.name}/card_${suit.name}_10.png`)});
            this.#cardList.push({name: `${initial}J`, obj: new Card(suit, "J",  `${initial}J`, 9,  `${imageFolderPath}/${suit.name}/card_${suit.name}_11.png`)});
            this.#cardList.push({name: `${initial}Q`, obj: new Card(suit, "Q",  `${initial}Q`, 10, `${imageFolderPath}/${suit.name}/card_${suit.name}_12.png`)});
            this.#cardList.push({name: `${initial}K`, obj: new Card(suit, "K",  `${initial}K`, 11, `${imageFolderPath}/${suit.name}/card_${suit.name}_13.png`)});
            this.#cardList.push({name: `${initial}1`, obj: new Card(suit, "1",  `${initial}1`, 12, `${imageFolderPath}/${suit.name}/card_${suit.name}_1.png`) });
            this.#cardList.push({name: `${initial}2`, obj: new Card(suit, "2",  `${initial}2`, 13, `${imageFolderPath}/${suit.name}/card_${suit.name}_2.png`) });
        }
        this.#cardList.push({name: "Joker1", obj: new Joker("Joker1",  99,  `${imageFolderPath}/card_joker.png`)});
        this.#cardList.push({name: "Joker2", obj: new Joker("Joker2",  99,  `${imageFolderPath}/card_joker.png`)});
    }

    static createAllCardList(needInit = true) {
        if (needInit) {
            this.#initCardList();
        }
        return this.#cardList.map(c => c.obj);
    }

    /**
     * name: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2
     * @param {string} name 
     * @returns 
     */
    static createCard(name, needInit = true) {
        if (needInit) {
            this.#initCardList();
        }
        const cardList = this.#cardList.filter(c => c.name === name).map(c => c.obj);
        if (cardList.length === 0) {
            throw new Error(`${name}のカードが存在しない`);
        }
        return cardList[0];
    }

    static createCardList(strNameList, needInit = true) {
        const nameList = strNameList.split(",").map(name => name.trim());
        const cardList = nameList.map(name => this.createCard(name, needInit));
        return Common.sortCardList(cardList);
    }

    static getCard(name) {
        return this.createCard(name, false);
    }

    static getAllCardList() {
        return this.createAllCardList(false);
    }
}
