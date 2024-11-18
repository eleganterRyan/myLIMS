import React from 'react';
import { Card, Table, Tag, Button } from 'antd';
import type { SafetyTask } from '../../types/safety';

const SafetyRecords: React.FC = () => {
  const columns = [
    {
      title: '任务标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '检查人',
      dataIndex: 'inspector',
      key: 'inspector',
    },
    {
      title: '检查时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap = {
          completed: 'success',
          in_progress: 'processing',
          pending: 'default'
        };
        const textMap = {
          completed: '已完成',
          in_progress: '进行中',
          pending: '待执行'
        };
        return (
          <Tag color={colorMap[status as keyof typeof colorMap]}>
            {textMap[status as keyof typeof textMap]}
          </Tag>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SafetyTask) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  const handleViewDetail = (record: SafetyTask) => {
    // TODO: 实现查看详情逻辑
  };

  return (
    <Card title="检查记录">
      <Table 
        columns={columns}
        dataSource={[]}
        rowKey="id"
      />
    </Card>
  );
};

export default SafetyRecords; 