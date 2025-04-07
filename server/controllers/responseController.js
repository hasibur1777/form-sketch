const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { body, validationResult } = require('express-validator');

const createResponse = async (req, res) => {
  const user = req.user.id;
  await body('template_id').isInt().run(req);
  await body('response_data')
    .custom((value) => {
      if (typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('response_data must be a valid object');
      }
      return true;
    })
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { template_id, response_data } = req.body;

  try {
    const response = await prisma.formResponses.create({
      data: {
        template_id: parseInt(template_id),
        response_data: response_data,
        createdBy: user,
      },
    });
    res.status(201).json(response);
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getResponse = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await prisma.formResponses.findUnique({
      where: { id: parseInt(id) },
    });

    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllResponses = async (req, res) => {
  try {
    const responses = await prisma.formResponses.findMany();
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createResponse,
  getResponse,
  getAllResponses,
};
