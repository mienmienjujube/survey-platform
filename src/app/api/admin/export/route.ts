import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

const COLUMN_MAPPING: Record<string, string> = {
  '受试者账号': '受试者账号',
  '受试者密码': '受试者密码',
  '当前阶段': '当前阶段',
  '前测开始时间': '前测开始时间',
  '前测提交时间': '前测提交时间',
  '前测时长(秒)': '前测时长(秒)',
  '前测IP': '前测IP',
  '后测开始时间': '后测开始时间',
  '后测提交时间': '后测提交时间',
  '后测时长(秒)': '后测时长(秒)',
  '后测IP': '后测IP',
  
  // 前测基本信息
  '前测_freq': '1. 您使用生成式AI工具（如ChatGPT、Deepseek等）的频率？',
  '前测_purpose': '2. 您最常使用AI工具的目的是什么？',
  '前测_purpose_other': '2-其他目的',
  '前测_knowledge': '3. 您对“生成式人工智能”的了解程度？',
  '前测_diff': '4. 您是否能区分Deepseek与ChatGPT等主流AI工具的核心差异？',
  '前测_will': '5. 您是否愿意在课程学习、科研写作或实习工作中持续使用AI工具？',
  '前测_impact': '6. 您认为生成式AI对人类学习与思维方式的整体影响是：',
  '前测_tools': '7. 您目前常用的生成式AI工具是哪些？',
  '前测_tools_other': '7-其他工具',
  '前测_plan': '8. 您能够主动规划学习时间并灵活调整计划，确保高效完成学习任务任务程度',
  '前测_interview': '9. 您是否愿意继续参与本课题后续的匿名访谈研究？',
  '前测_interview_email': '9-联系方式',

  // 基准测试
  '前测_base_A': '基准测试-材料A-判断',
  '前测_base_A_reason': '基准测试-材料A-原因',
  '前测_base_B': '基准测试-材料B-判断',
  '前测_base_B_reason': '基准测试-材料B-原因',
  '前测_base_C': '基准测试-材料C-判断',
  '前测_base_C_reason': '基准测试-材料C-原因',
  '前测_base_features': '基准测试-AI痕迹特征',

  // 阅读一 (Pre)
  '前测_m1_self': '前测-阅读一-自评',
  '前测_m1_div1': '前测-阅读一-多样性1-多元见解',
  '前测_m1_div2': '前测-阅读一-多样性2-视角丰富',
  '前测_m1_div3': '前测-阅读一-多样性3-来源多样',
  '前测_m1_rel1': '前测-阅读一-相关性1-完整性',
  '前测_m1_rel2': '前测-阅读一-相关性2-分析深度',
  '前测_m1_rel3': '前测-阅读一-相关性3-议题聚焦',
  '前测_m1_eth1': '前测-阅读一-伦理1-尊重权利',
  '前测_m1_eth2': '前测-阅读一-伦理2-误导倾向',
  '前测_m1_eth3': '前测-阅读一-伦理3-敏感话题',
  '前测_m1_fair1': '前测-阅读一-公正性1-语气客观',
  '前测_m1_fair2': '前测-阅读一-公正性2-利益平衡',
  '前测_m1_fair3': '前测-阅读一-公正性3-情感倾向',
  '前测_m1_und1': '前测-阅读一-理解性1-比喻准确',
  '前测_m1_und2': '前测-阅读一-理解性2-比喻易懂',
  '前测_m1_und3': '前测-阅读一-理解性3-语言简洁',
  '前测_m1_und4': '前测-阅读一-理解性4-结构清晰',
  '前测_m1_acc1': '前测-阅读一-准确性1-事实准确',
  '前测_m1_acc2': '前测-阅读一-准确性2-事例支撑',
  '前测_m1_acc3': '前测-阅读一-准确性3-区分事实观点',
  '前测_m1_title': '前测-阅读一-标题质量',

  // 阅读二 (Pre)
  '前测_m2_self': '前测-阅读二-自评',
  '前测_m2_div1': '前测-阅读二-多样性1-多元见解',
  '前测_m2_div2': '前测-阅读二-多样性2-视角丰富',
  '前测_m2_div3': '前测-阅读二-多样性3-来源多样',
  '前测_m2_rel1': '前测-阅读二-相关性1-完整性',
  '前测_m2_rel2': '前测-阅读二-相关性2-分析深度',
  '前测_m2_rel3': '前测-阅读二-相关性3-议题聚焦',
  '前测_m2_eth1': '前测-阅读二-伦理1-尊重权利',
  '前测_m2_eth2': '前测-阅读二-伦理2-误导倾向',
  '前测_m2_eth3': '前测-阅读二-伦理3-敏感话题',
  '前测_m2_fair1': '前测-阅读二-公正性1-语气客观',
  '前测_m2_fair2': '前测-阅读二-公正性2-利益平衡',
  '前测_m2_fair3': '前测-阅读二-公正性3-情感倾向',
  '前测_m2_und1': '前测-阅读二-理解性1-比喻准确',
  '前测_m2_und2': '前测-阅读二-理解性2-比喻易懂',
  '前测_m2_und3': '前测-阅读二-理解性3-语言简洁',
  '前测_m2_und4': '前测-阅读二-理解性4-结构清晰',
  '前测_m2_acc1': '前测-阅读二-准确性1-事实准确',
  '前测_m2_acc2': '前测-阅读二-准确性2-事例支撑',
  '前测_m2_acc3': '前测-阅读二-准确性3-区分事实观点',
  '前测_m2_title': '前测-阅读二-标题质量',

  '前测_ana_theory': '前测-材料分析-传播学理论',
  '前测_ana_method': '前测-材料分析-研究视角与方法',
  '前测_sa_academic': '前测-简答题1-学术影响',
  '前测_sa_industry': '前测-简答题2-业界影响',

  // 后测 (Post)
  '后测_m1_div1': '后测-阅读一-多样性1-多元见解',
  '后测_m1_div2': '后测-阅读一-多样性2-视角丰富',
  '后测_m1_div3': '后测-阅读一-多样性3-来源多样',
  '后测_m1_rel1': '后测-阅读一-相关性1-完整性',
  '后测_m1_rel2': '后测-阅读一-相关性2-分析深度',
  '后测_m1_rel3': '后测-阅读一-相关性3-议题聚焦',
  '后测_m1_eth1': '后测-阅读一-伦理1-尊重权利',
  '后测_m1_eth2': '后测-阅读一-伦理2-误导倾向',
  '后测_m1_eth3': '后测-阅读一-伦理3-敏感话题',
  '后测_m1_fair1': '后测-阅读一-公正性1-语气客观',
  '后测_m1_fair2': '后测-阅读一-公正性2-利益平衡',
  '后测_m1_fair3': '后测-阅读一-公正性3-情感倾向',
  '后测_m1_und1': '后测-阅读一-理解性1-比喻准确',
  '后测_m1_und2': '后测-阅读一-理解性2-比喻易懂',
  '后测_m1_und3': '后测-阅读一-理解性3-语言简洁',
  '后测_m1_und4': '后测-阅读一-理解性4-结构清晰',
  '后测_m1_acc1': '后测-阅读一-准确性1-事实准确',
  '后测_m1_acc2': '后测-阅读一-准确性2-事例支撑',
  '后测_m1_acc3': '后测-阅读一-准确性3-区分事实观点',
  '后测_m1_title': '后测-阅读一-标题质量',

  '后测_m2_div1': '后测-阅读二-多样性1-多元见解',
  '后测_m2_div2': '后测-阅读二-多样性2-视角丰富',
  '后测_m2_div3': '后测-阅读二-多样性3-来源多样',
  '后测_m2_rel1': '后测-阅读二-相关性1-完整性',
  '后测_m2_rel2': '后测-阅读二-相关性2-分析深度',
  '后测_m2_rel3': '后测-阅读二-相关性3-议题聚焦',
  '后测_m2_eth1': '后测-阅读二-伦理1-尊重权利',
  '后测_m2_eth2': '后测-阅读二-伦理2-误导倾向',
  '后测_m2_eth3': '后测-阅读二-伦理3-敏感话题',
  '后测_m2_fair1': '后测-阅读二-公正性1-语气客观',
  '后测_m2_fair2': '后测-阅读二-公正性2-利益平衡',
  '后测_m2_fair3': '后测-阅读二-公正性3-情感倾向',
  '后测_m2_und1': '后测-阅读二-理解性1-比喻准确',
  '后测_m2_und2': '后测-阅读二-理解性2-比喻易懂',
  '后测_m2_und3': '后测-阅读二-理解性3-语言简洁',
  '后测_m2_und4': '后测-阅读二-理解性4-结构清晰',
  '后测_m2_acc1': '后测-阅读二-准确性1-事实准确',
  '后测_m2_acc2': '后测-阅读二-准确性2-事例支撑',
  '后测_m2_acc3': '后测-阅读二-准确性3-区分事实观点',
  '后测_m2_title': '后测-阅读二-标题质量',

  '后测_theory_1': '后测-材料分析-传播学理论',
  '后测_theory_2': '后测-材料分析-研究视角与方法',
  '后测_short_1': '后测-简答题1-学术影响',
  '后测_short_2': '后测-简答题2-业界影响',
  '材料1-AI对话': '材料1-AI对话记录',
  '材料2-AI对话': '材料2-AI对话记录',
  '材料3-AI对话': '材料3-AI对话记录',
  '简答题-AI对话': '简答题-AI对话记录',
  '后测_feedback': '最终反馈'
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';

    const subjects = await prisma.subject.findMany({
      include: {
        preTest: true,
        postTest: true,
      }
    });

    if (subjects.length === 0) {
      return NextResponse.json({ error: 'No data available' }, { status: 404 });
    }

    const exportData = subjects.map(s => {
      const row: any = {
        '受试者账号': s.username,
        '受试者密码': s.password,
        '当前阶段': s.currentPhase,
        '前测开始时间': s.preTest ? new Date(s.preTest.createdAt.getTime() - (s.preTest.duration || 0) * 1000).toLocaleString() : '',
        '前测提交时间': s.preTest ? s.preTest.createdAt.toLocaleString() : '',
        '前测时长(秒)': s.preTest?.duration || '',
        '前测IP': s.preTest?.ipAddress || '',
        '后测开始时间': s.postTest ? new Date(s.postTest.createdAt.getTime() - (s.postTest.duration || 0) * 1000).toLocaleString() : '',
        '后测提交时间': s.postTest ? s.postTest.createdAt.toLocaleString() : '',
        '后测时长(秒)': s.postTest?.duration || '',
        '后测IP': s.postTest?.ipAddress || '',
      };

      if (s.preTest && s.preTest.data) {
        try {
          const preData = JSON.parse(s.preTest.data);
          Object.keys(preData).forEach(key => {
            row[`前测_${key}`] = Array.isArray(preData[key]) ? preData[key].join(', ') : preData[key];
          });
        } catch (e) {
          console.error('Failed to parse preTest data for subject', s.id);
        }
      }

      if (s.postTest && s.postTest.data) {
        try {
          const postData = JSON.parse(s.postTest.data);
          Object.keys(postData).forEach(key => {
            row[`后测_${key}`] = Array.isArray(postData[key]) ? postData[key].join(', ') : postData[key];
          });
        } catch (e) {
          console.error('Failed to parse postTest data for subject', s.id);
        }
      }

      if (s.postTest && s.postTest.aiLogs) {
        try {
          let logs = JSON.parse(s.postTest.aiLogs);
          // Handle potential double-stringification from previous bug
          if (typeof logs === 'string') {
            try {
              logs = JSON.parse(logs);
            } catch (e) {}
          }
          
          const formatLog = (msgs: any) => {
            if (!msgs || !Array.isArray(msgs) || msgs.length === 0) return '';
            let qCount = 0;
            let aCount = 0;
            return msgs.map((m: any) => {
              if (m.role === 'user') {
                qCount++;
                return `提问${qCount}：${m.content}`;
              } else {
                aCount++;
                return `回答${aCount}：${m.content}`;
              }
            }).join('\n');
          };

          if (typeof logs === 'object' && !Array.isArray(logs)) {
            // Newest format: explicit chat1, chat2...
            row['材料1-AI对话记录'] = formatLog(logs.chat1 || logs[1] || logs['1']);
            row['材料2-AI对话记录'] = formatLog(logs.chat2 || logs[2] || logs['2']);
            row['材料3-AI对话记录'] = formatLog(logs.chat3 || logs[3] || logs['3']);
            row['简答题-AI对话记录'] = formatLog(logs.chat4 || logs[4] || logs['4']);
          } else if (Array.isArray(logs)) {
            row['材料1-AI对话记录'] = formatLog(logs);
          }
        } catch (e) {
          console.error('Export parse error:', e);
        }
      }

      // Rename keys based on mapping
      const mappedRow: any = {};
      Object.keys(row).forEach(key => {
        const mappedKey = COLUMN_MAPPING[key] || key;
        mappedRow[mappedKey] = row[key];
      });

      return mappedRow;
    });

    // Explicitly order headers
    const ORDERED_HEADERS = [
      '受试者账号',
      '受试者密码',
      '当前阶段',
      '前测开始时间',
      '前测提交时间',
      '前测时长(秒)',
      '前测IP',
      '后测开始时间',
      '后测提交时间',
      '后测时长(秒)',
      '后测IP',
      ...Object.values(COLUMN_MAPPING).filter(v => 
        !['受试者账号','受试者密码','当前阶段','前测开始时间','前测提交时间','前测时长(秒)','前测IP','后测开始时间','后测提交时间','后测时长(秒)','后测IP','AI对话记录','材料1-AI对话记录','材料2-AI对话记录','材料3-AI对话记录','简答题-AI对话记录'].includes(v)
      ),
      '材料1-AI对话记录',
      '材料2-AI对话记录',
      '材料3-AI对话记录',
      '简答题-AI对话记录'
    ];

    if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(exportData, { header: ORDERED_HEADERS });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Survey Data');
      
      const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return new Response(buf, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="survey_data_${Date.now()}.xlsx"`
        }
      });
    } else {
      const headers = ORDERED_HEADERS;
      const csvRows = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(h => {
            const val = row[h] === undefined ? '' : String(row[h]);
            return `"${val.replace(/"/g, '""')}"`;
          }).join(',')
        )
      ];
      
      const csvString = '\uFEFF' + csvRows.join('\n');

      return new Response(csvString, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="survey_data_${Date.now()}.csv"`
        }
      });
    }

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
