import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "实验问卷平台",
  description: "基于前后测实验设计的智能问卷平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
