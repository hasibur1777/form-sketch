const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { body, validationResult } = require('express-validator');

const createTemplate = async (req, res) => {
  const user = req.user.id;
  await body('name').isString().notEmpty().run(req);
  await body('structure')
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
        } catch (e) {
          throw new Error('Structure must be a valid JSON object');
        }
      } else if (typeof value !== 'object') {
        throw new Error('Structure must be a valid JSON object');
      }
      return true;
    })
    .withMessage('Invalid structure format')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, structure } = req.body;

  try {
    const parsedStructure =
      typeof structure === 'string'
        ? JSON.parse(structure)
        : structure;
    const template = await prisma.formTemplates.create({
      data: {
        name: name,
        structure: parsedStructure,
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

const getTemplateResponsesxx = async (req, res) => {
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
      select: { name: true },
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const responses = await prisma.formResponses.findMany({
      where: { template_id: id },
      select: {
        response_data: true,
        q_structure: true,
      },
    });

    if (!responses || responses.length === 0) {
      return res
        .status(404)
        .json({ error: 'No responses found for this template' });
    }

    // ---- Merge responses with q_structure ----
    const fieldMap = {};

    responses.forEach((r) => {
      // Ensure correct type
      const qStruct =
        typeof r.q_structure === 'string'
          ? JSON.parse(r.q_structure)
          : r.q_structure;
      const rData =
        typeof r.response_data === 'string'
          ? JSON.parse(r.response_data)
          : r.response_data;

      qStruct.fields.forEach((f) => {
        if (!fieldMap[f.id]) {
          fieldMap[f.id] = {
            id: f.id,
            labels: new Set(),
            values: [],
          };
        }
        fieldMap[f.id].labels.add(f.label);
        fieldMap[f.id].values.push(rData[f.id] ?? null);
      });

      // Make sure all known fields are aligned across responses
      Object.keys(fieldMap).forEach((fid) => {
        if (!(fid in rData)) fieldMap[fid].values.push(null);
      });
    });

    const merged = Object.values(fieldMap).map((f) => ({
      id: f.id,
      label: Array.from(f.labels).join(' /##/ '),
      values: f.values,
    }));

    res.status(200).json({
      templateName: template.name,
      mergedFields: merged,
      responsesCount: responses.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to fetch responses',
      message: error.message,
    });
  }
};

const getTemplateResponses = async (req, res) => {
  const { templateID } = req.params;
  const id = Number(templateID);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ error: 'Template ID must be a number' });
  }

  try {
    const template = await prisma.formTemplates.findUnique({
      where: { id },
      select: { name: true },
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const responses = await prisma.formResponses.findMany({
      where: { template_id: id },
      select: { response_data: true, q_structure: true },
    });

    if (!responses.length) {
      return res
        .status(404)
        .json({ error: 'No responses found for this template' });
    }

    // Build field map only once
    const fieldMap = {};
    const responseCount = responses.length;

    responses.forEach((r) => {
      const qStruct = r.q_structure;
      const rData = r.response_data;

      qStruct.fields.forEach((f) => {
        if (!fieldMap[f.id]) {
          fieldMap[f.id] = {
            id: f.id,
            labels: new Set(),
            values: [],
          };
        }
        fieldMap[f.id].labels.add(f.label);
      });

      // fill values
      Object.keys(fieldMap).forEach((fid) => {
        fieldMap[fid].values.push(rData[fid] ?? null);
      });
    });

    const mergedFields = Object.values(fieldMap).map((f) => ({
      id: f.id,
      label: Array.from(f.labels).join(' /##/ '),
      values: f.values.map((v) =>
        typeof v === 'object' && v !== null
          ? Object.entries(v)
              .filter(([_, val]) => val)
              .map(([k]) => k)
              .join(', ')
          : v
      ),
    }));

    res.json({
      templateName: template.name,
      responsesCount: responseCount,
      mergedFields,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: 'Failed to fetch responses',
        message: error.message,
      });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  getAllTemplates,
  getTemplateResponses,
};
