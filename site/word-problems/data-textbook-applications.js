/* Textbook Chapter 4 applications. Every value retains its source. */
(function(root){'use strict';
const data = [
  {
    "id": "TB-A03",
    "textbookItemId": "A03",
    "title": "逆推计算程序",
    "group": "教材·4.3 用一元一次方程解决问题",
    "source": "《数学 七年级上册》苏科版2026，122页 · 练习第1题",
    "kind": "linear",
    "stem": "一个计算程序依次进行“减2、乘4、加1”.输出结果为25，输入的数是多少？",
    "tags": [
      "程序",
      "先后次序"
    ],
    "facts": [
      {
        "id": "subtract",
        "text": "第一步把输入数减去2.",
        "kind": "given"
      },
      {
        "id": "multiply",
        "text": "第二步把上一步结果乘4.",
        "kind": "given"
      },
      {
        "id": "add",
        "text": "第三步把上一步结果加1.",
        "kind": "given"
      },
      {
        "id": "output",
        "text": "最后输出25.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "input",
        "label": "设输入数为x",
        "variable": "x",
        "meaning": "程序输入的数",
        "unit": "",
        "domain": "x为有理数",
        "derivations": [],
        "table": {
          "headers": [
            "次序",
            "本步输入",
            "本步运算",
            "本步输出"
          ],
          "rows": [
            {
              "label": "第一步",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "note": "减2"
                },
                {
                  "expr": "x-2",
                  "sources": [
                    "unknown",
                    "subtract"
                  ]
                }
              ]
            },
            {
              "label": "第二步",
              "cells": [
                {
                  "expr": "x-2",
                  "sources": [
                    "unknown",
                    "subtract"
                  ]
                },
                {
                  "note": "乘4"
                },
                {
                  "expr": "4*(x-2)",
                  "sources": [
                    "unknown",
                    "subtract",
                    "multiply"
                  ]
                }
              ]
            },
            {
              "label": "第三步",
              "cells": [
                {
                  "expr": "4*(x-2)",
                  "sources": [
                    "unknown",
                    "subtract",
                    "multiply"
                  ]
                },
                {
                  "note": "加1"
                },
                {
                  "expr": "4*(x-2)+1",
                  "sources": [
                    "unknown",
                    "subtract",
                    "multiply",
                    "add"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "第一步输出+2=输入数",
            "第二步输出+1=最终输出"
          ],
          "multiply": [
            "第二步输出=4×第一步输出"
          ]
        },
        "closure": {
          "sources": [
            "output"
          ],
          "text": "最后一行输出等于25",
          "hint": "哪些条件已经用于填表？还需要用哪个条件让表中的数量相等？"
        },
        "equations": [
          {
            "label": "最终输出",
            "left": "4*(x-2)+1",
            "right": "25"
          }
        ],
        "answers": [
          {
            "label": "输入数",
            "expr": "8",
            "unit": ""
          }
        ],
        "steps": [
          "4*(x-2)=25-1",
          "x-2=(25-1)/4",
          "x=(25-1)/4+2=8"
        ],
        "checks": [
          {
            "text": "按原顺序运算",
            "expr": "(8-2)*4+1",
            "result": "25"
          }
        ],
        "conclusion": "输入数为8.检验必须按减2、乘4、加1的原顺序进行.",
        "verdict": {
          "correct": "valid",
          "prompt": "方程的解能否回答原题的全部问题？",
          "explain": "输入数为8.检验必须按减2、乘4、加1的原顺序进行."
        },
        "variation": "逆着程序求输入时，每一步应使用什么运算？"
      }
    ],
    "originalStem": "如图是一个计算程序，如果输出“25”，那么输入的数值为多少？",
    "originalStems": {
      "A03": "如图是一个计算程序，如果输出“25”，那么输入的数值为多少？"
    },
    "sourceFigure": {
      "file": "figures/calculation-program.svg",
      "alt": "原题程序：输入、减2、乘4、加1、输出"
    }
  },
  {
    "id": "TB-A10",
    "textbookItemId": "A10",
    "title": "提前完成印刷订单",
    "group": "教材·4.3 用一元一次方程解决问题",
    "source": "《数学 七年级上册》苏科版2026，124页 · 练习第3题",
    "kind": "linear",
    "stem": "印刷厂原计划每天印15万册，实际每天比原计划多印5万册，结果提前4天完成同一个订单.这个订单共有多少册书？",
    "tags": [
      "工作总量",
      "时间差",
      "单位换算"
    ],
    "facts": [
      {
        "id": "planned",
        "text": "原计划每天印15万册.",
        "kind": "given"
      },
      {
        "id": "increase",
        "text": "实际每天比计划多印5万册.",
        "kind": "given"
      },
      {
        "id": "earlier",
        "text": "实际完成时间比原计划少4天.",
        "kind": "given"
      },
      {
        "id": "same",
        "text": "计划与实际完成的是同一个订单，总册数相同.",
        "kind": "given"
      },
      {
        "id": "wan",
        "text": "1万册=10000册.",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "quantity",
        "label": "设订单总量为x万册",
        "variable": "x",
        "meaning": "订单的图书总量",
        "unit": "万册",
        "domain": "x>0",
        "derivations": [
          {
            "id": "actualRate",
            "label": "实际每天印刷量",
            "expr": "15+5",
            "result": "20",
            "sources": [
              "planned",
              "increase"
            ],
            "explain": "实际每天印数=计划每天印数+每天增加数，先写15+5，再使用20."
          }
        ],
        "table": {
          "headers": [
            "安排",
            "每天印数/万册",
            "总量/万册",
            "时间/天"
          ],
          "rows": [
            {
              "label": "原计划",
              "cells": [
                {
                  "expr": "15",
                  "sources": [
                    "planned"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "x/15",
                  "sources": [
                    "unknown",
                    "planned"
                  ]
                }
              ]
            },
            {
              "label": "实际",
              "cells": [
                {
                  "expr": "20",
                  "sources": [
                    "actualRate"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "same"
                  ],
                  "given": true
                },
                {
                  "expr": "x/20",
                  "sources": [
                    "unknown",
                    "actualRate"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "原计划时间=实际时间+4"
          ],
          "multiply": [
            "订单总量=每天印数×用时"
          ]
        },
        "closure": {
          "sources": [
            "earlier"
          ],
          "text": "原计划用时比实际多4天",
          "hint": "哪些条件已经用于填表？还需要用哪个条件让表中的数量相等？"
        },
        "equations": [
          {
            "label": "时间差",
            "left": "x/15-x/(15+5)",
            "right": "4"
          }
        ],
        "answers": [
          {
            "label": "订单总量（以万册为单位）",
            "expr": "240",
            "unit": "万册"
          },
          {
            "label": "订单总册数",
            "expr": "2400000",
            "unit": "册"
          }
        ],
        "steps": [
          "x/15-x/20=4",
          "(1/15-1/20)*x=4",
          "x=4/(1/15-1/20)=240",
          "240*10000=2400000"
        ],
        "checks": [
          {
            "text": "完成时间之差",
            "expr": "240/15-240/(15+5)",
            "result": "4"
          },
          {
            "text": "换算为册",
            "expr": "240*10000",
            "result": "2400000"
          }
        ],
        "conclusion": "订单共240万册，即240×10000=2400000册.计划用时240÷15=16天，实际用时240÷(15+5)=12天.",
        "verdict": {
          "correct": "valid",
          "prompt": "方程的解能否回答原题的全部问题？",
          "explain": "订单共240万册，即240×10000=2400000册.计划用时240÷15=16天，实际用时240÷(15+5)=12天."
        },
        "variation": "如果设原计划的天数为x，怎样表示实际天数与两种安排的订单总量？"
      }
    ],
    "originalStem": "印刷厂接到一个印刷图书的紧急订单，原计划每天印15万册，实际每天比原计划多印5万册，结果提前4天完成任务.这个订单一共有多少册书？",
    "originalStems": {
      "A10": "印刷厂接到一个印刷图书的紧急订单，原计划每天印15万册，实际每天比原计划多印5万册，结果提前4天完成任务.这个订单一共有多少册书？"
    }
  },
  {
    "id": "TB-A18",
    "textbookItemId": "A18",
    "title": "200米决赛的冲刺时间",
    "group": "教材·4.3 用一元一次方程解决问题",
    "source": "《数学 七年级上册》苏科版2026，128页 · 练习第1题",
    "kind": "linear",
    "stem": "小强参加200米决赛，先以平均6米/秒跑完大部分赛程，最后以平均8米/秒冲刺到终点，总成绩30秒.冲刺阶段用了多少秒？",
    "tags": [
      "分段行程",
      "总时间"
    ],
    "facts": [
      {
        "id": "distance",
        "text": "全程为200米.",
        "kind": "given"
      },
      {
        "id": "firstSpeed",
        "text": "前一阶段平均速度为6米/秒.",
        "kind": "given"
      },
      {
        "id": "lastSpeed",
        "text": "冲刺阶段平均速度为8米/秒.",
        "kind": "given"
      },
      {
        "id": "totalTime",
        "text": "两个连续阶段总共用时30秒.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "sprint",
        "label": "设冲刺用时为x秒",
        "variable": "x",
        "meaning": "冲刺阶段所用时间",
        "unit": "秒",
        "domain": "0<x<30",
        "derivations": [],
        "table": {
          "headers": [
            "阶段",
            "平均速度/米每秒",
            "时间/秒",
            "路程/米"
          ],
          "rows": [
            {
              "label": "前一阶段",
              "cells": [
                {
                  "expr": "6",
                  "sources": [
                    "firstSpeed"
                  ],
                  "given": true
                },
                {
                  "expr": "30-x",
                  "sources": [
                    "totalTime",
                    "unknown"
                  ]
                },
                {
                  "expr": "6*(30-x)",
                  "sources": [
                    "firstSpeed",
                    "totalTime",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "冲刺阶段",
              "cells": [
                {
                  "expr": "8",
                  "sources": [
                    "lastSpeed"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "8*x",
                  "sources": [
                    "lastSpeed",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "速度不相加"
                },
                {
                  "expr": "30",
                  "sources": [
                    "totalTime"
                  ],
                  "given": true
                },
                {
                  "expr": "200",
                  "sources": [
                    "distance"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "前一阶段时间+冲刺时间=30",
            "两段路程之和=200"
          ],
          "multiply": [
            "各段路程=该段平均速度×该段时间"
          ]
        },
        "closure": {
          "sources": [
            "distance"
          ],
          "text": "两段路程合起来为200米",
          "hint": "哪些条件已经用于填表？还需要用哪个条件让表中的数量相等？"
        },
        "equations": [
          {
            "label": "全程路程",
            "left": "6*(30-x)+8*x",
            "right": "200"
          }
        ],
        "answers": [
          {
            "label": "冲刺时间",
            "expr": "10",
            "unit": "秒"
          }
        ],
        "steps": [
          "6*30-6*x+8*x=200",
          "(8-6)*x=200-6*30",
          "x=(200-6*30)/(8-6)=10"
        ],
        "checks": [
          {
            "text": "总路程",
            "expr": "6*(30-10)+8*10",
            "result": "200"
          },
          {
            "text": "总用时",
            "expr": "(30-10)+10",
            "result": "30"
          }
        ],
        "conclusion": "冲刺用了10秒；前一阶段跑了6×(30−10)=120米，超过全程的一半，符合题意.",
        "verdict": {
          "correct": "valid",
          "prompt": "方程的解能否回答原题的全部问题？",
          "explain": "冲刺用了10秒；前一阶段跑了6×(30−10)=120米，超过全程的一半，符合题意."
        },
        "variation": "若改设冲刺路程为x米，表中的时间和方程会怎样变化？"
      }
    ],
    "originalStem": "运动会上，小强在200 m决赛中先以6 m/s的平均速度跑完了大部分赛程，最后以8 m/s的平均速度冲刺到达终点，成绩为30 s.小强在冲刺阶段用时多少秒？",
    "originalStems": {
      "A18": "运动会上，小强在200 m决赛中先以6 m/s的平均速度跑完了大部分赛程，最后以8 m/s的平均速度冲刺到达终点，成绩为30 s.小强在冲刺阶段用时多少秒？"
    }
  },
  {
    "id": "TB-A21",
    "textbookItemId": "A21",
    "title": "面包牛奶与找零",
    "group": "教材·4.3 用一元一次方程解决问题",
    "source": "《数学 七年级上册》苏科版2026，128页 · 习题第1题",
    "kind": "linear",
    "stem": "小红买3个面包和1盒单价4.8元的牛奶，付出20元，找回3.8元.每个面包多少元？",
    "tags": [
      "购物",
      "找零"
    ],
    "facts": [
      {
        "id": "breadCount",
        "text": "购买3个面包.",
        "kind": "given"
      },
      {
        "id": "milk",
        "text": "购买1盒牛奶，单价4.8元.",
        "kind": "given"
      },
      {
        "id": "paid",
        "text": "付出20元.",
        "kind": "given"
      },
      {
        "id": "change",
        "text": "找回3.8元.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "price",
        "label": "设面包单价为x元",
        "variable": "x",
        "meaning": "每个面包的价格",
        "unit": "元/个",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "商品",
            "单价/元",
            "数量",
            "金额/元"
          ],
          "rows": [
            {
              "label": "面包",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "3",
                  "sources": [
                    "breadCount"
                  ],
                  "given": true
                },
                {
                  "expr": "3*x",
                  "sources": [
                    "breadCount",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "牛奶",
              "cells": [
                {
                  "expr": "4.8",
                  "sources": [
                    "milk"
                  ],
                  "given": true
                },
                {
                  "expr": "1",
                  "sources": [
                    "milk"
                  ],
                  "given": true
                },
                {
                  "expr": "4.8*1",
                  "sources": [
                    "milk"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "不同商品单价不相加"
                },
                {
                  "note": "面包与盒装牛奶分别计数"
                },
                {
                  "expr": "20-3.8",
                  "sources": [
                    "paid",
                    "change"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "实付商品金额=付出金额−找零",
            "商品总金额=面包金额+牛奶金额"
          ],
          "multiply": [
            "商品金额=单价×数量"
          ]
        },
        "closure": {
          "sources": [
            "paid",
            "change"
          ],
          "text": "商品总金额加找回的钱等于20元",
          "hint": "哪些条件已经用于填表？还需要用哪个条件让表中的数量相等？"
        },
        "equations": [
          {
            "label": "付款与找零",
            "left": "3*x+4.8",
            "right": "20-3.8"
          }
        ],
        "answers": [
          {
            "label": "面包单价",
            "expr": "3.8",
            "unit": "元/个"
          }
        ],
        "steps": [
          "3*x=20-3.8-4.8",
          "x=(20-3.8-4.8)/3=3.8"
        ],
        "checks": [
          {
            "text": "付钱的组成",
            "expr": "3*3.8+4.8+3.8",
            "result": "20"
          }
        ],
        "conclusion": "每个面包3.8元.单价3.8元与找零3.8元数值相同，但表示的量不同.",
        "verdict": {
          "correct": "valid",
          "prompt": "方程的解能否回答原题的全部问题？",
          "explain": "每个面包3.8元.单价3.8元与找零3.8元数值相同，但表示的量不同."
        },
        "variation": "若把找零当作又购买的一项商品，会混淆哪两个数量？"
      }
    ],
    "originalStem": "小红购买3个面包和1盒单价为4.8元的牛奶，付20元，找回3.8元.求面包的价格.",
    "originalStems": {
      "A21": "小红购买3个面包和1盒单价为4.8元的牛奶，付20元，找回3.8元.求面包的价格."
    }
  },
  {
    "id": "TB-A25",
    "textbookItemId": "A25",
    "title": "入学人数增长百分之十",
    "group": "教材·4.3 用一元一次方程解决问题",
    "source": "《数学 七年级上册》苏科版2026，128页 · 习题第5题",
    "kind": "linear",
    "stem": "某校今年七年级入学352人，比去年增加10%.去年该校七年级有多少人入学？",
    "tags": [
      "增长率",
      "基准量"
    ],
    "facts": [
      {
        "id": "current",
        "text": "今年入学人数为352人.",
        "kind": "given"
      },
      {
        "id": "growth",
        "text": "今年比去年增加10%，增长率以去年人数为基准.",
        "kind": "given"
      },
      {
        "id": "base",
        "text": "把去年人数看作1份，今年包括原来的1份和新增部分.",
        "kind": "convention"
      }
    ],
    "routes": [
      {
        "id": "last-year",
        "label": "设去年入学人数为x",
        "variable": "x",
        "meaning": "去年七年级入学人数",
        "unit": "人",
        "domain": "x为正整数",
        "derivations": [
          {
            "id": "growthFactor",
            "label": "今年人数相对去年人数的倍数",
            "expr": "1+10%",
            "result": "1.1",
            "sources": [
              "base",
              "growth"
            ],
            "explain": "从原来的1份加上10%的新增部分，得到今年的倍数；1.1必须经过这一步得出."
          }
        ],
        "table": {
          "headers": [
            "比较",
            "基准人数/人",
            "增长率",
            "今年相对去年的倍数",
            "今年人数/人"
          ],
          "rows": [
            {
              "label": "今年与去年",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "10%",
                  "sources": [
                    "growth"
                  ],
                  "given": true
                },
                {
                  "expr": "1.1",
                  "sources": [
                    "growthFactor"
                  ],
                  "given": true
                },
                {
                  "expr": "(1+10%)*x",
                  "sources": [
                    "base",
                    "growth",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "今年人数=去年人数+增加人数"
          ],
          "multiply": [
            "增加人数=去年人数×10%",
            "今年人数=去年人数×(1+10%)"
          ]
        },
        "closure": {
          "sources": [
            "current"
          ],
          "text": "算出的今年人数等于352人",
          "hint": "哪些条件已经用于填表？还需要用哪个条件让表中的数量相等？"
        },
        "equations": [
          {
            "label": "今年入学人数",
            "left": "(1+10%)*x",
            "right": "352"
          }
        ],
        "answers": [
          {
            "label": "去年入学人数",
            "expr": "320",
            "unit": "人"
          }
        ],
        "steps": [
          "(1+10%)*x=352",
          "x=352/(1+10%)=320"
        ],
        "checks": [
          {
            "text": "今年人数",
            "expr": "320+320*10%",
            "result": "352"
          },
          {
            "text": "增长率",
            "expr": "(352-320)/320",
            "result": "10%"
          }
        ],
        "conclusion": "去年入学320人.今年增加320×10%=32人，合计320+32=352人.",
        "verdict": {
          "correct": "valid",
          "prompt": "方程的解能否回答原题的全部问题？",
          "explain": "去年入学320人.今年增加320×10%=32人，合计320+32=352人."
        },
        "variation": "为什么不能用352×(1−10%)直接求去年人数？增长率的基准是哪一年？"
      }
    ],
    "originalStem": "某校今年开学时七年级有352名学生入学，比去年增加了10%.去年该校七年级有多少名学生入学？",
    "originalStems": {
      "A25": "某校今年开学时七年级有352名学生入学，比去年增加了10%.去年该校七年级有多少名学生入学？"
    }
  },
  {
    "id": "TB-A29",
    "textbookItemId": "A29",
    "title": "自行车与摩托车相向而行",
    "group": "教材·4.3 用一元一次方程解决问题",
    "source": "《数学 七年级上册》苏科版2026，129页 · 习题第9题",
    "kind": "linear",
    "stem": "A、B两地相距160千米.甲从A骑自行车，平均速度20千米/小时；乙从B骑摩托车，平均速度是甲的3倍.两人同时相向出发，经过多久相遇？",
    "tags": [
      "相遇",
      "倍数"
    ],
    "facts": [
      {
        "id": "distance",
        "text": "A、B两地相距160千米.",
        "kind": "given"
      },
      {
        "id": "aSpeed",
        "text": "甲平均速度为20千米/小时.",
        "kind": "given"
      },
      {
        "id": "ratio",
        "text": "乙的平均速度是甲的3倍.",
        "kind": "given"
      },
      {
        "id": "simultaneous",
        "text": "两人同时从两端相向出发.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "time",
        "label": "设相遇用时为x小时",
        "variable": "x",
        "meaning": "从同时出发到相遇的时间",
        "unit": "小时",
        "domain": "x>0",
        "derivations": [
          {
            "id": "bSpeed",
            "label": "乙的平均速度",
            "expr": "20*3",
            "result": "60",
            "sources": [
              "aSpeed",
              "ratio"
            ],
            "explain": "乙是甲的3倍，先用20×3求乙的速度."
          }
        ],
        "table": {
          "headers": [
            "人物",
            "速度/千米每小时",
            "时间/小时",
            "路程/千米"
          ],
          "rows": [
            {
              "label": "甲",
              "cells": [
                {
                  "expr": "20",
                  "sources": [
                    "aSpeed"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "simultaneous"
                  ],
                  "given": true
                },
                {
                  "expr": "20*x",
                  "sources": [
                    "aSpeed",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "乙",
              "cells": [
                {
                  "expr": "60",
                  "sources": [
                    "bSpeed"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "simultaneous"
                  ],
                  "given": true
                },
                {
                  "expr": "60*x",
                  "sources": [
                    "bSpeed",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "此行只合计两人路程"
                },
                {
                  "note": "同时进行，时间不相加"
                },
                {
                  "expr": "160",
                  "sources": [
                    "distance"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "相遇时甲路程+乙路程=两地距离"
          ],
          "multiply": [
            "乙速度=甲速度×3",
            "各自路程=各自速度×共同行进时间"
          ]
        },
        "closure": {
          "sources": [
            "distance"
          ],
          "text": "相遇时两人的路程合计160千米",
          "hint": "哪些条件已经用于填表？还需要用哪个条件让表中的数量相等？"
        },
        "equations": [
          {
            "label": "相遇路程和",
            "left": "20*x+(20*3)*x",
            "right": "160"
          }
        ],
        "answers": [
          {
            "label": "相遇时间",
            "expr": "2",
            "unit": "小时"
          }
        ],
        "steps": [
          "(20+20*3)*x=160",
          "x=160/(20+20*3)=2"
        ],
        "checks": [
          {
            "text": "相遇路程和",
            "expr": "20*2+(20*3)*2",
            "result": "160"
          }
        ],
        "conclusion": "两人出发2小时后相遇.甲走20×2=40千米，乙走(20×3)×2=120千米.",
        "verdict": {
          "correct": "valid",
          "prompt": "方程的解能否回答原题的全部问题？",
          "explain": "两人出发2小时后相遇.甲走20×2=40千米，乙走(20×3)×2=120千米."
        },
        "variation": "如果改为同向出发，这个路程和关系还成立吗？"
      }
    ],
    "originalStem": "A，B两地之间的路程为160 km，甲骑自行车从A地出发，平均速度为20 km/h；乙骑摩托车从B地出发，平均速度是甲的3倍.两人同时出发，相向而行，经过多少时间相遇？",
    "originalStems": {
      "A29": "A，B两地之间的路程为160 km，甲骑自行车从A地出发，平均速度为20 km/h；乙骑摩托车从B地出发，平均速度是甲的3倍.两人同时出发，相向而行，经过多少时间相遇？"
    }
  },
  {
    "id": "TB-A30",
    "textbookItemId": "A30",
    "title": "送手机：能否在到站前追上",
    "group": "教材·4.3 用一元一次方程解决问题",
    "source": "《数学 七年级上册》苏科版2026，129页 · 习题第10题",
    "kind": "branching",
    "stem": "妈妈7:30从家步行去火车站.7:45，小明发现妈妈忘带手机，立即从家骑车沿原路追赶.妈妈每分钟走60米，小明每分钟骑240米.若车站距家1800米，能在妈妈到站前追上吗？若能，何时追上？若车站距家改为960米，结论怎样？",
    "tags": [
      "追及",
      "时间起点",
      "适用范围"
    ],
    "facts": [
      {
        "id": "departure",
        "text": "妈妈7:30出发，小明7:45出发追赶；两个时刻在同一小时内.",
        "kind": "given"
      },
      {
        "id": "momSpeed",
        "text": "妈妈步行速度为60米/分钟.",
        "kind": "given"
      },
      {
        "id": "mingSpeed",
        "text": "小明骑行速度为240米/分钟.",
        "kind": "given"
      },
      {
        "id": "farStation",
        "text": "第一问：车站距家1800米.",
        "kind": "given"
      },
      {
        "id": "nearStation",
        "text": "第二问：把车站距家改为960米.",
        "kind": "given"
      },
      {
        "id": "beforeStation",
        "text": "要求在妈妈到达车站之前追上.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "both",
        "label": "同一个追赶方程，分别检验两个车站情形",
        "variable": "x",
        "meaning": "从小明出发到追上妈妈的候选时间",
        "unit": "分钟",
        "domain": "候选x≥0；两问分别要求x小于1800÷60−(45−30)和960÷60−(45−30)",
        "derivations": [
          {
            "id": "lead",
            "label": "妈妈先行的时间",
            "expr": "45-30",
            "result": "15",
            "sources": [
              "departure"
            ],
            "explain": "两个时刻都在7点这一小时内，所以先行时间为45−30分钟."
          },
          {
            "id": "farRemaining",
            "label": "车站距家1800米时，妈妈还需多久到站",
            "expr": "1800/60-15",
            "result": "15",
            "sources": [
              "farStation",
              "momSpeed",
              "lead"
            ],
            "explain": "妈妈到站所需的总时间减去已经先行的时间，得到可以在途中追上的时间范围."
          },
          {
            "id": "nearRemaining",
            "label": "车站距家960米时，妈妈还需多久到站",
            "expr": "960/60-15",
            "result": "1",
            "sources": [
              "nearStation",
              "momSpeed",
              "lead"
            ],
            "explain": "妈妈到站所需的总时间减去已经先行的时间，得到可以在途中追上的时间范围."
          }
        ],
        "table": {
          "headers": [
            "人物与检验情形",
            "速度/米每分钟",
            "从各自出发计的时间/分钟",
            "距家路程/米",
            "从7:45至妈妈到站的余时/分钟"
          ],
          "rows": [
            {
              "label": "妈妈（候选相遇）",
              "cells": [
                {
                  "expr": "60",
                  "sources": [
                    "momSpeed"
                  ],
                  "given": true
                },
                {
                  "expr": "x+15",
                  "sources": [
                    "unknown",
                    "lead"
                  ]
                },
                {
                  "expr": "60*(x+15)",
                  "sources": [
                    "momSpeed",
                    "unknown",
                    "lead"
                  ]
                },
                {
                  "note": "根据车站距离，分别用后两行检验"
                }
              ]
            },
            {
              "label": "小明（候选相遇）",
              "cells": [
                {
                  "expr": "240",
                  "sources": [
                    "mingSpeed"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "240*x",
                  "sources": [
                    "mingSpeed",
                    "unknown"
                  ]
                },
                {
                  "note": "追赶时间须小于对应的到站余时"
                }
              ]
            },
            {
              "label": "妈妈到站（1800米情形）",
              "cells": [
                {
                  "expr": "60",
                  "sources": [
                    "momSpeed"
                  ],
                  "given": true
                },
                {
                  "expr": "1800/60",
                  "sources": [
                    "farStation",
                    "momSpeed"
                  ]
                },
                {
                  "expr": "1800",
                  "sources": [
                    "farStation"
                  ],
                  "given": true
                },
                {
                  "expr": "15",
                  "sources": [
                    "farRemaining"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "妈妈到站（960米情形）",
              "cells": [
                {
                  "expr": "60",
                  "sources": [
                    "momSpeed"
                  ],
                  "given": true
                },
                {
                  "expr": "960/60",
                  "sources": [
                    "nearStation",
                    "momSpeed"
                  ]
                },
                {
                  "expr": "960",
                  "sources": [
                    "nearStation"
                  ],
                  "given": true
                },
                {
                  "expr": "1",
                  "sources": [
                    "nearRemaining"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "妈妈行进时间=小明追赶时间+妈妈先行时间",
            "追上时，两人距家路程相等",
            "小明出发后妈妈到站的余时=妈妈到站总用时−妈妈先行时间"
          ],
          "multiply": [
            "路程=速度×时间"
          ]
        },
        "closure": {
          "sources": [
            "beforeStation"
          ],
          "text": "先令途中位置相等得到候选追赶时间，再分别检验该时间是否早于两个情形中妈妈的到站时刻.两个原题问题都要回答.",
          "hint": "哪些条件已经用于填表？还需要用哪个条件让表中的数量相等？"
        },
        "equations": [
          {
            "label": "候选追上位置",
            "left": "240*x",
            "right": "60*(x+15)"
          }
        ],
        "answers": [
          {
            "label": "位置相等方程得到的候选追赶时间",
            "expr": "5",
            "unit": "分钟"
          },
          {
            "label": "1800米情形下，追上时刻为7时多少分",
            "expr": "50",
            "unit": "分"
          },
          {
            "label": "1800米情形下，小明出发后妈妈到站还需时间",
            "expr": "15",
            "unit": "分钟"
          },
          {
            "label": "960米情形下，小明出发后妈妈到站还需时间",
            "expr": "1",
            "unit": "分钟"
          }
        ],
        "steps": [
          "240*x=60*(x+15)",
          "(240-60)*x=60*15",
          "x=60*15/(240-60)=5",
          "1800/60-15=15",
          "960/60-15=1",
          "5<15",
          "45+5=50",
          "5>1"
        ],
        "checks": [
          {
            "text": "同一追赶方程的候选位置差",
            "expr": "240*5-60*(5+15)",
            "result": "0"
          },
          {
            "text": "1800米情形的到站余时",
            "expr": "1800/60-(45-30)",
            "result": "15"
          },
          {
            "text": "960米情形的到站余时",
            "expr": "960/60-(45-30)",
            "result": "1"
          },
          {
            "text": "1800米情形的追上时刻（7时后的分钟数）",
            "expr": "45+5",
            "result": "50"
          },
          {
            "text": "1800米情形：到站余时减候选追赶时间",
            "expr": "15-5",
            "result": "10"
          },
          {
            "text": "960米情形：到站余时减候选追赶时间",
            "expr": "1-5",
            "result": "-4"
          }
        ],
        "conclusion": "车站距家1800米时可以在到站前追上.小明追赶5分钟，于7:45后5分钟即7:50追上；追上地点距家240×5=1200米，小于1800米. 车站距家960米时不能在妈妈到站前追上.把路线无限延伸所得候选时间为5分钟，但妈妈在小明出发后960÷60−15=1分钟已到站；5分钟超过题目允许的追赶时间.",
        "verdict": {
          "correct": "multiple",
          "prompt": "两个原题情形能否用同一个实际结论回答？",
          "explain": "同一个候选追赶时间在两个车站距离下有不同结果，必须分别判断：1800米情形可以在到站前于7:50追上，960米情形不能在到站前追上."
        },
        "variation": "改变车站距离时，追赶方程为何相同，而实际结论可能不同？",
        "verdictCases": [
          {
            "id": "far",
            "label": "车站距家1800米",
            "correct": "valid",
            "explain": "车站距家1800米时可以在到站前追上.小明追赶5分钟，于7:45后5分钟即7:50追上；追上地点距家240×5=1200米，小于1800米."
          },
          {
            "id": "near",
            "label": "车站距家960米",
            "correct": "impossible",
            "explain": "车站距家960米时不能在妈妈到站前追上.把路线无限延伸所得候选时间为5分钟，但妈妈在小明出发后960÷60−15=1分钟已到站；5分钟超过题目允许的追赶时间."
          }
        ]
      }
    ],
    "notices": [
      "两个车站距离是原题的两个必答情形，完成本题须分别核对结论.没有约定妈妈到站后继续走，不把延伸路线的交点当作实际相遇."
    ],
    "originalStem": "妈妈7:30从家出发步行去乘火车，7:45时，小明发现妈妈忘记带手机，立即骑车追赶.已知妈妈每分钟步行60 m，小明每分钟骑行240 m.如果火车站距家1800 m，那么小明能在妈妈到达火车站前追上她吗？如果能，何时追上？如果火车站距家960 m呢？",
    "originalStems": {
      "A30": "妈妈7:30从家出发步行去乘火车，7:45时，小明发现妈妈忘记带手机，立即骑车追赶.已知妈妈每分钟步行60 m，小明每分钟骑行240 m.如果火车站距家1800 m，那么小明能在妈妈到达火车站前追上她吗？如果能，何时追上？如果火车站距家960 m呢？"
    }
  },
  {
    "id": "TB-A32",
    "textbookItemId": "A32",
    "title": "贴纸包圆柱形易拉罐",
    "group": "教材·4.3 用一元一次方程解决问题",
    "source": "《数学 七年级上册》苏科版2026，129页 · 习题第12题",
    "kind": "linear",
    "stem": "一张边长22厘米的正方形贴纸刚好完全包住圆柱形易拉罐的侧面，接口部分不计.求易拉罐容积，结果精确到1立方厘米，π取3.14.",
    "tags": [
      "圆柱侧面展开",
      "公式",
      "近似值"
    ],
    "facts": [
      {
        "id": "paper",
        "text": "正方形贴纸边长22厘米，刚好包住圆柱侧面，接口不计.",
        "kind": "given"
      },
      {
        "id": "pi",
        "text": "π取3.14.",
        "kind": "given"
      },
      {
        "id": "net",
        "text": "圆柱侧面展开成长方形，两边分别是底面周长和圆柱高.",
        "kind": "property"
      },
      {
        "id": "circumference",
        "text": "圆周长=2×π×半径.",
        "kind": "property"
      },
      {
        "id": "volume",
        "text": "圆柱容积=底面积×高；圆面积=π×半径的2次方（半径×半径）.",
        "kind": "property"
      },
      {
        "id": "rounding",
        "text": "结果精确到1立方厘米.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "radius",
        "label": "先设底面半径为x厘米",
        "variable": "x",
        "meaning": "易拉罐底面半径",
        "unit": "厘米",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "圆柱",
            "高/厘米",
            "底面周长/厘米",
            "底面半径/厘米",
            "容积/立方厘米"
          ],
          "rows": [
            {
              "label": "易拉罐",
              "cells": [
                {
                  "expr": "22",
                  "sources": [
                    "paper",
                    "net"
                  ],
                  "given": true
                },
                {
                  "expr": "22",
                  "sources": [
                    "paper",
                    "net"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "3.14*x^2*22",
                  "sources": [
                    "pi",
                    "volume",
                    "unknown",
                    "paper",
                    "net"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "侧面展开图的两条相邻边分别对应高与底面周长"
          ],
          "multiply": [
            "底面周长=2×π×半径",
            "容积=π×半径×半径×高"
          ]
        },
        "closure": {
          "sources": [
            "paper",
            "net"
          ],
          "text": "底面圆周长等于贴纸一边22厘米",
          "hint": "哪些条件已经用于填表？还需要用哪个条件让表中的数量相等？"
        },
        "equations": [
          {
            "label": "由周长求半径",
            "left": "2*3.14*x",
            "right": "22"
          }
        ],
        "answers": [
          {
            "label": "底面半径（先保留精确分式）",
            "expr": "22/(2*3.14)",
            "unit": "厘米"
          },
          {
            "label": "容积（精确到1立方厘米）",
            "expr": "848",
            "unit": "立方厘米"
          }
        ],
        "steps": [
          "x=22/(2*3.14)",
          "3.14*(22/(2*3.14))*(22/(2*3.14))*22=133100/157",
          "133100/157≈847.7707"
        ],
        "checks": [
          {
            "text": "检验底面周长",
            "expr": "2*3.14*(22/(2*3.14))",
            "result": "22"
          },
          {
            "text": "未取整的容积",
            "expr": "3.14*(22/(2*3.14))*(22/(2*3.14))*22",
            "result": "133100/157"
          }
        ],
        "conclusion": "容积约848立方厘米.先用一元一次方程确定半径，再代入圆柱容积公式；最后一步才按原题要求取整.",
        "verdict": {
          "correct": "valid",
          "prompt": "方程的解能否回答原题的全部问题？",
          "explain": "容积约848立方厘米.先用一元一次方程确定半径，再代入圆柱容积公式；最后一步才按原题要求取整."
        },
        "variation": "若直接以容积为未知量，或把半径过早四舍五入，会增加哪些困难？"
      }
    ],
    "notices": [
      "原题理想化地把罐视为圆柱并忽略接口.求半径的方程是一元一次；含半径平方的容积公式在解出半径后用于计算."
    ],
    "originalStem": "劳动课上，小慧用易拉罐自制花瓶，她用一张边长为22 cm的正方形艺术贴纸刚好完全包住了圆柱形易拉罐的侧面（接口部分不计），这个易拉罐的容积约是多少？（结果精确到1 cm³，π取3.14）",
    "originalStems": {
      "A32": "劳动课上，小慧用易拉罐自制花瓶，她用一张边长为22 cm的正方形艺术贴纸刚好完全包住了圆柱形易拉罐的侧面（接口部分不计），这个易拉罐的容积约是多少？（结果精确到1 cm³，π取3.14）"
    },
    "sourceFigure": {
      "file": "figures/cylinder-label.svg",
      "alt": "正方形艺术贴纸围成易拉罐的侧面"
    }
  },
  {
    "id": "TB-A34",
    "textbookItemId": "A34",
    "title": "阶梯水费反求全年用水量",
    "group": "教材·4.3 用一元一次方程解决问题",
    "source": "《数学 七年级上册》苏科版2026，130页 · 习题第14题",
    "kind": "linear",
    "stem": "某地家庭全年用水按部分累进收费：不超过180立方米的部分，每立方米3元；超过180但不超过300立方米的部分，每立方米4元；超过300立方米的部分，每立方米6元.小亮家去年缴水费960元，去年用水多少立方米？",
    "tags": [
      "分段收费",
      "分类判断"
    ],
    "facts": [
      {
        "id": "tier1",
        "text": "前180立方米每立方米3元.",
        "kind": "given"
      },
      {
        "id": "tier2",
        "text": "超过180至300立方米的部分每立方米4元.",
        "kind": "given"
      },
      {
        "id": "tier3",
        "text": "超过300立方米的部分每立方米6元.",
        "kind": "given"
      },
      {
        "id": "fee",
        "text": "全年水费为960元.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "water",
        "label": "设全年用水x立方米",
        "variable": "x",
        "meaning": "小亮家全年用水量",
        "unit": "立方米",
        "domain": "比较边界费用后得到180<x<300",
        "derivations": [
          {
            "id": "firstFee",
            "label": "用满第一收费段的费用",
            "expr": "180*3",
            "result": "540",
            "sources": [
              "tier1"
            ],
            "explain": "先由题目给的第一段数量与单价求边界费用."
          },
          {
            "id": "secondSize",
            "label": "完整第二收费段的水量",
            "expr": "300-180",
            "result": "120",
            "sources": [
              "tier1",
              "tier2"
            ],
            "explain": "第二收费段只包含超过180到300的部分，所以用300−180."
          },
          {
            "id": "secondBoundaryFee",
            "label": "用水300立方米时的总费用",
            "expr": "180*3+(300-180)*4",
            "result": "1020",
            "sources": [
              "tier1",
              "tier2"
            ],
            "explain": "第一段与完整第二段分别计费后相加；960介于两个边界费用之间."
          }
        ],
        "table": {
          "headers": [
            "收费部分",
            "单价/元每立方米",
            "本段用水/立方米",
            "费用/元"
          ],
          "rows": [
            {
              "label": "前180立方米",
              "cells": [
                {
                  "expr": "3",
                  "sources": [
                    "tier1"
                  ],
                  "given": true
                },
                {
                  "expr": "180",
                  "sources": [
                    "tier1"
                  ],
                  "given": true
                },
                {
                  "expr": "3*180",
                  "sources": [
                    "tier1"
                  ]
                }
              ]
            },
            {
              "label": "超过180的本段",
              "cells": [
                {
                  "expr": "4",
                  "sources": [
                    "tier2"
                  ],
                  "given": true
                },
                {
                  "expr": "x-180",
                  "sources": [
                    "unknown",
                    "tier1"
                  ]
                },
                {
                  "expr": "4*(x-180)",
                  "sources": [
                    "tier2",
                    "unknown",
                    "tier1"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "不同单价不相加"
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "960",
                  "sources": [
                    "fee"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "全年用水=前180立方米+超过180的部分",
            "总水费=各段水费之和"
          ],
          "multiply": [
            "每段水费=该段单价×该段用水量"
          ]
        },
        "closure": {
          "sources": [
            "fee"
          ],
          "text": "各段费用合计960元",
          "hint": "哪些条件已经用于填表？还需要用哪个条件让表中的数量相等？"
        },
        "equations": [
          {
            "label": "全年水费",
            "left": "3*180+4*(x-180)",
            "right": "960"
          }
        ],
        "answers": [
          {
            "label": "全年用水量",
            "expr": "285",
            "unit": "立方米"
          }
        ],
        "steps": [
          "4*(x-180)=960-3*180",
          "x=180+(960-3*180)/4=285"
        ],
        "checks": [
          {
            "text": "按原标准计费",
            "expr": "3*180+4*(285-180)",
            "result": "960"
          },
          {
            "text": "第二收费段实际水量",
            "expr": "285-180",
            "result": "105"
          }
        ],
        "conclusion": "全年用水285立方米.因为540<960<1020，用水量确实超过180、不到300，所用分段正确.",
        "verdict": {
          "correct": "valid",
          "prompt": "方程的解能否回答原题的全部问题？",
          "explain": "全年用水285立方米.因为540<960<1020，用水量确实超过180、不到300，所用分段正确."
        },
        "variation": "若水费刚好等于1020元，应如何处理300立方米这个边界？"
      }
    ],
    "originalStem": "某地居民用水收费标准如下表：小亮家去年缴水费960元，他家去年实际用水量是多少？",
    "originalStems": {
      "A34": "某地居民用水收费标准如下表：小亮家去年缴水费960元，他家去年实际用水量是多少？"
    },
    "sourceTable": {
      "caption": "居民用水收费标准",
      "headers": [
        "家庭每年用水量",
        "收费"
      ],
      "rows": [
        [
          "不超过180 m³的部分",
          "3元/m³"
        ],
        [
          "超过180 m³但不超过300 m³的部分",
          "4元/m³"
        ],
        [
          "超过300 m³的部分",
          "6元/m³"
        ]
      ]
    }
  },
  {
    "id": "TB-A37",
    "textbookItemId": "A37",
    "title": "丢番图的一生",
    "group": "教材·4.3 用一元一次方程解决问题",
    "source": "《数学 七年级上册》苏科版2026，131页 · 阅读：丢番图的墓志铭",
    "kind": "linear",
    "stem": "墓志铭把丢番图的一生依次分成这些阶段：生命的六分之一是童年；再过生命的十二分之一长出胡须；又过生命的七分之一结婚；5年后生下孩子；孩子活了父亲一生的一半；孩子去世后父亲又活了4年.丢番图一共活了多少岁？结婚时多少岁？",
    "tags": [
      "先后阶段",
      "分数关系",
      "阅读"
    ],
    "facts": [
      {
        "id": "childhood",
        "text": "童年占一生的1/6.",
        "kind": "given"
      },
      {
        "id": "beard",
        "text": "从童年结束到长出胡须，又过一生的1/12.",
        "kind": "given"
      },
      {
        "id": "marriage",
        "text": "从长出胡须到结婚，又过一生的1/7.",
        "kind": "given"
      },
      {
        "id": "birth",
        "text": "结婚5年后生下孩子.",
        "kind": "given"
      },
      {
        "id": "childLife",
        "text": "孩子的寿命等于父亲一生的1/2.",
        "kind": "given"
      },
      {
        "id": "last",
        "text": "孩子去世后，父亲又活4年.",
        "kind": "given"
      },
      {
        "id": "stages",
        "text": "这些先后阶段无重复、无遗漏，合起来构成丢番图的一生.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "life",
        "label": "设丢番图寿命为x岁",
        "variable": "x",
        "meaning": "丢番图一生的长度",
        "unit": "岁",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "先后阶段",
            "与寿命的比例",
            "阶段长度/年"
          ],
          "rows": [
            {
              "label": "童年",
              "cells": [
                {
                  "expr": "1/6",
                  "sources": [
                    "childhood"
                  ],
                  "given": true
                },
                {
                  "expr": "x/6",
                  "sources": [
                    "childhood",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "童年后至长出胡须",
              "cells": [
                {
                  "expr": "1/12",
                  "sources": [
                    "beard"
                  ],
                  "given": true
                },
                {
                  "expr": "x/12",
                  "sources": [
                    "beard",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "长出胡须至结婚",
              "cells": [
                {
                  "expr": "1/7",
                  "sources": [
                    "marriage"
                  ],
                  "given": true
                },
                {
                  "expr": "x/7",
                  "sources": [
                    "marriage",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "结婚至孩子出生",
              "cells": [
                {
                  "note": "直接给定5年"
                },
                {
                  "expr": "5",
                  "sources": [
                    "birth"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "孩子的一生",
              "cells": [
                {
                  "expr": "1/2",
                  "sources": [
                    "childLife"
                  ],
                  "given": true
                },
                {
                  "expr": "x/2",
                  "sources": [
                    "childLife",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "孩子去世后",
              "cells": [
                {
                  "note": "直接给定4年"
                },
                {
                  "expr": "4",
                  "sources": [
                    "last"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "全部阶段",
              "cells": [
                {
                  "note": "比例与年数不能混加"
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "stages"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "各阶段年数之和=一生年数",
            "结婚年龄=前三个阶段年数之和"
          ],
          "multiply": [
            "某阶段年数=一生年数×该阶段所占比例"
          ]
        },
        "closure": {
          "sources": [
            "stages"
          ],
          "text": "各阶段长度之和等于整个人生长度",
          "hint": "哪些条件已经用于填表？还需要用哪个条件让表中的数量相等？"
        },
        "equations": [
          {
            "label": "一生年数",
            "left": "x/6+x/12+x/7+5+x/2+4",
            "right": "x"
          }
        ],
        "answers": [
          {
            "label": "丢番图的寿命",
            "expr": "84",
            "unit": "岁"
          },
          {
            "label": "结婚时的年龄",
            "expr": "33",
            "unit": "岁"
          }
        ],
        "steps": [
          "x-(x/6+x/12+x/7+x/2)=5+4",
          "(1-1/6-1/12-1/7-1/2)*x=5+4",
          "x=(5+4)/(1-1/6-1/12-1/7-1/2)=84",
          "84/6+84/12+84/7=33"
        ],
        "checks": [
          {
            "text": "各阶段年数之和",
            "expr": "84/6+84/12+84/7+5+84/2+4",
            "result": "84"
          },
          {
            "text": "结婚年龄",
            "expr": "84/6+84/12+84/7",
            "result": "33"
          }
        ],
        "conclusion": "丢番图活了84岁，结婚时33岁.表中的1/6、1/12、1/7、1/2是墓志铭直接给出的比例；它们与工程中由1÷时间推导的效率来源不同.",
        "verdict": {
          "correct": "valid",
          "prompt": "方程的解能否回答原题的全部问题？",
          "explain": "丢番图活了84岁，结婚时33岁.表中的1/6、1/12、1/7、1/2是墓志铭直接给出的比例；它们与工程中由1÷时间推导的效率来源不同."
        },
        "variation": "为什么孩子的一生与父亲孩子出生后的阶段在这张时间表中对应同一段时长？"
      }
    ],
    "originalStem": "下面以表格的形式呈现丢番图一生中的各个阶段：你知道丢番图活了多少岁吗？他结婚时的年龄是多少？",
    "originalStems": {
      "A37": "下面以表格的形式呈现丢番图一生中的各个阶段：你知道丢番图活了多少岁吗？他结婚时的年龄是多少？"
    },
    "sourceTable": {
      "caption": "丢番图一生中的各个阶段",
      "headers": [
        "阶段",
        "原书表述"
      ],
      "rows": [
        [
          "童年",
          "他生命的六分之一是幸福的童年"
        ],
        [
          "长出胡须",
          "再活生命的十二分之一，颊上长出了细细的胡须"
        ],
        [
          "结婚",
          "又过了生命的七分之一才结婚"
        ],
        [
          "得子",
          "再过5年他感到很幸福，得了一个孩子"
        ],
        [
          "孩子的一生",
          "可是这孩子光辉灿烂的生命只有他父亲的一半"
        ],
        [
          "晚年",
          "孩子死后，老人在悲痛中活了4年，结束了尘世的生涯"
        ]
      ]
    }
  }
];
if(typeof module==='object'&&module.exports)module.exports=data;else(root.RatioWordProblemsData ||= []).push(...data);
})(typeof window==='undefined'?globalThis:window);
