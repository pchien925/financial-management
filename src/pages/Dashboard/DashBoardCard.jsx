import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, AccountBookOutlined } from '@ant-design/icons';
import styles from './Dashboard.module.scss';

const DashBoardCard = ({ income, expense, balance }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <Card className={`${styles.statCard} ${styles.income}`} bordered={false}>
          <Statistic 
            title="Tổng Thu Nhập" 
            value={income} 
            prefix={<ArrowUpOutlined />} 
            suffix="VND" 
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className={`${styles.statCard} ${styles.expense}`} bordered={false}>
          <Statistic 
            title="Tổng Chi Tiêu" 
            value={expense} 
            prefix={<ArrowDownOutlined />} 
            suffix="VND" 
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className={`${styles.statCard} ${styles.balance}`} bordered={false}>
          <Statistic 
            title="Số Dư" 
            value={balance} 
            prefix={<AccountBookOutlined />} 
            suffix="VND" 
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashBoardCard;