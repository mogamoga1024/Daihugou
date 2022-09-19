
(function() {
    let multiThinking = null;
    
    CardFactory.initCardList();
    const twoPower = CardFactory.getCard("s2").power;
    
    module("CPUのAIのテスト4（MultiThinkingクラス）", {
        setup() {
            multiThinking = null;
            CardFactory.initCardList();
        }
    });

    // memo: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2

    test("思考 応手 multi 役なし", function() {
        const s3c3 = CardFactory.getCardList("s3, c3");
        multiThinking = new MultiThinking([]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField(s3c3, 8, twoPower)), ""
        );
    });

    test("思考 応手 multi 役なし", function() {
        const s7c7 = CardFactory.getCardList("s7, c7");
        const s1c1 = CardFactory.getCardList("s1, c1");
        multiThinking = new MultiThinking([s7c7]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField(s1c1, 8, twoPower)), ""
        );
    });

    test("思考 応手 multi 残り1役", function() {
        const d3h3 = CardFactory.getCardList("d3, h3");
        const s7c7 = CardFactory.getCardList("s7, c7");
        multiThinking = new MultiThinking([s7c7]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField(d3h3, 1, twoPower)), "s7, c7"
        );
    });

    test("思考 応手 multi 残り2役 最強あり", function() {
        const d3h3 = CardFactory.getCardList("d3, h3");
        const s7c7 = CardFactory.getCardList("s7, c7");
        const s2c2 = CardFactory.getCardList("s2, c2");
        multiThinking = new MultiThinking([s7c7, s2c2]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField(d3h3, 2, twoPower)), "s2, c2"
        );
    });

    test("思考 応手 multi 残り2役 最強なし", function() {
        const d3h3 = CardFactory.getCardList("d3, h3");
        const s7c7 = CardFactory.getCardList("s7, c7");
        const s1c1 = CardFactory.getCardList("s1, c1");
        multiThinking = new MultiThinking([s7c7, s1c1]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField(d3h3, 2, twoPower)), "s7, c7"
        );
    });

    test("思考 応手 multi 残り3役", function() {
        const d3h3 = CardFactory.getCardList("d3, h3");
        const s7c7 = CardFactory.getCardList("s7, c7");
        const s9c9 = CardFactory.getCardList("s9, c9");
        const s2c2 = CardFactory.getCardList("s2, c2");
        multiThinking = new MultiThinking([s7c7, s9c9, s2c2]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField(d3h3, 3, twoPower)), "s7, c7"
        );
    });

    test("思考 応手 multi 残り3役", function() {
        const d7h7 = CardFactory.getCardList("d7, h7");
        const s7c7 = CardFactory.getCardList("s7, c7");
        const s9c9 = CardFactory.getCardList("s9, c9");
        const s2c2 = CardFactory.getCardList("s2, c2");
        multiThinking = new MultiThinking([s7c7, s9c9, s2c2]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField(d7h7, 3, twoPower)), "s9, c9"
        );
    });

    test("思考 応手 multi 残り3役", function() {
        const d1h1 = CardFactory.getCardList("d1, h1");
        const s7c7 = CardFactory.getCardList("s7, c7");
        const s9c9 = CardFactory.getCardList("s9, c9");
        const s2c2 = CardFactory.getCardList("s2, c2");
        multiThinking = new MultiThinking([s7c7, s9c9, s2c2]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField(d1h1, 3, twoPower)), ""
        );
    });

    test("思考 応手 multi 残り3役", function() {
        const d1h1 = CardFactory.getCardList("d1, h1");
        const s2c2 = CardFactory.getCardList("s2, c2");
        multiThinking = new MultiThinking([s2c2]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField(d1h1, 3, twoPower)), ""
        );
    });
})();
