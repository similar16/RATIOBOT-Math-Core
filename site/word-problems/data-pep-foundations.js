/* PEP Chapter 5: verified foundational and travel models. */
(function(root){
  const data = [
  {
    "id": "PEP-P002",
    "collectionId": "P002",
    "title": "大小水杯的单价",
    "group": "购物与总量",
    "source": "《数学 七年级上册》人教版，111页 · 问题1",
    "sourceBook": "pep",
    "sourcePages": [
      111
    ],
    "sourcePdfPages": [
      118
    ],
    "kind": "linear",
    "stem": "用买3个大水杯的钱，恰好能买4个小水杯，大水杯的单价比小水杯的单价多5元，两种水杯的单价各是多少元？",
    "tags": [
      "单价差",
      "总价相等"
    ],
    "facts": [
      {
        "id": "counts",
        "text": "买3个大水杯的钱恰好能买4个小水杯",
        "kind": "given"
      },
      {
        "id": "gap",
        "text": "大水杯单价比小水杯单价多5元",
        "kind": "given"
      },
      {
        "id": "equal",
        "text": "两次购买的总金额相等",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "main",
        "label": "设小水杯单价为x",
        "variable": "x",
        "meaning": "小水杯单价",
        "unit": "元",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "水杯",
            "单价/元",
            "购买数量/个",
            "总金额/元"
          ],
          "rows": [
            {
              "label": "小水杯",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "4",
                  "sources": [
                    "counts"
                  ],
                  "given": true
                },
                {
                  "expr": "4*x",
                  "sources": [
                    "counts",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "大水杯",
              "cells": [
                {
                  "expr": "x+5",
                  "sources": [
                    "unknown",
                    "gap"
                  ]
                },
                {
                  "expr": "3",
                  "sources": [
                    "counts"
                  ],
                  "given": true
                },
                {
                  "expr": "3*(x+5)",
                  "sources": [
                    "counts",
                    "unknown",
                    "gap"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "小水杯单价+单价差=大水杯单价"
          ],
          "multiply": [
            "单价×购买数量=总金额"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "小水杯单价",
              "单价差",
              "大水杯单价"
            ]
          ],
          "product": [
            [
              "单价",
              "购买数量",
              "总金额"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "equal"
          ],
          "text": "买3个大水杯与买4个小水杯花的钱相等.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "两次购买金额相等",
            "left": "3*(x+5)",
            "right": "4*x"
          }
        ],
        "answers": [
          {
            "label": "小水杯单价",
            "expr": "15",
            "unit": "元"
          },
          {
            "label": "大水杯单价",
            "expr": "20",
            "unit": "元"
          }
        ],
        "steps": [
          "3(x+5)=4x",
          "3x+15=4x",
          "x=15",
          "15+5=20"
        ],
        "checks": [
          {
            "text": "大水杯与小水杯的单价差",
            "expr": "20-15",
            "result": "5"
          },
          {
            "text": "大水杯购买金额",
            "expr": "3*20",
            "result": "60"
          },
          {
            "text": "小水杯购买金额",
            "expr": "4*15",
            "result": "60"
          }
        ],
        "conclusion": "小水杯每个15元，大水杯每个20元；两次购买都花60元.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      }
    ],
    "originalStem": "用买3个大水杯的钱，恰好能买4个小水杯，大水杯的单价比小水杯的单价多5元，两种水杯的单价各是多少元？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        111
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  {
    "id": "PEP-P003",
    "collectionId": "P003",
    "title": "女生比例与男女生人数差",
    "group": "比例与百分数",
    "source": "《数学 七年级上册》人教版，113页 · 例1",
    "sourceBook": "pep",
    "sourcePages": [
      113
    ],
    "sourcePdfPages": [
      120
    ],
    "kind": "linear",
    "stem": "某校女生占全体学生数的52%，比男生多80人，这所学校有多少名学生？原题要求根据问题设未知数并列出方程.",
    "tags": [
      "部分与整体",
      "比例基准",
      "人数差"
    ],
    "facts": [
      {
        "id": "girls",
        "text": "女生占全体学生人数的52%",
        "kind": "given"
      },
      {
        "id": "difference",
        "text": "女生比男生多80人",
        "kind": "given"
      },
      {
        "id": "whole",
        "text": "全校学生由男生、女生两部分组成，整体所占比例为1",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "main",
        "label": "设全校学生人数为x",
        "variable": "x",
        "meaning": "全校学生人数",
        "unit": "人",
        "domain": "x为正整数，男生和女生人数也应为整数",
        "derivations": [
          {
            "id": "boysFraction",
            "label": "男生占全校人数的比例",
            "expr": "1-52%",
            "result": "48%",
            "sources": [
              "whole",
              "girls"
            ],
            "unit": "",
            "explain": "女生比例从整体比例中扣除；48%由1−52%得到."
          }
        ],
        "table": {
          "headers": [
            "对象",
            "占全校人数的比例",
            "人数/人"
          ],
          "rows": [
            {
              "label": "女生",
              "cells": [
                {
                  "expr": "52%",
                  "sources": [
                    "girls"
                  ],
                  "given": true
                },
                {
                  "expr": "52%*x",
                  "sources": [
                    "girls",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "男生",
              "cells": [
                {
                  "expr": "1-52%",
                  "sources": [
                    "boysFraction"
                  ],
                  "given": true
                },
                {
                  "expr": "(1-52%)*x",
                  "sources": [
                    "boysFraction",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "全校",
              "cells": [
                {
                  "expr": "1",
                  "sources": [
                    "whole"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "男生人数+女生人数=全校人数",
            "男生人数+多出的人数=女生人数"
          ],
          "multiply": [
            "全校人数×女生比例=女生人数",
            "全校人数×男生比例=男生人数"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "男生人数",
              "女生人数",
              "全校人数"
            ],
            [
              "男生人数",
              "多出的人数",
              "女生人数"
            ]
          ],
          "product": [
            [
              "全校人数",
              "女生比例",
              "女生人数"
            ],
            [
              "全校人数",
              "男生比例",
              "男生人数"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "difference"
          ],
          "text": "女生人数比男生人数多80人；男女总人数关系已经用于表示两部分人数.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "女生人数等于男生人数加80",
            "left": "52%*x",
            "right": "(1-52%)*x+80"
          }
        ],
        "answers": [
          {
            "label": "全校学生人数",
            "expr": "2000",
            "unit": "人"
          }
        ],
        "steps": [
          "52%x=(1-52%)x+80",
          "(52%-48%)x=80",
          "4%x=80",
          "x=2000"
        ],
        "checks": [
          {
            "text": "女生人数",
            "expr": "52%*2000",
            "result": "1040"
          },
          {
            "text": "男生人数",
            "expr": "(1-52%)*2000",
            "result": "960"
          },
          {
            "text": "女生比男生多",
            "expr": "1040-960",
            "result": "80"
          },
          {
            "text": "两部分人数合计",
            "expr": "1040+960",
            "result": "2000"
          }
        ],
        "conclusion": "全校有2000名学生，其中女生1040人、男生960人，人数差和女生比例都符合原题.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      }
    ],
    "notices": [
      "对应例1第(1)问.第(2)问绿地面积涉及二次关系，不并入本题的一元一次分析.原题要求列式，求解与检验作为本模块延伸."
    ],
    "originalStem": "根据下列问题，设未知数并列出方程：（1）某校女生占全体学生数的52%，比男生多80人，这所学校有多少名学生？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        113
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  {
    "id": "PEP-P005",
    "collectionId": "P005",
    "title": "截接电线后的等长关系",
    "group": "调配与前后变化",
    "source": "《数学 七年级上册》人教版，113页 · 练习第2题",
    "sourceBook": "pep",
    "sourcePages": [
      113
    ],
    "sourcePdfPages": [
      120
    ],
    "kind": "linear",
    "stem": "根据下列问题，设未知数并列出方程：有两条电线，第一条长90 m，第二条长40 m.要从第一条截下一段接在第二条上，使两条电线长度相等.求截下的那段电线的长度（两条电线接头部分的长度忽略不计）.",
    "tags": [
      "移出与移入",
      "等长",
      "守恒"
    ],
    "facts": [
      {
        "id": "first",
        "text": "第一条电线原长90米",
        "kind": "given"
      },
      {
        "id": "second",
        "text": "第二条电线原长40米",
        "kind": "given"
      },
      {
        "id": "transfer",
        "text": "从第一条截下的一段全部接在第二条上，接头长度忽略不计",
        "kind": "given"
      },
      {
        "id": "equal",
        "text": "调整后两条电线长度相等",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "main",
        "label": "方案一：设截下的长度为x",
        "variable": "x",
        "meaning": "从第一条截下的电线长度",
        "unit": "米",
        "domain": "0<x<90",
        "derivations": [],
        "table": {
          "headers": [
            "电线",
            "原长/米",
            "截出长度/米",
            "接入长度/米",
            "调整后长度/米"
          ],
          "rows": [
            {
              "label": "第一条",
              "cells": [
                {
                  "expr": "90",
                  "sources": [
                    "first"
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
                  "note": "没有接入"
                },
                {
                  "expr": "90-x",
                  "sources": [
                    "first",
                    "transfer",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "第二条",
              "cells": [
                {
                  "expr": "40",
                  "sources": [
                    "second"
                  ],
                  "given": true
                },
                {
                  "note": "没有截出"
                },
                {
                  "expr": "x",
                  "sources": [
                    "transfer",
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "40+x",
                  "sources": [
                    "second",
                    "transfer",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "第一条调整后长度+截下长度=第一条原长",
            "第二条原长+接入长度=第二条调整后长度"
          ],
          "multiply": []
        },
        "relationTriples": {
          "sum": [
            [
              "第一条调整后长度",
              "截下长度",
              "第一条原长"
            ],
            [
              "第二条原长",
              "接入长度",
              "第二条调整后长度"
            ]
          ],
          "product": [],
          "notes": []
        },
        "closure": {
          "sources": [
            "equal"
          ],
          "text": "两条电线调整后的长度相等.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "调整后等长",
            "left": "90-x",
            "right": "40+x"
          }
        ],
        "answers": [
          {
            "label": "截下的电线长度",
            "expr": "25",
            "unit": "米"
          }
        ],
        "steps": [
          "90-x=40+x",
          "90-40=2x",
          "x=25"
        ],
        "checks": [
          {
            "text": "第一条调整后长度",
            "expr": "90-25",
            "result": "65"
          },
          {
            "text": "第二条调整后长度",
            "expr": "40+25",
            "result": "65"
          }
        ],
        "conclusion": "截下25米接到第二条上后，两条电线都长65米，且截下长度没有超出第一条原长.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      },
      {
        "id": "equal-length",
        "label": "方案二：设调整后的共同长度为x",
        "variable": "x",
        "meaning": "两条电线调整后的共同长度",
        "unit": "米",
        "domain": "40<x<90；第一条截出的长度等于第二条接入的长度",
        "derivations": [],
        "table": {
          "headers": [
            "电线",
            "原长/米",
            "截出长度/米",
            "接入长度/米",
            "调整后长度/米"
          ],
          "rows": [
            {
              "label": "第一条",
              "cells": [
                {
                  "expr": "90",
                  "sources": [
                    "first"
                  ],
                  "given": true
                },
                {
                  "expr": "90-x",
                  "sources": [
                    "first",
                    "unknown"
                  ]
                },
                {
                  "note": "没有接入"
                },
                {
                  "expr": "x",
                  "sources": [
                    "equal",
                    "unknown"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "第二条",
              "cells": [
                {
                  "expr": "40",
                  "sources": [
                    "second"
                  ],
                  "given": true
                },
                {
                  "note": "没有截出"
                },
                {
                  "expr": "x-40",
                  "sources": [
                    "second",
                    "unknown"
                  ]
                },
                {
                  "expr": "x",
                  "sources": [
                    "equal",
                    "unknown"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "第一条调整后长度+截下长度=第一条原长",
            "第二条原长+接入长度=第二条调整后长度"
          ],
          "multiply": []
        },
        "relationTriples": {
          "sum": [
            [
              "第一条调整后长度",
              "截下长度",
              "第一条原长"
            ],
            [
              "第二条原长",
              "接入长度",
              "第二条调整后长度"
            ]
          ],
          "product": [],
          "notes": []
        },
        "closure": {
          "sources": [
            "transfer"
          ],
          "text": "第一条截下的长度等于第二条接入的长度.",
          "hint": "调整后的等长已用于填表，再用截出与接入是同一段电线列方程."
        },
        "equations": [
          {
            "label": "截出长度与接入长度相等",
            "left": "90-x",
            "right": "x-40",
            "answerIndex": 1
          }
        ],
        "answers": [
          {
            "label": "截下的电线长度",
            "expr": "25",
            "unit": "米",
            "variable": ""
          },
          {
            "label": "调整后的共同长度",
            "expr": "65",
            "unit": "米",
            "variable": "x"
          }
        ],
        "steps": [
          "90-x=x-40",
          "2*x=90+40",
          "x=65",
          "90-65=25"
        ],
        "checks": [
          {
            "text": "第一条截下的长度",
            "expr": "90-65",
            "result": "25"
          },
          {
            "text": "第二条接入的长度",
            "expr": "65-40",
            "result": "25"
          },
          {
            "text": "两条原长总和",
            "expr": "90+40",
            "result": "130"
          },
          {
            "text": "调整后总长",
            "expr": "65+65",
            "result": "130"
          }
        ],
        "conclusion": "截下25米接到第二条上后，两条电线都长65米，且截下长度没有超出第一条原长.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        },
        "tableNote": "共同长度已由设元表示为x；用原长与调整后长度之差表示截出或接入长度.所求仍是截下的一段长度."
      }
    ],
    "originalStem": "根据下列问题，设未知数并列出方程：有两条电线，第一条长90 m，第二条长40 m.要从第一条截下一段接在第二条上，使两条电线长度相等.求截下的那段电线的长度（两条电线接头部分的长度忽略不计）.",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        113
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    },
    "contentRevision": 1
  },
  {
    "id": "PEP-P012",
    "collectionId": "P012",
    "title": "交换两位数的数位",
    "group": "数字与规律",
    "source": "《数学 七年级上册》人教版，119页 · 第11题",
    "sourceBook": "pep",
    "sourcePages": [
      119
    ],
    "sourcePdfPages": [
      126
    ],
    "kind": "linear",
    "stem": "一个两位数个位上的数字是1，十位上的数字是x.把1与x对调，新的两位数比原两位数小18，x的值是多少？请你用方程解决这个问题.",
    "tags": [
      "十进制位值",
      "交换数位"
    ],
    "facts": [
      {
        "id": "unitDigit",
        "text": "原两位数的个位数字是1，十位数字是x",
        "kind": "given"
      },
      {
        "id": "swap",
        "text": "交换个位和十位数字后，新的两位数比原数小18",
        "kind": "given"
      },
      {
        "id": "place",
        "text": "十进制中十位的位值为10；两位数的十位数字应为1至9的整数",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "main",
        "label": "设原两位数的十位数字为x",
        "variable": "x",
        "meaning": "原两位数的十位数字",
        "unit": "",
        "domain": "x为1至9的整数",
        "derivations": [],
        "table": {
          "headers": [
            "状态",
            "十位数字",
            "个位数字",
            "十位表示的数值",
            "两位数"
          ],
          "rows": [
            {
              "label": "原数",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "1",
                  "sources": [
                    "unitDigit"
                  ],
                  "given": true
                },
                {
                  "expr": "10*x",
                  "sources": [
                    "place",
                    "unknown"
                  ]
                },
                {
                  "expr": "10*x+1",
                  "sources": [
                    "place",
                    "unknown",
                    "unitDigit"
                  ]
                }
              ]
            },
            {
              "label": "交换后",
              "cells": [
                {
                  "expr": "1",
                  "sources": [
                    "unitDigit",
                    "swap"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "swap"
                  ],
                  "given": true
                },
                {
                  "expr": "10*1",
                  "sources": [
                    "place",
                    "unitDigit"
                  ]
                },
                {
                  "expr": "10*1+x",
                  "sources": [
                    "place",
                    "unitDigit",
                    "unknown",
                    "swap"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "十位表示的数值+个位数字=两位数",
            "交换后的两位数+两数之差=原两位数"
          ],
          "multiply": [
            "十位数字×十位位值=十位表示的数值"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "十位表示的数值",
              "个位数字",
              "两位数"
            ],
            [
              "交换后的两位数",
              "两数之差",
              "原两位数"
            ]
          ],
          "product": [
            [
              "十位数字",
              "十位位值",
              "十位表示的数值"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "swap"
          ],
          "text": "交换后的数加18等于原数.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "原数比新数大18",
            "left": "10*x+1",
            "right": "10*1+x+18"
          }
        ],
        "answers": [
          {
            "label": "原数的十位数字x",
            "expr": "3",
            "unit": ""
          }
        ],
        "steps": [
          "10x+1=10+x+18",
          "9x=27",
          "x=3"
        ],
        "checks": [
          {
            "text": "原两位数",
            "expr": "10*3+1",
            "result": "31"
          },
          {
            "text": "交换后的两位数",
            "expr": "10*1+3",
            "result": "13"
          },
          {
            "text": "原数与新数之差",
            "expr": "31-13",
            "result": "18"
          }
        ],
        "conclusion": "x=3.原数为31，交换后为13，差是18，两个数均为两位数.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      }
    ],
    "originalStem": "一个两位数个位上的数字是1，十位上的数字是x.把1与x对调，新的两位数比原两位数小18，x的值是多少？请你用方程解决这个问题.",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        119
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  {
    "id": "PEP-P014",
    "collectionId": "P014",
    "title": "相邻三项的数列关系",
    "group": "数字与规律",
    "source": "《数学 七年级上册》人教版，121页 · 例2",
    "sourceBook": "pep",
    "sourcePages": [
      121
    ],
    "sourcePdfPages": [
      128
    ],
    "kind": "linear",
    "stem": "有一列数−3，9，−27，81，−243，…，其中第n个数是(−3)^n（n是正整数）.如果这列数中某三个相邻数的和是−1701，那么这三个数各是多少？",
    "tags": [
      "相邻项",
      "负数倍数",
      "求和"
    ],
    "facts": [
      {
        "id": "sequence",
        "text": "数列依次为−3，9，−27，81，−243，…，第n项为(−3)^n，n为正整数",
        "kind": "given"
      },
      {
        "id": "sum",
        "text": "某三个相邻数的和为−1701",
        "kind": "given"
      },
      {
        "id": "law",
        "text": "相邻项的比可由后一项除以前一项得到；相邻项的指数相差1，隔一项的指数相差2.",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "main",
        "label": "设这三个相邻数中的第一项为x",
        "variable": "x",
        "meaning": "这三个相邻数中的第一项",
        "unit": "",
        "domain": "x须是给定数列中的某一项，且所选三项按数列顺序相邻",
        "derivations": [
          {
            "id": "ratio",
            "label": "相邻后一项是前一项的多少倍",
            "expr": "9/(-3)",
            "result": "-3",
            "sources": [
              "sequence",
              "law"
            ],
            "unit": "",
            "explain": "可比较已给的任意一对相邻项，也可利用通项式.选择一种方法，写出算式即可.",
            "methods": [
              {
                "id": "pair-12",
                "label": "第2项÷第1项",
                "expr": "9/(-3)",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "pair-23",
                "label": "第3项÷第2项",
                "expr": "(-27)/9",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "pair-34",
                "label": "第4项÷第3项",
                "expr": "81/(-27)",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "pair-45",
                "label": "第5项÷第4项",
                "expr": "(-243)/81",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "general",
                "label": "由通项式比较相邻两项",
                "expr": "(-3)^1",
                "sources": [
                  "sequence",
                  "law"
                ],
                "explain": "后一项与前一项的指数相差1，约去相同的因子后写出剩余的乘方.",
                "basis": "\\frac{(-3)^{n+1}}{(-3)^n}=(-3)^1"
              }
            ]
          },
          {
            "id": "twiceRatio",
            "label": "第三项相对于所选第一项的倍数",
            "expr": "(-3)*(-3)",
            "result": "9",
            "sources": [
              "ratio"
            ],
            "unit": "",
            "explain": "可连乘两次相邻项的倍数，也可比较任意一对相隔两项的位置，或由通项式比较指数.",
            "methods": [
              {
                "id": "multiply",
                "label": "连续乘两次相邻项倍数",
                "expr": "(-3)*(-3)",
                "sources": [
                  "ratio"
                ]
              },
              {
                "id": "square",
                "label": "相邻项倍数的平方",
                "expr": "(-3)^2",
                "sources": [
                  "ratio",
                  "law"
                ]
              },
              {
                "id": "pair-13",
                "label": "第3项÷第1项",
                "expr": "(-27)/(-3)",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "pair-24",
                "label": "第4项÷第2项",
                "expr": "81/9",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "pair-35",
                "label": "第5项÷第3项",
                "expr": "(-243)/(-27)",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "general",
                "label": "由通项式比较隔一项的两项",
                "expr": "(-3)^2",
                "sources": [
                  "sequence",
                  "law"
                ],
                "explain": "两个位置的指数相差2，约去相同的因子后写出剩余的乘方.",
                "basis": "\\frac{(-3)^{n+2}}{(-3)^n}=(-3)^2"
              }
            ]
          }
        ],
        "table": {
          "headers": [
            "位置",
            "与所选第一项的倍数关系",
            "该项"
          ],
          "rows": [
            {
              "label": "第一项",
              "cells": [
                {
                  "note": "选作基准"
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "第二项",
              "cells": [
                {
                  "expr": "-3",
                  "sources": [
                    "ratio"
                  ],
                  "given": true
                },
                {
                  "expr": "(-3)*x",
                  "sources": [
                    "ratio",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "第三项",
              "cells": [
                {
                  "expr": "9",
                  "sources": [
                    "twiceRatio"
                  ],
                  "given": true
                },
                {
                  "expr": "(-3)*(-3)*x",
                  "sources": [
                    "ratio",
                    "twiceRatio",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "三项合计",
              "cells": [
                {
                  "note": "不把倍数作为独立数相加"
                },
                {
                  "expr": "-1701",
                  "sources": [
                    "sum"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "第一项+第二项=前两项之和",
            "前两项之和+第三项=相邻三项之和"
          ],
          "multiply": [
            "前一项×相邻项倍数=后一项"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "第一项",
              "第二项",
              "前两项之和"
            ],
            [
              "前两项之和",
              "第三项",
              "相邻三项之和"
            ]
          ],
          "product": [
            [
              "前一项",
              "相邻项倍数",
              "后一项"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "sum"
          ],
          "text": "按数列顺序写出的这三个相邻数相加为−1701.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "相邻三项之和",
            "left": "x+(-3)*x+(-3)*(-3)*x",
            "right": "-1701"
          }
        ],
        "answers": [
          {
            "label": "第一项",
            "expr": "-243",
            "unit": ""
          },
          {
            "label": "第二项",
            "expr": "729",
            "unit": ""
          },
          {
            "label": "第三项",
            "expr": "-2187",
            "unit": ""
          }
        ],
        "steps": [
          "x+(-3)x+(-3)(-3)x=-1701",
          "(1-3+9)x=-1701",
          "7x=-1701",
          "x=-243",
          "(-3)(-243)=729",
          "(-3)×729=-2187"
        ],
        "checks": [
          {
            "text": "第二项等于第一项乘−3",
            "expr": "(-3)*(-243)",
            "result": "729"
          },
          {
            "text": "第三项等于第二项乘−3",
            "expr": "(-3)*729",
            "result": "-2187"
          },
          {
            "text": "三项之和",
            "expr": "-243+729-2187",
            "result": "-1701"
          },
          {
            "text": "第一项确属原数列：填出它对应的指数",
            "expr": "(-3)^5",
            "result": "-243",
            "input": "exponent",
            "base": "-3",
            "exponent": "5"
          }
        ],
        "conclusion": "三个相邻数依次为−243、729、−2187，对应原数列的第5、6、7项.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      },
      {
        "id": "middle",
        "label": "设这三个相邻数中的第二项为x",
        "variable": "x",
        "meaning": "这三个相邻数中的第二项",
        "unit": "",
        "domain": "x须是给定数列中的某一项，且所选三项按数列顺序相邻",
        "derivations": [
          {
            "id": "ratio",
            "label": "相邻后一项是前一项的多少倍",
            "expr": "9/(-3)",
            "result": "-3",
            "sources": [
              "sequence",
              "law"
            ],
            "unit": "",
            "explain": "可比较已给的任意一对相邻项，也可利用通项式.选择一种方法，写出算式即可.",
            "methods": [
              {
                "id": "pair-12",
                "label": "第2项÷第1项",
                "expr": "9/(-3)",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "pair-23",
                "label": "第3项÷第2项",
                "expr": "(-27)/9",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "pair-34",
                "label": "第4项÷第3项",
                "expr": "81/(-27)",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "pair-45",
                "label": "第5项÷第4项",
                "expr": "(-243)/81",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "general",
                "label": "由通项式比较相邻两项",
                "expr": "(-3)^1",
                "sources": [
                  "sequence",
                  "law"
                ],
                "explain": "后一项与前一项的指数相差1，约去相同的因子后写出剩余的乘方.",
                "basis": "\\frac{(-3)^{n+1}}{(-3)^n}=(-3)^1"
              }
            ]
          }
        ],
        "table": {
          "headers": [
            "位置",
            "与所设第二项的倍数关系",
            "该项"
          ],
          "rows": [
            {
              "label": "第一项",
              "cells": [
                {
                  "expr": "1/(-3)",
                  "sources": [
                    "ratio",
                    "law"
                  ],
                  "given": true
                },
                {
                  "expr": "x/(-3)",
                  "sources": [
                    "unknown",
                    "ratio"
                  ]
                }
              ]
            },
            {
              "label": "第二项",
              "cells": [
                {
                  "note": "选作基准"
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "第三项",
              "cells": [
                {
                  "expr": "-3",
                  "sources": [
                    "ratio"
                  ],
                  "given": true
                },
                {
                  "expr": "(-3)*x",
                  "sources": [
                    "ratio",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "三项合计",
              "cells": [
                {
                  "note": "不把倍数作为独立数相加"
                },
                {
                  "expr": "-1701",
                  "sources": [
                    "sum"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "第一项+第二项=前两项之和",
            "前两项之和+第三项=相邻三项之和"
          ],
          "multiply": [
            "前一项×相邻项倍数=后一项"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "第一项",
              "第二项",
              "前两项之和"
            ],
            [
              "前两项之和",
              "第三项",
              "相邻三项之和"
            ]
          ],
          "product": [
            [
              "前一项",
              "相邻项倍数",
              "后一项"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "sum"
          ],
          "text": "按数列顺序写出的这三个相邻数相加为−1701.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "相邻三项之和",
            "left": "x/(-3)+x+(-3)*x",
            "right": "-1701",
            "answerIndex": 1
          }
        ],
        "answers": [
          {
            "label": "第一项",
            "expr": "-243",
            "unit": ""
          },
          {
            "label": "第二项",
            "expr": "729",
            "unit": ""
          },
          {
            "label": "第三项",
            "expr": "-2187",
            "unit": ""
          }
        ],
        "steps": [
          "x/(-3)+x+(-3)*x=-1701",
          "(-1/3+1-3)*x=-1701",
          "x=729",
          "729/(-3)=-243",
          "(-3)*729=-2187"
        ],
        "checks": [
          {
            "text": "第二项等于第一项乘−3",
            "expr": "(-3)*(-243)",
            "result": "729"
          },
          {
            "text": "第三项等于第二项乘−3",
            "expr": "(-3)*729",
            "result": "-2187"
          },
          {
            "text": "三项之和",
            "expr": "-243+729-2187",
            "result": "-1701"
          },
          {
            "text": "第一项确属原数列：填出它对应的指数",
            "expr": "(-3)^5",
            "result": "-243",
            "input": "exponent",
            "base": "-3",
            "exponent": "5"
          }
        ],
        "conclusion": "三个相邻数依次为−243、729、−2187，对应原数列的第5、6、7项.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      },
      {
        "id": "last",
        "label": "设这三个相邻数中的第三项为x",
        "variable": "x",
        "meaning": "这三个相邻数中的第三项",
        "unit": "",
        "domain": "x须是给定数列中的某一项，且所选三项按数列顺序相邻",
        "derivations": [
          {
            "id": "ratio",
            "label": "相邻后一项是前一项的多少倍",
            "expr": "9/(-3)",
            "result": "-3",
            "sources": [
              "sequence",
              "law"
            ],
            "unit": "",
            "explain": "可比较已给的任意一对相邻项，也可利用通项式.选择一种方法，写出算式即可.",
            "methods": [
              {
                "id": "pair-12",
                "label": "第2项÷第1项",
                "expr": "9/(-3)",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "pair-23",
                "label": "第3项÷第2项",
                "expr": "(-27)/9",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "pair-34",
                "label": "第4项÷第3项",
                "expr": "81/(-27)",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "pair-45",
                "label": "第5项÷第4项",
                "expr": "(-243)/81",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "general",
                "label": "由通项式比较相邻两项",
                "expr": "(-3)^1",
                "sources": [
                  "sequence",
                  "law"
                ],
                "explain": "后一项与前一项的指数相差1，约去相同的因子后写出剩余的乘方.",
                "basis": "\\frac{(-3)^{n+1}}{(-3)^n}=(-3)^1"
              }
            ]
          },
          {
            "id": "twiceRatio",
            "label": "第三项相对于所选第一项的倍数",
            "expr": "(-3)*(-3)",
            "result": "9",
            "sources": [
              "ratio"
            ],
            "unit": "",
            "explain": "可连乘两次相邻项的倍数，也可比较任意一对相隔两项的位置，或由通项式比较指数.",
            "methods": [
              {
                "id": "multiply",
                "label": "连续乘两次相邻项倍数",
                "expr": "(-3)*(-3)",
                "sources": [
                  "ratio"
                ]
              },
              {
                "id": "square",
                "label": "相邻项倍数的平方",
                "expr": "(-3)^2",
                "sources": [
                  "ratio",
                  "law"
                ]
              },
              {
                "id": "pair-13",
                "label": "第3项÷第1项",
                "expr": "(-27)/(-3)",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "pair-24",
                "label": "第4项÷第2项",
                "expr": "81/9",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "pair-35",
                "label": "第5项÷第3项",
                "expr": "(-243)/(-27)",
                "sources": [
                  "sequence",
                  "law"
                ]
              },
              {
                "id": "general",
                "label": "由通项式比较隔一项的两项",
                "expr": "(-3)^2",
                "sources": [
                  "sequence",
                  "law"
                ],
                "explain": "两个位置的指数相差2，约去相同的因子后写出剩余的乘方.",
                "basis": "\\frac{(-3)^{n+2}}{(-3)^n}=(-3)^2"
              }
            ]
          }
        ],
        "table": {
          "headers": [
            "位置",
            "与所设第三项的倍数关系",
            "该项"
          ],
          "rows": [
            {
              "label": "第一项",
              "cells": [
                {
                  "expr": "1/9",
                  "sources": [
                    "twiceRatio",
                    "law"
                  ],
                  "given": true
                },
                {
                  "expr": "x/((-3)*(-3))",
                  "sources": [
                    "unknown",
                    "ratio",
                    "twiceRatio"
                  ]
                }
              ]
            },
            {
              "label": "第二项",
              "cells": [
                {
                  "expr": "1/(-3)",
                  "sources": [
                    "ratio",
                    "law"
                  ],
                  "given": true
                },
                {
                  "expr": "x/(-3)",
                  "sources": [
                    "unknown",
                    "ratio"
                  ]
                }
              ]
            },
            {
              "label": "第三项",
              "cells": [
                {
                  "note": "选作基准"
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "三项合计",
              "cells": [
                {
                  "note": "不把倍数作为独立数相加"
                },
                {
                  "expr": "-1701",
                  "sources": [
                    "sum"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "第一项+第二项=前两项之和",
            "前两项之和+第三项=相邻三项之和"
          ],
          "multiply": [
            "前一项×相邻项倍数=后一项"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "第一项",
              "第二项",
              "前两项之和"
            ],
            [
              "前两项之和",
              "第三项",
              "相邻三项之和"
            ]
          ],
          "product": [
            [
              "前一项",
              "相邻项倍数",
              "后一项"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "sum"
          ],
          "text": "按数列顺序写出的这三个相邻数相加为−1701.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "相邻三项之和",
            "left": "x/((-3)*(-3))+x/(-3)+x",
            "right": "-1701",
            "answerIndex": 2
          }
        ],
        "answers": [
          {
            "label": "第一项",
            "expr": "-243",
            "unit": ""
          },
          {
            "label": "第二项",
            "expr": "729",
            "unit": ""
          },
          {
            "label": "第三项",
            "expr": "-2187",
            "unit": ""
          }
        ],
        "steps": [
          "x/9+x/(-3)+x=-1701",
          "(1/9-1/3+1)*x=-1701",
          "x=-2187",
          "(-2187)/(-3)=729",
          "(-2187)/9=-243"
        ],
        "checks": [
          {
            "text": "第二项等于第一项乘−3",
            "expr": "(-3)*(-243)",
            "result": "729"
          },
          {
            "text": "第三项等于第二项乘−3",
            "expr": "(-3)*729",
            "result": "-2187"
          },
          {
            "text": "三项之和",
            "expr": "-243+729-2187",
            "result": "-1701"
          },
          {
            "text": "第一项确属原数列：填出它对应的指数",
            "expr": "(-3)^5",
            "result": "-243",
            "input": "exponent",
            "base": "-3",
            "exponent": "5"
          }
        ],
        "conclusion": "三个相邻数依次为−243、729、−2187，对应原数列的第5、6、7项.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      }
    ],
    "originalStem": "有一列数−3，9，−27，81，−243，…，其中第n个数是(−3)^n（n是正整数）.如果这列数中某三个相邻数的和是−1701，那么这三个数各是多少？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        121
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    },
    "contentRevision": 1
  },
  {
    "id": "PEP-P015",
    "collectionId": "P015",
    "title": "三年产值逐年倍增",
    "group": "比例与百分数",
    "source": "《数学 七年级上册》人教版，121页 · 练习 第2题",
    "sourceBook": "pep",
    "sourcePages": [
      121
    ],
    "sourcePdfPages": [
      128
    ],
    "kind": "linear",
    "stem": "某工厂的产值连续增长，2022年是2021年的1.5倍，2023年是2022年的2倍，这三年的总产值为550万元.2021年的产值是多少万元？",
    "tags": [
      "逐年变化",
      "基准量变化",
      "三个部分"
    ],
    "facts": [
      {
        "id": "last",
        "text": "2022年的产值是2021年的1.5倍",
        "kind": "given"
      },
      {
        "id": "this",
        "text": "2023年的产值是2022年的2倍",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "这三年的总产值为550万元",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "main",
        "label": "设2021年的产值为x",
        "variable": "x",
        "meaning": "2021年的产值",
        "unit": "万元",
        "domain": "x>0",
        "derivations": [
          {
            "id": "thirdFactor",
            "label": "2023年相对于2021年的产值倍数",
            "expr": "1.5*2",
            "result": "3",
            "sources": [
              "last",
              "this"
            ],
            "unit": "",
            "explain": "先从2021年乘1.5到2022年，再乘2到2023年，所以不能直接把两次倍数相加."
          }
        ],
        "table": {
          "headers": [
            "年份",
            "比较基准产值/万元",
            "相对基准倍数",
            "本年产值/万元"
          ],
          "rows": [
            {
              "label": "2021年",
              "cells": [
                {
                  "note": "本年选作基准"
                },
                {
                  "note": "无需换算"
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "2022年",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "1.5",
                  "sources": [
                    "last"
                  ],
                  "given": true
                },
                {
                  "expr": "1.5*x",
                  "sources": [
                    "last",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "2023年",
              "cells": [
                {
                  "expr": "1.5*x",
                  "sources": [
                    "last",
                    "unknown"
                  ]
                },
                {
                  "expr": "2",
                  "sources": [
                    "this"
                  ],
                  "given": true
                },
                {
                  "expr": "2*1.5*x",
                  "sources": [
                    "last",
                    "this",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "三年合计",
              "cells": [
                {
                  "note": "不相加"
                },
                {
                  "note": "不相加"
                },
                {
                  "expr": "550",
                  "sources": [
                    "total"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "2021年产值+2022年产值=前两年产值",
            "前两年产值+2023年产值=三年总产值"
          ],
          "multiply": [
            "比较基准产值×相对基准倍数=对应年份产值"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "2021年产值",
              "2022年产值",
              "前两年产值"
            ],
            [
              "前两年产值",
              "2023年产值",
              "三年总产值"
            ]
          ],
          "product": [
            [
              "比较基准产值",
              "相对基准倍数",
              "对应年份产值"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "三个年份的产值合计为550万元.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "三年产值之和",
            "left": "x+1.5*x+2*1.5*x",
            "right": "550"
          }
        ],
        "answers": [
          {
            "label": "2021年产值",
            "expr": "100",
            "unit": "万元"
          }
        ],
        "steps": [
          "x+1.5x+2×1.5x=550",
          "(1+1.5+2×1.5)x=550",
          "5.5x=550",
          "x=100"
        ],
        "checks": [
          {
            "text": "2022年产值",
            "expr": "1.5*100",
            "result": "150"
          },
          {
            "text": "2023年产值",
            "expr": "2*150",
            "result": "300"
          },
          {
            "text": "三年总产值",
            "expr": "100+150+300",
            "result": "550"
          }
        ],
        "conclusion": "2021年的产值为100万元；2022年为150万元，2023年为300万元，三年合计550万元.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      }
    ],
    "originalStem": "某工厂的产值连续增长，2022年是2021年的1.5倍，2023年是2022年的2倍，这三年的总产值为550万元.2021年的产值是多少万元？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        121
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  {
    "id": "PEP-P018",
    "collectionId": "P018",
    "title": "新旧工艺的排量与环保限额",
    "group": "盈不足与比较",
    "source": "《数学 七年级上册》人教版，123、124页 · 例4",
    "sourceBook": "pep",
    "sourcePages": [
      123,
      124
    ],
    "sourcePdfPages": [
      130,
      131
    ],
    "kind": "linear",
    "stem": "某制药厂制造一批药品，如用旧工艺，则废水排量要比环保限制的最大量还多200t；如用新工艺，则废水排量比环保限制的最大量少100t.新、旧工艺的废水排量之比为2∶5，采用两种工艺的废水排量各是多少吨？",
    "tags": [
      "余缺比较",
      "比例",
      "同量两种表示"
    ],
    "facts": [
      {
        "id": "over",
        "text": "旧工艺废水排量比环保限制的最大量多200吨",
        "kind": "given"
      },
      {
        "id": "under",
        "text": "新工艺废水排量比环保限制的最大量少100吨",
        "kind": "given"
      },
      {
        "id": "ratio",
        "text": "新工艺与旧工艺的废水排量之比为2∶5",
        "kind": "given"
      },
      {
        "id": "limit",
        "text": "两种工艺对应同一个环保限制的最大量",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "main",
        "label": "设新工艺的废水排量为x",
        "variable": "x",
        "meaning": "新工艺的废水排量",
        "unit": "吨",
        "domain": "x>0",
        "derivations": [
          {
            "id": "oldFactor",
            "label": "旧工艺排量相对于新工艺的倍数",
            "expr": "5/2",
            "result": "2.5",
            "sources": [
              "ratio"
            ],
            "unit": "",
            "explain": "新∶旧为2∶5，旧工艺对新工艺的倍数要用5÷2."
          }
        ],
        "table": {
          "headers": [
            "工艺",
            "废水排量/吨",
            "与环保限制的最大量的关系",
            "同一环保限制的最大量/吨"
          ],
          "rows": [
            {
              "label": "新工艺",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "note": "比最大允许量少100吨"
                },
                {
                  "expr": "x+100",
                  "sources": [
                    "unknown",
                    "under"
                  ]
                }
              ]
            },
            {
              "label": "旧工艺",
              "cells": [
                {
                  "expr": "(5/2)*x",
                  "sources": [
                    "oldFactor",
                    "unknown"
                  ]
                },
                {
                  "note": "比最大允许量多200吨"
                },
                {
                  "expr": "(5/2)*x-200",
                  "sources": [
                    "oldFactor",
                    "unknown",
                    "over"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "新工艺排量+低于限额的量=环保限制的最大量",
            "环保限制的最大量+超过限额的量=旧工艺排量"
          ],
          "multiply": [
            "新工艺排量×旧工艺相对新工艺的倍数=旧工艺排量"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "新工艺排量",
              "低于限额的量",
              "环保限制的最大量"
            ],
            [
              "环保限制的最大量",
              "超过限额的量",
              "旧工艺排量"
            ]
          ],
          "product": [
            [
              "新工艺排量",
              "旧工艺相对新工艺的倍数",
              "旧工艺排量"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "limit"
          ],
          "text": "由新工艺和旧工艺分别表示的环保限制的最大量必须相等.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "同一环保限制的最大量",
            "left": "x+100",
            "right": "(5/2)*x-200"
          }
        ],
        "answers": [
          {
            "label": "新工艺废水排量",
            "expr": "200",
            "unit": "吨"
          },
          {
            "label": "旧工艺废水排量",
            "expr": "500",
            "unit": "吨"
          }
        ],
        "steps": [
          "x+100=(5/2)x-200",
          "(5/2-1)x=300",
          "x=200",
          "(5/2)×200=500"
        ],
        "checks": [
          {
            "text": "由新工艺反求环保限制的最大量",
            "expr": "200+100",
            "result": "300"
          },
          {
            "text": "由旧工艺反求环保限制的最大量",
            "expr": "500-200",
            "result": "300"
          },
          {
            "text": "新旧排量之比",
            "expr": "200/500",
            "result": "2/5"
          }
        ],
        "conclusion": "新工艺排量为200吨，旧工艺排量为500吨；两种方法得到的环保限制的最大量均为300吨.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      }
    ],
    "originalStem": "某制药厂制造一批药品，如用旧工艺，则废水排量要比环保限制的最大量还多200t；如用新工艺，则废水排量比环保限制的最大量少100t.新、旧工艺的废水排量之比为2∶5，采用两种工艺的废水排量各是多少吨？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        123,
        124
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  {
    "id": "PEP-P020",
    "collectionId": "P020",
    "title": "采摘后转交的樱桃",
    "group": "调配与前后变化",
    "source": "《数学 七年级上册》人教版，124页 · 练习 第4题",
    "sourceBook": "pep",
    "sourcePages": [
      124
    ],
    "sourcePdfPages": [
      131
    ],
    "kind": "linear",
    "stem": "王芳和张华同时采摘樱桃，王芳平均每小时采摘8kg，张华平均每小时采摘7kg.采摘结束后王芳从她采摘的樱桃中取出0.25kg给了张华，这时两人的樱桃一样多.她们采摘用了多长时间？",
    "tags": [
      "单位量×时间",
      "转移",
      "相等"
    ],
    "facts": [
      {
        "id": "wang",
        "text": "王芳平均每小时采摘8千克樱桃",
        "kind": "given"
      },
      {
        "id": "zhang",
        "text": "张华平均每小时采摘7千克樱桃",
        "kind": "given"
      },
      {
        "id": "time",
        "text": "两人同时开始并同时结束采摘，采摘时间相同",
        "kind": "given"
      },
      {
        "id": "transfer",
        "text": "王芳把采摘樱桃中的0.25千克转交给张华",
        "kind": "given"
      },
      {
        "id": "equal",
        "text": "转交后两人的樱桃质量相等",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "main",
        "label": "设两人共同采摘的时间为x",
        "variable": "x",
        "meaning": "两人共同采摘的时间",
        "unit": "小时",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "每小时采摘量/千克",
            "采摘时间/小时",
            "采摘量/千克",
            "转交后质量/千克"
          ],
          "rows": [
            {
              "label": "王芳",
              "cells": [
                {
                  "expr": "8",
                  "sources": [
                    "wang"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "time"
                  ],
                  "given": true
                },
                {
                  "expr": "8*x",
                  "sources": [
                    "wang",
                    "unknown",
                    "time"
                  ]
                },
                {
                  "expr": "8*x-0.25",
                  "sources": [
                    "wang",
                    "unknown",
                    "time",
                    "transfer"
                  ]
                }
              ]
            },
            {
              "label": "张华",
              "cells": [
                {
                  "expr": "7",
                  "sources": [
                    "zhang"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "time"
                  ],
                  "given": true
                },
                {
                  "expr": "7*x",
                  "sources": [
                    "zhang",
                    "unknown",
                    "time"
                  ]
                },
                {
                  "expr": "7*x+0.25",
                  "sources": [
                    "zhang",
                    "unknown",
                    "time",
                    "transfer"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "王芳转交后质量+转交质量=王芳采摘量",
            "张华采摘量+收到的质量=张华转交后质量"
          ],
          "multiply": [
            "每小时采摘量×采摘时间=采摘量"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "王芳转交后质量",
              "转交质量",
              "王芳采摘量"
            ],
            [
              "张华采摘量",
              "收到的质量",
              "张华转交后质量"
            ]
          ],
          "product": [
            [
              "每小时采摘量",
              "采摘时间",
              "采摘量"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "equal"
          ],
          "text": "转交后两人的樱桃质量相等，移出与收到的是同一份0.25千克.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "转交后两人质量相等",
            "left": "8*x-0.25",
            "right": "7*x+0.25"
          }
        ],
        "answers": [
          {
            "label": "共同采摘时间",
            "expr": "1/2",
            "unit": "小时"
          }
        ],
        "steps": [
          "8x-0.25=7x+0.25",
          "x=0.25+0.25",
          "x=0.5"
        ],
        "checks": [
          {
            "text": "王芳转交后的质量",
            "expr": "8*(1/2)-0.25",
            "result": "3.75"
          },
          {
            "text": "张华转交后的质量",
            "expr": "7*(1/2)+0.25",
            "result": "3.75"
          }
        ],
        "conclusion": "她们采摘用了0.5小时.转交后两人各有3.75千克樱桃.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      }
    ],
    "originalStem": "王芳和张华同时采摘樱桃，王芳平均每小时采摘8kg，张华平均每小时采摘7kg.采摘结束后王芳从她采摘的樱桃中取出0.25kg给了张华，这时两人的樱桃一样多.她们采摘用了多长时间？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        124
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  {
    "id": "PEP-P021",
    "collectionId": "P021",
    "title": "上下半年的用电量",
    "group": "分段与平均量",
    "source": "《数学 七年级上册》人教版，124、125页 · 正文 问题3",
    "sourceBook": "pep",
    "sourcePages": [
      124,
      125
    ],
    "sourcePdfPages": [
      131,
      132
    ],
    "kind": "linear",
    "stem": "某工厂采取节能措施，去年下半年与上半年相比，月平均用电量减少2000kW·h（千瓦时），全年的用电量是150000kW·h.这个工厂去年上半年平均每月的用电量是多少？",
    "tags": [
      "平均量",
      "时间分段",
      "总量"
    ],
    "facts": [
      {
        "id": "decrease",
        "text": "下半年比上半年平均每月少用电2000千瓦时",
        "kind": "given"
      },
      {
        "id": "annual",
        "text": "全年用电量为150000千瓦时",
        "kind": "given"
      },
      {
        "id": "calendar",
        "text": "1年有12个月，上下半年把全年分为2个相等的时间段",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "main",
        "label": "设上半年平均每月用电量为x",
        "variable": "x",
        "meaning": "上半年平均每月用电量",
        "unit": "千瓦时",
        "domain": "x>2000",
        "derivations": [
          {
            "id": "months",
            "label": "每半年的月数",
            "expr": "12/2",
            "result": "6",
            "sources": [
              "calendar"
            ],
            "unit": "月",
            "explain": "半年所含的6个月来自一年12个月平均分成两段，而不是题目另给的新数."
          }
        ],
        "table": {
          "headers": [
            "时间段",
            "平均每月用电量/千瓦时",
            "月数/月",
            "该段总用电量/千瓦时"
          ],
          "rows": [
            {
              "label": "上半年",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "12/2",
                  "sources": [
                    "months"
                  ],
                  "given": true
                },
                {
                  "expr": "(12/2)*x",
                  "sources": [
                    "months",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "下半年",
              "cells": [
                {
                  "expr": "x-2000",
                  "sources": [
                    "unknown",
                    "decrease"
                  ]
                },
                {
                  "expr": "12/2",
                  "sources": [
                    "months"
                  ],
                  "given": true
                },
                {
                  "expr": "(12/2)*(x-2000)",
                  "sources": [
                    "months",
                    "unknown",
                    "decrease"
                  ]
                }
              ]
            },
            {
              "label": "全年",
              "cells": [
                {
                  "note": "平均量不直接相加"
                },
                {
                  "expr": "12",
                  "sources": [
                    "calendar"
                  ],
                  "given": true
                },
                {
                  "expr": "150000",
                  "sources": [
                    "annual"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "下半年月均用电量+月均减少量=上半年月均用电量",
            "上半年总用电量+下半年总用电量=全年用电量"
          ],
          "multiply": [
            "月平均用电量×月数=该段总用电量"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "下半年月均用电量",
              "月均减少量",
              "上半年月均用电量"
            ],
            [
              "上半年总用电量",
              "下半年总用电量",
              "全年用电量"
            ]
          ],
          "product": [
            [
              "月平均用电量",
              "月数",
              "该段总用电量"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "annual"
          ],
          "text": "上半年总用电量加下半年总用电量等于全年用电量.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "全年用电量",
            "left": "(12/2)*x+(12/2)*(x-2000)",
            "right": "150000"
          }
        ],
        "answers": [
          {
            "label": "上半年平均每月用电量",
            "expr": "13500",
            "unit": "千瓦时"
          }
        ],
        "steps": [
          "6x+6(x-2000)=150000",
          "12x-12000=150000",
          "12x=162000",
          "x=13500"
        ],
        "checks": [
          {
            "text": "下半年平均每月用电量",
            "expr": "13500-2000",
            "result": "11500"
          },
          {
            "text": "全年总用电量",
            "expr": "(12/2)*13500+(12/2)*11500",
            "result": "150000"
          }
        ],
        "conclusion": "上半年平均每月用电13500千瓦时，下半年为11500千瓦时，两段合计150000千瓦时.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      }
    ],
    "originalStem": "某工厂采取节能措施，去年下半年与上半年相比，月平均用电量减少2000kW·h（千瓦时），全年的用电量是150000kW·h.这个工厂去年上半年平均每月的用电量是多少？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        124,
        125
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  {
    "id": "PEP-P022",
    "collectionId": "P022",
    "title": "顺水与逆水的静水速度",
    "group": "行程问题",
    "source": "《数学 七年级上册》人教版，125、126页 · 例6",
    "sourceBook": "pep",
    "sourcePages": [
      125,
      126
    ],
    "sourcePdfPages": [
      132,
      133
    ],
    "kind": "linear",
    "stem": "一艘船从甲码头到乙码头顺水而行，用了2h；从乙码头返回甲码头逆水而行，用了2.5h.已知水流的速度是3km/h，求船在静水中的平均速度.",
    "tags": [
      "顺逆水",
      "速度合成",
      "同路程"
    ],
    "facts": [
      {
        "id": "downTime",
        "text": "从甲码头顺水到乙码头用了2小时",
        "kind": "given"
      },
      {
        "id": "upTime",
        "text": "从乙码头逆水返回甲码头用了2.5小时",
        "kind": "given"
      },
      {
        "id": "water",
        "text": "水流速度为3千米/小时",
        "kind": "given"
      },
      {
        "id": "speedRule",
        "text": "顺水速度等于静水速度加水流速度；逆水速度加水流速度等于静水速度",
        "kind": "property"
      },
      {
        "id": "sameTrip",
        "text": "按教材分析，往返沿同一航线，两个码头间的路程相等",
        "kind": "convention"
      }
    ],
    "routes": [
      {
        "id": "main",
        "label": "设船在静水中的平均速度为x",
        "variable": "x",
        "meaning": "船在静水中的平均速度",
        "unit": "千米/小时",
        "domain": "x>3，保证逆水速度为正",
        "derivations": [],
        "table": {
          "headers": [
            "航行方向",
            "静水速度/(千米/小时)",
            "实际速度/(千米/小时)",
            "时间/小时",
            "路程/千米"
          ],
          "rows": [
            {
              "label": "甲至乙顺水",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "x+3",
                  "sources": [
                    "unknown",
                    "water",
                    "speedRule"
                  ]
                },
                {
                  "expr": "2",
                  "sources": [
                    "downTime"
                  ],
                  "given": true
                },
                {
                  "expr": "2*(x+3)",
                  "sources": [
                    "unknown",
                    "water",
                    "speedRule",
                    "downTime"
                  ]
                }
              ]
            },
            {
              "label": "乙至甲逆水",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "x-3",
                  "sources": [
                    "unknown",
                    "water",
                    "speedRule"
                  ]
                },
                {
                  "expr": "2.5",
                  "sources": [
                    "upTime"
                  ],
                  "given": true
                },
                {
                  "expr": "2.5*(x-3)",
                  "sources": [
                    "unknown",
                    "water",
                    "speedRule",
                    "upTime"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "静水速度+水流速度=顺水速度",
            "逆水速度+水流速度=静水速度"
          ],
          "multiply": [
            "实际航行速度×航行时间=航行路程"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "静水速度",
              "水流速度",
              "顺水速度"
            ],
            [
              "逆水速度",
              "水流速度",
              "静水速度"
            ]
          ],
          "product": [
            [
              "实际航行速度",
              "航行时间",
              "航行路程"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "sameTrip"
          ],
          "text": "两个码头之间的往返路程相等.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "往返路程相等",
            "left": "2*(x+3)",
            "right": "2.5*(x-3)"
          }
        ],
        "answers": [
          {
            "label": "船在静水中的平均速度",
            "expr": "27",
            "unit": "千米/小时"
          }
        ],
        "steps": [
          "2(x+3)=2.5(x-3)",
          "2x+6=2.5x-7.5",
          "0.5x=13.5",
          "x=27"
        ],
        "checks": [
          {
            "text": "顺水路程",
            "expr": "2*(27+3)",
            "result": "60"
          },
          {
            "text": "逆水路程",
            "expr": "2.5*(27-3)",
            "result": "60"
          }
        ],
        "conclusion": "船在静水中的平均速度为27千米/小时.顺水、逆水行程均为60千米，逆水速度为正.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      }
    ],
    "originalStem": "一艘船从甲码头到乙码头顺水而行，用了2h；从乙码头返回甲码头逆水而行，用了2.5h.已知水流的速度是3km/h，求船在静水中的平均速度.",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        125,
        126
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  {
    "id": "PEP-P023",
    "collectionId": "P023",
    "title": "长方形改变长宽但面积不变",
    "group": "几何数量关系",
    "source": "《数学 七年级上册》人教版，126页 · 练习 第2题",
    "sourceBook": "pep",
    "sourcePages": [
      126
    ],
    "sourcePdfPages": [
      133
    ],
    "kind": "linear",
    "stem": "一个长方形的长减少2cm，宽增加2cm后，面积保持不变.已知这个长方形的长是6cm，求它的宽.",
    "tags": [
      "面积不变",
      "状态变化",
      "已知一边"
    ],
    "facts": [
      {
        "id": "length",
        "text": "原长方形的长为6厘米",
        "kind": "given"
      },
      {
        "id": "shorter",
        "text": "长减少2厘米",
        "kind": "given"
      },
      {
        "id": "wider",
        "text": "宽增加2厘米",
        "kind": "given"
      },
      {
        "id": "area",
        "text": "改变长宽后，面积保持不变",
        "kind": "given"
      },
      {
        "id": "formula",
        "text": "长方形的面积等于长乘宽",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "main",
        "label": "设原长方形的宽为x",
        "variable": "x",
        "meaning": "原长方形的宽",
        "unit": "厘米",
        "domain": "x>0",
        "derivations": [
          {
            "id": "newLength",
            "label": "改变后的长",
            "expr": "6-2",
            "result": "4",
            "sources": [
              "length",
              "shorter"
            ],
            "unit": "厘米",
            "explain": "长度4厘米由原长6厘米减去2厘米得到."
          }
        ],
        "table": {
          "headers": [
            "状态",
            "长/厘米",
            "宽/厘米",
            "面积/平方厘米"
          ],
          "rows": [
            {
              "label": "原长方形",
              "cells": [
                {
                  "expr": "6",
                  "sources": [
                    "length"
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
                  "expr": "6*x",
                  "sources": [
                    "length",
                    "unknown",
                    "formula"
                  ]
                }
              ]
            },
            {
              "label": "改变后",
              "cells": [
                {
                  "expr": "6-2",
                  "sources": [
                    "newLength"
                  ],
                  "given": true
                },
                {
                  "expr": "x+2",
                  "sources": [
                    "unknown",
                    "wider"
                  ]
                },
                {
                  "expr": "(6-2)*(x+2)",
                  "sources": [
                    "newLength",
                    "unknown",
                    "wider",
                    "formula"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "改变后的长+减少的长度=原来的长",
            "原来的宽+增加的宽度=改变后的宽"
          ],
          "multiply": [
            "长方形的长×长方形的宽=长方形的面积"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "改变后的长",
              "减少的长度",
              "原来的长"
            ],
            [
              "原来的宽",
              "增加的宽度",
              "改变后的宽"
            ]
          ],
          "product": [
            [
              "长方形的长",
              "长方形的宽",
              "长方形的面积"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "area"
          ],
          "text": "原长方形与改变后长方形的面积相等.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "两种状态面积相等",
            "left": "6*x",
            "right": "(6-2)*(x+2)"
          }
        ],
        "answers": [
          {
            "label": "原长方形的宽",
            "expr": "4",
            "unit": "厘米"
          }
        ],
        "steps": [
          "6x=(6-2)(x+2)",
          "6x=4x+8",
          "2x=8",
          "x=4"
        ],
        "checks": [
          {
            "text": "原面积",
            "expr": "6*4",
            "result": "24"
          },
          {
            "text": "改变后的面积",
            "expr": "(6-2)*(4+2)",
            "result": "24"
          }
        ],
        "conclusion": "原长方形的宽为4厘米.改变后长4厘米、宽6厘米，两种状态面积都为24平方厘米.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      }
    ],
    "originalStem": "一个长方形的长减少2cm，宽增加2cm后，面积保持不变.已知这个长方形的长是6cm，求它的宽.",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        126
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  {
    "id": "PEP-P025",
    "collectionId": "P025",
    "title": "汽车时刻表与沿途距离",
    "group": "行程问题",
    "source": "《数学 七年级上册》人教版，126、127页 · 正文 问题4；图5.2-1；表5.2-1",
    "sourceBook": "pep",
    "sourcePages": [
      126,
      127
    ],
    "sourcePdfPages": [
      133,
      134
    ],
    "kind": "linear",
    "stem": "翠湖在青山、绿水两地之间，距青山50千米，距绿水70千米.同一路线沿行驶方向依次为王家庄、青山、翠湖、绿水.一辆汽车当天匀速行驶，经过王家庄、青山、绿水的时刻分别为10:00、13:00、15:00.王家庄距翠湖有多远？还可以选择其他设元来列方程.",
    "tags": [
      "时刻与时间",
      "图表信息",
      "不同设元"
    ],
    "facts": [
      {
        "id": "order",
        "text": "同一路线沿行驶方向依次经过王家庄、青山、翠湖、绿水",
        "kind": "given"
      },
      {
        "id": "near",
        "text": "青山到翠湖为50千米",
        "kind": "given"
      },
      {
        "id": "far",
        "text": "翠湖到绿水为70千米",
        "kind": "given"
      },
      {
        "id": "kingTime",
        "text": "经过王家庄的时刻为10:00",
        "kind": "given"
      },
      {
        "id": "greenTime",
        "text": "经过青山的时刻为13:00",
        "kind": "given"
      },
      {
        "id": "waterTime",
        "text": "经过绿水的时刻为15:00",
        "kind": "given"
      },
      {
        "id": "uniform",
        "text": "汽车当天沿该路线匀速行驶，各路段的平均速度相同",
        "kind": "given"
      },
      {
        "id": "clock",
        "text": "同一天内用到达时刻减去出发时刻求经过时间，时刻的小时数相减得到小时数",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "distance",
        "label": "设王家庄到翠湖的路程为x",
        "variable": "x",
        "meaning": "王家庄到翠湖的路程",
        "unit": "千米",
        "domain": "x>50",
        "derivations": [
          {
            "id": "toGreenTime",
            "label": "王家庄至青山的经过时间",
            "expr": "13-10",
            "result": "3",
            "sources": [
              "kingTime",
              "greenTime",
              "clock"
            ],
            "unit": "小时",
            "explain": "同一天13:00减10:00，经过3小时."
          },
          {
            "id": "toWaterTime",
            "label": "王家庄至绿水的经过时间",
            "expr": "15-10",
            "result": "5",
            "sources": [
              "kingTime",
              "waterTime",
              "clock"
            ],
            "unit": "小时",
            "explain": "同一天15:00减10:00，经过5小时."
          }
        ],
        "table": {
          "headers": [
            "路段",
            "路程/千米",
            "经过时间/小时",
            "平均速度/(千米/小时)"
          ],
          "rows": [
            {
              "label": "王家庄至青山",
              "cells": [
                {
                  "expr": "x-50",
                  "sources": [
                    "unknown",
                    "near",
                    "order"
                  ]
                },
                {
                  "expr": "13-10",
                  "sources": [
                    "toGreenTime"
                  ],
                  "given": true
                },
                {
                  "expr": "(x-50)/(13-10)",
                  "sources": [
                    "unknown",
                    "near",
                    "order",
                    "toGreenTime"
                  ]
                }
              ]
            },
            {
              "label": "王家庄至绿水",
              "cells": [
                {
                  "expr": "x+70",
                  "sources": [
                    "unknown",
                    "far",
                    "order"
                  ]
                },
                {
                  "expr": "15-10",
                  "sources": [
                    "toWaterTime"
                  ],
                  "given": true
                },
                {
                  "expr": "(x+70)/(15-10)",
                  "sources": [
                    "unknown",
                    "far",
                    "order",
                    "toWaterTime"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "王家庄到青山路程+青山到翠湖路程=王家庄到翠湖路程",
            "王家庄到翠湖路程+翠湖到绿水路程=王家庄到绿水路程",
            "出发时刻+经过时间=到达时刻"
          ],
          "multiply": [
            "平均速度×经过时间=路程"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "王家庄到青山路程",
              "青山到翠湖路程",
              "王家庄到翠湖路程"
            ],
            [
              "王家庄到翠湖路程",
              "翠湖到绿水路程",
              "王家庄到绿水路程"
            ],
            [
              "出发时刻",
              "经过时间",
              "到达时刻"
            ]
          ],
          "product": [
            [
              "平均速度",
              "经过时间",
              "路程"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "uniform"
          ],
          "text": "匀速行驶使两个路段由路程除以时间得到的平均速度相同.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "两个路段的平均速度相等",
            "left": "(x-50)/(13-10)",
            "right": "(x+70)/(15-10)"
          }
        ],
        "answers": [
          {
            "label": "王家庄到翠湖的路程",
            "expr": "230",
            "unit": "千米"
          }
        ],
        "steps": [
          "(x-50)/3=(x+70)/5",
          "5(x-50)=3(x+70)",
          "2x=460",
          "x=230"
        ],
        "checks": [
          {
            "text": "王家庄至青山的平均速度",
            "expr": "(230-50)/(13-10)",
            "result": "60"
          },
          {
            "text": "王家庄至绿水的平均速度",
            "expr": "(230+70)/(15-10)",
            "result": "60"
          },
          {
            "text": "王家庄至翠湖路程",
            "expr": "(13-10)*60+50",
            "result": "230"
          }
        ],
        "conclusion": "王家庄距翠湖230千米.两个路段的速度均为60千米/小时.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      },
      {
        "id": "speed",
        "label": "设汽车的平均速度为x",
        "variable": "x",
        "meaning": "汽车的匀速行驶速度",
        "unit": "千米/小时",
        "domain": "x>0",
        "derivations": [
          {
            "id": "betweenTime",
            "label": "青山至绿水的经过时间",
            "expr": "15-13",
            "result": "2",
            "sources": [
              "greenTime",
              "waterTime",
              "clock"
            ],
            "unit": "小时",
            "explain": "两地所记时刻均为当天整点，直接相减得到间隔."
          },
          {
            "id": "firstTime",
            "label": "王家庄至青山的经过时间",
            "expr": "13-10",
            "result": "3",
            "sources": [
              "kingTime",
              "greenTime",
              "clock"
            ],
            "unit": "小时",
            "explain": "用13:00减10:00得到3小时."
          }
        ],
        "table": {
          "headers": [
            "路段",
            "速度/(千米/小时)",
            "经过时间/小时",
            "路程/千米"
          ],
          "rows": [
            {
              "label": "青山至绿水",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "uniform"
                  ],
                  "given": true
                },
                {
                  "expr": "15-13",
                  "sources": [
                    "betweenTime"
                  ],
                  "given": true
                },
                {
                  "expr": "50+70",
                  "sources": [
                    "near",
                    "far",
                    "order"
                  ]
                }
              ]
            },
            {
              "label": "王家庄至青山",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "uniform"
                  ],
                  "given": true
                },
                {
                  "expr": "13-10",
                  "sources": [
                    "firstTime"
                  ],
                  "given": true
                },
                {
                  "expr": "(13-10)*x",
                  "sources": [
                    "firstTime",
                    "unknown",
                    "uniform"
                  ]
                }
              ]
            },
            {
              "label": "王家庄至翠湖",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "uniform"
                  ],
                  "given": true
                },
                {
                  "note": "本步不必计算"
                },
                {
                  "expr": "(13-10)*x+50",
                  "sources": [
                    "firstTime",
                    "unknown",
                    "uniform",
                    "near",
                    "order"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "青山到翠湖路程+翠湖到绿水路程=青山到绿水路程",
            "王家庄到青山路程+青山到翠湖路程=王家庄到翠湖路程",
            "出发时刻+经过时间=到达时刻"
          ],
          "multiply": [
            "平均速度×经过时间=路程"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "青山到翠湖路程",
              "翠湖到绿水路程",
              "青山到绿水路程"
            ],
            [
              "王家庄到青山路程",
              "青山到翠湖路程",
              "王家庄到翠湖路程"
            ],
            [
              "出发时刻",
              "经过时间",
              "到达时刻"
            ]
          ],
          "product": [
            [
              "平均速度",
              "经过时间",
              "路程"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "near",
            "far"
          ],
          "text": "青山到绿水的路程由图中两段路程相加得到，也应等于速度乘经过时间.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "青山至绿水的同一路程",
            "left": "(15-13)*x",
            "right": "50+70"
          }
        ],
        "answers": [
          {
            "label": "汽车的平均速度（设元值）",
            "expr": "60",
            "unit": "千米/小时"
          },
          {
            "label": "王家庄到翠湖的路程",
            "expr": "230",
            "unit": "千米"
          }
        ],
        "steps": [
          "(15-13)x=50+70",
          "2x=120",
          "x=60",
          "(13-10)×60+50=230"
        ],
        "checks": [
          {
            "text": "青山至绿水的路程",
            "expr": "(15-13)*60",
            "result": "120"
          },
          {
            "text": "图中青山至绿水的两段合计",
            "expr": "50+70",
            "result": "120"
          },
          {
            "text": "王家庄至翠湖的路程",
            "expr": "(13-10)*60+50",
            "result": "230"
          }
        ],
        "conclusion": "汽车速度为60千米/小时，由王家庄先行至青山，再加50千米，得到到翠湖共230千米.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      }
    ],
    "sourceTable": {
      "caption": "原书表5.2-1：汽车经过各地的时刻",
      "headers": [
        "地名",
        "王家庄",
        "青山",
        "绿水"
      ],
      "rows": [
        [
          "时间",
          "10:00",
          "13:00",
          "15:00"
        ]
      ]
    },
    "originalStem": "如图5.2-1，翠湖在青山、绿水两地之间，距青山50km，距绿水70km.某天，一辆汽车匀速行驶，途经王家庄、青山、绿水三地的时间如表5.2-1所示.王家庄距翠湖的路程有多远？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        126,
        127
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    },
    "sourceFigure": {
      "file": "figures/route-stations.svg",
      "alt": "图5.2-1：王家庄、青山、翠湖、绿水的位置"
    }
  },
  {
    "id": "PEP-P031",
    "collectionId": "P031",
    "title": "从数字关系求两位数",
    "group": "数字与规律",
    "source": "《数学 七年级上册》人教版，130页 · 习题5.2 综合运用 第8题",
    "sourceBook": "pep",
    "sourcePages": [
      130
    ],
    "sourcePdfPages": [
      137
    ],
    "kind": "linear",
    "stem": "一个两位数的个位上数字的3倍加1是十位上的数字，个位上的数字与十位上数字的和等于9.这个两位数是多少？",
    "tags": [
      "数字和",
      "倍数与差量",
      "位值"
    ],
    "facts": [
      {
        "id": "digitRule",
        "text": "个位数字的3倍加1等于十位数字",
        "kind": "given"
      },
      {
        "id": "digitSum",
        "text": "个位数字与十位数字的和为9",
        "kind": "given"
      },
      {
        "id": "place",
        "text": "十位的位值是10，个位的位值是1",
        "kind": "property"
      },
      {
        "id": "range",
        "text": "个位数字是0至9的整数，十位数字是1至9的整数",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "main",
        "label": "设个位数字为x",
        "variable": "x",
        "meaning": "个位数字",
        "unit": "",
        "domain": "x是0至9的整数，3x+1是1至9的整数",
        "derivations": [],
        "table": {
          "headers": [
            "数位或整体",
            "该位数字",
            "位值",
            "表示的数值"
          ],
          "rows": [
            {
              "label": "个位",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "1",
                  "sources": [
                    "place"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "十位",
              "cells": [
                {
                  "expr": "3*x+1",
                  "sources": [
                    "digitRule",
                    "unknown"
                  ]
                },
                {
                  "expr": "10",
                  "sources": [
                    "place"
                  ],
                  "given": true
                },
                {
                  "expr": "10*(3*x+1)",
                  "sources": [
                    "digitRule",
                    "unknown",
                    "place"
                  ]
                }
              ]
            },
            {
              "label": "整个两位数",
              "cells": [
                {
                  "note": "并非新的数位"
                },
                {
                  "note": "不相加"
                },
                {
                  "expr": "10*(3*x+1)+x",
                  "sources": [
                    "digitRule",
                    "unknown",
                    "place"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "个位数字的3倍+增加数1=十位数字",
            "个位数字+十位数字=两位数字之和",
            "十位表示的数值+个位表示的数值=整个两位数"
          ],
          "multiply": [
            "个位数字×数字比较倍数=个位数字的3倍",
            "十位数字×十位位值=十位表示的数值"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "个位数字的3倍",
              "增加数1",
              "十位数字"
            ],
            [
              "个位数字",
              "十位数字",
              "两位数字之和"
            ],
            [
              "十位表示的数值",
              "个位表示的数值",
              "整个两位数"
            ]
          ],
          "product": [
            [
              "个位数字",
              "数字比较倍数",
              "个位数字的3倍"
            ],
            [
              "十位数字",
              "十位位值",
              "十位表示的数值"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "digitSum"
          ],
          "text": "两位上的数字相加为9；这里相加的是数字，不是其位值所表示的数.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "个位数字加十位数字",
            "left": "x+(3*x+1)",
            "right": "9"
          }
        ],
        "answers": [
          {
            "label": "个位数字（设元值）",
            "expr": "2",
            "unit": ""
          },
          {
            "label": "这个两位数",
            "expr": "72",
            "unit": ""
          }
        ],
        "steps": [
          "x+(3x+1)=9",
          "4x=8",
          "x=2",
          "3×2+1=7",
          "10×7+2=72"
        ],
        "checks": [
          {
            "text": "由个位数字得到十位数字",
            "expr": "3*2+1",
            "result": "7"
          },
          {
            "text": "两位数字之和",
            "expr": "2+7",
            "result": "9"
          },
          {
            "text": "组成的两位数",
            "expr": "10*7+2",
            "result": "72"
          }
        ],
        "conclusion": "个位是2，十位是7，所以这个两位数是72.两个数字都在允许的范围内.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      }
    ],
    "originalStem": "一个两位数的个位上数字的3倍加1是十位上的数字，个位上的数字与十位上数字的和等于9.这个两位数是多少？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        130
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  {
    "id": "PEP-P032",
    "collectionId": "P032",
    "title": "三种灌溉方式的用水量",
    "group": "比例与百分数",
    "source": "《数学 七年级上册》人教版，130、131页 · 习题5.2 综合运用 第9题",
    "sourceBook": "pep",
    "sourcePages": [
      130,
      131
    ],
    "sourcePdfPages": [
      137,
      138
    ],
    "kind": "linear",
    "stem": "随着农业技术的现代化，节水型灌溉得到逐步推广.喷灌和滴灌是比漫灌节水的灌溉方式.灌溉三块同样大的田地，第一块用漫灌方式，第二块用喷灌方式，第三块用滴灌方式.后两种方式的用水量分别是漫灌的25%和15%.（1）设漫灌田地用水x吨，用含x的式子表示另两块田地的用水量.（2）如果三块田地共用水420吨，分别用水多少吨？",
    "tags": [
      "百分数基准",
      "三个部分",
      "节水"
    ],
    "facts": [
      {
        "id": "fields",
        "text": "灌溉3块同样大的田地，分别使用漫灌、喷灌和滴灌",
        "kind": "given"
      },
      {
        "id": "spray",
        "text": "喷灌用水量是漫灌用水量的25%",
        "kind": "given"
      },
      {
        "id": "drip",
        "text": "滴灌用水量是漫灌用水量的15%",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "三块田地共用水420吨",
        "kind": "given"
      },
      {
        "id": "base",
        "text": "一个量与自身比较时，所占比例为1",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "main",
        "label": "设第一块田地即漫灌田地的用水量为x",
        "variable": "x",
        "meaning": "第一块田地即漫灌田地的用水量",
        "unit": "吨",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "灌溉方式",
            "相对漫灌用水量的比例",
            "用水量/吨"
          ],
          "rows": [
            {
              "label": "漫灌",
              "cells": [
                {
                  "expr": "1",
                  "sources": [
                    "base"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "喷灌",
              "cells": [
                {
                  "expr": "25%",
                  "sources": [
                    "spray"
                  ],
                  "given": true
                },
                {
                  "expr": "25%*x",
                  "sources": [
                    "spray",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "滴灌",
              "cells": [
                {
                  "expr": "15%",
                  "sources": [
                    "drip"
                  ],
                  "given": true
                },
                {
                  "expr": "15%*x",
                  "sources": [
                    "drip",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "三块合计",
              "cells": [
                {
                  "note": "本步无需计算合计比例"
                },
                {
                  "expr": "420",
                  "sources": [
                    "total"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "漫灌用水量+喷灌用水量=前两块用水量",
            "前两块用水量+滴灌用水量=三块总用水量"
          ],
          "multiply": [
            "漫灌用水量×对应方式占漫灌的比例=对应方式用水量"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "漫灌用水量",
              "喷灌用水量",
              "前两块用水量"
            ],
            [
              "前两块用水量",
              "滴灌用水量",
              "三块总用水量"
            ]
          ],
          "product": [
            [
              "漫灌用水量",
              "对应方式占漫灌的比例",
              "对应方式用水量"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "漫灌、喷灌和滴灌的用水量合计为420吨.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "三块田地的总用水量",
            "left": "x+25%*x+15%*x",
            "right": "420"
          }
        ],
        "answers": [
          {
            "label": "漫灌田地用水量",
            "expr": "300",
            "unit": "吨"
          },
          {
            "label": "喷灌田地用水量",
            "expr": "75",
            "unit": "吨"
          },
          {
            "label": "滴灌田地用水量",
            "expr": "45",
            "unit": "吨"
          }
        ],
        "steps": [
          "x+25%x+15%x=420",
          "(1+25%+15%)x=420",
          "1.4x=420",
          "x=300",
          "25%×300=75",
          "15%×300=45"
        ],
        "checks": [
          {
            "text": "喷灌占漫灌的比例",
            "expr": "75/300",
            "result": "25%"
          },
          {
            "text": "滴灌占漫灌的比例",
            "expr": "45/300",
            "result": "15%"
          },
          {
            "text": "三块田地用水合计",
            "expr": "300+75+45",
            "result": "420"
          }
        ],
        "conclusion": "漫灌、喷灌、滴灌的用水量分别为300吨、75吨、45吨.25%和15%是用水量占比，不能读成节约的百分比.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      }
    ],
    "originalStem": "随着农业技术的现代化，节水型灌溉得到逐步推广.喷灌和滴灌是比漫灌节水的灌溉方式.灌溉三块同样大的田地，第一块用漫灌方式，第二块用喷灌方式，第三块用滴灌方式.后两种方式的用水量分别是漫灌的25%和15%.\n(1)设第一块田地用水x t，则另两块田地的用水量各如何表示？\n(2)如果三块田地共用水420t，三块田地各用水多少吨？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        130,
        131
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  },
  {
    "id": "PEP-P035",
    "collectionId": "P035",
    "title": "两车相向行驶的速度差",
    "group": "行程问题",
    "source": "《数学 七年级上册》人教版，131页 · 习题5.2 综合运用 第12题",
    "sourceBook": "pep",
    "sourcePages": [
      131
    ],
    "sourcePdfPages": [
      138
    ],
    "kind": "linear",
    "stem": "两辆汽车从相距84km的两地同时出发相向而行，甲车的速度比乙车的速度快20km/h，半小时后两车相遇.两车的速度各是多少？",
    "tags": [
      "相遇",
      "速度差",
      "时间单位"
    ],
    "facts": [
      {
        "id": "distance",
        "text": "甲乙两车从相距84千米的两地同时相向出发",
        "kind": "given"
      },
      {
        "id": "gap",
        "text": "甲车速度比乙车快20千米/小时",
        "kind": "given"
      },
      {
        "id": "time",
        "text": "两车经过半小时相遇",
        "kind": "given"
      },
      {
        "id": "half",
        "text": "1小时平均分为2份，每份为半小时",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "main",
        "label": "设乙车的速度为x",
        "variable": "x",
        "meaning": "乙车的速度",
        "unit": "千米/小时",
        "domain": "x>0",
        "derivations": [
          {
            "id": "halfHour",
            "label": "半小时换算成小时数",
            "expr": "1/2",
            "result": "0.5",
            "sources": [
              "time",
              "half"
            ],
            "unit": "小时",
            "explain": "半小时是1小时的一半，即1÷2=0.5小时."
          }
        ],
        "table": {
          "headers": [
            "汽车",
            "速度/(千米/小时)",
            "行驶时间/小时",
            "行驶路程/千米"
          ],
          "rows": [
            {
              "label": "甲车",
              "cells": [
                {
                  "expr": "x+20",
                  "sources": [
                    "unknown",
                    "gap"
                  ]
                },
                {
                  "expr": "1/2",
                  "sources": [
                    "halfHour"
                  ],
                  "given": true
                },
                {
                  "expr": "(x+20)*(1/2)",
                  "sources": [
                    "unknown",
                    "gap",
                    "halfHour"
                  ]
                }
              ]
            },
            {
              "label": "乙车",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "1/2",
                  "sources": [
                    "halfHour"
                  ],
                  "given": true
                },
                {
                  "expr": "x*(1/2)",
                  "sources": [
                    "unknown",
                    "halfHour"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "本表不填写速度合计"
                },
                {
                  "note": "共同经过的时间不相加"
                },
                {
                  "expr": "84",
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
            "乙车速度+速度差=甲车速度",
            "甲车路程+乙车路程=两地距离"
          ],
          "multiply": [
            "汽车速度×行驶时间=行驶路程"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "乙车速度",
              "速度差",
              "甲车速度"
            ],
            [
              "甲车路程",
              "乙车路程",
              "两地距离"
            ]
          ],
          "product": [
            [
              "汽车速度",
              "行驶时间",
              "行驶路程"
            ]
          ],
          "notes": []
        },
        "closure": {
          "sources": [
            "distance"
          ],
          "text": "从两端相向出发并相遇时，两车路程的和等于两地距离84千米.",
          "hint": "根据表内表达式，找出尚须满足的那条独立条件."
        },
        "equations": [
          {
            "label": "相遇路程之和",
            "left": "(x+20)*(1/2)+x*(1/2)",
            "right": "84"
          }
        ],
        "answers": [
          {
            "label": "乙车速度",
            "expr": "74",
            "unit": "千米/小时"
          },
          {
            "label": "甲车速度",
            "expr": "94",
            "unit": "千米/小时"
          }
        ],
        "steps": [
          "(x+20)×(1/2)+x×(1/2)=84",
          "x+10=84",
          "x=74",
          "74+20=94"
        ],
        "checks": [
          {
            "text": "两车速度差",
            "expr": "94-74",
            "result": "20"
          },
          {
            "text": "半小时内两车路程合计",
            "expr": "94*(1/2)+74*(1/2)",
            "result": "84"
          }
        ],
        "conclusion": "乙车速度为74千米/小时，甲车速度为94千米/小时；半小时分别行驶37千米和47千米，合计84千米.",
        "verdict": {
          "correct": "valid",
          "prompt": "求得的结果是否符合所有原条件和实际范围？",
          "explain": "把结果代回原条件，并核对单位、范围以及题目真正所求."
        }
      }
    ],
    "originalStem": "两辆汽车从相距84km的两地同时出发相向而行，甲车的速度比乙车的速度快20km/h，半小时后两车相遇.两车的速度各是多少？",
    "sourceTranscription": {
      "book": "人教版七上",
      "pages": [
        131
      ],
      "method": "原页核验，保留原题文字和小问，句号统一英文."
    }
  }
];
  if(typeof module==='object'&&module.exports)module.exports=data;
  else root.RatioWordProblemsData=(root.RatioWordProblemsData||[]).concat(data);
})(typeof window==='undefined'?globalThis:window);
