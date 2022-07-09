interface CoreMathHandler {
    TWO_PI: number
    DEG_TO_RAD: number
    RAD_TO_DEG: number
    degtorad(deg: number): number
    radtodeg(rad: number): number
    range(min: number, max?: number, t?: number): number
    irange(min: number, max?: number): number
    hypot(a: number, b: number): number
    polar_x(angle_rad: number, length?: number): number
    polar_y(angle_rad: number, length?: number): number
}

core.math = {
    TWO_PI: 2 * Math.PI,
    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,
    degtorad(deg) {
        return deg * this.DEG_TO_RAD
    },
    radtodeg(rad) {
        return rad * this.RAD_TO_DEG
    },
    range(min, max = 0, t = Math.random()) {
        return min + t * (max - min)
    },
    irange(min, max = 0) {
        return Math.round(this.range(min, max))
    },
    hypot(a, b) {
        return Math.sqrt(a * a + b * b)
    },
    polar_x(angle_rad, length = 1) {
        return length * Math.cos(angle_rad)
    },
    polar_y(angle_rad, length = 1) {
        return length * Math.sin(angle_rad)
    },
}
