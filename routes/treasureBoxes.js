const express = require('express');
const router = express.Router();
const db = require('../models');
const Sequelize = require('sequelize');
const axios = require('axios');

const {
   treasures: Treasures,
   moneyValues: MoneyValues,
} = require('../config/db');

router.get('/', async (req, res) => {
  const { latitude, longitude, distance, prizeValue } = req.query;

  let data;
  try {
    data = await findTreasureBoxes(latitude, longitude, distance, prizeValue);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ timestamp: new Date(), ...data });
});

router.get('/ip-address/:ipAddress', async (req, res) => {
    const { distance, prizeValue } = req.query;
    const { ipAddress } = req.params;
    let latitude, longitude;

    let response;
    try {
        response = await axios.get(`https://ipapi.co/${ipAddress}/json`);
        latitude = response.data.latitude;
        longitude = response.data.longitude;
        console.log({latitude, longitude})
    } catch (APIError) {
        return res.status(500).json({ error: APIError.message });
    }

    let data;
    try {
        data = await findTreasureBoxes(latitude, longitude, distance, prizeValue);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.json({ timestamp: new Date(), ...data });
});

const findTreasureBoxes = async (latitude, longitude, distance, prizeValue) =>  {
    let { error, status } = validateParameters(latitude, longitude, distance, prizeValue);

    if (status !== 200) {
        return {
            error,
            status,
            result: null,
        };
    }

    let treasures;

    distance = Number(distance) * 100;

    try {
        treasures = await Treasures.findAll({
            attributes: [
                'id',
                'latitude',
                'longitude',
                'name',
                'createdAt',
                'updatedAt',
                [
                Sequelize.literal(`ST_Distance_Sphere(point(longitude, latitude), point(${longitude}, ${latitude}))`),
                'distance'
                ],
                [
                Sequelize.fn('MIN', Sequelize.col('money_values.amt')),
                'min_amt'
                ]
            ],
            include: [
                {
                model: MoneyValues,
                attributes: []
                }
            ],
            where: Sequelize.literal(`ST_Distance_Sphere(point(longitude, latitude), point(${longitude}, ${latitude})) <= ${distance}`),
            group: ['treasures.id'],
            having: {
                'min_amt': {
                [Sequelize.Op.gte]: Number(prizeValue)
                }
            },
            raw: true
        });
    } catch (DBError) {
        console.log({ DBError });
        error = DBError.message;
        status = 500;
    }

    return {
        error,
        status,
        result: treasures,
    };
};

const validateParameters = (latitude, longitude, distance, prizeValue) => {
    console.log({ latitude, longitude, distance, prizeValue });

    if (!latitude || isNaN(parseFloat(latitude))) {
        return { error: 'Latitude is missing or invalid', status: 400 };
    }

    if (!longitude || isNaN(parseFloat(longitude))) {
       return { error: 'Longitude is missing or invalid', status: 400 };
    }

    if (!distance || ![1, 10].includes(Number(distance))) {
       return { error: 'Distance must be either 1 or 10 (km)', status: 400 };
    }

    if (prizeValue) {
        if (!Number.isInteger(Number(prizeValue))) {
           return { error: 'Prize value must be whole number only', status: 400 };
        }
        if (Number(prizeValue) < 10 || Number(prizeValue) > 30) {
           return { error: 'Prize value only accepts a range of $10 to $30.', status: 400 };
        }
    }

    return { error: null, status: 200 };
};

module.exports = router;
