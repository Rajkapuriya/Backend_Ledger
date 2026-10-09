const accountModel = require('../models/account.model')

const createAccountController = async (req, res) => {

    const user = req.user
    const account = await accountModel.create({ user: user._id, currency: req.body.currency })
    res.status(201).json({ message: "Account created successfully", account })
}


async function getUserAccountsController(req, res) {

    const accountQuery = req.user.systemUser ? {} : { user: req.user._id }
    const accounts = await accountModel.find(accountQuery);

    res.status(200).json({
        accounts
    })
}

async function getAccountBalanceController(req, res) {
    const { accountId } = req.params
    console.log("Account", req.user)
    const account = await accountModel.findOne({ _id: accountId, user: req.user._id })
    if (!account) {
        return res.status(404).json({ message: "Account not found" })
    }
    const balance = await account.getBalance()

    console.log("Balance", balance)
    res.status(200).json({ balance })
}

module.exports = { createAccountController, getUserAccountsController, getAccountBalanceController }