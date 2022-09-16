(function() {
    let cpu = null;

    module("CPUのAIのテスト2", {
        setup() {
            cpu = new Cpu("CPU1");
            GameManager.init([cpu], {isRevolution: false});
        }
    });

    // memo: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2

    test("思考 single", function() {
        cpu.cardList = CardFactory.createCardList("s3, d7, s2");
        
        CardFactory.getCard("Joker1").isDead = true;
        CardFactory.getCard("Joker2").isDead = true;

        strictEqual(Common.cardListToString(cpu.outputHand([])), "d7");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s2");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s3");
    });

    test("思考 single multi", function() {
        cpu.cardList = CardFactory.createCardList("s3, d7, sT, dT, s2");
        
        CardFactory.getCard("Joker1").isDead = true;
        CardFactory.getCard("Joker2").isDead = true;

        strictEqual(Common.cardListToString(cpu.outputHand([])), "d7");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "sT, dT");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s2");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s3");
    });

    test("思考 single multi stairs", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4, c4, h5, h6, h7, d9, sT, dT, hJ, hQ, hK, h1, s2");
        
        CardFactory.getCard("Joker1").isDead = true;
        CardFactory.getCard("Joker2").isDead = true;

        strictEqual(Common.cardListToString(cpu.outputHand([])), "d9");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s4, c4");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "sT, dT");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "h5, h6, h7");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "hJ, hQ, hK, h1");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s2");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s3");
    });

    test("思考 革命中 single multi stairs", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4, c4, h5, h6, h7, d9, sT, dT, hJ, hQ, hK, h1, s2");
        
        CardFactory.getCard("Joker1").isDead = true;
        CardFactory.getCard("Joker2").isDead = true;

        GameManager.revolution();

        strictEqual(Common.cardListToString(cpu.outputHand([])), "d9");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "sT, dT");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s4, c4");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "h1, hK, hQ, hJ");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "h7, h6, h5");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s3");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s2");
    });

    test("思考 革命考慮", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4, c4, d4, h4, s9, s2");
        
        CardFactory.getCard("Joker1").isDead = true;
        CardFactory.getCard("Joker2").isDead = true;

        strictEqual(Common.cardListToString(cpu.outputHand([])), "s2");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s4, c4, d4, h4");

        GameManager.revolution();

        strictEqual(Common.cardListToString(cpu.outputHand([])), "s3");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s9");
    });
})();
