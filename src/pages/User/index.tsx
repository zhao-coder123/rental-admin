import {
  changePassword,
  getCurrentUser,
  getUserInfo,
  logout,
  updateProfile,
} from '@/services/auth';
import {
  CalendarOutlined,
  CrownOutlined,
  EditOutlined,
  IdcardOutlined,
  KeyOutlined,
  LogoutOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Statistic,
  Timeline,
} from 'antd';
import { useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'agent';
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
  lastLoginTime?: string;
}

export default function UserPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [recentActivities, setRecentActivities] = useState([
    {
      time: '2024-01-20 14:30',
      action: '暂无活动记录',
      description: '请先进行一些操作',
      type: 'consultation',
    },
  ]);

  // 角色映射
  const roleMap = {
    admin: { text: '管理员', color: 'red', icon: <CrownOutlined /> },
    agent: { text: '业务员', color: 'blue', icon: <UserOutlined /> },
  };

  // 状态映射
  const statusMap = {
    active: { text: '正常', color: 'success' },
    inactive: { text: '禁用', color: 'error' },
  };

  // 安全获取角色信息
  const getRoleInfo = (role: string) => {
    return (
      roleMap[role as keyof typeof roleMap] || {
        text: '用户',
        color: 'blue',
        icon: <UserOutlined />,
      }
    );
  };

  // 安全获取状态信息
  const getStatusInfo = (status: string) => {
    return (
      statusMap[status as keyof typeof statusMap] || {
        text: '正常',
        color: 'success',
      }
    );
  };

  // 获取用户信息
  const fetchProfile = async () => {
    setLoading(true);
    try {
      // 首先尝试从API获取最新用户信息
      try {
        const response = await getCurrentUser();
        if (response.success && response.data) {
          const apiUserInfo = response.data;
          const profileData = {
            id: apiUserInfo.id || '',
            username: apiUserInfo.username || '',
            name: apiUserInfo.name || '',
            role: (apiUserInfo.role as 'admin' | 'agent') || 'agent',
            phone: apiUserInfo.phone || '',
            email: (apiUserInfo as any).email || '',
            status:
              ((apiUserInfo as any).status as 'active' | 'inactive') ||
              'active',
            createTime:
              (apiUserInfo as any).createTime || new Date().toISOString(),
            updateTime:
              (apiUserInfo as any).updateTime || new Date().toISOString(),
            lastLoginTime:
              localStorage.getItem('lastLoginTime') ||
              (apiUserInfo as any).createTime ||
              new Date().toISOString(),
          };
          setProfile(profileData);
          return;
        }
      } catch (apiError) {
        console.warn('从API获取用户信息失败，尝试使用本地缓存:', apiError);
      }

      // 如果API调用失败，从本地存储获取
      const userInfo = getUserInfo();
      if (userInfo) {
        // 确保用户信息包含所有必需字段，并设置默认值
        setProfile({
          id: userInfo.id || '',
          username: userInfo.username || '',
          name: userInfo.name || '',
          role: (userInfo.role as 'admin' | 'agent') || 'agent',
          phone: userInfo.phone || '',
          email: (userInfo as any).email || '', // 安全访问可能不存在的字段
          status:
            ((userInfo as any).status as 'active' | 'inactive') || 'active',
          createTime: (userInfo as any).createTime || new Date().toISOString(),
          updateTime: (userInfo as any).updateTime || new Date().toISOString(),
          lastLoginTime:
            localStorage.getItem('lastLoginTime') ||
            (userInfo as any).createTime ||
            new Date().toISOString(),
        });
      } else {
        message.error('获取用户信息失败');
        history.push('/login');
      }
    } catch (error) {
      message.error('获取用户信息失败');
      console.error('fetchUserProfile error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取用户活动记录
  const fetchUserActivities = async () => {
    try {
      const { getMyRecentActivities } = await import('@/services/activities');
      const response = await getMyRecentActivities(5);
      if (response.success) {
        const activities = response.data.map((activity: any) => ({
          time: new Date(activity.createTime).toLocaleString(),
          action: activity.description,
          description:
            activity.metadata?.houseAddress ||
            activity.metadata?.tenantName ||
            '',
          type: activity.action.toLowerCase().includes('contract')
            ? 'contract'
            : activity.action.toLowerCase().includes('house')
            ? 'house'
            : 'consultation',
        }));
        setRecentActivities(activities);
      }
    } catch (error) {
      console.error('获取用户活动失败:', error);
      // 使用模拟数据作为后备
      setRecentActivities([
        {
          time: '2024-01-20 14:30',
          action: '暂无活动记录',
          description: '请先进行一些操作',
          type: 'consultation',
        },
      ]);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserActivities();
  }, []);

  // 编辑个人信息
  const handleEditProfile = () => {
    if (!profile) return;
    form.setFieldsValue({
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
    });
    setEditModalVisible(true);
  };

  // 保存个人信息
  const handleSaveProfile = async (values: any) => {
    setLoading(true);
    try {
      // 调用API更新个人信息
      const response = await updateProfile({
        name: values.name,
        phone: values.phone,
        email: values.email,
      });

      if (response.success && response.data) {
        // 更新成功，使用API返回的最新数据
        const updatedUserInfo = response.data;
        const updatedProfile = {
          ...profile!,
          name: updatedUserInfo.name || profile!.name,
          phone: updatedUserInfo.phone || '',
          email: (updatedUserInfo as any).email || '',
          updateTime:
            (updatedUserInfo as any).updateTime || new Date().toISOString(),
        };

        setProfile(updatedProfile);

        // 更新本地存储
        localStorage.setItem(
          'userInfo',
          JSON.stringify({
            ...getUserInfo(),
            ...updatedUserInfo,
          }),
        );

        message.success('个人信息更新成功');
        setEditModalVisible(false);
        form.resetFields();
      } else {
        throw new Error(response.message || '更新失败');
      }
    } catch (error: any) {
      console.error('updateProfile error:', error);
      message.error(error.message || '更新失败');
    } finally {
      setLoading(false);
    }
  };

  // 修改密码
  const handleChangePassword = async (values: any) => {
    setLoading(true);
    try {
      // 调用API修改密码
      const response = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (response.success) {
        message.success('密码修改成功，请重新登录');
        passwordForm.resetFields();
        setPasswordModalVisible(false);

        // 延迟退出登录
        setTimeout(() => {
          logout();
          history.push('/login');
        }, 1500);
      } else {
        throw new Error(response.message || '密码修改失败');
      }
    } catch (error: any) {
      console.error('changePassword error:', error);
      message.error(error.message || '密码修改失败');
    } finally {
      setLoading(false);
    }
  };

  // 退出登录
  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出',
      content: '您确定要退出登录吗？',
      onOk: () => {
        logout();
        message.success('已安全退出');
        history.push('/login');
      },
    });
  };

  if (!profile) {
    return (
      <PageContainer>
        <Card loading={true} />
      </PageContainer>
    );
  }

  // 获取当前用户的角色和状态信息
  const currentRoleInfo = getRoleInfo(profile.role);
  const currentStatusInfo = getStatusInfo(profile.status);

  // 模拟统计数据
  const stats = {
    totalHouses: 12,
    totalContracts: 8,
    totalTenants: 15,
    monthlyPerformance: 85,
  };

  return (
    <PageContainer
      title="个人资料"
      extra={
        <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
          退出登录
        </Button>
      }
      breadcrumb={{
        routes: [
          { path: '/', breadcrumbName: '首页' },
          { path: '/user', breadcrumbName: '个人资料' },
        ],
      }}
    >
      <Row gutter={24}>
        <Col span={8}>
          {/* 基本信息卡片 */}
          <Card
            style={{ marginBottom: 24 }}
            actions={[
              <Button
                key="edit"
                type="link"
                icon={<EditOutlined />}
                onClick={handleEditProfile}
              >
                编辑资料
              </Button>,
              <Button
                key="password"
                type="link"
                icon={<KeyOutlined />}
                onClick={() => setPasswordModalVisible(true)}
              >
                修改密码
              </Button>,
            ]}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar
                size={80}
                icon={<UserOutlined />}
                style={{
                  backgroundColor:
                    currentRoleInfo.color === 'red' ? '#f50' : '#1890ff',
                  marginBottom: 16,
                }}
              />
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                {profile.name}
              </div>
              <Space>
                <Badge
                  status={currentStatusInfo.color as any}
                  text={
                    <span>
                      {currentRoleInfo.icon}
                      <span style={{ marginLeft: 4 }}>
                        {currentRoleInfo.text}
                      </span>
                    </span>
                  }
                />
              </Space>
            </div>

            <Descriptions column={1} size="small">
              <Descriptions.Item label="用户名">
                <Space>
                  <IdcardOutlined />
                  {profile.username}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="手机号">
                <Space>
                  <PhoneOutlined />
                  {profile.phone || '未设置'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                <Space>
                  <MailOutlined />
                  {profile.email || '未设置'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">
                <Space>
                  <CalendarOutlined />
                  {new Date(profile.createTime).toLocaleDateString()}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="最后登录">
                <Space>
                  <CalendarOutlined />
                  {new Date(
                    profile.lastLoginTime || profile.createTime,
                  ).toLocaleString()}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 业绩统计 */}
          {profile.role === 'agent' && (
            <Card title="个人业绩" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="管理房源"
                    value={stats.totalHouses}
                    suffix="套"
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="签约合同"
                    value={stats.totalContracts}
                    suffix="份"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={12} style={{ marginTop: 16 }}>
                  <Statistic
                    title="服务客户"
                    value={stats.totalTenants}
                    suffix="人"
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Col>
                <Col span={12} style={{ marginTop: 16 }}>
                  <Statistic
                    title="月度完成度"
                    value={stats.monthlyPerformance}
                    suffix="%"
                    valueStyle={{ color: '#fa541c' }}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </Col>

        <Col span={16}>
          {/* 详细信息 */}
          <Card title="详细信息" style={{ marginBottom: 24 }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="用户ID" span={1}>
                {profile.id}
              </Descriptions.Item>
              <Descriptions.Item label="账号状态" span={1}>
                <Badge
                  status={currentStatusInfo.color as any}
                  text={currentStatusInfo.text}
                />
              </Descriptions.Item>
              <Descriptions.Item label="用户角色" span={1}>
                <Space>
                  {currentRoleInfo.icon}
                  {currentRoleInfo.text}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="手机号码" span={1}>
                {profile.phone || '未设置'}
              </Descriptions.Item>
              <Descriptions.Item label="电子邮箱" span={1}>
                {profile.email || '未设置'}
              </Descriptions.Item>
              <Descriptions.Item label="注册时间" span={1}>
                {new Date(profile.createTime).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="最后更新" span={2}>
                {new Date(profile.updateTime).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 最近活动 */}
          <Card title="最近活动">
            <Timeline>
              {recentActivities.map((activity, index) => (
                <Timeline.Item
                  key={index}
                  color={
                    activity.type === 'contract'
                      ? 'green'
                      : activity.type === 'house'
                      ? 'blue'
                      : 'orange'
                  }
                >
                  <div style={{ marginBottom: 4 }}>
                    <strong>{activity.action}</strong>
                    <span
                      style={{ color: '#999', marginLeft: 8, fontSize: 12 }}
                    >
                      {activity.time}
                    </span>
                  </div>
                  <div style={{ color: '#666', fontSize: 13 }}>
                    {activity.description}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* 编辑资料模态框 */}
      <Modal
        title="编辑个人资料"
        open={editModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setEditModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveProfile}>
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
          >
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onOk={() => passwordForm.submit()}
        onCancel={() => setPasswordModalVisible(false)}
        confirmLoading={loading}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="当前密码"
            name="currentPassword"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度至少6位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
