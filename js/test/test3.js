
(function() {
    let cpu = null;
    let singleThinking = null;
    let multiThinking = null;
    let stairsThinking = null;
    
    CardFactory.initCardList();
    const twoPower = CardFactory.getCard("s2").power;
    
    module("CPUのAIのテスト3（Thinkingクラス系）", {
        setup() {
            cpu = new Cpu("CPU1");
            singleThinking = null;
            multiThinking = null;
            stairsThinking = null;
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
        singleThinking = new SingleThinking([s7]);

        strictEqual(Common.cardListToString(
            singleThinking.outputHandIfHandInBattleField([s1], 8, twoPower)), ""
        );
    });

    test("思考 応手 single 残り1役", function() {
        const d3 = CardFactory.getCard("d3");
        const s7 = CardFactory.getCard("s7");
        singleThinking = new SingleThinking([s7]);

        strictEqual(Common.cardListToString(
            singleThinking.outputHandIfHandInBattleField([d3], 1, twoPower)), "s7"
        );
    });

    test("思考 応手 single 残り2役 最強あり", function() {
        const d3 = CardFactory.getCard("d3");
        const s7 = CardFactory.getCard("s7");
        const s2 = CardFactory.getCard("s2");
        singleThinking = new SingleThinking([s7, s2]);

        CardFactory.getCard("Joker1").isDead = true;
        CardFactory.getCard("Joker2").isDead = true;

        strictEqual(Common.cardListToString(
            singleThinking.outputHandIfHandInBattleField([d3], 2, twoPower)), ""
        );
    });




})();
