
const Rank = {
    Daihugou: "大富豪",
    Hugou: "富豪",
    Heimin: "平民",
    Hinmin: "貧民",
    Daihinmin: "大貧民",
    getRank: function(ranking) {
        // プレイヤーが四人であることを決め打ちしてランクを返す。
        switch (ranking) {
            case 1: return this.Daihugou;
            case 2: return this.Hugou;
            case 3: return this.Hinmin;
            case 4: return this.Daihinmin;
            default: throw new Error("引数が不正");
        }
    }
};
