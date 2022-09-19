
(function() {
    let singleThinking = null;
    
    CardFactory.initCardList();
    const twoPower = CardFactory.getCard("s2").power;
    
    module("CPUのAIのテスト3（SingleThinkingクラス）", {
        setup() {
            singleThinking = null;
            CardFactory.initCardList();
        }
    });

    // memo: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2

    test("思考 応手 single 役なし", function() {
        const s3 = CardFactory.getCard("s3");
        singleThinking = new SingleThinking([]);

        strictEqual(Common.cardListToString(
            singleThinking.outputHandIfHandInBattleField([s3], 8, twoPower)), ""
        );
    });

    test("思考 応手 single 役なし", function() {
        const s7 = CardFactory.getCard("s7");
        const s1 = CardFactory.getCard("s1");
        singleThinking = new SingleThinking([[s7]]);

        strictEqual(Common.cardListToString(
            singleThinking.outputHandIfHandInBattleField([s1], 8, twoPower)), ""
        );
    });

    test("思考 応手 single 残り1役", function() {
        const d3 = CardFactory.getCard("d3");
        const s7 = CardFactory.getCard("s7");
        singleThinking = new SingleThinking([[s7]]);

        strictEqual(Common.cardListToString(
            singleThinking.outputHandIfHandInBattleField([d3], 1, twoPower)), "s7"
        );
    });

    test("思考 応手 single 残り2役 最強あり", function() {
        const d3 = CardFactory.getCard("d3");
        const s7 = CardFactory.getCard("s7");
        const s2 = CardFactory.getCard("s2");
        singleThinking = new SingleThinking([[s7], [s2]]);

        strictEqual(Common.cardListToString(
            singleThinking.outputHandIfHandInBattleField([d3], 2, twoPower)), "s2"
        );
    });

    test("思考 応手 single 残り2役 最強なし", function() {
        const d3 = CardFactory.getCard("d3");
        const s7 = CardFactory.getCard("s7");
        const s1 = CardFactory.getCard("s1");
        singleThinking = new SingleThinking([[s7], [s1]]);

        strictEqual(Common.cardListToString(
            singleThinking.outputHandIfHandInBattleField([d3], 2, twoPower)), "s7"
        );
    });

    test("思考 応手 single 残り3役", function() {
        const d3 = CardFactory.getCard("d3");
        const s7 = CardFactory.getCard("s7");
        const s9 = CardFactory.getCard("s9");
        const s2 = CardFactory.getCard("s2");
        singleThinking = new SingleThinking([[s7], [s9], [s2]]);

        strictEqual(Common.cardListToString(
            singleThinking.outputHandIfHandInBattleField([d3], 3, twoPower)), "s7"
        );
    });

    test("思考 応手 single 残り3役", function() {
        const d7 = CardFactory.getCard("d7");
        const s7 = CardFactory.getCard("s7");
        const s9 = CardFactory.getCard("s9");
        const s2 = CardFactory.getCard("s2");
        singleThinking = new SingleThinking([[s7], [s9], [s2]]);

        strictEqual(Common.cardListToString(
            singleThinking.outputHandIfHandInBattleField([d7], 3, twoPower)), "s9"
        );
    });

    test("思考 応手 single 残り3役", function() {
        const d1 = CardFactory.getCard("d1");
        const s7 = CardFactory.getCard("s7");
        const s9 = CardFactory.getCard("s9");
        const s2 = CardFactory.getCard("s2");
        singleThinking = new SingleThinking([[s7], [s9], [s2]]);

        strictEqual(Common.cardListToString(
            singleThinking.outputHandIfHandInBattleField([d1], 3, twoPower)), ""
        );
    });

    test("思考 応手 single 残り3役", function() {
        const d1 = CardFactory.getCard("d1");
        const s2 = CardFactory.getCard("s2");
        singleThinking = new SingleThinking([[s2]]);

        strictEqual(Common.cardListToString(
            singleThinking.outputHandIfHandInBattleField([d1], 3, twoPower)), ""
        );
    });
})();
