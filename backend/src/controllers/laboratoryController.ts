import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createLaboratory = async (req: Request, res: Response) => {
  try {
    const { name, roomId, safetyLevel, safetyCategory, hazardSources, safetyFacilities } = req.body;

    const laboratory = await prisma.laboratory.create({
      data: {
        name,
        roomId,
        safetyLevel,
        safetyCategory,
        hazardSources,
        safetyFacilities
      }
    });

    res.json(laboratory);
  } catch (error) {
    console.error('Create laboratory error:', error);
    res.status(500).json({ message: '创建实验室失败' });
  }
};

export const getLaboratories = async (req: Request, res: Response) => {
  try {
    const laboratories = await prisma.laboratory.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(laboratories);
  } catch (error) {
    console.error('Get laboratories error:', error);
    res.status(500).json({ message: '获取实验室列表失败' });
  }
};

export const updateLaboratory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, roomId, safetyLevel, safetyCategory, hazardSources, safetyFacilities } = req.body;

    const laboratory = await prisma.laboratory.update({
      where: { id: Number(id) },
      data: {
        name,
        roomId,
        safetyLevel,
        safetyCategory,
        hazardSources,
        safetyFacilities
      }
    });

    res.json(laboratory);
  } catch (error) {
    console.error('Update laboratory error:', error);
    res.status(500).json({ message: '更新实验室失败' });
  }
};

export const deleteLaboratory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.laboratory.delete({
      where: { id: Number(id) }
    });

    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('Delete laboratory error:', error);
    res.status(500).json({ message: '删除实验室失败' });
  }
}; 