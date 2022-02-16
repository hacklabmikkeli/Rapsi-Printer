const express = require('express')
const cors = require('cors')
const config = require('./config/config')
const printer = require('./printer')()
app = express()

app.use(cors())
app.use(express.json());
app.set('port', config.port)


app.post('/printtopaper', (req, res) => {
    data = req.body.data
    debt = req.body.debt
    name = req.body.name
    printer.print(data, debt, name)
    return res.status(200).send("ok")
})

app.post('/printtopaper2', (req, res) => {
    data = req.body.data
    printer.printData(data)
    return res.status(200).send("ok")
})

let port = app.get('port')
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

