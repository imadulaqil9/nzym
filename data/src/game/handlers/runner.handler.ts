class GameRunnerHandler {
    private game: Game
    private handle: number = -1

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
        this.handle = window.requestAnimationFrame(run)
    }

    stop() {
        this.is_running = false
        window.cancelAnimationFrame(this.handle)
    }

    step() {
        this.game.scene.update()
        this.game.scene.render()
        this.game.scene.render_ui()
        this.game.input.reset()
    }
}
