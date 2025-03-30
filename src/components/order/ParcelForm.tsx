"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  message,
  Space,
} from "antd";
import {
  DeleteOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

interface Parcel {
  id: string;
  length: string;
  height: string;
  width: string;
  weight: string;
  content: string;
}

interface Props {
  onBack: () => void;
  onSubmit: (parcel: Parcel) => Promise<string | undefined>;
  onFinishFinal: () => void;
}

export default function ParcelStep({ onBack, onSubmit }: Props) {
  const [form] = Form.useForm();
  const [parcels, setParcels] = useState<Parcel[]>([]);

  const addParcel = async () => {
    try {
      const values = await form.validateFields();

      const parcel = {
        ...values,
        length: Number(values.length),
        height: Number(values.height),
        width: Number(values.width),
        weight: Number(values.weight),
      };

      const parcelId = await onSubmit(parcel);

      if (!parcelId) return;

      setParcels((prev) => [...prev, { ...parcel, id: parcelId }]);
      form.resetFields();
    } catch {
      message.warning("Completa todos los campos para agregar un bulto.");
    }
  };

  const removeParcel = async (index: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("No estás autenticado");
      return;
    }

    const parcelId = parcels[index].id;

    try {
      const res = await fetch(
        `http://localhost:3003/api/v1/order/${parcelId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error al eliminar bulto");

      // Quitar del estado
      const updated = [...parcels];
      updated.splice(index, 1);
      setParcels(updated);

      message.success("Bulto eliminado correctamente 🗑️");
    } catch (err: any) {
      console.error(err);
      message.error("No se pudo eliminar el bulto");
    }
  };

  const updateParcel = async (updatedParcel: Parcel) => {
    const token = localStorage.getItem("token");
    if (!token) return message.error("No estás autenticado");

    try {
      const body = {
        weight: Number(updatedParcel.weight),
        length: Number(updatedParcel.length),
        height: Number(updatedParcel.height),
        width: Number(updatedParcel.width),
        description: updatedParcel.content,
      };

      const res = await fetch(
        `http://localhost:3003/api/v1/order/item/${updatedParcel.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar");

      message.success("Bulto actualizado ✅");
    } catch (err: any) {
      console.error(err);
      message.error("Error al actualizar bulto");
    }
  };

  const handleSubmit = () => {
    if (parcels.length === 0) {
      message.warning("Debes agregar al menos un bulto.");
      return;
    }

    message.success("Todos los bultos han sido agregados correctamente ✅");
  };

  return (
    <div className=" p-6 rounded-md bg-white">
      <Title level={5}>Agrega tus bultos</Title>

      {/* Formulario del bulto */}
      <Form form={form} layout="vertical">
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <Row gutter={12} align="bottom">
            <Col span={4}>
              <Form.Item
                name="length"
                label={
                  <Space>
                    <span>Largo</span>
                  </Space>
                }
              >
                <Input suffix="cm" size="large" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="height" label="Alto">
                <Input suffix="cm" size="large" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="width" label="Ancho">
                <Input suffix="cm" size="large" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="weight" label="Peso en libras">
                <Input suffix="lb" size="large" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="content" label="Contenido">
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end">
            <Button
              icon={<PlusOutlined />}
              size="large"
              type="default"
              onClick={addParcel}
              className="px-8"
            >
              Agregar
            </Button>
          </div>
        </div>
      </Form>

      {/* Bultos que se han agregado */}
      {parcels.length > 0 && (
        <div className="mb-6">
          <Title level={5} className="mb-4">
            Agrega tus bultos
          </Title>

          {parcels.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-md p-4 mb-4 border border-gray-300"
            >
              <div className="space-y-4">
                {/* Fila superior con inputs */}
                <Row gutter={16} align="middle" wrap={false}>
                  {/* Peso */}
                  <Col>
                    <div className="text-sm text-gray-500 mb-1">
                      Peso en libras
                    </div>
                    <Input
                      value={item.weight}
                      suffix="cm"
                      size="large"
                      className="w-10 text-center rounded-md border-gray-300"
                      onChange={(e) => {
                        const updated = [...parcels];
                        updated[index].weight = e.target.value;
                        setParcels(updated);
                        updateParcel(updated[index]);
                      }}
                    />
                  </Col>

                  {/* Contenido */}
                  <Col flex="auto">
                    <div className="text-sm text-gray-500 mb-1">Contenido</div>
                    <Input
                      value={item.content}
                      size="large"
                      readOnly
                      className="w-full"
                    />
                  </Col>

                  {/* Medidas */}
                  <Col>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Largo</div>
                        <Input
                          value={item.length}
                          suffix="cm"
                          size="large"
                          className="w-10 text-center rounded-md border-gray-300"
                          onChange={(e) => {
                            const updated = [...parcels];
                            updated[index].length = e.target.value;
                            setParcels(updated);
                            updateParcel(updated[index]);
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Alto</div>
                        <Input
                          value={item.height}
                          suffix="cm"
                          size="large"
                          className="w-10 text-center rounded-md border-gray-300"
                          onChange={(e) => {
                            const updated = [...parcels];
                            updated[index].height = e.target.value;
                            setParcels(updated);
                            updateParcel(updated[index]);
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Ancho</div>
                        <Input
                          value={item.width}
                          suffix="cm"
                          size="large"
                          className="w-10 text-center rounded-md border-gray-300"
                          onChange={(e) => {
                            const updated = [...parcels];
                            updated[index].width = e.target.value;
                            setParcels(updated);
                            updateParcel(updated[index]);
                          }}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Botón eliminar abajo a la derecha */}
                <div className="flex justify-end">
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => removeParcel(index)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navegación */}
      <div className="flex justify-between mt-6">
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          Regresar
        </Button>
        <Button
          type="primary"
          icon={<ArrowRightOutlined />}
          onClick={handleSubmit}
        >
          Enviar
        </Button>
      </div>
    </div>
  );
}
