"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TransitionPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [subjectId, setSubjectId] = useState<string | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem('subjectId');
    if (!id) {
      alert("未找到有效的受试者编号，请返回首页重新开始。");
      router.push('/');
      return;
    }
    setSubjectId(id);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/survey/post');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  if (!subjectId) return <div className="container text-center">加载中...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass-panel text-center fade-in" style={{ padding: '4rem 3rem' }}>
        <h1 className="mb-6" style={{ fontSize: '2rem', color: 'var(--primary-hover)' }}>即将进入问卷第二部分</h1>
        
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          该部分请使用 AI 辅助作答
        </p>
        
        <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.6)', padding: '2rem', borderRadius: '1rem', lineHeight: '1.8', fontSize: '1.05rem', color: '#334155', marginBottom: '3rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>*</span> 题目与材料之间设置了 <strong>AI 辅助助手</strong>（已内置材料文本）；材料与题目之间设有 <strong>提示词模板</strong>，请参考提示词与 AI 进行对话；
          </p>
          <p>
            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>*</span> 您需将题目输入给 AI 辅助助手（可一次性复制粘贴所有题目），并根据其给出的评分建议、以及上一轮您的评分结果，进行 <strong>最终评分以及作答</strong>。
          </p>
        </div>

        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
          {countdown} 秒后自动进入...
        </div>
      </div>
    </div>
  );
}
