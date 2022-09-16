(function() {
    let cpu = null;

    module("CPUのAIのテスト2", {
        setup() {
            cpu = new Cpu("CPU1");
            GameManager.init([cpu], {isRevolution: false});
        }
    });

    // memo: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2

    // TODO Jokerは後々何でも変換できるようになるので、その時は修正する
    test("思考", function() {
        cpu.cardList = CardFactory.createCardList("s3, d8, Joker1");

        strictEqual(Common.cardListToString(cpu.outputHand([])), "d8");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "Joker1");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s3");
    });

    test("思考 single", function() {
        cpu.cardList = CardFactory.createCardList("s3, d8, s2");
        
        CardFactory.getCard("Joker1").isDead = true;
        CardFactory.getCard("Joker2").isDead = true;

        strictEqual(Common.cardListToString(cpu.outputHand([])), "d8");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s2");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s3");
    });

    test("思考 single multi", function() {
        cpu.cardList = CardFactory.createCardList("s3, d8, s9, d9, s2");
        
        CardFactory.getCard("Joker1").isDead = true;
        CardFactory.getCard("Joker2").isDead = true;

        strictEqual(Common.cardListToString(cpu.outputHand([])), "d8");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s9, d9");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s2");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s3");
    });

    test("思考 single multi stairs", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4, c4, h5, h6, h7, d8, s9, d9, hT, hJ, hQ, hK, s2");
        
        CardFactory.getCard("Joker1").isDead = true;
        CardFactory.getCard("Joker2").isDead = true;

        strictEqual(Common.cardListToString(cpu.outputHand([])), "d8");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s4, c4");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s9, d9");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "h5, h6, h7");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "hT, hJ, hQ, hK");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s2");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s3");
    });

    test("思考 革命中 single multi stairs", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4, c4, h5, h6, h7, d8, s9, d9, hT, hJ, hQ, hK, s2");
        
        CardFactory.getCard("Joker1").isDead = true;
        CardFactory.getCard("Joker2").isDead = true;

        GameManager.revolution();

        strictEqual(Common.cardListToString(cpu.outputHand([])), "d8");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s9, d9");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s4, c4");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "hK, hQ, hJ, hT");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "h7, h6, h5");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s3");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s2");
    });
})();
