/* Verified supplementary problems from the uploaded 2021.12 chapter handout. */
(function(root){
const data=[
  {
    "id": "C21-01",
    "title": "不同付款金额与找零倍数",
    "group": "总价与数量",
    "kind": "linear",
    "stem": "甲、乙两人分别用面值为20元和10元的人民币购买一本同样的书，甲找回的钱是乙找回钱的6倍.设这本书的价格为x元，可得方程________.",
    "originalStem": "甲、乙两人分别用面值为20元和10元的人民币购买一本同样的书，甲找回的钱是乙找回钱的6倍.设这本书的价格为x元，可得方程________.",
    "source": "《第四章 用一元一次方程解决问题》资料，第3页 · 4.1习题5",
    "sourceCollectionId": "chapter2021-01",
    "facts": [
      {
        "id": "a",
        "text": "甲用20元买书.",
        "kind": "given"
      },
      {
        "id": "b",
        "text": "乙用10元购买一本同样的书.",
        "kind": "given"
      },
      {
        "id": "ratio",
        "text": "甲找回的钱是乙找回钱的6倍.",
        "kind": "given"
      },
      {
        "id": "pay",
        "text": "每人的付款金额等于相同的书价加找回金额.",
        "kind": "property",
        "numericBlanks": false
      }
    ],
    "routes": [
      {
        "id": "price",
        "label": "设书价为x元",
        "variable": "x",
        "meaning": "这本书的价格",
        "unit": "元",
        "domain": "0<x<10",
        "derivations": [],
        "table": {
          "headers": [
            "购书人",
            "付款/元",
            "书价/元",
            "找回金额/元"
          ],
          "rows": [
            {
              "label": "甲",
              "cells": [
                {
                  "expr": "20",
                  "sources": [
                    "a"
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
                  "expr": "20-x",
                  "sources": [
                    "a",
                    "pay",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "乙",
              "cells": [
                {
                  "expr": "10",
                  "sources": [
                    "b"
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
                  "expr": "10-x",
                  "sources": [
                    "b",
                    "pay",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "甲找零是乙的6倍",
            "left": "20-x",
            "right": "6*(10-x)",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "书价",
            "expr": "8",
            "unit": "元"
          }
        ],
        "checks": [
          {
            "text": "甲找零",
            "expr": "20-8",
            "result": "12"
          },
          {
            "text": "乙找零",
            "expr": "10-8",
            "result": "2"
          },
          {
            "text": "找零倍数",
            "expr": "12/2",
            "result": "6"
          }
        ],
        "steps": [
          "20-x=6(10-x)",
          "5x=40",
          "x=8"
        ],
        "closure": {
          "text": "还需满足甲找零是乙找零的6倍.",
          "sources": [
            "ratio"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "书价",
              "甲找回金额",
              "甲付款金额"
            ],
            [
              "书价",
              "乙找回金额",
              "乙付款金额"
            ]
          ],
          "product": [
            [
              "乙找回金额",
              "找零倍数",
              "甲找回金额"
            ]
          ]
        },
        "relations": {
          "add": [
            "书价+甲找回金额=甲付款金额",
            "书价+乙找回金额=乙付款金额"
          ],
          "multiply": [
            "乙找回金额×找零倍数=甲找回金额"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        }
      },
      {
        "id": "change",
        "label": "设乙找回x元",
        "variable": "x",
        "meaning": "乙找回的金额",
        "unit": "元",
        "domain": "0<x<10",
        "derivations": [],
        "table": {
          "headers": [
            "购书人",
            "付款/元",
            "找回金额/元",
            "按找零求书价/元"
          ],
          "rows": [
            {
              "label": "乙",
              "cells": [
                {
                  "expr": "10",
                  "sources": [
                    "b"
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
                  "expr": "10-x",
                  "sources": [
                    "b",
                    "unknown",
                    "pay"
                  ]
                }
              ]
            },
            {
              "label": "甲",
              "cells": [
                {
                  "expr": "20",
                  "sources": [
                    "a"
                  ],
                  "given": true
                },
                {
                  "expr": "6*x",
                  "sources": [
                    "ratio",
                    "unknown"
                  ]
                },
                {
                  "expr": "20-6*x",
                  "sources": [
                    "a",
                    "ratio",
                    "unknown",
                    "pay"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "两人购买同样书的价格相等",
            "left": "10-x",
            "right": "20-6*x",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "乙找回金额",
            "expr": "2",
            "unit": "元"
          },
          {
            "label": "书价",
            "expr": "8",
            "unit": "元"
          }
        ],
        "checks": [
          {
            "text": "两人的书价之差",
            "expr": "(20-6*2)-(10-2)",
            "result": "0"
          },
          {
            "text": "甲找零与乙找零的比",
            "expr": "(6*2)/2",
            "result": "6"
          }
        ],
        "steps": [
          "10-x=20-6x",
          "5x=10",
          "x=2",
          "10-2=8"
        ],
        "closure": {
          "text": "找零倍数用于填表，剩下的条件是两本相同的书价格相等.",
          "sources": [
            "pay"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "书价",
              "甲找回金额",
              "甲付款金额"
            ],
            [
              "书价",
              "乙找回金额",
              "乙付款金额"
            ]
          ],
          "product": [
            [
              "乙找回金额",
              "找零倍数",
              "甲找回金额"
            ]
          ]
        },
        "relations": {
          "add": [
            "书价+甲找回金额=甲付款金额",
            "书价+乙找回金额=乙付款金额"
          ],
          "multiply": [
            "乙找回金额×找零倍数=甲找回金额"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        }
      }
    ],
    "contentRevision": 1,
    "tags": [
      "补充练习",
        "总价与数量"
    ],
    "sourceAudit": {
      "pdfPage": 3,
      "location": "4.1习题5",
      "originalVerified": true,
      "methodReview": "已检查不同设元与表格组织，保留量义或列式依据不同的自然方案，纯字母改名不另列."
    }
  },
  {
    "id": "C21-02",
    "title": "调组后人数成两倍",
    "group": "调配与盈不足",
    "kind": "linear",
    "stem": "某班学生分两组参加植树活动，甲组有17人，乙组有25人，后来由于需要，又从甲组抽调了部分同学去乙组，结果乙组人数是甲组的2倍.问从甲组抽调了多少人去乙组？",
    "originalStem": "某班学生分两组参加植树活动，甲组有17人，乙组有25人，后来由于需要，又从甲组抽调了部分同学去乙组，结果乙组人数是甲组的2倍.问从甲组抽调了多少人去乙组？",
    "source": "《第四章 用一元一次方程解决问题》资料，第5页 · 4.3（1）问题3",
    "sourceCollectionId": "chapter2021-02",
    "facts": [
      {
        "id": "a",
        "text": "甲组原有17人.",
        "kind": "given"
      },
      {
        "id": "b",
        "text": "乙组原有25人.",
        "kind": "given"
      },
      {
        "id": "move",
        "text": "从甲组抽调部分同学去乙组.",
        "kind": "given"
      },
      {
        "id": "ratio",
        "text": "调整后乙组人数是甲组的2倍.",
        "kind": "given"
      },
      {
        "id": "people",
        "text": "人数与抽调人数均为非负整数；调出与调入的是同一批同学.",
        "kind": "property",
        "numericBlanks": false
      }
    ],
    "routes": [
      {
        "id": "transfer",
        "label": "设从甲组抽调x人",
        "variable": "x",
        "meaning": "从甲组调到乙组的人数",
        "unit": "人",
        "domain": "x为整数，0≤x≤17",
        "derivations": [],
        "table": {
          "headers": [
            "小组",
            "原有人数/人",
            "抽调人数/人",
            "现有人数/人"
          ],
          "rows": [
            {
              "label": "甲组",
              "cells": [
                {
                  "expr": "17",
                  "sources": [
                    "a"
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
                  "expr": "17-x",
                  "sources": [
                    "a",
                    "move",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "乙组",
              "cells": [
                {
                  "expr": "25",
                  "sources": [
                    "b"
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
                  "expr": "25+x",
                  "sources": [
                    "b",
                    "move",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "现乙组是现甲组的2倍",
            "left": "25+x",
            "right": "2*(17-x)",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "抽调人数",
            "expr": "3",
            "unit": "人"
          }
        ],
        "checks": [
          {
            "text": "甲组现人数",
            "expr": "17-3",
            "result": "14"
          },
          {
            "text": "乙组现人数",
            "expr": "25+3",
            "result": "28"
          },
          {
            "text": "现乙组与现甲组倍数",
            "expr": "28/14",
            "result": "2"
          }
        ],
        "steps": [
          "25+x=2(17-x)",
          "3x=9",
          "x=3"
        ],
        "closure": {
          "text": "调出、调入关系已用于填表，用调整后的2倍关系列方程.",
          "sources": [
            "ratio"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "甲组现有人数",
              "抽调人数",
              "甲组原有人数"
            ],
            [
              "乙组原有人数",
              "抽调人数",
              "乙组现有人数"
            ]
          ],
          "product": [
            [
              "甲组现有人数",
              "人数倍数",
              "乙组现有人数"
            ]
          ]
        },
        "relations": {
          "add": [
            "甲组现有人数+抽调人数=甲组原有人数",
            "乙组原有人数+抽调人数=乙组现有人数"
          ],
          "multiply": [
            "甲组现有人数×人数倍数=乙组现有人数"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        },
        "tableNote": "参考原资料第5页的“原有—抽调—现有”表；调入乙组与调出甲组为同一个人数."
      },
      {
        "id": "remaining-a",
        "label": "设调整后甲组有x人",
        "variable": "x",
        "meaning": "调整后甲组人数",
        "unit": "人",
        "domain": "x为整数，0<x≤17",
        "derivations": [],
        "table": {
          "headers": [
            "小组",
            "原有人数/人",
            "抽调人数/人",
            "现有人数/人"
          ],
          "rows": [
            {
              "label": "甲组",
              "cells": [
                {
                  "expr": "17",
                  "sources": [
                    "a"
                  ],
                  "given": true
                },
                {
                  "expr": "17-x",
                  "sources": [
                    "a",
                    "unknown",
                    "move"
                  ]
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
              "label": "乙组",
              "cells": [
                {
                  "expr": "25",
                  "sources": [
                    "b"
                  ],
                  "given": true
                },
                {
                  "expr": "17-x",
                  "sources": [
                    "a",
                    "unknown",
                    "move"
                  ]
                },
                {
                  "expr": "2*x",
                  "sources": [
                    "ratio",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "乙组原有人数加调入人数等于现有人数",
            "left": "25+(17-x)",
            "right": "2*x",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "调整后甲组人数",
            "expr": "14",
            "unit": "人"
          },
          {
            "label": "抽调人数",
            "expr": "3",
            "unit": "人"
          }
        ],
        "checks": [
          {
            "text": "从甲组抽调人数",
            "expr": "17-14",
            "result": "3"
          },
          {
            "text": "乙组调整后的两种表示之差",
            "expr": "25+3-2*14",
            "result": "0"
          }
        ],
        "steps": [
          "25+(17-x)=2x",
          "3x=42",
          "x=14",
          "17-14=3"
        ],
        "closure": {
          "text": "倍数关系用于填写现人数，列式改用乙组“原有＋调入＝现有”.",
          "sources": [
            "b",
            "move"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "甲组现有人数",
              "抽调人数",
              "甲组原有人数"
            ],
            [
              "乙组原有人数",
              "抽调人数",
              "乙组现有人数"
            ]
          ],
          "product": [
            [
              "甲组现有人数",
              "人数倍数",
              "乙组现有人数"
            ]
          ]
        },
        "relations": {
          "add": [
            "甲组现有人数+抽调人数=甲组原有人数",
            "乙组原有人数+抽调人数=乙组现有人数"
          ],
          "multiply": [
            "甲组现有人数×人数倍数=乙组现有人数"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        }
      }
    ],
    "contentRevision": 1,
    "tags": [
      "补充练习",
        "调配与盈不足"
    ],
    "sourceAudit": {
      "pdfPage": 5,
      "location": "4.3（1）问题3",
      "originalVerified": true,
      "methodReview": "已检查不同设元与表格组织，保留量义或列式依据不同的自然方案，纯字母改名不另列."
    }
  },
  {
    "id": "C21-03",
    "title": "小麦和玉米分别超产",
    "group": "增长、利润与含量",
    "kind": "linear",
    "stem": "“种粮补贴”惠农政策的出台，大大激发了农民的种粮的积极性，某粮食生产专业户去年计划生产小麦和玉米共18t，实际生产了20t，其中小麦超产12%，玉米超产10%，该专业户去年实际生产小麦、玉米各多少吨？",
    "originalStem": "“种粮补贴”惠农政策的出台，大大激发了农民的种粮的积极性，某粮食生产专业户去年计划生产小麦和玉米共18t，实际生产了20t，其中小麦超产12%，玉米超产10%，该专业户去年实际生产小麦、玉米各多少吨？",
    "source": "《第四章 用一元一次方程解决问题》资料，第10页 · 4.3（2）问题3",
    "sourceCollectionId": "chapter2021-03",
    "facts": [
      {
        "id": "plan",
        "text": "去年计划生产小麦和玉米共18吨.",
        "kind": "given"
      },
      {
        "id": "actual",
        "text": "实际生产了20吨.",
        "kind": "given"
      },
      {
        "id": "wheat",
        "text": "小麦超产12%.",
        "kind": "given"
      },
      {
        "id": "corn",
        "text": "玉米超产10%.",
        "kind": "given"
      },
      {
        "id": "base",
        "text": "超产率以各自计划产量为基准；实际产量等于计划产量的1份加超产部分.",
        "kind": "property",
        "numericBlanks": false
      }
    ],
    "routes": [
      {
        "id": "planned-wheat",
        "label": "设计划小麦产量为x吨",
        "variable": "x",
        "meaning": "计划生产的小麦产量",
        "unit": "吨",
        "domain": "0<x<18",
        "derivations": [],
        "table": {
          "headers": [
            "作物",
            "计划产量/吨",
            "超产量/吨",
            "实际产量/吨"
          ],
          "rows": [
            {
              "label": "小麦",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "12%*x",
                  "sources": [
                    "wheat",
                    "unknown"
                  ]
                },
                {
                  "expr": "x+12%*x",
                  "sources": [
                    "wheat",
                    "unknown",
                    "base"
                  ]
                }
              ]
            },
            {
              "label": "玉米",
              "cells": [
                {
                  "expr": "18-x",
                  "sources": [
                    "plan",
                    "unknown"
                  ]
                },
                {
                  "expr": "10%*(18-x)",
                  "sources": [
                    "plan",
                    "corn",
                    "unknown"
                  ]
                },
                {
                  "expr": "(18-x)+10%*(18-x)",
                  "sources": [
                    "plan",
                    "corn",
                    "unknown",
                    "base"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "expr": "18",
                  "sources": [
                    "plan"
                  ],
                  "given": true
                },
                {
                  "expr": "20-18",
                  "sources": [
                    "actual",
                    "plan"
                  ]
                },
                {
                  "expr": "20",
                  "sources": [
                    "actual"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "实际两种产量合计20吨",
            "left": "x+12%*x+(18-x)+10%*(18-x)",
            "right": "20",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "计划小麦产量",
            "expr": "10",
            "unit": "吨"
          },
          {
            "label": "实际小麦产量",
            "expr": "11.2",
            "unit": "吨"
          },
          {
            "label": "实际玉米产量",
            "expr": "8.8",
            "unit": "吨"
          }
        ],
        "checks": [
          {
            "text": "实际产量合计",
            "expr": "11.2+8.8",
            "result": "20"
          },
          {
            "text": "计划产量合计",
            "expr": "11.2/(1+12%)+8.8/(1+10%)",
            "result": "18"
          }
        ],
        "steps": [
          "x+0.12x+(18-x)+0.1(18-x)=20",
          "0.02x=0.2",
          "x=10",
          "10(1+12%)=11.2",
          "8(1+10%)=8.8"
        ],
        "closure": {
          "text": "计划总量已用于填表，尚需满足实际总量20吨.",
          "sources": [
            "actual"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "小麦计划产量",
              "玉米计划产量",
              "总计划产量"
            ],
            [
              "小麦实际产量",
              "玉米实际产量",
              "总实际产量"
            ],
            [
              "计划产量",
              "超产量",
              "实际产量"
            ]
          ],
          "product": [
            [
              "计划产量",
              "超产率",
              "超产量"
            ]
          ]
        },
        "relations": {
          "add": [
            "小麦计划产量+玉米计划产量=总计划产量",
            "小麦实际产量+玉米实际产量=总实际产量",
            "计划产量+超产量=实际产量"
          ],
          "multiply": [
            "计划产量×超产率=超产量"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        }
      },
      {
        "id": "actual-wheat",
        "label": "设实际小麦产量为x吨",
        "variable": "x",
        "meaning": "实际小麦产量",
        "unit": "吨",
        "domain": "0<x<20",
        "derivations": [],
        "table": {
          "headers": [
            "作物",
            "实际产量/吨",
            "计划产量/吨",
            "超产量/吨"
          ],
          "rows": [
            {
              "label": "小麦",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "x/(1+12%)",
                  "sources": [
                    "wheat",
                    "base",
                    "unknown"
                  ]
                },
                {
                  "expr": "x-x/(1+12%)",
                  "sources": [
                    "wheat",
                    "base",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "玉米",
              "cells": [
                {
                  "expr": "20-x",
                  "sources": [
                    "actual",
                    "unknown"
                  ]
                },
                {
                  "expr": "(20-x)/(1+10%)",
                  "sources": [
                    "actual",
                    "corn",
                    "base",
                    "unknown"
                  ]
                },
                {
                  "expr": "(20-x)-(20-x)/(1+10%)",
                  "sources": [
                    "actual",
                    "corn",
                    "base",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "expr": "20",
                  "sources": [
                    "actual"
                  ],
                  "given": true
                },
                {
                  "expr": "18",
                  "sources": [
                    "plan"
                  ],
                  "given": true
                },
                {
                  "expr": "20-18",
                  "sources": [
                    "actual",
                    "plan"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "倒推的计划产量合计18吨",
            "left": "x/(1+12%)+(20-x)/(1+10%)",
            "right": "18",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "实际小麦产量",
            "expr": "11.2",
            "unit": "吨"
          },
          {
            "label": "实际玉米产量",
            "expr": "8.8",
            "unit": "吨"
          }
        ],
        "checks": [
          {
            "text": "小麦计划产量",
            "expr": "11.2/(1+12%)",
            "result": "10"
          },
          {
            "text": "玉米计划产量",
            "expr": "8.8/(1+10%)",
            "result": "8"
          }
        ],
        "steps": [
          "x/(1+12%)+(20-x)/(1+10%)=18",
          "x=11.2",
          "20-11.2=8.8"
        ],
        "closure": {
          "text": "实际总量用于分出两种作物，用各自超产率倒推计划量，再以计划合计18吨列式.",
          "sources": [
            "plan"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "小麦计划产量",
              "玉米计划产量",
              "总计划产量"
            ],
            [
              "小麦实际产量",
              "玉米实际产量",
              "总实际产量"
            ],
            [
              "计划产量",
              "超产量",
              "实际产量"
            ]
          ],
          "product": [
            [
              "计划产量",
              "超产率",
              "超产量"
            ]
          ]
        },
        "relations": {
          "add": [
            "小麦计划产量+玉米计划产量=总计划产量",
            "小麦实际产量+玉米实际产量=总实际产量",
            "计划产量+超产量=实际产量"
          ],
          "multiply": [
            "计划产量×超产率=超产量"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        }
      },
      {
        "id": "wheat-increase",
        "label": "设小麦超产x吨",
        "variable": "x",
        "meaning": "小麦超出计划的产量",
        "unit": "吨",
        "domain": "0<x<20-18",
        "derivations": [],
        "table": {
          "headers": [
            "作物",
            "计划产量/吨",
            "超产量/吨",
            "实际产量/吨"
          ],
          "rows": [
            {
              "label": "小麦",
              "cells": [
                {
                  "expr": "x/12%",
                  "sources": [
                    "wheat",
                    "unknown"
                  ]
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "x/12%+x",
                  "sources": [
                    "wheat",
                    "base",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "玉米",
              "cells": [
                {
                  "expr": "(20-18-x)/10%",
                  "sources": [
                    "actual",
                    "plan",
                    "corn",
                    "unknown"
                  ]
                },
                {
                  "expr": "20-18-x",
                  "sources": [
                    "actual",
                    "plan",
                    "unknown"
                  ]
                },
                {
                  "expr": "(20-18-x)/10%+(20-18-x)",
                  "sources": [
                    "actual",
                    "plan",
                    "corn",
                    "base",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "expr": "18",
                  "sources": [
                    "plan"
                  ],
                  "given": true
                },
                {
                  "expr": "20-18",
                  "sources": [
                    "actual",
                    "plan"
                  ]
                },
                {
                  "expr": "20",
                  "sources": [
                    "actual"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "两种计划量之和是18吨",
            "left": "x/12%+(20-18-x)/10%",
            "right": "18",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "小麦超产量",
            "expr": "1.2",
            "unit": "吨"
          },
          {
            "label": "实际小麦产量",
            "expr": "11.2",
            "unit": "吨"
          },
          {
            "label": "实际玉米产量",
            "expr": "8.8",
            "unit": "吨"
          }
        ],
        "checks": [
          {
            "text": "总超产量",
            "expr": "1.2+0.8",
            "result": "20-18"
          },
          {
            "text": "倒推计划产量和",
            "expr": "1.2/12%+0.8/10%",
            "result": "18"
          }
        ],
        "steps": [
          "x/12%+(20-18-x)/10%=18",
          "x=1.2",
          "1.2/12%+1.2=11.2",
          "0.8/10%+0.8=8.8"
        ],
        "closure": {
          "text": "先由实际总量减计划总量分配超产量，再倒推计划量，以计划总量列式.",
          "sources": [
            "plan"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "小麦计划产量",
              "玉米计划产量",
              "总计划产量"
            ],
            [
              "小麦实际产量",
              "玉米实际产量",
              "总实际产量"
            ],
            [
              "计划产量",
              "超产量",
              "实际产量"
            ]
          ],
          "product": [
            [
              "计划产量",
              "超产率",
              "超产量"
            ]
          ]
        },
        "relations": {
          "add": [
            "小麦计划产量+玉米计划产量=总计划产量",
            "小麦实际产量+玉米实际产量=总实际产量",
            "计划产量+超产量=实际产量"
          ],
          "multiply": [
            "计划产量×超产率=超产量"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        }
      }
    ],
    "contentRevision": 1,
    "tags": [
      "补充练习",
        "增长、利润与含量"
    ],
    "sourceAudit": {
      "pdfPage": 10,
      "location": "4.3（2）问题3",
      "originalVerified": true,
      "methodReview": "已检查不同设元与表格组织，保留量义或列式依据不同的自然方案，纯字母改名不另列."
    }
  },
  {
    "id": "C21-04",
    "title": "批发两种蔬菜并计算盈利",
    "group": "总价与数量",
    "kind": "linear",
    "stem": "某蔬菜经营户，用120元从蔬菜市场批发了番茄和豆角共45千克，番茄、豆角当天的批发价、零售价如下表：（1）这天该经营户批发了番茄和豆角各多少千克？（2）当天卖完这些番茄和豆角能盈利多少元？",
    "originalStem": "某蔬菜经营户，用120元从蔬菜市场批发了番茄和豆角共45千克，番茄、豆角当天的批发价、零售价如下表：（1）这天该经营户批发了番茄和豆角各多少千克？（2）当天卖完这些番茄和豆角能盈利多少元？",
    "source": "《第四章 用一元一次方程解决问题》资料，第13页 · 4.3（2）习题5",
    "sourceCollectionId": "chapter2021-04",
    "facts": [
      {
        "id": "mass",
        "text": "批发番茄和豆角共45千克.",
        "kind": "given"
      },
      {
        "id": "cost",
        "text": "共用120元.",
        "kind": "given"
      },
      {
        "id": "tomato",
        "text": "番茄批发价2.4元/千克、零售价3.6元/千克.",
        "kind": "given"
      },
      {
        "id": "bean",
        "text": "豆角批发价3.2元/千克、零售价5.0元/千克.",
        "kind": "given"
      },
      {
        "id": "sold",
        "text": "当天全部卖完.",
        "kind": "given"
      },
      {
        "id": "profit",
        "text": "盈利额＝零售总收入−批发总支出；不同商品单价不相加.",
        "kind": "property",
        "numericBlanks": false
      }
    ],
    "routes": [
      {
        "id": "tomato-mass",
        "label": "设番茄批发x千克",
        "variable": "x",
        "meaning": "批发番茄的质量",
        "unit": "千克",
        "domain": "0<x<45",
        "derivations": [],
        "table": {
          "headers": [
            "商品",
            "质量/千克",
            "批发单价/元每千克",
            "批发金额/元",
            "零售单价/元每千克",
            "零售金额/元",
            "利润/元"
          ],
          "rows": [
            {
              "label": "番茄",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "2.4",
                  "sources": [
                    "tomato"
                  ],
                  "given": true
                },
                {
                  "expr": "2.4*(x)",
                  "sources": [
                    "unknown",
                    "tomato"
                  ]
                },
                {
                  "expr": "3.6",
                  "sources": [
                    "tomato"
                  ],
                  "given": true
                },
                {
                  "expr": "3.6*(x)",
                  "sources": [
                    "unknown",
                    "tomato"
                  ]
                },
                {
                  "expr": "(3.6-2.4)*(x)",
                  "sources": [
                    "unknown",
                    "tomato",
                    "profit"
                  ]
                }
              ]
            },
            {
              "label": "豆角",
              "cells": [
                {
                  "expr": "45-x",
                  "sources": [
                    "mass",
                    "unknown"
                  ]
                },
                {
                  "expr": "3.2",
                  "sources": [
                    "bean"
                  ],
                  "given": true
                },
                {
                  "expr": "3.2*(45-x)",
                  "sources": [
                    "mass",
                    "bean",
                    "unknown"
                  ]
                },
                {
                  "expr": "5",
                  "sources": [
                    "bean"
                  ],
                  "given": true
                },
                {
                  "expr": "5*(45-x)",
                  "sources": [
                    "mass",
                    "bean",
                    "unknown"
                  ]
                },
                {
                  "expr": "(5-3.2)*(45-x)",
                  "sources": [
                    "mass",
                    "bean",
                    "unknown",
                    "profit"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "expr": "45",
                  "sources": [
                    "mass"
                  ],
                  "given": true
                },
                {
                  "note": "单价不合计"
                },
                {
                  "expr": "120",
                  "sources": [
                    "cost"
                  ],
                  "given": true
                },
                {
                  "note": "单价不合计"
                },
                {
                  "expr": "3.6*(x)+5*(45-x)",
                  "sources": [
                    "unknown",
                    "tomato",
                    "bean",
                    "mass"
                  ]
                },
                {
                  "expr": "(3.6-2.4)*(x)+(5-3.2)*(45-x)",
                  "sources": [
                    "unknown",
                    "tomato",
                    "bean",
                    "profit",
                    "mass"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "两类批发金额之和是120元",
            "left": "2.4*x+3.2*(45-x)",
            "right": "120",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "番茄质量",
            "expr": "30",
            "unit": "千克"
          },
          {
            "label": "豆角质量",
            "expr": "15",
            "unit": "千克"
          },
          {
            "label": "当天盈利",
            "expr": "63",
            "unit": "元"
          }
        ],
        "checks": [
          {
            "text": "批发支出",
            "expr": "2.4*30+3.2*15",
            "result": "120"
          },
          {
            "text": "当天利润",
            "expr": "3.6*30+5*15-120",
            "result": "63"
          }
        ],
        "steps": [
          "2.4x+3.2(45-x)=120",
          "x=30",
          "45-30=15",
          "3.6×30+5×15-120=63"
        ],
        "closure": {
          "text": "总质量用于分出两种质量，批发总金额120元作为列方程依据.",
          "sources": [
            "cost"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "番茄质量",
              "豆角质量",
              "总质量"
            ],
            [
              "番茄批发金额",
              "豆角批发金额",
              "批发总金额"
            ],
            [
              "批发金额",
              "利润",
              "零售金额"
            ]
          ],
          "product": [
            [
              "每千克价格",
              "质量",
              "对应金额"
            ]
          ]
        },
        "relations": {
          "add": [
            "番茄质量+豆角质量=总质量",
            "番茄批发金额+豆角批发金额=批发总金额",
            "批发金额+利润=零售金额"
          ],
          "multiply": [
            "每千克价格×质量=对应金额"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        }
      },
      {
        "id": "tomato-cost",
        "label": "设番茄批发金额为x元",
        "variable": "x",
        "meaning": "批发番茄花费的金额",
        "unit": "元",
        "domain": "0<x<120",
        "derivations": [],
        "table": {
          "headers": [
            "商品",
            "质量/千克",
            "批发单价/元每千克",
            "批发金额/元",
            "零售单价/元每千克",
            "零售金额/元",
            "利润/元"
          ],
          "rows": [
            {
              "label": "番茄",
              "cells": [
                {
                  "expr": "x/2.4",
                  "sources": [
                    "unknown",
                    "tomato"
                  ]
                },
                {
                  "expr": "2.4",
                  "sources": [
                    "tomato"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "tomato"
                  ],
                  "given": true
                },
                {
                  "expr": "3.6",
                  "sources": [
                    "tomato"
                  ],
                  "given": true
                },
                {
                  "expr": "3.6*(x/2.4)",
                  "sources": [
                    "unknown",
                    "tomato"
                  ]
                },
                {
                  "expr": "(3.6-2.4)*(x/2.4)",
                  "sources": [
                    "unknown",
                    "tomato",
                    "profit"
                  ]
                }
              ]
            },
            {
              "label": "豆角",
              "cells": [
                {
                  "expr": "(120-x)/3.2",
                  "sources": [
                    "cost",
                    "bean",
                    "unknown"
                  ]
                },
                {
                  "expr": "3.2",
                  "sources": [
                    "bean"
                  ],
                  "given": true
                },
                {
                  "expr": "120-x",
                  "sources": [
                    "cost",
                    "bean",
                    "unknown"
                  ]
                },
                {
                  "expr": "5",
                  "sources": [
                    "bean"
                  ],
                  "given": true
                },
                {
                  "expr": "5*((120-x)/3.2)",
                  "sources": [
                    "cost",
                    "bean",
                    "unknown"
                  ]
                },
                {
                  "expr": "(5-3.2)*((120-x)/3.2)",
                  "sources": [
                    "cost",
                    "bean",
                    "unknown",
                    "profit"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "expr": "45",
                  "sources": [
                    "mass"
                  ],
                  "given": true
                },
                {
                  "note": "单价不合计"
                },
                {
                  "expr": "120",
                  "sources": [
                    "cost"
                  ],
                  "given": true
                },
                {
                  "note": "单价不合计"
                },
                {
                  "expr": "3.6*(x/2.4)+5*((120-x)/3.2)",
                  "sources": [
                    "unknown",
                    "tomato",
                    "bean",
                    "cost"
                  ]
                },
                {
                  "expr": "(3.6-2.4)*(x/2.4)+(5-3.2)*((120-x)/3.2)",
                  "sources": [
                    "unknown",
                    "tomato",
                    "bean",
                    "profit",
                    "cost"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "用金额倒推的两种质量合计45千克",
            "left": "x/2.4+(120-x)/3.2",
            "right": "45",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "番茄批发金额",
            "expr": "72",
            "unit": "元"
          },
          {
            "label": "番茄质量",
            "expr": "30",
            "unit": "千克"
          },
          {
            "label": "豆角质量",
            "expr": "15",
            "unit": "千克"
          },
          {
            "label": "当天盈利",
            "expr": "63",
            "unit": "元"
          }
        ],
        "checks": [
          {
            "text": "批发总质量",
            "expr": "72/2.4+(120-72)/3.2",
            "result": "45"
          },
          {
            "text": "当天盈利",
            "expr": "3.6*(72/2.4)+5*((120-72)/3.2)-120",
            "result": "63"
          }
        ],
        "steps": [
          "x/2.4+(120-x)/3.2=45",
          "x=72",
          "72/2.4=30",
          "(120-72)/3.2=15",
          "3.6×30+5×15-120=63"
        ],
        "closure": {
          "text": "总批发金额用于分配费用，最后改用两种质量合计45千克列方程.",
          "sources": [
            "mass"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "番茄质量",
              "豆角质量",
              "总质量"
            ],
            [
              "番茄批发金额",
              "豆角批发金额",
              "批发总金额"
            ],
            [
              "批发金额",
              "利润",
              "零售金额"
            ]
          ],
          "product": [
            [
              "每千克价格",
              "质量",
              "对应金额"
            ]
          ]
        },
        "relations": {
          "add": [
            "番茄质量+豆角质量=总质量",
            "番茄批发金额+豆角批发金额=批发总金额",
            "批发金额+利润=零售金额"
          ],
          "multiply": [
            "每千克价格×质量=对应金额"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        }
      }
    ],
    "contentRevision": 1,
    "tags": [
      "补充练习",
        "总价与数量"
    ],
    "sourceAudit": {
      "pdfPage": 13,
      "location": "4.3（2）习题5",
      "originalVerified": true,
      "methodReview": "已检查不同设元与表格组织，保留量义或列式依据不同的自然方案，纯字母改名不另列."
    },
    "sourceTableReading": "reference",
    "sourceTable": {
      "caption": "原题价格表",
      "headers": [
        "品名",
        "番茄",
        "豆角"
      ],
      "rows": [
        [
          "批发价（元/千克）",
          2.4,
          3.2
        ],
        [
          "零售价（元/千克）",
          3.6,
          5.0
        ]
      ]
    }
  },
  {
    "id": "C21-05",
    "title": "乘车乘船与步行的三段路程",
    "group": "行程问题",
    "kind": "linear",
    "stem": "某人从甲地到乙地，全程的1/2乘车，全程的1/3乘船，最后又步行4km到达乙地.甲、乙两地的路程是多少？",
    "originalStem": "某人从甲地到乙地，全程的1/2乘车，全程的1/3乘船，最后又步行4km到达乙地.甲、乙两地的路程是多少？",
    "source": "《第四章 用一元一次方程解决问题》资料，第14页 · 4.3（3）问题1",
    "sourceCollectionId": "chapter2021-05",
    "facts": [
      {
        "id": "car",
        "text": "全程的1/2乘车.",
        "kind": "given"
      },
      {
        "id": "boat",
        "text": "全程的1/3乘船.",
        "kind": "given"
      },
      {
        "id": "walk",
        "text": "最后步行4千米到达乙地.",
        "kind": "given"
      },
      {
        "id": "parts",
        "text": "乘车、乘船、步行三段依次组成全程.",
        "kind": "property",
        "numericBlanks": false
      }
    ],
    "routes": [
      {
        "id": "whole",
        "label": "设总路程为x千米",
        "variable": "x",
        "meaning": "甲、乙两地的总路程",
        "unit": "千米",
        "domain": "x>4",
        "derivations": [],
        "table": {
          "headers": [
            "行程",
            "乘车路程/千米",
            "乘船路程/千米",
            "步行路程/千米",
            "总路程/千米"
          ],
          "rows": [
            {
              "label": "甲地到乙地",
              "cells": [
                {
                  "expr": "x/2",
                  "sources": [
                    "car",
                    "unknown"
                  ]
                },
                {
                  "expr": "x/3",
                  "sources": [
                    "boat",
                    "unknown"
                  ]
                },
                {
                  "expr": "4",
                  "sources": [
                    "walk"
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
        "equations": [
          {
            "label": "三段路程相加等于全程",
            "left": "x/2+x/3+4",
            "right": "x",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "两地总路程",
            "expr": "24",
            "unit": "千米"
          }
        ],
        "checks": [
          {
            "text": "乘车路程",
            "expr": "24/2",
            "result": "12"
          },
          {
            "text": "乘船路程",
            "expr": "24/3",
            "result": "8"
          },
          {
            "text": "三段路程和",
            "expr": "12+8+4",
            "result": "24"
          }
        ],
        "steps": [
          "x/2+x/3+4=x",
          "x/6=4",
          "x=24"
        ],
        "closure": {
          "text": "两个分率用于填表，最后用三段路程相加等于全程列式.",
          "sources": [
            "parts"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "乘车路程",
              "乘船路程",
              "前两段路程"
            ],
            [
              "前两段路程",
              "步行路程",
              "总路程"
            ]
          ],
          "product": [
            [
              "总路程",
              "乘车占比",
              "乘车路程"
            ],
            [
              "总路程",
              "乘船占比",
              "乘船路程"
            ]
          ]
        },
        "relations": {
          "add": [
            "乘车路程+乘船路程=前两段路程",
            "前两段路程+步行路程=总路程"
          ],
          "multiply": [
            "总路程×乘车占比=乘车路程",
            "总路程×乘船占比=乘船路程"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        },
        "tableNote": "沿用原资料第14页的横向四种路程表.不要求填写“一半表示平均分成两份”等定义."
      },
      {
        "id": "car-distance",
        "label": "设乘车路程为x千米",
        "variable": "x",
        "meaning": "乘车路程",
        "unit": "千米",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "路段",
            "占全程比例",
            "路程/千米"
          ],
          "rows": [
            {
              "label": "乘车",
              "cells": [
                {
                  "expr": "1/2",
                  "sources": [
                    "car"
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
              "label": "乘船",
              "cells": [
                {
                  "expr": "1/3",
                  "sources": [
                    "boat"
                  ],
                  "given": true
                },
                {
                  "expr": "x/(1/2)-x-4",
                  "sources": [
                    "car",
                    "walk",
                    "parts",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "步行",
              "cells": [
                {
                  "note": "由剩余路程确定"
                },
                {
                  "expr": "4",
                  "sources": [
                    "walk"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "全程",
              "cells": [
                {
                  "note": "三段合计"
                },
                {
                  "expr": "x/(1/2)",
                  "sources": [
                    "car",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "乘船剩余路程占全程的三分之一",
            "left": "x/(1/2)-x-4",
            "right": "(x/(1/2))/3",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "乘车路程",
            "expr": "12",
            "unit": "千米"
          },
          {
            "label": "两地总路程",
            "expr": "24",
            "unit": "千米"
          }
        ],
        "checks": [
          {
            "text": "全程",
            "expr": "12/(1/2)",
            "result": "24"
          },
          {
            "text": "步行段",
            "expr": "24-12-24/3",
            "result": "4"
          }
        ],
        "steps": [
          "x/(1/2)-x-4=(x/(1/2))/3",
          "x-4=2x/3",
          "x=12",
          "12/(1/2)=24"
        ],
        "closure": {
          "text": "先把乘船路程写成全程扣除乘车和步行，最后用乘船路程占全程1/3的关系列式.",
          "sources": [
            "boat"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "乘车路程",
              "乘船路程",
              "前两段路程"
            ],
            [
              "前两段路程",
              "步行路程",
              "总路程"
            ]
          ],
          "product": [
            [
              "总路程",
              "乘车占比",
              "乘车路程"
            ],
            [
              "总路程",
              "乘船占比",
              "乘船路程"
            ]
          ]
        },
        "relations": {
          "add": [
            "乘车路程+乘船路程=前两段路程",
            "前两段路程+步行路程=总路程"
          ],
          "multiply": [
            "总路程×乘车占比=乘车路程",
            "总路程×乘船占比=乘船路程"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        },
        "tableNote": "乘船路程由总路程减去另两段填写；它与表中已知的1/3全程尚须相等."
      }
    ],
    "contentRevision": 2,
    "tags": [
      "补充练习",
        "行程问题"
    ],
    "sourceAudit": {
      "pdfPage": 14,
      "location": "4.3（3）问题1",
      "originalVerified": true,
      "methodReview": "已检查不同设元与表格组织，保留量义或列式依据不同的自然方案，纯字母改名不另列."
    }
  },
  {
    "id": "C21-06",
    "title": "为两种同量表示编故事",
    "group": "开放探究与方法边界",
    "kind": "open",
    "stem": "尝试写出一个实际问题，使问题中的数量关系可以用方程2x+5=3x-1来表示.",
    "originalStem": "尝试写出一个实际问题，使问题中的数量关系可以用方程2x+5=3x-1来表示.",
    "source": "《第四章 用一元一次方程解决问题》资料，第15页 · 4.3（3）思考",
    "sourceCollectionId": "chapter2021-06",
    "facts": [
      {
        "id": "equation",
        "text": "问题中的数量关系可以用方程2x+5=3x-1表示.",
        "kind": "given",
        "numericBlanks": false
      },
      {
        "id": "meaning",
        "text": "自编情境应解释两边为何表示同一个量，明确x及各常数的实际含义、单位和范围.",
        "kind": "convention"
      }
    ],
    "routes": [
      {
        "id": "expressions",
        "label": "拆解两种同量表示",
        "variable": "x",
        "meaning": "自编情境中选择的未知数量",
        "unit": "",
        "domain": "根据自编情境确定单位、正负和整数限制，不预设唯一故事",
        "derivations": [],
        "table": {
          "headers": [
            "同一量的两种表示",
            "每份量",
            "份数",
            "增加量",
            "减少量",
            "同一总量"
          ],
          "rows": [
            {
              "label": "左边",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "equation"
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
                  "expr": "5",
                  "sources": [
                    "equation"
                  ],
                  "given": true
                },
                {
                  "note": "无减少项"
                },
                {
                  "expr": "2*x+5",
                  "sources": [
                    "equation",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "右边",
              "cells": [
                {
                  "expr": "3",
                  "sources": [
                    "equation"
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
                  "note": "无增加项"
                },
                {
                  "expr": "1",
                  "sources": [
                    "equation"
                  ],
                  "given": true
                },
                {
                  "expr": "3*x-1",
                  "sources": [
                    "equation",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [],
        "answers": [],
        "checks": [],
        "steps": [],
        "closure": {
          "text": "两边必须表示同一个具体数量；各项量义和单位须能解释，不把随意拼接的文字当作唯一答案.",
          "sources": [
            "equation",
            "meaning"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "左边乘积",
              "左边增加量",
              "左边总量"
            ],
            [
              "右边总量",
              "右边减少量",
              "右边乘积"
            ]
          ],
          "product": [
            [
              "左边每份量",
              "份数",
              "左边乘积"
            ],
            [
              "右边每份量",
              "份数",
              "右边乘积"
            ]
          ]
        },
        "relations": {
          "add": [
            "左边乘积+左边增加量=左边总量",
            "右边总量+右边减少量=右边乘积"
          ],
          "multiply": [
            "左边每份量×份数=左边乘积",
            "右边每份量×份数=右边乘积"
          ]
        },
        "conclusion": "本题仅分析两种同量表示与自编情境的适用条件，不设置唯一故事或解方程关卡.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        },
        "discussion": "用关系式记录自编故事的数量联系，具体故事与单位含义在课堂交流."
      }
    ],
    "contentRevision": 1,
    "tags": [
      "补充练习",
        "开放探究与方法边界"
    ],
    "sourceAudit": {
      "pdfPage": 15,
      "location": "4.3（3）思考",
      "originalVerified": true,
      "methodReview": "已检查不同设元与表格组织，保留量义或列式依据不同的自然方案，纯字母改名不另列."
    }
  },
  {
    "id": "C21-07",
    "title": "操场扩建前后的长宽关系",
    "group": "几何数量",
    "kind": "linear",
    "stem": "一个长方形的操场，长是宽的2.5倍，根据需要将它扩建，把它的长和宽各加长20m后，它的长是宽的2倍.求扩建前长方形操场的周长.",
    "originalStem": "一个长方形的操场，长是宽的2.5倍，根据需要将它扩建，把它的长和宽各加长20m后，它的长是宽的2倍.求扩建前长方形操场的周长.",
    "source": "《第四章 用一元一次方程解决问题》资料，第17页 · 4.3（3）习题3",
    "sourceCollectionId": "chapter2021-07",
    "facts": [
      {
        "id": "ratio-before",
        "text": "原长方形操场的长是宽的2.5倍.",
        "kind": "given"
      },
      {
        "id": "change",
        "text": "长和宽各加长20米.",
        "kind": "given"
      },
      {
        "id": "ratio-after",
        "text": "扩建后长是宽的2倍.",
        "kind": "given"
      },
      {
        "id": "perimeter",
        "text": "长方形周长等于长与宽之和的2倍.",
        "kind": "property",
        "numericBlanks": false
      }
    ],
    "routes": [
      {
        "id": "old-width",
        "label": "设扩建前宽为x米",
        "variable": "x",
        "meaning": "扩建前操场的宽",
        "unit": "米",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "状态",
            "宽/米",
            "长/米"
          ],
          "rows": [
            {
              "label": "扩建前",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "2.5*x",
                  "sources": [
                    "ratio-before",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "扩建后",
              "cells": [
                {
                  "expr": "x+20",
                  "sources": [
                    "change",
                    "unknown"
                  ]
                },
                {
                  "expr": "2.5*x+20",
                  "sources": [
                    "ratio-before",
                    "change",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "新长为新宽的2倍",
            "left": "2.5*x+20",
            "right": "2*(x+20)",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "扩建前宽",
            "expr": "40",
            "unit": "米"
          },
          {
            "label": "扩建前长",
            "expr": "100",
            "unit": "米"
          },
          {
            "label": "扩建前周长",
            "expr": "280",
            "unit": "米"
          }
        ],
        "checks": [
          {
            "text": "扩建前长宽比",
            "expr": "100/40",
            "result": "2.5"
          },
          {
            "text": "扩建后长宽比",
            "expr": "(100+20)/(40+20)",
            "result": "2"
          },
          {
            "text": "扩建前周长",
            "expr": "2*(100+40)",
            "result": "280"
          }
        ],
        "steps": [
          "2.5x+20=2(x+20)",
          "0.5x=20",
          "x=40",
          "2(2.5×40+40)=280"
        ],
        "closure": {
          "text": "原倍数与加长量已用于填表，以扩建后的长宽倍数列式.",
          "sources": [
            "ratio-after"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "原长",
              "长增加量",
              "新长"
            ],
            [
              "原宽",
              "宽增加量",
              "新宽"
            ]
          ],
          "product": [
            [
              "原宽",
              "原长宽倍数",
              "原长"
            ],
            [
              "新宽",
              "新长宽倍数",
              "新长"
            ]
          ]
        },
        "relations": {
          "add": [
            "原长+长增加量=新长",
            "原宽+宽增加量=新宽"
          ],
          "multiply": [
            "原宽×原长宽倍数=原长",
            "新宽×新长宽倍数=新长"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        }
      },
      {
        "id": "new-width",
        "label": "设扩建后宽为x米",
        "variable": "x",
        "meaning": "扩建后操场的宽",
        "unit": "米",
        "domain": "x>20",
        "derivations": [],
        "table": {
          "headers": [
            "尺寸",
            "扩建前/米",
            "加长/米",
            "扩建后/米"
          ],
          "rows": [
            {
              "label": "宽",
              "cells": [
                {
                  "expr": "x-20",
                  "sources": [
                    "change",
                    "unknown"
                  ]
                },
                {
                  "expr": "20",
                  "sources": [
                    "change"
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
              "label": "长",
              "cells": [
                {
                  "expr": "2.5*(x-20)",
                  "sources": [
                    "ratio-before",
                    "change",
                    "unknown"
                  ]
                },
                {
                  "expr": "20",
                  "sources": [
                    "change"
                  ],
                  "given": true
                },
                {
                  "expr": "2*x",
                  "sources": [
                    "ratio-after",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "新长等于原长加20米",
            "left": "2*x",
            "right": "2.5*(x-20)+20",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "扩建后宽",
            "expr": "60",
            "unit": "米"
          },
          {
            "label": "扩建前周长",
            "expr": "280",
            "unit": "米"
          }
        ],
        "checks": [
          {
            "text": "扩建前长宽比",
            "expr": "(2*60-20)/(60-20)",
            "result": "2.5"
          },
          {
            "text": "原周长",
            "expr": "2*((60-20)+(2*60-20))",
            "result": "280"
          }
        ],
        "steps": [
          "2x=2.5(x-20)+20",
          "0.5x=30",
          "x=60",
          "2((60-20)+(120-20))=280"
        ],
        "closure": {
          "text": "两个状态的倍数已用于填表，改用长增加20米的关系列式.",
          "sources": [
            "change"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "原长",
              "长增加量",
              "新长"
            ],
            [
              "原宽",
              "宽增加量",
              "新宽"
            ]
          ],
          "product": [
            [
              "原宽",
              "原长宽倍数",
              "原长"
            ],
            [
              "新宽",
              "新长宽倍数",
              "新长"
            ]
          ]
        },
        "relations": {
          "add": [
            "原长+长增加量=新长",
            "原宽+宽增加量=新宽"
          ],
          "multiply": [
            "原宽×原长宽倍数=原长",
            "新宽×新长宽倍数=新长"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        }
      }
    ],
    "contentRevision": 1,
    "tags": [
      "补充练习",
        "几何数量"
    ],
    "sourceAudit": {
      "pdfPage": 17,
      "location": "4.3（3）习题3",
      "originalVerified": true,
      "methodReview": "已检查不同设元与表格组织，保留量义或列式依据不同的自然方案，纯字母改名不另列."
    }
  },
  {
    "id": "C21-08",
    "title": "重新编组与人数守恒",
    "group": "调配与盈不足",
    "kind": "linear",
    "stem": "某班同学分组参加活动，原来每组8人，后来重新编组，每组6人，这样比原来增加了2组.这个班共有多少学生？",
    "originalStem": "某班同学分组参加活动，原来每组8人，后来重新编组，每组6人，这样比原来增加了2组.这个班共有多少学生？",
    "source": "《第四章 用一元一次方程解决问题》资料，第17页 · 4.3（3）习题5",
    "sourceCollectionId": "chapter2021-08",
    "facts": [
      {
        "id": "old",
        "text": "原来每组8人.",
        "kind": "given"
      },
      {
        "id": "new",
        "text": "后来每组6人.",
        "kind": "given"
      },
      {
        "id": "more",
        "text": "重新编组后比原来增加2组.",
        "kind": "given"
      },
      {
        "id": "same",
        "text": "重新编组前后全班总人数不变，组数和人数均为正整数.",
        "kind": "property",
        "numericBlanks": false
      }
    ],
    "routes": [
      {
        "id": "old-groups",
        "label": "设原来分成x组",
        "variable": "x",
        "meaning": "原来的组数",
        "unit": "组",
        "domain": "x为正整数",
        "derivations": [],
        "table": {
          "headers": [
            "编组方案",
            "每组人数/人",
            "组数/组",
            "全班人数/人"
          ],
          "rows": [
            {
              "label": "原来",
              "cells": [
                {
                  "expr": "8",
                  "sources": [
                    "old"
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
                    "old",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "重新编组",
              "cells": [
                {
                  "expr": "6",
                  "sources": [
                    "new"
                  ],
                  "given": true
                },
                {
                  "expr": "x+2",
                  "sources": [
                    "more",
                    "unknown"
                  ]
                },
                {
                  "expr": "6*(x+2)",
                  "sources": [
                    "new",
                    "more",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "两种分组对应全班同一总人数",
            "left": "8*x",
            "right": "6*(x+2)",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "原来组数",
            "expr": "6",
            "unit": "组"
          },
          {
            "label": "全班人数",
            "expr": "48",
            "unit": "人"
          }
        ],
        "checks": [
          {
            "text": "原分组人数",
            "expr": "8*6",
            "result": "48"
          },
          {
            "text": "新组数比原组数多",
            "expr": "48/6-48/8",
            "result": "2"
          }
        ],
        "steps": [
          "8x=6(x+2)",
          "2x=12",
          "x=6",
          "8×6=48"
        ],
        "closure": {
          "text": "组数变化用于填表，以全班人数始终相同列式.",
          "sources": [
            "same"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "原组数",
              "增加组数",
              "新组数"
            ]
          ],
          "product": [
            [
              "每组人数",
              "组数",
              "全班人数"
            ]
          ]
        },
        "relations": {
          "add": [
            "原组数+增加组数=新组数"
          ],
          "multiply": [
            "每组人数×组数=全班人数"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        }
      },
      {
        "id": "class-size",
        "label": "设全班有x人",
        "variable": "x",
        "meaning": "全班总人数",
        "unit": "人",
        "domain": "x为正整数，且x/8、x/6均为整数",
        "derivations": [],
        "table": {
          "headers": [
            "编组方案",
            "全班人数/人",
            "每组人数/人",
            "组数/组"
          ],
          "rows": [
            {
              "label": "原来",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "8",
                  "sources": [
                    "old"
                  ],
                  "given": true
                },
                {
                  "expr": "x/8",
                  "sources": [
                    "old",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "重新编组",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "6",
                  "sources": [
                    "new"
                  ],
                  "given": true
                },
                {
                  "expr": "x/6",
                  "sources": [
                    "new",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "新组数比原组数多2组",
            "left": "x/6",
            "right": "x/8+2",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "全班人数",
            "expr": "48",
            "unit": "人"
          }
        ],
        "checks": [
          {
            "text": "两种组数差",
            "expr": "48/6-48/8",
            "result": "2"
          },
          {
            "text": "原组数",
            "expr": "48/8",
            "result": "6"
          },
          {
            "text": "新组数",
            "expr": "48/6",
            "result": "8"
          }
        ],
        "steps": [
          "x/6=x/8+2",
          "x/24=2",
          "x=48"
        ],
        "closure": {
          "text": "总人数不变用于填表，剩下的独立条件是组数增加2组.",
          "sources": [
            "more"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "原组数",
              "增加组数",
              "新组数"
            ]
          ],
          "product": [
            [
              "每组人数",
              "组数",
              "全班人数"
            ]
          ]
        },
        "relations": {
          "add": [
            "原组数+增加组数=新组数"
          ],
          "multiply": [
            "每组人数×组数=全班人数"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        }
      }
    ],
    "contentRevision": 1,
    "tags": [
      "补充练习",
        "调配与盈不足"
    ],
    "sourceAudit": {
      "pdfPage": 17,
      "location": "4.3（3）习题5",
      "originalVerified": true,
      "methodReview": "已检查不同设元与表格组织，保留量义或列式依据不同的自然方案，纯字母改名不另列."
    }
  },
  {
    "id": "C21-09",
    "title": "先后出发的相向相遇",
    "group": "行程问题",
    "kind": "linear",
    "stem": "A、B两地相距500km，一列慢车从A地出发，速度为60km/h，一列快车从B地出发，速度为100km/h.两车相向而行，慢车先出发1/3h，快车开出多少时间后两车相遇？",
    "originalStem": "A、B两地相距500km，一列慢车从A地出发，速度为60km/h，一列快车从B地出发，速度为100km/h.两车相向而行，慢车先出发1/3h，快车开出多少时间后两车相遇？",
    "source": "《第四章 用一元一次方程解决问题》资料，第18页 · 4.3（4）问题2",
    "sourceCollectionId": "chapter2021-09",
    "facts": [
      {
        "id": "distance",
        "text": "A、B两地相距500千米.",
        "kind": "given"
      },
      {
        "id": "slow",
        "text": "慢车从A地出发，速度60千米/小时.",
        "kind": "given"
      },
      {
        "id": "fast",
        "text": "快车从B地出发，速度100千米/小时.",
        "kind": "given"
      },
      {
        "id": "lead",
        "text": "两车相向而行，慢车先出发1/3小时.",
        "kind": "given"
      },
      {
        "id": "motion",
        "text": "相遇时两车行驶路程之和为两地路程，慢车用时比快车多先出发的时长.",
        "kind": "property",
        "numericBlanks": false
      }
    ],
    "routes": [
      {
        "id": "fast-time",
        "label": "设快车开出x小时后相遇",
        "variable": "x",
        "meaning": "快车从出发到相遇的时间",
        "unit": "小时",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "车辆",
            "速度/千米每小时",
            "时间/小时",
            "路程/千米"
          ],
          "rows": [
            {
              "label": "慢车",
              "cells": [
                {
                  "expr": "60",
                  "sources": [
                    "slow"
                  ],
                  "given": true
                },
                {
                  "expr": "x+1/3",
                  "sources": [
                    "lead",
                    "unknown"
                  ]
                },
                {
                  "expr": "60*(x+1/3)",
                  "sources": [
                    "slow",
                    "lead",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "快车",
              "cells": [
                {
                  "expr": "100",
                  "sources": [
                    "fast"
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
                  "expr": "100*x",
                  "sources": [
                    "fast",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "相遇路程和等于500千米",
            "left": "60*(x+1/3)+100*x",
            "right": "500",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "快车行驶时间",
            "expr": "3",
            "unit": "小时"
          }
        ],
        "checks": [
          {
            "text": "相遇路程和",
            "expr": "60*(3+1/3)+100*3",
            "result": "500"
          },
          {
            "text": "两车用时差",
            "expr": "(3+1/3)-3",
            "result": "1/3"
          }
        ],
        "steps": [
          "60(x+1/3)+100x=500",
          "160x=480",
          "x=3"
        ],
        "closure": {
          "text": "先行时间已用于填表，以两车相遇的路程和列式.",
          "sources": [
            "distance",
            "motion"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "快车时间",
              "慢车先行时间",
              "慢车时间"
            ],
            [
              "慢车路程",
              "快车路程",
              "两地路程"
            ]
          ],
          "product": [
            [
              "速度",
              "行驶时间",
              "行驶路程"
            ]
          ]
        },
        "relations": {
          "add": [
            "快车时间+慢车先行时间=慢车时间",
            "慢车路程+快车路程=两地路程"
          ],
          "multiply": [
            "速度×行驶时间=行驶路程"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        },
        "tableNote": "计时起点为快车出发；慢车时间比快车多1/3小时."
      },
      {
        "id": "slow-time",
        "label": "设慢车行驶x小时后相遇",
        "variable": "x",
        "meaning": "慢车从出发到相遇的时间",
        "unit": "小时",
        "domain": "x>1/3",
        "derivations": [],
        "table": {
          "headers": [
            "车辆",
            "速度/千米每小时",
            "时间/小时",
            "路程/千米"
          ],
          "rows": [
            {
              "label": "慢车",
              "cells": [
                {
                  "expr": "60",
                  "sources": [
                    "slow"
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
                  "expr": "60*x",
                  "sources": [
                    "slow",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "快车",
              "cells": [
                {
                  "expr": "100",
                  "sources": [
                    "fast"
                  ],
                  "given": true
                },
                {
                  "expr": "(500-60*x)/100",
                  "sources": [
                    "distance",
                    "slow",
                    "fast",
                    "unknown"
                  ]
                },
                {
                  "expr": "500-60*x",
                  "sources": [
                    "distance",
                    "slow",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "慢车用时比快车多先行的三分之一小时",
            "left": "x",
            "right": "(500-60*x)/100+1/3",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "慢车行驶时间",
            "expr": "10/3",
            "unit": "小时"
          },
          {
            "label": "快车行驶时间",
            "expr": "3",
            "unit": "小时"
          }
        ],
        "checks": [
          {
            "text": "相遇路程和",
            "expr": "60*(10/3)+100*((10/3)-1/3)",
            "result": "500"
          },
          {
            "text": "所求快车用时",
            "expr": "10/3-1/3",
            "result": "3"
          }
        ],
        "steps": [
          "x=(500-60x)/100+1/3",
          "160x=1600/3",
          "x=10/3",
          "10/3-1/3=3"
        ],
        "closure": {
          "text": "先由总路程减去慢车路程得到快车路程，再求快车用时；最后以慢车用时比快车多1/3小时列式.",
          "sources": [
            "lead"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "快车时间",
              "慢车先行时间",
              "慢车时间"
            ],
            [
              "慢车路程",
              "快车路程",
              "两地路程"
            ]
          ],
          "product": [
            [
              "速度",
              "行驶时间",
              "行驶路程"
            ]
          ]
        },
        "relations": {
          "add": [
            "快车时间+慢车先行时间=慢车时间",
            "慢车路程+快车路程=两地路程"
          ],
          "multiply": [
            "速度×行驶时间=行驶路程"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        },
        "tableNote": "总路程已用于填出快车路程，本方案的独立列式依据改为出发时间差."
      }
    ],
    "contentRevision": 2,
    "tags": [
      "补充练习",
        "行程问题"
    ],
    "sourceAudit": {
      "pdfPage": 18,
      "location": "4.3（4）问题2",
      "originalVerified": true,
      "methodReview": "已检查不同设元与表格组织，保留量义或列式依据不同的自然方案，纯字母改名不另列."
    }
  },
  {
    "id": "C21-10",
    "title": "同向相遇后立即转向",
    "group": "行程问题",
    "kind": "linear",
    "stem": "运动场环形跑道周长400m，小红跑步的速度是爷爷的5/3倍，他们从同一起点沿跑道的同一方向同时出发，5min后小红第一次与爷爷相遇.小红和爷爷跑步的速度各是多少？如果小红与爷爷相遇后立即转身沿相反方向跑，那么几分钟后小红再次与爷爷相遇？",
    "originalStem": "运动场环形跑道周长400m，小红跑步的速度是爷爷的5/3倍，他们从同一起点沿跑道的同一方向同时出发，5min后小红第一次与爷爷相遇.小红和爷爷跑步的速度各是多少？如果小红与爷爷相遇后立即转身沿相反方向跑，那么几分钟后小红再次与爷爷相遇？",
    "source": "《第四章 用一元一次方程解决问题》资料，第19页 · 4.3（4）问题3及议一议",
    "sourceCollectionId": "chapter2021-10",
    "facts": [
      {
        "id": "circle",
        "text": "环形跑道周长400米.",
        "kind": "given"
      },
      {
        "id": "ratio",
        "text": "小红速度是爷爷速度的5/3倍.",
        "kind": "given"
      },
      {
        "id": "first",
        "text": "同一点、同方向、同时出发，5分钟后第一次再次相遇.",
        "kind": "given"
      },
      {
        "id": "turn",
        "text": "相遇后小红立即转身沿相反方向跑.",
        "kind": "given"
      },
      {
        "id": "circle-rule",
        "text": "同向第一次再次相遇时路程差为一圈；转向后两人从同一点反向跑，路程和为一圈时再次相遇，原有速度大小保持不变.",
        "kind": "property",
        "numericBlanks": false
      }
    ],
    "routes": [
      {
        "id": "grandpa-speed",
        "label": "先设爷爷速度为x米/分",
        "variable": "x",
        "meaning": "爷爷跑步的速度",
        "unit": "米/分",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "速度/米每分",
            "同向用时/分",
            "同向路程/米"
          ],
          "rows": [
            {
              "label": "爷爷",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "5",
                  "sources": [
                    "first"
                  ],
                  "given": true
                },
                {
                  "expr": "5*x",
                  "sources": [
                    "first",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "小红",
              "cells": [
                {
                  "expr": "(5/3)*x",
                  "sources": [
                    "ratio",
                    "unknown"
                  ]
                },
                {
                  "expr": "5",
                  "sources": [
                    "first"
                  ],
                  "given": true
                },
                {
                  "expr": "5*(5/3)*x",
                  "sources": [
                    "ratio",
                    "first",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "小红比爷爷多跑一圈",
            "left": "5*(5/3)*x",
            "right": "5*x+400",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "爷爷速度",
            "expr": "120",
            "unit": "米/分"
          },
          {
            "label": "小红速度",
            "expr": "200",
            "unit": "米/分"
          },
          {
            "label": "转向后再次相遇用时",
            "expr": "5/4",
            "unit": "分"
          }
        ],
        "checks": [
          {
            "text": "第一次相遇的路程差",
            "expr": "5*(200-120)",
            "result": "400"
          },
          {
            "text": "转向后两人路程和",
            "expr": "(200+120)*(5/4)",
            "result": "400"
          }
        ],
        "steps": [
          "5(5/3)x=5x+400",
          "x=120",
          "(5/3)×120=200",
          "400/(120+200)=5/4"
        ],
        "closure": {
          "text": "先用同向路程差为一圈求速度，再用反向路程和为一圈求转向后的时间.",
          "sources": [
            "circle",
            "circle-rule"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "爷爷同向路程",
              "一圈路程",
              "小红同向路程"
            ],
            [
              "爷爷反向路程",
              "小红反向路程",
              "一圈路程"
            ]
          ],
          "product": [
            [
              "爷爷速度",
              "速度倍数",
              "小红速度"
            ],
            [
              "速度",
              "时间",
              "路程"
            ]
          ]
        },
        "relations": {
          "add": [
            "爷爷同向路程+一圈路程=小红同向路程",
            "爷爷反向路程+小红反向路程=一圈路程"
          ],
          "multiply": [
            "爷爷速度×速度倍数=小红速度",
            "速度×时间=路程"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        },
        "tableNote": "本题包含原资料的转向追问.不能将转向后的相遇误用成同向追及."
      },
      {
        "id": "turn-time",
        "label": "直接设转向后再过x分钟相遇",
        "variable": "x",
        "meaning": "小红转向后到再次相遇的时间",
        "unit": "分",
        "domain": "x>0",
        "derivations": [
          {
            "id": "grandpa-speed",
            "label": "由第一次同向相遇求爷爷速度",
            "expr": "(400/5)*3/(5-3)",
            "result": "120",
            "sources": [
              "circle",
              "first",
              "ratio",
              "circle-rule"
            ],
            "explain": "每分钟多跑400÷5米，对应速度比5∶3中的2份，因此爷爷速度为差速度×3÷(5−3)."
          },
          {
            "id": "red-speed",
            "label": "由速度倍数求小红速度",
            "expr": "120*5/3",
            "result": "200",
            "sources": [
              "grandpa-speed",
              "ratio"
            ],
            "explain": "用已确认的爷爷速度乘5/3，得到小红速度."
          }
        ],
        "table": {
          "headers": [
            "人物",
            "速度/米每分",
            "转向后时间/分",
            "转向后路程/米"
          ],
          "rows": [
            {
              "label": "爷爷",
              "cells": [
                {
                  "expr": "120",
                  "sources": [
                    "grandpa-speed"
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
                  "expr": "120*x",
                  "sources": [
                    "grandpa-speed",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "小红",
              "cells": [
                {
                  "expr": "200",
                  "sources": [
                    "red-speed"
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
                  "expr": "200*x",
                  "sources": [
                    "red-speed",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "反向再次相遇的路程和是一圈",
            "left": "120*x+200*x",
            "right": "400",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "转向后再次相遇用时",
            "expr": "5/4",
            "unit": "分"
          }
        ],
        "checks": [
          {
            "text": "反向路程和",
            "expr": "120*(5/4)+200*(5/4)",
            "result": "400"
          },
          {
            "text": "原同向路程差",
            "expr": "5*(200-120)",
            "result": "400"
          }
        ],
        "steps": [
          "120x+200x=400",
          "320x=400",
          "x=5/4"
        ],
        "closure": {
          "text": "同向首次相遇先用于推导两个速度，转向后的路程和用于列方程.",
          "sources": [
            "circle",
            "turn",
            "circle-rule"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "爷爷同向路程",
              "一圈路程",
              "小红同向路程"
            ],
            [
              "爷爷反向路程",
              "小红反向路程",
              "一圈路程"
            ]
          ],
          "product": [
            [
              "爷爷速度",
              "速度倍数",
              "小红速度"
            ],
            [
              "速度",
              "时间",
              "路程"
            ]
          ]
        },
        "relations": {
          "add": [
            "爷爷同向路程+一圈路程=小红同向路程",
            "爷爷反向路程+小红反向路程=一圈路程"
          ],
          "multiply": [
            "爷爷速度×速度倍数=小红速度",
            "速度×时间=路程"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        }
      }
    ],
    "contentRevision": 1,
    "tags": [
      "补充练习",
        "行程问题"
    ],
    "sourceAudit": {
      "pdfPage": 19,
      "location": "4.3（4）问题3及议一议",
      "originalVerified": true,
      "methodReview": "已检查不同设元与表格组织，保留量义或列式依据不同的自然方案，纯字母改名不另列."
    },
    "sourceAuditNote": "保留原问题3作为追问所需条件，新增目标为“议一议”的转向后再次相遇；不是把已有同向题换数字重录."
  },
  {
    "id": "C21-11",
    "title": "往返途中休息的三个阶段",
    "group": "行程问题",
    "kind": "linear",
    "stem": "某人以100km/h的速度驾驶汽车从甲城出发去乙城.到达乙城后休息了30min，又以80km/h的速度从乙城返回甲城，共用了5h.求甲、乙两城之间的路程.",
    "originalStem": "某人以100km/h的速度驾驶汽车从甲城出发去乙城.到达乙城后休息了30min，又以80km/h的速度从乙城返回甲城，共用了5h.求甲、乙两城之间的路程.",
    "source": "《第四章 用一元一次方程解决问题》资料，第22页 · 4.3（4）习题4",
    "sourceCollectionId": "chapter2021-11",
    "facts": [
      {
        "id": "out",
        "text": "去程速度为100千米/小时.",
        "kind": "given"
      },
      {
        "id": "back",
        "text": "返程速度为80千米/小时.",
        "kind": "given"
      },
      {
        "id": "rest",
        "text": "到达乙城后休息30分钟.",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "往返与休息共用5小时.",
        "kind": "given"
      },
      {
        "id": "route",
        "text": "甲城到乙城的去程与返程沿相同两城路程.",
        "kind": "property",
        "numericBlanks": false
      },
      {
        "id": "unit",
        "text": "1小时等于60分钟.",
        "kind": "property",
        "numericBlanks": false
      }
    ],
    "routes": [
      {
        "id": "distance",
        "label": "设两城距离为x千米",
        "variable": "x",
        "meaning": "甲、乙两城之间的路程",
        "unit": "千米",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "阶段",
            "速度/千米每小时",
            "用时/小时",
            "路程/千米"
          ],
          "rows": [
            {
              "label": "去程",
              "cells": [
                {
                  "expr": "100",
                  "sources": [
                    "out"
                  ],
                  "given": true
                },
                {
                  "expr": "x/100",
                  "sources": [
                    "out",
                    "unknown"
                  ]
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
              "label": "休息",
              "cells": [
                {
                  "note": "不行驶"
                },
                {
                  "expr": "30/60",
                  "sources": [
                    "rest",
                    "unit"
                  ],
                  "given": true
                },
                {
                  "note": "不计入行驶路程"
                }
              ]
            },
            {
              "label": "返程",
              "cells": [
                {
                  "expr": "80",
                  "sources": [
                    "back"
                  ],
                  "given": true
                },
                {
                  "expr": "x/80",
                  "sources": [
                    "back",
                    "unknown"
                  ]
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
              "label": "合计",
              "cells": [
                {
                  "note": "速度不合计"
                },
                {
                  "expr": "5",
                  "sources": [
                    "total"
                  ],
                  "given": true
                },
                {
                  "expr": "x+x",
                  "sources": [
                    "route",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "去程、休息与返程时间之和为5小时",
            "left": "x/100+30/60+x/80",
            "right": "5",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "两城距离",
            "expr": "200",
            "unit": "千米"
          }
        ],
        "checks": [
          {
            "text": "去程用时",
            "expr": "200/100",
            "result": "2"
          },
          {
            "text": "返程用时",
            "expr": "200/80",
            "result": "5/2"
          },
          {
            "text": "三个阶段总时间",
            "expr": "200/100+30/60+200/80",
            "result": "5"
          }
        ],
        "steps": [
          "x/100+30/60+x/80=5",
          "9x/400=9/2",
          "x=200"
        ],
        "closure": {
          "text": "两段路程相同用于填表，列式必须把休息时间也计入总时间.",
          "sources": [
            "total"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "去程时间",
              "休息时间",
              "去程加休息时间"
            ],
            [
              "去程加休息时间",
              "返程时间",
              "总时间"
            ]
          ],
          "product": [
            [
              "速度",
              "行驶时间",
              "单程路程"
            ]
          ]
        },
        "relations": {
          "add": [
            "去程时间+休息时间=去程加休息时间",
            "去程加休息时间+返程时间=总时间"
          ],
          "multiply": [
            "速度×行驶时间=单程路程"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        }
      },
      {
        "id": "out-time",
        "label": "设去程开车用x小时",
        "variable": "x",
        "meaning": "去程行驶时间",
        "unit": "小时",
        "domain": "0<x<5-30/60",
        "derivations": [],
        "table": {
          "headers": [
            "阶段",
            "速度/千米每小时",
            "用时/小时",
            "路程/千米"
          ],
          "rows": [
            {
              "label": "去程",
              "cells": [
                {
                  "expr": "100",
                  "sources": [
                    "out"
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
                  "expr": "100*x",
                  "sources": [
                    "out",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "休息",
              "cells": [
                {
                  "note": "不行驶"
                },
                {
                  "expr": "30/60",
                  "sources": [
                    "rest",
                    "unit"
                  ],
                  "given": true
                },
                {
                  "note": "不计入行驶路程"
                }
              ]
            },
            {
              "label": "返程",
              "cells": [
                {
                  "expr": "80",
                  "sources": [
                    "back"
                  ],
                  "given": true
                },
                {
                  "expr": "5-30/60-x",
                  "sources": [
                    "total",
                    "rest",
                    "unit",
                    "unknown"
                  ]
                },
                {
                  "expr": "80*(5-30/60-x)",
                  "sources": [
                    "back",
                    "total",
                    "rest",
                    "unit",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "速度不合计"
                },
                {
                  "expr": "5",
                  "sources": [
                    "total"
                  ],
                  "given": true
                },
                {
                  "expr": "100*x+80*(5-30/60-x)",
                  "sources": [
                    "out",
                    "back",
                    "total",
                    "rest",
                    "unit",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "equations": [
          {
            "label": "去程与返程的单程路程相等",
            "left": "100*x",
            "right": "80*(5-30/60-x)",
            "answerIndex": 0
          }
        ],
        "answers": [
          {
            "label": "去程用时",
            "expr": "2",
            "unit": "小时"
          },
          {
            "label": "两城距离",
            "expr": "200",
            "unit": "千米"
          }
        ],
        "checks": [
          {
            "text": "两城距离",
            "expr": "100*2",
            "result": "200"
          },
          {
            "text": "去返程与休息总时长",
            "expr": "2+30/60+100*2/80",
            "result": "5"
          }
        ],
        "steps": [
          "100x=80(5-30/60-x)",
          "180x=360",
          "x=2",
          "100×2=200"
        ],
        "closure": {
          "text": "总时间先用于填写返程时间，再用去程、返程是同一段两城路程列式.",
          "sources": [
            "route"
          ]
        },
        "relationTriples": {
          "sum": [
            [
              "去程时间",
              "休息时间",
              "去程加休息时间"
            ],
            [
              "去程加休息时间",
              "返程时间",
              "总时间"
            ]
          ],
          "product": [
            [
              "速度",
              "行驶时间",
              "单程路程"
            ]
          ]
        },
        "relations": {
          "add": [
            "去程时间+休息时间=去程加休息时间",
            "去程加休息时间+返程时间=总时间"
          ],
          "multiply": [
            "速度×行驶时间=单程路程"
          ]
        },
        "conclusion": "计算结果满足题目给出的全部数量关系和实际范围.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，数量关系与实际范围是否都成立？",
          "explain": "核对原题全部条件，以及所求量、单位和范围."
        },
        "tableNote": "返程时间先由总历时扣除去程和休息得到，不能再以同一总时间恒等式求解."
      }
    ],
    "contentRevision": 2,
    "tags": [
      "补充练习",
        "行程问题"
    ],
    "sourceAudit": {
      "pdfPage": 22,
      "location": "4.3（4）习题4",
      "originalVerified": true,
      "methodReview": "已检查不同设元与表格组织，保留量义或列式依据不同的自然方案，纯字母改名不另列."
    }
  },
{
  "id": "C21-12",
  "title": "九折出售反求成本",
  "group": "销售与利润",
  "source": "《第四章 用一元一次方程解决问题》资料，第16页 · 4.3（3）习题2",
  "sourceCollectionId": "chapter2021-12",
  "kind": "linear",
  "stem": "一件商品先按成本提高20%标价，再以9折出售，售价为270元，这件商品的成本是多少元？",
  "tags": [
    "成本",
    "标价",
    "折扣"
  ],
  "facts": [
    {
      "id": "raise",
      "text": "标价比成本价提高20%.",
      "kind": "given"
    },
    {
      "id": "discount",
      "text": "按标价打九折销售.",
      "kind": "given"
    },
    {
      "id": "sale",
      "text": "实际售价为270元.",
      "kind": "given"
    },
    {
      "id": "whole",
      "text": "表示相对成本的倍数时，把原成本的一份记为1.",
      "kind": "convention"
    },
    {
      "id": "fold",
      "text": "十折表示原价的全部；折数除以10就是对应的价格比例.",
      "kind": "property"
    }
  ],
  "routes": [
    {
      "id": "main",
      "label": "设成本价为x元",
      "variable": "x",
      "unit": "元",
      "domain": "x>0",
      "derivations": [
        {
          "id": "markup",
          "label": "标价相对成本价的倍数",
          "expr": "1+20%",
          "result": "1.2",
          "sources": [
            "whole",
            "raise"
          ],
          "explain": "原成本的一份加提高的20%，得到标价倍数."
        },
        {
          "id": "discount-rate",
          "label": "九折：售价是标价的几倍",
          "expr": "9/10",
          "result": "0.9",
          "sources": [
            "discount",
            "fold"
          ],
          "explain": "换算范例：九折→9÷10=0.9.意思是标价每10元，实际付9元；售价=标价×0.9.先写换算算式，再用这个倍数乘标价."
        }
      ],
      "equations": [
        {
          "label": "折后售价为270元",
          "left": "x*(1+20%)*(9/10)",
          "right": "270",
          "answerIndex": 0
        }
      ],
      "answers": [
        {
          "label": "成本价",
          "expr": "250",
          "unit": "元"
        }
      ],
      "checks": [
        {
          "text": "标价",
          "expr": "250*(1+20%)",
          "result": "300"
        },
        {
          "text": "折后售价",
          "expr": "300*(9/10)",
          "result": "270"
        }
      ],
      "steps": [
        "x*(1+20%)*(9/10)=270",
        "1.08x=270",
        "x=250"
      ],
      "meaning": "商品的成本价",
      "table": {
        "headers": [
          "状态",
          "这一步乘的倍数",
          "金额/元"
        ],
        "rows": [
          {
            "label": "成本",
            "cells": [
              {
                "note": "设为基准量"
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
            "label": "标价",
            "cells": [
              {
                "expr": "1+20%",
                "sources": [
                  "markup"
                ],
                "given": true
              },
              {
                "expr": "x*(1+20%)",
                "sources": [
                  "unknown",
                  "markup"
                ]
              }
            ]
          },
          {
            "label": "打折后的售价",
            "cells": [
              {
                "expr": "9/10",
                "sources": [
                  "discount-rate"
                ],
                "given": true
              },
              {
                "expr": "x*(1+20%)*(9/10)",
                "sources": [
                  "unknown",
                  "markup",
                  "discount-rate"
                ]
              }
            ]
          }
        ]
      },
      "relationTriples": {
        "sum": [
          [
            "成本价",
            "提高的金额",
            "标价"
          ]
        ],
        "product": [
          [
            "成本价",
            "提高比例",
            "提高的金额"
          ],
          [
            "标价",
            "折扣比例",
            "售价"
          ]
        ],
        "notes": []
      },
      "closure": {
        "sources": [
          "sale"
        ],
        "text": "按提价和折扣关系表示出的售价，须等于题给270元."
      },
      "conclusion": "成本为250元，提高20%后标价300元，按九折售价为270元.",
      "relations": {
        "add": [
          "成本价+提高的金额=标价"
        ],
        "multiply": [
          "成本价×提高比例=提高的金额",
          "标价×折扣比例=售价"
        ]
      },
      "verdict": {
        "correct": "valid",
        "prompt": "结果是否完整并符合原题条件？",
        "explain": "成本为250元，提高20%后标价300元，按九折售价为270元."
      }
    }
  ],
  "originalStem": "一件商品先按成本提高20%标价，再以9折出售，售价为270元，这件商品的成本是多少元？",
  "sourceAudit": {
    "pdfPage": 16,
    "location": "4.3（3）习题2",
    "originalVerified": true
  }
}
];
if(typeof module==='object'&&module.exports)module.exports=data;else root.RatioWordProblemsData=(root.RatioWordProblemsData||[]).concat(data);
})(typeof window==='undefined'?globalThis:window);
