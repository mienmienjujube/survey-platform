"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PreTestSurvey() {
  const router = useRouter();
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [step, setStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [isRestored, setIsRestored] = useState(false);

  const [formData, setFormData] = useState<Record<string, any>>({
    freq: '', purpose: [], purpose_other: '', knowledge: '', diff: '', will: '', impact: '', tools: [], tools_other: '', plan: '', interview: '', interview_email: '',
    base_A: '', base_A_reason: '', base_B: '', base_B_reason: '', base_C: '', base_C_reason: '', base_features: '',
    m1_self: '', m1_div1: '', m1_div2: '', m1_div3: '', m1_rel1: '', m1_rel2: '', m1_rel3: '', m1_eth1: '', m1_eth2: '', m1_eth3: '', m1_fair1: '', m1_fair2: '', m1_fair3: '', m1_und1: '', m1_und2: '', m1_und3: '', m1_und4: '', m1_acc1: '', m1_acc2: '', m1_acc3: '', m1_title: '',
    m2_self: '', m2_div1: '', m2_div2: '', m2_div3: '', m2_rel1: '', m2_rel2: '', m2_rel3: '', m2_eth1: '', m2_eth2: '', m2_eth3: '', m2_fair1: '', m2_fair2: '', m2_fair3: '', m2_und1: '', m2_und2: '', m2_und3: '', m2_und4: '', m2_acc1: '', m2_acc2: '', m2_acc3: '', m2_title: '',
    ana_theory: '', ana_method: '', sa_academic: '', sa_industry: ''
  });

  useEffect(() => {
    const id = sessionStorage.getItem('subjectId');
    if (!id) {
      alert("未找到有效的受试者编号，请返回首页重新开始。");
      router.push('/');
      return;
    }
    
    if (sessionStorage.getItem('currentPhase') === 'POST_TEST') {
      router.replace('/survey/post');
      return;
    }
    if (sessionStorage.getItem('currentPhase') === 'COMPLETED') {
      router.replace('/survey/thanks');
      return;
    }

    setSubjectId(id);

    if (!sessionStorage.getItem('preTestStartTime')) {
      sessionStorage.setItem('preTestStartTime', Date.now().toString());
    }

    fetch(`/api/get-progress?subjectId=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error === 'Subject not found') {
          alert('登录凭证已失效或账号不存在，请重新登录。');
          sessionStorage.removeItem('subjectId');
          sessionStorage.removeItem('currentPhase');
          sessionStorage.removeItem('preTestStartTime');
          router.replace('/');
          return;
        }
        if (data && !data.error) {
          if (data.step) {
            setStep(data.step);
            setMaxStepReached(data.step);
          }
          if (data.data) setFormData(prev => ({ ...prev, ...data.data }));
        }
        setIsRestored(true);
      })
      .catch(err => {
        console.error('Failed to restore:', err);
        setIsRestored(true);
      });

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  useEffect(() => {
    if (!isRestored || !subjectId) return;
    const timer = setTimeout(() => {
      fetch('/api/save-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId, step, data: formData })
      }).catch(console.error);
    }, 1500);
    return () => clearTimeout(timer);
  }, [formData, step, subjectId, isRestored]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (name: string, value: string) => {
    setFormData(prev => {
      const arr = prev[name] as string[];
      if (arr.includes(value)) {
        return { ...prev, [name]: arr.filter(v => v !== value) };
      } else {
        return { ...prev, [name]: [...arr, value] };
      }
    });
  };

  const validateStep = (currentStep: number) => {
    switch(currentStep) {
      case 1:
        if (!formData.freq || formData.purpose.length === 0 || !formData.knowledge || !formData.diff || !formData.will || !formData.impact || formData.tools.length === 0 || !formData.plan || !formData.interview) return false;
        if (formData.purpose.includes('其他') && !formData.purpose_other) return false;
        if (formData.tools.includes('其他') && !formData.tools_other) return false;
        if (formData.interview === 'yes' && !formData.interview_email) return false;
        return true;
      case 2:
        return !!(formData.base_A && formData.base_A_reason && formData.base_B && formData.base_B_reason && formData.base_C && formData.base_C_reason && formData.base_features);
      case 3:
        return !!(formData.m1_self && formData.m1_div1 && formData.m1_div2 && formData.m1_div3 && formData.m1_rel1 && formData.m1_rel2 && formData.m1_rel3 && formData.m1_eth1 && formData.m1_eth2 && formData.m1_eth3 && formData.m1_fair1 && formData.m1_fair2 && formData.m1_fair3 && formData.m1_und1 && formData.m1_und2 && formData.m1_und3 && formData.m1_und4 && formData.m1_acc1 && formData.m1_acc2 && formData.m1_acc3 && formData.m1_title);
      case 4:
        return !!(formData.m2_self && formData.m2_div1 && formData.m2_div2 && formData.m2_div3 && formData.m2_rel1 && formData.m2_rel2 && formData.m2_rel3 && formData.m2_eth1 && formData.m2_eth2 && formData.m2_eth3 && formData.m2_fair1 && formData.m2_fair2 && formData.m2_fair3 && formData.m2_und1 && formData.m2_und2 && formData.m2_und3 && formData.m2_und4 && formData.m2_acc1 && formData.m2_acc2 && formData.m2_acc3 && formData.m2_title);
      case 5:
        return !!(formData.ana_theory && formData.ana_method && formData.sa_academic && formData.sa_industry);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      alert("请确保当前页所有必填项已完成填写！");
      return;
    }
    const next = Math.min(5, step + 1);
    setStep(next);
    setMaxStepReached(prev => Math.max(prev, next));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      alert("请确保当前页所有必填项已完成填写！");
      return;
    }
    setLoading(true);
    const startTime = parseInt(sessionStorage.getItem('preTestStartTime') || Date.now().toString(), 10);
    const duration = Math.floor((Date.now() - startTime) / 1000);

    try {
      const res = await fetch('/api/submit-pre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId, data: formData, duration })
      });

      if (res.ok) {
        sessionStorage.setItem('currentPhase', 'POST_TEST');
        router.push('/survey/transition');
      } else {
        alert("提交失败，可能您已经提交过前测。");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("网络错误");
      setLoading(false);
    }
  };

  const Likert = ({ name, label }: { name: string, label: string }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="radio-group" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map(v => (
          <label key={v} style={{ flex: 1, justifyContent: 'center', padding: '0.5rem' }}>
            <input type="radio" name={name} value={v} onChange={handleChange} checked={formData[name] === String(v)} />
            <span>{v}</span>
          </label>
        ))}
      </div>
    </div>
  );

  if (!subjectId) return <div className="container text-center">加载中...</div>;

  const stepsList = [
    { id: 1, title: '一、基本信息' },
    { id: 2, title: '二、基准测试' },
    { id: 3, title: '三、阅读理解一' },
    { id: 4, title: '四、阅读理解二' },
    { id: 5, title: '五、材料分析' },
  ];

  return (
    <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto', gap: '1.5rem', padding: '2rem 1rem', alignItems: 'flex-start' }}>
      
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '250px', flexShrink: 0, position: 'sticky', top: '2rem', padding: '1.5rem', height: 'fit-content' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>答题进度</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {stepsList.map(s => {
            const isLocked = s.id > maxStepReached;
            const isActive = s.id === step;
            return (
              <button
                key={s.id}
                onClick={() => { if (!isLocked) { setStep(s.id); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1rem', border: 'none', borderRadius: '0.5rem',
                  background: isActive ? 'var(--primary-color)' : isLocked ? 'rgba(0,0,0,0.05)' : 'transparent',
                  color: isActive ? 'white' : isLocked ? 'var(--text-muted)' : 'var(--text-main)',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  textAlign: 'left', fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'all 0.2s',
                  opacity: isLocked ? 0.6 : 1
                }}
              >
                <span style={{ fontSize: '0.95rem' }}>{s.title}</span>
                {isLocked && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                )}
                {!isLocked && s.id < maxStepReached && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isActive ? "white" : "var(--accent-color)"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                )}
              </button>
            )
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="glass-panel" style={{ flex: 1, minWidth: 0, marginBottom: '2rem', padding: '2rem' }}>
        <h1 className="text-center mb-2" style={{ fontSize: '2.2rem' }}>生成式人工智能认知与使用行为</h1>
        <p className="text-center text-muted mb-8">受试者编号: {subjectId}</p>

        {step === 1 && (
          <div className="fade-in">
            <h2 className="mb-4" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>一、基本信息</h2>
            <Likert name="freq" label="1. 您使用生成式AI工具（如ChatGPT、Deepseek等）的频率？" />
            
            <div className="form-group">
              <label className="form-label">2. 您最常使用AI工具的目的是什么？[多选]</label>
              <div className="radio-group" style={{ flexDirection: 'column' }}>
                {['完成课程作业或学习辅导', '翻译、润色或学术写作支持', '获取新知识或扩展学习兴趣', '出于好奇探索AI功能', '情绪调节或生活建议', '娱乐与休闲', '其他'].map(opt => (
                  <label key={opt}>
                    <input type="checkbox" checked={formData.purpose.includes(opt)} onChange={() => handleCheckbox('purpose', opt)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {formData.purpose.includes('其他') && (
                <input 
                  type="text" 
                  name="purpose_other" 
                  className="form-input" 
                  style={{ marginTop: '0.5rem' }}
                  placeholder="请具体说明其他目的..." 
                  value={formData.purpose_other || ''}
                  onChange={handleChange} 
                />
              )}
            </div>

            <Likert name="knowledge" label="3. 您对“生成式人工智能”（如ChatGPT、Deepseek等）的了解程度？" />
            <Likert name="diff" label="4. 您是否能区分Deepseek与ChatGPT等主流AI工具的核心差异？" />
            <Likert name="will" label="5. 您是否愿意在课程学习、科研写作或实习工作中持续使用AI工具？" />
            <Likert name="impact" label="6. 您认为生成式AI对人类学习与思维方式的整体影响是：" />

            <div className="form-group">
              <label className="form-label">7. 您目前常用的生成式AI工具是哪些？[多选]</label>
              <div className="radio-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['ChatGPT', 'Gemini', 'Claude', 'Deepseek', '豆包', '文心一言', '讯飞星火', '其他'].map(opt => (
                  <label key={opt} style={{ flex: '1 1 30%' }}>
                    <input type="checkbox" checked={formData.tools.includes(opt)} onChange={() => handleCheckbox('tools', opt)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {formData.tools.includes('其他') && (
                <input 
                  type="text" 
                  name="tools_other" 
                  className="form-input" 
                  style={{ marginTop: '0.5rem' }}
                  placeholder="请具体说明其他工具名称..." 
                  value={formData.tools_other || ''}
                  onChange={handleChange} 
                />
              )}
            </div>

            <Likert name="plan" label="8. 您能够主动规划学习时间并灵活调整计划，确保高效完成学习任务。" />

            <div className="form-group">
              <label className="form-label">9. 您是否愿意继续参与本课题后续的匿名访谈研究？</label>
              <div className="radio-group">
                <label><input type="radio" name="interview" value="no" onChange={handleChange} /><span>不愿意</span></label>
                <label><input type="radio" name="interview" value="yes" onChange={handleChange} /><span>愿意</span></label>
              </div>
              {formData.interview === 'yes' && (
                <input type="text" name="interview_email" className="form-input mt-2" placeholder="请留下您的邮箱或联系方式" onChange={handleChange} />
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button onClick={prevStep} className="btn" style={{ background: 'var(--text-muted)' }}>上一页</button>
              <button onClick={nextStep} className="btn">下一页</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h2 className="mb-4" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>二、基准测试</h2>
            <p className="text-muted mb-6" style={{ fontSize: '1rem', background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '0.5rem' }}>
              * 该部分请不要借助AI辅助或询问他人，对下述材料进行评估：请评估下列材料AI使用情况，如是否有“AI味”，具体在哪些细节？
            </p>

            <div className="form-group" style={{ background: 'rgba(255,255,255,0.4)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
              <p className="mb-4" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}><strong>材料A：</strong>当前，新能源汽车产业的快速发展对动力电池性能提出了更高标准。固态锂电池因其在能量密度和安全性能方面的潜在优势，正成为全球研发热点。研究表明，采用固态电解质可有效抑制传统液态锂电池的枝晶问题，这一特性使固态电池技术备受期待。不过需要指出的是，在电池循环过程中，锂枝晶穿透现象仍可能导致内部短路，这是制约该技术商业化的主要瓶颈之一。因此，深入探究锂枝晶生长动力学机制，对于开发高性能固态电池具有重要意义。</p>
              <div className="radio-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['单纯AI生成', '可能AI辅助', '完全人类写作', '不确定'].map(opt => (
                  <label key={opt}><input type="radio" name="base_A" value={opt} onChange={handleChange} checked={formData.base_A === opt} /><span>{opt}</span></label>
                ))}
              </div>
              <textarea name="base_A_reason" className="form-input mt-2" rows={3} placeholder="您对材料A的判断理由是？" onChange={handleChange} value={formData.base_A_reason}></textarea>
            </div>

            <div className="form-group" style={{ background: 'rgba(255,255,255,0.4)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
              <p className="mb-4" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}><strong>材料B：</strong>近年来，随着新能源汽车蓬勃发展，人们对动力电池的能量密度和安全性提出了更高的要求， 锂电池固态化被认为是提升电池安全性和能量密度的重要解决方案，由此，固态锂电池在全球范围内引起学术界和产业界的广泛关注。然而，在固态锂电池运行过程中，因锂枝晶生长引起的电池失效和安全隐患严重阻碍了其实际应用，亟须在充分掌握电池失效机制的基础上，开发提升电池性能的新技术。</p>
              <div className="radio-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['单纯AI生成', '可能AI辅助', '完全人类写作', '不确定'].map(opt => (
                  <label key={opt}><input type="radio" name="base_B" value={opt} onChange={handleChange} checked={formData.base_B === opt} /><span>{opt}</span></label>
                ))}
              </div>
              <textarea name="base_B_reason" className="form-input mt-2" rows={3} placeholder="您对材料B的判断理由是？" onChange={handleChange} value={formData.base_B_reason}></textarea>
            </div>

            <div className="form-group" style={{ background: 'rgba(255,255,255,0.4)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
              <p className="mb-4" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}><strong>材料C：</strong>在特斯拉Model 3等车型热销的推动下，2023年全球新能源汽车渗透率已突破18%，这直接拉动了对高性能动力电池的需求。我们实验室的最新测试数据显示，采用LLZO固态电解质的电池样品，其能量密度较传统NCM811体系提升了约40%，但循环200次后仍观察到明显的枝晶生长。有意思的是，这些枝晶往往优先沿晶界缺陷处延伸。日本丰田公司的工程师山本健一曾私下透露："解决枝晶问题就像在跟材料本性作斗争，我们需要更聪明的界面设计"。</p>
              <div className="radio-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['单纯AI生成', '可能AI辅助', '完全人类写作', '不确定'].map(opt => (
                  <label key={opt}><input type="radio" name="base_C" value={opt} onChange={handleChange} checked={formData.base_C === opt} /><span>{opt}</span></label>
                ))}
              </div>
              <textarea name="base_C_reason" className="form-input mt-2" rows={3} placeholder="您对材料C的判断理由是？" onChange={handleChange} value={formData.base_C_reason}></textarea>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '1.1rem' }}>哪些特征会让你觉得是“AI痕迹”？</label>
              <textarea name="base_features" className="form-input" rows={4} onChange={handleChange} value={formData.base_features}></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button onClick={prevStep} className="btn" style={{ background: 'var(--text-muted)' }}>上一页</button>
              <button onClick={nextStep} className="btn">下一页</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in">
            <h2 className="mb-4" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>三、阅读理解一：高端装备技术攻关突破</h2>
            
            <div className="form-group" style={{ background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
              <label className="form-label" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>请根据您对"大型复杂薄壁回转构件高精加工技术及装备"的了解程度进行自评：</label>
              <div className="radio-group" style={{ flexDirection: 'column' }}>
                {[
                  '1 - 从未接触过该领域研究，不了解相关概念',
                  '2 - 听说过相关概念，但未深入了解具体内容',
                  '3 - 了解基本技术框架',
                  '4 - 比较熟悉关键技术',
                  '5 - 掌握技术细节'
                ].map((opt, i) => (
                  <label key={i}><input type="radio" name="m1_self" value={i+1} onChange={handleChange} checked={formData.m1_self === String(i+1)} /><span>{opt}</span></label>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.7)', padding: '2rem', borderRadius: '1.5rem', marginBottom: '3rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h3 className="text-center mb-6" style={{ fontSize: '1.5rem' }}>为了机匣不再“卡脖子”<br/>——我国首套重型五轴立式铣车机床攻关之路</h3>
              
              <div style={{ fontSize: '1.05rem', lineHeight: '2', color: '#334155' }}>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>3月19日，由武汉重型机床集团有限公司（以下简称武重集团）牵头研制的“大型复杂薄壁回转构件的高精铣车复合柔性加工技术及装备”项目，顺利通过中国机械工程学会组织的科技成果鉴定，获得充分肯定。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>该技术研发之初瞄准的目标，是希望改变这样一个局面——近年来我国船舶工业快速发展，但作为船舶“心脏”的燃气轮机，其核心关键零件机匣的研制加工却长期受制于人。</p>
                <p style={{ textIndent: '2em', marginBottom: '1.5rem' }}>2016年，武重集团组建起一支年轻团队，针对这一“卡脖子”技术发起了攻关。</p>
                
                <p style={{ textIndent: '2em', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>“国家需要，我们就干”</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>机匣类零件作为燃气轮机的支撑和关键受力零件，需要在高温、高压下工作，是影响燃气轮机抗冲击和抗振动性能的关键因子。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>武重集团副总经理、装备技术研究院院长陈昳表示，燃气轮机机匣多为大直径薄壁件，最薄处只有1.5至3毫米，切削时极易变形，是燃气轮机上最难制造的零件之一。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>长期以来，我国大量机匣类零件只能采用数控立式车床和加工中心等设备分工序组合的方式加工，不但精度和工艺稳定性难以保证，而且成本高、效率低。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>陈昳介绍说，机匣加工需要多道工序，包括车、铣、钻、镗等。使用多种机床加工，每完成一道工序都要把机匣取下来，装夹到下一台机床上。薄壁零件一拆、一挪就变形了，重新装夹费时费力，稍有不慎就会影响加工精度，导致出现废品。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>要解决上述难题，就要研制出仅需一次装夹就能实现全部工序复合化、高精度加工的机床，而且技术必须完全自主可控。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>“国家需要，我们就干！”武重集团党委书记、董事长洪彰勇表示。</p>
                <p style={{ textIndent: '2em', marginBottom: '1.5rem' }}>2016年年初，武重集团争取到试制燃气轮机机匣加工设备样机的机会。集团制定了总体技术方案，确立了车铣复合工作台、高刚性高转速车铣复合刀架、高精度工作台交换系统等多项关键技术科研先导项目。</p>
                
                <p style={{ textIndent: '2em', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>自力更生从“0”到“1”</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>随着该项目科技攻关“路线图”逐步显现，一群年轻人，带着一股子冲劲，扛起了这一重担。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>要实现该项目所要求的一次装夹完成全部工序的复合、柔性加工机床，首先要实现五轴联动加工，这也是目前国际数控机床的最高水平。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>传统立式车铣机床多为三轴，指代表刀架水平移动的X轴、滑枕上下移动的Z轴、工作台上回转的C轴，共三个进给伺服轴。本项目的五轴则是在这三个进给轴基础上，增加了工作台前后移动的Y轴和位于滑枕末端摆角铣头的B轴。五轴联动，可以车削圆柱、圆锥、各种旋转曲面体，以及平面、沟槽、螺纹；搭配铣头等附件，还可以铣削平面、斜面，钻削垂直、水平或倾斜的孔。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>陈昳说，五轴技术一直被国外封锁。我国虽然研发过一些五轴机床产品，但主要为中小型机床。在满足重大装备制造需求的大型、重型车铣类机床领域，特别是具备回转工作台直线进给功能和重型车铣工位自动交换功能的五轴车铣复合加工中心，国内尚无先例。</p>
                <p style={{ textIndent: '2em', marginBottom: '1.5rem' }}>没有经验、没有图纸、没有专项人才。项目团队查阅了大量资料，唯一的收获是某次国际机床展宣传册上的照片。他们认识到，只能自力更生实现从“0”到“1”的突破。</p>
                
                <p style={{ textIndent: '2em', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>不满足于精度达标</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>那段时间，武重集团办公楼和厂房总有几盏灯彻夜长明。项目团队十几个人“5加2”“白加黑”地工作，一次次将技术方案推倒重来，为一环套一环的难题绞尽脑汁。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>除了五轴联动、柔性制造功能，他们还为该机床赋予了自我监测、智能诊断、自适应加工能力。例如，加工过程中如果机床刀具磨损，会导致工件受损作废，而该机床可以提前感知刀具磨损情况，自动更换刀具、附件等，甚至对温度变化等因素给加工精度带来的细微影响也能敏锐检测，并实现自动补偿。高智能化使得该机床运行时几乎不需要人工干预。陈昳说，普通重型机床，每台一般需要12人操作，但是该机床，一个人就可以管理4台。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>经过近3年艰苦攻关，项目终于推进到样机验收前的最后一步——安装调试阶段。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>“主机端跳径跳均达到0.01毫米、找正台端跳径跳均为0.03毫米、交换精度达到0.02毫米。”检测结果让大家兴奋不已。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>但他们很快发现，虽然精度达标，但主机和找正台跳动的方向却有细微差别。大家又重新调试起来……</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>最终交付的样机，定位精度、重复定位精度等指标均优于国际标准。试用后，其性能让原本对国产设备心存疑虑的用户单位喜出望外，一次续订了39台。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>2023年以来，武重集团陆续接到批量机床订单，用户来自风电、机械工程箱体加工及齿轮加工等领域。这标志着该项目已实现成功转化，打通了从技术研发、试验试制到成果转化的全链条。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>“就在今年3月17日，武重集团获评国务院国资委‘创建世界一流专精特新示范企业’，这是对武重集团主动融入和服务国家发展战略，深入推进科技创新工作的充分认可。”洪彰勇说，“我们将紧紧围绕党的二十大关于科技创新的重大决策部署，一以贯之践行习近平总书记重要指示精神，立足高端装备、短板装备、智能装备发展，强化科技人才培养的顶层设计和战略规划，在战略必争领域打造更多独门绝技！”</p>
              </div>
            </div>

            <div style={{ padding: '1rem 0' }}>
              <h4 className="mt-4 mb-4" style={{ fontSize: '1.25rem', color: 'var(--primary-hover)' }}>【多样性】</h4>
              <Likert name="m1_div1" label="1. 您认为材料体现多元见解和观点的程度如何？（如材料是否体现了科学家、企业、国家制造等多重视角）" />
              <Likert name="m1_div2" label="2. 您认为材料在呈现多元视角（如不同学科、社会层面、文化背景等）的丰富程度如何？（如展现技术链条）" />
              <Likert name="m1_div3" label="3. 您认为材料中信息来源多样性的程度如何？（如引用国资委、用户方评价与团队记录）" />

              <h4 className="mt-8 mb-4" style={{ fontSize: '1.25rem', color: 'var(--primary-hover)' }}>【相关性】</h4>
              <Likert name="m1_rel1" label="1. 您认为材料在涵盖主题的关键方面和提供必要背景信息方面，完整性如何？（如详述卡脖子、研发、转化全链路）" />
              <Likert name="m1_rel2" label="2. 您认为材料在对所呈现的信息进行分析、解释或提供深入见解方面的质量如何？" />
              <Likert name="m1_rel3" label="3. 您认为材料聚焦于重要、相关议题而非杂乱内容的程度如何？" />

              <h4 className="mt-8 mb-4" style={{ fontSize: '1.25rem', color: 'var(--primary-hover)' }}>【伦理】</h4>
              <Likert name="m1_eth1" label="1. 您认为材料在呈现方式上，是否尊重个人权利、避免歧视，并顾及潜在的伦理影响？" />
              <Likert name="m1_eth2" label="2. 材料中存在误导或夸大的倾向程度如何？能否避免引发公众不必要的恐慌或过高期望？" />
              <Likert name="m1_eth3" label="3. 如果材料涉及敏感话题，您认为报道是否以负责任的态度进行了呈现？" />

              <h4 className="mt-8 mb-4" style={{ fontSize: '1.25rem', color: 'var(--primary-hover)' }}>【公正性】</h4>
              <Likert name="m1_fair1" label="1. 您认为材料在保持语气客观的程度如何？" />
              <Likert name="m1_fair2" label="2. 您认为材料在反映各方利益相关者的观点和利益方面，平衡性程度如何？" />
              <Likert name="m1_fair3" label="3. 您认为这篇材料整体情感倾向的程度如何？" />

              <h4 className="mt-8 mb-4" style={{ fontSize: '1.25rem', color: 'var(--primary-hover)' }}>【可理解性】</h4>
              <Likert name="m1_und1" label="1. 比喻准确度？（如材料中的“作为船舶心脏”等比喻）" />
              <Likert name="m1_und2" label="2. 比喻易懂性？" />
              <Likert name="m1_und3" label="3. 您认为材料的语言和表达方式，在简洁易懂程度方面如何？" />
              <Likert name="m1_und4" label="4. 您认为材料的整体结构和逻辑顺序，在清晰度和连贯性方面如何？" />

              <h4 className="mt-8 mb-4" style={{ fontSize: '1.25rem', color: 'var(--primary-hover)' }}>【准确性】</h4>
              <Likert name="m1_acc1" label="1. 您认为材料中陈述的事实、数据和科学信息，在准确性方面如何？" />
              <Likert name="m1_acc2" label="2. 您认为材料引用的事例支撑报道的程度如何？" />
              <Likert name="m1_acc3" label="3. 您认为材料是否清晰地区分了科学事实、研究发现与记者的观点或评论？" />

              <h4 className="mt-8 mb-4" style={{ fontSize: '1.25rem', color: 'var(--primary-hover)' }}>【标题质量】</h4>
              <Likert name="m1_title" label="1. 您觉得该材料标题《为了机匣不再“卡脖子”——我国首套重型五轴立式铣车机床攻关之路》的吸引力如何？" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button onClick={prevStep} className="btn" style={{ background: 'var(--text-muted)' }}>上一页</button>
              <button onClick={nextStep} className="btn">下一页</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="fade-in">
            <h2 className="mb-4" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>四、阅读理解二：古生物遗迹的科学发现</h2>
            
            <div className="form-group" style={{ background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
              <label className="form-label" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>请根据您对“粪化石在古环境重建中的应用”研究的了解程度进行自评：</label>
              <div className="radio-group" style={{ flexDirection: 'column' }}>
                {[
                  '1 - 从未接触过该领域研究，未接触过相关概念',
                  '2 - 听说过相关概念，但未深入了解具体内容',
                  '3 - 了解基本研究框架',
                  '4 - 比较熟悉关键发现',
                  '5 - 掌握技术细节'
                ].map((opt, i) => (
                  <label key={i}><input type="radio" name="m2_self" value={i+1} onChange={handleChange} checked={formData.m2_self === String(i+1)} /><span>{opt}</span></label>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.7)', padding: '2rem', borderRadius: '1.5rem', marginBottom: '3rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h3 className="text-center mb-6" style={{ fontSize: '1.5rem', lineHeight: '1.4' }}>重大发现！中国科学家从3500万年前的粪便中，发现地球长这样——</h3>
              
              <div style={{ fontSize: '1.05rem', lineHeight: '2', color: '#334155' }}>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>国际学术期刊《iScience》第 26 卷第 9 期的封面是一张治愈系风景画面，可以看到，茂密的森林草地中，一片宁静的池塘，好多鳄鱼吃饱了肚子，趴在浅水里休息。但你不知道的是，这张生态环境复原图的依据来自一堆鳄鱼的粪便化石。</p>
                <figure style={{ margin: '2rem 0', textAlign: 'center' }}>
                  <img src="/images/图片1.png" alt="《iScience》第 26 卷第 9 期封面" style={{ maxWidth: '60%', maxHeight: '400px', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                  <figcaption style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>《iScience》第 26 卷第 9 期封面</figcaption>
                </figure>
                <p style={{ textIndent: '2em', marginBottom: '1.5rem' }}>这篇封面论文报道了越南北部始新世晚期距今 3500 万年前的 55 块保存完好的鳄鱼粪便化石，这次发现首次建立了鳄鱼粪新属种，论文通过粪化石生态学研究复原了那阳盆地的古环境面貌，这便是上图中的这幅优美的风景。</p>
                
                <p style={{ textIndent: '2em', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>粪化石：古生物研究的宝贵工具</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>粪化石的研究历史其实已经跨越两个世纪了，从最初的默默无闻，到最近的多学科综合研究，粪化石被证明是古生物研究的宝贵工具。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>早在 1829 年，英国地质学家、古生物学家威廉·巴克兰（William Buckland）首次研究了粪化石，并且创建了“Coprolite”（粪化石）这个名词，这成为后来所有粪化石的统称。当时，英国著名化石猎人玛丽·安宁注意到鱼龙化石的腹部经常有一些“小石头”，打碎小石头后竟然蹦出鱼骨或者鱼鳞化石。玛丽·安宁的观察引起威廉·巴克兰的注意，他经过细致研究后在1829年提出，这些小石头是鱼龙粪化石，粪化石上螺旋状的圈圈是在鱼龙肠道里形成的。</p>
                <figure style={{ margin: '2rem 0', textAlign: 'center' }}>
                  <img src="/images/图片2.png" alt="1835 年威廉·巴克兰在粪化石论文中的插图" style={{ maxWidth: '60%', maxHeight: '400px', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                  <figcaption style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>1835 年威廉·巴克兰在粪化石论文中的插图。图片来源：William Buckland</figcaption>
                </figure>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>其实这不是威廉·巴克兰第一次注意到粪化石了，几年前他就观察到了鬣狗粪化石。1822 年，他在调查一个洞穴沉积中的哺乳动物化石后写道：“这里有许多小球，可能是一种以骨头为食的动物的固体钙质排泄物……它的形状和外观类似斑鬣狗的粪便。”这里再补充一句，威廉·巴克兰还有一项值得纪念的成就，是在 1824 年他研究命名了恐龙第一个有效属种——斑龙。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>现在人们越来越关注粪化石研究，针对粪化石可以进行形态学、埋藏学、古生态学、孢粉学、生物地球化学及系统分类等一系列研究，揭示古生物的日常行为、营养关系、食性特征、消化道结构，甚至古 DNA 信息。</p>
                <figure style={{ margin: '2rem 0', textAlign: 'center' }}>
                  <img src="/images/图片3.png" alt="根据粪化石重建的三叠纪海洋食物网" style={{ maxWidth: '60%', maxHeight: '400px', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                  <figcaption style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>根据粪化石重建的三叠纪海洋食物网。图片来源：Marie Cueille</figcaption>
                </figure>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>英国布里斯托大学曾经对英格兰西南部三叠系海相地层中发现的大量粪化石进行了研究，利用 CT 扫描识别出各种生物的骨骼和鳞片，据此重建了两亿多年前古海洋生物的食物网，推测了捕猎者和被猎食者的关系，研究结果基本遵循了我们的一句口头禅：大鱼吃小鱼，小鱼吃虾米。</p>
                <p style={{ textIndent: '2em', marginBottom: '1.5rem' }}>中国科学院南京地质古生物研究所在白垩纪琥珀中发现了短翅花甲昆虫及它排出的粪化石，昆虫身上及粪化石里面有大量花粉，这些花粉与菊类及蔷薇类植物花粉很像，表明在一亿多年前昆虫就为高等被子植物传播花粉，一直持续到今天。</p>
                
                <p style={{ textIndent: '2em', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>鳄鱼生存的古生态环境是如何重建的？</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>文章开头提到的《iScience》这篇封面文章的研究工作是由中国科学院古脊椎动物与古人类研究所和越南国家自然博物馆合作完成。2018 年秋天联合科考队在越南北部谅山省那阳盆地开展野外考察工作，那阳盆地是东南亚地区的重要化石地点，有丰富的动植物和遗迹化石，与我国广东茂名地区始新世化石地点相似。科考队在那阳煤矿发现了一百多件粪化石以及多种脊椎动物的化石材料。</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '2rem 0' }}>
                  <figure style={{ margin: 0, textAlign: 'center', flex: 1 }}>
                    <img src="/images/图片4.png" alt="科考队在越南北部那阳煤矿考察" style={{ maxWidth: '90%', maxHeight: '350px', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                    <figcaption style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>科考队在越南北部那阳煤矿考察。图片来源：吴飞翔</figcaption>
                  </figure>
                  <figure style={{ margin: 0, textAlign: 'center', flex: 1 }}>
                    <img src="/images/图片5.png" alt="考察中发现原位埋藏的鳄鱼粪化石" style={{ maxWidth: '90%', maxHeight: '350px', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                    <figcaption style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>考察中发现原位埋藏的鳄鱼粪化石，图中化石的尺寸可以参考小刀的大小。图片来源：保罗</figcaption>
                  </figure>
                </div>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>团队在后续的研究中，对这些粪便进行了一系列分析，包括描述形态进行分类、建立粪化石生物地层、观察组织切片、CT 扫描发现内部物质、能谱分析显示元素峰值、孢粉分析重建植被面貌等等。</p>
                <figure style={{ margin: '2rem 0', textAlign: 'center' }}>
                  <img src="/images/图片6.png" alt="越南那阳盆地始新世晚期鳄鱼粪化石" style={{ maxWidth: '60%', maxHeight: '400px', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                  <figcaption style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>越南那阳盆地始新世晚期鳄鱼粪化石。图片来源：保罗</figcaption>
                </figure>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>通过系统分类、孢粉学分析，研究发现：粪化石和恐龙足迹都属于遗迹化石，恐龙足迹的系统分类早已经获得广泛认可，但粪化石的系统分类一直裹足不前，主要有两个原因：</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>一是由于埋藏和成岩作用，粪化石的保存情况存在差异，有的粪便拍成了饼，有的碎成了渣，能保存原样已经很少见了。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>二是有时同一种生物不同的食性会产生不同形态的粪便，这也容易理解，每天吃的东西不一样，排出的粪便也不同，春夏秋冬再加上逢年过节，每年的粪便形态至少得十几种风格吧。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>国际动物命名法委员会于1999年规定了遗迹化石的命名规则，在此规则下这项研究首次引入鳄鱼粪化石的命名法，命名了新属种 Crococopros naduongensis，其中 Crococopros 是鳄鱼粪化石的意思，naduongensis 表示粪化石的发现地越南那阳。</p>
                <figure style={{ margin: '2rem 0', textAlign: 'center' }}>
                  <img src="/images/图片7.png" alt="粪化石及围岩中的孢粉" style={{ maxWidth: '60%', maxHeight: '400px', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                  <figcaption style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>粪化石及围岩中的孢粉。图片来源：保罗</figcaption>
                </figure>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>中国科学院西双版纳热带植物园对粪化石及围岩进行了细致入微的孢粉学分析，发现孢粉极其丰富，共 76 种孢粉类型，包括两种藻类、3 种蕨类、5 种裸子植物、66 种被子植物。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>这些孢粉可以直接帮助我们重建鳄鱼生存的古生态环境，表明三千多万年前越南那阳盆地是热带/亚热带气候，周边地势有高有低，植被环境存在变化。较高的山区是亚热带常绿阔叶林，较低的湖泊、沼泽是热带雨林环境，湖泊和沼泽中存在大量淡水藻类和水生植物，比如睡莲和浮萍。</p>
                <figure style={{ margin: '2rem 0', textAlign: 'center' }}>
                  <img src="/images/图片8.png" alt="越南那阳盆地始新世生态环境复原全图" style={{ maxWidth: '60%', maxHeight: '400px', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                  <figcaption style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>越南那阳盆地始新世生态环境复原全图。图片来源：保罗</figcaption>
                </figure>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>那阳煤矿化石点还发现过鱼类、灵长类、鸟类、龟鳖类等动物化石，结合植被及动物种类，科学家和画家一起就可以对古环境进行重建，还原越南那阳盆地三千多万年前的生态面貌，于是一幅治愈系画面慢慢打开：森林植被繁盛，河流或湖泊水量充沛，食物资源丰富，适合生物繁衍生息。鳄类作为这里食物链的顶端成员，在这里蓬勃发展，吃饱喝足，悠闲排便。</p>
              </div>
            </div>

            <div style={{ padding: '1rem 0' }}>
              <h4 className="mt-4 mb-4" style={{ fontSize: '1.25rem', color: 'var(--primary-hover)' }}>【多样性】</h4>
              <Likert name="m2_div1" label="1. 您认为材料体现多元见解和观点的程度如何？（如动物学、地质学、植物学交叉）" />
              <Likert name="m2_div2" label="2. 您认为材料在呈现多元视角的丰富程度如何？（如展现其多重研究价值）" />
              <Likert name="m2_div3" label="3. 您认为材料中信息来源多样性的程度如何？" />

              <h4 className="mt-8 mb-4" style={{ fontSize: '1.25rem', color: 'var(--primary-hover)' }}>【相关性】</h4>
              <Likert name="m2_rel1" label="1. 您认为材料在涵盖主题的关键方面和提供必要背景信息方面，完整性如何？" />
              <Likert name="m2_rel2" label="2. 您认为材料在对所呈现的信息进行分析、解释或提供深入见解方面的质量如何？" />
              <Likert name="m2_rel3" label="3. 您认为材料聚焦于重要、相关议题而非杂乱内容的程度如何？" />

              <h4 className="mt-8 mb-4" style={{ fontSize: '1.25rem', color: 'var(--primary-hover)' }}>【伦理】</h4>
              <Likert name="m2_eth1" label="1. 您认为材料在呈现方式上，是否尊重个人权利、避免歧视，并顾及潜在的伦理影响？" />
              <Likert name="m2_eth2" label="2. 材料中存在误导或夸大的倾向程度如何？" />
              <Likert name="m2_eth3" label="3. 如果材料涉及敏感话题，您认为报道是否以负责任的态度进行了呈现？" />

              <h4 className="mt-8 mb-4" style={{ fontSize: '1.25rem', color: 'var(--primary-hover)' }}>【公正性】</h4>
              <Likert name="m2_fair1" label="1. 您认为材料在保持语气客观的程度如何？" />
              <Likert name="m2_fair2" label="2. 您认为材料在反映各方利益相关者的观点和利益方面，平衡性程度如何？" />
              <Likert name="m2_fair3" label="3. 您认为这篇材料整体情感倾向的程度如何？" />

              <h4 className="mt-8 mb-4" style={{ fontSize: '1.25rem', color: 'var(--primary-hover)' }}>【可理解性】</h4>
              <Likert name="m2_und1" label="1. 比喻准确度？（如“大鱼吃小鱼，小鱼吃虾米”）" />
              <Likert name="m2_und2" label="2. 比喻易懂性？" />
              <Likert name="m2_und3" label="3. 您认为材料的语言和表达方式，在简洁易懂程度方面如何？" />
              <Likert name="m2_und4" label="4. 您认为材料的整体结构和逻辑顺序，在清晰度和连贯性方面如何？" />

              <h4 className="mt-8 mb-4" style={{ fontSize: '1.25rem', color: 'var(--primary-hover)' }}>【准确性】</h4>
              <Likert name="m2_acc1" label="1. 您认为材料中陈述的事实、数据和科学信息，在准确性方面如何？" />
              <Likert name="m2_acc2" label="2. 您认为材料引用的事例支撑报道的程度如何？" />
              <Likert name="m2_acc3" label="3. 您认为材料是否清晰地区分了科学事实、研究发现与记者的观点或评论？" />

              <h4 className="mt-8 mb-4" style={{ fontSize: '1.25rem', color: 'var(--primary-hover)' }}>【标题质量】</h4>
              <Likert name="m2_title" label="1. 您觉得该材料标题《重大发现！中国科学家从3500万年前的粪便中，发现地球长这样——》的吸引力如何？" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button onClick={prevStep} className="btn" style={{ background: 'var(--text-muted)' }}>上一页</button>
              <button onClick={nextStep} className="btn">下一页</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="fade-in">
            {/* 材料分析 */}
            <h2 className="mb-4" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>五、材料分析</h2>
            <div style={{ background: 'rgba(255,255,255,0.7)', padding: '2rem', borderRadius: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
              <h3 className="mb-4 text-center">为AI“复活”逝者划定应用边界</h3>
              <div style={{ fontSize: '1.05rem', lineHeight: '2', color: '#334155' }}>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>日前，郑州举行了一场2025年清明节节地生态葬活动，为189位逝者举行温馨送别。值得一提的是，在此次活动现场，AI数字人“新生”首次出现在大屏幕上，令逝者家属动容。近年来，随着AI技术的发展，只需一段视频或一张照片，就能通过AI技术让逝去的亲人“复活”，音容笑貌重现屏幕。在清明节前后，有媒体调查发现，各大电商平台和社交平台上，使用AI技术“复活”的服务大量增加，价格从十元到数千元不等。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>随着AI技术的迅速发展，其应用范围也变得越来越广。AI“复活”是利用人工智能技术模拟生成逝者数字形象的应用，通过输入逝者的图片、视频和文字、声音资料，生成具备逝者特征的数字形象。这项新技术通过模拟生成逝者的数字形象，提供一种具象的追忆方式，能够在一定程度上给予人们心理慰藉，帮助人们缅怀和纪念亲人。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>然而，技术的温情背后也暗藏争议，甚至带来隐私泄露和侵权的风险。例如，死者享有人格利益保护，而一些人借助AI“复活”技术，侵犯死者人格利益。此前就有去世明星被网友“复活”，遭到去世明星父母的明确反对，认为这是在“揭伤疤”。为了避免技术滥用，当务之急需要明确技术应用的边界，方便相关部门加强监管，促使这项服务走向规范化发展道路。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>用AI“复活”逝者不能没有边界，要进行相应规范。比如，要事先经过逝者近亲属的同意，不能丑化逝者面容或者生成对逝者名誉有损的画面，不能侵害逝者的肖像、声音等人格权益。《民法典》明确规定，受法律保护的死者人格利益受到侵害的，其配偶、子女、父母有权依法请求行为人承担民事责任；死者没有配偶、子女且父母已经死亡的，其他近亲属有权依法请求行为人承担民事责任。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>AI“复活”亲人展现了AI技术的强大，然而，同样的技术如果不当使用，可能还会带来极大风险。一方面，有不法分子可能会用生成的音视频进行勒索、诈骗，给受害人带来经济损失；另一方面，虚假音视频也可能侵犯个人隐私，损害个人名誉。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>针对当前AI“复活”服务的增加，亟须监管及时到位。对此，要完善相关法律法规，如要为AI技术“复活”服务划定红线，严格规范AI技术“复活”服务，保障死者人格权益。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>近年来，AI技术在各个领域中的应用越发广泛，就像其他一些新技术一样，AI技术本身是中性的，但如果使用不当，就可能带来负面效应。所以，对于AI技术等新业态新技术，要明确划清应用边界，防范其成了不法分子的武器。网民也要谨慎选择AI技术“复活”服务，尤其要注意防范去世亲人的隐私遭到泄露。</p>
                <p style={{ textIndent: '2em', marginBottom: '1rem' }}>AI技术“复活”服务能满足部分消费者悼念逝者的情感需求，对这项服务不应“一棍子打死”。要防范“技术之恶”，关键是让AI“复活”生意告别“野蛮生长”，规范发展。为此，应该划定技术应用边界，让AI等新技术带着“责任的温度”，用责任盖紧AI技术的“潘多拉魔盒”。在为技术赋能的同时，也要赋予其应承担的社会责任，这样科技才能真正实现为我所用，为社会造福。</p>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '1.05rem' }}>1. 阅读过上述材料，关于“AI数字复活”您能联想到哪些相关传播学理论？请至少列举三个理论。[填空]</label>
              <textarea name="ana_theory" className="form-input" rows={4} onChange={handleChange} value={formData.ana_theory}></textarea>
            </div>
            <div className="form-group mb-8">
              <label className="form-label" style={{ fontSize: '1.05rem' }}>2. 针对当前开展AI数字复活研究的需求，请阐述您认为重要的研究视角（至少三个）及原因，并简述拟采用的研究方法。[填空]</label>
              <textarea name="ana_method" className="form-input" rows={6} onChange={handleChange} value={formData.ana_method}></textarea>
            </div>

            {/* 简答题 */}
            <h2 className="mb-4 mt-8" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>六、简答题</h2>
            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>* 该部分请不要借助AI辅助或询问他人，根据您的真实想法作答即可。</p>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '1.05rem' }}>1. AIGC对新闻与传播领域中的学术研究会产生哪些影响？请简要列举3个观点，且回答字数控制在100字以内。</label>
              <textarea name="sa_academic" className="form-input" rows={4} onChange={handleChange} value={formData.sa_academic} maxLength={100}></textarea>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formData.sa_academic?.length || 0}/100</div>
            </div>
            <div className="form-group mb-8">
              <label className="form-label" style={{ fontSize: '1.05rem' }}>2. AIGC对新闻与传播领域中的业界实践会产生哪些影响？请简要列举3个观点，且回答字数控制在100字以内。</label>
              <textarea name="sa_industry" className="form-input" rows={4} onChange={handleChange} value={formData.sa_industry} maxLength={100}></textarea>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formData.sa_industry?.length || 0}/100</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button onClick={prevStep} className="btn" style={{ background: 'var(--text-muted)' }}>上一页</button>
              <button onClick={handleSubmit} className="btn" disabled={loading} style={{ background: '#0ea5e9' }}>
                {loading ? "提交中..." : "提交前测并进入后测"}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
