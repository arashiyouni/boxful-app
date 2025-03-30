"use client";

import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

const { Title } = Typography;
const API_URL = "http://localhost:3003/api/v1/";

export default function RegisterPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const onFinish = async (values: {
    email: string;
    username: string;
    password: string;
  }) => {
    try {
      const res = await axios.post(`${API_URL}user`, values);

      message.success("Cuenta creada correctamente");
      router.push("/login");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Error al registrarse";
      message.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <div className="text-center mb-6">
          <Title level={3}>Crear Cuenta</Title>
          <p className="text-gray-500">Regístrate para usar Boxful</p>
        </div>

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: "Ingresa tu correo" },
              { type: "email", message: "Correo inválido" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="correo@boxful.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Nombre de usuario"
            name="username"
            rules={[
              { required: true, message: "Ingresa tu nombre de usuario" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tu nombre de usuario"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: "Ingresa tu contraseña" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Registrarse
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </div>
      </div>
    </div>
  );
}
