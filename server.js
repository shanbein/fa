var app = require('./fund')
var storage = require('./wt-storage')

var port = 3000

mockStore = (req, res, next) => {
  req.webtaskContext = {storage: storage}
  next()
}

app.use(mockStore)
var last = app._router.stack.pop()
app._router.stack = [last].concat(app._router.stack)

app.listen(port)
