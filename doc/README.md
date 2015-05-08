The IJavascript kernel is implemented by class `Kernel` in
[`kernel.js`](kernel.js.html) and [`handlers_v4.js`](handlers_v4,js.html). This
kernel makes use of module `jp` in [`jp.js`](jp.js.html) to handle messages in
the IPython/Jupyter protocol.  The kernel also makes use of the Javascript
sessions provided by module `sm` in [`sm.js`](sm.js.html). This module provides
Javascript sessions by means of a `node.js` server implemented in
[`sm_server.js`](../../lib/sm_server.js).
