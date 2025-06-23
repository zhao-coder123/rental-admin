import {
  BarChartOutlined,
  HomeOutlined,
  RiseOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';

const Statistics: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: '业绩统计',
        breadcrumb: {},
      }}
    >
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月成交数"
              value={8}
              prefix={<RiseOutlined />}
              suffix="套"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月租金总额"
              value={25800}
              prefix="¥"
              precision={0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="房源空置率"
              value={12.5}
              suffix="%"
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃租客数"
              value={156}
              prefix={<UserOutlined />}
              suffix="人"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="统计报表">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <BarChartOutlined
            style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }}
          />
          <h3>业绩统计功能</h3>
          <p>本月成交数、租金总额、房源空置率（3项核心指标）</p>
          <p>月度收益报表和房源分析图表</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Statistics;
