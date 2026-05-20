"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ThanksPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass-panel text-center fade-in" style={{ padding: '4rem 3rem' }}>
        <h1 className="mb-6" style={{ fontSize: '2.5rem', color: 'var(--primary-hover)' }}>感谢参与！</h1>
        <p style={{ fontSize: '1.2rem', color: '#334155' }}>
          问卷已提交，感谢您的支持。
        </p>
      </div>
    </div>
  );
}
