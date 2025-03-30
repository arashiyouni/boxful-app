"use client";

import { Col, DatePicker, Form, Input, Row } from "antd";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function PickupSection() {
  return (
    <Row gutter={16}>
      <Col span={24} md={16}>
        <Form.Item
          label={
            <span className="font-medium">📍 Dirección de recolección</span>
          }
          name="pickup_address"
          rules={[{ required: true, message: "Este campo es requerido" }]}
        >
          <Input
            placeholder="Colonia Las Magnolias, San Miguel"
            prefix={<EnvironmentOutlined />}
            size="large"
          />
        </Form.Item>
      </Col>

      <Col span={24} md={8}>
        <Form.Item
          label={<span className="font-medium">📅 Fecha Programada</span>}
          name="scheduled_date"
          rules={[{ required: true, message: "Este campo es requerido" }]}
        >
          <DatePicker
            format="DD / MM / YYYY"
            className="w-full"
            size="large"
            suffixIcon={<CalendarOutlined />}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
          />
        </Form.Item>
      </Col>
    </Row>
  );
}
