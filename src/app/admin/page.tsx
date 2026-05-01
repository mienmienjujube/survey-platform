"use client";

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [genCount, setGenCount] = useState(10);
  const [message, setMessage] = useState('');

  // Fetch subjects on load
  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/admin/data');
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
      }
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleExport = (format: 'csv' | 'xlsx') => {
    window.location.href = `/api/admin/export?format=${format}`;
  };

  const handleGenerate = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/generate-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: genCount })
      });
      if (res.ok) {
        setMessage(`成功生成 ${genCount} 个账号！`);
        fetchSubjects();
      } else {
        setMessage('生成失败，请重试');
      }
    } catch (err) {
      setMessage('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该账号及其所有答题数据吗？此操作不可逆。')) return;
    try {
      const res = await fetch('/api/admin/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchSubjects();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', padding: '4rem 1rem' }}>
      <div className="glass-panel fade-in" style={{ padding: '3rem' }}>
        <h1 className="text-center mb-8" style={{ fontSize: '2.5rem', color: 'var(--primary-hover)' }}>问卷平台管理后台</h1>

        {/* Section 1: Data Export */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem' }}>数据导出</h2>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button onClick={() => handleExport('csv')} className="btn" style={{ flex: 1, background: '#475569' }}>
              导出为 CSV (BOM UTF-8)
            </button>
            <button onClick={() => handleExport('xlsx')} className="btn" style={{ flex: 1, background: '#10b981' }}>
              导出为 XLSX (Excel)
            </button>
          </div>
          <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>* 导出数据包含所有受试者的个人信息、前测、后测及 AI 对话记录。</p>
        </section>

        {/* Section 2: Account Generation */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem' }}>批量生成账号</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1rem' }}>生成数量：</span>
            <input 
              type="number" 
              value={genCount} 
              onChange={e => setGenCount(parseInt(e.target.value))} 
              className="form-input" 
              style={{ width: '100px' }}
              min="1"
              max="100"
            />
            <button onClick={handleGenerate} className="btn" disabled={loading} style={{ background: 'var(--primary-color)' }}>
              {loading ? '生成中...' : '立即生成'}
            </button>
          </div>
          {message && <p style={{ marginTop: '1rem', color: message.includes('成功') ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{message}</p>}
        </section>

        {/* Section 3: Account List */}
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem' }}>账号列表 ({subjects.length})</h2>
          <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.4)', borderRadius: '1rem', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem' }}>用户名</th>
                  <th style={{ padding: '1rem' }}>密码</th>
                  <th style={{ padding: '1rem' }}>当前进度</th>
                  <th style={{ padding: '1rem' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{s.username}</td>
                    <td style={{ padding: '1rem' }}>{s.password}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem',
                        background: s.currentPhase === 'COMPLETED' ? '#dcfce7' : '#fef9c3',
                        color: s.currentPhase === 'COMPLETED' ? '#166534' : '#854d0e'
                      }}>
                        {s.currentPhase === 'COMPLETED' ? '已完成' : s.currentPhase === 'POST_TEST' ? '后测中' : '未开始'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => handleDelete(s.id)} 
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {subjects.length === 0 && <p className="text-center text-muted" style={{ padding: '2rem' }}>暂无受试者数据</p>}
          </div>
        </section>

      </div>
    </div>
  );
}
