class GameSceneHandler {
    private game: Game

    current: GameScene | null = null
    previous: GameScene | null = null

    constructor(game: Game) {
        this.game = game
    }

    restart() {
        this.game.input.reset()
        if (this.current) {
            this.current.start()
        }
    }

    start(scene: GameScene) {
        if (scene !== this.current) {
            this.previous = this.current
        }
        this.current = scene
        this.restart()
    }

    update() {
        if (this.current) {
            this.current.update()
        }
    }

    render() {
        if (this.current) {
            this.current.render()
        }
    }

    render_ui() {
        if (this.current) {
            this.current.render_ui()
        }
    }
}

class GameScene {
    constructor() { }
    start() { }
    update() { }
    render() { }
    render_ui() { }
}
