import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    console.log('Getting users from database...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        email: true
      }
    });
    console.log('Found users:', users);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: '获取用户列表失败' });
  }
};

// 获取特定角色的用户
export const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    console.log('Fetching users with role:', role);
    
    // 查询数据库中的用户
    const users = await prisma.user.findMany({
      where: { 
        role: role 
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        email: true
      }
    });
    
    console.log(`Found ${users.length} users with role ${role}:`, users);
    res.json(users);
  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({ message: '获取用户列表失败' });
  }
}; 