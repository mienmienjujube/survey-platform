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
    <div className="container" style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass-panel text-center fade-in">
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="苏州大学" style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '40px' }}
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <input 
              type="password" 
              className="form-input" 
              style={{ paddingLeft: '40px' }}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</div>}

          <button type="submit" className="btn" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? '登录中...' : '登 录'}
          </button>
        </form>
      </div>
    </div>
  );
}
