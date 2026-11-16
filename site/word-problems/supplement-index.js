/* Supplement catalog after source-level textbook deduplication. Shared tasks remain in the textbook catalog. */
(function(root){
const index={
  "title": "补充练习",
  "originalTaskCount": 55,
  "uniqueCount": 27,
  "excludedCount": 28,
  "uniqueIds": [
    "L7-P2",
    "L8-P1-V1",
    "L8-P1-V2",
    "L8-P1-V3",
    "L8-P2-Q2",
    "L8-P2-Q3",
    "L8-P2-Q4",
    "L8-P2-Q5",
    "L8-P2-V1",
    "L8-P2-V2",
    "L8-P2-V3",
    "G9-02",
    "G9-04",
    "G9-05",
    "G10-03",
    "G10-04",
    "G10-05",
    "G10-06",
    "S02",
    "S03",
    "S04",
    "S05",
    "S06",
    "S07",
    "S08",
    "S09",
    "S10"
  ],
  "excludedIds": [
    "L7-P1",
    "L7-P3",
    "L7-T1",
    "L7-T2",
    "L7-H1",
    "L7-H2",
    "L7-H3",
    "L8-P1",
    "L8-P2-Q1",
    "L8-T1",
    "L8-T2",
    "L8-H1",
    "L8-H2",
    "L8-H3",
    "G9-01",
    "G9-03",
    "G9-06",
    "G9-07",
    "G9-08",
    "G9-09",
    "G9-10",
    "G10-01",
    "G10-02",
    "G10-07",
    "G10-08",
    "G10-09",
    "G10-10",
    "S01"
  ],
  "exclusions": [
    {
      "problemId": "L7-P1",
      "title": "茶具用泥",
      "textbookLocations": [
        {
          "id": "A01",
          "source": "《数学 七年级上册》苏科版2026，121页 · 问题（紫砂壶茶具）",
          "pages": [
            121
          ]
        }
      ]
    },
    {
      "problemId": "L7-P3",
      "title": "年龄与同一时刻",
      "textbookLocations": [
        {
          "id": "A02",
          "source": "《数学 七年级上册》苏科版2026，122页 · 例1",
          "pages": [
            122
          ]
        }
      ]
    },
    {
      "problemId": "L7-T1",
      "title": "五年后的年龄和",
      "textbookLocations": [
        {
          "id": "A04",
          "source": "《数学 七年级上册》苏科版2026，122页 · 练习第2题",
          "pages": [
            122
          ]
        }
      ]
    },
    {
      "problemId": "L7-T2",
      "title": "两个小组增员",
      "textbookLocations": [
        {
          "id": "A05",
          "source": "《数学 七年级上册》苏科版2026，122页 · 练习第3题",
          "pages": [
            122
          ]
        }
      ]
    },
    {
      "problemId": "L7-H1",
      "title": "年龄差与倍数",
      "textbookLocations": [
        {
          "id": "A22",
          "source": "《数学 七年级上册》苏科版2026，128页 · 习题第2题",
          "pages": [
            128
          ]
        }
      ]
    },
    {
      "problemId": "L7-H2",
      "title": "仓库存粮的变化",
      "textbookLocations": [
        {
          "id": "A23",
          "source": "《数学 七年级上册》苏科版2026，128页 · 习题第3题",
          "pages": [
            128
          ]
        }
      ]
    },
    {
      "problemId": "L7-H3",
      "title": "航模组女生比例",
      "textbookLocations": [
        {
          "id": "A24",
          "source": "《数学 七年级上册》苏科版2026，128页 · 习题第4题",
          "pages": [
            128
          ]
        }
      ]
    },
    {
      "problemId": "L8-P1",
      "title": "八折出售的羽绒服",
      "textbookLocations": [
        {
          "id": "A06",
          "source": "《数学 七年级上册》苏科版2026，123页 · 例2",
          "pages": [
            123
          ]
        }
      ]
    },
    {
      "problemId": "L8-P2-Q1",
      "title": "小亮多久追上",
      "textbookLocations": [
        {
          "id": "A07",
          "source": "《数学 七年级上册》苏科版2026，123、124页 · 例3",
          "pages": [
            123,
            124
          ]
        }
      ]
    },
    {
      "problemId": "L8-T1",
      "title": "自行车的标价",
      "textbookLocations": [
        {
          "id": "A08",
          "source": "《数学 七年级上册》苏科版2026，124页 · 练习第1题",
          "pages": [
            124
          ]
        }
      ]
    },
    {
      "problemId": "L8-T2",
      "title": "环形步道再次相遇",
      "textbookLocations": [
        {
          "id": "A09",
          "source": "《数学 七年级上册》苏科版2026，124页 · 练习第2题",
          "pages": [
            124
          ]
        }
      ]
    },
    {
      "problemId": "L8-H1",
      "title": "两件衬衫的盈亏",
      "textbookLocations": [
        {
          "id": "A26",
          "source": "《数学 七年级上册》苏科版2026，129页 · 习题第6题",
          "pages": [
            129
          ]
        }
      ]
    },
    {
      "problemId": "L8-H2",
      "title": "同路不同速的到达时间",
      "textbookLocations": [
        {
          "id": "A27",
          "source": "《数学 七年级上册》苏科版2026，129页 · 习题第7题",
          "pages": [
            129
          ]
        }
      ]
    },
    {
      "problemId": "L8-H3",
      "title": "上山和下山",
      "textbookLocations": [
        {
          "id": "A28",
          "source": "《数学 七年级上册》苏科版2026，129页 · 习题第8题",
          "pages": [
            129
          ]
        }
      ]
    },
    {
      "problemId": "G9-01",
      "title": "三角形角度比",
      "textbookLocations": [
        {
          "id": "A11",
          "source": "《数学 七年级上册》苏科版2026，125页 · 例4",
          "pages": [
            125
          ]
        }
      ]
    },
    {
      "problemId": "G9-03",
      "title": "黑棋图案能否有50颗",
      "textbookLocations": [
        {
          "id": "A12",
          "source": "《数学 七年级上册》苏科版2026，125页 · 例5",
          "pages": [
            125
          ]
        }
      ]
    },
    {
      "problemId": "G9-06",
      "title": "梯形的下底",
      "textbookLocations": [
        {
          "id": "I21",
          "source": "《数学 七年级上册》苏科版2026，120页 · 习题6",
          "pages": [
            120
          ]
        },
        {
          "id": "A13",
          "source": "《数学 七年级上册》苏科版2026，126页 · 练习第1题",
          "pages": [
            126
          ]
        }
      ]
    },
    {
      "problemId": "G9-07",
      "title": "相连的火柴棒小鱼",
      "textbookLocations": [
        {
          "id": "A15",
          "source": "《数学 七年级上册》苏科版2026，126页 · 练习第3题",
          "pages": [
            126
          ]
        }
      ]
    },
    {
      "problemId": "G9-08",
      "title": "三个连续奇数的积",
      "textbookLocations": [
        {
          "id": "A31",
          "source": "《数学 七年级上册》苏科版2026，129页 · 习题第11题",
          "pages": [
            129
          ]
        }
      ]
    },
    {
      "problemId": "G9-09",
      "title": "叠放菱形的数量",
      "textbookLocations": [
        {
          "id": "A33",
          "source": "《数学 七年级上册》苏科版2026，130页 · 习题第13题",
          "pages": [
            130
          ]
        }
      ]
    },
    {
      "problemId": "G9-10",
      "title": "七层宝塔的灯数",
      "textbookLocations": [
        {
          "id": "A14",
          "source": "《数学 七年级上册》苏科版2026，126页 · 练习第2题",
          "pages": [
            126
          ]
        }
      ]
    },
    {
      "problemId": "G10-01",
      "title": "鸡兔同笼",
      "textbookLocations": [
        {
          "id": "I00",
          "source": "《数学 七年级上册》苏科版2026，105页 · 章引入：鸡兔同笼",
          "pages": [
            105
          ]
        },
        {
          "id": "A16",
          "source": "《数学 七年级上册》苏科版2026，126页 · 例6",
          "pages": [
            126
          ]
        }
      ]
    },
    {
      "problemId": "G10-02",
      "title": "先单独后合作完成任务",
      "textbookLocations": [
        {
          "id": "A17",
          "source": "《数学 七年级上册》苏科版2026，127页 · 例7",
          "pages": [
            127
          ]
        }
      ]
    },
    {
      "problemId": "G10-07",
      "title": "合资买羊的两种方案",
      "textbookLocations": [
        {
          "id": "A36",
          "source": "《数学 七年级上册》苏科版2026，130页 · 习题第16题",
          "pages": [
            130
          ]
        }
      ]
    },
    {
      "problemId": "G10-08",
      "title": "先合作后单独铺管道",
      "textbookLocations": [
        {
          "id": "A20",
          "source": "《数学 七年级上册》苏科版2026，128页 · 练习第3题",
          "pages": [
            128
          ]
        }
      ]
    },
    {
      "problemId": "G10-09",
      "title": "野鸭与大雁相向而飞",
      "textbookLocations": [
        {
          "id": "A19",
          "source": "《数学 七年级上册》苏科版2026，128页 · 练习第2题",
          "pages": [
            128
          ]
        }
      ]
    },
    {
      "problemId": "G10-10",
      "title": "三册小说的印刷工作量",
      "textbookLocations": [
        {
          "id": "A35",
          "source": "《数学 七年级上册》苏科版2026，130页 · 习题第15题",
          "pages": [
            130
          ]
        }
      ]
    },
    {
      "problemId": "S01",
      "title": "为总价方程编一个故事",
      "textbookLocations": [
        {
          "id": "R02",
          "source": "《数学 七年级上册》苏科版2026，133页 · 第4题",
          "pages": [
            133
          ]
        }
      ]
    }
  ],
  "retentionNote": "补充练习只保留教材目录未收录的题目。相同情境但提问、条件或研究目标不同的变式保留。教材共用题目只从补充目录移除，原分析路径和学习记录继续保留。"
};
if(typeof module==='object'&&module.exports)module.exports=index;
else root.RatioWordProblemSupplementIndex=index;
})(typeof window==='undefined'?globalThis:window);
