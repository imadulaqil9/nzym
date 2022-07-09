const room1 = new GameScene()

room1.render = () => {
    draw.set_font(font.xxl)
    draw.set_hvalign('center', 'middle')
    draw.text(stage.size.mid.x, draw.text_height * 0.5, `${stage.w}, ${stage.h}`)
}

font.embed_google_fonts('Maven Pro')
document.body.appendChild(stage.canvas)

game.start(room1)
