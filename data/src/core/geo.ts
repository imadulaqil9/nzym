class CorePoint {
    constructor(
        public x: number = 0,
        public y: number = 0,
    ) { }

    static ONE = new CorePoint(1, 1)
    static ZERO = new CorePoint(0, 0)
    static HALF = new CorePoint(0.5, 0.5)
}
