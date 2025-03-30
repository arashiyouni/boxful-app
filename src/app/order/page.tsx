// OrderPage.tsx
"use client";

import { useState } from "react";
import { Form, message } from "antd";
import OrderHeader from "@/components/order/OrderHeader";
import PickupSection from "@/components/order/PickupSection";
import CustomerInfoSection from "@/components/order/CustomerInfoSection";
import DestinationSection from "@/components/order/DestinationSection";
import ReferenceSection from "@/components/order/ReferenceSection";
import ParcelForm from "@/components/order/ParcelForm";
import router from "next/router";

export default function OrderPage() {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>(null);

  const nextStep = () => {
    form.validateFields().then((values) => {
      setFormData(values);
      setStep(1);
    });
  };

  const handleSingleParcelSubmit = async (parcel: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("No estás autenticado");
      return;
    }

    const { weight, length, height, width, content } = parcel;

    // Validación explícita
    if (
      isNaN(Number(weight)) ||
      isNaN(Number(length)) ||
      isNaN(Number(height)) ||
      isNaN(Number(width)) ||
      typeof content !== "string" ||
      content.trim() === ""
    ) {
      message.error(
        "Los campos del bulto deben estar completos y ser válidos."
      );
      return;
    }

    try {
      const {
        scheduled_date,
        first_name,
        last_name,
        email,
        phone,
        destination_address,
        department,
        municipality,
        notes,
      } = formData;

      const payload = {
        scheduleDeliveryDate: new Date(scheduled_date).toISOString(),
        name: first_name,
        lastname: last_name,
        email,
        phone,
        deliveryAddress: destination_address,
        state: department,
        city: municipality,
        instructions: notes,
        OrderPerUser: [
          {
            weight: Number(weight),
            length: Number(length),
            height: Number(height),
            width: Number(width),
            description: content,
          },
        ],
      };

      const res = await fetch("http://localhost:3003/api/v1/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al crear bulto");

      message.success("Bulto agregado correctamente ✅");

      return data.data.orderId[0];
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Error al agregar bulto");
    }
  };

  const resetOrder = () => {
    form.resetFields();
    setFormData(null);
    setStep(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <OrderHeader />

        {step === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md mt-4">
            <Form
              form={form}
              layout="vertical"
              className="mt-8"
              onFinish={nextStep}
            >
              <PickupSection />
              <CustomerInfoSection />
              <DestinationSection />
              <ReferenceSection />
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-lg"
                >
                  Siguiente →
                </button>
              </div>
            </Form>
          </div>
        )}

        {step === 1 && (
          <ParcelForm
            onBack={() => setStep(0)}
            onSubmit={handleSingleParcelSubmit}
            onFinishFinal={resetOrder}
          />
        )}
      </div>
    </div>
  );
}
