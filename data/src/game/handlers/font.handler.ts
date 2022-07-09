class GameFontHandler {
    xxl: GameFont
    xl: GameFont
    l: GameFont
    m: GameFont
    sm: GameFont
    s: GameFont
    xxlb: GameFont
    xlb: GameFont
    lb: GameFont
    mb: GameFont
    smb: GameFont
    sb: GameFont

    constructor() {
        this.xxl = new GameFont(NZYM_GAME_FONT_SIZE.XXL)
        this.xl = new GameFont(NZYM_GAME_FONT_SIZE.XL)
        this.l = new GameFont(NZYM_GAME_FONT_SIZE.L)
        this.m = new GameFont(NZYM_GAME_FONT_SIZE.M)
        this.sm = new GameFont(NZYM_GAME_FONT_SIZE.SM)
        this.s = new GameFont(NZYM_GAME_FONT_SIZE.S)
        this.xxlb = new GameFont(this.xxl.size, NZYM_GAME_FONT_STYLE.BOLD, this.xxl.family)
        this.xlb = new GameFont(this.xl.size, NZYM_GAME_FONT_STYLE.BOLD, this.xl.family)
        this.lb = new GameFont(this.l.size, NZYM_GAME_FONT_STYLE.BOLD, this.l.family)
        this.mb = new GameFont(this.m.size, NZYM_GAME_FONT_STYLE.BOLD, this.m.family)
        this.smb = new GameFont(this.sm.size, NZYM_GAME_FONT_STYLE.BOLD, this.sm.family)
        this.sb = new GameFont(this.s.size, NZYM_GAME_FONT_STYLE.BOLD, this.s.family)
    }

    set_family(family: string) {
        this.xxl.family = family
        this.xl.family = family
        this.l.family = family
        this.m.family = family
        this.sm.family = family
        this.s.family = family
        this.xxlb.family = family
        this.xlb.family = family
        this.lb.family = family
        this.mb.family = family
        this.smb.family = family
        this.sb.family = family
    }

    create_google_font_link(font_name: string) {
        const n = document.createElement('link')
        n.href = `https://fonts.googleapis.com/css2?family=${font_name.replace(' ', '+')}&display=swap`
        n.rel = 'stylesheet'
        return n
    }

    embed_google_fonts(...font_names: string[]) {
        for (const font_name of font_names) {
            document.head.appendChild(this.create_google_font_link(font_name))
        }
    }
}

class GameFont {
    constructor(
        public size: number,
        public style: string = NZYM_GAME_FONT_STYLE.REGULAR,
        public family: string = NZYM_GAME_FONT_FAMILY.DEFAULT,
    ) { }
}
