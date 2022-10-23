(function() {
    let cpu = null;
    const ruleConfig = new RuleConfig(false);

    module("CPUのAIのテスト6（カード交換）", {
        setup() {
            cpu = new Cpu("CPU1");
            GameManager.init([cpu], {isRevolution: false});
            CardFactory.initCardList(ruleConfig);
        }
    });

    test("交換 大貧民", function() {
        cpu.cardList = CardFactory.getCardList("s3, s5, s7, s9");
        cpu.rank = Rank.Daihinmin;

        strictEqual(Common.cardListToString(cpu.selectExchangeCardList()), "s7, s9");
    });


    test("交換 基本、最弱は渡さない", function() {
        cpu.cardList = CardFactory.getCardList("s3, s5, s7, s9");
        cpu.rank = Rank.Daihugou;

        strictEqual(Common.cardListToString(cpu.selectExchangeCardList()), "s5, s7");
    });

    test("交換 7より弱いカードがなければ最弱を渡す", function() {
        cpu.cardList = CardFactory.getCardList("s7, sT, cJ, sQ, sK");
        cpu.rank = Rank.Daihugou;

        strictEqual(Common.cardListToString(cpu.selectExchangeCardList()), "s7, sT");
    });

    test("交換 7より弱いカードがなければ最弱を渡す single優先", function() {
        cpu.cardList = CardFactory.getCardList("s7, c7, sT, cJ, sQ, sK");
        cpu.rank = Rank.Daihugou;

        strictEqual(Common.cardListToString(cpu.selectExchangeCardList()), "sT, cJ");
    });

    test("交換 single優先", function() {
        cpu.cardList = CardFactory.getCardList("s3, c3, s5, s6, d6, s8, s9, sT, cJ, sQ");
        cpu.rank = Rank.Daihugou;

        strictEqual(Common.cardListToString(cpu.selectExchangeCardList()), "s5, cJ");
    });

    test("交換 single優先 だが最強は出さない", function() {
        cpu.cardList = CardFactory.getCardList("s3, c3, s5, s6, d6, s8, s9, sT, cJ");
        cpu.rank = Rank.Daihugou;

        strictEqual(Common.cardListToString(cpu.selectExchangeCardList()), "s5, s6");
    });

    test("交換 multi", function() {
        cpu.cardList = CardFactory.getCardList("s3, s4, c4, sT, cT, s2");
        cpu.rank = Rank.Daihugou;

        strictEqual(Common.cardListToString(cpu.selectExchangeCardList()), "s4, c4");
    });

    test("交換 stairs", function() {
        cpu.cardList = CardFactory.getCardList("s3, c4, c5, c6, s7, s8, s9");
        cpu.rank = Rank.Daihugou;

        strictEqual(Common.cardListToString(cpu.selectExchangeCardList()), "c4, c5");
    });

    test("交換 stairs 変則", function() {
        cpu.cardList = CardFactory.getCardList("s3, c4, c5, c6, s9, sT, sJ, sQ, sK");
        cpu.rank = Rank.Daihugou;

        strictEqual(Common.cardListToString(cpu.selectExchangeCardList()), "s9, sT");
    });

    test("交換 stairs 変則", function() {
        cpu.cardList = CardFactory.getCardList("s3, s4, s5, c6, s7, s8, s9, cT, dT, c2");
        cpu.rank = Rank.Daihugou;

        strictEqual(Common.cardListToString(cpu.selectExchangeCardList()), "s3, cT");
    });

    test("交換 stairs 変則", function() {
        cpu.cardList = CardFactory.getCardList("s3, s4, s5, c6, s7, s8, s9, cT, dT");
        cpu.rank = Rank.Daihugou;

        strictEqual(Common.cardListToString(cpu.selectExchangeCardList()), "s3, s4");
    });

    test("交換 stairs 変則", function() {
        cpu.cardList = CardFactory.getCardList("s3, s4, s5, c6, s7, s8, s9");
        cpu.rank = Rank.Daihugou;

        strictEqual(Common.cardListToString(cpu.selectExchangeCardList()), "s3, s4");
    });
})();