class GameDrawHandler {
    game: Game

    ctx: CanvasRenderingContext2D

    private _default_font: GameFont
    font: GameFont

    primitive_type: GameDrawPrimitive = NZYM_GAME_DRAW_PRIMITIVE.FILL
    private _vertices: CorePoint[] = []

    constructor(options: {
        game: Game,
        ctx: CanvasRenderingContext2D,
        default_font?: GameFont
    }) {
        this.game = options.game
        this.ctx = options.ctx
        this._default_font = options.default_font || new GameFont(NZYM_GAME_FONT_SIZE.M)
        this.font = this._default_font
    }

    get text_height() {
        return this.font.size
    }

    set_alpha(alpha: number) {
        this.ctx.globalAlpha = alpha
    }

    reset_alpha() {
        this.ctx.globalAlpha = 1
    }

    set_fill(color: string) {
        this.ctx.fillStyle = color
    }

    set_stroke(color: string) {
        this.ctx.strokeStyle = color
    }

    set_color(color: string): void
    set_color(fill: string, stroke?: string): void
    set_color(fill: string, stroke?: string) {
        this.ctx.fillStyle = fill
        this.ctx.strokeStyle = stroke || fill
    }

    fill() {
        this.ctx.fill()
    }

    stroke() {
        this.ctx.stroke()
    }

    set_font(font: GameFont) {
        this.font = font
        this.ctx.font = `${this.font.style}${this.font.size}px ${this.font.family}, serif`
    }

    reset_font() {
        this.set_font(this._default_font)
    }

    set_halign(align: CanvasTextAlign) {
        this.ctx.textAlign = align
    }

    set_valign(align: CanvasTextBaseline) {
        this.ctx.textBaseline = align
    }

    set_hvalign(halign: CanvasTextAlign, valign: CanvasTextBaseline) {
        this.ctx.textAlign = halign
        this.ctx.textBaseline = valign
    }

    reset_hvalign() {
        this.set_hvalign('left', 'top')
    }

    split_text(text: string) {
        return text.split('\n')
    }

    text(x: number, y: number, text: string) {
        let baseline = 0
        const t = this.split_text(text)

        if (this.ctx.textBaseline === 'bottom') {
            baseline = -this.font.size * (t.length - 1)
        }
        else if (this.ctx.textBaseline === 'middle') {
            baseline = -this.font.size * (t.length - 1) * 0.5
        }

        for (let i = t.length - 1; i >= 0; --i) {
            this.ctx.fillText(t[i], x, y + baseline + this.font.size * i)
        }
    }

    get_text_width(text: string) {
        return Math.max(...this.split_text(text).map(t => this.ctx.measureText(t).width))
    }

    get_text_height(text: string) {
        return this.font.size * this.split_text(text).length
    }

    text_regular(x: number, y: number, text: string, is_stroke: boolean = false) {
        if (is_stroke) this.ctx.strokeText(text, x, y)
        else this.ctx.fillText(text, x, y)
    }

    get_text_width_regular(text: string) {
        return this.ctx.measureText(text).width
    }

    draw(is_stroke: boolean = false) {
        is_stroke ? this.ctx.stroke() : this.ctx.fill()
    }

    rect(x: number, y: number, w: number, h: number, is_stroke: boolean = false) {
        this.ctx.beginPath()
        this.ctx.rect(x, y, w, h)
        this.draw(is_stroke)
    }

    circle(x: number, y: number, r: number, is_stroke: boolean = false) {
        this.ctx.beginPath()
        this.ctx.arc(x, y, r, 0, core.math.TWO_PI)
        this.draw(is_stroke)
    }

    set_line_cap(cap: CanvasLineCap) {
        this.ctx.lineCap = cap
    }

    reset_line_cap() {
        this.ctx.lineCap = 'butt'
    }

    set_line_join(join: CanvasLineJoin) {
        this.ctx.lineJoin = join
    }

    reset_line_join() {
        this.ctx.lineJoin = 'miter'
    }

    set_line_width(n: number) {
        this.ctx.lineWidth = n
    }

    reset_line_width() {
        this.ctx.lineWidth = 1
    }

    /**
     * Same as `set_line_width`
     */
    set_stroke_weight(n: number) {
        this.set_line_width(n)
    }

    reset_stroke_weight() {
        this.reset_line_width()
    }

    set_line_dash(segments: number[], offset = 0) {
        this.ctx.setLineDash(segments)
        this.ctx.lineDashOffset = offset
    }

    reset_line_dash() {
        this.set_line_dash(NZYM_GAME_DRAW_LINE_DASH.SOLID)
    }

