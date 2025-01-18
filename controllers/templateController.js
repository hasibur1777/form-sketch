const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { body, validationResult } = require('express-validator');

const createTemplate = async (req, res) => {
  const user = req.user.id;
  await body('name').isString().notEmpty().run(req);
  await body('structure')
    .custom((value) => {
      if (typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('Structure must be an object');
      }
      return true;
    })
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, structure } = req.body;

  try {
    const template = await prisma.formTemplates.create({
      data: {
        name: name,
        structure: structure,
        createdBy: user,
      },
    });
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create template',
      message: error.message,
    });
  }
};

const getAllTemplates = async (req, res) => {
  try {
    const templates = await prisma.formTemplates.findMany();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
};

const getTemplates = async (req, res) => {
  const { templateID } = req.params;
  const id = parseInt(templateID);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ error: 'Template ID must be a number' });
  }
  try {
    const template = await prisma.formTemplates.findUnique({
      where: { id },
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.status(200).json(template);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to fetch template', message: error });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  getAllTemplates,
};
