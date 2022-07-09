class GameInputHandler {
    input_target_element: HTMLElement | Window
    mouse_target_element: HTMLElement

    prevented_code: string[] = []

    keys: { [code: string]: GameInputHandlerKey } = {}
    buttons: GameInputHandlerKey[] = []
    touches: GameInputHandlerTouch[] = []
    active_touches: GameInputHandlerTouch[] = []

    position: CoreVec2 = new CoreVec2()
    mouse_position: CoreVec2 = new CoreVec2()
    mouse_movement: CoreVec2 = new CoreVec2()
    mouse_wheel_delta: CoreVec2 = new CoreVec2()

    is_mouse_moving: boolean = false

    get touch_count() {
        return this.active_touches.length
    }

    get mouse_x() {
        return this.mouse_position.x
    }

    get mouse_y() {
        return this.mouse_position.y
    }

    get movement_x() {
        return this.mouse_movement.x
    }

    get movement_y() {
        return this.mouse_movement.y
    }

    constructor(input_target_element: HTMLElement | Window, mouse_target_element: HTMLElement) {
        this.input_target_element = input_target_element
        this.mouse_target_element = mouse_target_element

        for (const code of NZYM_GAME_INPUT_CODE_VALUES) {
            this.keys[code] = new GameInputHandlerKey()
        }

        for (const button of Object.values(NZYM_GAME_INPUT_BUTTON)) {
            this.buttons[button] = new GameInputHandlerKey()
        }

        for (const id of Object.values(NZYM_GAME_INPUT_TOUCH_ID)) {
            this.touches[id] = new GameInputHandlerTouch()
        }

        window.addEventListener('keyup', ev => this.event_key_up(ev))
        window.addEventListener('keydown', ev => this.event_key_down(ev))
        window.addEventListener('mouseup', ev => this.event_mouse_up(ev))
        window.addEventListener('mousedown', ev => this.event_mouse_down(ev))
        window.addEventListener('mousemove', ev => this.event_mouse_move(ev))
        window.addEventListener('wheel', ev => this.event_wheel(ev))
        // window.addEventListener('touchend', this.touchEndEvent)
        // window.addEventListener('touchmove', this.touchMoveEvent)
        // window.addEventListener('touchstart', this.touchStartEvent)
    }

    private event_key_up(ev: KeyboardEvent) {
        this.keys[ev.code].up()
    }

    private event_key_down(ev: KeyboardEvent) {
        if (this.prevented_code.includes(ev.code)) {
            ev.preventDefault()
        }
        this.keys[ev.code].down()
    }

    private event_mouse_up(ev: MouseEvent) {
        this.buttons[ev.button].up()
        this.event_update_mouse(ev)
    }

    private event_mouse_down(ev: MouseEvent) {
        this.buttons[ev.button].down()
        this.event_update_mouse(ev)
    }

    private event_mouse_move(ev: MouseEvent) {
        this.event_update_mouse(ev)
        this.is_mouse_moving = true
    }

    private event_wheel(ev: WheelEvent) {
        this.mouse_wheel_delta.set(ev.deltaX, ev.deltaY)
    }

    private event_update_mouse(ev: MouseEvent) {
        const b = this.mouse_target_element.getBoundingClientRect()
        this.mouse_position.set(ev.clientX - b.x, ev.clientY - b.y)
        this.mouse_movement.set(ev.movementX, ev.movementY)
        this.position.set(this.mouse_position)
    }

    reset() {
        for (const code of NZYM_GAME_INPUT_CODE_VALUES) {
            this.keys[code].reset()
        }

        for (const button of this.buttons) {
            button.reset()
        }

        for (const touch of this.touches) {
            touch.reset()
        }

        this.mouse_movement.reset()
        this.mouse_wheel_delta.reset()

        this.is_mouse_moving = false

        this.active_touches.length = 0
    }

    key_up(code: string) {
        return this.keys[code].released
    }

    key_down(code: string) {
        return this.keys[code].pressed
    }

    key_hold(code: string) {
        return this.keys[code].held
    }

    key_repeat(code: string) {
        return this.keys[code].repeated
    }

    key_up_any() {
        for (const code of NZYM_GAME_INPUT_CODE_VALUES) {
            if (this.keys[code].released) return true
        }
        return false
    }

    key_down_any() {
        for (const code of NZYM_GAME_INPUT_CODE_VALUES) {
            if (this.keys[code].pressed) return true
        }
        return false
    }

    key_hold_any() {
        for (const code of NZYM_GAME_INPUT_CODE_VALUES) {
            if (this.keys[code].held) return true
        }
        return false
    }

    key_up_none() {
        return !this.key_up_any()
    }

    key_down_none() {
        return !this.key_down_any()
    }

    key_hold_none() {
        return !this.key_hold_any()
    }

    mouse_up(button: number) {
        return this.buttons[button].released
    }

    mouse_down(button: number) {
        return this.buttons[button].pressed
    }

    mouse_hold(button: number) {
        return this.buttons[button].held
    }

    /**
     * Same as `mouse_down`
     */
    mouse_repeat(button: number) {
        return this.buttons[button].repeated
    }

    mouse_wheel_up() {
        return this.mouse_wheel_delta.y > 0
    }

    mouse_wheel_down() {
        return this.mouse_wheel_delta.y < 0
    }

    mouse_up_any() {
        for (const button of this.buttons) {
            if (button.released) return true
        }
        return false
    }

    mouse_down_any() {
        for (const button of this.buttons) {
            if (button.pressed) return true
        }
        return false
    }

    mouse_hold_any() {
        for (const button of this.buttons) {
            if (button.held) return true
        }
        return false
    }

    mouse_up_none() {
        return !this.mouse_up_any()
    }

    mouse_down_none() {
        return !this.mouse_down_any()
    }

    mouse_hold_none() {
        return !this.mouse_hold_any()
    }

    touch_up(id: number) {
        return this.touches[id].released
    }

    touch_down(id: number) {
        return this.touches[id].pressed
    }

    touch_hold(id: number) {
        return this.touches[id].held
    }
}

class GameInputHandlerKey {
    held: boolean = false
    pressed: boolean = false
    released: boolean = false
    repeated: boolean = false

    up() {
        this.held = false
        this.released = true
    }

    down() {
        if (!this.held) {
            this.held = true
            this.pressed = true
        }
        this.repeated = true
    }

    reset() {
        this.pressed = false
        this.released = false
        this.repeated = false
    }
}

class GameInputHandlerTouch extends GameInputHandlerKey {
    position: CoreVec2 = new CoreVec2()

    constructor() {
        super()
    }
}
