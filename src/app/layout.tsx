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
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            // Skip anti-tamper on admin pages
            if (window.location.pathname.startsWith('/shoowjo')) return;

            // Disable right click
            document.addEventListener('contextmenu', e => e.preventDefault());

            // Disable common shortcuts
            document.addEventListener('keydown', e => {
              // F12
              if (e.keyCode === 123) {
                e.preventDefault();
                return false;
              }
              // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U (View Source)
              if (e.ctrlKey && (e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67) || e.keyCode === 85)) {
                e.preventDefault();
                return false;
              }
            });

            console.log("%c实验环境安全性已加固", "color: red; font-size: 20px; font-weight: bold;");
            console.log("请认真完成问卷，请勿尝试修改网页代码。");
          })();
        `}} />
      </body>
    </html>
  );
}
