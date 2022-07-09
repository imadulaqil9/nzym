class GameStageHandler {
    game: Game

    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D

    size: CoreVec2

    default_canvas: HTMLCanvasElement

    constructor(options: {
        game: Game,
        canvas?: HTMLCanvasElement
    }) {
        this.game = options.game

        this.default_canvas = document.createElement('canvas')
        core.events.on('resize', ev => {
            this.default_canvas.width = ev.width
            this.default_canvas.height = ev.height
        })

        this.canvas = options.canvas || this.default_canvas
        this.ctx = this.canvas.getContext('2d')!

        this.size = new CoreVec2(this.canvas.width, this.canvas.height)

        core.events.on('resize', () => this.event_resize())
    }

    set_canvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')!
    }

    get w() {
        return this.size.x
    }

    get h() {
        return this.size.y
    }

    get mid() {
        return {
            w: this.w * 0.5,
            h: this.h * 0.5,
        }
    }

    private _pixel_ratio: number = NZYM_GAME_STAGE_PIXEL_RATIO.NORMAL

    get pixel_ratio() {
        return this._pixel_ratio
    }

    get pixel_ratio_text() {
        let text = 'Ultra'
        if (this._pixel_ratio < NZYM_GAME_STAGE_PIXEL_RATIO.NORMAL) text = 'Low'
        else if (this._pixel_ratio < NZYM_GAME_STAGE_PIXEL_RATIO.HIGH) text = 'Normal'
        else if (this._pixel_ratio < NZYM_GAME_STAGE_PIXEL_RATIO.ULTRA) text = 'High'
        return text
    }

    is_auto_clear: boolean = true
    is_redraw_on_resize: boolean = true

    event_resize() {
        const b = this.canvas.getBoundingClientRect()
        this.size.set(b.width, b.height)
        core.events.trigger('game_stage_resize', { game: this.game })
        this.apply_pixel_ratio()
    }

    set_pixel_ratio(pixel_ratio: number) {
        this._pixel_ratio = pixel_ratio
        this.apply_pixel_ratio()
    }

    reset_pixel_ratio() {
        this.set_pixel_ratio(NZYM_GAME_STAGE_PIXEL_RATIO.NORMAL)
    }

    apply_pixel_ratio() {
        const redraw_canvas = document.createElement('canvas')
        if (this.is_redraw_on_resize) {
            if (this.canvas.width > 0 && this.canvas.height > 0) {
                redraw_canvas.width = this.canvas.width
                redraw_canvas.height = this.canvas.height
                redraw_canvas.getContext('2d')!.drawImage(this.canvas, 0, 0)
            }
        }
        this.canvas.width = this.size.x * this._pixel_ratio
        this.canvas.height = this.size.y * this._pixel_ratio
        this.ctx.resetTransform()
        this.ctx.drawImage(redraw_canvas, 0, 0)
        this.ctx.scale(this._pixel_ratio, this._pixel_ratio)
    }

    random_x() {
        return Math.random() * this.size.x
    }

    random_y() {
        return Math.random() * this.size.y
    }

    random_xy() {
        return new CoreVec2(this.random_x(), this.random_y())
    }
}

interface CoreEventsMap {
    game_stage_resize: {
        game: Game
    }
}
