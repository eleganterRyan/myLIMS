# Laboratory Information Management System (LIMS)

一个现代化的实验室信息管理系统，用于管理实验室的日常运营、样品追踪、数据分析等功能。

## 技术栈

### 前端 (Frontend)
- **框架**: React 18
- **语言**: TypeScript
- **UI 框架**: Ant Design 5.x
- **路由**: React Router 6
- **HTTP 客户端**: Axios
- **认证**: React OIDC Context
- **开发工具**: Create React App

### 后端 (Backend)
- **运行时**: Node.js
- **框架**: Express
- **语言**: TypeScript
- **ORM**: Prisma
- **数据库**: PostgreSQL
- **认证**: JWT + bcrypt
- **API**: RESTful

### 开发工具
- **版本控制**: Git
- **包管理**: npm
- **代码规范**: ESLint
- **Node 版本**: 22.11.0

## 项目结构 
LIMS/
├── frontend/ # React 前端应用
├── backend/ # Express 后端服务
├── package.json # 项目配置文件
└── README.md # 项目文档

## 快速开始

1. 克隆项目 bash
git clone <repository-url>
cd LIMS

2. 安装依赖
bash
npm run install:all

3. 启动开发服务器
bash
启动前端
npm run start:frontend
启动后端
npm run start:backend

## 功能特性

- 用户认证与授权
- 样品管理
- 实验数据记录
- 报告生成
- 数据分析
- 库存管理

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

ISC License
