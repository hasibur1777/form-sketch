const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const shareTemplate = async (req, res) => {
  const templateId = req.params.templateId;
  const { userEmails } = req.body;
  const userId = req.user.id;

  if (!Array.isArray(userEmails) || userEmails.length === 0) {
    return res
      .status(400)
      .json({ error: 'Please provide at least one email address' });
  }

  try {
    // Check if user is the creator
    const template = await prisma.formTemplates.findUnique({
      where: { id: templateId },
    });

    if (!template || template.createdBy !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get user IDs from emails
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: userEmails,
        },
      },
    });

    // Create sharing records
    const sharePromises = users.map((user) =>
      prisma.formSharing.create({
        data: {
          templateId: templateId,
          sharedWithUserId: user.id,
        },
      })
    );

    await Promise.all(sharePromises);

    res.status(200).json({ message: 'Template shared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to share template' });
  }
};

const checkAccess = async (templateId, userId) => {
  const template = await prisma.formTemplates.findUnique({
    where: { id: templateId },
    include: {
      formSharing: {
        where: {
          sharedWithUserId: userId,
        },
      },
    },
  });

  if (!template) {
    return false;
  }

  return (
    template.createdBy === userId || template.formSharing.length > 0
  );
};

const getSharedForms = async (req, res) => {
  const userId = req.user.id;

  try {
    const sharedTemplates = await prisma.formTemplates.findMany({
      where: {
        formSharing: {
          some: {
            sharedWithUserId: userId,
          },
        },
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(sharedTemplates);
  } catch (error) {
    console.error('Error fetching shared forms:', error);
    res.status(500).json({ error: 'Failed to fetch shared forms' });
  }
};

module.exports = {
  shareTemplate,
  checkAccess,
  getSharedForms,
};
