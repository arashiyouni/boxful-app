"use client";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const { Title } = Typography;

const API_URL = "http://localhost:3003/api/v1/";

export default function LoginPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const res = await axios.post(`${API_URL}auth/login`, values);

      const { access_token } = res.data.data;

      localStorage.setItem("token", access_token);

      message.open({
        type: "success",
        content: "Inicio de sesión exitoso",
      });
      router.push("/order");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Error al iniciar sesión";
      message.open({
        type: "error",
        content: msg,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <div className="text-center mb-6">
          <Title level={3}>Boxful</Title>
          <p className="text-gray-500">Gestión de envíos y logística</p>
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
              prefix={<UserOutlined />}
              placeholder="usuario@boxful.com"
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
              Ingresar
            </Button>
          </Form.Item>

          <div className="text-center text-sm text-gray-500 mt-4">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Regístrate aquí
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}
