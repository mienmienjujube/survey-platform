"use client";

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [genCount, setGenCount] = useState(10);
  const [message, setMessage] = useState('');

  const [lastGenerated, setLastGenerated] = useState<any[]>([]);
  const [localIp, setLocalIp] = useState('加载中...');

  // Fetch subjects and potential local IP (from window.location)
  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/shoowjo/data');
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
    // In a real browser, we can't easily get the local IP from JS, 
    // but we can show the current URL's hostname.
    setLocalIp(window.location.hostname);
  }, []);

  const handleExport = (format: 'csv' | 'xlsx') => {
    window.location.href = `/api/shoowjo/export?format=${format}`;
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = ['用户名', '密码'];
    const csvContent = "\uFEFF" + [
      headers.join(','),
      ...data.map(item => `"${item.username}","${item.password}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/shoowjo/generate-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: genCount })
      });
      if (res.ok) {
        const data = await res.json();
        setMessage(`成功生成 ${genCount} 个账号！`);
        setLastGenerated(data.accounts || []);
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

  const handleClearData = async () => {
    if (!confirm('【警告】确定要清空所有受试者数据吗？\n这将删除所有账号及其答题记录、AI对话记录！')) return;
    if (!confirm('再次确认：此操作不可恢复，确认执行？')) return;

    try {
      const res = await fetch('/api/shoowjo/clear-data', { method: 'POST' });
      if (res.ok) {
        setMessage('所有数据已成功清空');
        setSubjects([]);
        setLastGenerated([]);
      } else {
        setMessage('清空失败');
      }
    } catch (err) {
      setMessage('网络错误');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该账号及其所有答题数据吗？此操作不可逆。')) return;
    try {
      const res = await fetch('/api/shoowjo/delete-account', {
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
    <div className="container" style={{ maxWidth: '1000px', padding: '2rem 1rem' }}>
      <div className="glass-panel fade-in" style={{ padding: '2.5rem' }}>
        <h1 className="text-center mb-8" style={{ fontSize: '2.2rem', color: 'var(--primary-hover)' }}>问卷平台管理后台</h1>

        {/* Section 0: Lab Access Instructions */}
        <section className="alert" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '0.8rem', padding: '1.5rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            机房访问指南
          </h2>
          <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
            受试者访问地址：<code style={{ background: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', color: '#2563eb' }}>http://{localIp === 'localhost' ? '您的局域网IP' : localIp}:3000</code>
          </p>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>* 请确保您的电脑与受试者电脑处于同一局域网，且防火墙允许 3000 端口访问。</p>
        </section>

        {/* Section 1: Data Export */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem', margin: 0 }}>数据回收</h2>
            <button onClick={handleClearData} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '0.4rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              清空所有数据
            </button>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => handleExport('csv')} className="btn" style={{ flex: 1, background: '#475569', padding: '0.8rem' }}>
              导出完整数据 (CSV)
            </button>
            <button onClick={() => handleExport('xlsx')} className="btn" style={{ flex: 1, background: '#10b981', padding: '0.8rem' }}>
              导出完整数据 (Excel)
            </button>
          </div>
        </section>

        {/* Section 2: Account Generation */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem' }}>账号发放</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1rem' }}>生成数量：</span>
            <input 
              type="number" 
              value={genCount} 
              onChange={e => setGenCount(parseInt(e.target.value))} 
              className="form-input" 
              style={{ width: '100px' }}
              min="1"
              max="200"
            />
            <button onClick={handleGenerate} className="btn" disabled={loading} style={{ background: 'var(--primary-color)', minWidth: '120px' }}>
              {loading ? '生成中...' : '生成账号'}
            </button>
            
            {lastGenerated.length > 0 && (
              <button 
                onClick={() => downloadCSV(lastGenerated, `new_accounts_${Date.now()}.csv`)} 
                className="btn" 
                style={{ background: '#f59e0b', color: '#fff' }}
              >
                下载本次生成的账号
              </button>
            )}

            <button 
              onClick={() => downloadCSV(subjects, `all_accounts_${Date.now()}.csv`)} 
              className="btn" 
              style={{ background: 'none', border: '1px solid #64748b', color: '#64748b' }}
            >
              导出全部账号列表
            </button>
          </div>
          {message && <p style={{ marginTop: '1rem', color: message.includes('成功') ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{message}</p>}
        </section>

        {/* Section 3: Account List */}
        <section>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem' }}>账号状态监控 ({subjects.length})</h2>
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
                        background: s.currentPhase === 'COMPLETED' ? '#dcfce7' : s.currentPhase === 'POST_TEST' ? '#dbeafe' : '#fef9c3',
                        color: s.currentPhase === 'COMPLETED' ? '#166534' : s.currentPhase === 'POST_TEST' ? '#1e40af' : '#854d0e'
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
