import {
  deleteHouse,
  getHouses,
  House,
  updateHouseStatus,
} from '@/services/houses';
import {
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  HomeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Image,
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

const HouseList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [houses, setHouses] = useState<House[]>([]);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 状态映射
  const statusMap = {
    available: { color: 'green', text: '待租' },
    reserved: { color: 'orange', text: '已预定' },
    rented: { color: 'red', text: '已出租' },
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

  // 获取房源列表
  const fetchHouses = async () => {
    setLoading(true);
    try {
      const response = await getHouses({
        current,
        pageSize,
        keyword: searchKeyword || undefined,
        status: statusFilter,
      });
      if (response.success) {
        setHouses(response.data.list);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '获取房源列表失败');
      }
    } catch (error) {
      console.error('获取房源列表失败:', error);
      message.error('获取房源列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除房源
  const handleDeleteHouse = async () => {
    if (!selectedHouse) return;

    setLoading(true);
    try {
      const response = await deleteHouse(selectedHouse.id);
      if (response.success) {
        message.success('删除成功');
        setDeleteModalVisible(false);
        setSelectedHouse(null);
        fetchHouses(); // 重新获取列表
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      console.error('删除房源失败:', error);
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  // 更新房源状态
  const handleUpdateHouseStatus = async (
    id: string,
    status: House['status'],
  ) => {
    setLoading(true);
    try {
      const response = await updateHouseStatus(id, status);
      if (response.success) {
        message.success('状态更新成功');
        fetchHouses(); // 重新获取列表
      } else {
        message.error(response.message || '状态更新失败');
      }
    } catch (error) {
      console.error('更新房源状态失败:', error);
      message.error('状态更新失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrent(1);
  };

  // 状态筛选处理
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrent(1);
  };

  // 初始化和搜索条件变化时重新获取数据
  useEffect(() => {
    fetchHouses();
  }, [current, pageSize, searchKeyword, statusFilter]);

  const columns = [
    {
      title: '房源信息',
      key: 'info',
      width: 400,
      render: (record: House) => (
        <div style={{ display: 'flex', gap: 12 }}>
          <Image
            width={80}
            height={60}
            src={record.images?.[0] || '/placeholder.jpg'}
            style={{
              objectFit: 'cover',
              borderRadius: 8,
              border: '1px solid #f0f0f0',
            }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            preview={false}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 8,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              <EnvironmentOutlined
                style={{ color: '#1890ff', marginRight: 4 }}
              />
              {record.address}
            </div>
            <Space size={8} wrap>
              <Tag color={houseTypeColors[record.houseType] || 'blue'}>
                <HomeOutlined style={{ fontSize: 10, marginRight: 2 }} />
                {record.houseType}
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.area}㎡
              </Text>
            </Space>
          </div>
        </div>
      ),
    },
    {
      title: '租金',
      key: 'rent',
      width: 120,
      render: (record: House) => (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#fa541c',
            }}
          >
            ¥{record.rent.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: '#999' }}>元/月</div>
        </div>
      ),
    },
    {
      title: '基础设施',
      key: 'facilities',
      width: 200,
      render: (record: House) => (
        <Space wrap>
          {record.facilities?.slice(0, 3).map((facility) => (
            <Tag key={facility} style={{ fontSize: 11, padding: '2px 6px' }}>
              {facility}
            </Tag>
          ))}
          {record.facilities?.length > 3 && (
            <Tag style={{ fontSize: 11, padding: '2px 6px' }}>
              +{record.facilities.length - 3}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (record: House) => {
        const status = statusMap[record.status];
        return (
          <Tag
            color={status.color}
            style={{
              borderRadius: 16,
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {status.text}
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
      width: 140,
      render: (record: House) => (
        <div style={{ fontSize: 12, color: '#666' }}>
          {new Date(record.createTime).toLocaleDateString('zh-CN')}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (record: House) => (
        <Space size={4}>
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => history.push(`/houses/detail/${record.id}`)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="编辑房源">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => history.push(`/houses/edit/${record.id}`)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
          {record.status === 'available' && (
            <Button
              type="text"
              onClick={() => handleUpdateHouseStatus(record.id, 'reserved')}
              style={{ color: '#fa8c16', fontSize: 12 }}
            >
              预定
            </Button>
          )}
          {record.status === 'reserved' && (
            <Button
              type="text"
              onClick={() => handleUpdateHouseStatus(record.id, 'rented')}
              style={{ color: '#f5222d', fontSize: 12 }}
            >
              出租
            </Button>
          )}
          {record.status === 'rented' && (
            <Button
              type="text"
              onClick={() => handleUpdateHouseStatus(record.id, 'available')}
              style={{ color: '#52c41a', fontSize: 12 }}
            >
              空闲
            </Button>
          )}
          <Tooltip title="删除房源">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => {
                setSelectedHouse(record);
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
        title: '房源管理',
        subTitle: '管理所有房源信息，包括添加、编辑、状态更新等操作',
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
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>24</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>总房源数</div>
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
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>15</div>
              <div style={{ fontSize: 12 }}>待租房源</div>
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
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>6</div>
              <div style={{ fontSize: 12 }}>已预定</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
              border: 'none',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#722ed1' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>3</div>
              <div style={{ fontSize: 12 }}>已出租</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card
        title={
          <Space>
            <HomeOutlined style={{ color: '#1890ff' }} />
            房源列表
          </Space>
        }
        extra={
          <Space>
            <Search
              placeholder="搜索房源地址"
              allowClear
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
              onSearch={handleSearch}
            />
            <Select
              placeholder="筛选状态"
              allowClear
              style={{ width: 120 }}
              options={[
                { label: '待租', value: 'available' },
                { label: '已预定', value: 'reserved' },
                { label: '已出租', value: 'rented' },
              ]}
              onChange={handleStatusFilter}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => history.push('/houses/add')}
              style={{
                borderRadius: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
            >
              添加房源
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
          dataSource={houses}
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
        onOk={handleDeleteHouse}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedHouse(null);
        }}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true, loading }}
      >
        <p>
          确定要删除房源 <Text code>&quot;{selectedHouse?.address}&quot;</Text>{' '}
          吗？
        </p>
        <p style={{ color: '#999', fontSize: '12px' }}>
          ⚠️ 删除后无法恢复，请谨慎操作。
        </p>
      </Modal>
    </PageContainer>
  );
};

export default HouseList;
