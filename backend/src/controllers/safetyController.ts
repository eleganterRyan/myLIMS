import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createSafetyTask = async (req: Request, res: Response) => {
  try {
    const { title, description, inspector, scheduledAt } = req.body;
    console.log('Creating task:', { title, description, inspector, scheduledAt });

    // 首先查找检查人用户
    const inspectorUser = await prisma.user.findUnique({
      where: { username: inspector }
    });

    if (!inspectorUser) {
      return res.status(400).json({ message: '找不到指定的检查人' });
    }

    const task = await prisma.safetyTask.create({
      data: {
        title,
        description,
        inspectorId: inspectorUser.id,  // 使用找到的用户ID
        scheduledAt: new Date(scheduledAt),
        checkItems: {
          create: [
            { content: '实验室通风系统检查', status: 'pending' },
            { content: '消防设备检查', status: 'pending' },
            { content: '危险品存储检查', status: 'pending' },
            { content: '应急设备检查', status: 'pending' },
            { content: '个人防护用品检查', status: 'pending' }
          ]
        }
      },
      include: {
        inspector: true,
        checkItems: true
      }
    });

    console.log('Task created:', task);
    res.json(task);
  } catch (error) {
    console.error('Create safety task error:', error);
    res.status(500).json({ message: '创建安全检查任务失败' });
  }
};

export const getSafetyTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.safetyTask.findMany({
      include: {
        inspector: true,
        checkItems: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get safety tasks error:', error);
    res.status(500).json({ message: '获取安全检查任务列表失败' });
  }
};

export const updateSafetyTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, checkItems } = req.body;

    const task = await prisma.safetyTask.update({
      where: { id: Number(id) },
      data: {
        status,
        checkItems: {
          updateMany: checkItems.map((item: any) => ({
            where: { id: item.id },
            data: {
              status: item.status,
              remarks: item.remarks
            }
          }))
        }
      },
      include: {
        inspector: true,
        checkItems: true
      }
    });

    res.json(task);
  } catch (error) {
    console.error('Update safety task error:', error);
    res.status(500).json({ message: '更新安全检查任务失败' });
  }
}; 