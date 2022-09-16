(function() {
    let cpu = null;

    module("CPUのAIのテスト2", {
        setup() {
            cpu = new Cpu("CPU1");
        }
    });

    // memo: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2

    test("思考", function() {
        cpu.cardList = CardFactory.createCardList("s3, d8, Joker1");

        strictEqual(Common.cardListToString(cpu.outputHand([])), "d8");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "Joker1");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s3");
    });
})();
