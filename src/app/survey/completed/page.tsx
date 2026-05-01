"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CompletedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Prevent unauthenticated access
    const phase = sessionStorage.getItem('currentPhase');
    if (phase !== 'COMPLETED') {
      router.push('/');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Clear session and return to login
          sessionStorage.clear();
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass-panel text-center fade-in" style={{ padding: '4rem 3rem' }}>
        <h1 className="mb-6" style={{ fontSize: '2.5rem', color: 'var(--primary-hover)' }}>提交成功！</h1>
        
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#334155' }}>
          非常感谢您参与本次“生成式人工智能认知与使用行为”研究课题。
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '3rem', color: '#64748b' }}>
          您的回答对我们的学术研究提供了重要价值！
        </p>

        <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
          页面将在 <strong style={{ color: 'var(--accent-color)', fontSize: '1.2rem' }}>{countdown}</strong> 秒后自动返回登录页...
        </div>
      </div>
    </div>
  );
}
