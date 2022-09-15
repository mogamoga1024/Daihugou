
let cpu = null;

module("CPUのAIのテスト", {
    setup() {
        cpu = new Cpu("CPU");
    }
});

test("hoge", function() {
    ok(1 + 1 === 2, "足し算");
});

