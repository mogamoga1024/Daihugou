
class Common {
    /**
     * @param {number} max 
     * @returns 0以上max未満のランダムな整数
     */
     static randomInt(max) {
        return crypto.getRandomValues(new Uint32Array(1))[0] % max;
    }

    static sortCardList(cardList) {
        return cardList.sort((a, b) => {
            if (a.power !== b.power) {
                return a.power - b.power;
            }
            return a.suit.power - b.suit.power;
        });
    }

    static sleep(time = 1000) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    static cardListToString(cardList) {
        return cardList.map(c => c.name).join(", ");
    }
}

const log = console.log;

Array.prototype.last = function() {
    if (this.length === 0) {
        throw new Error("要素が存在しない");
    }
    return this[this.length - 1];
};
