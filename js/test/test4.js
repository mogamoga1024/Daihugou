
(function() {
    let cpu = null;
    let multiThinking = null;
    
    CardFactory.initCardList();
    const twoPower = CardFactory.getCard("s2").power;
    
    module("CPUのAIのテスト4（MultiThinkingクラス）", {
        setup() {
            cpu = new Cpu("CPU1");
            multiThinking = null;
            CardFactory.initCardList();
        }
    });

    // memo: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2

    test("思考 応手 multi 役なし", function() {
        const s3c3 = CardFactory.getCardList("s3, c3");
        multiThinking = new SingleThinking([]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField(s3c3, 8, twoPower)), ""
        );
    });

    test("思考 応手 multi 役なし", function() { // 以下TODO
        const s7 = CardFactory.getCard("s7");
        const s1 = CardFactory.getCard("s1");
        multiThinking = new SingleThinking([[s7]]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField([s1], 8, twoPower)), ""
        );
    });

    test("思考 応手 multi 残り1役", function() {
        const d3 = CardFactory.getCard("d3");
        const s7 = CardFactory.getCard("s7");
        multiThinking = new SingleThinking([[s7]]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField([d3], 1, twoPower)), "s7"
        );
    });

    test("思考 応手 multi 残り2役 最強あり", function() {
        const d3 = CardFactory.getCard("d3");
        const s7 = CardFactory.getCard("s7");
        const s2 = CardFactory.getCard("s2");
        multiThinking = new SingleThinking([[s7], [s2]]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField([d3], 2, twoPower)), "s2"
        );
    });

    test("思考 応手 multi 残り2役 最強なし", function() {
        const d3 = CardFactory.getCard("d3");
        const s7 = CardFactory.getCard("s7");
        const s1 = CardFactory.getCard("s1");
        multiThinking = new SingleThinking([[s7], [s1]]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField([d3], 2, twoPower)), "s7"
        );
    });

    test("思考 応手 multi 残り3役", function() {
        const d3 = CardFactory.getCard("d3");
        const s7 = CardFactory.getCard("s7");
        const s9 = CardFactory.getCard("s9");
        const s2 = CardFactory.getCard("s2");
        multiThinking = new SingleThinking([[s7], [s9], [s2]]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField([d3], 3, twoPower)), "s7"
        );
    });

    test("思考 応手 multi 残り3役", function() {
        const d7 = CardFactory.getCard("d7");
        const s7 = CardFactory.getCard("s7");
        const s9 = CardFactory.getCard("s9");
        const s2 = CardFactory.getCard("s2");
        multiThinking = new SingleThinking([[s7], [s9], [s2]]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField([d7], 3, twoPower)), "s9"
        );
    });

    test("思考 応手 multi 残り3役", function() {
        const d1 = CardFactory.getCard("d1");
        const s7 = CardFactory.getCard("s7");
        const s9 = CardFactory.getCard("s9");
        const s2 = CardFactory.getCard("s2");
        multiThinking = new SingleThinking([[s7], [s9], [s2]]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField([d1], 3, twoPower)), ""
        );
    });

    test("思考 応手 multi 残り3役", function() {
        const d1 = CardFactory.getCard("d1");
        const s2 = CardFactory.getCard("s2");
        multiThinking = new SingleThinking([[s2]]);

        strictEqual(Common.cardListToString(
            multiThinking.outputHandIfHandInBattleField([d1], 3, twoPower)), ""
        );
    });
})();
