const express = require('express');
const router = express.Router();
const db = require('../models');
const Sequelize = require('sequelize');
const axios = require('axios');

const {
   treasures: Treasures,
   moneyValues: MoneyValues,
   users: Users,
} = require('../config/db');

router.get('/', async (req, res) => {
    const { scope } = req.query;

    if (!['treasures', 'users', 'money_values', 'treasures-money_values'].includes(scope)) {
        return res.status(400).json({ error: 'Invalid scope' })
    }

    let data;
    let error = null;

    switch (scope) {
        case 'treasures':
            try {
                data = await Treasures.findAll();
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }

            break;
        case 'users':
            try {
                data = await Users.findAll();
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }

            break;
        case 'money_values':
            try {
                data = await MoneyValues.findAll();
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }

            break;
        case 'treasures-money_values':
            try {
                data = await Treasures.findAll({
                    include: {
                        model: MoneyValues,
                    },
                });
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }

            break;
        default:
            break;
    }

    return res.json(
        {
            timestamp: new Date(),
            error,
            status: 200,
            result: data,
        },
    );
});

module.exports = router;
