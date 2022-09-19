
(function() {
    let cpu = null;
    let singleThinking = null;
    let multiThinking = null;
    let stairsThinking = null;

    module("CPUのAIのテスト3（Thinkingクラス系）", {
        setup() {
            cpu = new Cpu("CPU1");
            singleThinking = null;
            multiThinking = null;
            stairsThinking = null;
        }
    });

    // memo: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2

    test("思考 応手 single 役なし", function() {
        const s3 = CardFactory.createCard("s3");
        singleThinking = new SingleThinking([]);

        strictEqual(Common.cardListToString(singleThinking.outputHandIfHandInBattleField([s3])), "");
    });

    test("思考 応手 single 役なし", function() {
        const s7 = CardFactory.createCard("s7");
        const s1 = CardFactory.createCard("s1");
        singleThinking = new SingleThinking([s7]);

        strictEqual(Common.cardListToString(singleThinking.outputHandIfHandInBattleField([s1])), "");
    });

    // test("思考 応手 single 残り2役 最強あり", function() {
    //     singleThinking = new SingleThinking(["s4"]);

    //     strictEqual(Common.cardListToString(singleThinking.outputHandIfHandInBattleField(["s3"])), "");
    // });




})();
