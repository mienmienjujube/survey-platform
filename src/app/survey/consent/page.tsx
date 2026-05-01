"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConsentPage() {
  const router = useRouter();
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const id = sessionStorage.getItem('subjectId');
    if (!id) {
      router.push('/');
      return;
    }
    setSubjectId(id);

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  const handleAgree = () => {
    sessionStorage.setItem('consentAgreed', 'true');
    router.push('/survey/pre');
  };

  if (!subjectId) return <div className="container text-center">加载中...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '85vh', padding: '2rem' }}>
      <div className="glass-panel fade-in" style={{ padding: '3rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.4)', padding: '2rem', borderRadius: '1.5rem', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: '2' }}>
          <h1 className="text-center mb-8" style={{ fontSize: '2.2rem', color: 'var(--primary-hover)' }}>知情同意书</h1>
          
          <div style={{ color: '#334155' }}>
            <p style={{ marginBottom: '1.5rem' }}><strong>尊敬的志愿者：</strong><br/>您好！感谢您参与“生成式人工智能认知与使用行为”研究课题的调研。本知情同意书将帮助您了解该研究的目的、程序及您的权利，请您仔细阅读。</p>
            
            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>一、研究背景与目的</h3>
              <p>本研究由苏州大学科技传播研究中心发起，旨在了解公众对生成式AI工具的认知程度、使用意愿及态度倾向。</p>
            </section>

            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>二、研究内容与程序</h3>
              <p>1. 调研方式：在线问卷填写。<br/>2. 问卷耗时：约60分钟。<br/>3. 问卷步骤：基本信息、基准测试、AI 辅助阅读理解、材料分析及反馈。</p>
            </section>

            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>三、隐私保护与数据管理</h3>
              <p>所有原始数据将进行匿名或编号处理，仅用于学术分析，保存期限不超过5年，不会泄露您的个人身份信息。</p>
            </section>

            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>四、参与者权利</h3>
              <p>您的参与完全自愿。在调研过程中，您可以随时选择中止或退出，无需提供任何理由，已填写的数据将根据您的意愿保留或删除。</p>
            </section>

            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>五、联系方式</h3>
              <p>如果您对本研究有任何疑问，请联系研究负责人：<br/><strong>程曦</strong> 邮箱：fxchxi@suda.edu.cn</p>
            </section>

            <p style={{ marginTop: '2rem', color: 'var(--accent-color)', fontWeight: 600, borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              * 点击下方按钮代表您已充分知晓知情同意书的全部内容，且同意参加本次调研。
            </p>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={handleAgree} 
            className="btn" 
            disabled={countdown > 0}
            style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
          >
            {countdown > 0 ? `请仔细阅读 (${countdown}s)` : "我已知晓并同意，开始问卷"}
          </button>
        </div>
      </div>
    </div>
  );
}
