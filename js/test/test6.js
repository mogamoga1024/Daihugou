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

    test("交換", function() {
        
    });
})();