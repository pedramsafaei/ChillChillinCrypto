import React from 'react';
import { Skeleton, Card, Row, Col } from 'antd';

export const CryptoListSkeleton = ({ count = 10 }) => {
  return (
    <div>
      {[...Array(count)].map((_, index) => (
        <Card key={index} style={{ marginBottom: '16px' }}>
          <Skeleton active avatar paragraph={{ rows: 2 }} />
        </Card>
      ))}
    </div>
  );
};

export const CryptoDetailSkeleton = () => {
  return (
    <div>
      <Card style={{ marginBottom: '16px' }}>
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </Card>
      <Card>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <Card>
      <Skeleton.Input active block style={{ height: 400 }} />
    </Card>
  );
};

export const StatsSkeleton = () => {
  return (
    <Row gutter={[16, 16]}>
      {[...Array(4)].map((_, index) => (
        <Col xs={24} sm={12} md={6} key={index}>
          <Card>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default {
  CryptoListSkeleton,
  CryptoDetailSkeleton,
  ChartSkeleton,
  StatsSkeleton,
};
