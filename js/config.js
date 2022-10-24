
class RuleConfig {
    #useJoker = true;
    get useJoker() {
        return this.#useJoker;
    }

    static default = new RuleConfig(false);

    constructor(useJoker) {
        this.#useJoker = useJoker;
    }
}

const EnvConfig = {
    isHighSpeed: true,
    normalSpeed: 1000,
    highSpeed: 500
};
