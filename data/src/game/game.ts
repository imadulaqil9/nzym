class Game {
    private static _ID = 0
    id: number

    input: GameInputHandler
    stage: GameStageHandler
    scene: GameSceneHandler
    font: GameFontHandler
    draw: GameDrawHandler
    runner: GameRunnerHandler

    constructor(
        options: {
            input_target_element?: HTMLElement
            mouse_target_element?: HTMLElement
            canvas?: HTMLCanvasElement
            default_font?: GameFont
        } = {}
    ) {
        this.id = Game._ID++

        this.input = new GameInputHandler(
            options.input_target_element || window,
            options.mouse_target_element || document.body,
        )

        this.stage = new GameStageHandler({
            game: this,
            canvas: options.canvas,
        })

        this.font = new GameFontHandler()

        this.draw = new GameDrawHandler({
            game: this,
            ctx: this.stage.ctx,
            default_font: options.default_font,
        })

        this.scene = new GameSceneHandler(this)
        this.runner = new GameRunnerHandler(this)
    }

    start(scene: GameScene) {
        this.scene.start(scene)
        this.runner.start()
    }
}
