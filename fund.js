var express = require('express')
app = express()
module.exports = app

var key = 'name'  // consider support multi-filed key

app.use(express.json())

app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).send('need json format')
  }
  next()
})

app.get('/:key', (req, res) => {
  req.webtaskContext.storage.get(function (error, data) {
      if (error) {
        return res.status(500).send('fail to use storage')  // todo: log error
      }
      if (data === undefined) {
        return res.status(204).send('no data')
      }
      var item = data.list.find((item) => {return item[key] == req.params.key})
      return res.send(item)
  })
})

app.post('/', (req, res) => {
  if (Object.keys(req.body).length == 0) {
    return res.status(400).send('need json data')
  }
  if (!Array.isArray(req.body)) {
      return res.status(400).send('need a list')
  }
  req.webtaskContext.storage.get(function (error, data) {
      if (error) {
        return res.status(500).send('fail to use storage')  // todo: log error
      }
      if (data === undefined) {
        data = {}
        data.list = []
      }
      for (let item of req.body) {
        put(data.list, item)
      }
      req.webtaskContext.storage.set(data, function (error) {
          if (error) {
            return res.status(500).send('fail to use storage')  // todo: log error
          }
          return res.send({count: req.body.length})
      })
  })
})

function put(list, item) {
  var idx = list.findIndex((i)=>{return i.name == item.name})
  if (idx == -1) {
    list.push(item)
  } else {
    list[idx] = item
  }
}
