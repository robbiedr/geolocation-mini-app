const express = require('express');
const router = express.Router();
const db = require('../models');
const Sequelize = require('sequelize');
const axios = require('axios');

const {
   treasures: Treasures,
   moneyValues: MoneyValues,
} = require('../config/db');


/**
 * @swagger
 * /treasure-boxes:
 *   get:
 *     summary: Get all treasure boxes nearby
 *     description: Retrieve a list of treasure boxes nearby
 *     tags:
 *       - Treasure Boxes
 *     parameters:
 *       - name: latitude
 *         in: query
 *         description: Latitude of the user's location (decimal).
 *         required: true
 *         type: number
 *       - name: longitude
 *         in: query
 *         description: Longitude of the user's location (decimal).
 *         required: true
 *         type: number
 *       - name: distance
 *         in: query
 *         description: Maximum distance (in meters) from the user's location to search for prizes (integer, either 1 or 10).
 *         required: true
 *         type: integer
 *       - name: prizeValue
 *         in: query
 *         description: Minimum value of the prizes to retrieve (integer, between 10 and 30).
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A list of nearby prizes.
 *       400:
 *         description: Invalid parameters provided.
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /treasure-boxes/ip-address/{ipAddress}:
 *   get:
 *     summary: Get treasure boxes near an IP address.
 *     description: |
 *       Returns a list of treasure boxes located within a specified distance of the given IP address,
 *       with a prize value within a specified range.
 *     tags:
 *       - Treasure Boxes
 *     parameters:
 *       - name: ipAddress
 *         in: path
 *         description: The IP address to search for treasure boxes near.
 *         required: true
 *         schema:
 *           type: string
 *           format: ipv4
 *       - name: distance
 *         in: query
 *         description: The distance (in miles) within which to search for treasure boxes.
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [1, 10]
 *       - name: prizeValue
 *         in: query
 *         description: The prize value range (in dollars) to filter the treasure boxes by.
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 10
 *           maximum: 30
 *     responses:
 *       200:
 *         description: A list of nearby prizes.
 *       400:
 *         description: Invalid parameters provided.
 *       500:
 *         description: Internal server error
 */
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
