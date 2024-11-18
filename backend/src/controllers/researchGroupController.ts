import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createResearchGroup = async (req: Request, res: Response) => {
  try {
    const { name, leaderId, direction, memberIds, laboratoryIds, status } = req.body;

    const group = await prisma.researchGroup.create({
      data: {
        name,
        leaderId,
        direction,
        status: status || 'active',
        members: {
          connect: memberIds.map((id: number) => ({ id }))
        },
        laboratories: {
          connect: laboratoryIds.map((id: number) => ({ id }))
        }
      },
      include: {
        leader: true,
        members: true,
        laboratories: true
      }
    });

    res.json(group);
  } catch (error) {
    console.error('Create research group error:', error);
    res.status(500).json({ message: '创建课题组失败' });
  }
};

export const getResearchGroups = async (req: Request, res: Response) => {
  try {
    const groups = await prisma.researchGroup.findMany({
      include: {
        leader: true,
        members: true,
        laboratories: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(groups);
  } catch (error) {
    console.error('Get research groups error:', error);
    res.status(500).json({ message: '获取课题组列表失败' });
  }
};

export const updateResearchGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, leaderId, direction, memberIds, laboratoryIds, status } = req.body;

    const group = await prisma.researchGroup.update({
      where: { id: Number(id) },
      data: {
        name,
        leaderId,
        direction,
        status,
        members: {
          set: memberIds.map((id: number) => ({ id }))
        },
        laboratories: {
          set: laboratoryIds.map((id: number) => ({ id }))
        }
      },
      include: {
        leader: true,
        members: true,
        laboratories: true
      }
    });

    res.json(group);
  } catch (error) {
    console.error('Update research group error:', error);
    res.status(500).json({ message: '更新课题组失败' });
  }
};

export const deleteResearchGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.researchGroup.delete({
      where: { id: Number(id) }
    });

    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('Delete research group error:', error);
    res.status(500).json({ message: '删除课题组失败' });
  }
}; 