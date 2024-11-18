import React from 'react';
import { Card, Table, Button, Space, Tag } from 'antd';
import type { SafetyReport } from '../../types/safety';

const SafetyReports: React.FC = () => {
  const columns = [
    {
      title: '报告标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '检查人',
      dataIndex: 'inspector',
      key: 'inspector',
    },
    {
      title: '检查日期',
      dataIndex: 'inspectionDate',
      key: 'inspectionDate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap = {
          draft: 'default',
          submitted: 'processing',
          approved: 'success'
        };
        const textMap = {
          draft: '草稿',
          submitted: '已提交',
          approved: '已批准'
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
      render: (_: any, record: SafetyReport) => (
        <Space>
          <Button type="link" onClick={() => handleViewReport(record)}>
            查看
          </Button>
          <Button type="link" onClick={() => handleExportReport(record)}>
            导出
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewReport = (record: SafetyReport) => {
    // TODO: 实现查看报告逻辑
  };

  const handleExportReport = (record: SafetyReport) => {
    // TODO: 实现导出报告逻辑
  };

  return (
    <Card title="安全报告">
      <Table 
        columns={columns}
        dataSource={[]}
        rowKey="id"
      />
    </Card>
  );
};

export default SafetyReports; 