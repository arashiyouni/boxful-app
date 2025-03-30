"use client";

import { useEffect, useState } from "react";
import { Col, Form, Input, Row, Select, message } from "antd";

export default function CustomerInfoSection() {
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const res = await fetch("http://localhost:3003/api/v1/user");
        const json = await res.json();
        const { state = [], city = [] } = json.data;

        setStates(state.map((s: any) => s.name));
        setCities(city.map((c: any) => c.name));
      } catch (error) {
        console.error("Error fetching location data:", error);
        message.error("Error cargando departamentos y municipios");
      }
    };

    fetchLocationData();
  }, []);

  return (
    <>
      <Row gutter={16}>
        <Col span={24} md={8}>
          <Form.Item label="Nombres" name="first_name">
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Apellidos" name="last_name">
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Correo Electrónico" name="email">
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Teléfono con máscara */}
        <Col span={24} md={8}>
          <Form.Item label="Teléfono" name="phone">
            <Input
              addonBefore="+503"
              size="large"
              placeholder="69628383"
              maxLength={8}
            />
          </Form.Item>
        </Col>

        {/* Departamento */}
        <Col span={24} md={8}>
          <Form.Item label="Departamento" name="department">
            <Select size="large" placeholder="Selecciona un departamento">
              {states.map((name) => (
                <Select.Option key={name} value={name}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Municipio */}
        <Col span={24} md={8}>
          <Form.Item label="Municipio" name="municipality">
            <Select size="large" placeholder="Selecciona un municipio">
              {cities.map((name) => (
                <Select.Option key={name} value={name}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
