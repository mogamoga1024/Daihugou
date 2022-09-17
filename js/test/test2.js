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

    test("思考 応手で気軽に最強をださない single", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4, s2");

        CardFactory.getCard("Joker1").isDead = true;
        CardFactory.getCard("Joker2").isDead = true;

        const s1 = CardFactory.getCard("s1");

        strictEqual(Common.cardListToString(cpu.outputHand([s1])), "");

        s1.isDead = true;

        strictEqual(Common.cardListToString(cpu.outputHand([])), "s4");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s2");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s3");
    });

    test("思考 応手で気軽に最強をださない multi", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4, s2, c2");

        CardFactory.getCard("Joker1").isDead = true;
        CardFactory.getCard("Joker2").isDead = true;

        const s1 = CardFactory.getCard("s1");
        const c1 = CardFactory.getCard("c1");

        strictEqual(Common.cardListToString(cpu.outputHand([s1, c1])), "");

        s1.isDead = c1.isDead = true;

        strictEqual(Common.cardListToString(cpu.outputHand([])), "s4");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s2, c2");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "s3");
    });

    test("思考 応手で気軽に最強をださない stairs", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4, sK, s1, s2");

        CardFactory.getCard("Joker1").isDead = true;
        CardFactory.getCard("Joker2").isDead = true;

        const cQ = CardFactory.getCard("cQ");
        const cK = CardFactory.getCard("cK");
        const c1 = CardFactory.getCard("c1");

        strictEqual(Common.cardListToString(cpu.outputHand([cQ, cK, c1])), "");

        cQ.isDead = cK.isDead = c1.isDead = true;

        strictEqual(Common.cardListToString(cpu.outputHand([])), "s4");
        strictEqual(Common.cardListToString(cpu.outputHand([])), "sK, s1, s2");
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

    // memo: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2

    test("思考 革命すべきか", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4, c5, d6, s9, c9, d9, h9, sK, s2");

        cpu._cardDivision();
        
        strictEqual(cpu._shouldRevolution(), true);
    });

    test("思考 革命すべきか", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4, c4, d4, h4, sJ, cJ, dQ, sK, s2");

        cpu._cardDivision();
        
        strictEqual(cpu._shouldRevolution(), true);
    });

    test("思考 革命すべきか", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4, c4, d4, h4, s9, s2");

        cpu._cardDivision();
        
        strictEqual(cpu._shouldRevolution(), true);
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
