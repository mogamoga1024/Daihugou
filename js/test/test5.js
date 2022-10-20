
(function() {
    let stairsThinking = null;
    const ruleConfig = new RuleConfig(false);
    
    CardFactory.initCardList(ruleConfig);
    const twoPower = CardFactory.getCard("s2").power;
    
    module("CPUのAIのテスト5（StairsThinkingクラス）", {
        setup() {
            stairsThinking = null;
            CardFactory.initCardList(ruleConfig);
        }
    });

    // memo: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2

    test("思考 応手 stairs 役なし", function() {
        const s345 = CardFactory.getCardList("s3, s4, s5");
        stairsThinking = new StairsThinking([]);

        strictEqual(Common.cardListToString(
            stairsThinking.outputHandIfHandInBattleField(s345, 8, twoPower)), ""
        );
    });

    test("思考 応手 stairs 役なし", function() {
        const s567 = CardFactory.getCardList("s5, s6, s7");
        const sQK1 = CardFactory.getCardList("sQ, sK, s1");
        stairsThinking = new StairsThinking([s567]);

        strictEqual(Common.cardListToString(
            stairsThinking.outputHandIfHandInBattleField(sQK1, 8, twoPower)), ""
        );
    });

    test("思考 応手 stairs 残り1役", function() {
        const d345 = CardFactory.getCardList("d3, d4, d5");
        const s567 = CardFactory.getCardList("s5, s6, s7");
        stairsThinking = new StairsThinking([s567]);

        strictEqual(Common.cardListToString(
            stairsThinking.outputHandIfHandInBattleField(d345, 1, twoPower)), "s5, s6, s7"
        );
    });

    test("思考 応手 stairs 残り2役 最強あり", function() {
        const d345 = CardFactory.getCardList("d3, d4, d5");
        const sK12 = CardFactory.getCardList("sK, s1, s2");
        stairsThinking = new StairsThinking([sK12]);

        strictEqual(Common.cardListToString(
            stairsThinking.outputHandIfHandInBattleField(d345, 2, twoPower)), "sK, s1, s2"
        );
    });

    test("思考 応手 stairs 残り2役 最強あり", function() {
        const d345 = CardFactory.getCardList("d3, d4, d5");
        const s567 = CardFactory.getCardList("s5, s6, s7");
        const sK12 = CardFactory.getCardList("sK, s1, s2");
        stairsThinking = new StairsThinking([s567, sK12]);

        strictEqual(Common.cardListToString(
            stairsThinking.outputHandIfHandInBattleField(d345, 2, twoPower)), "sK, s1, s2"
        );
    });

    test("思考 応手 stairs 残り2役 疑似最強あり", function() {
        const d345 = CardFactory.getCardList("d3, d4, d5");
        const sQK1 = CardFactory.getCardList("sQ, sK, s1");
        stairsThinking = new StairsThinking([sQK1]);

        strictEqual(Common.cardListToString(
            stairsThinking.outputHandIfHandInBattleField(d345, 2, twoPower)), "sQ, sK, s1"
        );
    });

    test("思考 応手 stairs 残り2役 疑似最強あり", function() {
        const d345 = CardFactory.getCardList("d3, d4, d5");
        const s567 = CardFactory.getCardList("s5, s6, s7");
        const sQK1 = CardFactory.getCardList("sQ, sK, s1");
        stairsThinking = new StairsThinking([s567, sQK1]);

        strictEqual(Common.cardListToString(
            stairsThinking.outputHandIfHandInBattleField(d345, 2, twoPower)), "sQ, sK, s1"
        );
    });

    test("思考 応手 stairs 残り2役 最強なし", function() {
        const d345 = CardFactory.getCardList("d3, d4, d5");
        const s567 = CardFactory.getCardList("s5, s6, s7");
        const sJQK = CardFactory.getCardList("sJ, sQ, sK");
        stairsThinking = new StairsThinking([s567, sJQK]);

        strictEqual(Common.cardListToString(
            stairsThinking.outputHandIfHandInBattleField(d345, 2, twoPower)), "s5, s6, s7"
        );
    });

    test("思考 応手 stairs 残り3役", function() {
        const d345 = CardFactory.getCardList("d3, d4, d5");
        const s567 = CardFactory.getCardList("s5, s6, s7");
        const s9TJ = CardFactory.getCardList("s9, sT, sJ");
        const sK12 = CardFactory.getCardList("sK, s1, s2");
        stairsThinking = new StairsThinking([s567, s9TJ, sK12]);

        strictEqual(Common.cardListToString(
            stairsThinking.outputHandIfHandInBattleField(d345, 3, twoPower)), "s5, s6, s7"
        );
    });

    test("思考 応手 stairs 残り3役", function() {
        const d567 = CardFactory.getCardList("d5, d6, d7");
        const s567 = CardFactory.getCardList("s5, s6, s7");
        const s9TJ = CardFactory.getCardList("s9, sT, sJ");
        const sK12 = CardFactory.getCardList("sK, s1, s2");
        stairsThinking = new StairsThinking([s567, s9TJ, sK12]);

        strictEqual(Common.cardListToString(
            stairsThinking.outputHandIfHandInBattleField(d567, 3, twoPower)), "s9, sT, sJ"
        );
    });

    test("思考 応手 stairs 残り3役", function() {
        const d1h1 = CardFactory.getCardList("d1, h1");
        const s567 = CardFactory.getCardList("s5, s6, s7");
        const s9TJ = CardFactory.getCardList("s9, sT, sJ");
        const sK12 = CardFactory.getCardList("sK, s1, s2");
        stairsThinking = new StairsThinking([s567, s9TJ, sK12]);

        strictEqual(Common.cardListToString(
            stairsThinking.outputHandIfHandInBattleField(d1h1, 3, twoPower)), ""
        );
    });

    test("思考 応手 stairs 残り3役", function() {
        const d1h1 = CardFactory.getCardList("d1, h1");
        const sK12 = CardFactory.getCardList("sK, s1, s2");
        stairsThinking = new StairsThinking([sK12]);

        strictEqual(Common.cardListToString(
            stairsThinking.outputHandIfHandInBattleField(d1h1, 3, twoPower)), ""
        );
    });
})();
