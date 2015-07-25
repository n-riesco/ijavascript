The [IJavascript kernel](../index.html) is implemented by class `Kernel` in
[`kernel.js`](kernel.js.html) and the message handlers in
[`handlers_v4.js`](handlers_v4.js.html) and
[`handlers_v5.js`](handlers_v5.js.html).

The kernel makes use of [package `jmp`](https://www.npmjs.com/package/jmp) to
parse messages in the IPython/Jupyter messaging protocol, and [package
`nel`](https://www.npmjs.com/package/nel) to provide Javascript REPL sessions.
