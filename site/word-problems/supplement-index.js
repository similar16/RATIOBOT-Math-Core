/* Supplement catalog: preserve old sources and add the reviewed uploaded chapter. */
(function(root){
const index={
  "title": "补充练习",
  "originalTaskCount": 54,
  "uniqueCount": 26,
  "excludedCount": 28,
  "uniqueIds": [
    "L7-P2",
    "L8-P1-V1",
    "L8-P1-V2",
    "L8-P1-V3",
    "L8-P2-Q2",
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
      "title": "三个连续奇数相加",
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
  "retentionNote": "原有补充练习26题与人教版44道代表题合为70题，按题型导航.人教版80组中36组高度相似题已合并；完整来源与差异保留在核对记录.既有题号及进度不变，不互认不同变式的完成状态.",
  "additionalIds": [
    "PEP-P002",
    "PEP-P003",
    "PEP-P005",
    "PEP-P012",
    "PEP-P014",
    "PEP-P015",
    "PEP-P018",
    "PEP-P020",
    "PEP-P021",
    "PEP-P022",
    "PEP-P023",
    "PEP-P025",
    "PEP-P031",
    "PEP-P032",
    "PEP-P035",
    "PEP-P037",
    "PEP-P038",
    "PEP-P039",
    "PEP-P040",
    "PEP-P041",
    "PEP-P042",
    "PEP-P043",
    "PEP-P047",
    "PEP-P048",
    "PEP-P049",
    "PEP-P050",
    "PEP-P051",
    "PEP-P052",
    "PEP-P053",
    "PEP-P054",
    "PEP-P055",
    "PEP-P060",
    "PEP-P062",
    "PEP-P063",
    "PEP-P064",
    "PEP-P066",
    "PEP-P068",
    "PEP-P072",
    "PEP-P074",
    "PEP-P075",
    "PEP-P076",
    "PEP-P077",
    "PEP-P078",
    "PEP-P080"
  ],
  "mergedUniqueIds": [
    "L7-P2",
    "L8-P1-V1",
    "L8-P1-V2",
    "L8-P1-V3",
    "L8-P2-Q2",
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
    "S10",
    "PEP-P002",
    "PEP-P003",
    "PEP-P005",
    "PEP-P012",
    "PEP-P014",
    "PEP-P015",
    "PEP-P018",
    "PEP-P020",
    "PEP-P021",
    "PEP-P022",
    "PEP-P023",
    "PEP-P025",
    "PEP-P031",
    "PEP-P032",
    "PEP-P035",
    "PEP-P037",
    "PEP-P038",
    "PEP-P039",
    "PEP-P040",
    "PEP-P041",
    "PEP-P042",
    "PEP-P043",
    "PEP-P047",
    "PEP-P048",
    "PEP-P049",
    "PEP-P050",
    "PEP-P051",
    "PEP-P052",
    "PEP-P053",
    "PEP-P054",
    "PEP-P055",
    "PEP-P060",
    "PEP-P062",
    "PEP-P063",
    "PEP-P064",
    "PEP-P066",
    "PEP-P068",
    "PEP-P072",
    "PEP-P074",
    "PEP-P075",
    "PEP-P076",
    "PEP-P077",
    "PEP-P078",
    "PEP-P080",
    "C21-01",
    "C21-02",
    "C21-03",
    "C21-04",
    "C21-05",
    "C21-06",
    "C21-07",
    "C21-08",
    "C21-09",
    "C21-10",
    "C21-11"
  ],
  "mergedUniqueCount": 81,
  "peopleEducation": {
    "chapter": 5,
    "sourceGroups": 80,
    "retainedGroups": 44,
    "mergedGroups": 36,
    "coverageFile": "content/word-problems/pep-ch5-coverage.json",
    "mergedSources": [
      {
        "collectionId": "P001",
        "title": "两支登山队追及",
        "source": "《数学 七年级上册》人教版，110页 · 章引言",
        "repeatSources": [
          "《数学 七年级上册》人教版，111页 · 节首回到本章引言的问题",
          "《数学 七年级上册》人教版，124页 · 练习 第2题"
        ],
        "problemIds": [
          "S10"
        ],
        "mergeType": "same-problem",
        "note": "两营地距离、两队速度和追及目标相同；保留110、111、124页三个位置，不重复开题."
      },
      {
        "collectionId": "P004",
        "title": "两种铅笔的购买支数",
        "source": "《数学 七年级上册》人教版，113页 · 练习第1题",
        "repeatSources": [],
        "problemIds": [
          "L7-P2"
        ],
        "mergeType": "similar-model",
        "note": "两种单价、总数量与总金额，列式结构一致."
      },
      {
        "collectionId": "P006",
        "title": "依图形标量列方程",
        "source": "《数学 七年级上册》人教版，118页 · 第2题",
        "repeatSources": [],
        "problemIds": [
          "PEP-P072",
          "G9-01"
        ],
        "mergeType": "split-similar",
        "note": "第(1)问三项和与差量由奖牌题代表，第(2)问内角和与倍数由三角形角度比题代表；第(3)问为二次模型，只保留边界记录."
      },
      {
        "collectionId": "P007",
        "title": "班级男女生人数",
        "source": "《数学 七年级上册》人教版，118页 · 第5题",
        "repeatSources": [],
        "problemIds": [
          "TB-R06"
        ],
        "mergeType": "similar-model",
        "note": "总量与倍数加固定差量的关系相同."
      },
      {
        "collectionId": "P008",
        "title": "奖学金获奖人数",
        "source": "《数学 七年级上册》人教版，118页 · 第6题",
        "repeatSources": [],
        "problemIds": [
          "TB-R07"
        ],
        "mergeType": "similar-model",
        "note": "两类物品的总数量与总金额双重约束相同."
      },
      {
        "collectionId": "P009",
        "title": "人均可支配收入增长",
        "source": "《数学 七年级上册》人教版，119页 · 第7题",
        "repeatSources": [],
        "problemIds": [
          "TB-A25"
        ],
        "mergeType": "similar-model",
        "note": "已知增长率及增长后的量，反求原量."
      },
      {
        "collectionId": "P010",
        "title": "汽车累计里程",
        "source": "《数学 七年级上册》人教版，119页 · 第8题",
        "repeatSources": [],
        "problemIds": [
          "TB-R03"
        ],
        "mergeType": "similar-model",
        "note": "原有量加每期增加量乘期数等于最终量."
      },
      {
        "collectionId": "P011",
        "title": "两班捐款与学生人数",
        "source": "《数学 七年级上册》人教版，119页 · 第10题",
        "repeatSources": [],
        "problemIds": [
          "TB-I19"
        ],
        "mergeType": "similar-model",
        "note": "单位量乘数量，再用固定差量连接已知总额；捐款场景和数值保留在来源记录."
      },
      {
        "collectionId": "P013",
        "title": "三年购买计算机",
        "source": "《数学 七年级上册》人教版，120页 · 正文 问题1",
        "repeatSources": [],
        "problemIds": [
          "G9-10"
        ],
        "mergeType": "similar-model",
        "note": "连续按固定倍数变化并用各期总和列式."
      },
      {
        "collectionId": "P016",
        "title": "三种洗衣机生产配比",
        "source": "《数学 七年级上册》人教版，121页 · 练习 第3题",
        "repeatSources": [],
        "problemIds": [
          "TB-R09"
        ],
        "mergeType": "similar-model",
        "note": "按三部分比例分配已知总量."
      },
      {
        "collectionId": "P017",
        "title": "分书的剩余与不足",
        "source": "《数学 七年级上册》人教版，122、123页 · 正文 问题2",
        "repeatSources": [],
        "problemIds": [
          "S02"
        ],
        "mergeType": "similar-model",
        "note": "同一人数与同一总量的盈不足模型."
      },
      {
        "collectionId": "P019",
        "title": "父子年龄",
        "source": "《数学 七年级上册》人教版，124页 · 练习 第3题",
        "repeatSources": [],
        "problemIds": [
          "L7-H1"
        ],
        "mergeType": "similar-model",
        "note": "已知年龄差与年龄倍数，只有数值变化."
      },
      {
        "collectionId": "P024",
        "title": "大小中国结用绳",
        "source": "《数学 七年级上册》人教版，126页 · 练习 第3题",
        "repeatSources": [],
        "problemIds": [
          "L7-P2"
        ],
        "mergeType": "similar-model",
        "note": "两类单位耗量、总件数与总耗量，和两价购物同构."
      },
      {
        "collectionId": "P026",
        "title": "莱茵德纸草书中的数",
        "source": "《数学 七年级上册》人教版，129页 · 练习 第2题",
        "repeatSources": [],
        "problemIds": [
          "TB-I10"
        ],
        "mergeType": "similar-model",
        "note": "一个数与它的若干分数相加等于已知量."
      },
      {
        "collectionId": "P027",
        "title": "客车卡车早到时间",
        "source": "《数学 七年级上册》人教版，129页 · 练习 第3题",
        "repeatSources": [],
        "problemIds": [
          "L8-H2"
        ],
        "mergeType": "similar-model",
        "note": "同一路程按不同速度行走，利用到达时间差列式."
      },
      {
        "collectionId": "P028",
        "title": "60米绳围长方形",
        "source": "《数学 七年级上册》人教版，130页 · 习题5.2 复习巩固 第5题",
        "repeatSources": [],
        "problemIds": [
          "TB-I16"
        ],
        "mergeType": "similar-model",
        "note": "长宽倍数与长方形周长相同结构."
      },
      {
        "collectionId": "P029",
        "title": "共同种树的剩余与不足",
        "source": "《数学 七年级上册》人教版，130页 · 习题5.2 复习巩固 第6题",
        "repeatSources": [],
        "problemIds": [
          "S02"
        ],
        "mergeType": "similar-model",
        "note": "两种平均分配的余量与不足量决定同一总量."
      },
      {
        "collectionId": "P030",
        "title": "购买两种布料",
        "source": "《数学 七年级上册》人教版，130页 · 习题5.2 复习巩固 第7题",
        "repeatSources": [],
        "problemIds": [
          "L7-P2"
        ],
        "mergeType": "similar-model",
        "note": "两种价格的布料，总长度与总价双约束."
      },
      {
        "collectionId": "P033",
        "title": "再生纸产量",
        "source": "《数学 七年级上册》人教版，131页 · 习题5.2 综合运用 第10题",
        "repeatSources": [],
        "problemIds": [
          "TB-I15"
        ],
        "mergeType": "similar-model",
        "note": "一个量等于另一个量的两倍加固定差量."
      },
      {
        "collectionId": "P034",
        "title": "先后出发同时登顶",
        "source": "《数学 七年级上册》人教版，131页 · 习题5.2 综合运用 第11题",
        "repeatSources": [],
        "problemIds": [
          "L8-P2-Q2"
        ],
        "mergeType": "similar-model",
        "note": "先出发时长与速度差决定追及或同时到达的行程."
      },
      {
        "collectionId": "P036",
        "title": "飞机顺逆风航行",
        "source": "《数学 七年级上册》人教版，131页 · 习题5.2 综合运用 第13题",
        "repeatSources": [],
        "problemIds": [
          "PEP-P022"
        ],
        "mergeType": "similar-model",
        "note": "顺风逆风与顺水逆水均为本体速度加减介质速度."
      },
      {
        "collectionId": "P044",
        "title": "劳动支援人数分配",
        "source": "《数学 七年级上册》人教版，134页 · 练习第2题",
        "repeatSources": [],
        "problemIds": [
          "L7-T2"
        ],
        "mergeType": "similar-model",
        "note": "27、19、20、2四个条件与两个小组增员题一致，保留已有题与已有进度."
      },
      {
        "collectionId": "P045",
        "title": "钢材制作仪器部件",
        "source": "《数学 七年级上册》人教版，134页 · 练习第3题",
        "repeatSources": [],
        "problemIds": [
          "PEP-P055"
        ],
        "mergeType": "similar-model",
        "note": "两类零件按比例配套，分配有限原料."
      },
      {
        "collectionId": "P046",
        "title": "销售中的盈亏",
        "source": "《数学 七年级上册》人教版，135页 · 探究1及正文反思",
        "repeatSources": [],
        "problemIds": [
          "L8-H1"
        ],
        "mergeType": "similar-model",
        "note": "两件同价售出、各盈利与亏损25%，只变售价."
      },
      {
        "collectionId": "P056",
        "title": "两种零件生产天数分配",
        "source": "《数学 七年级上册》人教版，140页 · 复习巩固第3题",
        "repeatSources": [],
        "problemIds": [
          "PEP-P041"
        ],
        "mergeType": "similar-model",
        "note": "按两类日产量和配套关系分配生产资源；天数与人数作为不同情境归档."
      },
      {
        "collectionId": "P057",
        "title": "先合作后乙单独完成工作",
        "source": "《数学 七年级上册》人教版，140页 · 复习巩固第4题",
        "repeatSources": [],
        "problemIds": [
          "G10-08"
        ],
        "mergeType": "similar-model",
        "note": "先合作后独做，按阶段累计工作量."
      },
      {
        "collectionId": "P058",
        "title": "增加人数整理四分之三的数据",
        "source": "《数学 七年级上册》人教版，140页 · 复习巩固第5题",
        "repeatSources": [],
        "problemIds": [
          "PEP-P042"
        ],
        "mergeType": "similar-model",
        "note": "先由若干人工作再增员，用人均效率累计工作量；完成目标3/4这一数值变式仍保留原题记录."
      },
      {
        "collectionId": "P059",
        "title": "两种机器产量与装箱",
        "source": "《数学 七年级上册》人教版，140页 · 综合运用第6题",
        "repeatSources": [],
        "problemIds": [
          "PEP-P038"
        ],
        "mergeType": "similar-model",
        "note": "先用单位容积和剩余量表示工作量，再比较单位时间效率."
      },
      {
        "collectionId": "P061",
        "title": "大小月饼的面粉分配",
        "source": "《数学 七年级上册》人教版，140页 · 综合运用第8题",
        "repeatSources": [],
        "problemIds": [
          "L7-P1"
        ],
        "mergeType": "similar-model",
        "note": "每套包含两类产品，依据每件耗料与总耗料求套数."
      },
      {
        "collectionId": "P065",
        "title": "丢番图的年龄",
        "source": "《数学 七年级上册》人教版，141页 · 拓广探索第13题",
        "repeatSources": [],
        "problemIds": [
          "TB-A37"
        ],
        "mergeType": "similar-model",
        "note": "相同丢番图墓志铭方程；人教版附问为当爸爸时年龄，已有题为结婚年龄，差异与原问均保留."
      },
      {
        "collectionId": "P067",
        "title": "生活中的阶梯计价问题",
        "source": "《数学 七年级上册》人教版，143页 · 数学活动 活动1",
        "repeatSources": [],
        "problemIds": [
          "TB-A34"
        ],
        "mergeType": "similar-model",
        "note": "分段水价调查由已有分段计费题代表；开放调查要求保留在来源."
      },
      {
        "collectionId": "P069",
        "title": "从温差、人数、售价、植树列方程",
        "source": "《数学 七年级上册》人教版，146页 · 复习题5·复习巩固1",
        "repeatSources": [],
        "problemIds": [
          "L7-H1",
          "PEP-P003",
          "L8-P1",
          "PEP-P038"
        ],
        "mergeType": "split-similar",
        "note": "四小问分别归入差与倍数、百分数部分与整体、进售价变化、平均效率比较；保留全部原句，不冒称代表题与原题数值相同."
      },
      {
        "collectionId": "P070",
        "title": "梯形面积公式应用",
        "source": "《数学 七年级上册》人教版，147页 · 复习题5·复习巩固5",
        "repeatSources": [],
        "problemIds": [
          "G9-06"
        ],
        "mergeType": "similar-model",
        "note": "梯形面积公式中已知三量求第四量."
      },
      {
        "collectionId": "P071",
        "title": "矿泉水和毛巾的购买费用",
        "source": "《数学 七年级上册》人教版，147页 · 复习题5·复习巩固6",
        "repeatSources": [],
        "problemIds": [
          "TB-I18"
        ],
        "mergeType": "similar-model",
        "note": "两类物品购买总价，已知一类单价，求另一类单价."
      },
      {
        "collectionId": "P073",
        "title": "快马追慢马",
        "source": "《数学 七年级上册》人教版，147页 · 复习题5·综合运用8",
        "repeatSources": [],
        "problemIds": [
          "L8-P2-Q1"
        ],
        "mergeType": "similar-model",
        "note": "慢者先出发，快者同向追及，统一计时起点."
      },
      {
        "collectionId": "P079",
        "title": "游泳馆会员与非会员费用",
        "source": "《数学 七年级上册》人教版，148页 · 复习题5·拓广探索14",
        "repeatSources": [],
        "problemIds": [
          "PEP-P052"
        ],
        "mergeType": "similar-model",
        "note": "固定费用加按次数累计的费用，比较临界点两侧；整数次数约束在原问记录中保留."
      }
    ]
  },
  "chapter2021": {
    "sourceTitle": "第四章 用一元一次方程解决问题（2021.12 含习题）(1).pdf",
    "pdfPageCount": 31,
    "uniqueIds": [
      "C21-01",
      "C21-02",
      "C21-03",
      "C21-04",
      "C21-05",
      "C21-06",
      "C21-07",
      "C21-08",
      "C21-09",
      "C21-10",
      "C21-11"
    ],
    "retainedCount": 11,
    "sourceAudit": "content/word-problems/chapter-2021-audit.json",
    "completionTransfer": false,
    "sourcePositionCount": 82,
    "problemPositionCount": 81,
    "methodPositionCount": 1,
    "existingOrSimilarProblemPositions": 70,
    "mergedSources": [
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第1页 · 4.1正文",
        "title": "汽车行驶240千米",
        "problemIds": [
          "TB-I01"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第1页 · 4.1探究1",
        "title": "天平平衡",
        "problemIds": [
          "TB-I03"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第1页 · 4.1探究2",
        "title": "两车同时相向而行",
        "problemIds": [
          "TB-A29"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第2页 · 4.1探究3",
        "title": "篮球联赛胜负场数",
        "problemIds": [
          "TB-I09"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第2页 · 4.1思考1",
        "title": "小红年龄是爸爸的四分之一",
        "problemIds": [
          "L7-P3"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第2页 · 4.1思考2",
        "title": "合资买狗",
        "problemIds": [
          "S02"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第3页 · 4.1练习1",
        "title": "长方形花坛的宽",
        "problemIds": [
          "TB-I01"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第3页 · 4.1练习2",
        "title": "蓝鲸平均每天增重",
        "problemIds": [
          "TB-I13"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第3页 · 4.1练习3",
        "title": "分装大米",
        "problemIds": [
          "TB-I06"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第3页 · 4.1练习4",
        "title": "铁路提速缩短时间",
        "problemIds": [
          "TB-I12"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第3页 · 4.1习题1",
        "title": "汽车驶往乙站",
        "problemIds": [
          "TB-I01"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第3页 · 4.1习题2",
        "title": "邮购书籍与邮费",
        "problemIds": [
          "TB-I19"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第3页 · 4.1习题3",
        "title": "练习本与圆珠笔",
        "problemIds": [
          "TB-I18"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第3页 · 4.1习题4",
        "title": "出租车起步费与超程费",
        "problemIds": [
          "TB-I20"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第4页 · 4.3（1）问题1",
        "title": "树苗长到一米",
        "problemIds": [
          "TB-I13"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第5页 · 4.3（1）问题2",
        "title": "按标价八折与固定利润",
        "problemIds": [
          "L8-T1"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第6页 · 4.3（1）练习1",
        "title": "换季服装标价",
        "problemIds": [
          "L8-T1"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第6页 · 4.3（1）练习2",
        "title": "足球黑白皮块比例",
        "problemIds": [
          "TB-I17"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第7页 · 4.3（1）习题1",
        "title": "计算机达到检修时间",
        "problemIds": [
          "TB-I13"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第7页 · 4.3（1）习题2",
        "title": "弹簧长度与重物质量",
        "problemIds": [
          "TB-R03"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第7页 · 4.3（1）习题3",
        "title": "两个旅游团人数",
        "problemIds": [
          "TB-R06"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第8页 · 4.3（1）习题4",
        "title": "寄信与明信片费用",
        "problemIds": [
          "TB-I18"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第8页 · 4.3（1）习题5",
        "title": "增加女生后的比例",
        "problemIds": [
          "L7-H3"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第8页 · 4.3（1）习题6",
        "title": "140根火柴搭小鱼",
        "problemIds": [
          "G9-07"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第9页 · 4.3（2）问题1",
        "title": "购买苹果和橘子",
        "problemIds": [
          "L7-P2"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第10页 · 4.3（2）问题2",
        "title": "晨练跑步与步行",
        "problemIds": [
          "TB-R08"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第11页 · 4.3（2）练习1",
        "title": "成人票和学生票",
        "problemIds": [
          "TB-R07"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第11页 · 4.3（2）练习2",
        "title": "大船小船租赁",
        "problemIds": [
          "G10-01"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第12页 · 4.3（2）习题1",
        "title": "代售青奥会门票",
        "problemIds": [
          "TB-R07"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第12页 · 4.3（2）习题2",
        "title": "两种奖项发奖金",
        "problemIds": [
          "TB-R07"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第12页 · 4.3（2）习题3",
        "title": "两本书分别打折",
        "problemIds": [
          "C21-03"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第13页 · 4.3（2）习题4",
        "title": "初高中按不同幅度增长",
        "problemIds": [
          "C21-03"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第14页 · 4.3（3）问题2",
        "title": "桌面桌腿用料",
        "problemIds": [
          "L7-P1"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第15页 · 4.3（3）问题3",
        "title": "家具九折售价与进价",
        "problemIds": [
          "L8-T1"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第15页 · 4.3（3）练习1",
        "title": "上坡下坡与平路",
        "problemIds": [
          "C21-05"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第16页 · 4.3（3）练习2",
        "title": "提价标价再打折",
        "problemIds": [
          "L8-P1"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第16页 · 4.3（3）习题1",
        "title": "印刷三册小说的时间",
        "problemIds": [
          "C21-05"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第16页 · 4.3（3）习题2",
        "title": "提价后九折的成本",
        "problemIds": [
          "PEP-P048"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第17页 · 4.3（3）习题4",
        "title": "大小书包利润相同",
        "problemIds": [
          "PEP-P047"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第17页 · 4.3（3）习题6",
        "title": "同售价衣服盈亏",
        "problemIds": [
          "L8-H1"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第18页 · 4.3（4）问题1",
        "title": "自行车摩托车相向相遇",
        "problemIds": [
          "TB-A29"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第19页 · 4.3（4）问题3",
        "title": "环形跑道同向相遇",
        "problemIds": [
          "L8-T2"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第20页 · 4.3（4）练习1",
        "title": "两车相遇的速度差",
        "problemIds": [
          "PEP-P035"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第20页 · 4.3（4）练习2",
        "title": "环形跑道反向相遇",
        "problemIds": [
          "PEP-P075"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第21页 · 4.3（4）习题1",
        "title": "同时到楼顶",
        "problemIds": [
          "L8-P2-Q1"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第21页 · 4.3（4）习题2",
        "title": "小明小丽到村时间差",
        "problemIds": [
          "L8-H2"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第21页 · 4.3（4）习题3",
        "title": "快马追慢马",
        "problemIds": [
          "L8-P2-Q1"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第22页 · 4.3（4）习题5",
        "title": "飞机顺逆风",
        "problemIds": [
          "PEP-P022"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第22页 · 4.3（4）习题6",
        "title": "相遇后先到达对岸",
        "problemIds": [
          "PEP-P062"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第23页 · 4.3（5）问题1",
        "title": "水上工程两队合做",
        "problemIds": [
          "PEP-P043"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第23页 · 4.3（5）问题2",
        "title": "甲先做再合作",
        "problemIds": [
          "G10-02"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第24页 · 4.3（5）练习1",
        "title": "地下管线合作",
        "problemIds": [
          "PEP-P043"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第24页 · 4.3（5）练习2",
        "title": "整理图书先后工作",
        "problemIds": [
          "G10-02"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第25页 · 4.3（5）练习3",
        "title": "工程模型迁移到行程",
        "problemIds": [
          "G10-05"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第25页 · 4.3（5）习题1",
        "title": "整理操场总时间",
        "problemIds": [
          "G10-08"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第26页 · 4.3（5）习题2",
        "title": "甲先一天乙加入",
        "problemIds": [
          "G10-02"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第26页 · 4.3（5）习题3",
        "title": "录入资料先后工作",
        "problemIds": [
          "G10-02"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第26页 · 4.3（5）习题4",
        "title": "增员完成四分之三",
        "problemIds": [
          "PEP-P042"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第27页 · 4.3（5）习题5",
        "title": "增员整理图书",
        "problemIds": [
          "PEP-P042"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第27页 · 4.3（5）习题6",
        "title": "铺管道先合作后单独",
        "problemIds": [
          "G10-08"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第28页 · 4.3（6）问题1",
        "title": "中国结盈不足",
        "problemIds": [
          "S02"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第28页 · 4.3（6）问题2",
        "title": "集邮展览人数与总张数",
        "problemIds": [
          "S02"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第29页 · 4.3（6）思考",
        "title": "另设邮票总数为x",
        "problemIds": [
          "S02"
        ],
        "repeatSources": [],
        "matchKind": "同题另一设元提示，不另计题",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第29页 · 4.3（6）练习1",
        "title": "分糖盈不足",
        "problemIds": [
          "S02"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第29页 · 4.3（6）练习2",
        "title": "货车一剩余一恰好",
        "problemIds": [
          "S02"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第30页 · 4.3（6）习题1",
        "title": "分书盈不足",
        "problemIds": [
          "S02"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第30页 · 4.3（6）习题2",
        "title": "种树盈不足",
        "problemIds": [
          "S02"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第30页 · 4.3（6）习题3",
        "title": "孔明菜分配",
        "problemIds": [
          "S02"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第31页 · 4.3（6）习题4",
        "title": "鸽子增加后分笼",
        "problemIds": [
          "PEP-P076"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第31页 · 4.3（6）习题5",
        "title": "新旧工艺排量",
        "problemIds": [
          "PEP-P018"
        ],
        "repeatSources": [],
        "matchKind": "同题已收录",
        "transferCompletion": false
      },
      {
        "source": "《第四章 用一元一次方程解决问题》资料，第31页 · 4.3（6）习题6",
        "title": "机器每台日产量与装箱",
        "problemIds": [
          "PEP-P038"
        ],
        "repeatSources": [],
        "matchKind": "高度相似，不新增入口",
        "transferCompletion": false
      }
    ]
  }
};
if(typeof module==='object'&&module.exports)module.exports=index;else root.RatioWordProblemSupplementIndex=index;
})(typeof window==='undefined'?globalThis:window);
