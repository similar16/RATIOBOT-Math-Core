(function(root){
  const data = [
  {
    "id": "L7-P1",
    "title": "茶具用泥",
    "group": "第7课时",
    "source": "《教学设计与指导》171—173页 · 问题1",
    "kind": "linear",
    "stem": "一套茶具有1把茶壶和6只茶杯。每把茶壶用泥0.6千克，每只茶杯用泥0.15千克。现有10.5千克泥，忽略制作耗损，能制作多少套茶具？",
    "tags": [
      "配套",
      "总量"
    ],
    "facts": [
      {
        "id": "sets",
        "text": "每套含1把茶壶和6只茶杯",
        "kind": "given"
      },
      {
        "id": "pot",
        "text": "每把茶壶用泥0.6千克",
        "kind": "given"
      },
      {
        "id": "cup",
        "text": "每只茶杯用泥0.15千克",
        "kind": "given"
      },
      {
        "id": "clay",
        "text": "泥的总质量为10.5千克",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "sets",
        "label": "设茶具套数为x",
        "variable": "x",
        "meaning": "可制作的茶具套数",
        "unit": "套",
        "domain": "x为非负整数",
        "derivations": [],
        "table": {
          "headers": [
            "部件",
            "单件耗泥/千克",
            "数量/件",
            "耗泥/千克"
          ],
          "rows": [
            {
              "label": "茶壶",
              "cells": [
                {
                  "expr": "0.6",
                  "sources": [
                    "pot"
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
                  "expr": "0.6*x",
                  "sources": [
                    "pot",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "茶杯",
              "cells": [
                {
                  "expr": "0.15",
                  "sources": [
                    "cup"
                  ],
                  "given": true
                },
                {
                  "expr": "6*x",
                  "sources": [
                    "sets",
                    "unknown"
                  ]
                },
                {
                  "expr": "0.15*6*x",
                  "sources": [
                    "cup",
                    "sets",
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
                  "note": "本题无需合计件数"
                },
                {
                  "expr": "10.5",
                  "sources": [
                    "clay"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "茶壶用泥量+茶杯用泥量=总用泥量"
          ],
          "multiply": [
            "套数×每套件数=部件数量",
            "单件耗泥×件数=分类耗泥"
          ]
        },
        "closure": {
          "sources": [
            "clay"
          ],
          "text": "两类耗泥量的和等于10.5千克。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "用泥总量相等",
            "left": "0.6*x+0.15*6*x",
            "right": "10.5"
          }
        ],
        "answers": [
          {
            "label": "可制作的茶具",
            "expr": "7",
            "unit": "套"
          }
        ],
        "steps": [
          "0.6x+0.15×6x=10.5",
          "(0.6+0.15×6)x=10.5",
          "1.5x=10.5",
          "x=7"
        ],
        "checks": [
          {
            "text": "两类用泥量合计",
            "expr": "0.6*7+0.15*6*7",
            "result": "10.5"
          },
          {
            "text": "茶杯数量",
            "expr": "6*7",
            "result": "42"
          }
        ],
        "conclusion": "能制作7套：7把茶壶、42只茶杯。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "若每套改成4只茶杯，哪些格子和方程中的哪一部分要改变？"
      }
    ]
  },
  {
    "id": "L7-P2",
    "title": "购买两种水果",
    "group": "第7课时",
    "source": "《教学设计与指导》173—174页 · 问题2",
    "kind": "linear",
    "stem": "苹果每千克6.2元，橘子每千克5.6元。共买6千克，花费36元。两种水果各买多少千克？",
    "tags": [
      "两个总量",
      "不同设元"
    ],
    "facts": [
      {
        "id": "apple",
        "text": "苹果每千克6.2元",
        "kind": "given"
      },
      {
        "id": "orange",
        "text": "橘子每千克5.6元",
        "kind": "given"
      },
      {
        "id": "mass",
        "text": "两种水果共6千克",
        "kind": "given"
      },
      {
        "id": "cost",
        "text": "两种水果共花36元",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "mass",
        "label": "设苹果质量为x",
        "variable": "x",
        "meaning": "苹果的质量",
        "unit": "千克",
        "domain": "0≤x≤6",
        "derivations": [],
        "table": {
          "headers": [
            "水果",
            "单价/元每千克",
            "质量/千克",
            "金额/元"
          ],
          "rows": [
            {
              "label": "苹果",
              "cells": [
                {
                  "expr": "6.2",
                  "sources": [
                    "apple"
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
                  "expr": "6.2*x",
                  "sources": [
                    "apple",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "橘子",
              "cells": [
                {
                  "expr": "5.6",
                  "sources": [
                    "orange"
                  ],
                  "given": true
                },
                {
                  "expr": "6-x",
                  "sources": [
                    "mass",
                    "unknown"
                  ]
                },
                {
                  "expr": "5.6*(6-x)",
                  "sources": [
                    "orange",
                    "mass",
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
                  "expr": "6",
                  "sources": [
                    "mass"
                  ],
                  "given": true
                },
                {
                  "expr": "36",
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
            "苹果质量+橘子质量=6千克",
            "苹果费用+橘子费用=36元"
          ],
          "multiply": [
            "单价×质量=费用"
          ]
        },
        "closure": {
          "sources": [
            "cost"
          ],
          "text": "质量和已用于填写6−x，费用和36元用来确定分配。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "费用总和",
            "left": "6.2*x+5.6*(6-x)",
            "right": "36"
          }
        ],
        "answers": [
          {
            "label": "苹果",
            "expr": "4",
            "unit": "千克"
          },
          {
            "label": "橘子",
            "expr": "2",
            "unit": "千克"
          }
        ],
        "steps": [
          "6.2x+5.6(6−x)=36",
          "6.2x+33.6−5.6x=36",
          "0.6x=2.4",
          "x=4",
          "6−4=2"
        ],
        "checks": [
          {
            "text": "总质量",
            "expr": "4+2",
            "result": "6"
          },
          {
            "text": "总费用",
            "expr": "6.2*4+5.6*2",
            "result": "36"
          }
        ],
        "conclusion": "苹果4千克，橘子2千克。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "把未知量改成苹果费用，哪些条件用于填表，哪一条用于列方程？"
      },
      {
        "id": "cost",
        "label": "设苹果费用为x",
        "variable": "x",
        "meaning": "购买苹果的费用",
        "unit": "元",
        "domain": "0≤x≤36",
        "derivations": [],
        "table": {
          "headers": [
            "水果",
            "单价/元每千克",
            "质量/千克",
            "金额/元"
          ],
          "rows": [
            {
              "label": "苹果",
              "cells": [
                {
                  "expr": "6.2",
                  "sources": [
                    "apple"
                  ],
                  "given": true
                },
                {
                  "expr": "x/6.2",
                  "sources": [
                    "apple",
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
              "label": "橘子",
              "cells": [
                {
                  "expr": "5.6",
                  "sources": [
                    "orange"
                  ],
                  "given": true
                },
                {
                  "expr": "(36-x)/5.6",
                  "sources": [
                    "orange",
                    "cost",
                    "unknown"
                  ]
                },
                {
                  "expr": "36-x",
                  "sources": [
                    "cost",
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
                  "expr": "6",
                  "sources": [
                    "mass"
                  ],
                  "given": true
                },
                {
                  "expr": "36",
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
            "两种费用合计36元",
            "两种质量合计6千克"
          ],
          "multiply": [
            "单价×质量=费用，质量可由费用÷单价求出"
          ]
        },
        "closure": {
          "sources": [
            "mass"
          ],
          "text": "费用和已用于填写36−x，质量和6千克用来列方程。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "质量总和",
            "left": "x/6.2+(36-x)/5.6",
            "right": "6"
          }
        ],
        "answers": [
          {
            "label": "苹果费用",
            "expr": "24.8",
            "unit": "元"
          },
          {
            "label": "苹果质量",
            "expr": "4",
            "unit": "千克"
          },
          {
            "label": "橘子质量",
            "expr": "2",
            "unit": "千克"
          }
        ],
        "steps": [
          "x÷6.2+(36−x)÷5.6=6",
          "5.6x+6.2(36−x)=6×6.2×5.6",
          "−0.6x=−14.88",
          "x=24.8",
          "24.8÷6.2=4",
          "(36−24.8)÷5.6=2"
        ],
        "checks": [
          {
            "text": "两种质量合计",
            "expr": "24.8/6.2+(36-24.8)/5.6",
            "result": "6"
          },
          {
            "text": "两种费用合计",
            "expr": "24.8+(36-24.8)",
            "result": "36"
          }
        ],
        "conclusion": "苹果费用24.8元，苹果4千克，橘子2千克。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "为什么x+(36−x)=36不能用来确定x？"
      },
      {
        "id": "mass-from-cost",
        "label": "设苹果质量为x，先用总价填表",
        "variable": "x",
        "meaning": "苹果的质量",
        "unit": "千克",
        "domain": "0≤x≤6",
        "derivations": [],
        "table": {
          "headers": [
            "水果",
            "单价/元每千克",
            "质量/千克",
            "金额/元"
          ],
          "rows": [
            {
              "label": "苹果",
              "cells": [
                {
                  "expr": "6.2",
                  "sources": [
                    "apple"
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
                  "expr": "6.2*x",
                  "sources": [
                    "apple",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "橘子",
              "cells": [
                {
                  "expr": "5.6",
                  "sources": [
                    "orange"
                  ],
                  "given": true
                },
                {
                  "expr": "(36-6.2*x)/5.6",
                  "sources": [
                    "cost",
                    "apple",
                    "orange",
                    "unknown"
                  ]
                },
                {
                  "expr": "36-6.2*x",
                  "sources": [
                    "cost",
                    "apple",
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
                  "expr": "6",
                  "sources": [
                    "mass"
                  ],
                  "given": true
                },
                {
                  "expr": "36",
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
            "苹果金额+橘子金额=36",
            "苹果质量+橘子质量=6"
          ],
          "multiply": [
            "金额=单价×质量",
            "质量=金额÷单价（乘积关系的反用）"
          ]
        },
        "closure": {
          "sources": [
            "mass"
          ],
          "text": "已经用总价36元表示橘子金额，再用总质量6千克列方程。",
          "hint": "总价已用于36−6.2x，若再把两种费用相加等于36，只会得到恒等式。"
        },
        "equations": [
          {
            "label": "两种水果质量合计",
            "left": "x+(36-6.2*x)/5.6",
            "right": "6"
          }
        ],
        "answers": [
          {
            "label": "苹果",
            "expr": "4",
            "unit": "千克"
          },
          {
            "label": "橘子",
            "expr": "2",
            "unit": "千克"
          }
        ],
        "steps": [
          "5.6*x+36-6.2*x=6*5.6",
          "(6.2-5.6)*x=36-6*5.6",
          "x=(36-6*5.6)/(6.2-5.6)=4",
          "(36-6.2*4)/5.6=2"
        ],
        "checks": [
          {
            "text": "两种质量之和",
            "expr": "4+(36-6.2*4)/5.6",
            "result": "6"
          },
          {
            "text": "两种金额之和",
            "expr": "6.2*4+5.6*2",
            "result": "36"
          }
        ],
        "conclusion": "苹果4千克，橘子2千克。设元与第一种方法相同，但先使用的条件不同，因此最后用总质量闭合。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "苹果4千克，橘子2千克。设元与第一种方法相同，但先使用的条件不同，因此最后用总质量闭合。"
        },
        "variation": "同样设苹果x千克，为什么既可以先用总质量填表，也可以先用总价填表？比较两种方程使用条件的次序。",
        "sourceNote": "原书173页展示与评价2的第三个方程，174页用统一表格比较。"
      }
    ]
  },
  {
    "id": "L7-P3",
    "title": "年龄与同一时刻",
    "group": "第7课时",
    "source": "《教学设计与指导》174—175页 · 问题3",
    "kind": "linear",
    "stem": "小明今年13岁，王老师今年45岁。再过几年，小明的年龄是王老师年龄的三分之一？",
    "tags": [
      "前后变化",
      "比例"
    ],
    "facts": [
      {
        "id": "student",
        "text": "小明今年13岁",
        "kind": "given"
      },
      {
        "id": "teacher",
        "text": "王老师今年45岁",
        "kind": "given"
      },
      {
        "id": "ratio",
        "text": "未来同一时刻，小明年龄是王老师的1/3",
        "kind": "given"
      },
      {
        "id": "same-time",
        "text": "经过同样的年数，两个人的年龄都增加相同的岁数",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "elapsed",
        "label": "设经过年数为x",
        "variable": "x",
        "meaning": "从现在起经过的年数",
        "unit": "年",
        "domain": "x≥0",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "今年年龄/岁",
            "增加年龄/岁",
            "未来年龄/岁"
          ],
          "rows": [
            {
              "label": "小明",
              "cells": [
                {
                  "expr": "13",
                  "sources": [
                    "student"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "same-time"
                  ],
                  "given": true
                },
                {
                  "expr": "13+x",
                  "sources": [
                    "student",
                    "same-time",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "王老师",
              "cells": [
                {
                  "expr": "45",
                  "sources": [
                    "teacher"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "same-time"
                  ],
                  "given": true
                },
                {
                  "expr": "45+x",
                  "sources": [
                    "teacher",
                    "same-time",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "今年年龄+经过年数=未来年龄"
          ],
          "multiply": [
            "未来小明年龄=未来老师年龄×1/3"
          ]
        },
        "closure": {
          "sources": [
            "ratio"
          ],
          "text": "比较同一未来时刻的两个年龄。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "未来年龄的比例",
            "left": "13+x",
            "right": "(45+x)/3"
          }
        ],
        "answers": [
          {
            "label": "经过年数",
            "expr": "3",
            "unit": "年"
          }
        ],
        "steps": [
          "13+x=(45+x)÷3",
          "3(13+x)=45+x",
          "39+3x=45+x",
          "2x=6",
          "x=3"
        ],
        "checks": [
          {
            "text": "小明未来年龄",
            "expr": "13+3",
            "result": "16"
          },
          {
            "text": "老师未来年龄",
            "expr": "45+3",
            "result": "48"
          },
          {
            "text": "未来年龄比",
            "expr": "16/48",
            "result": "1/3"
          }
        ],
        "conclusion": "3年后，小明16岁，王老师48岁。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "若改问小明年龄是老师的一半时，哪一条比较条件改变？"
      }
    ],
    "diagram": "age"
  },
  {
    "id": "L7-T1",
    "title": "五年后的年龄和",
    "group": "第7课时",
    "source": "《教学设计与指导》175页 · 目标检测1",
    "kind": "linear",
    "stem": "今年爸爸的年龄是小丽的3倍。5年后，两人的年龄和为58岁。小丽今年多少岁？",
    "tags": [
      "年龄和",
      "前后变化"
    ],
    "facts": [
      {
        "id": "ratio",
        "text": "爸爸今年年龄是小丽的3倍",
        "kind": "given"
      },
      {
        "id": "years",
        "text": "从今年起经过5年",
        "kind": "given"
      },
      {
        "id": "sum",
        "text": "5年后两人年龄和58岁",
        "kind": "given"
      },
      {
        "id": "same-time",
        "text": "每个人经过5年都增加5岁",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "daughter",
        "label": "设小丽今年年龄为x",
        "variable": "x",
        "meaning": "小丽今年的年龄",
        "unit": "岁",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "今年年龄/岁",
            "增加/岁",
            "5年后年龄/岁"
          ],
          "rows": [
            {
              "label": "小丽",
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
                    "years"
                  ],
                  "given": true
                },
                {
                  "expr": "x+5",
                  "sources": [
                    "unknown",
                    "years"
                  ]
                }
              ]
            },
            {
              "label": "爸爸",
              "cells": [
                {
                  "expr": "3*x",
                  "sources": [
                    "ratio",
                    "unknown"
                  ]
                },
                {
                  "expr": "5",
                  "sources": [
                    "years",
                    "same-time"
                  ],
                  "given": true
                },
                {
                  "expr": "3*x+5",
                  "sources": [
                    "ratio",
                    "unknown",
                    "years"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "expr": "x+3*x",
                  "sources": [
                    "unknown",
                    "ratio"
                  ]
                },
                {
                  "expr": "5+5",
                  "sources": [
                    "years",
                    "same-time"
                  ]
                },
                {
                  "expr": "58",
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
            "各人今年年龄+5=5年后年龄",
            "两人5年后年龄和=58"
          ],
          "multiply": [
            "爸爸今年年龄=3×小丽今年年龄"
          ]
        },
        "closure": {
          "sources": [
            "sum"
          ],
          "text": "相加的是两个人5年后的年龄。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "五年后的年龄和",
            "left": "(x+5)+(3*x+5)",
            "right": "58"
          }
        ],
        "answers": [
          {
            "label": "小丽今年年龄",
            "expr": "12",
            "unit": "岁"
          },
          {
            "label": "爸爸今年年龄",
            "expr": "36",
            "unit": "岁"
          }
        ],
        "steps": [
          "(x+5)+(3x+5)=58",
          "4x+10=58",
          "4x=48",
          "x=12",
          "3×12=36"
        ],
        "checks": [
          {
            "text": "未来年龄和",
            "expr": "(12+5)+(36+5)",
            "result": "58"
          },
          {
            "text": "现在年龄倍数",
            "expr": "36/12",
            "result": "3"
          }
        ],
        "conclusion": "小丽今年12岁，爸爸今年36岁。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "两人的年龄和经过5年增加多少？先写出5+5，再求值。"
      }
    ],
    "diagram": "age"
  },
  {
    "id": "L7-T2",
    "title": "两个小组增员",
    "group": "第7课时",
    "source": "《教学设计与指导》175页 · 目标检测2",
    "kind": "linear",
    "stem": "合唱组原有27人，舞蹈组原有19人。两组共增加20人后，合唱组人数是舞蹈组的2倍。合唱组增加了多少人？",
    "tags": [
      "前后变化",
      "倍数"
    ],
    "facts": [
      {
        "id": "choir",
        "text": "合唱组原有27人",
        "kind": "given"
      },
      {
        "id": "dance",
        "text": "舞蹈组原有19人",
        "kind": "given"
      },
      {
        "id": "new",
        "text": "两个小组共增加20人",
        "kind": "given"
      },
      {
        "id": "ratio",
        "text": "增加后，合唱组人数是舞蹈组的2倍",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "added",
        "label": "设合唱增加人数为x",
        "variable": "x",
        "meaning": "合唱组增加的人数",
        "unit": "人",
        "domain": "x是0至20之间的整数",
        "derivations": [],
        "table": {
          "headers": [
            "小组",
            "原有人数/人",
            "增加人数/人",
            "现有人数/人"
          ],
          "rows": [
            {
              "label": "合唱",
              "cells": [
                {
                  "expr": "27",
                  "sources": [
                    "choir"
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
                  "expr": "27+x",
                  "sources": [
                    "choir",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "舞蹈",
              "cells": [
                {
                  "expr": "19",
                  "sources": [
                    "dance"
                  ],
                  "given": true
                },
                {
                  "expr": "20-x",
                  "sources": [
                    "new",
                    "unknown"
                  ]
                },
                {
                  "expr": "19+(20-x)",
                  "sources": [
                    "dance",
                    "new",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "两组增加人数合计20",
            "原人数+增加人数=现人数"
          ],
          "multiply": [
            "合唱现人数=2×舞蹈现人数"
          ]
        },
        "closure": {
          "sources": [
            "ratio"
          ],
          "text": "倍数比较针对增加后的两组人数。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "现有人数的倍数",
            "left": "27+x",
            "right": "2*(19+(20-x))"
          }
        ],
        "answers": [
          {
            "label": "合唱增加",
            "expr": "17",
            "unit": "人"
          },
          {
            "label": "舞蹈增加",
            "expr": "3",
            "unit": "人"
          }
        ],
        "steps": [
          "27+x=2[19+(20−x)]",
          "27+x=78−2x",
          "3x=51",
          "x=17",
          "20−17=3"
        ],
        "checks": [
          {
            "text": "增加人数和",
            "expr": "17+3",
            "result": "20"
          },
          {
            "text": "增加后的倍数",
            "expr": "(27+17)/(19+3)",
            "result": "2"
          }
        ],
        "conclusion": "合唱组增加17人，舞蹈组增加3人。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "如果直接填39−x，39应如何从题目中的数得到？"
      }
    ]
  },
  {
    "id": "L7-H1",
    "title": "年龄差与倍数",
    "group": "第7课时",
    "source": "《教学设计与指导》175页 · 课后作业1",
    "kind": "linear",
    "stem": "小明今年比爸爸小26岁，爸爸今年的年龄是小明的3倍。小明今年多少岁？",
    "tags": [
      "差量",
      "同量两种表示"
    ],
    "facts": [
      {
        "id": "difference",
        "text": "爸爸今年比小明大26岁",
        "kind": "given"
      },
      {
        "id": "ratio",
        "text": "爸爸今年年龄是小明的3倍",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "son",
        "label": "设小明年龄为x",
        "variable": "x",
        "meaning": "小明今年的年龄",
        "unit": "岁",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "由年龄差表示的年龄/岁",
            "由倍数表示的年龄/岁"
          ],
          "rows": [
            {
              "label": "小明",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
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
              "label": "爸爸",
              "cells": [
                {
                  "expr": "x+26",
                  "sources": [
                    "difference",
                    "unknown"
                  ]
                },
                {
                  "expr": "3*x",
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
            "小明年龄+26=爸爸年龄"
          ],
          "multiply": [
            "3×小明年龄=爸爸年龄"
          ]
        },
        "closure": {
          "sources": [
            "difference",
            "ratio"
          ],
          "text": "爸爸的同一个年龄，用两条条件表示后应相等。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "爸爸年龄的两种表示",
            "left": "x+26",
            "right": "3*x"
          }
        ],
        "answers": [
          {
            "label": "小明年龄",
            "expr": "13",
            "unit": "岁"
          }
        ],
        "steps": [
          "x+26=3x",
          "2x=26",
          "x=13"
        ],
        "checks": [
          {
            "text": "父子年龄差",
            "expr": "3*13-13",
            "result": "26"
          }
        ],
        "conclusion": "小明13岁，爸爸39岁。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "如果改设爸爸年龄为x，如何表示小明年龄？"
      }
    ]
  },
  {
    "id": "L7-H2",
    "title": "仓库存粮的变化",
    "group": "第7课时",
    "source": "《教学设计与指导》175页 · 课后作业2",
    "kind": "linear",
    "stem": "甲、乙两个仓库原有蔬菜共60吨。甲仓运入14吨、乙仓运出10吨后，两仓蔬菜一样多。原来各有多少吨？",
    "tags": [
      "增减变化",
      "相等"
    ],
    "facts": [
      {
        "id": "total",
        "text": "两仓原有蔬菜共60吨",
        "kind": "given"
      },
      {
        "id": "in",
        "text": "甲仓运入14吨",
        "kind": "given"
      },
      {
        "id": "out",
        "text": "乙仓运出10吨",
        "kind": "given"
      },
      {
        "id": "equal",
        "text": "变化后两仓蔬菜一样多",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "initial-a",
        "label": "设甲原有量为x",
        "variable": "x",
        "meaning": "甲仓原有蔬菜质量",
        "unit": "吨",
        "domain": "0≤x≤60，且乙仓原量不少于10吨",
        "derivations": [],
        "table": {
          "headers": [
            "仓库",
            "原有量/吨",
            "变化量/吨",
            "现有量/吨"
          ],
          "rows": [
            {
              "label": "甲",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "14",
                  "sources": [
                    "in"
                  ],
                  "given": true
                },
                {
                  "expr": "x+14",
                  "sources": [
                    "unknown",
                    "in"
                  ]
                }
              ]
            },
            {
              "label": "乙",
              "cells": [
                {
                  "expr": "60-x",
                  "sources": [
                    "total",
                    "unknown"
                  ]
                },
                {
                  "expr": "-10",
                  "sources": [
                    "out"
                  ]
                },
                {
                  "expr": "(60-x)-10",
                  "sources": [
                    "total",
                    "unknown",
                    "out"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "甲原量+乙原量=60",
            "现量=原量+变化量"
          ],
          "multiply": []
        },
        "closure": {
          "sources": [
            "equal"
          ],
          "text": "比较运入、运出之后的现有量。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "现有量相等",
            "left": "x+14",
            "right": "(60-x)-10"
          }
        ],
        "answers": [
          {
            "label": "甲原有",
            "expr": "18",
            "unit": "吨"
          },
          {
            "label": "乙原有",
            "expr": "42",
            "unit": "吨"
          }
        ],
        "steps": [
          "x+14=(60−x)−10",
          "x+14=50−x",
          "2x=36",
          "x=18",
          "60−18=42"
        ],
        "checks": [
          {
            "text": "原有量合计",
            "expr": "18+42",
            "result": "60"
          },
          {
            "text": "甲现有量",
            "expr": "18+14",
            "result": "32"
          },
          {
            "text": "乙现有量",
            "expr": "42-10",
            "result": "32"
          }
        ],
        "conclusion": "甲原有18吨，乙原有42吨。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "乙的50−x来自哪两个步骤？能否直接把60当作变化后的总量？"
      }
    ]
  },
  {
    "id": "L7-H3",
    "title": "航模组女生比例",
    "group": "第7课时",
    "source": "《教学设计与指导》175页 · 课后作业3",
    "kind": "linear",
    "stem": "航模小组原来女生占总人数的1/2。后来增加6名女生，女生占全组人数的2/3。航模小组原有多少人？",
    "tags": [
      "比例基准",
      "前后变化"
    ],
    "facts": [
      {
        "id": "before-ratio",
        "text": "原来女生占全组1/2",
        "kind": "given"
      },
      {
        "id": "add-girls",
        "text": "只增加6名女生，男生人数不变",
        "kind": "given"
      },
      {
        "id": "after-ratio",
        "text": "增加后女生占全组2/3",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "original-total",
        "label": "设原总人数为x",
        "variable": "x",
        "meaning": "航模小组原总人数",
        "unit": "人",
        "domain": "x为正整数，女生人数也须为整数",
        "derivations": [],
        "table": {
          "headers": [
            "对象",
            "原人数/人",
            "增加人数/人",
            "现人数/人"
          ],
          "rows": [
            {
              "label": "女生",
              "cells": [
                {
                  "expr": "x/2",
                  "sources": [
                    "before-ratio",
                    "unknown"
                  ]
                },
                {
                  "expr": "6",
                  "sources": [
                    "add-girls"
                  ],
                  "given": true
                },
                {
                  "expr": "x/2+6",
                  "sources": [
                    "before-ratio",
                    "unknown",
                    "add-girls"
                  ]
                }
              ]
            },
            {
              "label": "全组",
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
                    "add-girls"
                  ],
                  "given": true
                },
                {
                  "expr": "x+6",
                  "sources": [
                    "unknown",
                    "add-girls"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "原女生人数+6=现女生人数",
            "原总人数+6=现总人数"
          ],
          "multiply": [
            "女生人数=对应时刻总人数×女生比例"
          ]
        },
        "closure": {
          "sources": [
            "after-ratio"
          ],
          "text": "增加后的女生人数，应等于增加后全组人数的2/3。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "增加后的女生比例",
            "left": "x/2+6",
            "right": "(x+6)*2/3"
          }
        ],
        "answers": [
          {
            "label": "原总人数",
            "expr": "12",
            "unit": "人"
          }
        ],
        "steps": [
          "x÷2+6=(x+6)×2÷3",
          "3x+36=4x+24",
          "x=12"
        ],
        "checks": [
          {
            "text": "原女生数",
            "expr": "12/2",
            "result": "6"
          },
          {
            "text": "增加后总人数",
            "expr": "12+6",
            "result": "18"
          },
          {
            "text": "增加后女生比例",
            "expr": "(12/2+6)/(12+6)",
            "result": "2/3"
          }
        ],
        "conclusion": "原有12人；增加后18人，女生由6人变成12人。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "为何增加后的2/3必须乘x+6，不能仍乘x？"
      }
    ]
  },
  {
    "id": "L8-P1",
    "title": "八折出售的羽绒服",
    "group": "第8课时",
    "source": "《教学设计与指导》176—177页 · 问题1",
    "kind": "linear",
    "stem": "一件羽绒服的标价为进价的1.5倍。促销时按标价八折出售，获利96元。求这件羽绒服的进价。",
    "tags": [
      "折扣",
      "利润"
    ],
    "facts": [
      {
        "id": "markup",
        "text": "标价为进价的1.5倍",
        "kind": "given"
      },
      {
        "id": "discount",
        "text": "按标价八折出售",
        "kind": "given"
      },
      {
        "id": "profit",
        "text": "售价比进价多96元",
        "kind": "given"
      },
      {
        "id": "discount-definition",
        "text": "十折表示原价的全部；几折就是原价的几十分之几",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "cost",
        "label": "设进价为x",
        "variable": "x",
        "meaning": "羽绒服的进价",
        "unit": "元",
        "domain": "x>0",
        "derivations": [
          {
            "id": "discount-rate",
            "label": "八折对应的售价比例",
            "expr": "8/10",
            "result": "0.8",
            "sources": [
              "discount",
              "discount-definition"
            ],
            "explain": "八折是标价的8/10，先计算这个比例，再乘标价。"
          }
        ],
        "table": {
          "headers": [
            "商品",
            "进价/元",
            "标价/元",
            "售价/元",
            "利润/元"
          ],
          "rows": [
            {
              "label": "羽绒服",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "1.5*x",
                  "sources": [
                    "markup",
                    "unknown"
                  ]
                },
                {
                  "expr": "(1.5*x)*0.8",
                  "sources": [
                    "markup",
                    "unknown",
                    "discount-rate"
                  ]
                },
                {
                  "expr": "96",
                  "sources": [
                    "profit"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "进价+利润=售价"
          ],
          "multiply": [
            "标价=进价×1.5",
            "售价=标价×折扣比例"
          ]
        },
        "closure": {
          "sources": [
            "profit"
          ],
          "text": "售价减进价等于利润96元。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "利润关系",
            "left": "(1.5*x)*0.8-x",
            "right": "96"
          }
        ],
        "answers": [
          {
            "label": "进价",
            "expr": "480",
            "unit": "元"
          }
        ],
        "steps": [
          "(1.5x)×0.8−x=96",
          "(1.5×0.8−1)x=96",
          "0.2x=96",
          "x=480"
        ],
        "checks": [
          {
            "text": "售价减进价",
            "expr": "(1.5*480)*0.8-480",
            "result": "96"
          }
        ],
        "conclusion": "进价480元，标价720元，售价576元。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "若改为“标价比进价高160元”，标价格应怎样改？"
      }
    ]
  },
  {
    "id": "L8-P1-V1",
    "title": "七折出售却亏损",
    "group": "第8课时",
    "source": "《教学设计与指导》177页 · 问题1重组例1",
    "kind": "linear",
    "stem": "一件羽绒服的标价为进价的1.2倍。按标价七折出售，亏损96元。求进价。",
    "tags": [
      "折扣",
      "亏损"
    ],
    "facts": [
      {
        "id": "markup",
        "text": "标价为进价的1.2倍",
        "kind": "given"
      },
      {
        "id": "discount",
        "text": "按标价七折出售",
        "kind": "given"
      },
      {
        "id": "loss",
        "text": "进价比售价多96元",
        "kind": "given"
      },
      {
        "id": "discount-definition",
        "text": "十折表示原价的全部；几折就是原价的几十分之几",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "cost",
        "label": "设进价为x",
        "variable": "x",
        "meaning": "羽绒服的进价",
        "unit": "元",
        "domain": "x>0",
        "derivations": [
          {
            "id": "discount-rate",
            "label": "七折对应的售价比例",
            "expr": "7/10",
            "result": "0.7",
            "sources": [
              "discount",
              "discount-definition"
            ],
            "explain": "七折是标价的7/10。"
          }
        ],
        "table": {
          "headers": [
            "商品",
            "进价/元",
            "标价/元",
            "售价/元",
            "亏损/元"
          ],
          "rows": [
            {
              "label": "羽绒服",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "1.2*x",
                  "sources": [
                    "markup",
                    "unknown"
                  ]
                },
                {
                  "expr": "(1.2*x)*0.7",
                  "sources": [
                    "markup",
                    "unknown",
                    "discount-rate"
                  ]
                },
                {
                  "expr": "96",
                  "sources": [
                    "loss"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "售价+亏损=进价"
          ],
          "multiply": [
            "标价=进价×1.2",
            "售价=标价×折扣比例"
          ]
        },
        "closure": {
          "sources": [
            "loss"
          ],
          "text": "亏损时，进价减售价等于96元。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "亏损关系",
            "left": "x-(1.2*x)*0.7",
            "right": "96"
          }
        ],
        "answers": [
          {
            "label": "进价",
            "expr": "600",
            "unit": "元"
          }
        ],
        "steps": [
          "x−(1.2x)×0.7=96",
          "(1−1.2×0.7)x=96",
          "0.16x=96",
          "x=600"
        ],
        "checks": [
          {
            "text": "进价减售价",
            "expr": "600-(1.2*600)*0.7",
            "result": "96"
          }
        ],
        "conclusion": "进价600元，标价720元，售价504元。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "“获利96元”改成“亏损96元”，哪两个量的大小顺序发生变化？"
      }
    ]
  },
  {
    "id": "L8-P1-V2",
    "title": "固定加价后打折",
    "group": "第8课时",
    "source": "《教学设计与指导》177页 · 问题1重组例2",
    "kind": "linear",
    "stem": "一件羽绒服的标价比进价高160元。按标价八折出售，获利96元。求进价。",
    "tags": [
      "先加后乘",
      "折扣"
    ],
    "facts": [
      {
        "id": "markup",
        "text": "标价比进价高160元",
        "kind": "given"
      },
      {
        "id": "discount",
        "text": "按标价八折出售",
        "kind": "given"
      },
      {
        "id": "profit",
        "text": "售价比进价多96元",
        "kind": "given"
      },
      {
        "id": "discount-definition",
        "text": "十折表示原价的全部；几折就是原价的几十分之几",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "cost",
        "label": "设进价为x",
        "variable": "x",
        "meaning": "羽绒服的进价",
        "unit": "元",
        "domain": "x>0",
        "derivations": [
          {
            "id": "discount-rate",
            "label": "八折对应的售价比例",
            "expr": "8/10",
            "result": "0.8",
            "sources": [
              "discount",
              "discount-definition"
            ],
            "explain": "八折是标价的8/10；折扣作用于整个x+160。"
          }
        ],
        "table": {
          "headers": [
            "商品",
            "进价/元",
            "标价/元",
            "售价/元",
            "利润/元"
          ],
          "rows": [
            {
              "label": "羽绒服",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "x+160",
                  "sources": [
                    "markup",
                    "unknown"
                  ]
                },
                {
                  "expr": "(x+160)*0.8",
                  "sources": [
                    "markup",
                    "unknown",
                    "discount-rate"
                  ]
                },
                {
                  "expr": "96",
                  "sources": [
                    "profit"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "标价=进价+160",
            "售价=进价+96"
          ],
          "multiply": [
            "售价=标价×折扣比例"
          ]
        },
        "closure": {
          "sources": [
            "profit"
          ],
          "text": "打折后的售价减进价等于96元。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "利润关系",
            "left": "(x+160)*0.8-x",
            "right": "96"
          }
        ],
        "answers": [
          {
            "label": "进价",
            "expr": "160",
            "unit": "元"
          }
        ],
        "steps": [
          "(x+160)×0.8−x=96",
          "0.8x+128−x=96",
          "−0.2x=−32",
          "x=160"
        ],
        "checks": [
          {
            "text": "利润",
            "expr": "(160+160)*0.8-160",
            "result": "96"
          }
        ],
        "conclusion": "进价160元，标价320元，售价256元。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "为什么本题不能继续把标价写成1.5x？"
      }
    ]
  },
  {
    "id": "L8-P1-V3",
    "title": "计入运输成本的利润",
    "group": "第8课时",
    "source": "《教学设计与指导》177页 · 问题1重组例3",
    "kind": "linear",
    "stem": "一件羽绒服的标价为进价的2.2倍，运输成本为进价的10%。按标价六折出售，扣除进价和运输成本后获利88元。求进价。",
    "tags": [
      "多项成本",
      "百分率",
      "折扣"
    ],
    "facts": [
      {
        "id": "markup",
        "text": "标价为进价的2.2倍",
        "kind": "given"
      },
      {
        "id": "transport",
        "text": "运输成本为进价的10%",
        "kind": "given"
      },
      {
        "id": "discount",
        "text": "按标价六折出售",
        "kind": "given"
      },
      {
        "id": "profit",
        "text": "扣除进价、运输成本后利润88元",
        "kind": "given"
      },
      {
        "id": "discount-definition",
        "text": "十折表示原价的全部；几折就是原价的几十分之几",
        "kind": "property"
      },
      {
        "id": "percent-definition",
        "text": "百分之几表示几除以100",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "cost",
        "label": "设进价为x",
        "variable": "x",
        "meaning": "羽绒服的进价",
        "unit": "元",
        "domain": "x>0",
        "derivations": [
          {
            "id": "transport-rate",
            "label": "运输成本占进价的比例",
            "expr": "10/100",
            "result": "0.1",
            "sources": [
              "transport",
              "percent-definition"
            ],
            "explain": "百分之十就是10/100，基准量为进价。"
          },
          {
            "id": "discount-rate",
            "label": "六折对应的售价比例",
            "expr": "6/10",
            "result": "0.6",
            "sources": [
              "discount",
              "discount-definition"
            ],
            "explain": "六折是标价的6/10，基准量为标价。"
          }
        ],
        "table": {
          "headers": [
            "商品",
            "进价/元",
            "运输成本/元",
            "标价/元",
            "售价/元",
            "利润/元"
          ],
          "rows": [
            {
              "label": "羽绒服",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "x*0.1",
                  "sources": [
                    "transport-rate",
                    "unknown"
                  ]
                },
                {
                  "expr": "2.2*x",
                  "sources": [
                    "markup",
                    "unknown"
                  ]
                },
                {
                  "expr": "(2.2*x)*0.6",
                  "sources": [
                    "markup",
                    "unknown",
                    "discount-rate"
                  ]
                },
                {
                  "expr": "88",
                  "sources": [
                    "profit"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "进价+运输成本+利润=售价"
          ],
          "multiply": [
            "运输成本=进价×10%",
            "标价=进价×2.2",
            "售价=标价×折扣比例"
          ]
        },
        "closure": {
          "sources": [
            "profit"
          ],
          "text": "售价扣除进价和运输成本后等于88元。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "扣除全部成本后的利润",
            "left": "(2.2*x)*0.6-x-x*0.1",
            "right": "88"
          }
        ],
        "answers": [
          {
            "label": "进价",
            "expr": "400",
            "unit": "元"
          }
        ],
        "steps": [
          "(2.2x)×0.6−x−0.1x=88",
          "(2.2×0.6−1−0.1)x=88",
          "0.22x=88",
          "x=400"
        ],
        "checks": [
          {
            "text": "运输成本",
            "expr": "400*0.1",
            "result": "40"
          },
          {
            "text": "最终利润",
            "expr": "(2.2*400)*0.6-400-400*0.1",
            "result": "88"
          }
        ],
        "conclusion": "进价400元，运输成本40元，标价880元，售价528元。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "若运输费改为固定40元，运输成本的表达式和方程怎样变化？"
      }
    ]
  },
  {
    "id": "L8-P2-Q1",
    "title": "小亮多久追上",
    "group": "第8课时",
    "source": "《教学设计与指导》177—178页 · 问题2可能提问1、教师示范",
    "kind": "linear",
    "stem": "小明从学校出发，以5千米/小时步行；0.5小时后，小亮从同一学校出发，以15千米/小时沿同一路线追赶。小亮出发多久后追上小明？",
    "tags": [
      "追及",
      "时间差"
    ],
    "facts": [
      {
        "id": "ming-speed",
        "text": "小明速度5千米/小时",
        "kind": "given"
      },
      {
        "id": "liang-speed",
        "text": "小亮速度15千米/小时",
        "kind": "given"
      },
      {
        "id": "lead",
        "text": "小明先行0.5小时",
        "kind": "given"
      },
      {
        "id": "same-origin",
        "text": "两人从同一起点沿同一路线同向前进",
        "kind": "given"
      },
      {
        "id": "meet",
        "text": "追上时两人位置相同",
        "kind": "given"
      },
      {
        "id": "hour-minute",
        "text": "1小时=60分钟，小时数乘60可换成分钟数",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "liang-time",
        "label": "设小亮行进时间为x",
        "variable": "x",
        "meaning": "从小亮出发开始经过的时间",
        "unit": "小时",
        "domain": "x≥0",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "速度/千米每小时",
            "行进时间/小时",
            "距起点的位置/千米"
          ],
          "rows": [
            {
              "label": "小明",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "ming-speed"
                  ],
                  "given": true
                },
                {
                  "expr": "x+0.5",
                  "sources": [
                    "unknown",
                    "lead"
                  ]
                },
                {
                  "expr": "5*(x+0.5)",
                  "sources": [
                    "ming-speed",
                    "lead",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "小亮",
              "cells": [
                {
                  "expr": "15",
                  "sources": [
                    "liang-speed"
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
                  "expr": "15*x",
                  "sources": [
                    "liang-speed",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "小明行进时间=小亮行进时间+0.5小时"
          ],
          "multiply": [
            "速度×时间=距共同起点的位置"
          ]
        },
        "closure": {
          "sources": [
            "meet"
          ],
          "text": "从同一起点出发，追上时两人的路程相等。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "追上时的位置相同",
            "left": "5*(x+0.5)",
            "right": "15*x"
          }
        ],
        "answers": [
          {
            "label": "小亮行进时间",
            "expr": "0.25",
            "unit": "小时"
          }
        ],
        "steps": [
          "5(x+0.5)=15x",
          "5x+2.5=15x",
          "10x=2.5",
          "x=0.25",
          "0.25×60=15"
        ],
        "checks": [
          {
            "text": "小明位置",
            "expr": "5*(0.25+0.5)",
            "result": "3.75"
          },
          {
            "text": "小亮位置",
            "expr": "15*0.25",
            "result": "3.75"
          },
          {
            "text": "换算成分钟",
            "expr": "0.25*60",
            "result": "15"
          }
        ],
        "conclusion": "小亮出发0.25小时，即15分钟后追上小明。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "如果改设小明总行进时间为x，小亮时间该怎样表示？"
      }
    ],
    "diagram": "chase",
    "diagramData": {
      "mode": "delayed",
      "leadHours": 0.5,
      "speeds": [
        5,
        15
      ]
    }
  },
  {
    "id": "L8-P2-Q2",
    "title": "追上时小明走了多久",
    "group": "第8课时",
    "source": "《教学设计与指导》177页 · 问题2可能提问2",
    "kind": "linear",
    "stem": "小明从学校出发，以5千米/小时步行；0.5小时后，小亮从同一学校出发，以15千米/小时沿同一路线追赶。小亮追上小明时，小明已出发多久？",
    "tags": [
      "追及",
      "不同计时起点"
    ],
    "facts": [
      {
        "id": "ming-speed",
        "text": "小明速度5千米/小时",
        "kind": "given"
      },
      {
        "id": "liang-speed",
        "text": "小亮速度15千米/小时",
        "kind": "given"
      },
      {
        "id": "lead",
        "text": "小明先行0.5小时",
        "kind": "given"
      },
      {
        "id": "same-origin",
        "text": "两人从同一起点沿同一路线同向前进",
        "kind": "given"
      },
      {
        "id": "meet",
        "text": "追上时两人位置相同",
        "kind": "given"
      },
      {
        "id": "hour-minute",
        "text": "1小时=60分钟，小时数乘60可换成分钟数",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "ming-time",
        "label": "设小明总行进时间为x",
        "variable": "x",
        "meaning": "从小明出发到被追上的总时间",
        "unit": "小时",
        "domain": "x≥0.5",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "速度/千米每小时",
            "行进时间/小时",
            "距起点的位置/千米"
          ],
          "rows": [
            {
              "label": "小明",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "ming-speed"
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
                    "ming-speed",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "小亮",
              "cells": [
                {
                  "expr": "15",
                  "sources": [
                    "liang-speed"
                  ],
                  "given": true
                },
                {
                  "expr": "x-0.5",
                  "sources": [
                    "unknown",
                    "lead"
                  ]
                },
                {
                  "expr": "15*(x-0.5)",
                  "sources": [
                    "liang-speed",
                    "unknown",
                    "lead"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "小亮时间=小明总时间−0.5小时"
          ],
          "multiply": [
            "速度×时间=路程"
          ]
        },
        "closure": {
          "sources": [
            "meet"
          ],
          "text": "追上时两人的位置相同。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "追上位置相同",
            "left": "5*x",
            "right": "15*(x-0.5)"
          }
        ],
        "answers": [
          {
            "label": "小明总行进时间",
            "expr": "0.75",
            "unit": "小时"
          }
        ],
        "steps": [
          "5x=15(x−0.5)",
          "5x=15x−7.5",
          "10x=7.5",
          "x=0.75",
          "0.75×60=45"
        ],
        "checks": [
          {
            "text": "小明位置",
            "expr": "5*0.75",
            "result": "3.75"
          },
          {
            "text": "小亮位置",
            "expr": "15*(0.75-0.5)",
            "result": "3.75"
          },
          {
            "text": "换算为分钟",
            "expr": "0.75*60",
            "result": "45"
          }
        ],
        "conclusion": "追上时小明已出发0.75小时，即45分钟。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "为什么这个答案与小亮出发后的15分钟不同？"
      }
    ],
    "diagram": "chase"
  },
  {
    "id": "L8-P2-Q3",
    "title": "一小时后相距多远",
    "group": "第8课时",
    "source": "《教学设计与指导》177页 · 问题2可能提问3",
    "kind": "arithmetic",
    "stem": "小明从学校出发，以5千米/小时步行；0.5小时后，小亮从同一学校出发，以15千米/小时沿同一路线追赶。小亮出发1小时后，两人相距多少千米？本题规定追上后仍按原速度沿同一路线前进，且未到终点。",
    "tags": [
      "正向计算",
      "位置差"
    ],
    "facts": [
      {
        "id": "ming-speed",
        "text": "小明速度5千米/小时",
        "kind": "given"
      },
      {
        "id": "liang-speed",
        "text": "小亮速度15千米/小时",
        "kind": "given"
      },
      {
        "id": "lead",
        "text": "小明先行0.5小时",
        "kind": "given"
      },
      {
        "id": "same-origin",
        "text": "两人从同一起点沿同一路线同向前进",
        "kind": "given"
      },
      {
        "id": "elapsed",
        "text": "从小亮出发计，已过1小时",
        "kind": "given"
      },
      {
        "id": "continue",
        "text": "按本题分析约定：追上后仍按原速度沿同一路线前进，且未到终点",
        "kind": "convention"
      }
    ],
    "routes": [
      {
        "id": "distance-gap",
        "label": "比较一小时后的位置",
        "variable": "x",
        "meaning": "两人的距离",
        "unit": "千米",
        "domain": "距离非负",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "速度/千米每小时",
            "行进时间/小时",
            "距起点的位置/千米"
          ],
          "rows": [
            {
              "label": "小明",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "ming-speed"
                  ],
                  "given": true
                },
                {
                  "expr": "1+0.5",
                  "sources": [
                    "elapsed",
                    "lead"
                  ]
                },
                {
                  "expr": "5*(1+0.5)",
                  "sources": [
                    "ming-speed",
                    "elapsed",
                    "lead"
                  ]
                }
              ]
            },
            {
              "label": "小亮",
              "cells": [
                {
                  "expr": "15",
                  "sources": [
                    "liang-speed"
                  ],
                  "given": true
                },
                {
                  "expr": "1",
                  "sources": [
                    "elapsed"
                  ],
                  "given": true
                },
                {
                  "expr": "15*1",
                  "sources": [
                    "liang-speed",
                    "elapsed"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "两人距离=较大位置−较小位置"
          ],
          "multiply": [
            "速度×时间=位置"
          ]
        },
        "closure": {
          "sources": [
            "elapsed",
            "same-origin"
          ],
          "text": "先算同一时刻的位置，再用较大位置减较小位置。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [],
        "answers": [
          {
            "label": "两人距离",
            "expr": "7.5",
            "unit": "千米"
          }
        ],
        "steps": [
          "5×(1+0.5)=7.5",
          "15×1=15",
          "15−7.5=7.5"
        ],
        "checks": [
          {
            "text": "小亮位置减小明位置",
            "expr": "15*1-5*(1+0.5)",
            "result": "7.5"
          }
        ],
        "conclusion": "此时小亮在前，两人相距7.5千米。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "如果题目没有说明追上后如何运动，也没有终点信息，能否直接确定结果？"
      }
    ],
    "diagram": "chase",
    "notices": [
      "本题涉及追上后的运动；明确按继续原速、同一路线且未到终点处理。"
    ]
  },
  {
    "id": "L8-P2-Q4",
    "title": "两次相距一千米",
    "group": "第8课时",
    "source": "《教学设计与指导》177页 · 问题2可能提问4",
    "kind": "branching",
    "stem": "小明从学校出发，以5千米/小时步行；0.5小时后，小亮从同一学校出发，以15千米/小时沿同一路线追赶。从小亮出发计，什么时候两人相距1千米？本题规定追上后仍按原速度沿同一路线前进，且未到终点。",
    "tags": [
      "追及",
      "两种情形"
    ],
    "facts": [
      {
        "id": "ming-speed",
        "text": "小明速度5千米/小时",
        "kind": "given"
      },
      {
        "id": "liang-speed",
        "text": "小亮速度15千米/小时",
        "kind": "given"
      },
      {
        "id": "lead",
        "text": "小明先行0.5小时",
        "kind": "given"
      },
      {
        "id": "same-origin",
        "text": "两人从同一起点沿同一路线同向前进",
        "kind": "given"
      },
      {
        "id": "gap",
        "text": "两人相距1千米",
        "kind": "given"
      },
      {
        "id": "continue",
        "text": "按本题分析约定：追上后仍按原速度沿同一路线前进，且未到终点",
        "kind": "convention"
      },
      {
        "id": "hour-minute",
        "text": "1小时=60分钟，小时数乘60可换成分钟数",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "both-orders",
        "label": "按两种前后顺序分别设x",
        "variable": "x",
        "meaning": "从小亮出发开始经过的时间；两种情形各自求x",
        "unit": "小时",
        "domain": "每个情形中的x≥0",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "速度/千米每小时",
            "行进时间/小时",
            "距起点的位置/千米"
          ],
          "rows": [
            {
              "label": "小明",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "ming-speed"
                  ],
                  "given": true
                },
                {
                  "expr": "x+0.5",
                  "sources": [
                    "unknown",
                    "lead"
                  ]
                },
                {
                  "expr": "5*(x+0.5)",
                  "sources": [
                    "ming-speed",
                    "lead",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "小亮",
              "cells": [
                {
                  "expr": "15",
                  "sources": [
                    "liang-speed"
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
                  "expr": "15*x",
                  "sources": [
                    "liang-speed",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "较大位置=较小位置+1千米",
            "小明时间=小亮时间+0.5小时"
          ],
          "multiply": [
            "速度×时间=位置"
          ]
        },
        "closure": {
          "sources": [
            "gap"
          ],
          "text": "分别讨论小明在前和小亮在前，每一支独立列一个方程。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "小明在前时",
            "left": "5*(x+0.5)",
            "right": "15*x+1"
          },
          {
            "label": "小亮在前时",
            "left": "15*x",
            "right": "5*(x+0.5)+1"
          }
        ],
        "answers": [
          {
            "label": "小明在前时的小亮行进时间",
            "expr": "0.15",
            "unit": "小时"
          },
          {
            "label": "小亮在前时的小亮行进时间",
            "expr": "0.35",
            "unit": "小时"
          }
        ],
        "steps": [
          "5(x+0.5)=15x+1",
          "10x=1.5",
          "x=0.15",
          "15x=5(x+0.5)+1",
          "10x=3.5",
          "x=0.35",
          "0.15×60=9",
          "0.35×60=21"
        ],
        "checks": [
          {
            "text": "第一种位置差",
            "expr": "5*(0.15+0.5)-15*0.15",
            "result": "1"
          },
          {
            "text": "第二种位置差",
            "expr": "15*0.35-5*(0.35+0.5)",
            "result": "1"
          },
          {
            "text": "第一时刻换算分钟",
            "expr": "0.15*60",
            "result": "9"
          },
          {
            "text": "第二时刻换算分钟",
            "expr": "0.35*60",
            "result": "21"
          }
        ],
        "conclusion": "从小亮出发计，9分钟和21分钟各出现一次相距1千米。两条方程分别描述两个时刻，不能联立要求同一个x同时成立。",
        "verdict": {
          "correct": "multiple",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "未限定谁在前，必须保留追上前与追上后两种顺序；两个时刻均从小亮出发计。"
        },
        "variation": "若题目增加“还没有追上”，应保留哪一种情形？"
      }
    ],
    "diagram": "chase",
    "notices": [
      "本题涉及追上后的运动；明确按继续原速、同一路线且未到终点处理。"
    ]
  },
  {
    "id": "L8-P2-Q5",
    "title": "路程变为两倍",
    "group": "第8课时",
    "source": "《教学设计与指导》177页 · 问题2可能提问5",
    "kind": "linear",
    "stem": "小明从学校出发，以5千米/小时步行；0.5小时后，小亮从同一学校出发，以15千米/小时沿同一路线追赶。从小亮出发计，多久后小亮走过的路程是小明的2倍？本题规定追上后仍按原速度沿同一路线前进，且未到终点。",
    "tags": [
      "追及",
      "倍数比较"
    ],
    "facts": [
      {
        "id": "ming-speed",
        "text": "小明速度5千米/小时",
        "kind": "given"
      },
      {
        "id": "liang-speed",
        "text": "小亮速度15千米/小时",
        "kind": "given"
      },
      {
        "id": "lead",
        "text": "小明先行0.5小时",
        "kind": "given"
      },
      {
        "id": "same-origin",
        "text": "两人从同一起点沿同一路线同向前进",
        "kind": "given"
      },
      {
        "id": "ratio",
        "text": "小亮路程是小明路程的2倍",
        "kind": "given"
      },
      {
        "id": "continue",
        "text": "按本题分析约定：追上后仍按原速度沿同一路线前进，且未到终点",
        "kind": "convention"
      }
    ],
    "routes": [
      {
        "id": "liang-time",
        "label": "设小亮行进时间为x",
        "variable": "x",
        "meaning": "从小亮出发开始经过的时间",
        "unit": "小时",
        "domain": "x≥0",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "速度/千米每小时",
            "行进时间/小时",
            "距起点的位置/千米"
          ],
          "rows": [
            {
              "label": "小明",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "ming-speed"
                  ],
                  "given": true
                },
                {
                  "expr": "x+0.5",
                  "sources": [
                    "unknown",
                    "lead"
                  ]
                },
                {
                  "expr": "5*(x+0.5)",
                  "sources": [
                    "ming-speed",
                    "lead",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "小亮",
              "cells": [
                {
                  "expr": "15",
                  "sources": [
                    "liang-speed"
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
                  "expr": "15*x",
                  "sources": [
                    "liang-speed",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "小明时间=小亮时间+0.5小时"
          ],
          "multiply": [
            "速度×时间=路程",
            "小亮路程=2×小明路程"
          ]
        },
        "closure": {
          "sources": [
            "ratio"
          ],
          "text": "这次比较的是2倍关系，不是追上时的路程相等。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "路程的两倍关系",
            "left": "15*x",
            "right": "2*5*(x+0.5)"
          }
        ],
        "answers": [
          {
            "label": "小亮行进时间",
            "expr": "1",
            "unit": "小时"
          }
        ],
        "steps": [
          "15x=2×5(x+0.5)",
          "15x=10x+5",
          "5x=5",
          "x=1"
        ],
        "checks": [
          {
            "text": "小亮路程",
            "expr": "15*1",
            "result": "15"
          },
          {
            "text": "小明路程",
            "expr": "5*(1+0.5)",
            "result": "7.5"
          },
          {
            "text": "路程倍数",
            "expr": "(15*1)/(5*(1+0.5))",
            "result": "2"
          }
        ],
        "conclusion": "小亮出发1小时后，其路程是小明的2倍。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "同一张表如何分别表示“追上”“相距1千米”“路程2倍”？"
      }
    ],
    "diagram": "chase",
    "notices": [
      "本题涉及追上后的运动；明确按继续原速、同一路线且未到终点处理。"
    ]
  },
  {
    "id": "L8-P2-V1",
    "title": "由追上时间求速度",
    "group": "第8课时",
    "source": "《教学设计与指导》178页 · 问题2条件重组（1）",
    "kind": "linear",
    "stem": "小明从学校出发，以5千米/小时步行0.5小时后，小亮骑车从同一地点沿同一路线出发。小亮出发0.25小时后追上小明。求小亮的速度。",
    "tags": [
      "改变未知量",
      "追及"
    ],
    "facts": [
      {
        "id": "ming-speed",
        "text": "小明速度5千米/小时",
        "kind": "given"
      },
      {
        "id": "lead",
        "text": "小明先行0.5小时",
        "kind": "given"
      },
      {
        "id": "liang-time",
        "text": "小亮行进0.25小时后追上",
        "kind": "given"
      },
      {
        "id": "meet",
        "text": "从同一起点同向出发，追上时位置相同",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "liang-speed",
        "label": "设小亮速度为x",
        "variable": "x",
        "meaning": "小亮的骑行速度",
        "unit": "千米/小时",
        "domain": "x>5",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "速度/千米每小时",
            "行进时间/小时",
            "路程/千米"
          ],
          "rows": [
            {
              "label": "小明",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "ming-speed"
                  ],
                  "given": true
                },
                {
                  "expr": "0.5+0.25",
                  "sources": [
                    "lead",
                    "liang-time"
                  ]
                },
                {
                  "expr": "5*(0.5+0.25)",
                  "sources": [
                    "ming-speed",
                    "lead",
                    "liang-time"
                  ]
                }
              ]
            },
            {
              "label": "小亮",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "0.25",
                  "sources": [
                    "liang-time"
                  ],
                  "given": true
                },
                {
                  "expr": "x*0.25",
                  "sources": [
                    "unknown",
                    "liang-time"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "小明总时间=先行时间+小亮行进时间"
          ],
          "multiply": [
            "速度×时间=路程"
          ]
        },
        "closure": {
          "sources": [
            "meet"
          ],
          "text": "追上时两人路程相等。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "追上路程相等",
            "left": "x*0.25",
            "right": "5*(0.5+0.25)"
          }
        ],
        "answers": [
          {
            "label": "小亮速度",
            "expr": "15",
            "unit": "千米/小时"
          }
        ],
        "steps": [
          "0.25x=5(0.5+0.25)",
          "0.25x=3.75",
          "x=15"
        ],
        "checks": [
          {
            "text": "小明路程",
            "expr": "5*(0.5+0.25)",
            "result": "3.75"
          },
          {
            "text": "小亮路程",
            "expr": "15*0.25",
            "result": "3.75"
          }
        ],
        "conclusion": "小亮的速度为15千米/小时。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "3.75是题目直接给出的吗？请指出产生它的两个步骤。"
      }
    ],
    "diagram": "chase"
  },
  {
    "id": "L8-P2-V2",
    "title": "由追上时间求先行时间",
    "group": "第8课时",
    "source": "《教学设计与指导》178页 · 问题2条件重组（2）",
    "kind": "linear",
    "stem": "小明以5千米/小时从学校先走一段时间，小亮再从学校以15千米/小时沿同一路线追赶。小亮出发0.25小时后追上小明。小明先行了多久？",
    "tags": [
      "改变未知量",
      "时间差"
    ],
    "facts": [
      {
        "id": "ming-speed",
        "text": "小明速度5千米/小时",
        "kind": "given"
      },
      {
        "id": "liang-speed",
        "text": "小亮速度15千米/小时",
        "kind": "given"
      },
      {
        "id": "elapsed",
        "text": "小亮行进0.25小时后追上",
        "kind": "given"
      },
      {
        "id": "meet",
        "text": "同起点同向行进，追上时位置相同",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "lead",
        "label": "设先行时间为x",
        "variable": "x",
        "meaning": "小明比小亮先行的时间",
        "unit": "小时",
        "domain": "x≥0",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "速度/千米每小时",
            "行进时间/小时",
            "路程/千米"
          ],
          "rows": [
            {
              "label": "小明",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "ming-speed"
                  ],
                  "given": true
                },
                {
                  "expr": "x+0.25",
                  "sources": [
                    "unknown",
                    "elapsed"
                  ]
                },
                {
                  "expr": "5*(x+0.25)",
                  "sources": [
                    "ming-speed",
                    "unknown",
                    "elapsed"
                  ]
                }
              ]
            },
            {
              "label": "小亮",
              "cells": [
                {
                  "expr": "15",
                  "sources": [
                    "liang-speed"
                  ],
                  "given": true
                },
                {
                  "expr": "0.25",
                  "sources": [
                    "elapsed"
                  ],
                  "given": true
                },
                {
                  "expr": "15*0.25",
                  "sources": [
                    "liang-speed",
                    "elapsed"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "小明总时间=先行时间+0.25小时"
          ],
          "multiply": [
            "速度×时间=路程"
          ]
        },
        "closure": {
          "sources": [
            "meet"
          ],
          "text": "追上时两人的路程相等。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "追上路程相等",
            "left": "5*(x+0.25)",
            "right": "15*0.25"
          }
        ],
        "answers": [
          {
            "label": "小明先行时间",
            "expr": "0.5",
            "unit": "小时"
          }
        ],
        "steps": [
          "5(x+0.25)=15×0.25",
          "5x+1.25=3.75",
          "5x=2.5",
          "x=0.5"
        ],
        "checks": [
          {
            "text": "路程相等",
            "expr": "5*(0.5+0.25)",
            "result": "15*0.25"
          }
        ],
        "conclusion": "小明先行0.5小时。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "先行时间与小明的总行进时间有什么区别？"
      }
    ],
    "diagram": "chase"
  },
  {
    "id": "L8-P2-V3",
    "title": "相距一千米时的先行时间",
    "group": "第8课时",
    "source": "《教学设计与指导》178页 · 问题2条件重组（3）",
    "kind": "branching",
    "stem": "小明以5千米/小时从学校先走一段时间，小亮再从学校以15千米/小时沿同一路线出发。小亮出发0.25小时后，两人相距1千米。求小明先行的时间。本题允许追上后继续按原速度前进，且未到终点。",
    "tags": [
      "追及",
      "两种情形"
    ],
    "facts": [
      {
        "id": "ming-speed",
        "text": "小明速度5千米/小时",
        "kind": "given"
      },
      {
        "id": "liang-speed",
        "text": "小亮速度15千米/小时",
        "kind": "given"
      },
      {
        "id": "elapsed",
        "text": "小亮已行进0.25小时",
        "kind": "given"
      },
      {
        "id": "gap",
        "text": "此时两人相距1千米",
        "kind": "given"
      },
      {
        "id": "same-origin",
        "text": "两人同起点、同路线、同方向",
        "kind": "given"
      },
      {
        "id": "continue",
        "text": "按本题分析约定：追上后仍按原速度沿同一路线前进，且未到终点",
        "kind": "convention"
      },
      {
        "id": "hour-minute",
        "text": "1小时=60分钟，小时数乘60可换成分钟数",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "both-orders",
        "label": "按前后顺序分别设先行时间x",
        "variable": "x",
        "meaning": "小明先行的时间；两种情形分别求x",
        "unit": "小时",
        "domain": "每个情形中的x≥0",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "速度/千米每小时",
            "行进时间/小时",
            "距起点位置/千米"
          ],
          "rows": [
            {
              "label": "小明",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "ming-speed"
                  ],
                  "given": true
                },
                {
                  "expr": "x+0.25",
                  "sources": [
                    "unknown",
                    "elapsed"
                  ]
                },
                {
                  "expr": "5*(x+0.25)",
                  "sources": [
                    "ming-speed",
                    "unknown",
                    "elapsed"
                  ]
                }
              ]
            },
            {
              "label": "小亮",
              "cells": [
                {
                  "expr": "15",
                  "sources": [
                    "liang-speed"
                  ],
                  "given": true
                },
                {
                  "expr": "0.25",
                  "sources": [
                    "elapsed"
                  ],
                  "given": true
                },
                {
                  "expr": "15*0.25",
                  "sources": [
                    "liang-speed",
                    "elapsed"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "小明总时间=先行时间+0.25",
            "较大位置=较小位置+1"
          ],
          "multiply": [
            "速度×时间=位置"
          ]
        },
        "closure": {
          "sources": [
            "gap"
          ],
          "text": "没有限定谁在前，因此分别列两种位置顺序的方程。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "小明仍在前时",
            "left": "5*(x+0.25)",
            "right": "15*0.25+1"
          },
          {
            "label": "小亮已在前时",
            "left": "15*0.25",
            "right": "5*(x+0.25)+1"
          }
        ],
        "answers": [
          {
            "label": "小明仍在前时的先行时间",
            "expr": "0.7",
            "unit": "小时"
          },
          {
            "label": "小亮已在前时的先行时间",
            "expr": "0.3",
            "unit": "小时"
          }
        ],
        "steps": [
          "5(x+0.25)=15×0.25+1",
          "5x+1.25=4.75",
          "x=0.7",
          "15×0.25=5(x+0.25)+1",
          "3.75=5x+2.25",
          "x=0.3",
          "0.7×60=42",
          "0.3×60=18"
        ],
        "checks": [
          {
            "text": "小明在前的位置差",
            "expr": "5*(0.7+0.25)-15*0.25",
            "result": "1"
          },
          {
            "text": "小亮在前的位置差",
            "expr": "15*0.25-5*(0.3+0.25)",
            "result": "1"
          }
        ],
        "conclusion": "可能先行0.7小时（42分钟），也可能先行0.3小时（18分钟）。两种先行时间对应不同情形。",
        "verdict": {
          "correct": "multiple",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "同一距离差可能对应两种前后顺序，两个先行时间均满足其各自情形。"
        },
        "variation": "若加上“小亮还没有追上”，哪种先行时间应删除？"
      }
    ],
    "diagram": "chase",
    "notices": [
      "本题涉及追上后的运动；明确按继续原速、同一路线且未到终点处理。"
    ]
  },
  {
    "id": "L8-T1",
    "title": "自行车的标价",
    "group": "第8课时",
    "source": "《教学设计与指导》179页 · 目标检测1",
    "kind": "linear",
    "stem": "一辆自行车的进价为360元。按标价九折出售时，利润为进价的15%。求这辆自行车的标价。",
    "tags": [
      "利润率",
      "折扣"
    ],
    "facts": [
      {
        "id": "cost",
        "text": "进价360元",
        "kind": "given"
      },
      {
        "id": "discount",
        "text": "按标价九折出售",
        "kind": "given"
      },
      {
        "id": "profit-rate",
        "text": "利润为进价的15%",
        "kind": "given"
      },
      {
        "id": "discount-definition",
        "text": "十折表示原价的全部；几折就是原价的几十分之几",
        "kind": "property"
      },
      {
        "id": "percent-definition",
        "text": "百分之几表示几除以100",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "marked-price",
        "label": "设标价为x",
        "variable": "x",
        "meaning": "自行车的标价",
        "unit": "元",
        "domain": "x>0",
        "derivations": [
          {
            "id": "discount-rate",
            "label": "九折对应的售价比例",
            "expr": "9/10",
            "result": "0.9",
            "sources": [
              "discount",
              "discount-definition"
            ],
            "explain": "九折是标价的9/10。"
          }
        ],
        "table": {
          "headers": [
            "商品",
            "进价/元",
            "标价/元",
            "售价/元",
            "利润/元"
          ],
          "rows": [
            {
              "label": "自行车",
              "cells": [
                {
                  "expr": "360",
                  "sources": [
                    "cost"
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
                  "expr": "x*0.9",
                  "sources": [
                    "unknown",
                    "discount-rate"
                  ]
                },
                {
                  "expr": "360*15%",
                  "sources": [
                    "cost",
                    "profit-rate"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "售价=进价+利润"
          ],
          "multiply": [
            "售价=标价×折扣比例",
            "利润=进价×15%"
          ]
        },
        "closure": {
          "sources": [
            "profit-rate"
          ],
          "text": "售价减进价，应等于进价的15%。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "售价等于进价加利润",
            "left": "x*0.9",
            "right": "360+360*15%"
          }
        ],
        "answers": [
          {
            "label": "标价",
            "expr": "460",
            "unit": "元"
          }
        ],
        "steps": [
          "0.9x=360+360×15%",
          "0.9x=360+54",
          "0.9x=414",
          "x=460"
        ],
        "checks": [
          {
            "text": "利润率",
            "expr": "(460*0.9-360)/360",
            "result": "15%"
          }
        ],
        "conclusion": "标价460元。九折后的售价414元，利润54元。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "如果写成360×1.15，1.15的来源应怎样补写？"
      }
    ]
  },
  {
    "id": "L8-T2",
    "title": "环形步道再次相遇",
    "group": "第8课时",
    "source": "《教学设计与指导》179页 · 目标检测2",
    "kind": "linear",
    "stem": "一条环形步道长400米。小红速度是爷爷的5/3倍，两人从同一点同时同向出发，5分钟后第一次再次相遇。求两人的速度。",
    "tags": [
      "环形追及",
      "一圈差"
    ],
    "facts": [
      {
        "id": "lap",
        "text": "环形步道一圈长400米",
        "kind": "given"
      },
      {
        "id": "ratio",
        "text": "小红速度是爷爷的5/3倍",
        "kind": "given"
      },
      {
        "id": "time",
        "text": "同时出发，5分钟后第一次再次相遇",
        "kind": "given"
      },
      {
        "id": "one-lap",
        "text": "同点同向出发，快者第一次再次追上慢者时恰好多走一圈",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "grandpa-speed",
        "label": "设爷爷速度为x",
        "variable": "x",
        "meaning": "爷爷的行走速度",
        "unit": "米/分钟",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "速度/米每分钟",
            "时间/分钟",
            "路程/米"
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
                    "time"
                  ],
                  "given": true
                },
                {
                  "expr": "x*5",
                  "sources": [
                    "unknown",
                    "time"
                  ]
                }
              ]
            },
            {
              "label": "小红",
              "cells": [
                {
                  "expr": "x*5/3",
                  "sources": [
                    "unknown",
                    "ratio"
                  ]
                },
                {
                  "expr": "5",
                  "sources": [
                    "time"
                  ],
                  "given": true
                },
                {
                  "expr": "(x*5/3)*5",
                  "sources": [
                    "unknown",
                    "ratio",
                    "time"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "小红路程=爷爷路程+一圈400米"
          ],
          "multiply": [
            "速度×时间=路程",
            "小红速度=爷爷速度×5/3"
          ]
        },
        "closure": {
          "sources": [
            "lap",
            "one-lap"
          ],
          "text": "第一次再次相遇时，小红比爷爷多走一圈。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "快者多走一圈",
            "left": "(x*5/3)*5",
            "right": "x*5+400"
          }
        ],
        "answers": [
          {
            "label": "爷爷速度",
            "expr": "120",
            "unit": "米/分钟"
          },
          {
            "label": "小红速度",
            "expr": "200",
            "unit": "米/分钟"
          }
        ],
        "steps": [
          "(5x÷3)×5=5x+400",
          "25x÷3=5x+400",
          "10x÷3=400",
          "x=120",
          "120×5÷3=200"
        ],
        "checks": [
          {
            "text": "相遇时路程差",
            "expr": "200*5-120*5",
            "result": "400"
          },
          {
            "text": "速度比例",
            "expr": "200/120",
            "result": "5/3"
          }
        ],
        "conclusion": "爷爷120米/分钟，小红200米/分钟。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "如果是第二次再次相遇，多走的路程应怎样由圈数和每圈长度算出？"
      }
    ]
  },
  {
    "id": "L8-H1",
    "title": "两件衬衫的盈亏",
    "group": "第8课时",
    "source": "《教学设计与指导》179页 · 课后作业1",
    "kind": "linear",
    "stem": "两件衬衫都以240元卖出。一件的利润是其进价的25%，另一件的亏损是其进价的25%。两件合起来是盈利还是亏损，金额是多少？",
    "tags": [
      "百分率基准",
      "分别建模",
      "合计盈亏"
    ],
    "facts": [
      {
        "id": "sale",
        "text": "两件衬衫的售价分别都是240元",
        "kind": "given"
      },
      {
        "id": "gain",
        "text": "第一件利润为自己的进价的25%",
        "kind": "given"
      },
      {
        "id": "loss",
        "text": "第二件亏损为自己的进价的25%",
        "kind": "given"
      },
      {
        "id": "base",
        "text": "各件自己的进价分别看作1份，盈利是增加，亏损是减少",
        "kind": "convention"
      },
      {
        "id": "percent-definition",
        "text": "25%=25÷100；百分率必须对应自己的基准量",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "separate-costs",
        "label": "分别设两件进价为x、y",
        "variable": "x",
        "meaning": "盈利衬衫的进价",
        "unit": "元",
        "domain": "x>0，y>0",
        "derivations": [
          {
            "id": "gain-factor",
            "label": "盈利件售价相对进价的倍数",
            "expr": "1+25%",
            "result": "1.25",
            "sources": [
              "gain",
              "base",
              "percent-definition"
            ],
            "explain": "进价自身是1份，再增加进价的25%。"
          },
          {
            "id": "loss-factor",
            "label": "亏损件售价相对进价的倍数",
            "expr": "1-25%",
            "result": "0.75",
            "sources": [
              "loss",
              "base",
              "percent-definition"
            ],
            "explain": "进价自身是1份，再减去进价的25%。"
          }
        ],
        "table": {
          "headers": [
            "衬衫",
            "进价/元",
            "售价相对进价的倍数",
            "售价/元",
            "利润/元"
          ],
          "rows": [
            {
              "label": "盈利件",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "1.25",
                  "sources": [
                    "gain-factor"
                  ],
                  "given": true
                },
                {
                  "expr": "240",
                  "sources": [
                    "sale"
                  ],
                  "given": true
                },
                {
                  "expr": "240-x",
                  "sources": [
                    "sale",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "亏损件",
              "cells": [
                {
                  "expr": "y",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "0.75",
                  "sources": [
                    "loss-factor"
                  ],
                  "given": true
                },
                {
                  "expr": "240",
                  "sources": [
                    "sale"
                  ],
                  "given": true
                },
                {
                  "expr": "240-y",
                  "sources": [
                    "sale",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "expr": "x+y",
                  "sources": [
                    "unknown"
                  ]
                },
                {
                  "note": "基准不同，不相加"
                },
                {
                  "expr": "240+240",
                  "sources": [
                    "sale"
                  ]
                },
                {
                  "expr": "(240-x)+(240-y)",
                  "sources": [
                    "sale",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "盈利件售价=进价+进价×25%",
            "亏损件售价=进价−进价×25%",
            "总利润=两件各自利润之和"
          ],
          "multiply": [
            "售价=各自进价×对应倍数"
          ]
        },
        "closure": {
          "sources": [
            "sale"
          ],
          "text": "两件售价各为240元；先分别求两件进价，再合计盈亏。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "盈利件：单独求x",
            "left": "(1+25%)*x",
            "right": "240",
            "variable": "x"
          },
          {
            "label": "亏损件：单独求y",
            "left": "(1-25%)*y",
            "right": "240",
            "variable": "y"
          }
        ],
        "answers": [
          {
            "label": "盈利件进价",
            "expr": "192",
            "unit": "元"
          },
          {
            "label": "亏损件进价",
            "expr": "320",
            "unit": "元"
          },
          {
            "label": "合计利润（亏损填负数）",
            "expr": "-32",
            "unit": "元"
          }
        ],
        "steps": [
          "(1+25%)x=240",
          "1.25x=240",
          "x=192",
          "(1−25%)y=240",
          "0.75y=240",
          "y=320",
          "(240−192)+(240−320)=−32"
        ],
        "checks": [
          {
            "text": "盈利件利润率",
            "expr": "(240-192)/192",
            "result": "25%"
          },
          {
            "text": "亏损件亏损率",
            "expr": "(320-240)/320",
            "result": "25%"
          },
          {
            "text": "合计利润",
            "expr": "(240-192)+(240-320)",
            "result": "-32"
          }
        ],
        "conclusion": "两件合计亏损32元。盈利25%与亏损25%的基准量不同，不能直接抵消。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "若两件进价相同、分别盈利25%和亏损25%，结论会怎样？请说明变化的基准量。",
        "additionalVariables": [
          {
            "variable": "y",
            "meaning": "亏损衬衫的进价",
            "unit": "元",
            "domain": "y>0"
          }
        ]
      }
    ],
    "notices": [
      "分别求解两件衬衫的两个一元一次方程，之后汇总；不是把两个未知数当成一个一元一次方程。"
    ]
  },
  {
    "id": "L8-H2",
    "title": "同路不同速的到达时间",
    "group": "第8课时",
    "source": "《教学设计与指导》179页 · 课后作业2",
    "kind": "linear",
    "stem": "小明和小丽同时从甲村出发，沿同一路线到乙村。小明速度5千米/小时，小丽速度4千米/小时，小丽比小明晚到15分钟。求两村之间的距离。",
    "tags": [
      "同路程",
      "时间差",
      "单位换算"
    ],
    "facts": [
      {
        "id": "ming-speed",
        "text": "小明速度5千米/小时",
        "kind": "given"
      },
      {
        "id": "li-speed",
        "text": "小丽速度4千米/小时",
        "kind": "given"
      },
      {
        "id": "delay",
        "text": "小丽比小明晚到15分钟",
        "kind": "given"
      },
      {
        "id": "same-road",
        "text": "同时出发，两人走同一段路程",
        "kind": "given"
      },
      {
        "id": "hour-minute",
        "text": "1小时=60分钟，小时数乘60可换成分钟数",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "distance",
        "label": "设两村距离为x",
        "variable": "x",
        "meaning": "甲、乙两村之间的距离",
        "unit": "千米",
        "domain": "x>0",
        "derivations": [
          {
            "id": "delay-hours",
            "label": "把15分钟换算为小时",
            "expr": "15/60",
            "result": "0.25",
            "sources": [
              "delay",
              "hour-minute"
            ],
            "explain": "速度单位是千米/小时，时间也统一为小时；分钟数除以60。"
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
              "label": "小明",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "ming-speed"
                  ],
                  "given": true
                },
                {
                  "expr": "x/5",
                  "sources": [
                    "unknown",
                    "ming-speed"
                  ]
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "same-road"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "小丽",
              "cells": [
                {
                  "expr": "4",
                  "sources": [
                    "li-speed"
                  ],
                  "given": true
                },
                {
                  "expr": "x/4",
                  "sources": [
                    "unknown",
                    "li-speed"
                  ]
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "same-road"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "小丽时间=小明时间+到达时间差"
          ],
          "multiply": [
            "速度×时间=路程，所以时间=路程÷速度"
          ]
        },
        "closure": {
          "sources": [
            "delay"
          ],
          "text": "同时出发，晚到15分钟意味着总行进时间多15分钟。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "到达时间差",
            "left": "x/4",
            "right": "x/5+0.25"
          }
        ],
        "answers": [
          {
            "label": "两村距离",
            "expr": "5",
            "unit": "千米"
          }
        ],
        "steps": [
          "x÷4=x÷5+0.25",
          "x÷4−x÷5=0.25",
          "x÷20=0.25",
          "x=5"
        ],
        "checks": [
          {
            "text": "时间差（小时）",
            "expr": "5/4-5/5",
            "result": "0.25"
          },
          {
            "text": "时间差换算分钟",
            "expr": "(5/4-5/5)*60",
            "result": "15"
          }
        ],
        "conclusion": "两村相距5千米。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "如果设小明的行进时间，如何表示小丽的时间，再比较两人的路程？"
      }
    ]
  },
  {
    "id": "L8-H3",
    "title": "上山和下山",
    "group": "第8课时",
    "source": "《教学设计与指导》179页 · 课后作业3",
    "kind": "linear",
    "stem": "沿同一条山路上山、下山，共用2小时。上山速度3千米/小时，下山速度5千米/小时。求这条山路的单程长度。",
    "tags": [
      "分段行程",
      "同路程"
    ],
    "facts": [
      {
        "id": "up",
        "text": "上山速度3千米/小时",
        "kind": "given"
      },
      {
        "id": "down",
        "text": "下山速度5千米/小时",
        "kind": "given"
      },
      {
        "id": "total-time",
        "text": "上山、下山时间合计2小时",
        "kind": "given"
      },
      {
        "id": "same-path",
        "text": "上山、下山沿同一路径，单程路程相同",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "distance",
        "label": "设单程路长为x",
        "variable": "x",
        "meaning": "这条山路的单程长度",
        "unit": "千米",
        "domain": "x>0",
        "derivations": [],
        "table": {
          "headers": [
            "阶段",
            "速度/千米每小时",
            "时间/小时",
            "路程/千米"
          ],
          "rows": [
            {
              "label": "上山",
              "cells": [
                {
                  "expr": "3",
                  "sources": [
                    "up"
                  ],
                  "given": true
                },
                {
                  "expr": "x/3",
                  "sources": [
                    "unknown",
                    "up"
                  ]
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "same-path"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "下山",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "down"
                  ],
                  "given": true
                },
                {
                  "expr": "x/5",
                  "sources": [
                    "unknown",
                    "down"
                  ]
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "same-path"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "速度不直接相加"
                },
                {
                  "expr": "2",
                  "sources": [
                    "total-time"
                  ],
                  "given": true
                },
                {
                  "expr": "x+x",
                  "sources": [
                    "unknown",
                    "same-path"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "上山时间+下山时间=2小时",
            "往返路程=单程路程+单程路程"
          ],
          "multiply": [
            "速度×时间=路程，所以时间=路程÷速度"
          ]
        },
        "closure": {
          "sources": [
            "total-time"
          ],
          "text": "分段时间相加等于总用时2小时。",
          "hint": "哪些条件已经用来填表？哪一条条件还需要通过方程或比较来满足？"
        },
        "equations": [
          {
            "label": "总用时",
            "left": "x/3+x/5",
            "right": "2"
          }
        ],
        "answers": [
          {
            "label": "单程山路长",
            "expr": "3.75",
            "unit": "千米"
          }
        ],
        "steps": [
          "x÷3+x÷5=2",
          "(5x+3x)÷15=2",
          "8x=30",
          "x=15÷4=3.75"
        ],
        "checks": [
          {
            "text": "总用时",
            "expr": "3.75/3+3.75/5",
            "result": "2"
          }
        ],
        "conclusion": "这条山路单程长3.75千米。",
        "verdict": {
          "correct": "valid",
          "prompt": "这些结果是否完整并符合题意？",
          "explain": "代回原条件，检查单位、取值范围和题目所问的量。"
        },
        "variation": "为什么不能用两种速度的算术平均数乘总时间来算往返路程？"
      }
    ]
  }
];
  if(typeof module==='object'&&module.exports)module.exports=data;
  else(root.RatioWordProblemsData ||= []).push(...data);
})(typeof window==='undefined'?globalThis:window);