    set_shadow(x_offset: number, y_offset: number, blur: number = 0, color: string = '#000') {
        this.ctx.shadowBlur = blur
        this.ctx.shadowColor = color
        this.ctx.shadowOffsetX = x_offset
        this.ctx.shadowOffsetY = y_offset
    }

    reset_shadow() {
        this.set_shadow(0, 0)
    }

    arc(x: number, y: number, r: number, start_angle_deg: number, end_angle_deg: number, is_stroke: boolean = false) {
        if (end_angle_deg < 0) {
            start_angle_deg = end_angle_deg
            end_angle_deg = 0
        }
        this.ctx.beginPath()
        this.ctx.arc(x, y, r, core.math.degtorad(start_angle_deg), core.math.degtorad(end_angle_deg))
        this.draw(is_stroke)
    }

    line(x1: number, y1: number, x2: number, y2: number) {
        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.stroke()
    }

    plus(x: number, y: number, r: number) {
        this.ctx.beginPath()
        this.ctx.moveTo(x, y - r)
        this.ctx.lineTo(x, y + r)
        this.ctx.moveTo(x - r, y)
        this.ctx.lineTo(x + r, y)
        this.ctx.stroke()
    }

    triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, is_stroke: boolean = false) {
        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.lineTo(x3, y3)
        this.ctx.closePath()
        this.draw(is_stroke)
    }

    round_rect(x: number, y: number, w: number, h: number, r: number = 10, is_stroke: boolean = false) {
        if (w < 0) x += w, w = -w
        if (h < 0) y += h, h = -h
        r = Math.min(Math.min(w * 0.5, h * 0.5), Math.max(0, r)) || 0
        this.ctx.beginPath()
        this.ctx.moveTo(x, y + r)
        this.ctx.quadraticCurveTo(x, y, x + r, y)
        this.ctx.lineTo(x + w - r, y)
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + r)
        this.ctx.lineTo(x + w, y + h - r)
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
        this.ctx.lineTo(x + r, y + h)
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - r)
        this.ctx.closePath()
        this.draw(is_stroke)
    }

    point(p: CorePoint, size: number = 1) {
        this.circle(p.x, p.y, size * 0.5)
    }

    point_line(p1: CorePoint, p2: CorePoint) {
        this.line(p1.x, p1.y, p2.x, p2.y)
    }

    point_rect(p1: CorePoint, p2: CorePoint, p3: CorePoint, p4: CorePoint, is_stroke: boolean = false) {
        this.ctx.beginPath()
        this.ctx.moveTo(p1.x, p1.y)
        this.ctx.lineTo(p2.x, p2.y)
        this.ctx.lineTo(p3.x, p3.y)
        this.ctx.lineTo(p4.x, p4.y)
        this.ctx.closePath()
        this.draw(is_stroke)
    }

    point_circle(p: CorePoint, r: number, is_stroke: boolean = false) {
        this.circle(p.x, p.y, r, is_stroke)
    }

    point_triangle(p1: CorePoint, p2: CorePoint, p3: CorePoint, is_stroke: boolean = false) {
        this.triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, is_stroke)
    }

    iso_rect(p: CorePoint, w: number, h: number, is_stroke: boolean = false) {
        w = w * 0.5, h = h * 0.5
        this.point_rect(
            { x: p.x, y: p.y - h },
            { x: p.x + w, y: p.y },
            { x: p.x, y: p.y + h },
            { x: p.x - w, y: p.y },
            is_stroke,
        )
    }

    grid_rect(column: number, row: number, cell_width: number, cell_height: number, is_stroke: boolean = false) {
        this.rect(column * cell_width, row * cell_height, cell_width, cell_height, is_stroke)
    }

    primitive_begin() {
        this._vertices.length = 0
    }

    vertex(v: CoreVec2): void
    vertex(x: number, y: number): void
    vertex(x: CoreVec2 | number, y?: number) {
        if (x instanceof CoreVec2) {
            y = x.y
            x = x.x
        }
        this._vertices.push(new CorePoint(x, y))
    }

    primitive_end(type?: GameDrawPrimitive) {
        this.primitive_type = type || this.primitive_type
        const q = this.primitive_type.quantity
        const c = this.primitive_type.close_path
        const o = this.primitive_type.is_stroke
        const n = this._vertices.length
        if (q === 1) this.set_line_cap('round')
        this.ctx.beginPath()
        for (let i = 0; i < n; i++) {
            const v = this._vertices[i]
            if (q === 1) {
                this.draw(o)
                this.ctx.beginPath()
                this.ctx.moveTo(v.x, v.y)
                this.ctx.lineTo(v.x, v.y)
            }
            else if (i === 0 || (q > 1 && i % q === 0)) {
                if (c) this.ctx.closePath()
                this.draw(o)
                this.ctx.beginPath()
                this.ctx.moveTo(v.x, v.y)
            }
            else this.ctx.lineTo(v.x, v.y)
        }
        if (c) this.ctx.closePath()
        this.draw(o)
        this.reset_line_cap()
    }

    ellipse(x: number, y: number, w: number, h: number, is_stroke: boolean = false) {
        this.ellipse_rotated(x, y, w, h, 0, is_stroke)
    }

    ellipse_rotated(x: number, y: number, w: number, h: number, rotation_deg: number, is_stroke: boolean = false) {
        this.ctx.beginPath()
        this.ctx.ellipse(x, y, Math.abs(w), Math.abs(h), core.math.degtorad(rotation_deg), 0, core.math.TWO_PI)
        this.ctx.closePath()
        this.draw(is_stroke)
    }

    star(x: number, y: number, r: number, is_stroke: boolean = false) {
        this.star_rotated(x, y, r, 0, is_stroke)
    }

    star_ext(x: number, y: number, pts: number, inner: number, outer: number, is_stroke: boolean = false) {
        this.star_ext_rotated(x, y, pts, inner, outer, 0, is_stroke)
    }

    star_rotated(x: number, y: number, r: number, angle_deg: number, is_stroke: boolean = false) {
        this.star_ext_rotated(x, y, 5, r * 0.5, r, angle_deg, is_stroke)
    }

    star_ext_rotated(x: number, y: number, pts: number, inner: number, outer: number, angle_deg: number, is_stroke: boolean = false) {
        this.ctx.beginPath();
        for (let i = 0; i <= 2 * pts; i++) {
            const r = (i % 2 === 0) ? inner : outer
            const a = Math.PI * i / pts - core.math.degtorad(angle_deg)
            const p = {
                x: x + r * Math.sin(a),
                y: y + r * Math.cos(a),
            }
            if (i === 0) this.ctx.moveTo(p.x, p.y)
            else this.ctx.lineTo(p.x, p.y)
        }
        this.ctx.closePath()
        this.draw(is_stroke)
    }

    on_transform(x: number, y: number, xscale: number, yscale: number, angle_deg: number, draw_fn: Function) {
        this.ctx.save()
        this.ctx.translate(x, y)
        this.ctx.rotate(core.math.degtorad(angle_deg))
        this.ctx.scale(xscale, yscale)
        draw_fn()
        this.ctx.restore()
    }

    text_rotated(x: number, y: number, text: string, angle_deg: number) {
        this.text_transformed(x, y, text, 1, 1, angle_deg)
    }

    text_transformed(x: number, y: number, text: string, xscale: number, yscale: number, angle_deg: number) {
        this.on_transform(x, y, xscale, yscale, angle_deg, () => this.text(0, 0, text))
    }

    rect_transformed(x: number, y: number, w: number, h: number, is_stroke: boolean, xscale: number, yscale: number, angle_deg: number, origin: CorePoint = CorePoint.HALF) {
        this.on_transform(x, y, xscale, yscale, angle_deg, () => this.rect(-w * origin.x, -h * origin.y, w, h, is_stroke))
    }

    star_transformed(x: number, y: number, r: number, is_stroke: boolean, xscale: number, yscale: number, angle_deg: number) {
        this.on_transform(x, y, xscale, yscale, angle_deg, () => this.star(0, 0, r, is_stroke))
    }

    star_ext_transformed(x: number, y: number, pts: number, inner: number, outer: number, is_stroke: boolean, xscale: number, yscale: number, angle_deg: number) {
        this.on_transform(x, y, xscale, yscale, angle_deg, () => this.star_ext(0, 0, pts, inner, outer, is_stroke))
    }

    round_rect_transformed(x: number, y: number, w: number, h: number, r: number, is_stroke: boolean, xscale: number, yscale: number, angle_deg: number, origin: CorePoint = CorePoint.HALF) {
        this.on_transform(x, y, xscale, yscale, angle_deg, () => this.round_rect(-w * origin.x, -h * origin.y, w, h, r, is_stroke))
    }

    rect_rotated(x: number, y: number, w: number, h: number, angle_deg: number, is_stroke: boolean = false, origin: CorePoint = CorePoint.HALF) {
        this.rect_transformed(x, y, w, h, is_stroke, 1, 1, angle_deg, origin)
    }

    round_rect_rotated(x: number, y: number, w: number, h: number, r: number, angle_deg: number, is_stroke: boolean = false, origin: CorePoint = CorePoint.HALF) {
        this.round_rect_transformed(x, y, w, h, r, is_stroke, 1, 1, angle_deg, origin)
    }
}
