function S(c = void 0) {
    const d = Object.create(S.prototype);
    if ('undefined' == typeof c) return d;
    if ('string' == typeof c && c.match(/^(#|\.)((?!(\.|\||#)))+/)) d.query = [...document.querySelectorAll(c)];
    else if ('string' == typeof c && c.match(/^(#|\.)\.+/)) {
        const e = c.slice(0, 1) + c.slice(2);
        d.query = 1 < [...document.querySelectorAll(e)].length ? [...document.querySelectorAll(e)] : document.querySelector(e)
    } else if ('string' == typeof c && c.match(/^\|((?!(\.|#|\|)))+/)) {
        const e = c.substring(1, c.length);
        d.query = 1 < [...document.querySelectorAll(e)].length ? [...document.querySelectorAll(e)] : document.querySelector(e)
    } else if ('string' == typeof c && c.match(/^\|\.+/)) {
        const e = c.substring(2, c.length);
        d.query = 1 < [...document.querySelectorAll(e)].length ? [...document.querySelectorAll(e)] : document.querySelector(e)
    } else d.text = c, d.query = c;
    return 'string' == typeof c && c.match(/^(#|\.|\|)\.((?!(\.|\|\#)))+/) ? d.query : d
}
S.prototype.addClass = function(c) {
    let d = this.query || [];
    const e = c.split(' ') || [];
    for (let f of d)
        for (let g of e) f.classList.add(g);
    return this
}, S.prototype.hasClass = function(c) {
    const d = this.query || [],
        e = c.split(' ') || [];
    for (let f of d)
        for (let g of e)
            if (!f.classList.contains(g)) return !1;
    return !0
}, S.prototype.invert = function(c) {
    'background' === c && this.query.forEach(d => {
        d.style.background = 'black' === d.style.background ? 'white' : 'black', d.style.background = 'white' === d.style.background ? 'black' : 'white'
    })
}, S.prototype.inspect = function() {
    const c = this.query;
    for (let d of c) {
        d.custom = {};
        const e = d.parentNode,
            f = d.childNodes,
            g = d.custom;
        console.log(new function() {
            for (let j in this.element = d, this.parent = e, this.children = f, this.custom_properties = {}, g) this.custom_properties[j] = g[j]
        })
    }
    return this
}, S.prototype.on = function(c, d) {
    for (let e of this.query) e.addEventListener(c, d, !1);
    return this
}, S.prototype.val = function() {
    return this
}, S.prototype.children = function() {
    return this.query.children
}, S.prototype.parent = function() {
    return this.query.parentNode
}, S.prototype.css = function(c = '', d = '', e) {
    return (void 0 === this.query || 1 > this.query.length) && console.error('css query undefined'), !0 === e ? this.query.forEach(f => {
        f.style[c] = `${d} !important`
    }) : this.query.forEach(f => {
        f.style[c] = d
    }), d
}, S.prototype.exists = function() {
    return 'undefined' != typeof this.query
}, S.prototype.dom = function(c) {
    return this.query[c]
}, S.prototype.convertTo = function(c, d = {}) {
    return {
        fahrenheit: () => d.round ? Math.round(9 * this.text / 5 + 32) : 9 * this.text / 5 + 32,
        celcius: () => d.round ? Math.round(5 * (this.text - 32) / 9) : 5 * (this.text - 32) / 9
    } [c]()
}, S.prototype.last = function() {
    return this.arr[this.arr.length - 1]
}, S.prototype.json = function(c) {
    const d = new XMLHttpRequest;
    d.overrideMimeType('application/json'), d.open('GET', this.text, !0), d.onreadystatechange = function() {
        4 == d.readyState && '200' == d.status && c(d.responseText || void 0)
    }, d.send(null)
}, S.prototype.deepFreeze = function() {
    var c = Object.getOwnPropertyNames(this.text);
    for (let d of c) {
        let e = this.text[d];
        this.text[d] = e && 'object' == typeof e ? S(e).deepFreeze() : e
    }
    return Object.freeze(this.text)
}, S.prototype.randomProperty = function() {
    const c = Object.keys(this.text);
    return this.text[c[c.length * Math.random() << 0]]
}, S.prototype.getRandomIntInclusive = function(c, d) {
    return c = Math.ceil(c), d = Math.floor(d), Math.floor(Math.random() * (d - c + 1)) + c
}, S.prototype.randomArray = function(c) {
    return c[Math.floor(Math.random() * c.length)]
}, S.prototype.alphaSort = function(c) {
    return c.sort((d, e) => d.localeCompare(e)), this
};