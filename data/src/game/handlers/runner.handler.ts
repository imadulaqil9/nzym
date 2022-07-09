class GameRunnerHandler {
    game: Game
    private _handle: number = -1

    is_running: boolean = false

    constructor(game: Game) {
        this.game = game
    }

    start() {
        if (this.is_running) this.stop()

        const run = () => {
            if (this.is_running) {
                this.step()
                window.requestAnimationFrame(run)
            }
        }

        this.is_running = true
        this._handle = window.requestAnimationFrame(run)
    }

    stop() {
        this.is_running = false
        window.cancelAnimationFrame(this._handle)
    }

    step() {
        this.game.scene.update()
        if (this.game.stage.is_auto_clear) {
            this.game.stage.clear()
        }
        this.game.scene.render()
        this.game.scene.render_ui()
        this.game.input.reset()
    }
}
