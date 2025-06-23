import {
  contractStatusOptions,
  getContractDetail,
  paymentMethodOptions,
  updateContractStatus,
} from '@/services/contracts';
import type { Contract } from '@/types';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FilePdfOutlined,
  HomeOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate, useParams } from '@umijs/max';
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  message,
  Modal,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Timeline,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

const { confirm } = Modal;

export default function ContractDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取合同详情
  const fetchContractDetail = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await getContractDetail(id);
      if (response.success) {
        setContract(response.data);
      }
    } catch (error) {
      message.error('获取合同详情失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContractDetail();
  }, [id]);

  // 更新合同状态
  const handleStatusUpdate = (status: Contract['status']) => {
    if (!contract) return;

    const statusMap = {
      draft: '保存草稿',
      signed: '签署',
      active: '激活',
      expired: '标记为已到期',
      terminated: '终止',
    };

    confirm({
      title: `确定要${statusMap[status]}这个合同吗？`,
      content: '此操作将更新合同状态',
      onOk: async () => {
        try {
          const response = await updateContractStatus(contract.id, status);
          if (response.success) {
            message.success(`合同${statusMap[status]}成功`);
            fetchContractDetail();
          }
        } catch (error) {
          message.error(`${statusMap[status]}失败`);
        }
      },
    });
  };

  // 计算合同剩余天数
  const getRemainingDays = () => {
    if (!contract) return 0;
    const endDate = moment(contract.endDate);
    const today = moment();
    return endDate.diff(today, 'days');
  };

  // 计算合同进度
  const getProgress = () => {
    if (!contract) return 0;
    const startDate = moment(contract.startDate);
    const endDate = moment(contract.endDate);
    const today = moment();

    const total = endDate.diff(startDate, 'days');
    const passed = today.diff(startDate, 'days');

    return Math.min(Math.max((passed / total) * 100, 0), 100);
  };

  // 获取状态配置
  const getStatusConfig = (status: string) => {
    return (
      contractStatusOptions.find((option) => option.value === status) || {
        label: status,
        color: 'default',
      }
    );
  };

  // 获取支付方式文本
  const getPaymentMethodText = (method: string) => {
    const option = paymentMethodOptions.find((opt) => opt.value === method);
    return option?.label || method;
  };

  // 租金记录表格列
  const rentColumns = [
    {
      title: '期数',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: '应付日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={
            status === 'paid'
              ? 'success'
              : status === 'overdue'
              ? 'error'
              : 'processing'
          }
          text={
            status === 'paid' ? '已付' : status === 'overdue' ? '逾期' : '待付'
          }
        />
      ),
    },
  ];

  // 模拟租金记录数据
  const rentData = contract
    ? [
        {
          key: '1',
          period: '2024年1月',
          dueDate: '2024-01-01',
          amount: contract.rent,
          status: 'paid',
        },
        {
          key: '2',
          period: '2024年2月',
          dueDate: '2024-02-01',
          amount: contract.rent,
          status: 'paid',
        },
        {
          key: '3',
          period: '2024年3月',
          dueDate: '2024-03-01',
          amount: contract.rent,
          status: 'pending',
        },
      ]
    : [];

  if (loading) {
    return (
      <PageContainer>
        <Card loading={true} />
      </PageContainer>
    );
  }

  if (!contract) {
    return (
      <PageContainer>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <ExclamationCircleOutlined
              style={{ fontSize: 48, color: '#faad14' }}
            />
            <div style={{ marginTop: 16 }}>合同不存在</div>
            <Button
              type="primary"
              style={{ marginTop: 16 }}
              onClick={() => navigate('/contracts/list')}
            >
              返回列表
            </Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  const statusConfig = getStatusConfig(contract.status);
  const remainingDays = getRemainingDays();
  const progress = getProgress();

  return (
    <PageContainer
      title="合同详情"
      extra={
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/contracts/list')}
          >
            返回列表
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/contracts/edit/${contract.id}`)}
          >
            编辑合同
          </Button>
        </Space>
      }
      breadcrumb={{
        routes: [
          { path: '/', breadcrumbName: '首页' },
          { path: '/contracts', breadcrumbName: '合同管理' },
          { path: '/contracts/list', breadcrumbName: '合同列表' },
          { path: '', breadcrumbName: '合同详情' },
        ],
      }}
    >
      {/* 概览统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="月租金"
              value={contract.rent}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="押金"
              value={contract.deposit}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="剩余天数"
              value={remainingDays}
              prefix={<CalendarOutlined />}
              suffix="天"
              valueStyle={{
                color:
                  remainingDays < 30
                    ? '#f5222d'
                    : remainingDays < 90
                    ? '#faad14'
                    : '#3f8600',
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ marginBottom: 8 }}>合同进度</div>
            <Progress
              percent={Math.round(progress)}
              size="small"
              status={contract.status === 'expired' ? 'exception' : 'normal'}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          {/* 基本信息 */}
          <Card title="基本信息" style={{ marginBottom: 16 }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="合同编号">
                {contract.id}
              </Descriptions.Item>
              <Descriptions.Item label="合同状态">
                <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="房源地址" span={2}>
                <Space>
                  <HomeOutlined />
                  {contract.houseAddress}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="租客姓名">
                <Space>
                  <UserOutlined />
                  {contract.tenantName}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="月租金">
                <span style={{ color: '#f50', fontWeight: 'bold' }}>
                  ¥{contract.rent.toLocaleString()}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="押金">
                ¥{contract.deposit.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="支付方式">
                {getPaymentMethodText(contract.paymentMethod)}
              </Descriptions.Item>
              <Descriptions.Item label="合同期限">
                {contract.startDate}
              </Descriptions.Item>
              <Descriptions.Item label="到期日期">
                <span
                  style={{
                    color: remainingDays < 30 ? '#f5222d' : '#666',
                  }}
                >
                  {contract.endDate}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="签署日期">
                {contract.signDate
                  ? moment(contract.signDate).format('YYYY-MM-DD HH:mm')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {moment(contract.createTime).format('YYYY-MM-DD HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {moment(contract.updateTime).format('YYYY-MM-DD HH:mm')}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 租金记录 */}
          <Card title="租金记录">
            <Table
              columns={rentColumns}
              dataSource={rentData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col span={8}>
          {/* 操作面板 */}
          <Card title="操作" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {contract.status === 'draft' && (
                <Button
                  type="primary"
                  block
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleStatusUpdate('signed')}
                >
                  签署合同
                </Button>
              )}
              {contract.status === 'signed' && (
                <Button
                  type="primary"
                  block
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleStatusUpdate('active')}
                >
                  激活合同
                </Button>
              )}
              {(contract.status === 'active' ||
                contract.status === 'signed') && (
                <Button
                  danger
                  block
                  onClick={() => handleStatusUpdate('terminated')}
                >
                  终止合同
                </Button>
              )}
              <Button block icon={<FilePdfOutlined />}>
                下载合同
              </Button>
              <Button block icon={<UploadOutlined />}>
                上传签署版
              </Button>
            </Space>
          </Card>

          {/* 合同文件 */}
          <Card title="合同文件">
            {contract.contractFile ? (
              <div style={{ textAlign: 'center' }}>
                <FilePdfOutlined style={{ fontSize: 48, color: '#f5222d' }} />
                <div style={{ marginTop: 8 }}>合同文件.pdf</div>
                <Button type="link" icon={<DownloadOutlined />} size="small">
                  下载
                </Button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#999' }}>
                <FilePdfOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                <div style={{ marginTop: 8 }}>暂无合同文件</div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 合同状态时间线 */}
      <Card title="状态变更记录" style={{ marginTop: 16 }}>
        <Timeline>
          <Timeline.Item color="green" dot={<CheckCircleOutlined />}>
            <div style={{ marginBottom: 4 }}>
              <strong>合同创建</strong>
              <span style={{ color: '#666', marginLeft: 8 }}>
                {moment(contract.createTime).format('YYYY-MM-DD HH:mm')}
              </span>
            </div>
            <div style={{ color: '#666' }}>合同已创建，状态为草稿</div>
          </Timeline.Item>

          {contract.signDate && (
            <Timeline.Item color="blue" dot={<CheckCircleOutlined />}>
              <div style={{ marginBottom: 4 }}>
                <strong>合同签署</strong>
                <span style={{ color: '#666', marginLeft: 8 }}>
                  {moment(contract.signDate).format('YYYY-MM-DD HH:mm')}
                </span>
              </div>
              <div style={{ color: '#666' }}>双方已签署合同</div>
            </Timeline.Item>
          )}

          {contract.status === 'active' && (
            <Timeline.Item color="green" dot={<CheckCircleOutlined />}>
              <div style={{ marginBottom: 4 }}>
                <strong>合同生效</strong>
                <span style={{ color: '#666', marginLeft: 8 }}>
                  {contract.startDate}
                </span>
              </div>
              <div style={{ color: '#666' }}>合同正式生效，开始执行</div>
            </Timeline.Item>
          )}

          {contract.status === 'expired' && (
            <Timeline.Item color="red" dot={<ClockCircleOutlined />}>
              <div style={{ marginBottom: 4 }}>
                <strong>合同到期</strong>
                <span style={{ color: '#666', marginLeft: 8 }}>
                  {contract.endDate}
                </span>
              </div>
              <div style={{ color: '#666' }}>合同已到期</div>
            </Timeline.Item>
          )}

          {contract.status === 'terminated' && (
            <Timeline.Item color="red" dot={<ExclamationCircleOutlined />}>
              <div style={{ marginBottom: 4 }}>
                <strong>合同终止</strong>
                <span style={{ color: '#666', marginLeft: 8 }}>
                  {moment(contract.updateTime).format('YYYY-MM-DD HH:mm')}
                </span>
              </div>
              <div style={{ color: '#666' }}>合同已提前终止</div>
            </Timeline.Item>
          )}
        </Timeline>
      </Card>
    </PageContainer>
  );
}
