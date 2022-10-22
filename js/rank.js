
class Rank {
    static Daihugou = new Rank("大富豪", 2);
    static Hugou = new Rank("富豪", 1);
    static Heimin = new Rank("平民", 0);
    static Hinmin = new Rank("貧民", 1);
    static Daihinmin = new Rank("大貧民", 2);

    name = "";
    exchangeCardCount = 0;

    constructor(name, exchangeCardCount) {
        this.name = name;
        this.exchangeCardCount = exchangeCardCount;
    }

    static getRank(ranking) {
        // プレイヤーが四人であることを決め打ちしてランクを返す。
        switch (ranking) {
            case 1: return this.Daihugou;
            case 2: return this.Hugou;
            case 3: return this.Hinmin;
            case 4: return this.Daihinmin;
            default: throw new Error("引数が不正");
        }
    }
}
