import { deleteTenant, getTenants, Tenant } from '@/services/tenants';
import {
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
  PhoneOutlined,
  PlusOutlined,
  SearchOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Col,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';

const { Text } = Typography;
const { Search } = Input;

const CustomerList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [intentionFilter, setIntentionFilter] = useState<string | undefined>(
    undefined,
  );
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 意向等级映射
  const intentionLevelMap = {
    high: {
      color: 'red',
      text: '高',
      bgColor: '#fff1f0',
      borderColor: '#ffa39e',
    },
    medium: {
      color: 'orange',
      text: '中',
      bgColor: '#fff7e6',
      borderColor: '#ffd591',
    },
    low: {
      color: 'green',
      text: '低',
      bgColor: '#f6ffed',
      borderColor: '#b7eb8f',
    },
  };

  // 户型颜色映射
  const houseTypeColors: Record<string, string> = {
    '1室1厅': 'blue',
    '2室1厅': 'green',
    '2室2厅': 'orange',
    '3室1厅': 'purple',
    '3室2厅': 'red',
    '4室2厅': 'gold',
  };

  // 获取租客列表
  const fetchTenants = async () => {
    setLoading(true);
    try {
      const response = await getTenants({
        current,
        pageSize,
        keyword: searchKeyword || undefined,
        intentionLevel: intentionFilter,
      });
      if (response.success) {
        setTenants(response.data.list);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '获取租客列表失败');
      }
    } catch (error) {
      console.error('获取租客列表失败:', error);
      message.error('获取租客列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 拨打电话
  const makeCall = (phone: string) => {
    window.open(`tel:${phone.replace(/\*/g, '')}`);
    message.info(`正在拨打 ${phone}`);
  };

  // 发送消息
  const sendMessage = (name: string) => {
    message.info(`发送消息给 ${name}`);
  };

  // 删除客户
  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    setLoading(true);
    try {
      const response = await deleteTenant(selectedCustomer.id);
      if (response.success) {
        message.success('删除成功');
        setDeleteModalVisible(false);
        setSelectedCustomer(null);
        fetchTenants(); // 重新获取列表
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      console.error('删除租客失败:', error);
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrent(1);
  };

  // 意向筛选处理
  const handleIntentionFilter = (value: string) => {
    setIntentionFilter(value);
    setCurrent(1);
  };

  // 初始化和搜索条件变化时重新获取数据
  useEffect(() => {
    fetchTenants();
  }, [current, pageSize, searchKeyword, intentionFilter]);

  const columns = [
    {
      title: '客户信息',
      key: 'info',
      width: 300,
      render: (record: Tenant) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            size={48}
            icon={<UserOutlined />}
            style={{
              backgroundColor: intentionLevelMap[record.intentionLevel].color,
              borderRadius: 12,
            }}
          />
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 4,
                color: '#1f1f1f',
              }}
            >
              {record.name}
            </div>
            <Space size={4}>
              <PhoneOutlined style={{ color: '#666', fontSize: 12 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.phone}
              </Text>
            </Space>
            <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
              创建时间:{' '}
              {new Date(record.createTime).toLocaleDateString('zh-CN')}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '需求信息',
      key: 'requirement',
      width: 250,
      render: (record: Tenant) => (
        <div>
          <div style={{ marginBottom: 8 }}>
            <Text strong style={{ color: '#fa541c', fontSize: 16 }}>
              ¥{record.budget.toLocaleString()}/月
            </Text>
          </div>
          <Space wrap size={4}>
            <Tag color={houseTypeColors[record.preferredHouseType] || 'blue'}>
              {record.preferredHouseType}
            </Tag>
            <Tag color="geekblue" style={{ fontSize: 11 }}>
              {record.preferredLocation}
            </Tag>
          </Space>
        </div>
      ),
    },
    {
      title: '意向等级',
      key: 'intentionLevel',
      width: 120,
      render: (record: Tenant) => {
        const level = intentionLevelMap[record.intentionLevel];
        return (
          <div
            style={{
              background: level.bgColor,
              border: `1px solid ${level.borderColor}`,
              borderRadius: 16,
              padding: '4px 12px',
              textAlign: 'center',
              display: 'inline-block',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <StarOutlined style={{ color: level.color, fontSize: 12 }} />
              <span
                style={{ color: level.color, fontSize: 12, fontWeight: 500 }}
              >
                {level.text}意向
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
      width: 120,
      render: (record: Tenant) => (
        <div style={{ fontSize: 12, color: '#666' }}>
          {new Date(record.createTime).toLocaleDateString('zh-CN')}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (record: Tenant) => (
        <Space size={4}>
          <Tooltip title="拨打电话">
            <Button
              type="text"
              icon={<PhoneOutlined />}
              onClick={() => makeCall(record.phone)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="发送消息">
            <Button
              type="text"
              icon={<MessageOutlined />}
              onClick={() => sendMessage(record.name)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="咨询记录">
            <Button
              type="text"
              onClick={() =>
                history.push(`/tenants/consultation?customerId=${record.id}`)
              }
              style={{ color: '#722ed1', fontSize: 12 }}
            >
              咨询
            </Button>
          </Tooltip>
          <Tooltip title="编辑客户">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => history.push(`/tenants/edit/${record.id}`)}
              style={{ color: '#13c2c2' }}
            />
          </Tooltip>
          <Tooltip title="删除客户">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => {
                setSelectedCustomer(record);
                setDeleteModalVisible(true);
              }}
              style={{ color: '#ff4d4f' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '客户管理',
        subTitle: '管理所有客户信息，包括需求跟进、咨询记录等',
        breadcrumb: {},
      }}
      style={{ background: '#f5f7fa' }}
    >
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{total}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>总客户数</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
              border: 'none',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                {tenants.filter((t) => t.intentionLevel === 'high').length}
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>高意向客户</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              border: 'none',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#1890ff' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                {tenants.filter((t) => t.intentionLevel === 'medium').length}
              </div>
              <div style={{ fontSize: 12 }}>中意向客户</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
              border: 'none',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#fa8c16' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                {tenants.filter((t) => t.intentionLevel === 'low').length}
              </div>
              <div style={{ fontSize: 12 }}>低意向客户</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card
        title={
          <Space>
            <TeamOutlined style={{ color: '#1890ff' }} />
            客户列表
          </Space>
        }
        extra={
          <Space>
            <Search
              placeholder="搜索客户姓名或电话"
              allowClear
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
              onSearch={handleSearch}
            />
            <Select
              placeholder="筛选意向等级"
              allowClear
              style={{ width: 120 }}
              options={[
                { label: '高意向', value: 'high' },
                { label: '中意向', value: 'medium' },
                { label: '低意向', value: 'low' },
              ]}
              onChange={handleIntentionFilter}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => history.push('/tenants/add')}
              style={{
                borderRadius: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
            >
              添加客户
            </Button>
          </Space>
        }
        style={{
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Table
          columns={columns}
          dataSource={tenants}
          rowKey="id"
          loading={loading}
          pagination={{
            current,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
            onChange: (page, size) => {
              setCurrent(page);
              setPageSize(size || 10);
            },
          }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as string[]),
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 删除确认弹窗 */}
      <Modal
        title={
          <Space>
            <DeleteOutlined style={{ color: '#ff4d4f' }} />
            确认删除
          </Space>
        }
        open={deleteModalVisible}
        onOk={handleDeleteCustomer}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedCustomer(null);
        }}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true, loading }}
      >
        <p>
          确定要删除客户 <Text code>&quot;{selectedCustomer?.name}&quot;</Text>{' '}
          吗？
        </p>
        <p style={{ color: '#999', fontSize: '12px' }}>
          ⚠️ 删除后将同时删除相关的咨询记录，请谨慎操作。
        </p>
      </Modal>
    </PageContainer>
  );
};

export default CustomerList;
