class CoreVec2 {
    constructor(
        public x: number = 0,
        public y: number = 0,
    ) { }

    get mid() {
        return {
            x: this.x * 0.5,
            y: this.y * 0.5,
        }
    }

    reset() {
        this.x = 0
        this.y = 0
    }

    set(v: CoreVec2): void
    set(x: number, y: number): void
    set(x: CoreVec2 | number, y?: number) {
        if (x instanceof CoreVec2) {
            this.x = x.x
            this.y = x.y
        }
        else if (typeof y === 'number') {
            this.x = x
            this.y = y
        }
    }
}
