import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes';
import safetyRoutes from './routes/safetyRoutes';
import laboratoryRoutes from './routes/laboratoryRoutes';
import userRoutes from './routes/userRoutes';
import researchGroupRoutes from './routes/researchGroupRoutes';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: 204
}));

app.options('*', cors());

app.use(express.json());

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/laboratories', laboratoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/research-groups', researchGroupRoutes);

// 添加实验室信息页面路由
app.get('/lab-info/:info', (req: Request, res: Response) => {
  const { info } = req.params;
  try {
    const labInfo = JSON.parse(decodeURIComponent(info));
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${labInfo.实验室名称} - 实验室信息</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              padding: 16px;
              margin: 0;
              background: #f0f2f5;
            }
            .card {
              background: white;
              border-radius: 8px;
              padding: 16px;
              margin-bottom: 16px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .title {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 16px;
              color: #1890ff;
            }
            .item {
              margin-bottom: 12px;
            }
            .label {
              color: #666;
              margin-bottom: 4px;
            }
            .value {
              color: #333;
            }
            .tag {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 4px;
              margin: 2px;
              color: white;
            }
            .tag-red { background: #ff4d4f; }
            .tag-blue { background: #1890ff; }
            .tag-orange { background: #ffa940; }
            .tag-green { background: #52c41a; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="title">${labInfo.实验室名称}</div>
            <div class="item">
              <div class="label">房间编号</div>
              <div class="value">${labInfo.房间编号}</div>
            </div>
            <div class="item">
              <div class="label">安全等级</div>
              <div class="value">
                <span class="tag ${
                  parseInt(labInfo.安全等级) > 3 ? 'tag-red' : 
                  parseInt(labInfo.安全等级) > 2 ? 'tag-orange' : 
                  'tag-green'
                }">${labInfo.安全等级}</span>
              </div>
            </div>
            <div class="item">
              <div class="label">安全分类</div>
              <div class="value">
                <span class="tag tag-blue">${labInfo.安全分类}</span>
              </div>
            </div>
            <div class="item">
              <div class="label">主要危险源</div>
              <div class="value">
                ${labInfo.主要危险源.map((source: string) => 
                  `<span class="tag tag-red">${source}</span>`
                ).join(' ')}
              </div>
            </div>
            <div class="item">
              <div class="label">安全防护设施</div>
              <div class="value">
                ${labInfo.安全防护设施.map((facility: string) => 
                  `<span class="tag tag-blue">${facility}</span>`
                ).join(' ')}
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(400).send('无效的实验室信息');
  }
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('服务器出错了！');
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 