"use client";

import { Typography } from "antd";

const { Title, Text } = Typography;

export default function OrderHeader() {
  return (
    <div>
      <Title level={4} className="text-gray-800">
        Crea una orden
      </Title>
      <Text className="text-gray-500">
        Dale una ventaja competitiva a tu negocio con entregas el{" "}
        <span className="font-semibold text-gray-700">mismo día</span> (Área
        Metropolitana) y el{" "}
        <span className="font-semibold text-gray-700">día siguiente</span> a
        nivel nacional.
      </Text>
    </div>
  );
}
