
let cpu = null;

module("CPUのAIのテスト", {
    setup() {
        cpu = new Cpu("CPU");
    }
});

// memo: ((s|c|d|h)([1-9]|T|J|Q|K))|Joker1|Joker2

test("カードの分割 single", function() {
    cpu.cardList = CardFactory.createCardList("s3, c4, d5, h6");;

    cpu._cardDivision();

    strictEqual(Common.cardListToString(cpu._singleCardList), "s3, c4, d5, h6");
    strictEqual(cpu._multiCardList.length, 0);
    strictEqual(cpu._stairsCardList.length, 0);
});

test("カードの分割 multi", function() {
    cpu.cardList = CardFactory.createCardList("s4, c4, sJ, dJ, hJ");;

    cpu._cardDivision();

    strictEqual(cpu._singleCardList.length, 0);
    strictEqual(cpu._multiCardList.length, 2);
    strictEqual(Common.cardListToString(cpu._multiCardList[0]), "s4, c4");
    strictEqual(Common.cardListToString(cpu._multiCardList[1]), "sJ, dJ, hJ");
    strictEqual(cpu._stairsCardList.length, 0);
});

test("カードの分割 stairs", function() {
    cpu.cardList = CardFactory.createCardList("s4, s5, s6, dJ, dQ, dK, d1");;

    cpu._cardDivision();

    strictEqual(cpu._singleCardList.length, 0);
    strictEqual(cpu._multiCardList.length, 0);
    strictEqual(cpu._stairsCardList.length, 2);
    strictEqual(Common.cardListToString(cpu._stairsCardList[0]), "s4, s5, s6");
    strictEqual(Common.cardListToString(cpu._stairsCardList[1]), "dJ, dQ, dK, d1");
});

