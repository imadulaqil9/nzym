interface CoreEventsHandler {
    list: {
        [K in keyof CoreEventsMap]: CoreEventsCallback<K>[]
    }
    on<K extends keyof CoreEventsMap>(name: K, callback: CoreEventsCallback<K>): CoreEventsCallback<K>
    off<K extends keyof CoreEventsMap>(name: K, callback: CoreEventsCallback<K>): CoreEventsCallback<K>
    trigger<K extends keyof CoreEventsMap>(name: K, events: CoreEventsMap[K]): void
}

core.events = {
    list: {} as any,
    on(name, cb) {
        this.list[name] = this.list[name] || []
        this.list[name].push(cb)
        return cb
    },
    off(name, cb) {
        const old_list = this.list[name] = this.list[name] || []
        const new_list: typeof old_list = []
        for (let i = 0; i < old_list.length; i++) {
            if (old_list[i] !== cb) {
                new_list.push(old_list[i])
            }
        }
        this.list[name] = new_list
        return cb
    },
    trigger(name, ev) {
        const list = this.list[name]
        if (list && list.length) {
            for (let i = 0; i < list.length; i++) {
                list[i](ev)
            }
        }
    },
}

window.addEventListener('DOMContentLoaded', () => {
    core.events.trigger('dom_content_loaded', {})
    core.events.trigger('resize', {
        width: window.innerWidth,
        height: window.innerHeight,
    })
})

window.addEventListener('resize', () => {
    core.events.trigger('resize', {
        width: window.innerWidth,
        height: window.innerHeight,
    })
})

interface CoreEventsMap {
    dom_content_loaded: {}
    resize: {
        width: number
        height: number
    }
}

type CoreEventsCallback<K extends keyof CoreEventsMap> = (ev: CoreEventsMap[K]) => any
