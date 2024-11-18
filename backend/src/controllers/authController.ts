import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 这里应该连接数据库验证用户，这里仅作示例
const adminUser = {
  id: 1,
  username: 'admin',
  password: 'admin123', // 实际应用中密码需要加密存储
  role: 'admin'
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    console.log('Login attempt:', { username }); // 添加日志

    // 验证请求体
    if (!username || !password) {
      return res.status(400).json({ 
        message: '用户名和密码不能为空' 
      });
    }

    // 验证用户名和密码
    if (username === adminUser.username && password === adminUser.password) {
      const token = jwt.sign(
        { 
          id: adminUser.id, 
          username: adminUser.username, 
          role: adminUser.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('Login successful:', { username }); // 添加日志

      return res.json({
        token,
        user: {
          id: adminUser.id,
          username: adminUser.username,
          role: adminUser.role
        }
      });
    } else {
      console.log('Login failed:', { username }); // 添加日志
      return res.status(401).json({ 
        message: '用户名或密码错误' 
      });
    }
  } catch (error) {
    console.error('Login error:', error); // 添加错误日志
    return res.status(500).json({ 
      message: '服务器错误，请稍后重试' 
    });
  }
}; 