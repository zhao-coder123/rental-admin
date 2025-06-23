import { appointmentAPI, consultationAPI, statsAPI } from '@/services/api';
import {
  AlertOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  HomeOutlined,
  MessageOutlined,
  PhoneOutlined,
  RiseOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  List,
  message,
  Modal,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Timeline,
} from 'antd';
import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [todoModalVisible, setTodoModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取仪表盘统计
  const fetchStats = async () => {
    try {
      const response = await statsAPI.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  // 获取待处理咨询
  const fetchPendingConsultations = async () => {
    try {
      const response = await consultationAPI.getConsultationList({
        status: 'pending',
        pageSize: 10,
      });
      if (response.success) {
        // 这里可以处理咨询数据，暂时不需要存储到状态中
      }
    } catch (error) {
      console.error('获取咨询列表失败:', error);
    }
  };

  // 获取今日预约
  const fetchTodayAppointments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await appointmentAPI.getAppointmentList({
        appointmentDate: today,
        pageSize: 10,
      });
      if (response.success) {
        // 这里可以处理预约数据，暂时不需要存储到状态中
      }
    } catch (error) {
      console.error('获取预约列表失败:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchStats(),
        fetchPendingConsultations(),
        fetchTodayAppointments(),
      ]);
    };
    fetchData();
  }, []);

  // 拨打电话
  const makeCall = (phone: string) => {
    // 在实际应用中，这里可以集成电话服务
    window.open(`tel:${phone}`);
  };

  // 业绩统计卡片
  const StatsCards = () => (
    <Row gutter={16}>
      <Col span={6}>
        <Card
          hoverable
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: 12,
          }}
        >
          <Statistic
            title={
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>房源总数</span>
            }
            value={stats?.houses?.total || 8}
            prefix={<TrophyOutlined style={{ color: '#fff' }} />}
            suffix={<span style={{ color: 'rgba(255,255,255,0.8)' }}>套</span>}
            valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}
          />
          <div style={{ marginTop: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
              较上月增长 <span style={{ color: '#52c41a' }}>+15%</span>
            </span>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card
          hoverable
          style={{
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            border: 'none',
            borderRadius: 12,
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(0,0,0,0.7)' }}>合同总数</span>}
            value={stats?.contracts?.total || 5}
            prefix={<span style={{ color: '#fa8c16', fontSize: 16 }}>📋</span>}
            precision={0}
            suffix={<span style={{ color: 'rgba(0,0,0,0.6)' }}>份</span>}
            valueStyle={{ color: '#fa8c16', fontSize: 28, fontWeight: 'bold' }}
          />
          <div style={{ marginTop: 8 }}>
            <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: 12 }}>
              生效中{' '}
              <span style={{ color: '#52c41a' }}>
                {stats?.contracts?.active || 3}份
              </span>
            </span>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card
          hoverable
          style={{
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            border: 'none',
            borderRadius: 12,
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(0,0,0,0.7)' }}>月度收入</span>}
            value={stats?.contracts?.monthlyRevenue || 25800}
            suffix={<span style={{ color: 'rgba(0,0,0,0.6)' }}>元</span>}
            prefix={<span style={{ color: '#1890ff', fontSize: 16 }}>💰</span>}
            valueStyle={{ color: '#1890ff', fontSize: 28, fontWeight: 'bold' }}
          />
          <div style={{ marginTop: 8 }}>
            <Progress
              percent={85}
              size="small"
              showInfo={false}
              strokeColor="#52c41a"
            />
            <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: 12 }}>
              目标完成 85%
            </span>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card
          hoverable
          style={{
            background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
            border: 'none',
            borderRadius: 12,
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(0,0,0,0.7)' }}>租客总数</span>}
            value={stats?.tenants?.total || 156}
            prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
            suffix={<span style={{ color: 'rgba(0,0,0,0.6)' }}>人</span>}
            valueStyle={{ color: '#722ed1', fontSize: 28, fontWeight: 'bold' }}
          />
          <div style={{ marginTop: 8 }}>
            <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: 12 }}>
              高意向客户{' '}
              <span style={{ color: '#f5222d' }}>
                {stats?.tenants?.highIntention || 28}人
              </span>
            </span>
          </div>
        </Card>
      </Col>
    </Row>
  );

  // 待办事项
  const todoItems = [
    {
      id: 1,
      title: '跟进李先生咨询',
      type: '咨询跟进',
      priority: 'high' as const,
      dueTime: '14:00',
      phone: '138****1234',
      status: 'pending',
    },
    {
      id: 2,
      title: '回访王女士房源需求',
      type: '客户回访',
      priority: 'medium' as const,
      dueTime: '16:00',
      phone: '139****5678',
      status: 'processing',
    },
    {
      id: 3,
      title: '联系张先生看房安排',
      type: '带看服务',
      priority: 'high' as const,
      dueTime: '19:00',
      phone: '137****9012',
      status: 'pending',
    },
    {
      id: 4,
      title: '更新朝阳区房源信息',
      type: '房源维护',
      priority: 'low' as const,
      dueTime: '明日',
      status: 'scheduled',
    },
    {
      id: 5,
      title: '拓展海淀区新房源',
      type: '房源拓展',
      priority: 'medium' as const,
      dueTime: '明日',
      status: 'processing',
    },
  ];

  // 最近活动
  const recentActivities = [
    {
      id: 1,
      action: '新增房源',
      description: '朝阳区三里屯2室1厅',
      time: '2小时前',
      type: 'success',
      icon: <HomeOutlined />,
    },
    {
      id: 2,
      action: '客户成交',
      description: '张先生成功租下朝阳区房源',
      time: '4小时前',
      type: 'info',
      icon: <UserOutlined />,
    },
    {
      id: 3,
      action: '佣金到账',
      description: '收到房源成交佣金 ¥3500',
      time: '6小时前',
      type: 'success',
      icon: <RiseOutlined />,
    },
    {
      id: 4,
      action: '客户咨询',
      description: '李女士咨询海淀区房源',
      time: '8小时前',
      type: 'warning',
      icon: <MessageOutlined />,
    },
  ];

  const priorityColors: Record<'high' | 'medium' | 'low', string> = {
    high: 'red',
    medium: 'orange',
    low: 'green',
  };

  return (
    <PageContainer
      header={{
        title: '中介工作台',
        breadcrumb: {},
        subTitle: '今天是个好日子，让我们一起创造业绩！',
        extra: [
          <Button key="refresh" onClick={() => window.location.reload()}>
            刷新数据
          </Button>,
        ],
      }}
      style={{ background: '#f5f7fa' }}
    >
      {/* 业绩统计 */}
      <StatsCards />

      <Row gutter={16} style={{ marginTop: 24 }}>
        {/* 任务看板 */}
        <Col span={8}>
          <ProCard
            title={
              <Space>
                <FireOutlined style={{ color: '#fa541c' }} />
                今日待办
                <Badge
                  count={todoItems.length}
                  style={{ backgroundColor: '#fa541c' }}
                />
              </Space>
            }
            extra={
              <Button
                type="primary"
                size="small"
                onClick={() => setTodoModalVisible(true)}
                style={{ borderRadius: 6 }}
              >
                添加任务
              </Button>
            }
            style={{ borderRadius: 12, minHeight: 400 }}
          >
            <List
              size="small"
              dataSource={todoItems}
              renderItem={(item, index) => (
                <List.Item
                  key={item.id}
                  style={{
                    padding: '12px 0',
                    borderBottom:
                      index === todoItems.length - 1
                        ? 'none'
                        : '1px solid #f0f0f0',
                  }}
                  actions={[
                    item.phone && (
                      <Button
                        key="call"
                        size="small"
                        type="text"
                        icon={<PhoneOutlined />}
                        onClick={() => makeCall(item.phone)}
                        style={{ color: '#52c41a' }}
                      />
                    ),
                    <Button
                      key="complete"
                      size="small"
                      type="text"
                      icon={<CheckCircleOutlined />}
                      style={{ color: '#1890ff' }}
                    >
                      完成
                    </Button>,
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size="small"
                        style={{
                          backgroundColor: priorityColors[item.priority],
                          fontSize: 12,
                        }}
                      >
                        {item.priority === 'high'
                          ? '高'
                          : item.priority === 'medium'
                          ? '中'
                          : '低'}
                      </Avatar>
                    }
                    title={
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        {item.title}
                      </div>
                    }
                    description={
                      <Space size={4} direction="vertical">
                        <Tag color="blue">{item.type}</Tag>
                        <span style={{ fontSize: 12, color: '#999' }}>
                          <ClockCircleOutlined /> {item.dueTime}
                        </span>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </ProCard>
        </Col>

        {/* 最近活动 */}
        <Col span={8}>
          <ProCard
            title={
              <Space>
                <AlertOutlined style={{ color: '#1890ff' }} />
                最近活动
              </Space>
            }
            style={{ borderRadius: 12, minHeight: 400 }}
          >
            <Timeline
              items={recentActivities.map((activity) => ({
                key: activity.id,
                dot: (
                  <Avatar
                    size={20}
                    icon={activity.icon}
                    style={{
                      backgroundColor:
                        activity.type === 'success'
                          ? '#52c41a'
                          : activity.type === 'warning'
                          ? '#faad14'
                          : '#1890ff',
                      fontSize: 10,
                    }}
                  />
                ),
                children: (
                  <div>
                    <div
                      style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}
                    >
                      {activity.action}
                    </div>
                    <div
                      style={{ fontSize: 12, color: '#666', marginBottom: 4 }}
                    >
                      {activity.description}
                    </div>
                    <div style={{ fontSize: 11, color: '#999' }}>
                      {activity.time}
                    </div>
                  </div>
                ),
              }))}
            />
          </ProCard>
        </Col>

        {/* 快速操作 */}
        <Col span={8}>
          <ProCard
            title={
              <Space>
                <RiseOutlined style={{ color: '#722ed1' }} />
                快速操作
              </Space>
            }
            style={{ borderRadius: 12, minHeight: 400 }}
          >
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Card
                  hoverable
                  size="small"
                  style={{
                    textAlign: 'center',
                    borderRadius: 8,
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                  }}
                  bodyStyle={{ padding: 16 }}
                  onClick={() => (window.location.href = '/houses/add')}
                >
                  <HomeOutlined
                    style={{ fontSize: 24, color: '#fff', marginBottom: 8 }}
                  />
                  <div style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>
                    添加房源
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  hoverable
                  size="small"
                  style={{
                    textAlign: 'center',
                    borderRadius: 8,
                    background:
                      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                    border: 'none',
                  }}
                  bodyStyle={{ padding: 16 }}
                  onClick={() => (window.location.href = '/tenants/list')}
                >
                  <UserOutlined
                    style={{ fontSize: 24, color: '#fa8c16', marginBottom: 8 }}
                  />
                  <div
                    style={{ color: '#fa8c16', fontSize: 12, fontWeight: 500 }}
                  >
                    添加租客
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  hoverable
                  size="small"
                  style={{
                    textAlign: 'center',
                    borderRadius: 8,
                    background:
                      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    border: 'none',
                  }}
                  bodyStyle={{ padding: 16 }}
                  onClick={() =>
                    (window.location.href = '/tenants/consultation')
                  }
                >
                  <MessageOutlined
                    style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }}
                  />
                  <div
                    style={{ color: '#1890ff', fontSize: 12, fontWeight: 500 }}
                  >
                    咨询跟进
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  hoverable
                  size="small"
                  style={{
                    textAlign: 'center',
                    borderRadius: 8,
                    background:
                      'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
                    border: 'none',
                  }}
                  bodyStyle={{ padding: 16 }}
                  onClick={() => (window.location.href = '/statistics')}
                >
                  <TrophyOutlined
                    style={{ fontSize: 24, color: '#722ed1', marginBottom: 8 }}
                  />
                  <div
                    style={{ color: '#722ed1', fontSize: 12, fontWeight: 500 }}
                  >
                    查看统计
                  </div>
                </Card>
              </Col>
            </Row>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                今日提醒
              </div>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Tag color="red" style={{ width: '100%', padding: '4px 8px' }}>
                  <AlertOutlined /> 8个高意向客户
                </Tag>
                <Tag
                  color="orange"
                  style={{ width: '100%', padding: '4px 8px' }}
                >
                  <MessageOutlined /> 12个咨询待回复
                </Tag>
                <Tag color="blue" style={{ width: '100%', padding: '4px 8px' }}>
                  <HomeOutlined /> 5套房源待更新
                </Tag>
              </Space>
            </div>
          </ProCard>
        </Col>
      </Row>

      {/* 数据概览 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <ProCard
            title={
              <Space>
                <BarChartOutlined style={{ color: '#52c41a' }} />
                今日数据概览
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: '#52c41a',
                    }}
                  >
                    15
                  </div>
                  <div style={{ fontSize: 12, color: '#999' }}>新增客户</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: '#1890ff',
                    }}
                  >
                    8
                  </div>
                  <div style={{ fontSize: 12, color: '#999' }}>新增咨询</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: '#fa8c16',
                    }}
                  >
                    3
                  </div>
                  <div style={{ fontSize: 12, color: '#999' }}>成交房源</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: '#722ed1',
                    }}
                  >
                    ¥12,800
                  </div>
                  <div style={{ fontSize: 12, color: '#999' }}>今日佣金</div>
                </div>
              </Col>
            </Row>
          </ProCard>
        </Col>
      </Row>

      {/* 添加待办事项弹窗 */}
      <Modal
        title="添加待办事项"
        open={todoModalVisible}
        onOk={() => {
          message.success('待办事项添加成功');
          setTodoModalVisible(false);
          form.resetFields();
        }}
        onCancel={() => setTodoModalVisible(false)}
        okText="添加"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="事项标题"
            name="title"
            rules={[{ required: true, message: '请输入事项标题' }]}
          >
            <Input placeholder="请输入待办事项" />
          </Form.Item>
          <Form.Item label="备注" name="description">
            <Input.TextArea rows={3} placeholder="可选的详细描述" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Dashboard;
