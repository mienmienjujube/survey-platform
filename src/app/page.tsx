"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 确保每次回到首页都要求重新登录（清除旧的 session）
  useEffect(() => {
    sessionStorage.removeItem('subjectId');
    sessionStorage.removeItem('currentPhase');
    sessionStorage.removeItem('consentAgreed');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem('subjectId', data.subjectId);
        sessionStorage.setItem('currentPhase', data.currentPhase);
        
        if (data.currentPhase === 'POST_TEST') {
          router.push('/survey/post');
        } else if (data.currentPhase === 'COMPLETED') {
          router.push('/survey/completed'); // 如果你想加一个结束页面的话
        } else {
          router.push('/survey/consent');
        }
      } else {
        setError(data.error || '登录失败，请检查账号密码');
      }
    } catch (err) {
      console.error(err);
      setError('网络异常，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '90vh' }}>
      <div className="glass-panel fade-in" style={{ padding: '3rem 2.5rem' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '1.5rem', 
            background: 'linear-gradient(135deg, #3a3a3c 0%, #1c1c1e 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem auto',
            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.3)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1d1d1f', margin: 0 }}>学术实验平台</h2>
        </div>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '44px', height: '50px', fontSize: '1rem' }}
              placeholder="请输入账号"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '44px', height: '50px', fontSize: '1rem' }}
              placeholder="请输入密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.05)', padding: '0.6rem', borderRadius: '0.5rem' }}>{error}</div>}

          <button type="submit" className="btn" disabled={loading} style={{ marginTop: '1rem', height: '50px', fontSize: '1.05rem', fontWeight: '500' }}>
            {loading ? '验证中...' : '开始实验'}
          </button>
        </form>
      </div>
    </div>
  );
}
