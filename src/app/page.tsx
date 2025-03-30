// app/page.tsx
import { Button } from "antd";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
