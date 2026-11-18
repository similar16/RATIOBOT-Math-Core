/* Textbook chapter 4, introductory modeling tasks. Each source and extension is explicit. */
(function(root){
  const data = [
  {
    "id": "TB-I01",
    "textbookItemId": "I01",
    "title": "高铁的速度、时间与路程",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，106页 · 例1（1）",
    "kind": "linear",
    "stem": "高铁列车以v千米/小时的平均速度行驶0.5小时，路程为150千米.根据等量关系列等式，再在模块中求平均速度.",
    "tags": [
      "速度×时间",
      "列等式"
    ],
    "facts": [
      {
        "id": "time",
        "text": "行驶时间为0.5小时",
        "kind": "given"
      },
      {
        "id": "distance",
        "text": "行驶路程为150千米",
        "kind": "given"
      },
      {
        "id": "rule",
        "text": "在同一行驶过程里，路程＝平均速度×时间",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设列车的平均速度为v",
        "variable": "v",
        "meaning": "列车的平均速度",
        "unit": "千米/小时",
        "domain": "v>0",
        "derivations": [],
        "table": {
          "headers": [
            "对象",
            "平均速度/千米每小时",
            "时间/小时",
            "路程/千米"
          ],
          "rows": [
            {
              "label": "列车",
              "cells": [
                {
                  "expr": "v",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "0.5",
                  "sources": [
                    "time"
                  ],
                  "given": true
                },
                {
                  "expr": "0.5*v",
                  "sources": [
                    "time",
                    "unknown",
                    "rule"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [],
          "multiply": [
            "平均速度×时间＝路程"
          ]
        },
        "closure": {
          "sources": [
            "distance"
          ],
          "text": "表中由速度与时间表示的路程等于150千米.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "0.5*v",
            "right": "150",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "平均速度",
            "expr": "300",
            "unit": "千米/小时"
          }
        ],
        "steps": [
          "0.5*v=150",
          "v=150/0.5",
          "v=300"
        ],
        "checks": [
          {
            "text": "速度乘行驶时间",
            "expr": "300*0.5",
            "result": "150"
          }
        ],
        "conclusion": "平均速度为300千米/小时；行驶0.5小时正好是150千米.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "如果行驶时间改成1小时，表中哪个量与方程的哪个部分需要改变？"
      }
    ],
    "notices": [
      "原题要求根据情境列等式；本模块接着求解和检验，作为明确标注的学习延伸."
    ],
    "originalStem": "根据下列情境中的等量关系列出一个等式：某高铁列车以v km/h的平均速度行驶0.5 h，行驶的路程为150 km.",
    "originalStems": {
      "I01": "根据下列情境中的等量关系列出一个等式：某高铁列车以v km/h的平均速度行驶0.5 h，行驶的路程为150 km."
    }
  },
  {
    "id": "TB-I02",
    "textbookItemId": "I02",
    "title": "按盐水质量比配制",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，106页 · 例1（3）",
    "kind": "linear",
    "stem": "盐与水的质量比为1∶10，用x克盐配成550克盐水.根据等量关系列等式，再求盐和水的质量.",
    "tags": [
      "质量比",
      "部分和总量"
    ],
    "facts": [
      {
        "id": "ratio",
        "text": "盐与水的质量比为1∶10",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "配成的盐水总质量为550克",
        "kind": "given"
      },
      {
        "id": "massRule",
        "text": "盐的质量＋水的质量＝盐水的质量",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设盐的质量为x",
        "variable": "x",
        "meaning": "盐的质量",
        "unit": "克",
        "domain": "x>0",
        "derivations": [
          {
            "id": "waterFactor",
            "label": "水相对盐的质量倍数",
            "expr": "10/1",
            "result": "10",
            "sources": [
              "ratio"
            ],
            "explain": "由配比中水的10份除以盐的1份，得到水的质量是盐的10倍."
          }
        ],
        "table": {
          "headers": [
            "成分",
            "相对盐的质量倍数",
            "质量/克"
          ],
          "rows": [
            {
              "label": "盐",
              "cells": [
                {
                  "expr": "1",
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
                }
              ]
            },
            {
              "label": "水",
              "cells": [
                {
                  "expr": "10",
                  "sources": [
                    "waterFactor"
                  ],
                  "given": true
                },
                {
                  "expr": "10*x",
                  "sources": [
                    "waterFactor",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "盐水合计",
              "cells": [
                {
                  "note": "无需另算合计倍数"
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
            "盐的质量＋水的质量＝盐水总质量"
          ],
          "multiply": [
            "盐的质量×水相对盐的倍数＝水的质量"
          ]
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "两种成分的质量和为550克.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "x+10*x",
            "right": "550",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "盐的质量",
            "expr": "50",
            "unit": "克"
          },
          {
            "label": "水的质量",
            "expr": "500",
            "unit": "克"
          }
        ],
        "steps": [
          "x+10*x=550",
          "(1+10)*x=550",
          "x=550/(1+10)",
          "x=50",
          "10*50=500"
        ],
        "checks": [
          {
            "text": "盐与水合计",
            "expr": "50+500",
            "result": "550"
          },
          {
            "text": "水相对盐的倍数",
            "expr": "500/50",
            "result": "10"
          }
        ],
        "conclusion": "需盐50克、水500克，合计550克，质量比符合1∶10.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "如果改设水的质量，盐的质量应怎样表示？"
      }
    ],
    "notices": [
      "原题要求根据情境列等式；本模块接着求解和检验，作为明确标注的学习延伸."
    ],
    "originalStem": "根据下列情境中的等量关系列出一个等式：按盐和水的质量之比为1∶10的配比，把x g盐配成550 g的盐水.",
    "originalStems": {
      "I02": "根据下列情境中的等量关系列出一个等式：按盐和水的质量之比为1∶10的配比，把x g盐配成550 g的盐水."
    }
  },
  {
    "id": "TB-I03",
    "textbookItemId": "I03",
    "title": "天平：同时去掉砝码再等分",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，107页 · 活动（1）",
    "kind": "linear",
    "stem": "图4-2中，左盘有2个每个质量为x克的小球和1个1克砝码，右盘有5个1克砝码，天平平衡.两边先各去掉1克，再把两边的质量都分成2份.写出初始及每步操作的等式，并解释操作为什么保持平衡.",
    "tags": [
      "等式性质",
      "天平操作"
    ],
    "facts": [
      {
        "id": "left",
        "text": "左盘有2个相同小球和1个1克砝码",
        "kind": "given"
      },
      {
        "id": "right",
        "text": "右盘有5个1克砝码",
        "kind": "given"
      },
      {
        "id": "balance",
        "text": "天平平衡时两盘总质量相等；两边减去相等质量、或同时等分为相同份数，仍保持相等",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设一个小球的质量为x",
        "variable": "x",
        "meaning": "一个小球的质量",
        "unit": "克",
        "domain": "x>0",
        "derivations": [
          {
            "id": "rightMass",
            "label": "右盘砝码总质量",
            "expr": "5*1",
            "result": "5",
            "sources": [
              "right"
            ],
            "explain": "5个砝码，每个1克，总质量用个数乘单个质量."
          }
        ],
        "table": {
          "headers": [
            "托盘",
            "盘中物体",
            "总质量/克"
          ],
          "rows": [
            {
              "label": "左盘",
              "cells": [
                {
                  "note": "2个相同小球＋1个1克砝码",
                  "sources": [
                    "left"
                  ]
                },
                {
                  "expr": "2*x+1",
                  "sources": [
                    "left",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "右盘",
              "cells": [
                {
                  "note": "5个1克砝码",
                  "sources": [
                    "right"
                  ]
                },
                {
                  "expr": "5",
                  "sources": [
                    "rightMass"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "小球质量＋砝码质量＝每盘总质量",
            "左盘总质量＝右盘总质量"
          ],
          "multiply": [
            "相同小球个数×每个质量＝小球总质量"
          ]
        },
        "closure": {
          "sources": [
            "balance"
          ],
          "text": "天平平衡，左盘总质量＝右盘总质量.用表中的总质量列出初始方程.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "2*x+1",
            "right": "5",
            "label": "初始平衡"
          }
        ],
        "answers": [
          {
            "label": "每个小球的质量",
            "expr": "2",
            "unit": "克"
          }
        ],
        "steps": [
          "2*x+1=5",
          "2*x=5-1",
          "x=(5-1)/2",
          "x=2"
        ],
        "checks": [
          {
            "text": "左盘总质量",
            "expr": "2*2+1",
            "result": "5"
          },
          {
            "text": "去掉砝码后每份的质量",
            "expr": "(5-1)/2",
            "result": "2"
          }
        ],
        "conclusion": "每个小球重2克.两盘同时减去1克不改变相等关系；余下两个相同小球对应两份相等质量，再将两边同除以2.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "若只从一边去掉砝码，等式为什么不再保持？解释同时除以2中“2”对应什么.",
        "tableNote": "只填写每盘的总质量.小球质量与砝码质量直接写在同一个算式里.",
        "scratchPrompt": "先在两边各去掉1克，再把两边的质量都分成2份.在草稿纸上写出每步等式，并说明为什么仍然相等."
      }
    ],
    "notices": [
      "图4-2的物体数量及操作按原图转述.先列初始方程，再在草稿纸中记录去掉砝码和等分的过程，说明操作为什么保持平衡."
    ],
    "contentRevision": 1,
    "originalStem": "如图4-2（1），天平平衡.对天平两边进行如图4-2（2）所示的操作，可以在保持天平平衡的状态下称出一个小球的质量.请写出每一步操作对应的等式，并解释对应等式的实际意义，你能否说出等式是如何变形的？你能说明变形的合理性吗？",
    "originalStems": {
      "I03": "如图4-2（1），天平平衡.对天平两边进行如图4-2（2）所示的操作，可以在保持天平平衡的状态下称出一个小球的质量.请写出每一步操作对应的等式，并解释对应等式的实际意义，你能否说出等式是如何变形的？你能说明变形的合理性吗？"
    },
    "sourceFigure": {
      "file": "figures/balance-steps.svg",
      "alt": "图4-2：初始天平及去掉砝码、等分后的操作"
    }
  },
  {
    "id": "TB-I04",
    "textbookItemId": "I04",
    "title": "天平：同时移去相同小球",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，107页 · 活动（2）",
    "kind": "linear",
    "stem": "图4-3中，左盘有3个质量均为y克的小球；右盘有1个同样的小球和6个1克砝码.天平平衡.设计保持平衡的操作，写出各步等式并求每个小球的质量.",
    "tags": [
      "等式性质",
      "天平操作"
    ],
    "facts": [
      {
        "id": "left",
        "text": "左盘有3个质量相同的小球",
        "kind": "given"
      },
      {
        "id": "right",
        "text": "右盘有1个同样的小球和6个1克砝码",
        "kind": "given"
      },
      {
        "id": "balance",
        "text": "天平平衡时两盘总质量相等；两边减去相等质量、或同时等分为相同份数，仍保持相等",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设每个小球的质量为y",
        "variable": "y",
        "meaning": "每个小球的质量",
        "unit": "克",
        "domain": "y>0",
        "derivations": [
          {
            "id": "rightMass",
            "label": "右盘砝码质量",
            "expr": "6*1",
            "result": "6",
            "sources": [
              "right"
            ],
            "explain": "右盘6个砝码，每个1克，总质量为6×1."
          }
        ],
        "table": {
          "headers": [
            "托盘",
            "盘中物体",
            "总质量/克"
          ],
          "rows": [
            {
              "label": "左盘",
              "cells": [
                {
                  "note": "3个相同小球",
                  "sources": [
                    "left"
                  ]
                },
                {
                  "expr": "3*y",
                  "sources": [
                    "left",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "右盘",
              "cells": [
                {
                  "note": "1个相同小球＋6个1克砝码",
                  "sources": [
                    "right"
                  ]
                },
                {
                  "expr": "y+6",
                  "sources": [
                    "rightMass",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "右盘小球质量＋砝码质量＝右盘总质量",
            "两盘总质量相等"
          ],
          "multiply": [
            "小球个数×每个质量＝小球总质量"
          ]
        },
        "closure": {
          "sources": [
            "balance"
          ],
          "text": "天平平衡，左盘总质量＝右盘总质量.用表中的总质量列出初始方程.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "3*y",
            "right": "y+6",
            "label": "初始平衡"
          }
        ],
        "answers": [
          {
            "label": "一个小球的质量",
            "expr": "3",
            "unit": "克"
          }
        ],
        "steps": [
          "3*y=y+6",
          "(3-1)*y=6",
          "y=6/(3-1)",
          "y=3"
        ],
        "checks": [
          {
            "text": "左盘总质量",
            "expr": "3*3",
            "result": "9"
          },
          {
            "text": "右盘总质量",
            "expr": "3+6",
            "result": "9"
          }
        ],
        "conclusion": "每个小球重3克.两边各移去1个相同小球，相当于等式两边同时减y；左边剩余3−1个小球，再同时除以3−1.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "将“移去1个小球”改写成等式变形，说明两边为什么都要减y.",
        "tableNote": "只填写每盘的总质量.有小球和砝码时，把两部分质量相加.",
        "scratchPrompt": "设计两边同时进行、能保持平衡的操作，在草稿纸上写出各步等式并说明理由，再求每个小球的质量."
      }
    ],
    "contentRevision": 1,
    "originalStem": "如图4-3，仿照上述过程设计天平操作过程，求出小球的质量y，写出每一步操作对应的等式，并解释等式的变形过程.",
    "originalStems": {
      "I04": "如图4-3，仿照上述过程设计天平操作过程，求出小球的质量y，写出每一步操作对应的等式，并解释等式的变形过程."
    },
    "sourceFigure": {
      "file": "figures/balance-y.svg",
      "alt": "图4-3：左盘3个小球，右盘1个小球和6个1克砝码"
    }
  },
  {
    "id": "TB-I05",
    "textbookItemId": "I05",
    "title": "一个数的一半再加2",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，108页 · 练习1（1）",
    "kind": "linear",
    "stem": "比a的一半多2的数是5.先根据文字中的等量关系列等式，再求这个数.",
    "tags": [
      "数的关系",
      "运算次序"
    ],
    "facts": [
      {
        "id": "half",
        "text": "“a的一半”表示把a平均分成2份，取其中1份",
        "kind": "property"
      },
      {
        "id": "more",
        "text": "在a的一半的基础上再加2",
        "kind": "given"
      },
      {
        "id": "result",
        "text": "所得的数是5",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设原来的数为a",
        "variable": "a",
        "meaning": "原来的数",
        "unit": "",
        "domain": "a为实数",
        "derivations": [],
        "table": {
          "headers": [
            "数量",
            "表达式"
          ],
          "rows": [
            {
              "label": "a的一半多2",
              "cells": [
                {
                  "expr": "a/2+2",
                  "sources": [
                    "half",
                    "more",
                    "unknown"
                  ],
                  "alternatives": [
                    {
                      "expr": "(1/2)*a+2",
                      "sources": [
                        "half",
                        "more",
                        "unknown"
                      ],
                      "explain": "取一半就是乘二分之一."
                    },
                    {
                      "expr": "0.5*a+2",
                      "sources": [
                        "half",
                        "more",
                        "unknown"
                      ],
                      "explain": "取一半也可以表示为乘0.5."
                    }
                  ]
                }
              ]
            },
            {
              "label": "题目给定的数",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "result"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "原数的一半＋2＝5"
          ],
          "multiply": [
            "一半×2＝原数"
          ]
        },
        "closure": {
          "sources": [
            "result"
          ],
          "text": "先取一半，再加2，结果为5.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "a/2+2",
            "right": "5",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "原数",
            "expr": "6",
            "unit": ""
          }
        ],
        "steps": [
          "a/2+2=5",
          "a/2=5-2",
          "a=(5-2)*2",
          "a=6"
        ],
        "checks": [
          {
            "text": "按原顺序运算",
            "expr": "6/2+2",
            "result": "5"
          }
        ],
        "conclusion": "原数为6；先除以2再加2，得到5.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "“a与2的和的一半是5”和本题的运算顺序有什么不同？",
        "tableNote": "只填写“a的一半多2”这一个表达式，再与题目给定的5相等."
      }
    ],
    "notices": [
      "原题要求根据情境列等式；本模块接着求解和检验，作为明确标注的学习延伸.",
      "此题是数的关系文字题，作为列方程基础任务保留."
    ],
    "originalStem": "根据下列情境中的等量关系列出一个等式：比a的一半多2的数是5.",
    "originalStems": {
      "I05": "根据下列情境中的等量关系列出一个等式：比a的一半多2的数是5."
    },
    "contentRevision": 1
  },
  {
    "id": "TB-I06",
    "textbookItemId": "I06",
    "title": "从长绳上剪下两段",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，108页 · 练习1（2）",
    "kind": "linear",
    "stem": "从20米长的绳子上剪下2段，每段都是x米，剩下6米.根据长度关系列等式，再求每段短绳的长度.",
    "tags": [
      "长度守恒",
      "等量分段"
    ],
    "facts": [
      {
        "id": "total",
        "text": "长绳原长20米",
        "kind": "given"
      },
      {
        "id": "cut",
        "text": "剪下2段，每段长x米",
        "kind": "given"
      },
      {
        "id": "remain",
        "text": "还剩6米",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设每段剪下短绳的长度为x",
        "variable": "x",
        "meaning": "每段剪下短绳的长度",
        "unit": "米",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "部分",
            "每段长度/米",
            "段数",
            "长度合计/米"
          ],
          "rows": [
            {
              "label": "剪下部分",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "2",
                  "sources": [
                    "cut"
                  ],
                  "given": true
                },
                {
                  "expr": "2*x",
                  "sources": [
                    "cut",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "剩余部分",
              "cells": [
                {
                  "note": "直接给出整段长度"
                },
                {
                  "note": "不另分段"
                },
                {
                  "expr": "6",
                  "sources": [
                    "remain"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "原长绳",
              "cells": [
                {
                  "note": "不合计单段长度"
                },
                {
                  "note": "不需要合计段数"
                },
                {
                  "expr": "20",
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
            "剪下的总长度＋剩余长度＝原长"
          ],
          "multiply": [
            "每段长度×剪下段数＝剪下总长度"
          ]
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "剪去的2段和剩余6米合起来是20米.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "2*x+6",
            "right": "20",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "每段短绳长度",
            "expr": "7",
            "unit": "米"
          }
        ],
        "steps": [
          "2*x+6=20",
          "2*x=20-6",
          "x=(20-6)/2",
          "x=7",
          "2*7=14"
        ],
        "checks": [
          {
            "text": "剪下部分与剩余长度之和",
            "expr": "2*7+6",
            "result": "20"
          }
        ],
        "conclusion": "每段剪下7米，剪下14米后剩6米.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "若剪下的两段不一样长，只给总长20米和剩6米，还能唯一确定每段长度吗？"
      }
    ],
    "notices": [
      "原题要求根据情境列等式；本模块接着求解和检验，作为明确标注的学习延伸."
    ],
    "originalStem": "根据下列情境中的等量关系列出一个等式：从一根长20 m的长绳上剪下两段长都为x m的短绳，还剩6 m.",
    "originalStems": {
      "I06": "根据下列情境中的等量关系列出一个等式：从一根长20 m的长绳上剪下两段长都为x m的短绳，还剩6 m."
    }
  },
  {
    "id": "TB-I07",
    "textbookItemId": "I07",
    "title": "连排正方形的火柴棒",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，108页 · 练习1（3）",
    "kind": "linear",
    "stem": "按原图将正方形横向一个接一个地搭起来，每个正方形由4根火柴构成，相邻正方形共用1根边.搭n个正方形恰好用100根.根据图意列等式，再判断能搭多少个完整正方形.",
    "tags": [
      "图形规律",
      "共享边"
    ],
    "facts": [
      {
        "id": "first",
        "text": "原图第1个正方形有4根火柴",
        "kind": "given"
      },
      {
        "id": "shared",
        "text": "每再添1个正方形，与原图形共用1根边",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "共用100根火柴",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设完整正方形的个数为n",
        "variable": "n",
        "meaning": "完整正方形的个数",
        "unit": "个",
        "domain": "n为正整数",
        "derivations": [
          {
            "id": "increment",
            "label": "后添1个正方形的新增根数",
            "expr": "4-1",
            "result": "3",
            "sources": [
              "first",
              "shared"
            ],
            "explain": "新正方形原有4条边，其中1条已与旧图形共用，所以新增4−1根."
          }
        ],
        "table": {
          "headers": [
            "构成",
            "正方形个数",
            "每个新增/根",
            "火柴数/根"
          ],
          "rows": [
            {
              "label": "第1个",
              "cells": [
                {
                  "expr": "1",
                  "sources": [
                    "first"
                  ],
                  "given": true
                },
                {
                  "expr": "4",
                  "sources": [
                    "first"
                  ],
                  "given": true
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
              "label": "后添的正方形",
              "cells": [
                {
                  "expr": "n-1",
                  "sources": [
                    "first",
                    "unknown"
                  ]
                },
                {
                  "expr": "3",
                  "sources": [
                    "increment"
                  ],
                  "given": true
                },
                {
                  "expr": "3*(n-1)",
                  "sources": [
                    "increment",
                    "first",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "expr": "n",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "note": "每个新增量不相加"
                },
                {
                  "expr": "100",
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
            "首个用量＋后来各次新增用量＝总用量"
          ],
          "multiply": [
            "后添个数×每次新增根数＝后添总用量"
          ]
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "首个用4根，其余n−1个各新增4−1根，总数是100.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "4+3*(n-1)",
            "right": "100",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "完整正方形个数",
            "expr": "33",
            "unit": "个"
          }
        ],
        "steps": [
          "4+(4-1)*(n-1)=100",
          "3*(n-1)=100-4",
          "n-1=(100-4)/3",
          "n=(100-4)/3+1",
          "n=33"
        ],
        "checks": [
          {
            "text": "按原图共享边计数",
            "expr": "4+(33-1)*(4-1)",
            "result": "100"
          }
        ],
        "conclusion": "能搭33个连排正方形.每次新增3根来自4−1，不能把这一规律当作没有来源的数字.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "如果改成彼此不共边的独立正方形，数量表的哪一列、哪一项关系会改变？"
      }
    ],
    "notices": [
      "原题要求根据情境列等式；本模块接着求解和检验，作为明确标注的学习延伸."
    ],
    "originalStem": "根据下列情境中的等量关系列出一个等式：按如图所示的方式搭正方形，搭n个正方形恰好用了100根火柴棒.",
    "originalStems": {
      "I07": "根据下列情境中的等量关系列出一个等式：按如图所示的方式搭正方形，搭n个正方形恰好用了100根火柴棒."
    },
    "sourceFigure": {
      "file": "figures/match-squares.svg",
      "alt": "按教材搭1个、2个、3个相连正方形"
    }
  },
  {
    "id": "TB-I08",
    "textbookItemId": "I08",
    "title": "两盘都有小球的天平",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，109页 · 问题1",
    "kind": "linear",
    "stem": "图4-4中，左盘有2个相同小球和1个1克砝码，右盘有1个同样的小球和5个1克砝码，天平平衡.求每个小球的质量.",
    "tags": [
      "天平平衡",
      "两边含未知数"
    ],
    "facts": [
      {
        "id": "left",
        "text": "左盘2个相同小球和1个1克砝码",
        "kind": "given"
      },
      {
        "id": "right",
        "text": "右盘1个同样的小球和5个1克砝码",
        "kind": "given"
      },
      {
        "id": "balance",
        "text": "天平平衡时两盘总质量相等；两边减去相等质量、或同时等分为相同份数，仍保持相等",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设每个小球的质量为x",
        "variable": "x",
        "meaning": "每个小球的质量",
        "unit": "克",
        "domain": "x>0",
        "derivations": [
          {
            "id": "rightMass",
            "label": "右盘砝码质量",
            "expr": "5*1",
            "result": "5",
            "sources": [
              "right"
            ],
            "explain": "右盘共有5个1克砝码，所以质量为5×1."
          }
        ],
        "table": {
          "headers": [
            "托盘",
            "小球质量/克",
            "砝码质量/克",
            "总质量/克"
          ],
          "rows": [
            {
              "label": "左盘",
              "cells": [
                {
                  "expr": "2*x",
                  "sources": [
                    "left",
                    "unknown"
                  ]
                },
                {
                  "expr": "1",
                  "sources": [
                    "left"
                  ],
                  "given": true
                },
                {
                  "expr": "2*x+1",
                  "sources": [
                    "left",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "右盘",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "right",
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "5",
                  "sources": [
                    "rightMass"
                  ],
                  "given": true
                },
                {
                  "expr": "x+5",
                  "sources": [
                    "rightMass",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "小球质量＋砝码质量＝每盘总质量",
            "左盘总质量＝右盘总质量"
          ],
          "multiply": [
            "小球个数×单个质量＝小球总质量"
          ]
        },
        "closure": {
          "sources": [
            "balance"
          ],
          "text": "两边都有小球；比较每盘全部物体的总质量.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "2*x+1",
            "right": "x+5",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "每个小球的质量",
            "expr": "4",
            "unit": "克"
          }
        ],
        "steps": [
          "2*x+1=x+5",
          "(2-1)*x=5-1",
          "x=(5-1)/(2-1)",
          "x=4"
        ],
        "checks": [
          {
            "text": "左盘总质量",
            "expr": "2*4+1",
            "result": "9"
          },
          {
            "text": "右盘总质量",
            "expr": "4+5",
            "result": "9"
          }
        ],
        "conclusion": "每个小球重4克，两盘总质量都为9克.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "能否先各移去1个小球，再各移去1克？用表中的格子解释这些操作."
      }
    ],
    "originalStem": "如图4-4，天平两边托盘中小球的质量是多少？",
    "originalStems": {
      "I08": "如图4-4，天平两边托盘中小球的质量是多少？"
    },
    "sourceFigure": {
      "file": "figures/balance-x.svg",
      "alt": "图4-4：两盘都有相同小球的平衡天平"
    }
  },
  {
    "id": "TB-I09",
    "textbookItemId": "I09",
    "title": "篮球联赛的胜负场数",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，109页 · 问题2",
    "kind": "linear",
    "stem": "篮球联赛胜1场得2分、负1场得1分.球队共比赛12场，积分20分.该队胜、负各多少场？",
    "tags": [
      "总场数与总得分",
      "改设一元"
    ],
    "facts": [
      {
        "id": "win",
        "text": "胜1场得2分",
        "kind": "given"
      },
      {
        "id": "loss",
        "text": "负1场得1分",
        "kind": "given"
      },
      {
        "id": "games",
        "text": "共比赛12场",
        "kind": "given"
      },
      {
        "id": "points",
        "text": "总积分20分",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设获胜场数为x",
        "variable": "x",
        "meaning": "获胜场数",
        "unit": "场",
        "domain": "x为0至12之间的整数",
        "derivations": [],
        "table": {
          "headers": [
            "比赛结果",
            "每场积分/分",
            "场数/场",
            "积分/分"
          ],
          "rows": [
            {
              "label": "获胜",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "win"
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
                    "win",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "失利",
              "cells": [
                {
                  "expr": "1",
                  "sources": [
                    "loss"
                  ],
                  "given": true
                },
                {
                  "expr": "12-x",
                  "sources": [
                    "games",
                    "unknown"
                  ]
                },
                {
                  "expr": "1*(12-x)",
                  "sources": [
                    "loss",
                    "games",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "单场积分不相加"
                },
                {
                  "expr": "12",
                  "sources": [
                    "games"
                  ],
                  "given": true
                },
                {
                  "expr": "20",
                  "sources": [
                    "points"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "胜场＋负场＝12场",
            "获胜积分＋失利积分＝20分"
          ],
          "multiply": [
            "每场得分×场数＝该类积分"
          ]
        },
        "closure": {
          "sources": [
            "points"
          ],
          "text": "场数总量已用于表示负场数，另用积分总量20分列方程.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "2*x+1*(12-x)",
            "right": "20",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "胜场",
            "expr": "8",
            "unit": "场"
          },
          {
            "label": "负场",
            "expr": "4",
            "unit": "场"
          }
        ],
        "steps": [
          "2*x+1*(12-x)=20",
          "(2-1)*x=20-12",
          "x=(20-12)/(2-1)",
          "x=8",
          "12-8=4"
        ],
        "checks": [
          {
            "text": "比赛场数合计",
            "expr": "8+4",
            "result": "12"
          },
          {
            "text": "积分合计",
            "expr": "2*8+1*4",
            "result": "20"
          }
        ],
        "conclusion": "球队胜8场、负4场；既满足总场数，也满足总积分.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "原书分析可以分别设胜负场数；改用一个未知数时，哪一个已知条件把两个未知量联系起来？"
      }
    ],
    "notices": [
      "原书的分析曾分别设两个未知数；这里明确选择胜场数x，并用12−x表示负场数."
    ],
    "originalStem": "篮球联赛规则规定：胜一场得2分，负一场得1分.第一中学球队赛了12场，共得20分，该球队胜、负各多少场？",
    "originalStems": {
      "I09": "篮球联赛规则规定：胜一场得2分，负一场得1分.第一中学球队赛了12场，共得20分，该球队胜、负各多少场？"
    }
  },
  {
    "id": "TB-I10",
    "textbookItemId": "I10",
    "title": "一个数加上它的七分之一",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，110页 · 尝试：古埃及求未知数问题",
    "kind": "linear",
    "stem": "古埃及求未知数问题：一个数加上它的七分之一，其和等于19.求这个数，并根据题意列方程.",
    "tags": [
      "数的关系",
      "分数系数"
    ],
    "facts": [
      {
        "id": "fraction",
        "text": "另一部分是原数的1/7",
        "kind": "given"
      },
      {
        "id": "sum",
        "text": "原数与它的1/7的和等于19",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设所求的数为x",
        "variable": "x",
        "meaning": "所求的数",
        "unit": "",
        "domain": "x为实数；题意未要求整数",
        "derivations": [],
        "table": {
          "headers": [
            "部分",
            "数值表达式"
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
                }
              ]
            },
            {
              "label": "原数的七分之一",
              "cells": [
                {
                  "expr": "x/7",
                  "sources": [
                    "fraction",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "和",
              "cells": [
                {
                  "expr": "19",
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
            "原数＋原数的七分之一＝19"
          ],
          "multiply": [
            "原数×1/7＝另一部分"
          ]
        },
        "closure": {
          "sources": [
            "sum"
          ],
          "text": "将原数和它的七分之一相加，必须等于19.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "x+x/7",
            "right": "19",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "所求的数",
            "expr": "133/8",
            "unit": ""
          }
        ],
        "steps": [
          "x+x/7=19",
          "(7+1)*x=19*7",
          "x=19*7/(7+1)",
          "x=133/8"
        ],
        "checks": [
          {
            "text": "代回原来的和",
            "expr": "133/8+(133/8)/7",
            "result": "19"
          }
        ],
        "conclusion": "这个数为133/8.题目求的是数，未限制它必须为整数，分数解符合题意.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "如果“七分之一”改为“五分之一”，对应的表格表达式与等式怎样变化？"
      }
    ],
    "notices": [
      "此题是数的关系文字题，保留在建模基础任务中."
    ],
    "originalStem": "大英博物馆收藏的古埃及《莱因德纸草书》上记载着一道著名的求未知数的问题：一个数加上它的1/7，其和等于19，你能求出这个数吗？你能根据题意列出方程吗？",
    "originalStems": {
      "I10": "大英博物馆收藏的古埃及《莱因德纸草书》上记载着一道著名的求未知数的问题：一个数加上它的1/7，其和等于19，你能求出这个数吗？你能根据题意列出方程吗？"
    }
  },
  {
    "id": "TB-I11",
    "textbookItemId": "I11",
    "textbookSupplement": true,
    "title": "硬面抄与软面抄：原设二元、改设一元",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，110页 · 例3（2）",
    "kind": "linear",
    "stem": "90元买硬面抄与软面抄共30本.硬面抄每本5元，软面抄每本2元.原题指定设硬面抄x本、软面抄y本，要求据此列方程.本模块先保留原设法作范围讨论，再明确改设为一元进行求解.",
    "notices": [
      "附加对照任务：原题明确指定两个未知数，不计入原生一元一次应用题数量.两条路线分别保留原设与明确改设."
    ],
    "tags": [
      "原设两个未知数",
      "改设一元",
      "范围讨论"
    ],
    "facts": [
      {
        "id": "count",
        "text": "硬面抄与软面抄合计30本",
        "kind": "given"
      },
      {
        "id": "hard",
        "text": "硬面抄每本5元",
        "kind": "given"
      },
      {
        "id": "soft",
        "text": "软面抄每本2元",
        "kind": "given"
      },
      {
        "id": "cost",
        "text": "共花90元",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "original-two",
        "label": "保留原设x、y，讨论范围",
        "variable": "x",
        "meaning": "按原设法购买的硬面抄本数",
        "unit": "本",
        "domain": "x、y都为非负整数",
        "derivations": [],
        "table": {
          "headers": [
            "品种",
            "单价/元每本",
            "本数/本",
            "费用/元"
          ],
          "rows": [
            {
              "label": "硬面抄",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "hard"
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
                    "hard",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "软面抄",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "soft"
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
                  "expr": "2*y",
                  "sources": [
                    "soft",
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
                  "expr": "30",
                  "sources": [
                    "count"
                  ],
                  "given": true
                },
                {
                  "expr": "90",
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
            "x本硬面抄＋y本软面抄＝30本",
            "两类费用之和＝90元"
          ],
          "multiply": [
            "每本单价×本数＝费用"
          ]
        },
        "closure": {
          "sources": [
            "count",
            "cost"
          ],
          "text": "原设法给出了x和y两个未知数，需要同时保留总本数与总费用两条关系.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [],
        "answers": [],
        "steps": [
          "x+y=30",
          "5*x+2*y=90"
        ],
        "checks": [],
        "conclusion": "按原题指定的x、y，得到x＋y＝30和5x＋2y＝90；这两个等式各含两个未知数，不能直接称为一元一次方程.若想用本章方法，需明确改设并将其中一个未知量用另一个表示.",
        "verdict": {
          "correct": "boundary",
          "prompt": "按原题指定x、y所列的方程，属于本章的一元一次方程吗？",
          "explain": "原设法是二元一次关系.要用一元一次方法，必须利用总本数把y改写成30−x，而不能隐去这个改设过程."
        },
        "variation": "为什么原来的两条二元关系不能只凭换个名称就叫一元一次方程？怎样用30−x替代y？",
        "discussion": "请写出原设x、y的两个等式，解释为什么它们不是一元一次方程；再说明怎样改设为一个未知数.",
        "additionalVariables": [
          {
            "variable": "y",
            "meaning": "按原设法购买的软面抄本数",
            "unit": "本",
            "domain": "y为非负整数"
          }
        ]
      },
      {
        "id": "one-variable",
        "label": "明确改设：用30−x表示软面抄",
        "variable": "x",
        "meaning": "改设后购买的硬面抄本数",
        "unit": "本",
        "domain": "x与30−x都为非负整数",
        "derivations": [],
        "table": {
          "headers": [
            "品种",
            "单价/元每本",
            "本数/本",
            "费用/元"
          ],
          "rows": [
            {
              "label": "硬面抄",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "hard"
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
                    "hard",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "软面抄",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "soft"
                  ],
                  "given": true
                },
                {
                  "expr": "30-x",
                  "sources": [
                    "count",
                    "unknown"
                  ]
                },
                {
                  "expr": "2*(30-x)",
                  "sources": [
                    "soft",
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
                  "expr": "30",
                  "sources": [
                    "count"
                  ],
                  "given": true
                },
                {
                  "expr": "90",
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
            "硬面抄本数＋软面抄本数＝30本",
            "两类费用相加＝90元"
          ],
          "multiply": [
            "单价×本数＝费用"
          ]
        },
        "closure": {
          "sources": [
            "cost"
          ],
          "text": "总本数已用于把软面抄表示为30−x，再用总费用列一元一次方程.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "5*x+2*(30-x)",
            "right": "90",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "硬面抄本数",
            "expr": "10",
            "unit": "本"
          },
          {
            "label": "软面抄本数",
            "expr": "20",
            "unit": "本"
          }
        ],
        "steps": [
          "5*x+2*(30-x)=90",
          "(5-2)*x=90-2*30",
          "x=(90-2*30)/(5-2)",
          "x=10",
          "30-10=20"
        ],
        "checks": [
          {
            "text": "总本数",
            "expr": "10+20",
            "result": "30"
          },
          {
            "text": "总费用",
            "expr": "5*10+2*20",
            "result": "90"
          }
        ],
        "conclusion": "在明确改设之后，得到硬面抄10本、软面抄20本；同时符合30本与90元两条原条件.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "若改设购买硬面抄的费用为未知数，两类本数应该怎样表示？"
      }
    ],
    "originalStem": "根据所设未知数列方程：花费90元购买了硬面抄和软面抄共30本，硬面抄每本5元，软面抄每本2元.硬面抄和软面抄各买了多少本？（设购买了x本硬面抄和y本软面抄）",
    "originalStems": {
      "I11": "根据所设未知数列方程：花费90元购买了硬面抄和软面抄共30本，硬面抄每本5元，软面抄每本2元.硬面抄和软面抄各买了多少本？（设购买了x本硬面抄和y本软面抄）"
    }
  },
  {
    "id": "TB-I12",
    "textbookItemId": "I12",
    "title": "铁路提速后缩短运行时间",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，111页 · 练习1（2）",
    "kind": "linear",
    "stem": "铁路改造后，列车平均速度由240千米/小时提高到300千米/小时，运行时间缩短0.5小时.设两城间铁路里程为x千米，根据原设元列方程，再求里程.",
    "tags": [
      "同路不同速",
      "时间差"
    ],
    "facts": [
      {
        "id": "before",
        "text": "改造前平均速度为240千米/小时",
        "kind": "given"
      },
      {
        "id": "after",
        "text": "改造后平均速度为300千米/小时",
        "kind": "given"
      },
      {
        "id": "saving",
        "text": "运行时间缩短0.5小时",
        "kind": "given"
      },
      {
        "id": "same",
        "text": "改造前后比较同一铁路里程",
        "kind": "given"
      },
      {
        "id": "rule",
        "text": "时间＝路程÷平均速度",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设两城间铁路里程为x",
        "variable": "x",
        "meaning": "两城间铁路里程",
        "unit": "千米",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "阶段",
            "平均速度/千米每小时",
            "路程/千米",
            "时间/小时"
          ],
          "rows": [
            {
              "label": "改造前",
              "cells": [
                {
                  "expr": "240",
                  "sources": [
                    "before"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "same",
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "x/240",
                  "sources": [
                    "before",
                    "unknown",
                    "rule"
                  ]
                }
              ]
            },
            {
              "label": "改造后",
              "cells": [
                {
                  "expr": "300",
                  "sources": [
                    "after"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "same",
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "x/300",
                  "sources": [
                    "after",
                    "unknown",
                    "rule"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "原运行时间＝新运行时间＋0.5小时"
          ],
          "multiply": [
            "平均速度×运行时间＝同一铁路里程"
          ]
        },
        "closure": {
          "sources": [
            "saving"
          ],
          "text": "改造前所需时间比改造后多0.5小时.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "x/240-x/300",
            "right": "0.5",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "铁路里程",
            "expr": "600",
            "unit": "千米"
          }
        ],
        "steps": [
          "x/240-x/300=0.5",
          "300*x-240*x=0.5*240*300",
          "(300-240)*x=0.5*240*300",
          "x=0.5*240*300/(300-240)",
          "x=600",
          "600/240=2.5",
          "600/300=2"
        ],
        "checks": [
          {
            "text": "运行时间的差",
            "expr": "600/240-600/300",
            "result": "0.5"
          }
        ],
        "conclusion": "两城间铁路里程为600千米，原需2.5小时，改造后需2小时，恰好缩短0.5小时.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "为什么这里应该比较时间的差，而不能把两个速度的差直接当作时间差？"
      }
    ],
    "notices": [
      "原题要求根据情境列等式；本模块接着求解和检验，作为明确标注的学习延伸."
    ],
    "originalStem": "根据所设未知数列方程：甲、乙两城市间的铁路经过技术改造后，列车在两城市间运行的平均速度从240 km/h提高到300 km/h，运行时间缩短了0.5 h，两城市间的铁路里程为多少千米？（设两城市间的铁路里程为x km）",
    "originalStems": {
      "I12": "根据所设未知数列方程：甲、乙两城市间的铁路经过技术改造后，列车在两城市间运行的平均速度从240 km/h提高到300 km/h，运行时间缩短了0.5 h，两城市间的铁路里程为多少千米？（设两城市间的铁路里程为x km）"
    }
  },
  {
    "id": "TB-I13",
    "textbookItemId": "I13",
    "title": "毛竹长到10米的天数",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，111页 · 练习1（3）",
    "kind": "linear",
    "stem": "一种毛竹前4年合计长高10厘米，第5年春天平均每天再长30厘米.设从第5年春天开始经过x天可长到10米高，先统一单位，再列方程.",
    "tags": [
      "单位换算",
      "原有量与增加量"
    ],
    "facts": [
      {
        "id": "initial",
        "text": "第5年春天开始时竹高10厘米",
        "kind": "given"
      },
      {
        "id": "growth",
        "text": "此后平均每天长高30厘米",
        "kind": "given"
      },
      {
        "id": "target",
        "text": "目标高度为10米",
        "kind": "given"
      },
      {
        "id": "conversion",
        "text": "长度换算：1米＝100厘米",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设第5年春天开始后经过的天数为x",
        "variable": "x",
        "meaning": "第5年春天开始后经过的天数",
        "unit": "天",
        "domain": "x≥0",
        "derivations": [
          {
            "id": "targetCm",
            "label": "把目标高度换算成厘米",
            "expr": "10*100",
            "result": "1000",
            "sources": [
              "target",
              "conversion"
            ],
            "explain": "每米100厘米，所以10米应写成10×100厘米，再得1000厘米."
          }
        ],
        "table": {
          "headers": [
            "阶段或状态",
            "日增长量/厘米每天",
            "时间/天",
            "高度或增长量/厘米"
          ],
          "rows": [
            {
              "label": "初始高度",
              "cells": [
                {
                  "note": "前4年不按此日增量计算"
                },
                {
                  "note": "不作为本次未知天数"
                },
                {
                  "expr": "10",
                  "sources": [
                    "initial"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "第5年春天的增长",
              "cells": [
                {
                  "expr": "30",
                  "sources": [
                    "growth"
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
                  "expr": "30*x",
                  "sources": [
                    "growth",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "目标高度",
              "cells": [
                {
                  "note": "高度不是日增量"
                },
                {
                  "note": "从春天开始计时"
                },
                {
                  "expr": "1000",
                  "sources": [
                    "targetCm"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "初始高度＋后来增长量＝目标高度"
          ],
          "multiply": [
            "每日增长量×经过天数＝后来增长量"
          ]
        },
        "closure": {
          "sources": [
            "target"
          ],
          "text": "把10米换成厘米后，与“初始10厘米＋每天30厘米×天数”比较.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "10+30*x",
            "right": "1000",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "经过天数",
            "expr": "33",
            "unit": "天"
          }
        ],
        "steps": [
          "10+30*x=10*100",
          "30*x=1000-10",
          "x=(1000-10)/30",
          "x=33"
        ],
        "checks": [
          {
            "text": "经过33天后的高度/厘米",
            "expr": "10+30*33",
            "result": "1000"
          }
        ],
        "conclusion": "从第5年春天开始经过33天可长到10米；前4年的10厘米是初始高度，不再另算30厘米/天.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "如果全表统一用米，30厘米/天要怎样推导成米/天，哪个来源能支持单位换算？"
      }
    ],
    "notices": [
      "原题要求根据情境列等式；本模块接着求解和检验，作为明确标注的学习延伸."
    ],
    "originalStem": "根据所设未知数列方程：有一种毛竹，前四年一共只长10 cm高，到了第五年春天会以平均每天30 cm的速度向上蹿，第五年春天经过多少天毛竹可以长到10 m高？（设第五年春天经过x天毛竹可以长到10 m高）",
    "originalStems": {
      "I13": "根据所设未知数列方程：有一种毛竹，前四年一共只长10 cm高，到了第五年春天会以平均每天30 cm的速度向上蹿，第五年春天经过多少天毛竹可以长到10 m高？（设第五年春天经过x天毛竹可以长到10 m高）"
    }
  },
  {
    "id": "TB-I14",
    "textbookItemId": "I14",
    "title": "人口统计：按比例列等式",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，111页 · 习题1（1）",
    "kind": "linear",
    "stem": "题目给出的江苏省常住人口为84748016人，其中0至14岁人口为n人，占15.21%.根据等量关系列出一个等式.",
    "tags": [
      "统计比例",
      "只列关系",
      "近似数据"
    ],
    "facts": [
      {
        "id": "population",
        "text": "常住人口总数为84748016人",
        "kind": "given"
      },
      {
        "id": "percent",
        "text": "0至14岁人口占总人口的15.21%",
        "kind": "given"
      },
      {
        "id": "percentDefinition",
        "text": "百分之表示每100份中的对应份数；15.21%＝15.21÷100",
        "kind": "property"
      },
      {
        "id": "precision",
        "text": "公布比例只写到百分数小数点后2位，不能当作反推精确整数人数的额外数据",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设0至14岁的人口数量为n",
        "variable": "n",
        "meaning": "0至14岁的人口数量",
        "unit": "人",
        "domain": "实际人数为整数；公布的15.21%是保留两位小数的统计比例",
        "derivations": [],
        "table": {
          "headers": [
            "统计对象",
            "人口数量/人",
            "占总人口的比例"
          ],
          "rows": [
            {
              "label": "全体常住人口",
              "cells": [
                {
                  "expr": "84748016",
                  "sources": [
                    "population"
                  ],
                  "given": true
                },
                {
                  "note": "作为比例的比较基准"
                }
              ]
            },
            {
              "label": "0至14岁人口",
              "cells": [
                {
                  "expr": "n",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "n/84748016",
                  "sources": [
                    "unknown",
                    "population"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [],
          "multiply": [
            "总人口×所占比例＝该年龄段人口"
          ]
        },
        "closure": {
          "sources": [
            "percent"
          ],
          "text": "按题设比例写出n÷84748016＝15.21%；这里只核对数量关系.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "n/84748016",
            "right": "15.21%",
            "label": "按公布比例列出的模型等式",
            "modelOnly": true,
            "allowSolved": true
          }
        ],
        "answers": [],
        "steps": [
          "n/84748016=15.21%",
          "n=84748016*15.21%"
        ],
        "checks": [
          {
            "text": "百分数的含义",
            "expr": "15.21/100",
            "result": "0.1521"
          }
        ],
        "conclusion": "按题设建立关系为n÷84748016＝15.21%.原题要求列等式；统计百分比是近似信息，不能把乘积12890173.2336人宣称为精确人数.若需要实际人数，必须查阅更精确的原统计值.",
        "verdict": {
          "correct": "valid",
          "prompt": "这个模型等式是否表达了题目给出的总量与比例关系？",
          "explain": "等式按题设比例建立；“模型关系可列出”不等于“能从近似比例反推出精确人数”.本题不要求输入精确人数."
        },
        "variation": "为什么由保留两位小数的百分比反推人数时，不能把所得小数当作精确人口？",
        "modelOnly": true
      }
    ],
    "notices": [
      "原题只要求列等式.本模块保留这个边界，不把按近似比例算出的非整数当作精确人口."
    ],
    "originalStem": "根据下列情境中的等量关系列出一个等式：根据江苏省第七次全国人口普查结果，江苏省常住人口为84748016人，0～14岁人口为n人，占15.21%.",
    "originalStems": {
      "I14": "根据下列情境中的等量关系列出一个等式：根据江苏省第七次全国人口普查结果，江苏省常住人口为84748016人，0～14岁人口为n人，占15.21%."
    }
  },
  {
    "id": "TB-I15",
    "textbookItemId": "I15",
    "title": "爸爸年龄比两倍多12",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，111页 · 习题1（2）",
    "kind": "linear",
    "stem": "小明今年a岁，爸爸今年40岁，比小明年龄的2倍还大12岁.根据等量关系列等式，再求小明的年龄.",
    "tags": [
      "年龄",
      "倍数与差量"
    ],
    "facts": [
      {
        "id": "father",
        "text": "爸爸今年40岁",
        "kind": "given"
      },
      {
        "id": "relation",
        "text": "爸爸年龄比小明年龄的2倍多12岁",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设小明今年的年龄为a",
        "variable": "a",
        "meaning": "小明今年的年龄",
        "unit": "岁",
        "domain": "a为正数",
        "derivations": [],
        "table": {
          "headers": [
            "对象或比较方式",
            "年龄或年龄表达式/岁"
          ],
          "rows": [
            {
              "label": "小明",
              "cells": [
                {
                  "expr": "a",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "爸爸：按倍数与差量表示",
              "cells": [
                {
                  "expr": "2*a+12",
                  "sources": [
                    "relation",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "爸爸：题目直接给出",
              "cells": [
                {
                  "expr": "40",
                  "sources": [
                    "father"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "小明年龄的2倍＋12岁＝爸爸年龄"
          ],
          "multiply": [
            "小明年龄×2＝比较基准"
          ]
        },
        "closure": {
          "sources": [
            "father"
          ],
          "text": "爸爸的同一个年龄既表示为2a＋12，也直接给出为40.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "2*a+12",
            "right": "40",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "小明今年年龄",
            "expr": "14",
            "unit": "岁"
          }
        ],
        "steps": [
          "2*a+12=40",
          "a=(40-12)/2",
          "a=14"
        ],
        "checks": [
          {
            "text": "按爸爸的年龄关系检验",
            "expr": "2*14+12",
            "result": "40"
          }
        ],
        "conclusion": "小明今年14岁，爸爸年龄为2×14＋12＝40岁.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "“比小明年龄与12的和的2倍大”与本题的表述是否相同？用括号说明差别."
      }
    ],
    "notices": [
      "原题要求根据情境列等式；本模块接着求解和检验，作为明确标注的学习延伸."
    ],
    "originalStem": "根据下列情境中的等量关系列出一个等式：小明今年a岁，爸爸今年40岁，比小明年龄的2倍还大12岁.",
    "originalStems": {
      "I15": "根据下列情境中的等量关系列出一个等式：小明今年a岁，爸爸今年40岁，比小明年龄的2倍还大12岁."
    }
  },
  {
    "id": "TB-I16",
    "textbookItemId": "I16",
    "title": "铁丝围成长方形",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，112页 · 习题3（1）",
    "kind": "linear",
    "stem": "用24厘米长的铁丝围成一个长方形，长是宽的2倍.设宽为x厘米，根据原设元列方程，再求宽.",
    "tags": [
      "周长",
      "相同数不同含义"
    ],
    "facts": [
      {
        "id": "perimeter",
        "text": "铁丝总长为24厘米，即长方形周长",
        "kind": "given"
      },
      {
        "id": "ratio",
        "text": "长方形的长是宽的2倍",
        "kind": "given"
      },
      {
        "id": "sides",
        "text": "长方形有2条相等的长、2条相等的宽",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设长方形的宽为x",
        "variable": "x",
        "meaning": "长方形的宽",
        "unit": "厘米",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "边的类别",
            "每条边长/厘米",
            "条数",
            "边长合计/厘米"
          ],
          "rows": [
            {
              "label": "宽",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "2",
                  "sources": [
                    "sides"
                  ],
                  "given": true
                },
                {
                  "expr": "2*x",
                  "sources": [
                    "sides",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "长",
              "cells": [
                {
                  "expr": "2*x",
                  "sources": [
                    "ratio",
                    "unknown"
                  ]
                },
                {
                  "expr": "2",
                  "sources": [
                    "sides"
                  ],
                  "given": true
                },
                {
                  "expr": "2*(2*x)",
                  "sources": [
                    "sides",
                    "ratio",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "周长",
              "cells": [
                {
                  "note": "单边长不直接合计"
                },
                {
                  "note": "条数无须另求"
                },
                {
                  "expr": "24",
                  "sources": [
                    "perimeter"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "两条长的总长度＋两条宽的总长度＝周长"
          ],
          "multiply": [
            "相同边的条数×单条长度＝该类边长总和",
            "宽×2＝长"
          ]
        },
        "closure": {
          "sources": [
            "perimeter"
          ],
          "text": "四条边的总长度等于铁丝总长24厘米.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "2*x+2*(2*x)",
            "right": "24",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "长方形的宽",
            "expr": "4",
            "unit": "厘米"
          }
        ],
        "steps": [
          "2*x+2*(2*x)=24",
          "(2+2*2)*x=24",
          "x=24/(2+2*2)",
          "x=4",
          "2*4=8"
        ],
        "checks": [
          {
            "text": "四条边的长度和",
            "expr": "2*4+2*(2*4)",
            "result": "24"
          }
        ],
        "conclusion": "长方形宽4厘米、长8厘米，周长24厘米；其中两个“2”分别来自边的条数和长宽倍数.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "表里的“2条边”和“长是宽的2倍”数值相同，但来源与意义是否相同？"
      }
    ],
    "notices": [
      "原题要求根据情境列等式；本模块接着求解和检验，作为明确标注的学习延伸."
    ],
    "originalStem": "根据所设未知数列方程：用一根长24 cm的铁丝围成一个长方形，使它的长是宽的2倍，长方形的宽是多少？（设长方形的宽是x cm）",
    "originalStems": {
      "I16": "根据所设未知数列方程：用一根长24 cm的铁丝围成一个长方形，使它的长是宽的2倍，长方形的宽是多少？（设长方形的宽是x cm）"
    }
  },
  {
    "id": "TB-I17",
    "textbookItemId": "I17",
    "title": "足球表面的黑白皮块",
    "group": "教材·4.1 等式与方程",
    "source": "《数学 七年级上册》苏科版2026，112页 · 习题3（3）",
    "kind": "linear",
    "stem": "足球表面由黑色五边形和白色六边形共32块皮块围成.白色块数比黑色块数的2倍少4块.设黑色有x块，先列方程，再求两类皮块各有多少块.",
    "tags": [
      "两类总量",
      "倍数与差量"
    ],
    "facts": [
      {
        "id": "total",
        "text": "黑白两类皮块合计32块",
        "kind": "given"
      },
      {
        "id": "relation",
        "text": "白色块数比黑色块数的2倍少4块",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设黑色皮块的数量为x",
        "variable": "x",
        "meaning": "黑色皮块的数量",
        "unit": "块",
        "domain": "x和白色皮块数量都应为正整数",
        "derivations": [],
        "table": {
          "headers": [
            "皮块类别",
            "数量/块"
          ],
          "rows": [
            {
              "label": "黑色",
              "cells": [
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
              "label": "白色",
              "cells": [
                {
                  "expr": "2*x-4",
                  "sources": [
                    "relation",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "expr": "32",
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
            "黑色块数＋白色块数＝32",
            "白色块数＋4＝黑色块数的2倍"
          ],
          "multiply": [
            "黑色块数×2＝比较用的倍数量"
          ]
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "用黑色块数表示白色块数，再将两类块数相加为32.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "x+(2*x-4)",
            "right": "32",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "黑色皮块",
            "expr": "12",
            "unit": "块"
          },
          {
            "label": "白色皮块",
            "expr": "20",
            "unit": "块"
          }
        ],
        "steps": [
          "x+(2*x-4)=32",
          "(1+2)*x=32+4",
          "x=(32+4)/(1+2)",
          "x=12",
          "2*12-4=20"
        ],
        "checks": [
          {
            "text": "皮块数量合计",
            "expr": "12+20",
            "result": "32"
          },
          {
            "text": "白色皮块的倍数关系",
            "expr": "2*12-4",
            "result": "20"
          }
        ],
        "conclusion": "黑色12块、白色20块.五边形和六边形描述形状，本题的块数关系由总块数及倍数差量确定.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "如果改设白色有y块，怎样在保留原数的情况下写出黑色块数？"
      }
    ],
    "notices": [
      "原题要求根据情境列等式；本模块接着求解和检验，作为明确标注的学习延伸."
    ],
    "originalStem": "根据所设未知数列方程：足球表面由黑色五边形和白色六边形共32个皮块围成，其中白色皮块比黑色皮块的2倍少4个.足球表面上有白色皮块和黑色皮块各多少个？（设黑色皮块有x个）",
    "originalStems": {
      "I17": "根据所设未知数列方程：足球表面由黑色五边形和白色六边形共32个皮块围成，其中白色皮块比黑色皮块的2倍少4个.足球表面上有白色皮块和黑色皮块各多少个？（设黑色皮块有x个）"
    },
    "sourceFigure": {
      "file": "figures/football.svg",
      "alt": "足球表面的黑色五边形和白色六边形"
    }
  },
  {
    "id": "TB-I18",
    "textbookItemId": "I18",
    "title": "练习本与圆珠笔的费用",
    "group": "教材·4.2 一元一次方程及其解法",
    "source": "《数学 七年级上册》苏科版2026，119页 · 习题1（1）",
    "kind": "linear",
    "stem": "小亮买5本练习本和2支圆珠笔共用16元，圆珠笔每支3元.设练习本每本x元，列方程并判断它是不是一元一次方程，再求单价.",
    "tags": [
      "单价×数量",
      "判断一次方程"
    ],
    "facts": [
      {
        "id": "books",
        "text": "买5本练习本",
        "kind": "given"
      },
      {
        "id": "pens",
        "text": "买2支圆珠笔，每支3元",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "总费用16元",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设练习本的单价为x",
        "variable": "x",
        "meaning": "练习本的单价",
        "unit": "元/本",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "商品",
            "单价/元每件",
            "数量/件",
            "费用/元"
          ],
          "rows": [
            {
              "label": "练习本",
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
                    "books"
                  ],
                  "given": true
                },
                {
                  "expr": "5*x",
                  "sources": [
                    "books",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "圆珠笔",
              "cells": [
                {
                  "expr": "3",
                  "sources": [
                    "pens"
                  ],
                  "given": true
                },
                {
                  "expr": "2",
                  "sources": [
                    "pens"
                  ],
                  "given": true
                },
                {
                  "expr": "3*2",
                  "sources": [
                    "pens"
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
                  "note": "本与支不必合计"
                },
                {
                  "expr": "16",
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
            "练习本费用＋圆珠笔费用＝16元"
          ],
          "multiply": [
            "单价×数量＝费用"
          ]
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "两类商品费用合计为16元.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "5*x+3*2",
            "right": "16",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "练习本单价",
            "expr": "2",
            "unit": "元/本"
          }
        ],
        "steps": [
          "5*x+3*2=16",
          "5*x=16-3*2",
          "x=(16-3*2)/5",
          "x=2"
        ],
        "checks": [
          {
            "text": "购买总费用",
            "expr": "5*2+3*2",
            "result": "16"
          }
        ],
        "conclusion": "练习本每本2元；方程只含未知数x且x的次数为1，是一元一次方程.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "根据这张表说明为什么3×2是已知费用，而5x仍含未知数；所列方程属于哪一种？"
      }
    ],
    "notices": [
      "原题还要求判断所列方程是不是一元一次方程.本题按给定设元，方程只含一个未知数且次数为1；求解与检验是本模块的延伸."
    ],
    "originalStem": "根据所设未知数列方程，并判断所列方程是否为一元一次方程：小亮买5本练习本和2支圆珠笔一共用了16元，圆珠笔每支3元.练习本每本多少元？（设练习本每本x元）",
    "originalStems": {
      "I18": "根据所设未知数列方程，并判断所列方程是否为一元一次方程：小亮买5本练习本和2支圆珠笔一共用了16元，圆珠笔每支3元.练习本每本多少元？（设练习本每本x元）"
    }
  },
  {
    "id": "TB-I19",
    "textbookItemId": "I19",
    "title": "书费加上邮费",
    "group": "教材·4.2 一元一次方程及其解法",
    "source": "《数学 七年级上册》苏科版2026，119页 · 习题1（2）",
    "kind": "linear",
    "stem": "小丽网购3本同样的书，书费和邮费共97.5元，其中邮费6元.设书的单价为x元，列方程并判断它是不是一元一次方程，再求书的单价.",
    "tags": [
      "固定费用",
      "判断一次方程"
    ],
    "facts": [
      {
        "id": "books",
        "text": "购买3本同样的书",
        "kind": "given"
      },
      {
        "id": "postage",
        "text": "这笔订单的邮费为6元",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "书费与邮费共97.5元",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设一本书的单价为x",
        "variable": "x",
        "meaning": "一本书的单价",
        "unit": "元/本",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "费用项目",
            "单价/元每本",
            "本数/本",
            "费用/元"
          ],
          "rows": [
            {
              "label": "书费",
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
                    "books"
                  ],
                  "given": true
                },
                {
                  "expr": "3*x",
                  "sources": [
                    "books",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "邮费",
              "cells": [
                {
                  "note": "邮费按订单给出"
                },
                {
                  "note": "不按书的本数另算"
                },
                {
                  "expr": "6",
                  "sources": [
                    "postage"
                  ],
                  "given": true
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
                  "note": "不合计邮费数量"
                },
                {
                  "expr": "97.5",
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
            "书费＋邮费＝订单总费用"
          ],
          "multiply": [
            "书的单价×本数＝书费"
          ]
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "3本书的费用再加这笔订单的6元邮费，共97.5元.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "3*x+6",
            "right": "97.5",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "书的单价",
            "expr": "30.5",
            "unit": "元/本"
          }
        ],
        "steps": [
          "3*x+6=97.5",
          "x=(97.5-6)/3",
          "x=30.5"
        ],
        "checks": [
          {
            "text": "书费加邮费",
            "expr": "3*30.5+6",
            "result": "97.5"
          }
        ],
        "conclusion": "每本书30.5元，所列3x＋6＝97.5是一元一次方程.邮费6元属于整笔订单，不能乘3.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "若邮费改成每本书另收6元，表格和方程会发生什么变化？"
      }
    ],
    "notices": [
      "原题还要求判断所列方程是不是一元一次方程.本题按给定设元，方程只含一个未知数且次数为1；求解与检验是本模块的延伸."
    ],
    "originalStem": "根据所设未知数列方程，并判断所列方程是否为一元一次方程：小丽网购3本同样的书，书费和邮费的总价为97.5元，邮费6元.求书的单价.（设书的单价为x元）",
    "originalStems": {
      "I19": "根据所设未知数列方程，并判断所列方程是否为一元一次方程：小丽网购3本同样的书，书费和邮费的总价为97.5元，邮费6元.求书的单价.（设书的单价为x元）"
    }
  },
  {
    "id": "TB-I20",
    "textbookItemId": "I20",
    "title": "出租车起步费与超程费",
    "group": "教材·4.2 一元一次方程及其解法",
    "source": "《数学 七年级上册》苏科版2026，119页 · 习题1（3）",
    "kind": "linear",
    "stem": "出租车起步价8元，起步里程3千米，3千米以内按起步价付费；超过3千米的部分按2元/千米收费.某次乘车付16元，设路程为x千米.列方程并判断其类型，再求路程.",
    "tags": [
      "分段收费",
      "先判范围"
    ],
    "facts": [
      {
        "id": "base",
        "text": "起步里程3千米以内固定收费8元",
        "kind": "given"
      },
      {
        "id": "extra",
        "text": "超过3千米的部分，每千米收费2元",
        "kind": "given"
      },
      {
        "id": "paid",
        "text": "此次总共付16元",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "standard",
        "label": "设此次乘车总路程为x",
        "variable": "x",
        "meaning": "此次乘车总路程",
        "unit": "千米",
        "domain": "16元大于起步费8元，因此x>3；列式只适用于超过起步里程的情形",
        "derivations": [],
        "table": {
          "headers": [
            "计费部分",
            "计价方式/元每千米",
            "本段里程/千米",
            "费用/元"
          ],
          "rows": [
            {
              "label": "起步段",
              "cells": [
                {
                  "note": "固定8元，不折算单价"
                },
                {
                  "expr": "3",
                  "sources": [
                    "base"
                  ],
                  "given": true
                },
                {
                  "expr": "8",
                  "sources": [
                    "base"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "超起步段",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "extra"
                  ],
                  "given": true
                },
                {
                  "expr": "x-3",
                  "sources": [
                    "extra",
                    "unknown"
                  ]
                },
                {
                  "expr": "2*(x-3)",
                  "sources": [
                    "extra",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "不同计价方式不相加"
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "16",
                  "sources": [
                    "paid"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "起步费＋超程费＝总费用",
            "起步里程＋超程里程＝总路程"
          ],
          "multiply": [
            "超程单价×超程里程＝超程费"
          ]
        },
        "closure": {
          "sources": [
            "paid"
          ],
          "text": "因总费用超过8元，先确定进入超程段，再用8＋2(x−3)表示总费用.",
          "hint": "哪些条件已用于填表？再找出题目要求必须满足的总量、差量或平衡条件."
        },
        "equations": [
          {
            "left": "8+2*(x-3)",
            "right": "16",
            "label": "根据等量关系列方程"
          }
        ],
        "answers": [
          {
            "label": "总路程",
            "expr": "7",
            "unit": "千米"
          }
        ],
        "steps": [
          "8+2*(x-3)=16",
          "x-3=(16-8)/2",
          "x=(16-8)/2+3",
          "x=7"
        ],
        "checks": [
          {
            "text": "按分段收费规则付费",
            "expr": "8+2*(7-3)",
            "result": "16"
          },
          {
            "text": "超过起步的里程",
            "expr": "7-3",
            "result": "4"
          }
        ],
        "conclusion": "乘车路程为7千米，超过起步里程4千米；方程在x>3的范围内是一元一次方程.",
        "verdict": {
          "correct": "valid",
          "prompt": "表中的关系及所得结论是否符合题目要求？",
          "explain": "把结果代回原条件，核对单位、数量范围与题目所问."
        },
        "variation": "如果某次只付8元，能否唯一确定路程？为什么不能仍把同一个方程的解当作唯一实际路程？"
      }
    ],
    "notices": [
      "原题还要求判断所列方程是不是一元一次方程.本题按给定设元，方程只含一个未知数且次数为1；求解与检验是本模块的延伸."
    ],
    "originalStem": "根据所设未知数列方程，并判断所列方程是否为一元一次方程：某市出租车的收费标准是：起步价为8元，起步里程为3 km（3 km以内按起步价付费），3 km后收费标准为2元/km.某人乘出租车从甲地到乙地共付费16元.求甲、乙两地之间的路程.（设甲、乙两地之间的路程为x km）",
    "originalStems": {
      "I20": "根据所设未知数列方程，并判断所列方程是否为一元一次方程：某市出租车的收费标准是：起步价为8元，起步里程为3 km（3 km以内按起步价付费），3 km后收费标准为2元/km.某人乘出租车从甲地到乙地共付费16元.求甲、乙两地之间的路程.（设甲、乙两地之间的路程为x km）"
    }
  }
];
  if(typeof module==='object'&&module.exports)module.exports=data;
  else(root.RatioWordProblemsData ||= []).push(...data);
})(typeof window==='undefined'?globalThis:window);
