const express = require('express')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes')
const accountRouter = require('./routes/account.routes')
const transactionRouter = require('./routes/transaction.routes')
const debugRouter = require("./routes/debug.router");
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/accounts', accountRouter)
app.use('/api/transactions', transactionRouter)


if (process.env.NODE_ENV !== "production") {
    app.use("/api/debug", debugRouter);
}

module.exports = app 