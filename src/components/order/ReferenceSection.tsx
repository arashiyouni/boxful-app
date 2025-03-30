"use client";

import { Col, Form, Input, Row } from "antd";

const { TextArea } = Input;

export default function ReferenceSection() {
  return (
    <Row gutter={16}>
      <Col span={24} md={12}>
        <Form.Item label="Punto de Referencia" name="reference_point">
          <Input size="large" />
        </Form.Item>
      </Col>
      <Col span={24} md={12}>
        <Form.Item label="Indicaciones" name="notes">
          <TextArea rows={1} size="large" />
        </Form.Item>
      </Col>
    </Row>
  );
}
