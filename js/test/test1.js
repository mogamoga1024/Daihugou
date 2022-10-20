(function() {
    let cpu = null;
    const ruleConfig = new RuleConfig(false);

    module("CPUのAIのテスト1", {
        setup() {
            cpu = new Cpu("CPU");
            CardFactory.initCardList(ruleConfig);
        }
    });
    
    // memo: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2
    
    test("カードの分割 single", function() {
        cpu.cardList = CardFactory.createCardList("s3, c4, d5, h6");
    
        cpu._cardDivision();
    
        strictEqual(cpu._singleThinking.handList.length, 4);
        strictEqual(Common.cardListToString(cpu._singleThinking.handList[0]), "s3");
        strictEqual(Common.cardListToString(cpu._singleThinking.handList[1]), "c4");
        strictEqual(Common.cardListToString(cpu._singleThinking.handList[2]), "d5");
        strictEqual(Common.cardListToString(cpu._singleThinking.handList[3]), "h6");
        strictEqual(cpu._multiThinking.handList.length, 0);
        strictEqual(cpu._stairsThinking.handList.length, 0);
    });
    
    test("カードの分割 single", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4");;
    
        cpu._cardDivision();
    
        strictEqual(cpu._singleThinking.handList.length, 2);
        strictEqual(Common.cardListToString(cpu._singleThinking.handList[0]), "s3");
        strictEqual(Common.cardListToString(cpu._singleThinking.handList[1]), "s4");
        strictEqual(cpu._multiThinking.handList.length, 0);
        strictEqual(cpu._stairsThinking.handList.length, 0);
    });
    
    test("カードの分割 multi", function() {
        cpu.cardList = CardFactory.createCardList("s4, c4, sJ, dJ, hJ");
    
        cpu._cardDivision();
    
        strictEqual(cpu._singleThinking.handList.length, 0);
        strictEqual(cpu._multiThinking.handList.length, 2);
        strictEqual(Common.cardListToString(cpu._multiThinking.handList[0]), "s4, c4");
        strictEqual(Common.cardListToString(cpu._multiThinking.handList[1]), "sJ, dJ, hJ");
        strictEqual(cpu._stairsThinking.handList.length, 0);
    });
    
    test("カードの分割 stairs", function() {
        cpu.cardList = CardFactory.createCardList("s4, s5, s6, dJ, dQ, dK, d1");
    
        cpu._cardDivision();
    
        strictEqual(cpu._singleThinking.handList.length, 0);
        strictEqual(cpu._multiThinking.handList.length, 0);
        strictEqual(cpu._stairsThinking.handList.length, 2);
        strictEqual(Common.cardListToString(cpu._stairsThinking.handList[0]), "s4, s5, s6");
        strictEqual(Common.cardListToString(cpu._stairsThinking.handList[1]), "dJ, dQ, dK, d1");
    });
    
    // memo: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2
    
    test("カードの分割 複合", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4, s5, s6, c6, d6, h6, d7, d8, sJ, cJ, h2");
    
        cpu._cardDivision();
    
        strictEqual(cpu._singleThinking.handList.length, 3);
        strictEqual(Common.cardListToString(cpu._singleThinking.handList[0]), "d7");
        strictEqual(Common.cardListToString(cpu._singleThinking.handList[1]), "d8");
        strictEqual(Common.cardListToString(cpu._singleThinking.handList[2]), "h2");
        strictEqual(cpu._multiThinking.handList.length, 2);
        strictEqual(Common.cardListToString(cpu._multiThinking.handList[0]), "s6, c6, d6, h6");
        strictEqual(Common.cardListToString(cpu._multiThinking.handList[1]), "sJ, cJ");
        strictEqual(cpu._stairsThinking.handList.length, 1);
        strictEqual(Common.cardListToString(cpu._stairsThinking.handList[0]), "s3, s4, s5");
    });
    
    test("最強のカードの強さ", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4, s5, s6, s7, s8, s9, sT, sJ, sQ, sK, s1, s2");

        CardFactory.createCard("c2").isDead = true;
        CardFactory.createCard("d2").isDead = true;
        CardFactory.createCard("h2").isDead = true;
        
        strictEqual(CardFactory.getStrongestCardPower(), CardFactory.createCard("s2").power);
    });
    
    test("最強のカードの強さ", function() {
        cpu.cardList = CardFactory.createCardList("s3, s4, s5, s6, s7, s8, s9, sT, sJ, sQ, sK, s1, s2");
        
        CardFactory.createCard("s2").isDead = true;
        CardFactory.createCard("c2").isDead = true;
        CardFactory.createCard("d2").isDead = true;
        CardFactory.createCard("h2").isDead = true;

        strictEqual(CardFactory.getStrongestCardPower(), CardFactory.createCard("s1").power);
    });    
})();