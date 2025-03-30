"use client";

import { Col, Form, Input, Row } from "antd";

export default function DestinationSection() {
  return (
    <Row gutter={16}>
      <Col span={24}>
        <Form.Item
          label="Dirección del destinatario"
          name="destination_address"
        >
          <Input size="large" />
        </Form.Item>
      </Col>
    </Row>
  );
}
