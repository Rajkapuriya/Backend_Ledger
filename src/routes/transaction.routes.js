const { Router } = require('express')
const { authMiddleware, authSystemUserMiddleware } = require('../middleware/auth.middleware')
const { createTransactionController, createInitialFundsTransaction } = require('../controllers/transaction.controller')

const transactionRoutes = Router()

transactionRoutes.post('/create', authMiddleware, createTransactionController)

transactionRoutes.post("/system/initial-funds", authSystemUserMiddleware, createInitialFundsTransaction)

module.exports = transactionRoutes