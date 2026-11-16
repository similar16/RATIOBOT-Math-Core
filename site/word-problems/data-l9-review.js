/* Original teaching content paraphrased from 《教学设计与指导》. Every value retains its source. */
(function(root){'use strict';
const data=[
  {
    "id": "G9-01",
    "title": "三角形角度比",
    "group": "第9课时",
    "source": "《教学设计与指导》180—181页 · 问题1",
    "kind": "linear",
    "stem": "一个三角形的三个内角度数比为2∶3∶5。求三个角的度数，并判断三角形形状。",
    "tags": [
      "比例",
      "内角和"
    ],
    "facts": [
      {
        "id": "ratio",
        "text": "三个内角的度数比为2∶3∶5。",
        "kind": "given"
      },
      {
        "id": "angleSum",
        "text": "三角形内角和为180°。",
        "kind": "property"
      },
      {
        "id": "one",
        "text": "一个量相对于自身的倍数为1。",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "part",
        "label": "设每份角度为x",
        "variable": "x",
        "meaning": "每份角度",
        "unit": "度",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "内角",
            "比例份数",
            "每份角度/度",
            "角度/度"
          ],
          "rows": [
            {
              "label": "第一角",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "ratio"
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
                  "expr": "2*x",
                  "sources": [
                    "ratio",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "第二角",
              "cells": [
                {
                  "expr": "3",
                  "sources": [
                    "ratio"
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
                  "expr": "3*x",
                  "sources": [
                    "ratio",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "第三角",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "ratio"
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
                  "expr": "5*x",
                  "sources": [
                    "ratio",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "由2+3+5求得，不必先化简"
                },
                {
                  "note": "不相加"
                },
                {
                  "expr": "180",
                  "sources": [
                    "angleSum"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "三个内角之和=180°"
          ],
          "multiply": [
            "每个角=比例份数×每份角度"
          ]
        },
        "closure": {
          "sources": [
            "angleSum"
          ],
          "text": "三角形三个内角和为180°",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "内角和",
            "left": "2*x+3*x+5*x",
            "right": "180"
          }
        ],
        "answers": [
          {
            "label": "每份角度",
            "expr": "18",
            "unit": "度"
          },
          {
            "label": "第一角",
            "expr": "36",
            "unit": "度"
          },
          {
            "label": "第二角",
            "expr": "54",
            "unit": "度"
          },
          {
            "label": "第三角",
            "expr": "90",
            "unit": "度"
          }
        ],
        "steps": [
          "(2+3+5)*x=180",
          "10*x=180",
          "x=180/10=18"
        ],
        "checks": [
          {
            "text": "角度和",
            "expr": "36+54+90",
            "result": "180"
          },
          {
            "text": "三份的角度与两份的角度之比",
            "expr": "54/36",
            "result": "3/2"
          }
        ],
        "conclusion": "三个角为36°、54°、90°，所以是直角三角形。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "三个角为36°、54°、90°，所以是直角三角形。"
        },
        "variation": "把每份角度设为x与把最小角设为x，表格怎样变化？"
      },
      {
        "id": "smallest",
        "label": "设最小角为x",
        "variable": "x",
        "meaning": "最小角的度数",
        "unit": "度",
        "domain": "x>0",
        "derivations": [
          {
            "id": "secondRatio",
            "label": "第二角与最小角的倍数",
            "expr": "3/2",
            "result": "3/2",
            "sources": [
              "ratio"
            ],
            "explain": "用3份除以2份。",
            "calculation": "3÷2"
          },
          {
            "id": "thirdRatio",
            "label": "第三角与最小角的倍数",
            "expr": "5/2",
            "result": "5/2",
            "sources": [
              "ratio"
            ],
            "explain": "用5份除以2份。",
            "calculation": "5÷2"
          }
        ],
        "table": {
          "headers": [
            "内角",
            "相对最小角的倍数",
            "角度/度"
          ],
          "rows": [
            {
              "label": "第一角",
              "cells": [
                {
                  "expr": "1",
                  "sources": [
                    "one"
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
              "label": "第二角",
              "cells": [
                {
                  "expr": "3/2",
                  "sources": [
                    "secondRatio"
                  ],
                  "given": true
                },
                {
                  "expr": "(3/2)*x",
                  "sources": [
                    "secondRatio",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "第三角",
              "cells": [
                {
                  "expr": "5/2",
                  "sources": [
                    "thirdRatio"
                  ],
                  "given": true
                },
                {
                  "expr": "(5/2)*x",
                  "sources": [
                    "thirdRatio",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "三个内角之和=180°"
          ],
          "multiply": [
            "角度=与最小角的倍数×最小角"
          ]
        },
        "closure": {
          "sources": [
            "angleSum"
          ],
          "text": "三角形内角和为180°",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "内角和",
            "left": "x+(3/2)*x+(5/2)*x",
            "right": "180"
          }
        ],
        "answers": [
          {
            "label": "最小角",
            "expr": "36",
            "unit": "度"
          }
        ],
        "steps": [
          "(1+3/2+5/2)*x=180",
          "5*x=180",
          "x=36"
        ],
        "checks": [
          {
            "text": "代回角度和",
            "expr": "36+(3/2)*36+(5/2)*36",
            "result": "180"
          }
        ],
        "conclusion": "最小角36°，其余两角54°、90°。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "最小角36°，其余两角54°、90°。"
        },
        "variation": "为什么设最小角后出现3÷2和5÷2？"
      }
    ]
  },
  {
    "id": "G9-02",
    "title": "三角形边的类比与检验",
    "group": "第9课时",
    "source": "《教学设计与指导》181页 · 问题1追问",
    "kind": "existence",
    "stem": "把三角形角度比的问题改成：三边长度比为2∶3∶5。这样的三角形能存在吗？再讨论三边比3∶4∶5时能说明什么。",
    "tags": [
      "存在性",
      "几何条件"
    ],
    "facts": [
      {
        "id": "ratio",
        "text": "先讨论三条边的长度比2∶3∶5。",
        "kind": "given"
      },
      {
        "id": "rule",
        "text": "三角形任意两边的和必须大于第三边。",
        "kind": "property"
      },
      {
        "id": "alt",
        "text": "另一种类比的三边比为3∶4∶5。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "sides",
        "label": "设每份边长为k",
        "variable": "k",
        "meaning": "每份边长",
        "unit": "同一长度单位",
        "domain": "k>0",
        "derivations": [],
        "table": {
          "headers": [
            "边",
            "比例份数",
            "边长"
          ],
          "rows": [
            {
              "label": "第一边",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "ratio"
                  ],
                  "given": true
                },
                {
                  "expr": "2*k",
                  "sources": [
                    "ratio",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "第二边",
              "cells": [
                {
                  "expr": "3",
                  "sources": [
                    "ratio"
                  ],
                  "given": true
                },
                {
                  "expr": "3*k",
                  "sources": [
                    "ratio",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "第三边",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "ratio"
                  ],
                  "given": true
                },
                {
                  "expr": "5*k",
                  "sources": [
                    "ratio",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "较短两边之和必须大于最长边"
          ],
          "multiply": [
            "边长=份数×每份长度"
          ]
        },
        "closure": {
          "sources": [
            "rule"
          ],
          "text": "必须检查两边和是否严格大于第三边",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [],
        "answers": [],
        "steps": [
          "2*k+3*k=(2+3)*k=5*k"
        ],
        "checks": [],
        "conclusion": "2∶3∶5时两条短边的和恰等于长边，不能围成三角形。3∶4∶5能够围成三角形；判定为直角三角形需要后续几何知识。",
        "verdict": {
          "correct": "impossible",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "2∶3∶5时两条短边的和恰等于长边，不能围成三角形。3∶4∶5能够围成三角形；判定为直角三角形需要后续几何知识。"
        },
        "variation": "你能改动一个比值，让两条短边的和大于第三边吗？",
        "discussion": "解释为什么2k+3k=5k不能满足三角形存在条件；再讨论3∶4∶5，暂不要求本章知识证明其形状。"
      }
    ],
    "notices": [
      "本题检查图形能否存在，不要求求出唯一的k。"
    ]
  },
  {
    "id": "G9-03",
    "title": "黑棋图案能否有50颗",
    "group": "第9课时",
    "source": "《教学设计与指导》181—183页 · 问题2",
    "kind": "existence",
    "stem": "观察图案：第n幅为每边n+1颗的方阵，首行、首列和从左上到右下的主对角线为黑棋，其余为白棋；这三条线共同经过左上角同一颗棋子。第1至4幅的黑棋数依次为4、7、10、13。这样的图案能恰有50颗黑棋吗？",
    "tags": [
      "图案",
      "整数检验"
    ],
    "facts": [
      {
        "id": "structure",
        "text": "图案呈方阵；第n幅每边有n+1颗棋子。首行、首列、主对角线这3条线上都是黑棋；左上角同一颗被数了3次，比实际多算2次。",
        "kind": "given"
      },
      {
        "id": "first",
        "text": "第1幅有4颗黑棋；以后每增一幅，首行、首列、主对角线各增加1颗黑棋。",
        "kind": "given"
      },
      {
        "id": "target",
        "text": "问题要求恰好50颗黑棋。",
        "kind": "given"
      },
      {
        "id": "order",
        "text": "图案序号必须为正整数。",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "growth",
        "label": "设图案序号为n",
        "variable": "n",
        "meaning": "图案序号",
        "unit": "幅",
        "domain": "n是正整数",
        "derivations": [
          {
            "id": "blackIncrement",
            "label": "图案每增加一幅新增的黑棋数",
            "expr": "3*1",
            "result": "3",
            "sources": [
              "structure",
              "first"
            ],
            "explain": "图中首行、首列、主对角线这3条线各增加1颗黑棋；先用线的条数乘每条增加的颗数，得到每次新增量。"
          }
        ],
        "table": {
          "headers": [
            "结构部分",
            "增加次数",
            "每次增加/颗",
            "黑棋数/颗"
          ],
          "rows": [
            {
              "label": "第一幅初始部分",
              "cells": [
                {
                  "note": "初始部分"
                },
                {
                  "note": "直接数图"
                },
                {
                  "expr": "4",
                  "sources": [
                    "first"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "后续增长",
              "cells": [
                {
                  "expr": "n-1",
                  "sources": [
                    "unknown",
                    "first"
                  ]
                },
                {
                  "expr": "3",
                  "sources": [
                    "blackIncrement"
                  ],
                  "given": true
                },
                {
                  "expr": "3*(n-1)",
                  "sources": [
                    "first",
                    "blackIncrement",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "整幅图",
              "cells": [
                {
                  "note": "不相加"
                },
                {
                  "note": "不相加"
                },
                {
                  "expr": "4+3*(n-1)",
                  "sources": [
                    "first",
                    "blackIncrement",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "初始黑棋数+后续增加数=总黑棋数"
          ],
          "multiply": [
            "增加数=每次增加数×增加次数"
          ]
        },
        "closure": {
          "sources": [
            "target"
          ],
          "text": "总黑棋数应恰好等于50",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "黑棋总数",
            "left": "4+3*(n-1)",
            "right": "50"
          }
        ],
        "answers": [
          {
            "label": "方程的解n",
            "expr": "49/3",
            "unit": ""
          }
        ],
        "steps": [
          "4+3*n-3=50",
          "3*n=50-4+3",
          "n=(50-4+3)/3=49/3"
        ],
        "checks": [
          {
            "text": "代回目标数",
            "expr": "4+3*(49/3-1)",
            "result": "50"
          }
        ],
        "conclusion": "方程的解为49/3，但序号必须是正整数，因此不存在恰有50颗黑棋的图案。",
        "verdict": {
          "correct": "impossible",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "方程的解为49/3，但序号必须是正整数，因此不存在恰有50颗黑棋的图案。"
        },
        "variation": "改为49颗或52颗会怎样？请先列式，再检查序号。"
      }
    ],
    "diagram": "chess",
    "diagramData": {
      "pattern": "row-column-diagonal",
      "initial": 4,
      "increment": 3,
      "lines": 3,
      "overlaps": 2
    }
  },
  {
    "id": "G9-04",
    "title": "围绕白棋编题",
    "group": "第9课时",
    "source": "《教学设计与指导》183页 · 问题2追问5",
    "kind": "open",
    "stem": "第n幅棋子图为每边n+1颗的方阵，首行、首列、主对角线上的棋子为黑棋，其余为白棋。三条线共同经过左上角同一颗棋子，分条计数时该棋子多算了2次。请围绕白棋设计一个能用方程解决的问题。原书没有指定白棋目标数。",
    "tags": [
      "编题",
      "方程范围"
    ],
    "facts": [
      {
        "id": "square",
        "text": "每边有n+1颗，排列成方阵。",
        "kind": "given"
      },
      {
        "id": "black",
        "text": "首行、首列、主对角线这3条线上的棋子为黑棋，每条n+1颗；共同的左上角棋子被数了3次，但实际只应计1次。",
        "kind": "given"
      },
      {
        "id": "partition",
        "text": "总棋子由黑棋和白棋组成。",
        "kind": "given"
      },
      {
        "id": "order",
        "text": "图案序号n为正整数。",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "white",
        "label": "用n表示图案序号",
        "variable": "n",
        "meaning": "图案序号",
        "unit": "幅",
        "domain": "n是正整数",
        "derivations": [
          {
            "id": "overlapCount",
            "label": "左上角多算的次数",
            "expr": "3-1",
            "result": "2",
            "sources": ["black"],
            "explain": "三条线共同经过同一颗左上角棋子。分条数了3次，实际应计1次，所以扣除3−1=2次。"
          }
        ],
        "table": {
          "headers": [
            "图案",
            "每边颗数",
            "总棋子/颗",
            "黑棋/颗",
            "白棋/颗"
          ],
          "rows": [
            {
              "label": "第n幅",
              "cells": [
                {
                  "expr": "n+1",
                  "sources": [
                    "square",
                    "unknown"
                  ]
                },
                {
                  "expr": "(n+1)*(n+1)",
                  "sources": [
                    "square",
                    "unknown"
                  ]
                },
                {
                  "expr": "3*(n+1)-2",
                  "sources": [
                    "black",
                    "overlapCount",
                    "unknown"
                  ]
                },
                {
                  "expr": "(n+1)*(n+1)-(3*(n+1)-2)",
                  "sources": [
                    "square",
                    "black",
                    "overlapCount",
                    "partition",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "白棋数=总棋子数−黑棋数"
          ],
          "multiply": [
            "总棋子数=每边颗数×每边颗数"
          ]
        },
        "closure": {
          "sources": [
            "partition"
          ],
          "text": "编题时还需自己提供目标或比较条件",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [],
        "answers": [],
        "steps": [
          "(n+1)^2-(3*(n+1)-2)=n^2-n",
          "n^2-n=n*(n-1)"
        ],
        "checks": [],
        "conclusion": "这是开放编题。若给定白棋总数再求n，通常会得到二次方程；原书要求能用方程，并未要求一定是一元一次。",
        "verdict": {
          "correct": "open",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "这是开放编题。若给定白棋总数再求n，通常会得到二次方程；原书要求能用方程，并未要求一定是一元一次。"
        },
        "variation": "改成已知图案序号求白棋数，还是求解方程的问题吗？",
        "discussion": "编写一个完整问题，说明所给条件、所求量和所列方程。自由编题由教师阅读，不按固定故事判错。"
      }
    ],
    "notices": [
      "本题属于开放任务；表格可以表达关系，但不能保证所列方程是一元一次。"
    ],
    "diagram": "chess",
    "diagramData": {
      "pattern": "row-column-diagonal",
      "lines": 3,
      "overlaps": 2
    }
  },
  {
    "id": "G9-05",
    "title": "从方程设计小棒活动",
    "group": "第9课时",
    "source": "《教学设计与指导》183页 · 问题2追问6",
    "kind": "open",
    "stem": "设计一种搭小棒的活动，使提出的问题可以用6n+2=100表示，并检查所设计的完整图案能否恰好使用100根小棒。",
    "tags": [
      "反向编题",
      "整数检验"
    ],
    "facts": [
      {
        "id": "equation",
        "text": "给定方程6n+2=100。",
        "kind": "given"
      },
      {
        "id": "sample",
        "text": "本次结构示例：固定部分2根，每个重复单元增加6根；n表示完整重复单元数。",
        "kind": "example"
      },
      {
        "id": "integer",
        "text": "完整重复单元数必须是非负整数。",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "units",
        "label": "设完整重复单元数为n",
        "variable": "n",
        "meaning": "完整重复单元数",
        "unit": "个",
        "domain": "n是非负整数",
        "derivations": [],
        "table": {
          "headers": [
            "构成",
            "单元数",
            "每单元/根",
            "小棒数/根"
          ],
          "rows": [
            {
              "label": "固定部分",
              "cells": [
                {
                  "note": "固定"
                },
                {
                  "note": "固定"
                },
                {
                  "expr": "2",
                  "sources": [
                    "equation",
                    "sample"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "重复部分",
              "cells": [
                {
                  "expr": "n",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "6",
                  "sources": [
                    "equation",
                    "sample"
                  ],
                  "given": true
                },
                {
                  "expr": "6*n",
                  "sources": [
                    "equation",
                    "sample",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "不相加"
                },
                {
                  "note": "不相加"
                },
                {
                  "expr": "100",
                  "sources": [
                    "equation"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "重复部分+固定部分=总数"
          ],
          "multiply": [
            "重复部分根数=单元数×每单元根数"
          ]
        },
        "closure": {
          "sources": [
            "equation"
          ],
          "text": "总数为100根",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "小棒总数",
            "left": "6*n+2",
            "right": "100"
          }
        ],
        "answers": [
          {
            "label": "方程的解n",
            "expr": "49/3",
            "unit": ""
          }
        ],
        "steps": [
          "6*n=100-2",
          "n=(100-2)/6=49/3"
        ],
        "checks": [
          {
            "text": "代回给定方程",
            "expr": "6*(49/3)+2",
            "result": "100"
          }
        ],
        "conclusion": "若要求完整重复单元，49/3不是整数，所以这种结构不能恰好使用100根。图形设计本身没有唯一答案。",
        "verdict": {
          "correct": "impossible",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "若要求完整重复单元，49/3不是整数，所以这种结构不能恰好使用100根。图形设计本身没有唯一答案。"
        },
        "variation": "把总数改成98根，说明图形和方程如何变化。",
        "discussion": "提交你设计的图形说明，解释6n、2、100各代表什么。表中仅是一种结构示例，不限制你设计其他合理图形。"
      }
    ],
    "notices": [
      "“固定2根+每个单元6根”是本次分析示例，并非原书指定图案。"
    ]
  },
  {
    "id": "G9-06",
    "title": "梯形的下底",
    "group": "第9课时",
    "source": "《教学设计与指导》183页 · 目标检测1",
    "kind": "linear",
    "stem": "一个梯形的面积为120，上底为12，高为8，求下底。题目未写具体计量单位，所有长度与面积使用相互一致的单位。",
    "tags": [
      "几何公式",
      "两底和"
    ],
    "facts": [
      {
        "id": "area",
        "text": "梯形面积为120。",
        "kind": "given"
      },
      {
        "id": "top",
        "text": "上底为12。",
        "kind": "given"
      },
      {
        "id": "height",
        "text": "高为8。",
        "kind": "given"
      },
      {
        "id": "formula",
        "text": "梯形面积=(上底+下底)×高÷2。",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "bottom",
        "label": "设下底为x",
        "variable": "x",
        "meaning": "梯形下底",
        "unit": "原题长度单位",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "图形",
            "上底",
            "下底",
            "两底和",
            "高",
            "面积"
          ],
          "rows": [
            {
              "label": "梯形",
              "cells": [
                {
                  "expr": "12",
                  "sources": [
                    "top"
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
                  "expr": "12+x",
                  "sources": [
                    "top",
                    "unknown"
                  ]
                },
                {
                  "expr": "8",
                  "sources": [
                    "height"
                  ],
                  "given": true
                },
                {
                  "expr": "(12+x)*8/2",
                  "sources": [
                    "top",
                    "unknown",
                    "height",
                    "formula"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "两底和=上底+下底"
          ],
          "multiply": [
            "面积=两底和×高÷2"
          ]
        },
        "closure": {
          "sources": [
            "area"
          ],
          "text": "计算得到的面积等于已知面积120",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "面积相等",
            "left": "(12+x)*8/2",
            "right": "120"
          }
        ],
        "answers": [
          {
            "label": "下底",
            "expr": "18",
            "unit": "原题长度单位"
          }
        ],
        "steps": [
          "12+x=120*2/8",
          "x=120*2/8-12=18"
        ],
        "checks": [
          {
            "text": "代回面积",
            "expr": "(12+18)*8/2",
            "result": "120"
          }
        ],
        "conclusion": "下底为18（使用原题一致的长度单位）。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "下底为18（使用原题一致的长度单位）。"
        },
        "variation": "如果改求高，表中的哪一个量需要设为未知数？"
      }
    ],
    "notices": [
      "原书没有给厘米等具体单位，这里不擅自补写。"
    ]
  },
  {
    "id": "G9-07",
    "title": "相连的火柴棒小鱼",
    "group": "第9课时",
    "source": "《教学设计与指导》183页 · 目标检测2",
    "kind": "linear",
    "stem": "按图搭相连的小鱼。第1条鱼需要8根火柴，后一条鱼与已有图形共用2根边；图中1、2、3条鱼分别用了8、14、20根。140根火柴能按此结构搭多少条完整小鱼？",
    "tags": [
      "图案",
      "共享部分"
    ],
    "facts": [
      {
        "id": "first",
        "text": "第一条鱼需8根火柴。",
        "kind": "given"
      },
      {
        "id": "shared",
        "text": "每添一条同样的小鱼，与已有部分共用2根火柴。",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "共有140根火柴，要求全部恰好用完。",
        "kind": "given"
      },
      {
        "id": "integer",
        "text": "小鱼条数必须为正整数。",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "fish",
        "label": "设小鱼条数为n",
        "variable": "n",
        "meaning": "完整小鱼条数",
        "unit": "条",
        "domain": "n是正整数",
        "derivations": [
          {
            "id": "newFish",
            "label": "后续每条新增火柴数",
            "expr": "8-2",
            "result": "6",
            "sources": [
              "first",
              "shared"
            ],
            "explain": "一条鱼原需8根，扣去共用的2根，只新增6根。",
            "calculation": "8-2"
          }
        ],
        "table": {
          "headers": [
            "构成",
            "数量",
            "每条新增/根",
            "根数"
          ],
          "rows": [
            {
              "label": "首条鱼",
              "cells": [
                {
                  "expr": "1",
                  "sources": [
                    "first"
                  ],
                  "given": true
                },
                {
                  "expr": "8",
                  "sources": [
                    "first"
                  ],
                  "given": true
                },
                {
                  "expr": "8",
                  "sources": [
                    "first"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "后续小鱼",
              "cells": [
                {
                  "expr": "n-1",
                  "sources": [
                    "first",
                    "unknown"
                  ]
                },
                {
                  "expr": "6",
                  "sources": [
                    "newFish"
                  ],
                  "given": true
                },
                {
                  "expr": "(8-2)*(n-1)",
                  "sources": [
                    "first",
                    "shared",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "共n条"
                },
                {
                  "note": "不相加"
                },
                {
                  "expr": "140",
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
            "首条用量+后续新增量=总用量"
          ],
          "multiply": [
            "后续新增量=新增条数×每条新增根数"
          ]
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "全部用量等于140根",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "火柴总数",
            "left": "8+(8-2)*(n-1)",
            "right": "140"
          }
        ],
        "answers": [
          {
            "label": "小鱼条数",
            "expr": "23",
            "unit": "条"
          }
        ],
        "steps": [
          "8+6*n-6=140",
          "6*n=140-8+6",
          "n=(140-8+6)/6=23"
        ],
        "checks": [
          {
            "text": "代回用量",
            "expr": "8+(8-2)*(23-1)",
            "result": "140"
          }
        ],
        "conclusion": "可以搭23条完整小鱼。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "可以搭23条完整小鱼。"
        },
        "variation": "如果相邻两条鱼不共用火柴，每增加一条的用量怎样变化？"
      }
    ],
    "diagram": "fish",
    "diagramData": {
      "initial": 8,
      "shared": 2,
      "increment": 6
    }
  },
  {
    "id": "G9-08",
    "title": "三个连续奇数的积",
    "group": "第9课时",
    "source": "《教学设计与指导》183页 · 课后作业1",
    "kind": "linear",
    "stem": "三个连续奇数的和为15，求这三个奇数的积。",
    "tags": [
      "连续数",
      "所求量检验"
    ],
    "facts": [
      {
        "id": "sum",
        "text": "三个连续奇数之和为15。",
        "kind": "given"
      },
      {
        "id": "gap",
        "text": "相邻奇数相差2。",
        "kind": "property"
      },
      {
        "id": "question",
        "text": "最后要求的是三个奇数的积，不只是中间奇数。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "middle",
        "label": "设中间奇数为x",
        "variable": "x",
        "meaning": "中间奇数",
        "unit": "",
        "domain": "x是奇数",
        "derivations": [],
        "table": {
          "headers": [
            "位置",
            "与中间数的关系",
            "数值表达式"
          ],
          "rows": [
            {
              "label": "前一个",
              "cells": [
                {
                  "note": "比中间数少2"
                },
                {
                  "expr": "x-2",
                  "sources": [
                    "gap",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "中间",
              "cells": [
                {
                  "note": "所设未知量"
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
              "label": "后一个",
              "cells": [
                {
                  "note": "比中间数多2"
                },
                {
                  "expr": "x+2",
                  "sources": [
                    "gap",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "前一个+中间+后一个=15"
          ],
          "multiply": [
            "求出三个数以后，再计算它们的积"
          ]
        },
        "closure": {
          "sources": [
            "sum"
          ],
          "text": "三个数的和为15",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "三个奇数的和",
            "left": "(x-2)+x+(x+2)",
            "right": "15"
          }
        ],
        "answers": [
          {
            "label": "中间奇数",
            "expr": "5",
            "unit": ""
          },
          {
            "label": "三个奇数的积",
            "expr": "105",
            "unit": ""
          }
        ],
        "steps": [
          "3*x=15",
          "x=15/3=5",
          "(5-2)*5*(5+2)=3*5*7=105"
        ],
        "checks": [
          {
            "text": "检验三数之和",
            "expr": "(5-2)+5+(5+2)",
            "result": "15"
          },
          {
            "text": "计算最终所求积",
            "expr": "(5-2)*5*(5+2)",
            "result": "105"
          }
        ],
        "conclusion": "三个奇数为3、5、7，它们的积为105。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "三个奇数为3、5、7，它们的积为105。"
        },
        "variation": "如果设最小奇数为x，其余两个数怎样表示？"
      }
    ]
  },
  {
    "id": "G9-09",
    "title": "叠放菱形的数量",
    "group": "第9课时",
    "source": "《教学设计与指导》183—184页 · 课后作业2",
    "kind": "linear",
    "stem": "按原图连续叠放大菱形：第n幅有n个大菱形，每对相邻大菱形重叠形成1个小菱形，除此之外没有其他菱形。哪一幅共有25个大小不同的菱形？",
    "tags": [
      "图案",
      "去重计数"
    ],
    "facts": [
      {
        "id": "large",
        "text": "第n幅有n个大菱形。",
        "kind": "given"
      },
      {
        "id": "overlap",
        "text": "每对相邻大菱形形成1个小菱形，n个依次排列的对象有n−1处相邻连接。",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "大小菱形合计25个。",
        "kind": "given"
      },
      {
        "id": "integer",
        "text": "图案序号是正整数。",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "order",
        "label": "设图案序号为n",
        "variable": "n",
        "meaning": "图案序号",
        "unit": "幅",
        "domain": "n是正整数",
        "derivations": [],
        "table": {
          "headers": [
            "类别",
            "数量/个"
          ],
          "rows": [
            {
              "label": "大菱形",
              "cells": [
                {
                  "expr": "n",
                  "sources": [
                    "large",
                    "unknown"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "相邻重叠的小菱形",
              "cells": [
                {
                  "expr": "n-1",
                  "sources": [
                    "overlap",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "expr": "25",
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
            "大菱形数+小菱形数=总数"
          ],
          "multiply": []
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "大小菱形的数量和为25",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "菱形总数",
            "left": "n+(n-1)",
            "right": "25"
          }
        ],
        "answers": [
          {
            "label": "图案序号",
            "expr": "13",
            "unit": "幅"
          }
        ],
        "steps": [
          "2*n-1=25",
          "n=(25+1)/2=13"
        ],
        "checks": [
          {
            "text": "代回菱形数",
            "expr": "13+(13-1)",
            "result": "25"
          }
        ],
        "conclusion": "第13幅有13个大菱形和12个小菱形，共25个。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "第13幅有13个大菱形和12个小菱形，共25个。"
        },
        "variation": "请用两个图层分别数大菱形、小菱形，说明为什么没有重复计数。"
      }
    ],
    "diagram": "rhombi",
    "diagramData": {
      "largePerStep": 1,
      "overlaps": "n-1"
    }
  },
  {
    "id": "G9-10",
    "title": "七层宝塔的灯数",
    "group": "第9课时",
    "source": "《教学设计与指导》184页 · 课后作业3",
    "kind": "linear",
    "stem": "七层宝塔共有381盏灯，每下一层的灯数都是上一层的2倍。顶层有多少盏灯？",
    "tags": [
      "倍增",
      "逐层推导"
    ],
    "facts": [
      {
        "id": "layers",
        "text": "宝塔共有7层。",
        "kind": "given"
      },
      {
        "id": "double",
        "text": "每下一层的灯数是上一层的2倍。",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "七层灯数合计381盏。",
        "kind": "given"
      },
      {
        "id": "topOne",
        "text": "以顶层灯数为1份；顶层相对于自己的倍数为1。",
        "kind": "convention"
      }
    ],
    "routes": [
      {
        "id": "top",
        "label": "设顶层灯数为x",
        "variable": "x",
        "meaning": "顶层灯数",
        "unit": "盏",
        "domain": "x是正整数",
        "derivations": [
          {
            "id": "factor3",
            "label": "第3层相对顶层的倍数",
            "expr": "2*2",
            "result": "4",
            "sources": [
              "double"
            ],
            "explain": "每向下一层都把上一层灯数乘2。",
            "calculation": "2×2"
          },
          {
            "id": "factor4",
            "label": "第4层相对顶层的倍数",
            "expr": "4*2",
            "result": "8",
            "sources": [
              "double",
              "factor3"
            ],
            "explain": "每向下一层都把上一层灯数乘2。",
            "calculation": "4×2"
          },
          {
            "id": "factor5",
            "label": "第5层相对顶层的倍数",
            "expr": "8*2",
            "result": "16",
            "sources": [
              "double",
              "factor4"
            ],
            "explain": "每向下一层都把上一层灯数乘2。",
            "calculation": "8×2"
          },
          {
            "id": "factor6",
            "label": "第6层相对顶层的倍数",
            "expr": "16*2",
            "result": "32",
            "sources": [
              "double",
              "factor5"
            ],
            "explain": "每向下一层都把上一层灯数乘2。",
            "calculation": "16×2"
          },
          {
            "id": "factor7",
            "label": "第7层相对顶层的倍数",
            "expr": "32*2",
            "result": "64",
            "sources": [
              "double",
              "factor6"
            ],
            "explain": "每向下一层都把上一层灯数乘2。",
            "calculation": "32×2"
          }
        ],
        "table": {
          "headers": [
            "层次",
            "相对顶层的倍数",
            "灯数/盏"
          ],
          "rows": [
            {
              "label": "顶层",
              "cells": [
                {
                  "expr": "1",
                  "sources": [
                    "topOne"
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
              "label": "向下第2层",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "double"
                  ],
                  "given": true
                },
                {
                  "expr": "2*x",
                  "sources": [
                    "double",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "向下第3层",
              "cells": [
                {
                  "expr": "4",
                  "sources": [
                    "factor3"
                  ],
                  "given": true
                },
                {
                  "expr": "4*x",
                  "sources": [
                    "factor3",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "向下第4层",
              "cells": [
                {
                  "expr": "8",
                  "sources": [
                    "factor4"
                  ],
                  "given": true
                },
                {
                  "expr": "8*x",
                  "sources": [
                    "factor4",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "向下第5层",
              "cells": [
                {
                  "expr": "16",
                  "sources": [
                    "factor5"
                  ],
                  "given": true
                },
                {
                  "expr": "16*x",
                  "sources": [
                    "factor5",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "向下第6层",
              "cells": [
                {
                  "expr": "32",
                  "sources": [
                    "factor6"
                  ],
                  "given": true
                },
                {
                  "expr": "32*x",
                  "sources": [
                    "factor6",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "向下第7层",
              "cells": [
                {
                  "expr": "64",
                  "sources": [
                    "factor7"
                  ],
                  "given": true
                },
                {
                  "expr": "64*x",
                  "sources": [
                    "factor7",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "各层份数相加"
                },
                {
                  "expr": "381",
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
            "七层灯数相加等于381"
          ],
          "multiply": [
            "下一层灯数=上一层灯数×2"
          ]
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "所有七层的灯数和为381",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "七层灯数之和",
            "left": "x+2*x+4*x+8*x+16*x+32*x+64*x",
            "right": "381"
          }
        ],
        "answers": [
          {
            "label": "顶层灯数",
            "expr": "3",
            "unit": "盏"
          }
        ],
        "steps": [
          "(1+2+4+8+16+32+64)*x=381",
          "127*x=381",
          "x=381/127=3"
        ],
        "checks": [
          {
            "text": "检验七层总数",
            "expr": "3+2*3+4*3+8*3+16*3+32*3+64*3",
            "result": "381"
          }
        ],
        "conclusion": "顶层3盏，各层依次为3、6、12、24、48、96、192盏。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "顶层3盏，各层依次为3、6、12、24、48、96、192盏。"
        },
        "variation": "“比上一层增加1倍”和“增加1盏”有何区别？请写出对应关系。"
      }
    ]
  },
  {
    "id": "G10-01",
    "title": "鸡兔同笼",
    "group": "第10课时",
    "source": "《教学设计与指导》185—188页 · 问题1",
    "kind": "linear",
    "stem": "鸡和兔关在同一个笼中，共有35个头、94只脚。鸡和兔各有多少只？",
    "tags": [
      "双总量",
      "独立条件"
    ],
    "facts": [
      {
        "id": "heads",
        "text": "鸡和兔共35个头，每只动物计1个头。",
        "kind": "given"
      },
      {
        "id": "feet",
        "text": "鸡和兔共有94只脚。",
        "kind": "given"
      },
      {
        "id": "legs",
        "text": "通常鸡每只2脚、兔每只4脚。",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "chicken",
        "label": "设鸡的只数为x",
        "variable": "x",
        "meaning": "鸡的只数",
        "unit": "只",
        "domain": "x是0至35之间的整数",
        "derivations": [],
        "table": {
          "headers": [
            "动物",
            "每只脚数",
            "只数",
            "脚数"
          ],
          "rows": [
            {
              "label": "鸡",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "legs"
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
                  "expr": "2*x",
                  "sources": [
                    "legs",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "兔",
              "cells": [
                {
                  "expr": "4",
                  "sources": [
                    "legs"
                  ],
                  "given": true
                },
                {
                  "expr": "35-x",
                  "sources": [
                    "heads",
                    "unknown"
                  ]
                },
                {
                  "expr": "4*(35-x)",
                  "sources": [
                    "legs",
                    "heads",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "不相加"
                },
                {
                  "expr": "35",
                  "sources": [
                    "heads"
                  ],
                  "given": true
                },
                {
                  "expr": "94",
                  "sources": [
                    "feet"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "鸡数+兔数=总头数",
            "鸡脚+兔脚=总脚数"
          ],
          "multiply": [
            "脚数=每只脚数×只数"
          ]
        },
        "closure": {
          "sources": [
            "feet"
          ],
          "text": "已经用35个头表示两类只数，再用94只脚确定数量",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "脚数和",
            "left": "2*x+4*(35-x)",
            "right": "94"
          }
        ],
        "answers": [
          {
            "label": "鸡的只数",
            "expr": "23",
            "unit": "只"
          },
          {
            "label": "兔的只数",
            "expr": "12",
            "unit": "只"
          }
        ],
        "steps": [
          "2*x+4*(35-x)=94",
          "x=23"
        ],
        "checks": [
          {
            "text": "检查头数",
            "expr": "23+12",
            "result": "35"
          },
          {
            "text": "检查脚数",
            "expr": "2*23+4*12",
            "result": "94"
          }
        ],
        "conclusion": "鸡23只，兔12只。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "鸡23只，兔12只。"
        },
        "variation": "如果只知道35个头，为什么不能确定鸡兔各有多少？"
      },
      {
        "id": "rabbit",
        "label": "设兔的只数为y",
        "variable": "y",
        "meaning": "兔的只数",
        "unit": "只",
        "domain": "y是0至35之间的整数",
        "derivations": [],
        "table": {
          "headers": [
            "动物",
            "每只脚数",
            "只数",
            "脚数"
          ],
          "rows": [
            {
              "label": "兔",
              "cells": [
                {
                  "expr": "4",
                  "sources": [
                    "legs"
                  ],
                  "given": true
                },
                {
                  "expr": "y",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "4*y",
                  "sources": [
                    "legs",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "鸡",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "legs"
                  ],
                  "given": true
                },
                {
                  "expr": "35-y",
                  "sources": [
                    "heads",
                    "unknown"
                  ]
                },
                {
                  "expr": "2*(35-y)",
                  "sources": [
                    "legs",
                    "heads",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "不相加"
                },
                {
                  "expr": "35",
                  "sources": [
                    "heads"
                  ],
                  "given": true
                },
                {
                  "expr": "94",
                  "sources": [
                    "feet"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "鸡数+兔数=总头数",
            "鸡脚+兔脚=总脚数"
          ],
          "multiply": [
            "脚数=每只脚数×只数"
          ]
        },
        "closure": {
          "sources": [
            "feet"
          ],
          "text": "已经用35个头表示两类只数，再用94只脚确定数量",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "脚数和",
            "left": "4*y+2*(35-y)",
            "right": "94"
          }
        ],
        "answers": [
          {
            "label": "兔的只数",
            "expr": "12",
            "unit": "只"
          },
          {
            "label": "鸡的只数",
            "expr": "23",
            "unit": "只"
          }
        ],
        "steps": [
          "4*y+2*(35-y)=94",
          "y=12"
        ],
        "checks": [
          {
            "text": "检查头数",
            "expr": "12+23",
            "result": "35"
          },
          {
            "text": "检查脚数",
            "expr": "4*12+2*23",
            "result": "94"
          }
        ],
        "conclusion": "鸡23只，兔12只。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "鸡23只，兔12只。"
        },
        "variation": "如果只知道35个头，为什么不能确定鸡兔各有多少？"
      },
      {
        "id": "chicken-feet",
        "label": "设鸡的总脚数为x",
        "variable": "x",
        "meaning": "所有鸡的脚数之和",
        "unit": "只脚",
        "domain": "0≤x≤94，x÷2和(94−x)÷4都应为非负整数",
        "derivations": [],
        "table": {
          "headers": [
            "动物",
            "每只脚数",
            "脚数",
            "只数"
          ],
          "rows": [
            {
              "label": "鸡",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "legs"
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
                  "expr": "x/2",
                  "sources": [
                    "unknown",
                    "legs"
                  ]
                }
              ]
            },
            {
              "label": "兔",
              "cells": [
                {
                  "expr": "4",
                  "sources": [
                    "legs"
                  ],
                  "given": true
                },
                {
                  "expr": "94-x",
                  "sources": [
                    "feet",
                    "unknown"
                  ]
                },
                {
                  "expr": "(94-x)/4",
                  "sources": [
                    "feet",
                    "unknown",
                    "legs"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "每只脚数不相加"
                },
                {
                  "expr": "94",
                  "sources": [
                    "feet"
                  ],
                  "given": true
                },
                {
                  "expr": "35",
                  "sources": [
                    "heads"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "鸡的脚数+兔的脚数=94",
            "鸡的只数+兔的只数=35"
          ],
          "multiply": [
            "各类动物总脚数=每只脚数×动物只数",
            "动物只数=总脚数÷每只脚数（乘积关系的反用）"
          ]
        },
        "closure": {
          "sources": [
            "heads"
          ],
          "text": "已经用94只脚表示两类脚数，再用35个头确定两类动物只数之和。",
          "hint": "94只脚已用于94−x，接下来应使用还未满足的35个头。"
        },
        "equations": [
          {
            "label": "总只数",
            "left": "x/2+(94-x)/4",
            "right": "35"
          }
        ],
        "answers": [
          {
            "label": "鸡的总脚数",
            "expr": "46",
            "unit": "只脚"
          },
          {
            "label": "鸡的只数",
            "expr": "23",
            "unit": "只"
          },
          {
            "label": "兔的只数",
            "expr": "12",
            "unit": "只"
          }
        ],
        "steps": [
          "2*x+94-x=35*4",
          "x=35*4-94=46",
          "46/2=23",
          "(94-46)/4=12"
        ],
        "checks": [
          {
            "text": "总只数",
            "expr": "46/2+(94-46)/4",
            "result": "35"
          },
          {
            "text": "总脚数",
            "expr": "2*23+4*12",
            "result": "94"
          }
        ],
        "conclusion": "鸡的总脚数为46，因此鸡46÷2=23只；兔有(94−46)÷4=12只。x表示脚数，不能直接把46答成鸡的只数。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "鸡的总脚数为46，因此鸡46÷2=23只；兔有(94−46)÷4=12只。x表示脚数，不能直接把46答成鸡的只数。"
        },
        "variation": "为什么设动物只数时用脚数闭合，设脚数时又可以用动物只数闭合？",
        "sourceNote": "原书187页方法二原设鸡脚数m；这里沿用界面字母x，含义保持鸡的总脚数。"
      }
    ]
  },
  {
    "id": "G10-02",
    "title": "先单独后合作完成任务",
    "group": "第10课时",
    "source": "《教学设计与指导》188—190页 · 问题2",
    "kind": "linear",
    "stem": "甲单独完成一项任务需18小时，乙单独完成需12小时。甲先单独做8小时，然后甲乙合作完成剩余任务。还需合作多少小时？",
    "tags": [
      "工程",
      "按阶段",
      "按人物"
    ],
    "facts": [
      {
        "id": "aHours",
        "text": "甲单独完成整项任务需要18小时。",
        "kind": "given"
      },
      {
        "id": "bHours",
        "text": "乙单独完成整项任务需要12小时。",
        "kind": "given"
      },
      {
        "id": "firstHours",
        "text": "甲先单独工作8小时，然后甲乙合作完成余下任务。",
        "kind": "given"
      },
      {
        "id": "whole",
        "text": "把整项任务记为1，单位是“整项任务”；这不表示实际只有1件产品。",
        "kind": "convention"
      },
      {
        "id": "done",
        "text": "先做的和后来合作完成的工作量，合起来恰为全部任务。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "phases",
        "label": "按阶段列表",
        "variable": "x",
        "meaning": "合作完成剩余任务的时间",
        "unit": "小时",
        "domain": "x≥0",
        "derivations": [
          {
            "id": "aRate",
            "label": "甲每小时完成的工作量",
            "expr": "1/18",
            "result": "1/18",
            "sources": [
              "whole",
              "aHours"
            ],
            "explain": "总工作量1÷甲单独用时18小时。",
            "calculation": "1÷18"
          },
          {
            "id": "bRate",
            "label": "乙每小时完成的工作量",
            "expr": "1/12",
            "result": "1/12",
            "sources": [
              "whole",
              "bHours"
            ],
            "explain": "总工作量1÷乙单独用时12小时。",
            "calculation": "1÷12"
          }
        ],
        "table": {
          "headers": [
            "阶段",
            "效率/任务每小时",
            "工作时间/小时",
            "完成量/任务"
          ],
          "rows": [
            {
              "label": "甲先单独",
              "cells": [
                {
                  "expr": "1/18",
                  "sources": [
                    "aRate"
                  ],
                  "given": true
                },
                {
                  "expr": "8",
                  "sources": [
                    "firstHours"
                  ],
                  "given": true
                },
                {
                  "expr": "(1/18)*8",
                  "sources": [
                    "aRate",
                    "firstHours"
                  ]
                }
              ]
            },
            {
              "label": "甲乙合作",
              "cells": [
                {
                  "expr": "1/18+1/12",
                  "sources": [
                    "aRate",
                    "bRate"
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
                  "expr": "(1/18+1/12)*x",
                  "sources": [
                    "aRate",
                    "bRate",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "不同阶段效率不相加"
                },
                {
                  "expr": "8+x",
                  "sources": [
                    "firstHours",
                    "unknown"
                  ]
                },
                {
                  "expr": "1",
                  "sources": [
                    "whole"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "合作效率=甲效率+乙效率",
            "各部分完成量合计为1"
          ],
          "multiply": [
            "完成量=工作效率×工作时间"
          ]
        },
        "closure": {
          "sources": [
            "done"
          ],
          "text": "整项任务恰好完成",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "总工作量",
            "left": "(1/18)*8+(1/18+1/12)*x",
            "right": "1"
          }
        ],
        "answers": [
          {
            "label": "合作时间",
            "expr": "4",
            "unit": "小时"
          }
        ],
        "steps": [
          "8/18+(1/18+1/12)*x=1",
          "(1/18+1/12)*x=1-8/18",
          "x=(1-8/18)/(1/18+1/12)=4"
        ],
        "checks": [
          {
            "text": "检验总工作量",
            "expr": "(1/18)*(8+4)+(1/12)*4",
            "result": "1"
          }
        ],
        "conclusion": "还需合作4小时，从甲开始工作起共用8+4=12小时。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "还需合作4小时，从甲开始工作起共用8+4=12小时。"
        },
        "variation": "按人物与按阶段的两张表为什么得到同样的合作时间？哪些时间可以相加？"
      },
      {
        "id": "people",
        "label": "按人物列表",
        "variable": "x",
        "meaning": "合作完成剩余任务的时间",
        "unit": "小时",
        "domain": "x≥0",
        "derivations": [
          {
            "id": "aRate",
            "label": "甲每小时完成的工作量",
            "expr": "1/18",
            "result": "1/18",
            "sources": [
              "whole",
              "aHours"
            ],
            "explain": "总工作量1÷甲单独用时18小时。",
            "calculation": "1÷18"
          },
          {
            "id": "bRate",
            "label": "乙每小时完成的工作量",
            "expr": "1/12",
            "result": "1/12",
            "sources": [
              "whole",
              "bHours"
            ],
            "explain": "总工作量1÷乙单独用时12小时。",
            "calculation": "1÷12"
          }
        ],
        "table": {
          "headers": [
            "人物",
            "效率/任务每小时",
            "工作时间/小时",
            "完成量/任务"
          ],
          "rows": [
            {
              "label": "甲",
              "cells": [
                {
                  "expr": "1/18",
                  "sources": [
                    "aRate"
                  ],
                  "given": true
                },
                {
                  "expr": "8+x",
                  "sources": [
                    "firstHours",
                    "unknown"
                  ]
                },
                {
                  "expr": "(1/18)*(8+x)",
                  "sources": [
                    "aRate",
                    "firstHours",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "乙",
              "cells": [
                {
                  "expr": "1/12",
                  "sources": [
                    "bRate"
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
                  "expr": "(1/12)*x",
                  "sources": [
                    "bRate",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "不直接合计"
                },
                {
                  "note": "两人时间有重叠，不相加"
                },
                {
                  "expr": "1",
                  "sources": [
                    "whole"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "合作效率=甲效率+乙效率",
            "各部分完成量合计为1"
          ],
          "multiply": [
            "完成量=工作效率×工作时间"
          ]
        },
        "closure": {
          "sources": [
            "done"
          ],
          "text": "整项任务恰好完成",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "总工作量",
            "left": "(1/18)*(8+x)+(1/12)*x",
            "right": "1"
          }
        ],
        "answers": [
          {
            "label": "合作时间",
            "expr": "4",
            "unit": "小时"
          }
        ],
        "steps": [
          "8/18+(1/18+1/12)*x=1",
          "(1/18+1/12)*x=1-8/18",
          "x=(1-8/18)/(1/18+1/12)=4"
        ],
        "checks": [
          {
            "text": "检验总工作量",
            "expr": "(1/18)*(8+4)+(1/12)*4",
            "result": "1"
          }
        ],
        "conclusion": "还需合作4小时，从甲开始工作起共用8+4=12小时。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "还需合作4小时，从甲开始工作起共用8+4=12小时。"
        },
        "variation": "按人物与按阶段的两张表为什么得到同样的合作时间？哪些时间可以相加？"
      }
    ],
    "notices": [
      "原书相关图示混用了“天”；本模块按题干与表格统一为小时。"
    ],
    "diagram": "work"
  },
  {
    "id": "G10-03",
    "title": "已知合作时间，求乙单独用时",
    "group": "第10课时",
    "source": "《教学设计与指导》189页 · 分解与重组①",
    "kind": "linear",
    "stem": "甲单独完成整项任务需18小时；甲先做8小时，再与乙合作4小时恰好完成。乙单独完成需要多少小时？",
    "tags": [
      "条件重组",
      "效率设元"
    ],
    "facts": [
      {
        "id": "aHours",
        "text": "甲单独需18小时。",
        "kind": "given"
      },
      {
        "id": "firstHours",
        "text": "甲先做8小时。",
        "kind": "given"
      },
      {
        "id": "coopHours",
        "text": "甲乙又合作4小时恰好完成。",
        "kind": "given"
      },
      {
        "id": "whole",
        "text": "把整项任务记为1。",
        "kind": "convention"
      }
    ],
    "routes": [
      {
        "id": "efficiency",
        "label": "设乙每小时完成量为x",
        "variable": "x",
        "meaning": "乙每小时完成的工作量",
        "unit": "任务/小时",
        "domain": "x>0",
        "derivations": [
          {
            "id": "aRate",
            "label": "甲每小时完成量",
            "expr": "1/18",
            "result": "1/18",
            "sources": [
              "whole",
              "aHours"
            ],
            "explain": "整项任务1÷18小时。",
            "calculation": "1÷18"
          }
        ],
        "table": {
          "headers": [
            "人物",
            "效率/任务每小时",
            "实际时间/小时",
            "完成量/任务"
          ],
          "rows": [
            {
              "label": "甲",
              "cells": [
                {
                  "expr": "1/18",
                  "sources": [
                    "aRate"
                  ],
                  "given": true
                },
                {
                  "expr": "8+4",
                  "sources": [
                    "firstHours",
                    "coopHours"
                  ]
                },
                {
                  "expr": "(1/18)*(8+4)",
                  "sources": [
                    "aRate",
                    "firstHours",
                    "coopHours"
                  ]
                }
              ]
            },
            {
              "label": "乙",
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
                    "coopHours"
                  ],
                  "given": true
                },
                {
                  "expr": "4*x",
                  "sources": [
                    "coopHours",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "不相加"
                },
                {
                  "note": "重叠时间不相加"
                },
                {
                  "expr": "1",
                  "sources": [
                    "whole"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "甲、乙完成量之和=1"
          ],
          "multiply": [
            "完成量=效率×实际时间"
          ]
        },
        "closure": {
          "sources": [
            "whole",
            "coopHours"
          ],
          "text": "两人恰好完成全部任务",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "总工作量",
            "left": "(1/18)*(8+4)+4*x",
            "right": "1"
          }
        ],
        "answers": [
          {
            "label": "乙每小时完成量",
            "expr": "1/12",
            "unit": "任务/小时"
          },
          {
            "label": "乙单独所需时间",
            "expr": "12",
            "unit": "小时"
          }
        ],
        "steps": [
          "4*x=1-(1/18)*(8+4)",
          "x=(1-(1/18)*(8+4))/4=1/12",
          "1/(1/12)=12"
        ],
        "checks": [
          {
            "text": "代回总工作量",
            "expr": "(1/18)*(8+4)+4*(1/12)",
            "result": "1"
          }
        ],
        "conclusion": "乙每小时完成1/12项任务；单独完成用时=1÷(1/12)=12小时。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "乙每小时完成1/12项任务；单独完成用时=1÷(1/12)=12小时。"
        },
        "variation": "直接设乙的单独用时为t，与设效率为x，哪种表达式更适合本章？"
      }
    ],
    "notices": [
      "原书写合作“4天”，与上下文不一致；这里明确校为4小时。"
    ]
  },
  {
    "id": "G10-04",
    "title": "时间差变式的方程范围",
    "group": "第10课时",
    "source": "《教学设计与指导》189页 · 分解与重组②",
    "kind": "boundary",
    "stem": "甲单独完成一项任务比乙多用6小时。甲先做8小时，再由甲乙合作4小时完成。分析数量关系，判断是否仍能直接用本章的一元一次方程求解。",
    "tags": [
      "范围判断",
      "非线性"
    ],
    "facts": [
      {
        "id": "difference",
        "text": "甲单独用时比乙多6小时。",
        "kind": "given"
      },
      {
        "id": "firstHours",
        "text": "甲先独做8小时。",
        "kind": "given"
      },
      {
        "id": "coopHours",
        "text": "甲乙合作4小时后完成。",
        "kind": "given"
      },
      {
        "id": "whole",
        "text": "把整项任务记为1。",
        "kind": "convention"
      },
      {
        "id": "rateRule",
        "text": "效率=完成量÷时间。",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "time",
        "label": "设乙单独用时为t",
        "variable": "t",
        "meaning": "乙单独完成的时间",
        "unit": "小时",
        "domain": "t>0",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "单独用时/小时",
            "效率/任务每小时",
            "实际时间/小时",
            "完成量/任务"
          ],
          "rows": [
            {
              "label": "甲",
              "cells": [
                {
                  "expr": "t+6",
                  "sources": [
                    "difference",
                    "unknown"
                  ]
                },
                {
                  "expr": "1/(t+6)",
                  "sources": [
                    "whole",
                    "difference",
                    "unknown",
                    "rateRule"
                  ]
                },
                {
                  "expr": "8+4",
                  "sources": [
                    "firstHours",
                    "coopHours"
                  ]
                },
                {
                  "expr": "(8+4)/(t+6)",
                  "sources": [
                    "firstHours",
                    "coopHours",
                    "whole",
                    "difference",
                    "unknown",
                    "rateRule"
                  ]
                }
              ]
            },
            {
              "label": "乙",
              "cells": [
                {
                  "expr": "t",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "1/t",
                  "sources": [
                    "whole",
                    "unknown",
                    "rateRule"
                  ]
                },
                {
                  "expr": "4",
                  "sources": [
                    "coopHours"
                  ],
                  "given": true
                },
                {
                  "expr": "4/t",
                  "sources": [
                    "coopHours",
                    "whole",
                    "unknown",
                    "rateRule"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "甲单独用时=乙单独用时+6",
            "两人实际完成量合计为1"
          ],
          "multiply": [
            "完成量=效率×实际时间"
          ]
        },
        "closure": {
          "sources": [
            "whole",
            "coopHours"
          ],
          "text": "两人实际完成量之和为全部任务",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [],
        "answers": [],
        "steps": [
          "(8+4)/(t+6)+4/t=1",
          "12*t+4*(t+6)=t*(t+6)",
          "t^2-10*t-24=0"
        ],
        "checks": [],
        "conclusion": "表格能够正确建模，但未知数出现在分母中，去分母后得到二次方程，超出本章一元一次方程的直接求解范围。",
        "verdict": {
          "correct": "boundary",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "表格能够正确建模，但未知数出现在分母中，去分母后得到二次方程，超出本章一元一次方程的直接求解范围。"
        },
        "variation": "若把“单独用时相差6小时”改为“效率比2∶3”，设效率后会怎样？这是本次建议改写，不是原题。",
        "discussion": "写出总工作量关系，说明为什么这次不能把它当作普通一元一次方程题。可以只讨论模型，不要求解二次方程。"
      }
    ],
    "notices": [
      "原书合作时间写“4天”，这里按上下文明确校为4小时；修正单位后仍不是一元一次方程。"
    ]
  },
  {
    "id": "G10-05",
    "title": "把工程表迁移到相向而行",
    "group": "第10课时",
    "source": "《教学设计与指导》189页 · 问题统一①",
    "kind": "linear",
    "stem": "甲车走完A、B两地全程需18小时，乙车需12小时。甲从A先行8小时后，乙从B向甲行驶。两车保持各自速度，乙出发多少小时后相遇？",
    "tags": [
      "迁移",
      "相遇"
    ],
    "facts": [
      {
        "id": "aHours",
        "text": "甲走完全程需18小时。",
        "kind": "given"
      },
      {
        "id": "bHours",
        "text": "乙走完全程需12小时。",
        "kind": "given"
      },
      {
        "id": "lead",
        "text": "甲比乙早出发8小时。",
        "kind": "given"
      },
      {
        "id": "whole",
        "text": "把A、B两地全程看作1，单位为“全程”，并不表示1千米。",
        "kind": "convention"
      },
      {
        "id": "meet",
        "text": "两车从两端相向行驶，相遇时所走路程之和为全程。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "time",
        "label": "设乙出发后经过x小时",
        "variable": "x",
        "meaning": "乙出发至相遇的时间",
        "unit": "小时",
        "domain": "x≥0",
        "derivations": [
          {
            "id": "aSpeed",
            "label": "甲的速度",
            "expr": "1/18",
            "result": "1/18",
            "sources": [
              "whole",
              "aHours"
            ],
            "explain": "全程1÷18小时。",
            "calculation": "1÷18"
          },
          {
            "id": "bSpeed",
            "label": "乙的速度",
            "expr": "1/12",
            "result": "1/12",
            "sources": [
              "whole",
              "bHours"
            ],
            "explain": "全程1÷12小时。",
            "calculation": "1÷12"
          }
        ],
        "table": {
          "headers": [
            "车辆",
            "速度/全程每小时",
            "时间/小时",
            "路程/全程"
          ],
          "rows": [
            {
              "label": "甲",
              "cells": [
                {
                  "expr": "1/18",
                  "sources": [
                    "aSpeed"
                  ],
                  "given": true
                },
                {
                  "expr": "8+x",
                  "sources": [
                    "lead",
                    "unknown"
                  ]
                },
                {
                  "expr": "(1/18)*(8+x)",
                  "sources": [
                    "aSpeed",
                    "lead",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "乙",
              "cells": [
                {
                  "expr": "1/12",
                  "sources": [
                    "bSpeed"
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
                  "expr": "(1/12)*x",
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
                  "note": "不直接相加"
                },
                {
                  "note": "不同出发时刻，时间不相加"
                },
                {
                  "expr": "1",
                  "sources": [
                    "whole"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "甲行驶时间=乙行驶时间+8",
            "甲路程+乙路程=全程"
          ],
          "multiply": [
            "路程=速度×时间"
          ]
        },
        "closure": {
          "sources": [
            "meet"
          ],
          "text": "相遇时两段路程之和等于全程",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "相遇路程",
            "left": "(1/18)*(8+x)+(1/12)*x",
            "right": "1"
          }
        ],
        "answers": [
          {
            "label": "乙出发后的时间",
            "expr": "4",
            "unit": "小时"
          }
        ],
        "steps": [
          "(8+x)/18+x/12=1",
          "x=(1-8/18)/(1/18+1/12)=4"
        ],
        "checks": [
          {
            "text": "代回全程",
            "expr": "(8+4)/18+4/12",
            "result": "1"
          }
        ],
        "conclusion": "乙出发4小时后相遇。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "乙出发4小时后相遇。"
        },
        "variation": "将“效率、完成量”对应为“速度、路程”，哪些表格关系保持不变？"
      }
    ]
  },
  {
    "id": "G10-06",
    "title": "用同一模型购买文具组合",
    "group": "第10课时",
    "source": "《教学设计与指导》189—190页 · 问题统一②",
    "kind": "linear",
    "stem": "一笔现金恰能买18件A文具，或恰能买12件B文具。先买8件A文具，余款恰好可以买几套组合？每套组合含1件A和1件B。",
    "tags": [
      "迁移",
      "单价",
      "组合"
    ],
    "facts": [
      {
        "id": "aCount",
        "text": "原现金恰能买18件A文具。",
        "kind": "given"
      },
      {
        "id": "bCount",
        "text": "原现金恰能买12件B文具。",
        "kind": "given"
      },
      {
        "id": "first",
        "text": "先买了8件A文具。",
        "kind": "given"
      },
      {
        "id": "set",
        "text": "每套组合包含1件A和1件B。",
        "kind": "given"
      },
      {
        "id": "whole",
        "text": "把原现金总额记作1，单位是“原现金”；它不表示实际有1元。",
        "kind": "convention"
      },
      {
        "id": "spent",
        "text": "购买后恰好用完原现金。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "sets",
        "label": "设余款能买x套",
        "variable": "x",
        "meaning": "余款可买的组合套数",
        "unit": "套",
        "domain": "x是非负整数",
        "derivations": [
          {
            "id": "aPrice",
            "label": "每件A的价格",
            "expr": "1/18",
            "result": "1/18",
            "sources": [
              "whole",
              "aCount"
            ],
            "explain": "原现金1÷可购买18件。",
            "calculation": "1÷18"
          },
          {
            "id": "bPrice",
            "label": "每件B的价格",
            "expr": "1/12",
            "result": "1/12",
            "sources": [
              "whole",
              "bCount"
            ],
            "explain": "原现金1÷可购买12件。",
            "calculation": "1÷12"
          }
        ],
        "table": {
          "headers": [
            "购买部分",
            "单价/原现金每件或每套",
            "数量/件或套",
            "费用/原现金"
          ],
          "rows": [
            {
              "label": "先买A（按件）",
              "cells": [
                {
                  "expr": "1/18",
                  "sources": [
                    "aPrice"
                  ],
                  "given": true
                },
                {
                  "expr": "8",
                  "sources": [
                    "first"
                  ],
                  "given": true
                },
                {
                  "expr": "(1/18)*8",
                  "sources": [
                    "aPrice",
                    "first"
                  ]
                }
              ]
            },
            {
              "label": "后买A+B（按套）",
              "cells": [
                {
                  "expr": "1/18+1/12",
                  "sources": [
                    "aPrice",
                    "bPrice",
                    "set"
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
                  "expr": "(1/18+1/12)*x",
                  "sources": [
                    "aPrice",
                    "bPrice",
                    "set",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "单价不相加为总价"
                },
                {
                  "note": "件与套不直接相加"
                },
                {
                  "expr": "1",
                  "sources": [
                    "whole"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "一套组合价格=A单价+B单价",
            "先买费用+后买费用=原现金"
          ],
          "multiply": [
            "费用=单价×数量"
          ]
        },
        "closure": {
          "sources": [
            "spent"
          ],
          "text": "全部购买费用恰好等于原现金",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "总费用",
            "left": "(1/18)*8+(1/18+1/12)*x",
            "right": "1"
          }
        ],
        "answers": [
          {
            "label": "可买组合数",
            "expr": "4",
            "unit": "套"
          }
        ],
        "steps": [
          "(1/18+1/12)*x=1-8/18",
          "x=(1-8/18)/(1/18+1/12)=4"
        ],
        "checks": [
          {
            "text": "检验总费用",
            "expr": "(8+4)/18+4/12",
            "result": "1"
          }
        ],
        "conclusion": "余款可以买4套，即再买4件A和4件B。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "余款可以买4套，即再买4件A和4件B。"
        },
        "variation": "为什么“x套”不能误读成“A、B合计x件”？"
      }
    ]
  },
  {
    "id": "G10-07",
    "title": "合资买羊的两种方案",
    "group": "第10课时",
    "source": "《教学设计与指导》190页 · 目标检测1",
    "kind": "linear",
    "stem": "一些人合资买羊。若每人出5钱，还差45钱；若每人出7钱，还差3钱。共有多少人？羊价是多少钱？",
    "tags": [
      "盈不足",
      "同一总量"
    ],
    "facts": [
      {
        "id": "planA",
        "text": "每人出5钱，距离羊价还差45钱。",
        "kind": "given"
      },
      {
        "id": "planB",
        "text": "每人出7钱，距离羊价还差3钱。",
        "kind": "given"
      },
      {
        "id": "same",
        "text": "两种筹款方案的人数和所买羊的价格都相同。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "people",
        "label": "设共有x人",
        "variable": "x",
        "meaning": "合资人数",
        "unit": "人",
        "domain": "x是正整数",
        "derivations": [],
        "table": {
          "headers": [
            "方案",
            "每人出钱/钱",
            "人数/人",
            "筹款/钱",
            "羊价/钱"
          ],
          "rows": [
            {
              "label": "每人5钱",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "planA"
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
                  "expr": "5*x",
                  "sources": [
                    "planA",
                    "unknown"
                  ]
                },
                {
                  "expr": "5*x+45",
                  "sources": [
                    "planA",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "每人7钱",
              "cells": [
                {
                  "expr": "7",
                  "sources": [
                    "planB"
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
                  "expr": "7*x",
                  "sources": [
                    "planB",
                    "unknown"
                  ]
                },
                {
                  "expr": "7*x+3",
                  "sources": [
                    "planB",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "筹款+还差的钱=羊价"
          ],
          "multiply": [
            "筹款=每人金额×人数"
          ]
        },
        "closure": {
          "sources": [
            "same"
          ],
          "text": "两种方案对应同一个羊价",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "羊价相等",
            "left": "5*x+45",
            "right": "7*x+3"
          }
        ],
        "answers": [
          {
            "label": "人数",
            "expr": "21",
            "unit": "人"
          },
          {
            "label": "羊价",
            "expr": "150",
            "unit": "钱"
          }
        ],
        "steps": [
          "45-3=(7-5)*x",
          "x=(45-3)/(7-5)=21",
          "5*21+45=150"
        ],
        "checks": [
          {
            "text": "第一方案羊价",
            "expr": "5*21+45",
            "result": "150"
          },
          {
            "text": "第二方案羊价",
            "expr": "7*21+3",
            "result": "150"
          }
        ],
        "conclusion": "共有21人，羊价150钱。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "共有21人，羊价150钱。"
        },
        "variation": "若第一方案改为“多45钱”，价格表达式应如何改变？"
      }
    ]
  },
  {
    "id": "G10-08",
    "title": "先合作后单独铺管道",
    "group": "第10课时",
    "source": "《教学设计与指导》190页 · 目标检测2",
    "kind": "linear",
    "stem": "甲单独铺完一条管道需10天，乙需15天。两队先从两端合作施工2天，此后甲离开，剩下部分由乙独做。乙还需多少天完成？",
    "tags": [
      "工程",
      "阶段"
    ],
    "facts": [
      {
        "id": "aDays",
        "text": "甲单独完成需10天。",
        "kind": "given"
      },
      {
        "id": "bDays",
        "text": "乙单独完成需15天。",
        "kind": "given"
      },
      {
        "id": "first",
        "text": "两队先合作2天，再由乙独做。",
        "kind": "given"
      },
      {
        "id": "whole",
        "text": "把整条管道的工程量记作1。",
        "kind": "convention"
      },
      {
        "id": "done",
        "text": "两个阶段恰好完成整项工程。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "days",
        "label": "设乙还需x天",
        "variable": "x",
        "meaning": "合作后乙独做的时间",
        "unit": "天",
        "domain": "x≥0",
        "derivations": [
          {
            "id": "aRate",
            "label": "甲每天完成量",
            "expr": "1/10",
            "result": "1/10",
            "sources": [
              "whole",
              "aDays"
            ],
            "explain": "总工程1÷10天。",
            "calculation": "1÷10"
          },
          {
            "id": "bRate",
            "label": "乙每天完成量",
            "expr": "1/15",
            "result": "1/15",
            "sources": [
              "whole",
              "bDays"
            ],
            "explain": "总工程1÷15天。",
            "calculation": "1÷15"
          }
        ],
        "table": {
          "headers": [
            "阶段",
            "效率/工程每天",
            "时间/天",
            "完成量/工程"
          ],
          "rows": [
            {
              "label": "两队合作",
              "cells": [
                {
                  "expr": "1/10+1/15",
                  "sources": [
                    "aRate",
                    "bRate"
                  ]
                },
                {
                  "expr": "2",
                  "sources": [
                    "first"
                  ],
                  "given": true
                },
                {
                  "expr": "(1/10+1/15)*2",
                  "sources": [
                    "aRate",
                    "bRate",
                    "first"
                  ]
                }
              ]
            },
            {
              "label": "乙独做",
              "cells": [
                {
                  "expr": "1/15",
                  "sources": [
                    "bRate"
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
                  "expr": "(1/15)*x",
                  "sources": [
                    "bRate",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "阶段效率不相加"
                },
                {
                  "expr": "2+x",
                  "sources": [
                    "first",
                    "unknown"
                  ]
                },
                {
                  "expr": "1",
                  "sources": [
                    "whole"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "合作效率=两队效率之和",
            "合作完成量+乙后做完成量=全部工程"
          ],
          "multiply": [
            "完成量=效率×时间"
          ]
        },
        "closure": {
          "sources": [
            "done"
          ],
          "text": "两个阶段完成量之和为1",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "总工程",
            "left": "(1/10+1/15)*2+(1/15)*x",
            "right": "1"
          }
        ],
        "answers": [
          {
            "label": "乙还需时间",
            "expr": "10",
            "unit": "天"
          }
        ],
        "steps": [
          "x/15=1-2*(1/10+1/15)",
          "x=15*(1-2*(1/10+1/15))=10"
        ],
        "checks": [
          {
            "text": "检验总工程",
            "expr": "2*(1/10+1/15)+10/15",
            "result": "1"
          }
        ],
        "conclusion": "乙还需独做10天。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "乙还需独做10天。"
        },
        "variation": "与“先单独后合作”相比，阶段行怎样变化？"
      }
    ],
    "diagram": "work"
  },
  {
    "id": "G10-09",
    "title": "野鸭与大雁相向而飞",
    "group": "第10课时",
    "source": "《教学设计与指导》190页 · 课后作业1",
    "kind": "linear",
    "stem": "野鸭从南海飞到北海需要7天，大雁从北海飞到南海需要9天。它们沿同一条路线同时从两端相向飞行，保持各自速度，经过几天相遇？",
    "tags": [
      "相遇",
      "全程归一"
    ],
    "facts": [
      {
        "id": "duck",
        "text": "野鸭飞完全程需7天。",
        "kind": "given"
      },
      {
        "id": "goose",
        "text": "大雁飞完全程需9天。",
        "kind": "given"
      },
      {
        "id": "simultaneous",
        "text": "两者同时从两端相向出发。",
        "kind": "given"
      },
      {
        "id": "whole",
        "text": "把两地间全程记为1。",
        "kind": "convention"
      },
      {
        "id": "meet",
        "text": "相遇时两者所飞路程之和为全程。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "days",
        "label": "设相遇时间为x天",
        "variable": "x",
        "meaning": "共同飞行到相遇的时间",
        "unit": "天",
        "domain": "x>0",
        "derivations": [
          {
            "id": "duckRate",
            "label": "野鸭每天飞行路程",
            "expr": "1/7",
            "result": "1/7",
            "sources": [
              "whole",
              "duck"
            ],
            "explain": "全程1÷7天。",
            "calculation": "1÷7"
          },
          {
            "id": "gooseRate",
            "label": "大雁每天飞行路程",
            "expr": "1/9",
            "result": "1/9",
            "sources": [
              "whole",
              "goose"
            ],
            "explain": "全程1÷9天。",
            "calculation": "1÷9"
          }
        ],
        "table": {
          "headers": [
            "对象",
            "速度/全程每天",
            "时间/天",
            "路程/全程"
          ],
          "rows": [
            {
              "label": "野鸭",
              "cells": [
                {
                  "expr": "1/7",
                  "sources": [
                    "duckRate"
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
                  "expr": "(1/7)*x",
                  "sources": [
                    "duckRate",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "大雁",
              "cells": [
                {
                  "expr": "1/9",
                  "sources": [
                    "gooseRate"
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
                  "expr": "(1/9)*x",
                  "sources": [
                    "gooseRate",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "可作为接近速度另作解释"
                },
                {
                  "note": "同一经过时间不相加"
                },
                {
                  "expr": "1",
                  "sources": [
                    "whole"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "两段路程之和为全程"
          ],
          "multiply": [
            "路程=速度×时间"
          ]
        },
        "closure": {
          "sources": [
            "meet"
          ],
          "text": "相遇时路程和等于1",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "相遇路程",
            "left": "(1/7)*x+(1/9)*x",
            "right": "1"
          }
        ],
        "answers": [
          {
            "label": "相遇时间",
            "expr": "63/16",
            "unit": "天"
          }
        ],
        "steps": [
          "(1/7+1/9)*x=1",
          "x=1/(1/7+1/9)=63/16"
        ],
        "checks": [
          {
            "text": "代回路程和",
            "expr": "(63/16)/7+(63/16)/9",
            "result": "1"
          }
        ],
        "conclusion": "经过63/16天相遇。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "经过63/16天相遇。"
        },
        "variation": "把某一方的速度加快，相遇时间会如何变化？用表格解释。"
      }
    ]
  },
  {
    "id": "G10-10",
    "title": "三册小说的印刷工作量",
    "group": "第10课时",
    "source": "《教学设计与指导》190页 · 课后作业2",
    "kind": "linear",
    "stem": "一部小说上、中、下三册的印刷工作量比为4∶4∶2。甲车间20小时印完上册，乙车间30小时印完中册。之后两车间保持各自效率，合作印下册，还需多少小时？",
    "tags": [
      "工作量基准",
      "效率来源"
    ],
    "facts": [
      {
        "id": "ratio",
        "text": "上、中、下册工作量比为4∶4∶2。",
        "kind": "given"
      },
      {
        "id": "aHours",
        "text": "甲20小时完成上册。",
        "kind": "given"
      },
      {
        "id": "bHours",
        "text": "乙30小时完成中册。",
        "kind": "given"
      },
      {
        "id": "unit",
        "text": "把比例中的1份作为工作量单位，上册4份、中册4份、下册2份。",
        "kind": "convention"
      },
      {
        "id": "target",
        "text": "两车间合作完成下册。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "parts",
        "label": "以比例中的1份为单位",
        "variable": "x",
        "meaning": "合作印完下册的时间",
        "unit": "小时",
        "domain": "x≥0",
        "derivations": [
          {
            "id": "aRate",
            "label": "甲每小时完成量",
            "expr": "4/20",
            "result": "1/5",
            "sources": [
              "ratio",
              "unit",
              "aHours"
            ],
            "explain": "甲用20小时印完4份工作量，效率为4÷20。",
            "calculation": "4÷20"
          },
          {
            "id": "bRate",
            "label": "乙每小时完成量",
            "expr": "4/30",
            "result": "2/15",
            "sources": [
              "ratio",
              "unit",
              "bHours"
            ],
            "explain": "乙用30小时印完4份工作量，效率为4÷30。",
            "calculation": "4÷30"
          }
        ],
        "table": {
          "headers": [
            "车间",
            "已知完成量/份",
            "对应时间/小时",
            "效率/份每小时",
            "合作时间/小时",
            "下册完成量/份"
          ],
          "rows": [
            {
              "label": "甲",
              "cells": [
                {
                  "expr": "4",
                  "sources": [
                    "ratio",
                    "unit"
                  ],
                  "given": true
                },
                {
                  "expr": "20",
                  "sources": [
                    "aHours"
                  ],
                  "given": true
                },
                {
                  "expr": "4/20",
                  "sources": [
                    "aRate"
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
                  "expr": "(4/20)*x",
                  "sources": [
                    "aRate",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "乙",
              "cells": [
                {
                  "expr": "4",
                  "sources": [
                    "ratio",
                    "unit"
                  ],
                  "given": true
                },
                {
                  "expr": "30",
                  "sources": [
                    "bHours"
                  ],
                  "given": true
                },
                {
                  "expr": "4/30",
                  "sources": [
                    "bRate"
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
                  "expr": "(4/30)*x",
                  "sources": [
                    "bRate",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "这列指已知工作，不合计"
                },
                {
                  "note": "不同原任务不合计"
                },
                {
                  "note": "合作效率可相加"
                },
                {
                  "note": "共同时间只计一次"
                },
                {
                  "expr": "2",
                  "sources": [
                    "ratio",
                    "unit",
                    "target"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "两车间在下册上的完成量之和为2份"
          ],
          "multiply": [
            "工作量=效率×时间"
          ]
        },
        "closure": {
          "sources": [
            "target",
            "ratio"
          ],
          "text": "合作完成量应等于下册2份",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "下册工作量",
            "left": "(4/20)*x+(4/30)*x",
            "right": "2"
          }
        ],
        "answers": [
          {
            "label": "合作时间",
            "expr": "6",
            "unit": "小时"
          }
        ],
        "steps": [
          "(4/20+4/30)*x=2",
          "x=2/(4/20+4/30)=6"
        ],
        "checks": [
          {
            "text": "代回下册工作量",
            "expr": "(4/20)*6+(4/30)*6",
            "result": "2"
          }
        ],
        "conclusion": "还需合作6小时。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "还需合作6小时。"
        },
        "variation": "如果把上册工作量记作1，下册应写成2÷4=1/2；请据此重列方程。"
      }
    ],
    "notices": [
      "20小时和30小时对应各自一册，不能把它们当作整部小说的完成时间。"
    ]
  },
  {
    "id": "S01",
    "title": "为总价方程编一个故事",
    "group": "小结与思考",
    "source": "《教学设计与指导》192页 · 展示与评价3",
    "kind": "open",
    "stem": "依据方程3x+2(12−x)=32编制一个实际问题，并说明每个数、每个式子的含义。可先研究本次示例：共买12本笔记本，甲类每本3元，乙类每本2元，共花32元。",
    "tags": [
      "编题",
      "总价"
    ],
    "facts": [
      {
        "id": "equation",
        "text": "原书给定方程3x+2(12−x)=32，要求编题。",
        "kind": "given"
      },
      {
        "id": "count",
        "text": "本次示例：两类笔记本合计12本。",
        "kind": "example"
      },
      {
        "id": "priceA",
        "text": "本次示例：甲类笔记本每本3元。",
        "kind": "example"
      },
      {
        "id": "priceB",
        "text": "本次示例：乙类笔记本每本2元。",
        "kind": "example"
      },
      {
        "id": "cost",
        "text": "本次示例：两类笔记本总价32元。",
        "kind": "example"
      }
    ],
    "routes": [
      {
        "id": "sample",
        "label": "分析笔记本示例，再另编一题",
        "variable": "x",
        "meaning": "示例中甲类笔记本数量",
        "unit": "本",
        "domain": "x是0至12之间的整数",
        "derivations": [],
        "table": {
          "headers": [
            "类别",
            "单价/元每本",
            "数量/本",
            "总价/元"
          ],
          "rows": [
            {
              "label": "甲类",
              "cells": [
                {
                  "expr": "3",
                  "sources": [
                    "priceA"
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
                  "expr": "3*x",
                  "sources": [
                    "priceA",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "乙类",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "priceB"
                  ],
                  "given": true
                },
                {
                  "expr": "12-x",
                  "sources": [
                    "count",
                    "unknown"
                  ]
                },
                {
                  "expr": "2*(12-x)",
                  "sources": [
                    "priceB",
                    "count",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "单价不相加"
                },
                {
                  "expr": "12",
                  "sources": [
                    "count"
                  ],
                  "given": true
                },
                {
                  "expr": "32",
                  "sources": [
                    "cost"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "甲数量+乙数量=12",
            "甲总价+乙总价=32"
          ],
          "multiply": [
            "总价=单价×数量"
          ]
        },
        "closure": {
          "sources": [
            "cost"
          ],
          "text": "两类笔记本总价为32元",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "总费用",
            "left": "3*x+2*(12-x)",
            "right": "32"
          }
        ],
        "answers": [
          {
            "label": "示例中甲类数量",
            "expr": "8",
            "unit": "本"
          },
          {
            "label": "示例中乙类数量",
            "expr": "4",
            "unit": "本"
          }
        ],
        "steps": [
          "3*x+24-2*x=32",
          "x=32-24=8",
          "12-8=4"
        ],
        "checks": [
          {
            "text": "示例总价",
            "expr": "3*8+2*4",
            "result": "32"
          }
        ],
        "conclusion": "本次笔记本示例的解为甲类8本、乙类4本；编题答案不唯一，其他合理情境也可。",
        "verdict": {
          "correct": "open",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "本次笔记本示例的解为甲类8本、乙类4本；编题答案不唯一，其他合理情境也可。"
        },
        "variation": "请另编一个同结构的问题，并标明单价、数量、总量分别对应什么。",
        "discussion": "写出你自己编的完整题目。系统只核对示例计算，自由故事由教师阅读。"
      }
    ],
    "notices": [
      "笔记本情境是本次提供的分析示例，原书只给方程并要求学生编题。"
    ]
  },
  {
    "id": "S02",
    "title": "买鸡筹款的盈与不足",
    "group": "小结与思考",
    "source": "《教学设计与指导》193页 · 易错题评析",
    "kind": "linear",
    "stem": "一些人合资买一只鸡。每人出9钱则多11钱；每人出6钱则还差16钱。共有多少人？鸡价多少？同时判断为什么9x+11=6x−16的列式有误。",
    "tags": [
      "盈不足",
      "纠错"
    ],
    "facts": [
      {
        "id": "surplus",
        "text": "每人出9钱，比鸡价多11钱。",
        "kind": "given"
      },
      {
        "id": "shortage",
        "text": "每人出6钱，比鸡价少16钱。",
        "kind": "given"
      },
      {
        "id": "same",
        "text": "两种方案的人数相同，购买同一只鸡。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "people",
        "label": "设共有x人",
        "variable": "x",
        "meaning": "合资人数",
        "unit": "人",
        "domain": "x是正整数",
        "derivations": [],
        "table": {
          "headers": [
            "筹款方案",
            "每人出钱/钱",
            "人数/人",
            "筹得的钱/钱",
            "鸡价/钱"
          ],
          "rows": [
            {
              "label": "每人9钱",
              "cells": [
                {
                  "expr": "9",
                  "sources": [
                    "surplus"
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
                  "expr": "9*x",
                  "sources": [
                    "surplus",
                    "unknown"
                  ]
                },
                {
                  "expr": "9*x-11",
                  "sources": [
                    "surplus",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "每人6钱",
              "cells": [
                {
                  "expr": "6",
                  "sources": [
                    "shortage"
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
                    "shortage",
                    "unknown"
                  ]
                },
                {
                  "expr": "6*x+16",
                  "sources": [
                    "shortage",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "多收的钱扣掉才是鸡价",
            "筹款加上不足才是鸡价"
          ],
          "multiply": [
            "筹款=每人金额×人数"
          ]
        },
        "closure": {
          "sources": [
            "same"
          ],
          "text": "两种方案的鸡价相等",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "鸡价相同",
            "left": "9*x-11",
            "right": "6*x+16"
          }
        ],
        "answers": [
          {
            "label": "人数",
            "expr": "9",
            "unit": "人"
          },
          {
            "label": "鸡价",
            "expr": "70",
            "unit": "钱"
          }
        ],
        "steps": [
          "(9-6)*x=11+16",
          "x=(11+16)/(9-6)=9",
          "9*9-11=70"
        ],
        "checks": [
          {
            "text": "第一方案鸡价",
            "expr": "9*9-11",
            "result": "70"
          },
          {
            "text": "第二方案鸡价",
            "expr": "6*9+16",
            "result": "70"
          }
        ],
        "conclusion": "共有9人，鸡价70钱。原错误列式把“多了要扣掉、少了要补上”的方向颠倒了。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "共有9人，鸡价70钱。原错误列式把“多了要扣掉、少了要补上”的方向颠倒了。"
        },
        "variation": "用“较大量=较小量+差”解释两种筹款方案。"
      }
    ]
  },
  {
    "id": "S03",
    "title": "普通公路与高速公路",
    "group": "小结与思考",
    "source": "《教学设计与指导》194—195页 · 例2",
    "kind": "linear",
    "stem": "汽车从A到B，前1/4路程为普通公路，其余为高速公路。普通公路速度50千米/小时，高速公路速度90千米/小时，总用时4小时。研究两段所用时间和全程路程。",
    "tags": [
      "分段行程",
      "比例来源"
    ],
    "facts": [
      {
        "id": "ordinaryPart",
        "text": "普通公路占全程的1/4，其余为高速公路。",
        "kind": "given"
      },
      {
        "id": "vOrdinary",
        "text": "普通公路速度为50千米/小时。",
        "kind": "given"
      },
      {
        "id": "vHighway",
        "text": "高速公路速度为90千米/小时。",
        "kind": "given"
      },
      {
        "id": "totalTime",
        "text": "全程总用时4小时。",
        "kind": "given"
      },
      {
        "id": "whole",
        "text": "把全程的比例记作1，即100%。",
        "kind": "convention"
      }
    ],
    "routes": [
      {
        "id": "time",
        "label": "设普通公路用时为x",
        "variable": "x",
        "meaning": "普通公路所用时间",
        "unit": "小时",
        "domain": "0<x<4",
        "derivations": [
          {
            "id": "highwayPart",
            "label": "高速公路占全程的比例",
            "expr": "1-1/4",
            "result": "3/4",
            "sources": [
              "whole",
              "ordinaryPart"
            ],
            "explain": "全部比例1减去普通公路1/4。",
            "calculation": "1-1÷4"
          },
          {
            "id": "distanceRatio",
            "label": "高速与普通路程的倍数",
            "expr": "(3/4)/(1/4)",
            "result": "3",
            "sources": [
              "highwayPart",
              "ordinaryPart"
            ],
            "explain": "高速的3/4份除以普通的1/4份。",
            "calculation": "(3÷4)÷(1÷4)"
          }
        ],
        "table": {
          "headers": [
            "路段",
            "速度/千米每小时",
            "时间/小时",
            "路程/千米"
          ],
          "rows": [
            {
              "label": "普通公路",
              "cells": [
                {
                  "expr": "50",
                  "sources": [
                    "vOrdinary"
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
                  "expr": "50*x",
                  "sources": [
                    "vOrdinary",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "高速公路",
              "cells": [
                {
                  "expr": "90",
                  "sources": [
                    "vHighway"
                  ],
                  "given": true
                },
                {
                  "expr": "4-x",
                  "sources": [
                    "totalTime",
                    "unknown"
                  ]
                },
                {
                  "expr": "90*(4-x)",
                  "sources": [
                    "vHighway",
                    "totalTime",
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
                  "expr": "4",
                  "sources": [
                    "totalTime"
                  ],
                  "given": true
                },
                {
                  "note": "高速路程是普通路程的3倍，见来源推导"
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "两段时间和为4小时"
          ],
          "multiply": [
            "路程=速度×时间",
            "高速路程=普通路程×3"
          ]
        },
        "closure": {
          "sources": [
            "ordinaryPart"
          ],
          "text": "普通公路占1/4，所以高速路程为普通的3倍",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "两段路程的比例",
            "left": "3*50*x",
            "right": "90*(4-x)"
          }
        ],
        "answers": [
          {
            "label": "普通公路时间",
            "expr": "1.5",
            "unit": "小时"
          },
          {
            "label": "高速公路时间",
            "expr": "2.5",
            "unit": "小时"
          },
          {
            "label": "全程路程",
            "expr": "300",
            "unit": "千米"
          }
        ],
        "steps": [
          "150*x=360-90*x",
          "x=360/(150+90)=1.5",
          "50*1.5+90*(4-1.5)=300"
        ],
        "checks": [
          {
            "text": "总用时",
            "expr": "1.5+2.5",
            "result": "4"
          },
          {
            "text": "普通路程比例",
            "expr": "(50*1.5)/(50*1.5+90*2.5)",
            "result": "1/4"
          }
        ],
        "conclusion": "普通公路用时1.5小时，高速2.5小时；全程300千米。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "普通公路用时1.5小时，高速2.5小时；全程300千米。"
        },
        "variation": "路程的1∶3为什么不能直接用来分配4小时？"
      },
      {
        "id": "distance",
        "label": "设全程路程为s",
        "variable": "s",
        "meaning": "全程路程",
        "unit": "千米",
        "domain": "s>0",
        "derivations": [
          {
            "id": "highwayPart",
            "label": "高速公路占全程的比例",
            "expr": "1-1/4",
            "result": "3/4",
            "sources": [
              "whole",
              "ordinaryPart"
            ],
            "explain": "全部比例1减去普通公路1/4。",
            "calculation": "1-1÷4"
          }
        ],
        "table": {
          "headers": [
            "路段",
            "速度/千米每小时",
            "路程/千米",
            "时间/小时"
          ],
          "rows": [
            {
              "label": "普通公路",
              "cells": [
                {
                  "expr": "50",
                  "sources": [
                    "vOrdinary"
                  ],
                  "given": true
                },
                {
                  "expr": "(1/4)*s",
                  "sources": [
                    "ordinaryPart",
                    "unknown"
                  ]
                },
                {
                  "expr": "((1/4)*s)/50",
                  "sources": [
                    "ordinaryPart",
                    "unknown",
                    "vOrdinary"
                  ]
                }
              ]
            },
            {
              "label": "高速公路",
              "cells": [
                {
                  "expr": "90",
                  "sources": [
                    "vHighway"
                  ],
                  "given": true
                },
                {
                  "expr": "(1-1/4)*s",
                  "sources": [
                    "whole",
                    "ordinaryPart",
                    "unknown"
                  ]
                },
                {
                  "expr": "((1-1/4)*s)/90",
                  "sources": [
                    "whole",
                    "ordinaryPart",
                    "unknown",
                    "vHighway"
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
                  "expr": "s",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "4",
                  "sources": [
                    "totalTime"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "两段时间和为4小时"
          ],
          "multiply": [
            "路程=全程×所占比例",
            "时间=路程÷速度"
          ]
        },
        "closure": {
          "sources": [
            "totalTime"
          ],
          "text": "两段行车时间的和为4小时",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "总时间",
            "left": "((1/4)*s)/50+((1-1/4)*s)/90",
            "right": "4"
          }
        ],
        "answers": [
          {
            "label": "全程路程",
            "expr": "300",
            "unit": "千米"
          }
        ],
        "steps": [
          "s*(1/4/50+(1-1/4)/90)=4",
          "s=4/(1/4/50+(1-1/4)/90)=300"
        ],
        "checks": [
          {
            "text": "代回行车时间",
            "expr": "((1/4)*300)/50+((1-1/4)*300)/90",
            "result": "4"
          }
        ],
        "conclusion": "全程300千米。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "全程300千米。"
        },
        "variation": "两种设元各用了哪个条件填表、哪个条件列方程？"
      }
    ],
    "notices": [
      "原书允许学生根据时间或路程自主提问；本模块明确选择两段时间与全程路程作为研究目标。"
    ]
  },
  {
    "id": "S04",
    "title": "300度电的分段费用",
    "group": "小结与思考",
    "source": "《教学设计与指导》195页 · 例3（1）",
    "kind": "arithmetic",
    "stem": "电价规则：前200度每度0.5元；超过200度至450度的部分每度0.7元；超过450度的部分每度1元。某户七月用了300度电，应付多少元？",
    "tags": [
      "阶梯费用",
      "分段"
    ],
    "facts": [
      {
        "id": "firstTier",
        "text": "前200度按每度0.5元收费。",
        "kind": "given"
      },
      {
        "id": "secondTier",
        "text": "超过200度至450度的部分按每度0.7元收费。",
        "kind": "given"
      },
      {
        "id": "thirdTier",
        "text": "超过450度的部分按每度1元收费。",
        "kind": "given"
      },
      {
        "id": "usage",
        "text": "七月用电300度。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "fees",
        "label": "按收费段分别计算",
        "variable": "x",
        "meaning": "总电费",
        "unit": "元",
        "domain": "总电费非负；本题可直接计算，不必设元列方程",
        "derivations": [],
        "table": {
          "headers": [
            "收费段",
            "单价/元每度",
            "本段电量/度",
            "费用/元"
          ],
          "rows": [
            {
              "label": "前200度",
              "cells": [
                {
                  "expr": "0.5",
                  "sources": [
                    "firstTier"
                  ],
                  "given": true
                },
                {
                  "expr": "200",
                  "sources": [
                    "firstTier"
                  ],
                  "given": true
                },
                {
                  "expr": "0.5*200",
                  "sources": [
                    "firstTier"
                  ]
                }
              ]
            },
            {
              "label": "超过200度的部分",
              "cells": [
                {
                  "expr": "0.7",
                  "sources": [
                    "secondTier"
                  ],
                  "given": true
                },
                {
                  "expr": "300-200",
                  "sources": [
                    "usage",
                    "firstTier"
                  ]
                },
                {
                  "expr": "0.7*(300-200)",
                  "sources": [
                    "secondTier",
                    "usage",
                    "firstTier"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "单价不相加"
                },
                {
                  "expr": "300",
                  "sources": [
                    "usage"
                  ],
                  "given": true
                },
                {
                  "expr": "0.5*200+0.7*(300-200)",
                  "sources": [
                    "firstTier",
                    "secondTier",
                    "usage"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "各收费段费用之和=总电费"
          ],
          "multiply": [
            "每段费用=该段单价×该段电量"
          ]
        },
        "closure": {
          "sources": [
            "usage",
            "firstTier",
            "secondTier"
          ],
          "text": "按300度实际跨过的收费段合计费用",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [],
        "answers": [
          {
            "label": "总电费",
            "expr": "170",
            "unit": "元"
          }
        ],
        "steps": [
          "300-200=100",
          "0.5*200+0.7*(300-200)=100+70=170"
        ],
        "checks": [
          {
            "text": "计费电量合计",
            "expr": "200+(300-200)",
            "result": "300"
          },
          {
            "text": "计费金额合计",
            "expr": "0.5*200+0.7*(300-200)",
            "result": "170"
          }
        ],
        "conclusion": "应付170元。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "应付170元。"
        },
        "variation": "把第二段电量写成300度，重复计算了哪一部分？"
      }
    ],
    "diagram": "tiers",
    "diagramData": {
      "thresholds": [
        200,
        450
      ],
      "usage": 300
    }
  },
  {
    "id": "S05",
    "title": "两个月500度与290元",
    "group": "小结与思考",
    "source": "《教学设计与指导》195—196页 · 例3（2）",
    "kind": "branching",
    "stem": "电价规则：前200度每度0.5元；超过200度至450度的部分每度0.7元；超过450度的部分每度1元。五月和六月共用500度，共付290元。六月用电多于五月，而且每个月都少于450度。求两个月各用多少度。",
    "tags": [
      "阶梯费用",
      "先分类"
    ],
    "facts": [
      {
        "id": "firstTier",
        "text": "前200度按每度0.5元收费。",
        "kind": "given"
      },
      {
        "id": "secondTier",
        "text": "超过200度至450度的部分按每度0.7元收费。",
        "kind": "given"
      },
      {
        "id": "thirdTier",
        "text": "超过450度的部分按每度1元收费。",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "五月、六月用电合计500度。",
        "kind": "given"
      },
      {
        "id": "fee",
        "text": "两月合计电费290元。",
        "kind": "given"
      },
      {
        "id": "order",
        "text": "六月用电多于五月。",
        "kind": "given"
      },
      {
        "id": "range",
        "text": "两个月用电量都少于450度。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "months",
        "label": "设五月用电x度",
        "variable": "x",
        "meaning": "五月用电量",
        "unit": "度",
        "domain": "先判断月份档次；五月>500−450且五月≤200，六月为500−x",
        "derivations": [
          {
            "id": "bothFirstMax",
            "label": "两月均在第一档的最大总电量",
            "expr": "200+200",
            "result": "400",
            "sources": [
              "firstTier"
            ],
            "explain": "每月都不超过200度，两月最多400度，小于题目500度。",
            "calculation": "200+200"
          },
          {
            "id": "bothSecondFee",
            "label": "假如两月都进入第二档的合计费用",
            "expr": "0.5*(200+200)+0.7*(500-200-200)",
            "result": "270",
            "sources": [
              "firstTier",
              "secondTier",
              "total"
            ],
            "explain": "两月各有前200度，其余合计500−200−200度。所得270元与题目290元不同。",
            "calculation": "0.5×(200+200)+0.7×(500-200-200)"
          },
          {
            "id": "lowerMay",
            "label": "六月少于450度对应的五月边界",
            "expr": "500-450",
            "result": "50",
            "sources": [
              "total",
              "range"
            ],
            "explain": "六月=500−五月<450，所以五月>500−450。",
            "calculation": "500-450"
          }
        ],
        "table": {
          "headers": [
            "月份与收费段",
            "单价/元每度",
            "本段电量/度",
            "费用/元"
          ],
          "rows": [
            {
              "label": "五月第一档",
              "cells": [
                {
                  "expr": "0.5",
                  "sources": [
                    "firstTier"
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
                  "expr": "0.5*x",
                  "sources": [
                    "firstTier",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "六月前200度",
              "cells": [
                {
                  "expr": "0.5",
                  "sources": [
                    "firstTier"
                  ],
                  "given": true
                },
                {
                  "expr": "200",
                  "sources": [
                    "firstTier"
                  ],
                  "given": true
                },
                {
                  "expr": "0.5*200",
                  "sources": [
                    "firstTier"
                  ]
                }
              ]
            },
            {
              "label": "六月超过200度的部分",
              "cells": [
                {
                  "expr": "0.7",
                  "sources": [
                    "secondTier"
                  ],
                  "given": true
                },
                {
                  "expr": "(500-x)-200",
                  "sources": [
                    "total",
                    "unknown",
                    "firstTier"
                  ]
                },
                {
                  "expr": "0.7*((500-x)-200)",
                  "sources": [
                    "secondTier",
                    "total",
                    "unknown",
                    "firstTier"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "单价不相加"
                },
                {
                  "expr": "500",
                  "sources": [
                    "total"
                  ],
                  "given": true
                },
                {
                  "expr": "290",
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
            "两月用电和=500",
            "各收费段电费合计=290"
          ],
          "multiply": [
            "每段费用=该段单价×该段电量"
          ]
        },
        "closure": {
          "sources": [
            "fee"
          ],
          "text": "两月各收费段费用之和为290元",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "总电费",
            "left": "0.5*x+0.5*200+0.7*((500-x)-200)",
            "right": "290"
          }
        ],
        "answers": [
          {
            "label": "五月用电量",
            "expr": "100",
            "unit": "度"
          },
          {
            "label": "六月用电量",
            "expr": "400",
            "unit": "度"
          }
        ],
        "steps": [
          "0.5*x+100+0.7*(300-x)=290",
          "310-0.2*x=290",
          "x=(310-290)/0.2=100",
          "500-100=400"
        ],
        "checks": [
          {
            "text": "两月电量",
            "expr": "100+400",
            "result": "500"
          },
          {
            "text": "两月费用",
            "expr": "0.5*100+0.5*200+0.7*(400-200)",
            "result": "290"
          }
        ],
        "conclusion": "五月100度、六月400度；六月更多，且两月均少于450度，所选档次成立。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "五月100度、六月400度；六月更多，且两月均少于450度，所选档次成立。"
        },
        "variation": "如果总费用改成270元，能不能仍唯一确定两月电量？"
      }
    ],
    "notices": [
      "先排除两月都在第一档、两月都进入第二档，再使用表中的第一档/第二档分法。"
    ],
    "diagram": "tiers",
    "diagramData": {
      "thresholds": [
        200,
        450
      ],
      "total": 500
    }
  },
  {
    "id": "S06",
    "title": "总电费能唯一确定档次吗",
    "group": "小结与思考",
    "source": "《教学设计与指导》196页 · 差异化任务",
    "kind": "branching",
    "stem": "电价规则：前200度每度0.5元；超过200度至450度的部分每度0.7元；超过450度的部分每度1元。明确保留条件：五月、六月共用500度，六月用电更多，每月均少于450度。两月电费合计m元。根据m判断两月档次，并讨论是否一定唯一。",
    "tags": [
      "参数分类",
      "不唯一"
    ],
    "facts": [
      {
        "id": "firstTier",
        "text": "前200度按每度0.5元收费。",
        "kind": "given"
      },
      {
        "id": "secondTier",
        "text": "超过200度至450度的部分按每度0.7元收费。",
        "kind": "given"
      },
      {
        "id": "thirdTier",
        "text": "超过450度的部分按每度1元收费。",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "本模块明确保留：两月总电量500度。",
        "kind": "given"
      },
      {
        "id": "order",
        "text": "本模块明确保留：六月用电量大于五月。",
        "kind": "given"
      },
      {
        "id": "range",
        "text": "本模块明确保留：每个月都少于450度。",
        "kind": "given"
      },
      {
        "id": "parameter",
        "text": "两个月电费合计为m元。",
        "kind": "given"
      },
      {
        "id": "continuous",
        "text": "用电量允许取非负实数；如只取整数度，费用也只能取相应可达值。",
        "kind": "convention"
      }
    ],
    "routes": [
      {
        "id": "classify",
        "label": "设五月用电为x，讨论m",
        "variable": "x",
        "meaning": "五月用电量",
        "unit": "度",
        "domain": "500−450<x<500÷2；请先推导这两个边界",
        "derivations": [
          {
            "id": "mayMin",
            "label": "五月用电量的严格下界",
            "expr": "500-450",
            "result": "50",
            "sources": [
              "total",
              "range"
            ],
            "explain": "六月少于450度，因此五月大于500−450。",
            "calculation": "500-450"
          },
          {
            "id": "mayMax",
            "label": "五月用电量的严格上界",
            "expr": "500/2",
            "result": "250",
            "sources": [
              "total",
              "order"
            ],
            "explain": "六月比五月多，所以五月少于总量的一半。",
            "calculation": "500÷2"
          },
          {
            "id": "sameFee",
            "label": "两月都进入第二档时的合计费用",
            "expr": "0.5*(200+200)+0.7*(500-200-200)",
            "result": "270",
            "sources": [
              "firstTier",
              "secondTier",
              "total"
            ],
            "explain": "先合计两月前200度的费用，再算余下的电量。",
            "calculation": "0.5×(200+200)+0.7×(500-200-200)"
          },
          {
            "id": "feeBoundary",
            "label": "五月趋近下界时的费用边界",
            "expr": "0.5*(500-450)+0.5*200+0.7*(450-200)",
            "result": "300",
            "sources": [
              "total",
              "range",
              "firstTier",
              "secondTier"
            ],
            "explain": "五月=50、六月=450是边界，因每月严格少于450，这个组合不在原范围内。",
            "calculation": "0.5×(500-450)+0.5×200+0.7×(450-200)"
          }
        ],
        "table": {
          "headers": [
            "可能档次",
            "五月电量范围/度",
            "总费用关系",
            "可行费用范围/元"
          ],
          "rows": [
            {
              "label": "五月第一档、六月第二档",
              "cells": [
                {
                  "note": "50<x≤200"
                },
                {
                  "note": "m=0.5x+0.5×200+0.7((500−x)−200)"
                },
                {
                  "note": "270≤m<300"
                }
              ]
            },
            {
              "label": "两月都进入第二档",
              "cells": [
                {
                  "note": "200<x<250"
                },
                {
                  "note": "m=0.5×(200+200)+0.7×(500−200−200)=270"
                },
                {
                  "note": "m=270"
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "两月用电合计500度",
            "所有收费段电费合计m元"
          ],
          "multiply": [
            "分段费用=单价×分段电量"
          ]
        },
        "closure": {
          "sources": [
            "parameter",
            "total",
            "order",
            "range"
          ],
          "text": "同时满足总电量、总费用、大小顺序及各月范围",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [],
        "answers": [],
        "steps": [
          "m=0.5*x+0.5*200+0.7*((500-x)-200)=310-0.2*x",
          "m=0.5*(200+200)+0.7*(500-200-200)=270"
        ],
        "checks": [
          {
            "text": "五月200、六月300时的费用",
            "expr": "0.5*200+0.5*200+0.7*(300-200)",
            "result": "270"
          },
          {
            "text": "五月220、六月280时的费用",
            "expr": "0.5*(200+200)+0.7*((220-200)+(280-200))",
            "result": "270"
          }
        ],
        "conclusion": "270<m<300时必为第一档与第二档；m=270时，200与300度、220与280度都可行，月份档次不唯一。其余m在这些明确条件下无可行解。",
        "verdict": {
          "correct": "multiple",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "270<m<300时必为第一档与第二档；m=270时，200与300度、220与280度都可行，月份档次不唯一。其余m在这些明确条件下无可行解。"
        },
        "variation": "如果允许某月达到或超过450度，原来的费用范围怎样改变？先写清新的条件。",
        "discussion": "请解释两种档次组合的费用范围；当m=270时，构造两组电量并检查总量、费用和大小顺序。"
      }
    ],
    "notices": [
      "原书“在上面的情境中”条件承接有歧义；本模块已在题面明示保留的条件。",
      "此题为分类讨论，不把m=270强制判断成唯一档次。"
    ],
    "diagram": "tiers",
    "diagramData": {
      "thresholds": [
        200,
        450
      ],
      "total": 500
    }
  },
  {
    "id": "S07",
    "title": "为价差方程编题",
    "group": "小结与思考",
    "source": "《教学设计与指导》196—197页 · 目标检测2",
    "kind": "open",
    "stem": "依据3(28−x)−2x=34编制实际问题。可先分析原书的示例：小明和小丽共买28本笔记本，小明买的每本3元，小丽买的每本2元，小明比小丽多花34元。",
    "tags": [
      "编题",
      "金额差"
    ],
    "facts": [
      {
        "id": "equation",
        "text": "原书给定方程3(28−x)−2x=34，要求编题。",
        "kind": "given"
      },
      {
        "id": "count",
        "text": "原书示例：两人合计买28本。",
        "kind": "given"
      },
      {
        "id": "mingPrice",
        "text": "小明买的每本3元。",
        "kind": "given"
      },
      {
        "id": "liPrice",
        "text": "小丽买的每本2元。",
        "kind": "given"
      },
      {
        "id": "difference",
        "text": "小明比小丽多花34元。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "sample",
        "label": "分析原书示例，再自己编题",
        "variable": "x",
        "meaning": "示例中小丽买的本数",
        "unit": "本",
        "domain": "x是0至28之间的整数",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "单价/元每本",
            "本数/本",
            "费用/元"
          ],
          "rows": [
            {
              "label": "小明",
              "cells": [
                {
                  "expr": "3",
                  "sources": [
                    "mingPrice"
                  ],
                  "given": true
                },
                {
                  "expr": "28-x",
                  "sources": [
                    "count",
                    "unknown"
                  ]
                },
                {
                  "expr": "3*(28-x)",
                  "sources": [
                    "mingPrice",
                    "count",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "小丽",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "liPrice"
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
                  "expr": "2*x",
                  "sources": [
                    "liPrice",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计或比较",
              "cells": [
                {
                  "note": "不相加"
                },
                {
                  "expr": "28",
                  "sources": [
                    "count"
                  ],
                  "given": true
                },
                {
                  "note": "小明费用=小丽费用+34"
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "两人本数之和=28",
            "小明费用=小丽费用+34"
          ],
          "multiply": [
            "费用=单价×数量"
          ]
        },
        "closure": {
          "sources": [
            "difference"
          ],
          "text": "两人费用差为34元",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "价差关系",
            "left": "3*(28-x)",
            "right": "2*x+34"
          }
        ],
        "answers": [
          {
            "label": "小丽买的本数",
            "expr": "10",
            "unit": "本"
          },
          {
            "label": "小明买的本数",
            "expr": "18",
            "unit": "本"
          }
        ],
        "steps": [
          "84-3*x=2*x+34",
          "x=(84-34)/(3+2)=10",
          "28-10=18"
        ],
        "checks": [
          {
            "text": "两人总本数",
            "expr": "18+10",
            "result": "28"
          },
          {
            "text": "两人费用差",
            "expr": "3*18-2*10",
            "result": "34"
          }
        ],
        "conclusion": "原书示例中小丽买10本、小明买18本。自由编题允许其他完整且自洽的情境。",
        "verdict": {
          "correct": "open",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "原书示例中小丽买10本、小明买18本。自由编题允许其他完整且自洽的情境。"
        },
        "variation": "把34改解释为总费用，还能用原方程吗？说明必须改哪条关系。",
        "discussion": "另编一个与原方程结构相符的问题，并解释34所代表的差。"
      }
    ],
    "notices": [
      "原书笔记本故事只是示例，编题不限定人物或物品。"
    ]
  },
  {
    "id": "S08",
    "title": "500度电跨过三个收费段",
    "group": "小结与思考",
    "source": "《教学设计与指导》196—197页 · 目标检测3（1）",
    "kind": "arithmetic",
    "stem": "电价规则：前200度每度0.5元；超过200度至450度的部分每度0.7元；超过450度的部分每度1元。某户七月用了500度电，应付多少元？",
    "tags": [
      "阶梯费用",
      "分段长度"
    ],
    "facts": [
      {
        "id": "firstTier",
        "text": "前200度按每度0.5元收费。",
        "kind": "given"
      },
      {
        "id": "secondTier",
        "text": "超过200度至450度的部分按每度0.7元收费。",
        "kind": "given"
      },
      {
        "id": "thirdTier",
        "text": "超过450度的部分按每度1元收费。",
        "kind": "given"
      },
      {
        "id": "usage",
        "text": "本月用电500度。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "fees",
        "label": "按三个收费段计算",
        "variable": "x",
        "meaning": "总电费",
        "unit": "元",
        "domain": "本题可直接计算，不必列方程",
        "derivations": [],
        "table": {
          "headers": [
            "收费段",
            "单价/元每度",
            "本段电量/度",
            "费用/元"
          ],
          "rows": [
            {
              "label": "前200度",
              "cells": [
                {
                  "expr": "0.5",
                  "sources": [
                    "firstTier"
                  ],
                  "given": true
                },
                {
                  "expr": "200",
                  "sources": [
                    "firstTier"
                  ],
                  "given": true
                },
                {
                  "expr": "0.5*200",
                  "sources": [
                    "firstTier"
                  ]
                }
              ]
            },
            {
              "label": "超过200度至450度",
              "cells": [
                {
                  "expr": "0.7",
                  "sources": [
                    "secondTier"
                  ],
                  "given": true
                },
                {
                  "expr": "450-200",
                  "sources": [
                    "firstTier",
                    "secondTier"
                  ]
                },
                {
                  "expr": "0.7*(450-200)",
                  "sources": [
                    "firstTier",
                    "secondTier"
                  ]
                }
              ]
            },
            {
              "label": "超过450度",
              "cells": [
                {
                  "expr": "1",
                  "sources": [
                    "thirdTier"
                  ],
                  "given": true
                },
                {
                  "expr": "500-450",
                  "sources": [
                    "usage",
                    "thirdTier"
                  ]
                },
                {
                  "expr": "1*(500-450)",
                  "sources": [
                    "usage",
                    "thirdTier"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "单价不相加"
                },
                {
                  "expr": "500",
                  "sources": [
                    "usage"
                  ],
                  "given": true
                },
                {
                  "expr": "0.5*200+0.7*(450-200)+1*(500-450)",
                  "sources": [
                    "firstTier",
                    "secondTier",
                    "thirdTier",
                    "usage"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "各收费段电量相加等于500",
            "各段费用相加为总费"
          ],
          "multiply": [
            "分段费用=本段单价×本段电量"
          ]
        },
        "closure": {
          "sources": [
            "usage",
            "firstTier",
            "secondTier",
            "thirdTier"
          ],
          "text": "分别计算实际跨过的三个收费段后合计",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [],
        "answers": [
          {
            "label": "总电费",
            "expr": "325",
            "unit": "元"
          }
        ],
        "steps": [
          "450-200=250",
          "500-450=50",
          "0.5*200+0.7*(450-200)+1*(500-450)=100+175+50=325"
        ],
        "checks": [
          {
            "text": "电量合计",
            "expr": "200+(450-200)+(500-450)",
            "result": "500"
          },
          {
            "text": "电费合计",
            "expr": "0.5*200+0.7*(450-200)+1*(500-450)",
            "result": "325"
          }
        ],
        "conclusion": "应付325元。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "应付325元。"
        },
        "variation": "第二收费段为什么是450−200度，而不是450度？"
      }
    ],
    "diagram": "tiers",
    "diagramData": {
      "thresholds": [
        200,
        450
      ],
      "usage": 500
    }
  },
  {
    "id": "S09",
    "title": "两个月800度与575元",
    "group": "小结与思考",
    "source": "《教学设计与指导》196—197页 · 目标检测3（2）",
    "kind": "branching",
    "stem": "电价规则：前200度每度0.5元；超过200度至450度的部分每度0.7元；超过450度的部分每度1元。五月和六月共用800度，共付575元，六月用电多于五月。两个月各用了多少度？先根据总量与费用判断两个月的档次。",
    "tags": [
      "阶梯费用",
      "分类迁移"
    ],
    "facts": [
      {
        "id": "firstTier",
        "text": "前200度按每度0.5元收费。",
        "kind": "given"
      },
      {
        "id": "secondTier",
        "text": "超过200度至450度的部分按每度0.7元收费。",
        "kind": "given"
      },
      {
        "id": "thirdTier",
        "text": "超过450度的部分按每度1元收费。",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "五月、六月两个月的总电量为800度。",
        "kind": "given"
      },
      {
        "id": "fee",
        "text": "两月电费合计575元。",
        "kind": "given"
      },
      {
        "id": "order",
        "text": "六月用电多于五月。",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "months",
        "label": "设五月用电x度",
        "variable": "x",
        "meaning": "五月用电量",
        "unit": "度",
        "domain": "先分类：五月<800÷2；排除两月第二档以及第二/第三档后，得到0≤x≤200",
        "derivations": [
          {
            "id": "mayMax",
            "label": "五月电量的严格上界",
            "expr": "800/2",
            "result": "400",
            "sources": [
              "total",
              "order"
            ],
            "explain": "六月更多，所以五月少于总量一半。",
            "calculation": "800÷2"
          },
          {
            "id": "thirdBoundary",
            "label": "六月恰为450度时五月的电量",
            "expr": "800-450",
            "result": "350",
            "sources": [
              "total",
              "thirdTier"
            ],
            "explain": "六月=800−五月；用450度作分段边界。",
            "calculation": "800-450"
          },
          {
            "id": "bothSecondFee",
            "label": "两月都在第二档时的合计费用",
            "expr": "0.5*(200+200)+0.7*(800-200-200)",
            "result": "480",
            "sources": [
              "firstTier",
              "secondTier",
              "total"
            ],
            "explain": "两月各自前200度按第一档，其余按第二档。",
            "calculation": "0.5×(200+200)+0.7×(800-200-200)"
          },
          {
            "id": "secondThirdMax",
            "label": "五月达到200度边界时的两月费用",
            "expr": "0.5*(200+200)+0.7*(450-200)+1*((800-200)-450)",
            "result": "525",
            "sources": [
              "firstTier",
              "secondTier",
              "thirdTier",
              "total"
            ],
            "explain": "五月从200度继续增加时，第二/第三档组合的合计费用下降，所以这一组合费用不超过这个边界值。",
            "calculation": "0.5×(200+200)+0.7×(450-200)+1×((800-200)-450)"
          }
        ],
        "table": {
          "headers": [
            "月份与收费段",
            "单价/元每度",
            "本段电量/度",
            "费用/元"
          ],
          "rows": [
            {
              "label": "五月第一档",
              "cells": [
                {
                  "expr": "0.5",
                  "sources": [
                    "firstTier"
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
                  "expr": "0.5*x",
                  "sources": [
                    "firstTier",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "六月前200度",
              "cells": [
                {
                  "expr": "0.5",
                  "sources": [
                    "firstTier"
                  ],
                  "given": true
                },
                {
                  "expr": "200",
                  "sources": [
                    "firstTier"
                  ],
                  "given": true
                },
                {
                  "expr": "0.5*200",
                  "sources": [
                    "firstTier"
                  ]
                }
              ]
            },
            {
              "label": "六月第二收费段",
              "cells": [
                {
                  "expr": "0.7",
                  "sources": [
                    "secondTier"
                  ],
                  "given": true
                },
                {
                  "expr": "450-200",
                  "sources": [
                    "firstTier",
                    "secondTier"
                  ]
                },
                {
                  "expr": "0.7*(450-200)",
                  "sources": [
                    "firstTier",
                    "secondTier"
                  ]
                }
              ]
            },
            {
              "label": "六月第三收费段",
              "cells": [
                {
                  "expr": "1",
                  "sources": [
                    "thirdTier"
                  ],
                  "given": true
                },
                {
                  "expr": "(800-x)-450",
                  "sources": [
                    "total",
                    "thirdTier",
                    "unknown"
                  ]
                },
                {
                  "expr": "1*((800-x)-450)",
                  "sources": [
                    "total",
                    "thirdTier",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "单价不相加"
                },
                {
                  "expr": "800",
                  "sources": [
                    "total"
                  ],
                  "given": true
                },
                {
                  "expr": "575",
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
            "两月电量之和=800",
            "各收费段费用之和=575"
          ],
          "multiply": [
            "分段费用=单价×本段电量"
          ]
        },
        "closure": {
          "sources": [
            "fee"
          ],
          "text": "所选第一/第三档组合的总费用等于575元",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "两月总电费",
            "left": "0.5*x+0.5*200+0.7*(450-200)+1*((800-x)-450)",
            "right": "575"
          }
        ],
        "answers": [
          {
            "label": "五月用电量",
            "expr": "100",
            "unit": "度"
          },
          {
            "label": "六月用电量",
            "expr": "700",
            "unit": "度"
          }
        ],
        "steps": [
          "0.5*x+100+175+350-x=575",
          "625-0.5*x=575",
          "x=(625-575)/0.5=100",
          "800-100=700"
        ],
        "checks": [
          {
            "text": "电量合计",
            "expr": "100+700",
            "result": "800"
          },
          {
            "text": "电费合计",
            "expr": "0.5*100+0.5*200+0.7*(450-200)+(700-450)",
            "result": "575"
          }
        ],
        "conclusion": "五月100度、六月700度，费用分别50元与525元，总费用575元，所选档次符合答案。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "五月100度、六月700度，费用分别50元与525元，总费用575元，所选档次符合答案。"
        },
        "variation": "为什么不能照搬500度那题，把六月仍放在第二档？"
      }
    ],
    "notices": [
      "先计算两月第二档的费用：0.5×(200+200)+0.7×(800−200−200)；再计算五月处在200度边界时第二/第三档组合的费用：0.5×(200+200)+0.7×(450−200)+((800−200)−450)。将所得结果与575元比较，排除这两种组合，才使用第一/第三档表格。"
    ],
    "diagram": "tiers",
    "diagramData": {
      "thresholds": [
        200,
        450
      ],
      "total": 800
    }
  },
  {
    "id": "S10",
    "title": "不同起点的登山追及",
    "group": "小结与思考",
    "source": "《教学设计与指导》197页 · 课后作业2",
    "kind": "linear",
    "stem": "甲乙两队沿同一条山路同时向山峰出发。甲从距大本营1千米的一号营地出发，速度1.2千米/小时；乙从距大本营3千米的二号营地出发，速度0.8千米/小时。保持速度且路线足够长，几小时后甲在途中追上乙？",
    "tags": [
      "追及",
      "位置"
    ],
    "facts": [
      {
        "id": "aStart",
        "text": "甲出发点距大本营1千米。",
        "kind": "given"
      },
      {
        "id": "bStart",
        "text": "乙出发点距大本营3千米。",
        "kind": "given"
      },
      {
        "id": "aSpeed",
        "text": "甲速度1.2千米/小时。",
        "kind": "given"
      },
      {
        "id": "bSpeed",
        "text": "乙速度0.8千米/小时。",
        "kind": "given"
      },
      {
        "id": "time",
        "text": "两队同时出发，沿同一山路同方向前进。",
        "kind": "given"
      },
      {
        "id": "catch",
        "text": "追上时距大本营的位置相同。",
        "kind": "given"
      },
      {
        "id": "position",
        "text": "现位置=起点位置+沿同方向行进的路程。",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "hours",
        "label": "设出发后x小时追上",
        "variable": "x",
        "meaning": "出发至追上的共同时间",
        "unit": "小时",
        "domain": "x≥0",
        "derivations": [],
        "table": {
          "headers": [
            "队伍",
            "起点距大本营/千米",
            "速度/千米每小时",
            "时间/小时",
            "行进路程/千米",
            "位置距大本营/千米"
          ],
          "rows": [
            {
              "label": "甲",
              "cells": [
                {
                  "expr": "1",
                  "sources": [
                    "aStart"
                  ],
                  "given": true
                },
                {
                  "expr": "1.2",
                  "sources": [
                    "aSpeed"
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
                  "expr": "1.2*x",
                  "sources": [
                    "aSpeed",
                    "unknown"
                  ]
                },
                {
                  "expr": "1+1.2*x",
                  "sources": [
                    "aStart",
                    "aSpeed",
                    "unknown",
                    "position"
                  ]
                }
              ]
            },
            {
              "label": "乙",
              "cells": [
                {
                  "expr": "3",
                  "sources": [
                    "bStart"
                  ],
                  "given": true
                },
                {
                  "expr": "0.8",
                  "sources": [
                    "bSpeed"
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
                  "expr": "0.8*x",
                  "sources": [
                    "bSpeed",
                    "unknown"
                  ]
                },
                {
                  "expr": "3+0.8*x",
                  "sources": [
                    "bStart",
                    "bSpeed",
                    "unknown",
                    "position"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "位置=起点位置+行进路程"
          ],
          "multiply": [
            "行进路程=速度×时间"
          ]
        },
        "closure": {
          "sources": [
            "catch"
          ],
          "text": "追上时两队位置相同",
          "hint": "哪些条件已经用于填表？还需要满足哪一个独立条件？"
        },
        "equations": [
          {
            "label": "相同位置",
            "left": "1+1.2*x",
            "right": "3+0.8*x"
          }
        ],
        "answers": [
          {
            "label": "追上所需时间",
            "expr": "5",
            "unit": "小时"
          },
          {
            "label": "追上处距大本营",
            "expr": "7",
            "unit": "千米"
          }
        ],
        "steps": [
          "(1.2-0.8)*x=3-1",
          "x=(3-1)/(1.2-0.8)=5",
          "1+1.2*5=7"
        ],
        "checks": [
          {
            "text": "甲追上时的位置",
            "expr": "1+1.2*5",
            "result": "7"
          },
          {
            "text": "乙追上时的位置",
            "expr": "3+0.8*5",
            "result": "7"
          }
        ],
        "conclusion": "5小时后追上，相遇位置距大本营7千米；两队各自行进路程不同。",
        "verdict": {
          "correct": "valid",
          "prompt": "怎样判断这个结果或结论？",
          "explain": "5小时后追上，相遇位置距大本营7千米；两队各自行进路程不同。"
        },
        "variation": "若把两人的行进路程写成相等，忽略了哪一项原始数据？"
      }
    ],
    "notices": [
      "“在途中追上”以两队未到终点为前提；本模块明确假定路线足够长。"
    ],
    "diagram": "chase",
    "diagramData": {
      "aStart": 1,
      "bStart": 3,
      "aSpeed": 1.2,
      "bSpeed": 0.8,
      "clock": "simultaneous"
    }
  }
];
if(typeof module==='object'&&module.exports)module.exports=data;else(root.RatioWordProblemsData ||= []).push(...data);
})(typeof window==='undefined'?globalThis:window);
