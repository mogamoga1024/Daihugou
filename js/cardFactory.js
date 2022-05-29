
class CardFactory {
    static #cardList = [];
    
    static #initCardList() {
        if (this.#cardList.length > 0) return;

        const suitList = [
            {obj: Suit.Spade, name: "spade"},
            {obj: Suit.Club, name: "club"},
            {obj: Suit.Heart, name: "heart"},
            {obj: Suit.Diamond, name: "diamond"}
        ];
        const imageFolderPath = "./assets/card";
        for (const suit of suitList) {
            const initial = suit.name[0];

            this.#cardList.push({name: `${initial}3`, obj: new Card(suit.obj, "3",  `${initial}3`, 1,  `${imageFolderPath}/${suit.name}/card_${suit.name}_3.png`) });
            this.#cardList.push({name: `${initial}4`, obj: new Card(suit.obj, "4",  `${initial}4`, 2,  `${imageFolderPath}/${suit.name}/card_${suit.name}_4.png`) });
            this.#cardList.push({name: `${initial}5`, obj: new Card(suit.obj, "5",  `${initial}5`, 3,  `${imageFolderPath}/${suit.name}/card_${suit.name}_5.png`) });
            this.#cardList.push({name: `${initial}6`, obj: new Card(suit.obj, "6",  `${initial}6`, 4,  `${imageFolderPath}/${suit.name}/card_${suit.name}_6.png`) });
            this.#cardList.push({name: `${initial}7`, obj: new Card(suit.obj, "7",  `${initial}7`, 5,  `${imageFolderPath}/${suit.name}/card_${suit.name}_7.png`) });
            this.#cardList.push({name: `${initial}8`, obj: new Card(suit.obj, "8",  `${initial}8`, 6,  `${imageFolderPath}/${suit.name}/card_${suit.name}_8.png`) });
            this.#cardList.push({name: `${initial}9`, obj: new Card(suit.obj, "9",  `${initial}9`, 7,  `${imageFolderPath}/${suit.name}/card_${suit.name}_9.png`) });
            this.#cardList.push({name: `${initial}T`, obj: new Card(suit.obj, "T",  `${initial}T`, 8,  `${imageFolderPath}/${suit.name}/card_${suit.name}_10.png`)});
            this.#cardList.push({name: `${initial}1`, obj: new Card(suit.obj, "1",  `${initial}1`, 9,  `${imageFolderPath}/${suit.name}/card_${suit.name}_1.png`) });
            this.#cardList.push({name: `${initial}2`, obj: new Card(suit.obj, "2",  `${initial}2`, 10, `${imageFolderPath}/${suit.name}/card_${suit.name}_2.png`) });
            this.#cardList.push({name: `${initial}J`, obj: new Card(suit.obj, "J",  `${initial}J`, 11, `${imageFolderPath}/${suit.name}/card_${suit.name}_11.png`)});
            this.#cardList.push({name: `${initial}Q`, obj: new Card(suit.obj, "Q",  `${initial}Q`, 12, `${imageFolderPath}/${suit.name}/card_${suit.name}_12.png`)});
            this.#cardList.push({name: `${initial}K`, obj: new Card(suit.obj, "K",  `${initial}K`, 13, `${imageFolderPath}/${suit.name}/card_${suit.name}_13.png`)});
        }
        this.#cardList.push({name: "Joker1", obj: new Joker("Joker1",  99,  `${imageFolderPath}/card_joker.png`)});
        this.#cardList.push({name: "Joker2", obj: new Joker("Joker2",  99,  `${imageFolderPath}/card_joker.png`)});
    }

    static createCardList() {
        this.#initCardList();
        return this.#cardList.map(c => c.obj);
    }

    static createCard(name) {
        this.#initCardList();
        const cardList = this.#cardList.filter(c => c.name === name).map(c => c.obj);
        if (cardList.length === 0) {
            throw new Error(`${name}のカードが存在しない`);
        }
        return cardList[0];
    }
}
