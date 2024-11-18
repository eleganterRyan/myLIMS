import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 清理现有数据
  await prisma.safetyReport.deleteMany();
  await prisma.checkItem.deleteMany();
  await prisma.safetyTask.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.experiment.deleteMany();
  await prisma.laboratory.deleteMany();
  await prisma.researchGroup.deleteMany();
  await prisma.user.deleteMany();

  // 创建管理员用户
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      name: '系统管理员',
      role: 'admin',
      email: 'admin@example.com'
    },
  });

  // 创建多个工作人员用户
  const staffUser1 = await prisma.user.create({
    data: {
      username: 'staff1',
      password: await bcrypt.hash('staff123', 10),
      name: '检查员张三',
      role: 'staff',
      email: 'staff1@example.com'
    },
  });

  const eleganterRyan = await prisma.user.create({
    data: {
      username: 'eleganterRyan',
      password: await bcrypt.hash('123456', 10),
      name: 'Ryan',
      role: 'staff',
      email: 'ryan@example.com'
    },
  });

  const staffUser2 = await prisma.user.create({
    data: {
      username: 'staff2',
      password: await bcrypt.hash('staff123', 10),
      name: '检查员李四',
      role: 'staff',
      email: 'staff2@example.com'
    },
  });

  const staffUser3 = await prisma.user.create({
    data: {
      username: 'staff3',
      password: await bcrypt.hash('staff123', 10),
      name: '检查员王五',
      role: 'staff',
      email: 'staff3@example.com'
    },
  });

  // 创建多个研究员用户
  const researcher1 = await prisma.user.create({
    data: {
      username: 'researcher1',
      password: await bcrypt.hash('123456', 10),
      name: '研究员赵六',
      role: 'researcher',
      email: 'researcher1@example.com'
    },
  });

  const researcher2 = await prisma.user.create({
    data: {
      username: 'researcher2',
      password: await bcrypt.hash('123456', 10),
      name: '研究员钱七',
      role: 'researcher',
      email: 'researcher2@example.com'
    },
  });

  const researcher3 = await prisma.user.create({
    data: {
      username: 'researcher3',
      password: await bcrypt.hash('123456', 10),
      name: '研究员孙八',
      role: 'researcher',
      email: 'researcher3@example.com'
    },
  });

  // 创建实验室
  const lab1 = await prisma.laboratory.create({
    data: {
      name: '生物实验室',
      roomId: 'A201',
      safetyLevel: 2,
      safetyCategory: '生物',
      hazardSources: ['病毒样本', '细菌培养'],
      safetyFacilities: ['生物安全柜', '消毒设备', '防护服']
    },
  });

  // 创建课题组
  const group1 = await prisma.researchGroup.create({
    data: {
      name: '生物技术研究组',
      leaderId: researcher1.id,
      direction: '基因编辑技术研究',
      status: 'active',
      members: {
        connect: [{ id: researcher2.id }, { id: researcher3.id }]
      },
      laboratories: {
        connect: [{ id: lab1.id }]
      }
    },
  });

  // 创建设备
  const equipment1 = await prisma.equipment.create({
    data: {
      name: '高性能显微镜',
      model: 'BX53',
      serialNumber: 'EQ001',
      status: 'available',
      laboratoryId: lab1.id,
    },
  });

  const equipment2 = await prisma.equipment.create({
    data: {
      name: '离心机',
      model: 'CF2000',
      serialNumber: 'EQ002',
      status: 'in_use',
      laboratoryId: lab1.id,
    },
  });

  // 创建维护记录
  await prisma.maintenanceRecord.create({
    data: {
      equipmentId: equipment1.id,
      date: new Date(),
      description: '年度维护检查',
      maintainer: '维护工程师',
      status: 'completed'
    },
  });

  // 创建预约记录
  await prisma.reservation.create({
    data: {
      equipmentId: equipment2.id,
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2小时后
      purpose: '细胞分离实验',
      status: 'approved'
    },
  });

  // 创建实验记录
  await prisma.experiment.create({
    data: {
      title: '基因表达研究',
      description: '研究特定基因在细胞中的表达情况',
      laboratoryId: lab1.id,
      startDate: new Date(),
      status: 'in_progress'
    },
  });

  // 创建安全检查任务
  const safetyTask = await prisma.safetyTask.create({
    data: {
      title: '月度安全检查',
      description: '实验室月度常规安全检查',
      inspectorId: staffUser1.id,
      scheduledAt: new Date(),
      status: 'pending',
      checkItems: {
        create: [
          { content: '实验室通风系统检查', status: 'pending' },
          { content: '消防设备检查', status: 'pending' },
          { content: '危险品存储检查', status: 'pending' }
        ]
      }
    },
  });

  // 创建安全报告
  await prisma.safetyReport.create({
    data: {
      taskId: safetyTask.id,
      title: '安全检查报告',
      inspectorId: staffUser1.id,
      inspectionDate: new Date(),
      status: 'draft',
      summary: '实验室整体安全状况良好'
    },
  });

  console.log('数据库初始化完成');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 