const express = require('express')

const { authMiddleware } = require('../middleware/auth.middleware')
const { createAccountController, getUserAccountsController, getAccountBalanceController } = require('../controllers/account.controller')


const router = express.Router()


router.post('/create', authMiddleware, createAccountController)

/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/", authMiddleware, getUserAccountsController)

/**
 * - GET /api/accounts/balance/:accountId
 */

router.get("/balance/:accountId", authMiddleware, getAccountBalanceController)

module.exports = router