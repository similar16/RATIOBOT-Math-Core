/* Chapter 4 review activities, paraphrased from the user-provided 2026 textbook. */
(function(root){'use strict';
const data = [
  {
    "id": "TB-R01",
    "textbookItemId": "R01",
    "title": "月历中的三数框与十字框",
    "group": "教材·探索研究",
    "source": "《数学 七年级上册》苏科版2026，132页 · 月历中的方程问题",
    "kind": "arithmetic",
    "stem": "准备一个实际月历：①用横向或竖向的一字框框出3个数，给出它们的和，让同学求这3个数；②用十字框框出5个数，做同样的游戏；③设计其他形状的框；④举出月历问题中无法实现的情形.题目没有指定月份或总和.",
    "tags": [
      "月历",
      "中心数",
      "基本数量关系"
    ],
    "facts": [
      {
        "id": "three",
        "text": "一字框横着或竖着框出3个日期.",
        "kind": "given"
      },
      {
        "id": "five",
        "text": "十字框框出中心及其上下左右，共5个日期.",
        "kind": "given"
      },
      {
        "id": "calendar",
        "text": "同一行相邻日期相差1，同一列相邻日期相差7；一周有7天.",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "比较中心数与所框日期之和",
        "variable": "x",
        "meaning": "本次所选框的中心日期",
        "unit": "日",
        "domain": "用x表示中心数，只填写框内日期个数",
        "derivations": [],
        "table": {
          "headers": [
            "框形",
            "框内日期个数"
          ],
          "rows": [
            {
              "label": "三数框（横框或竖框）",
              "cells": [
                {
                  "expr": "3",
                  "sources": [
                    "three"
                  ]
                }
              ]
            },
            {
              "label": "十字框",
              "cells": [
                {
                  "expr": "5",
                  "sources": [
                    "five"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [],
          "multiply": [
            "中心数×3＝三数之和",
            "中心数×5＝五数之和"
          ]
        },
        "closure": {
          "sources": [
            "three",
            "five",
            "calendar"
          ],
          "text": "日期之和＝中心数×框内日期个数."
        },
        "equations": [],
        "answers": [],
        "steps": [
          "x*3=s",
          "x*5=s"
        ],
        "checks": [],
        "conclusion": "三数框的日期和是中心数的3倍，十字框的日期和是中心数的5倍.",
        "verdict": {
          "correct": "valid",
          "prompt": "基本数量关系是否正确？",
          "explain": "三数框的日期和是中心数的3倍，十字框的日期和是中心数的5倍."
        },
        "additionalVariables": [
          {
            "variable": "s",
            "meaning": "本次活动给出的所框日期总和",
            "unit": "日期数值之和",
            "domain": "对应框内日期之和",
            "known": true
          }
        ],
        "tableNote": "三数框乘3，十字框乘5.",
        "relationshipOnly": true
      }
    ],
    "contentRevision": 3,
    "originalStem": "准备一个月历，两人一组完成下面的活动：\n（1）用如图所示的透明“一”字形框，在月历上横着或竖着框出3个数，并把这3个数的和告诉同学，请同学求出这3个数.\n（2）用如图所示的透明“十”字形框，在月历上框出5个数，并把这5个数的和告诉同学，请同学求出这5个数.\n（3）请你设计一个其他形状的透明框，和同学做类似前面的游戏.\n（4）用方程解决实际问题时有时会出现无解的情况.在“月历问题”中，你能举出一些例子吗？",
    "originalStems": {
      "R01": "准备一个月历，两人一组完成下面的活动：\n（1）用如图所示的透明“一”字形框，在月历上横着或竖着框出3个数，并把这3个数的和告诉同学，请同学求出这3个数.\n（2）用如图所示的透明“十”字形框，在月历上框出5个数，并把这5个数的和告诉同学，请同学求出这5个数.\n（3）请你设计一个其他形状的透明框，和同学做类似前面的游戏.\n（4）用方程解决实际问题时有时会出现无解的情况.在“月历问题”中，你能举出一些例子吗？"
    },
    "sourceFigure": {
      "file": "figures/calendar-frames.svg",
      "alt": "横向、竖向一字框与十字框"
    },
    "kindLabel": "基本数量关系",
    "analysisNote": "关注三数框、十字框的中心数与日期之和的关系."
  },
  {
    "id": "TB-R03",
    "textbookItemId": "R03",
    "title": "弹簧长度与所挂质量",
    "group": "教材·复习巩固",
    "source": "《数学 七年级上册》苏科版2026，134页 · 复习巩固 第7题",
    "kind": "linear",
    "stem": "弹簧原长40厘米，所挂物体质量每增加1千克，弹簧伸长2厘米.弹簧长45厘米时，所挂物体的质量是多少？",
    "tags": [
      "变化量",
      "原量与现量"
    ],
    "facts": [
      {
        "id": "original",
        "text": "弹簧原长40厘米.",
        "kind": "given"
      },
      {
        "id": "increment",
        "text": "所挂物体的质量每增加1千克，弹簧伸长2厘米.",
        "kind": "given"
      },
      {
        "id": "length",
        "text": "挂物体后弹簧长45厘米.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设所挂物体的质量为x",
        "variable": "x",
        "meaning": "所挂物体的质量",
        "unit": "千克",
        "domain": "x为正数，计算结果还需符合题目的数量范围",
        "derivations": [
          {
            "id": "rate",
            "label": "每千克使弹簧伸长多少",
            "expr": "2/1",
            "result": "2",
            "sources": [
              "increment"
            ],
            "explain": "由伸长2厘米÷质量增加1千克得到."
          }
        ],
        "table": {
          "headers": [
            "部分",
            "每千克伸长量/厘米每千克",
            "悬挂质量/千克",
            "长度/厘米"
          ],
          "rows": [
            {
              "label": "原长",
              "cells": [
                {
                  "note": "不随质量计入此项"
                },
                {
                  "note": "未悬挂时的原长"
                },
                {
                  "expr": "40",
                  "sources": [
                    "original"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "伸长量",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "rate"
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
                    "rate",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "挂物体后的总长",
              "cells": [
                {
                  "note": "原长与伸长相加"
                },
                {
                  "note": "同一个物体"
                },
                {
                  "expr": "45",
                  "sources": [
                    "length"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "原长＋伸长量＝挂物体后的总长"
          ],
          "multiply": [
            "伸长量＝每千克伸长量×物体质量"
          ]
        },
        "closure": {
          "sources": [
            "length"
          ],
          "text": "原长与伸长量之和为45厘米.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "长度组成",
            "left": "40+2*x",
            "right": "45"
          }
        ],
        "answers": [
          {
            "label": "所挂物体质量",
            "expr": "2.5",
            "unit": "千克"
          }
        ],
        "steps": [
          "40+2*x=45",
          "2*x=45-40",
          "x=(45-40)/2=2.5"
        ],
        "checks": [
          {
            "text": "挂物体后的长度",
            "expr": "40+2*2.5",
            "result": "45"
          }
        ],
        "conclusion": "所挂物体质量为2.5千克；这里45厘米是总长，不能直接用45除以2.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "所挂物体质量为2.5千克；这里45厘米是总长，不能直接用45除以2."
        },
        "variation": "若弹簧总长变为另一个数，表中哪个格子改变？"
      }
    ],
    "originalStem": "一根弹簧长40 cm，一端固定，另一端可挂重物.如果所挂物体的质量每增加1 kg，弹簧伸长2 cm，那么弹簧长度为45 cm时所挂物体的质量是多少？",
    "originalStems": {
      "R03": "一根弹簧长40 cm，一端固定，另一端可挂重物.如果所挂物体的质量每增加1 kg，弹簧伸长2 cm，那么弹簧长度为45 cm时所挂物体的质量是多少？"
    }
  },
  {
    "id": "TB-R04",
    "textbookItemId": "R04",
    "title": "读完剩余的一半后还有15页",
    "group": "教材·复习巩固",
    "source": "《数学 七年级上册》苏科版2026，134页 · 复习巩固 第8题",
    "kind": "linear",
    "stem": "小明星期六读了科普书20页，星期日读了剩余部分的一半后，还剩15页.这本科普书共有多少页？",
    "tags": [
      "阶段",
      "基准量"
    ],
    "facts": [
      {
        "id": "sat",
        "text": "星期六读20页.",
        "kind": "given"
      },
      {
        "id": "sun",
        "text": "星期日读星期六后剩余部分的一半.",
        "kind": "given"
      },
      {
        "id": "left",
        "text": "星期日读完后剩15页.",
        "kind": "given"
      },
      {
        "id": "half",
        "text": "一半表示把基准量平均分成2份，取其中1份.",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设全书页数为x",
        "variable": "x",
        "meaning": "全书页数",
        "unit": "页",
        "domain": "x是大于20的整数",
        "derivations": [],
        "table": {
          "headers": [
            "阶段",
            "读前未读/页",
            "本次阅读/页",
            "读后未读/页"
          ],
          "rows": [
            {
              "label": "星期六",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "20",
                  "sources": [
                    "sat"
                  ],
                  "given": true
                },
                {
                  "expr": "x-20",
                  "sources": [
                    "unknown",
                    "sat"
                  ]
                }
              ]
            },
            {
              "label": "星期日",
              "cells": [
                {
                  "expr": "x-20",
                  "sources": [
                    "unknown",
                    "sat"
                  ]
                },
                {
                  "expr": "(x-20)/2",
                  "sources": [
                    "unknown",
                    "sat",
                    "sun",
                    "half"
                  ]
                },
                {
                  "expr": "15",
                  "sources": [
                    "left"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "读前未读页数＝本次阅读页数＋读后未读页数"
          ],
          "multiply": [
            "星期日阅读页数＝星期日读前未读页数×二分之一"
          ]
        },
        "closure": {
          "sources": [
            "left"
          ],
          "text": "星期日读完后剩15页.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "星期日剩余页数",
            "left": "(x-20)-(x-20)/2",
            "right": "15"
          }
        ],
        "answers": [
          {
            "label": "全书页数",
            "expr": "50",
            "unit": "页"
          }
        ],
        "steps": [
          "(x-20)-(x-20)/2=15",
          "x-20=15*2",
          "x=15*2+20=50"
        ],
        "checks": [
          {
            "text": "星期日读前剩余",
            "expr": "50-20",
            "result": "30"
          },
          {
            "text": "星期日读后剩余",
            "expr": "(50-20)-(50-20)/2",
            "result": "15"
          }
        ],
        "conclusion": "全书共有50页；星期日的一半以星期六后剩余的30页为基准.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "全书共有50页；星期日的一半以星期六后剩余的30页为基准."
        },
        "variation": "如果星期日改为读全书的一半，表中哪一个表达式必须改变？"
      }
    ],
    "originalStem": "小明读一本科普书，星期六读了20页，星期日读了剩余部分的一半后，还剩15页没有读.这本科普书共有多少页？",
    "originalStems": {
      "R04": "小明读一本科普书，星期六读了20页，星期日读了剩余部分的一半后，还剩15页没有读.这本科普书共有多少页？"
    }
  },
  {
    "id": "TB-R05",
    "textbookItemId": "R05",
    "title": "地球表面的海洋与陆地",
    "group": "教材·复习巩固",
    "source": "《数学 七年级上册》苏科版2026，134页 · 复习巩固 第9题",
    "kind": "linear",
    "stem": "地球表面积约为5.1亿平方千米，海洋面积约为陆地面积的2.4倍.海洋面积和陆地面积各是多少？",
    "tags": [
      "部分与整体",
      "倍数"
    ],
    "facts": [
      {
        "id": "total",
        "text": "地球表面积约为5.1亿平方千米，由海洋与陆地面积组成.",
        "kind": "given"
      },
      {
        "id": "ratio",
        "text": "海洋面积约为陆地面积的2.4倍.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设陆地面积为x",
        "variable": "x",
        "meaning": "陆地面积",
        "unit": "亿平方千米",
        "domain": "x为正数，计算结果还需符合题目的数量范围",
        "derivations": [],
        "table": {
          "headers": [
            "部分",
            "面积/亿平方千米"
          ],
          "rows": [
            {
              "label": "陆地",
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
              "label": "海洋",
              "cells": [
                {
                  "expr": "2.4*x",
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
                  "expr": "5.1",
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
            "陆地面积＋海洋面积＝地球表面积"
          ],
          "multiply": [
            "海洋面积＝2.4×陆地面积"
          ]
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "两部分面积之和约为5.1亿平方千米.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "表面积组成",
            "left": "x+2.4*x",
            "right": "5.1"
          }
        ],
        "answers": [
          {
            "label": "陆地面积",
            "expr": "1.5",
            "unit": "亿平方千米"
          },
          {
            "label": "海洋面积",
            "expr": "3.6",
            "unit": "亿平方千米"
          }
        ],
        "steps": [
          "x+2.4*x=5.1",
          "x=5.1/(1+2.4)=1.5",
          "2.4*1.5=3.6"
        ],
        "checks": [
          {
            "text": "总面积",
            "expr": "1.5+3.6",
            "result": "5.1"
          },
          {
            "text": "海洋与陆地倍数",
            "expr": "3.6/1.5",
            "result": "2.4"
          }
        ],
        "conclusion": "陆地面积约1.5亿平方千米，海洋面积约3.6亿平方千米；结果的近似程度与题目给定数据一致.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "陆地面积约1.5亿平方千米，海洋面积约3.6亿平方千米；结果的近似程度与题目给定数据一致."
        },
        "variation": "如果设海洋面积为x，陆地那一格应如何表示？"
      }
    ],
    "originalStem": "地球的表面积约为5.1亿km²，其中海洋面积约为陆地面积的2.4倍，地球表面海洋面积和陆地面积各是多少？",
    "originalStems": {
      "R05": "地球的表面积约为5.1亿km²，其中海洋面积约为陆地面积的2.4倍，地球表面海洋面积和陆地面积各是多少？"
    }
  },
  {
    "id": "TB-R06",
    "textbookItemId": "R06",
    "title": "两个旅游团的人数",
    "group": "教材·复习巩固",
    "source": "《数学 七年级上册》苏科版2026，134页 · 复习巩固 第10题",
    "kind": "linear",
    "stem": "甲、乙两个旅游团共80人，甲团人数比乙团人数的2倍多5人.两个团各有多少人？",
    "tags": [
      "和倍差"
    ],
    "facts": [
      {
        "id": "total",
        "text": "两个旅游团共80人.",
        "kind": "given"
      },
      {
        "id": "relation",
        "text": "甲团人数比乙团人数的2倍多5人.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设乙团人数为x",
        "variable": "x",
        "meaning": "乙团人数",
        "unit": "人",
        "domain": "x为非负整数，两个团人数都不超过80",
        "derivations": [],
        "table": {
          "headers": [
            "旅游团",
            "人数/人"
          ],
          "rows": [
            {
              "label": "乙团",
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
              "label": "甲团",
              "cells": [
                {
                  "expr": "2*x+5",
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
                  "expr": "80",
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
            "甲团人数＋乙团人数＝80",
            "甲团人数＝乙团人数的2倍＋5"
          ],
          "multiply": [
            "乙团人数×2得到比较的基准数量"
          ]
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "两个团的人数之和为80人.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "人数总和",
            "left": "x+(2*x+5)",
            "right": "80"
          }
        ],
        "answers": [
          {
            "label": "乙团人数",
            "expr": "25",
            "unit": "人"
          },
          {
            "label": "甲团人数",
            "expr": "55",
            "unit": "人"
          }
        ],
        "steps": [
          "x+2*x+5=80",
          "x=(80-5)/(1+2)=25",
          "2*25+5=55"
        ],
        "checks": [
          {
            "text": "总人数",
            "expr": "25+55",
            "result": "80"
          },
          {
            "text": "甲比乙的2倍多的人数",
            "expr": "55-2*25",
            "result": "5"
          }
        ],
        "conclusion": "乙团25人，甲团55人.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "乙团25人，甲团55人."
        },
        "variation": "如果条件改成甲团比乙团多5人，哪一项乘积关系消失？"
      }
    ],
    "originalStem": "甲、乙两个旅游团共80人，甲团人数比乙团人数的2倍多5人.甲、乙两个旅游团各有多少人？",
    "originalStems": {
      "R06": "甲、乙两个旅游团共80人，甲团人数比乙团人数的2倍多5人.甲、乙两个旅游团各有多少人？"
    }
  },
  {
    "id": "TB-R07",
    "textbookItemId": "R07",
    "title": "动物园成人票与学生票",
    "group": "教材·复习巩固",
    "source": "《数学 七年级上册》苏科版2026，135页 · 复习巩固 第11题",
    "kind": "linear",
    "stem": "动物园成人票40元，学生票20元.某天售出1680张门票，收入54400元.成人票和学生票各售出多少张？",
    "tags": [
      "分类总价",
      "总量"
    ],
    "facts": [
      {
        "id": "adult",
        "text": "成人票每张40元.",
        "kind": "given"
      },
      {
        "id": "student",
        "text": "学生票每张20元.",
        "kind": "given"
      },
      {
        "id": "count",
        "text": "两类门票合计1680张.",
        "kind": "given"
      },
      {
        "id": "money",
        "text": "售票收入共54400元.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设成人票张数为x",
        "variable": "x",
        "meaning": "成人票张数",
        "unit": "张",
        "domain": "x是0至1680之间的整数",
        "derivations": [],
        "table": {
          "headers": [
            "票种",
            "票价/元每张",
            "数量/张",
            "收入/元"
          ],
          "rows": [
            {
              "label": "成人票",
              "cells": [
                {
                  "expr": "40",
                  "sources": [
                    "adult"
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
                  "expr": "40*x",
                  "sources": [
                    "adult",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "学生票",
              "cells": [
                {
                  "expr": "20",
                  "sources": [
                    "student"
                  ],
                  "given": true
                },
                {
                  "expr": "1680-x",
                  "sources": [
                    "count",
                    "unknown"
                  ]
                },
                {
                  "expr": "20*(1680-x)",
                  "sources": [
                    "student",
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
                  "note": "票价不相加"
                },
                {
                  "expr": "1680",
                  "sources": [
                    "count"
                  ],
                  "given": true
                },
                {
                  "expr": "54400",
                  "sources": [
                    "money"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "两类票数相加为1680张",
            "两类售票收入相加为54400元"
          ],
          "multiply": [
            "收入＝票价×票数"
          ]
        },
        "closure": {
          "sources": [
            "money"
          ],
          "text": "两类售票收入之和为54400元.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "总收入",
            "left": "40*x+20*(1680-x)",
            "right": "54400"
          }
        ],
        "answers": [
          {
            "label": "成人票",
            "expr": "1040",
            "unit": "张"
          },
          {
            "label": "学生票",
            "expr": "640",
            "unit": "张"
          }
        ],
        "steps": [
          "40*x+20*(1680-x)=54400",
          "(40-20)*x=54400-20*1680",
          "x=(54400-20*1680)/(40-20)=1040",
          "1680-1040=640"
        ],
        "checks": [
          {
            "text": "总票数",
            "expr": "1040+640",
            "result": "1680"
          },
          {
            "text": "总收入",
            "expr": "40*1040+20*640",
            "result": "54400"
          }
        ],
        "conclusion": "成人票售出1040张，学生票售出640张.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "成人票售出1040张，学生票售出640张."
        },
        "variation": "若只知道总票数，没有收入，能够确定两类票数吗？"
      }
    ],
    "originalStem": "某动物园的门票价格如下：某天该动物园共售出1680张门票，收入54400元.成人票和学生票各售出多少张？",
    "originalStems": {
      "R07": "某动物园的门票价格如下：某天该动物园共售出1680张门票，收入54400元.成人票和学生票各售出多少张？"
    },
    "sourceTable": {
      "caption": "门票价格",
      "headers": [
        "门票类型",
        "价格"
      ],
      "rows": [
        [
          "成人票",
          "40元/人"
        ],
        [
          "学生票",
          "20元/人"
        ]
      ]
    }
  },
  {
    "id": "TB-R08",
    "textbookItemId": "R08",
    "title": "晨练跑步与步行",
    "group": "教材·复习巩固",
    "source": "《数学 七年级上册》苏科版2026，135页 · 复习巩固 第12题",
    "kind": "linear",
    "stem": "小明先以每分钟210米跑步，再以每分钟90米步行，共用18分钟行了2.1千米.跑步用了多少分钟？",
    "tags": [
      "分段行程",
      "单位换算"
    ],
    "facts": [
      {
        "id": "run",
        "text": "跑步速度为210米/分.",
        "kind": "given"
      },
      {
        "id": "walk",
        "text": "步行速度为90米/分.",
        "kind": "given"
      },
      {
        "id": "time",
        "text": "两段时间共18分钟.",
        "kind": "given"
      },
      {
        "id": "distance",
        "text": "两段路程共2.1千米.",
        "kind": "given"
      },
      {
        "id": "conversion",
        "text": "1千米＝1000米.",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设跑步时间为x",
        "variable": "x",
        "meaning": "跑步时间",
        "unit": "分",
        "domain": "0≤x≤18",
        "derivations": [
          {
            "id": "meters",
            "label": "把总路程换成米",
            "expr": "2.1*1000",
            "result": "2100",
            "sources": [
              "distance",
              "conversion"
            ],
            "explain": "由2.1千米×每千米1000米得到."
          }
        ],
        "table": {
          "headers": [
            "阶段",
            "速度/米每分",
            "时间/分",
            "路程/米"
          ],
          "rows": [
            {
              "label": "跑步",
              "cells": [
                {
                  "expr": "210",
                  "sources": [
                    "run"
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
                  "expr": "210*x",
                  "sources": [
                    "run",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "步行",
              "cells": [
                {
                  "expr": "90",
                  "sources": [
                    "walk"
                  ],
                  "given": true
                },
                {
                  "expr": "18-x",
                  "sources": [
                    "time",
                    "unknown"
                  ]
                },
                {
                  "expr": "90*(18-x)",
                  "sources": [
                    "walk",
                    "time",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "不同阶段速度不相加"
                },
                {
                  "expr": "18",
                  "sources": [
                    "time"
                  ],
                  "given": true
                },
                {
                  "expr": "2100",
                  "sources": [
                    "meters"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "跑步时间＋步行时间＝18分",
            "跑步路程＋步行路程＝总路程"
          ],
          "multiply": [
            "路程＝速度×时间"
          ]
        },
        "closure": {
          "sources": [
            "distance"
          ],
          "text": "两段路程之和等于统一单位后的总路程.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "总路程",
            "left": "210*x+90*(18-x)",
            "right": "2100"
          }
        ],
        "answers": [
          {
            "label": "跑步时间",
            "expr": "4",
            "unit": "分"
          }
        ],
        "steps": [
          "210*x+90*(18-x)=2100",
          "(210-90)*x=2100-90*18",
          "x=(2100-90*18)/(210-90)=4"
        ],
        "checks": [
          {
            "text": "步行时间",
            "expr": "18-4",
            "result": "14"
          },
          {
            "text": "总路程",
            "expr": "210*4+90*(18-4)",
            "result": "2100"
          }
        ],
        "conclusion": "跑步用了4分钟，步行用了14分钟.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "跑步用了4分钟，步行用了14分钟."
        },
        "variation": "若全程路程改为米表示，单位换算步骤是否还需要？"
      }
    ],
    "originalStem": "小明晨练，先以210 m/min的平均速度跑步，再以90 m/min的平均速度步行，共用18 min行了2.1 km.小明跑步用了多少时间？",
    "originalStems": {
      "R08": "小明晨练，先以210 m/min的平均速度跑步，再以90 m/min的平均速度步行，共用18 min行了2.1 km.小明跑步用了多少时间？"
    }
  },
  {
    "id": "TB-R09",
    "textbookItemId": "R09",
    "title": "按2∶3∶7配制药材",
    "group": "教材·复习巩固",
    "source": "《数学 七年级上册》苏科版2026，135页 · 复习巩固 第13题",
    "kind": "linear",
    "stem": "某中成药含甲、乙、丙三种药材，质量比为2∶3∶7.配制1440克这种中成药，三种药材分别需要多少克？",
    "tags": [
      "比例分配",
      "总量"
    ],
    "facts": [
      {
        "id": "ratio",
        "text": "甲、乙、丙的质量比为2∶3∶7.",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "三种药材合计1440克.",
        "kind": "given"
      },
      {
        "id": "part",
        "text": "把同一比值中的每1份质量设为x，各种药材按相同的每份质量计算.",
        "kind": "convention"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设比例中每份的质量为x",
        "variable": "x",
        "meaning": "比例中每份的质量",
        "unit": "克",
        "domain": "x为正数，计算结果还需符合题目的数量范围",
        "derivations": [],
        "table": {
          "headers": [
            "药材",
            "比例份数",
            "每份质量/克",
            "所需质量/克"
          ],
          "rows": [
            {
              "label": "甲",
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
              "label": "乙",
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
              "label": "丙",
              "cells": [
                {
                  "expr": "7",
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
                  "expr": "7*x",
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
                  "expr": "2+3+7",
                  "sources": [
                    "ratio"
                  ]
                },
                {
                  "note": "每份质量相同，不相加"
                },
                {
                  "expr": "1440",
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
            "甲质量＋乙质量＋丙质量＝1440克"
          ],
          "multiply": [
            "某药材质量＝比例份数×每份质量"
          ]
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "三种药材质量相加为1440克.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "总质量",
            "left": "2*x+3*x+7*x",
            "right": "1440"
          }
        ],
        "answers": [
          {
            "label": "每份质量",
            "expr": "120",
            "unit": "克"
          },
          {
            "label": "甲药材",
            "expr": "240",
            "unit": "克"
          },
          {
            "label": "乙药材",
            "expr": "360",
            "unit": "克"
          },
          {
            "label": "丙药材",
            "expr": "840",
            "unit": "克"
          }
        ],
        "steps": [
          "2*x+3*x+7*x=1440",
          "x=1440/(2+3+7)=120",
          "2*120=240",
          "3*120=360",
          "7*120=840"
        ],
        "checks": [
          {
            "text": "三种质量合计",
            "expr": "240+360+840",
            "result": "1440"
          },
          {
            "text": "甲每份质量",
            "expr": "240/2",
            "result": "120"
          },
          {
            "text": "乙每份质量",
            "expr": "360/3",
            "result": "120"
          },
          {
            "text": "丙每份质量",
            "expr": "840/7",
            "result": "120"
          }
        ],
        "conclusion": "甲需要240克，乙需要360克，丙需要840克；每份的质量都是120克.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "甲需要240克，乙需要360克，丙需要840克；每份的质量都是120克."
        },
        "variation": "若总质量改变而配比不变，表中哪一列保持不变？"
      }
    ],
    "originalStem": "某中成药含有甲、乙、丙三种药材，这三种药材的质量比是2∶3∶7.现在要配制这种中成药1440 g，三种药材分别需要多少？",
    "originalStems": {
      "R09": "某中成药含有甲、乙、丙三种药材，这三种药材的质量比是2∶3∶7.现在要配制这种中成药1440 g，三种药材分别需要多少？"
    }
  },
  {
    "id": "TB-R10",
    "textbookItemId": "R10",
    "title": "男女人数与全班人数",
    "group": "教材·复习巩固",
    "source": "《数学 七年级上册》苏科版2026，135页 · 复习巩固 第14题",
    "kind": "linear",
    "stem": "某班男生人数比全班人数的八分之五少5人，女生比男生少2人.求全班人数.",
    "tags": [
      "分率",
      "整体与部分"
    ],
    "facts": [
      {
        "id": "boys",
        "text": "男生人数＝全班人数的5/8少5人.",
        "kind": "given"
      },
      {
        "id": "girls",
        "text": "女生比男生少2人.",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "全班人数由男生人数和女生人数相加得到.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设全班人数为x",
        "variable": "x",
        "meaning": "全班人数",
        "unit": "人",
        "domain": "x为正整数，男生与女生人数也必须是非负整数",
        "derivations": [],
        "table": {
          "headers": [
            "类别",
            "人数/人"
          ],
          "rows": [
            {
              "label": "男生",
              "cells": [
                {
                  "expr": "(5/8)*x-5",
                  "sources": [
                    "boys",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "女生",
              "cells": [
                {
                  "expr": "((5/8)*x-5)-2",
                  "sources": [
                    "boys",
                    "girls",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "全班",
              "cells": [
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
            "女生人数＝男生人数－2",
            "男生人数＋女生人数＝全班人数"
          ],
          "multiply": [
            "先算全班人数×5/8，再减5才是男生人数"
          ]
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "男生与女生人数之和等于设出的全班人数.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "人数构成",
            "left": "((5/8)*x-5)+(((5/8)*x-5)-2)",
            "right": "x"
          }
        ],
        "answers": [
          {
            "label": "全班人数",
            "expr": "48",
            "unit": "人"
          }
        ],
        "steps": [
          "((5/8)*x-5)+(((5/8)*x-5)-2)=x",
          "((5/8)+(5/8)-1)*x=5+5+2",
          "x=(5+5+2)/((5/8)+(5/8)-1)=48"
        ],
        "checks": [
          {
            "text": "男生人数",
            "expr": "(5/8)*48-5",
            "result": "25"
          },
          {
            "text": "女生人数",
            "expr": "25-2",
            "result": "23"
          },
          {
            "text": "男女合计",
            "expr": "25+23",
            "result": "48"
          }
        ],
        "conclusion": "全班48人，其中男生25人、女生23人，人数均为整数.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "全班48人，其中男生25人、女生23人，人数均为整数."
        },
        "variation": "如果改设男生人数为x，全班和女生两格分别怎样表示？"
      }
    ],
    "originalStem": "某班的男生人数比全班人数的5/8少5人，女生比男生少2人.求全班的人数.",
    "originalStems": {
      "R10": "某班的男生人数比全班人数的5/8少5人，女生比男生少2人.求全班的人数."
    }
  },
  {
    "id": "TB-R11",
    "textbookItemId": "R11",
    "title": "日字形木窗的高与宽",
    "group": "教材·复习巩固",
    "source": "《数学 七年级上册》苏科版2026，135页 · 复习巩固 第15题",
    "kind": "linear",
    "stem": "日字形窗框共有3根横向木条和2根竖向木条，木条总长7.2米，窗高比窗宽多0.6米.窗的高和宽分别是多少米？",
    "tags": [
      "几何计数",
      "总长度"
    ],
    "facts": [
      {
        "id": "figure",
        "text": "原图的日字形窗框有3条等长的横宽和2条等长的竖高.",
        "kind": "given"
      },
      {
        "id": "total",
        "text": "全部木条总长7.2米.",
        "kind": "given"
      },
      {
        "id": "difference",
        "text": "窗高比窗宽多0.6米.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设窗宽为x",
        "variable": "x",
        "meaning": "窗宽",
        "unit": "米",
        "domain": "x为正数，计算结果还需符合题目的数量范围",
        "derivations": [],
        "table": {
          "headers": [
            "方向",
            "单根长度/米",
            "根数/根",
            "总长度/米"
          ],
          "rows": [
            {
              "label": "横向",
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
                    "figure"
                  ],
                  "given": true
                },
                {
                  "expr": "3*x",
                  "sources": [
                    "figure",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "竖向",
              "cells": [
                {
                  "expr": "x+0.6",
                  "sources": [
                    "difference",
                    "unknown"
                  ]
                },
                {
                  "expr": "2",
                  "sources": [
                    "figure"
                  ],
                  "given": true
                },
                {
                  "expr": "2*(x+0.6)",
                  "sources": [
                    "figure",
                    "difference",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "不同方向单根长度不直接合计"
                },
                {
                  "note": "分别计数"
                },
                {
                  "expr": "7.2",
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
            "横向木条总长＋竖向木条总长＝7.2米",
            "窗高＝窗宽＋0.6米"
          ],
          "multiply": [
            "各方向木条总长＝单根长度×根数"
          ]
        },
        "closure": {
          "sources": [
            "total"
          ],
          "text": "所有木条的总长为7.2米，包含窗中间的一条横木.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "木条总长度",
            "left": "3*x+2*(x+0.6)",
            "right": "7.2"
          }
        ],
        "answers": [
          {
            "label": "窗宽",
            "expr": "1.2",
            "unit": "米"
          },
          {
            "label": "窗高",
            "expr": "1.8",
            "unit": "米"
          }
        ],
        "steps": [
          "3*x+2*(x+0.6)=7.2",
          "x=(7.2-2*0.6)/(3+2)=1.2",
          "1.2+0.6=1.8"
        ],
        "checks": [
          {
            "text": "木条总长",
            "expr": "3*1.2+2*1.8",
            "result": "7.2"
          },
          {
            "text": "高比宽多",
            "expr": "1.8-1.2",
            "result": "0.6"
          }
        ],
        "conclusion": "窗宽1.2米，高1.8米；不能遗漏日字中间的横木.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "窗宽1.2米，高1.8米；不能遗漏日字中间的横木."
        },
        "variation": "如果中间增加1根横木，根数列和方程怎样改变？"
      }
    ],
    "notices": [
      "将原图中3条横宽、2条竖高写成文字条件，保留原图计数结构."
    ],
    "originalStem": "如图，“日”字形木窗窗框的木条总长是7.2 m，窗的高比宽多0.6 m.求窗的高和宽.",
    "originalStems": {
      "R11": "如图，“日”字形木窗窗框的木条总长是7.2 m，窗的高比宽多0.6 m.求窗的高和宽."
    },
    "sourceFigure": {
      "file": "figures/window-frame.svg",
      "alt": "原题日字形窗框"
    }
  },
  {
    "id": "TB-R12",
    "textbookItemId": "R12",
    "title": "不同得分规则的投篮游戏",
    "group": "教材·复习巩固",
    "source": "《数学 七年级上册》苏科版2026，135页 · 复习巩固 第16题",
    "kind": "linear",
    "stem": "小丽投中1个得3分，爸爸投中1个得1分.两人共投中20个，得分相等.小丽投中多少个？",
    "tags": [
      "计分",
      "相等关系"
    ],
    "facts": [
      {
        "id": "daughter",
        "text": "小丽每投中1个得3分.",
        "kind": "given"
      },
      {
        "id": "father",
        "text": "爸爸每投中1个得1分.",
        "kind": "given"
      },
      {
        "id": "count",
        "text": "两人合计投中20个.",
        "kind": "given"
      },
      {
        "id": "equal",
        "text": "小丽与爸爸的得分相等.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设小丽投中个数为x",
        "variable": "x",
        "meaning": "小丽投中个数",
        "unit": "个",
        "domain": "x是0至20之间的整数",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "每个得分/分",
            "投中/个",
            "得分/分"
          ],
          "rows": [
            {
              "label": "小丽",
              "cells": [
                {
                  "expr": "3",
                  "sources": [
                    "daughter"
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
                    "daughter",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "爸爸",
              "cells": [
                {
                  "expr": "1",
                  "sources": [
                    "father"
                  ],
                  "given": true
                },
                {
                  "expr": "20-x",
                  "sources": [
                    "count",
                    "unknown"
                  ]
                },
                {
                  "expr": "1*(20-x)",
                  "sources": [
                    "father",
                    "count",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "两人投中个数相加为20"
          ],
          "multiply": [
            "得分＝每个得分×投中个数"
          ]
        },
        "closure": {
          "sources": [
            "equal"
          ],
          "text": "两人按各自规则得到的分数相等.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "得分相等",
            "left": "3*x",
            "right": "1*(20-x)"
          }
        ],
        "answers": [
          {
            "label": "小丽投中个数",
            "expr": "5",
            "unit": "个"
          }
        ],
        "steps": [
          "3*x=1*(20-x)",
          "x=20/(3+1)=5"
        ],
        "checks": [
          {
            "text": "两人投中合计",
            "expr": "5+(20-5)",
            "result": "20"
          },
          {
            "text": "小丽得分",
            "expr": "3*5",
            "result": "15"
          },
          {
            "text": "爸爸得分",
            "expr": "1*(20-5)",
            "result": "15"
          }
        ],
        "conclusion": "小丽投中5个，爸爸投中15个，两人的得分都是15分.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "小丽投中5个，爸爸投中15个，两人的得分都是15分."
        },
        "variation": "相同得分是否表示投中个数相同？请用两列之间的乘积关系解释."
      }
    ],
    "originalStem": "小丽和爸爸一起玩投篮球游戏.两人商定规则为：小丽投中1个得3分，爸爸投中1个得1分.结果两人一共投中了20个，得分刚好相等.小丽投中了多少个？",
    "originalStems": {
      "R12": "小丽和爸爸一起玩投篮球游戏.两人商定规则为：小丽投中1个得3分，爸爸投中1个得1分.结果两人一共投中了20个，得分刚好相等.小丽投中了多少个？"
    }
  },
  {
    "id": "TB-R13",
    "textbookItemId": "R13",
    "title": "两支蜡烛燃烧后的高度",
    "group": "教材·复习巩固",
    "source": "《数学 七年级上册》苏科版2026，135页 · 复习巩固 第17题",
    "kind": "linear",
    "stem": "两支蜡烛原来一样高，同时点燃.第一支每小时缩短8厘米，第二支每小时缩短6厘米.2小时后，第二支高度为第一支的1.5倍.求蜡烛原高.",
    "tags": [
      "原量与剩余",
      "倍数基准"
    ],
    "facts": [
      {
        "id": "same",
        "text": "两支蜡烛原来高度相同.",
        "kind": "given"
      },
      {
        "id": "first",
        "text": "第一支每小时缩短8厘米.",
        "kind": "given"
      },
      {
        "id": "second",
        "text": "第二支每小时缩短6厘米.",
        "kind": "given"
      },
      {
        "id": "time",
        "text": "两支都燃烧2小时.",
        "kind": "given"
      },
      {
        "id": "ratio",
        "text": "2小时后，第二支剩余高度为第一支的1.5倍.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设蜡烛原高为x",
        "variable": "x",
        "meaning": "蜡烛原高",
        "unit": "厘米",
        "domain": "x必须大于两支在2小时内的缩短高度",
        "derivations": [
          {
            "id": "firstLoss",
            "label": "第一支2小时缩短高度",
            "expr": "8*2",
            "result": "16",
            "sources": [
              "first",
              "time"
            ],
            "explain": "每小时缩短8厘米×2小时."
          },
          {
            "id": "secondLoss",
            "label": "第二支2小时缩短高度",
            "expr": "6*2",
            "result": "12",
            "sources": [
              "second",
              "time"
            ],
            "explain": "每小时缩短6厘米×2小时."
          }
        ],
        "table": {
          "headers": [
            "蜡烛",
            "原高/厘米",
            "缩短速度/厘米每小时",
            "燃烧时间/小时",
            "缩短/厘米",
            "剩余/厘米"
          ],
          "rows": [
            {
              "label": "第一支",
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
                    "first"
                  ],
                  "given": true
                },
                {
                  "expr": "2",
                  "sources": [
                    "time"
                  ],
                  "given": true
                },
                {
                  "expr": "16",
                  "sources": [
                    "firstLoss"
                  ],
                  "given": true
                },
                {
                  "expr": "x-16",
                  "sources": [
                    "unknown",
                    "firstLoss"
                  ]
                }
              ]
            },
            {
              "label": "第二支",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "same"
                  ],
                  "given": true
                },
                {
                  "expr": "6",
                  "sources": [
                    "second"
                  ],
                  "given": true
                },
                {
                  "expr": "2",
                  "sources": [
                    "time"
                  ],
                  "given": true
                },
                {
                  "expr": "12",
                  "sources": [
                    "secondLoss"
                  ],
                  "given": true
                },
                {
                  "expr": "x-12",
                  "sources": [
                    "unknown",
                    "secondLoss"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "原高＝缩短高度＋剩余高度"
          ],
          "multiply": [
            "缩短高度＝每小时缩短量×燃烧时间",
            "第二支剩余高度＝1.5×第一支剩余高度"
          ]
        },
        "closure": {
          "sources": [
            "ratio"
          ],
          "text": "比较的是燃烧2小时后的剩余高度.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "剩余高度的倍数",
            "left": "x-12",
            "right": "1.5*(x-16)"
          }
        ],
        "answers": [
          {
            "label": "蜡烛原高",
            "expr": "24",
            "unit": "厘米"
          }
        ],
        "steps": [
          "x-12=1.5*(x-16)",
          "(1.5-1)*x=1.5*16-12",
          "x=(1.5*16-12)/(1.5-1)=24"
        ],
        "checks": [
          {
            "text": "第一支剩余",
            "expr": "24-8*2",
            "result": "8"
          },
          {
            "text": "第二支剩余",
            "expr": "24-6*2",
            "result": "12"
          },
          {
            "text": "剩余高度倍数",
            "expr": "12/8",
            "result": "1.5"
          }
        ],
        "conclusion": "两支蜡烛原高都是24厘米；2小时后分别余8厘米、12厘米，均尚未燃尽.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "两支蜡烛原高都是24厘米；2小时后分别余8厘米、12厘米，均尚未燃尽."
        },
        "variation": "若改比较缩短高度的倍数，能否仍用原来的等式？"
      }
    ],
    "originalStem": "两支一样高的蜡烛，同时点燃后，第一支蜡烛每小时缩短8 cm，第二支蜡烛每小时缩短6 cm.2 h后，第二支蜡烛的高度是第一支蜡烛的1.5倍.求这两支蜡烛原来的高度.",
    "originalStems": {
      "R13": "两支一样高的蜡烛，同时点燃后，第一支蜡烛每小时缩短8 cm，第二支蜡烛每小时缩短6 cm.2 h后，第二支蜡烛的高度是第一支蜡烛的1.5倍.求这两支蜡烛原来的高度."
    }
  },
  {
    "id": "TB-R14",
    "textbookItemId": "R14",
    "title": "先甲后乙再合做工程",
    "group": "教材·复习巩固",
    "source": "《数学 七年级上册》苏科版2026，135页 · 复习巩固 第18题",
    "kind": "linear",
    "stem": "甲单独完成工程需20天，乙单独完成需30天.先由甲单独做8天，再由乙单独做3天，余下两队合做.还需合做几天？",
    "tags": [
      "工程",
      "分阶段",
      "效率来源"
    ],
    "facts": [
      {
        "id": "aTime",
        "text": "甲单独做完整项工程需要20天.",
        "kind": "given"
      },
      {
        "id": "bTime",
        "text": "乙单独做完整项工程需要30天.",
        "kind": "given"
      },
      {
        "id": "aFirst",
        "text": "先由甲单独工作8天.",
        "kind": "given"
      },
      {
        "id": "bThen",
        "text": "再由乙单独工作3天.",
        "kind": "given"
      },
      {
        "id": "done",
        "text": "其余工程由甲、乙合作完成，三个阶段的工作量合起来恰好是整项工程.",
        "kind": "given"
      },
      {
        "id": "whole",
        "text": "把全部工程记为1，单位是整项工程.",
        "kind": "convention"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设最后合作时间为x",
        "variable": "x",
        "meaning": "最后合作时间",
        "unit": "天",
        "domain": "x≥0",
        "derivations": [
          {
            "id": "aRate",
            "label": "甲每天完成量",
            "expr": "1/20",
            "result": "1/20",
            "sources": [
              "whole",
              "aTime"
            ],
            "explain": "整项工程1÷甲单独完成所需20天."
          },
          {
            "id": "bRate",
            "label": "乙每天完成量",
            "expr": "1/30",
            "result": "1/30",
            "sources": [
              "whole",
              "bTime"
            ],
            "explain": "整项工程1÷乙单独完成所需30天."
          },
          {
            "id": "bothRate",
            "label": "甲乙合作效率",
            "expr": "1/20+1/30",
            "result": "1/12",
            "sources": [
              "aRate",
              "bRate"
            ],
            "explain": "同一天两队完成的工作量相加."
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
              "label": "甲先独做",
              "cells": [
                {
                  "expr": "1/20",
                  "sources": [
                    "aRate"
                  ],
                  "given": true
                },
                {
                  "expr": "8",
                  "sources": [
                    "aFirst"
                  ],
                  "given": true
                },
                {
                  "expr": "(1/20)*8",
                  "sources": [
                    "aRate",
                    "aFirst"
                  ]
                }
              ]
            },
            {
              "label": "乙再独做",
              "cells": [
                {
                  "expr": "1/30",
                  "sources": [
                    "bRate"
                  ],
                  "given": true
                },
                {
                  "expr": "3",
                  "sources": [
                    "bThen"
                  ],
                  "given": true
                },
                {
                  "expr": "(1/30)*3",
                  "sources": [
                    "bRate",
                    "bThen"
                  ]
                }
              ]
            },
            {
              "label": "最后合作",
              "cells": [
                {
                  "expr": "1/12",
                  "sources": [
                    "bothRate"
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
                    "bothRate",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "不同阶段效率不合计"
                },
                {
                  "expr": "8+3+x",
                  "sources": [
                    "aFirst",
                    "bThen",
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
            "合作效率＝甲效率＋乙效率",
            "三个阶段完成量之和＝全部工程1"
          ],
          "multiply": [
            "每阶段工作量＝该阶段效率×该阶段时间"
          ]
        },
        "closure": {
          "sources": [
            "done"
          ],
          "text": "先后独做与合作的三部分完成量相加为1.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "完成整项工程",
            "left": "(1/20)*8+(1/30)*3+(1/12)*x",
            "right": "1"
          }
        ],
        "answers": [
          {
            "label": "还需合作",
            "expr": "6",
            "unit": "天"
          }
        ],
        "steps": [
          "(1/20)*8+(1/30)*3+(1/12)*x=1",
          "x=(1-(1/20)*8-(1/30)*3)/(1/12)=6"
        ],
        "checks": [
          {
            "text": "三个阶段完成量之和",
            "expr": "(1/20)*8+(1/30)*3+(1/12)*6",
            "result": "1"
          },
          {
            "text": "从开工到完成总工期",
            "expr": "8+3+6",
            "result": "17"
          }
        ],
        "conclusion": "还需合作6天；总工期为8＋3＋6＝17天.题目问合作时间，不能回答总工期.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "还需合作6天；总工期为8＋3＋6＝17天.题目问合作时间，不能回答总工期."
        },
        "variation": "若改成甲乙先一起工作8天，第一阶段的效率应怎样变？"
      }
    ],
    "originalStem": "一项工程，甲队单独完成需要20天，乙队单独完成需要30天，如果先由甲队单独做8天，再由乙队单独做3天，其余的由甲、乙两队合做，还需要几天才能完成？",
    "originalStems": {
      "R14": "一项工程，甲队单独完成需要20天，乙队单独完成需要30天，如果先由甲队单独做8天，再由乙队单独做3天，其余的由甲、乙两队合做，还需要几天才能完成？"
    }
  },
  {
    "id": "TB-R15",
    "textbookItemId": "R15",
    "title": "面粉与牛肉中的蛋白质",
    "group": "教材·复习巩固",
    "source": "《数学 七年级上册》苏科版2026，136页 · 复习巩固 第19题",
    "kind": "linear",
    "stem": "按题目给定数据，小明哥哥通过面粉和牛肉共600克，摄入75克蛋白质.每100克面粉含蛋白质约10克，每100克牛肉含蛋白质约20克.两种食物各多少克？",
    "tags": [
      "含量",
      "每份量来源"
    ],
    "facts": [
      {
        "id": "flour",
        "text": "每100克面粉含蛋白质约10克.",
        "kind": "given"
      },
      {
        "id": "beef",
        "text": "每100克牛肉含蛋白质约20克.",
        "kind": "given"
      },
      {
        "id": "mass",
        "text": "面粉和牛肉合计600克.",
        "kind": "given"
      },
      {
        "id": "protein",
        "text": "由这两种食物得到的蛋白质合计75克.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设面粉质量为x",
        "variable": "x",
        "meaning": "面粉质量",
        "unit": "克",
        "domain": "0≤x≤600",
        "derivations": [
          {
            "id": "flourRate",
            "label": "每克面粉的蛋白质含量",
            "expr": "10/100",
            "result": "0.1",
            "sources": [
              "flour"
            ],
            "explain": "蛋白质10克÷面粉100克."
          },
          {
            "id": "beefRate",
            "label": "每克牛肉的蛋白质含量",
            "expr": "20/100",
            "result": "0.2",
            "sources": [
              "beef"
            ],
            "explain": "蛋白质20克÷牛肉100克."
          }
        ],
        "table": {
          "headers": [
            "食物",
            "每克含蛋白质/克每克",
            "食物质量/克",
            "蛋白质/克"
          ],
          "rows": [
            {
              "label": "面粉",
              "cells": [
                {
                  "expr": "0.1",
                  "sources": [
                    "flourRate"
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
                  "expr": "0.1*x",
                  "sources": [
                    "flourRate",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "牛肉",
              "cells": [
                {
                  "expr": "0.2",
                  "sources": [
                    "beefRate"
                  ],
                  "given": true
                },
                {
                  "expr": "600-x",
                  "sources": [
                    "mass",
                    "unknown"
                  ]
                },
                {
                  "expr": "0.2*(600-x)",
                  "sources": [
                    "beefRate",
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
                  "note": "各类比例不相加"
                },
                {
                  "expr": "600",
                  "sources": [
                    "mass"
                  ],
                  "given": true
                },
                {
                  "expr": "75",
                  "sources": [
                    "protein"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "两类食物质量相加为600克",
            "两类蛋白质质量相加为75克"
          ],
          "multiply": [
            "蛋白质质量＝食物质量×该食物每克的蛋白质含量"
          ]
        },
        "closure": {
          "sources": [
            "protein"
          ],
          "text": "蛋白质总量为75克.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "蛋白质总量",
            "left": "0.1*x+0.2*(600-x)",
            "right": "75"
          }
        ],
        "answers": [
          {
            "label": "面粉质量",
            "expr": "450",
            "unit": "克"
          },
          {
            "label": "牛肉质量",
            "expr": "150",
            "unit": "克"
          }
        ],
        "steps": [
          "0.1*x+0.2*(600-x)=75",
          "x=(0.2*600-75)/(0.2-0.1)=450",
          "600-450=150"
        ],
        "checks": [
          {
            "text": "食物总质量",
            "expr": "450+150",
            "result": "600"
          },
          {
            "text": "蛋白质总量",
            "expr": "(10/100)*450+(20/100)*150",
            "result": "75"
          }
        ],
        "conclusion": "按题目数据，面粉450克，牛肉150克.两种食物中蛋白质分别为45克、30克.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "按题目数据，面粉450克，牛肉150克.两种食物中蛋白质分别为45克、30克."
        },
        "variation": "如果把每100克的含量误当成每克含量，表格中的哪些值会被放大？"
      }
    ],
    "originalStem": "有研究认为，14～17周岁男性每天约需要摄入75 g蛋白质.某天小明哥哥刚好通过面粉和牛肉共600 g实现了75 g蛋白质的摄入量，已知每100 g面粉约含蛋白质10 g，每100 g牛肉约含蛋白质20 g，这天他摄入面粉和牛肉各多少克？",
    "originalStems": {
      "R15": "有研究认为，14～17周岁男性每天约需要摄入75 g蛋白质.某天小明哥哥刚好通过面粉和牛肉共600 g实现了75 g蛋白质的摄入量，已知每100 g面粉约含蛋白质10 g，每100 g牛肉约含蛋白质20 g，这天他摄入面粉和牛肉各多少克？"
    }
  },
  {
    "id": "TB-R16",
    "textbookItemId": "R16",
    "title": "同时出发但到达时有距离差",
    "group": "教材·灵活运用",
    "source": "《数学 七年级上册》苏科版2026，136页 · 灵活运用 第20题",
    "kind": "linear",
    "stem": "甲、乙同时从A地出发去B地.甲骑车速度10千米/时，乙步行速度6千米/时.甲到达B地时，乙距B地还有8千米.甲走了多久？两地路程多少？",
    "tags": [
      "同行时间",
      "路程差"
    ],
    "facts": [
      {
        "id": "aSpeed",
        "text": "甲的速度为10千米/时.",
        "kind": "given"
      },
      {
        "id": "bSpeed",
        "text": "乙的速度为6千米/时.",
        "kind": "given"
      },
      {
        "id": "sameTime",
        "text": "两人同时从A出发，以甲到达B的时刻为共同终点，经过的时间相同.",
        "kind": "given"
      },
      {
        "id": "gap",
        "text": "甲到B时，乙离B还有8千米.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设甲到达B所用时间为x",
        "variable": "x",
        "meaning": "甲到达B所用时间",
        "unit": "小时",
        "domain": "x为正数，计算结果还需符合题目的数量范围",
        "derivations": [],
        "table": {
          "headers": [
            "人物",
            "速度/千米每小时",
            "时间/小时",
            "已行路程/千米"
          ],
          "rows": [
            {
              "label": "甲",
              "cells": [
                {
                  "expr": "10",
                  "sources": [
                    "aSpeed"
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
                  "expr": "10*x",
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
                  "expr": "6",
                  "sources": [
                    "bSpeed"
                  ],
                  "given": true
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown",
                    "sameTime"
                  ],
                  "given": true
                },
                {
                  "expr": "6*x",
                  "sources": [
                    "bSpeed",
                    "unknown",
                    "sameTime"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "甲已行路程－乙已行路程＝8千米"
          ],
          "multiply": [
            "路程＝速度×时间"
          ]
        },
        "closure": {
          "sources": [
            "gap"
          ],
          "text": "同一时刻两人所行路程相差8千米.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "路程差",
            "left": "10*x-6*x",
            "right": "8"
          }
        ],
        "answers": [
          {
            "label": "甲所用时间",
            "expr": "2",
            "unit": "小时"
          },
          {
            "label": "A、B两地路程",
            "expr": "20",
            "unit": "千米"
          }
        ],
        "steps": [
          "10*x-6*x=8",
          "x=8/(10-6)=2",
          "10*2=20"
        ],
        "checks": [
          {
            "text": "甲所行路程",
            "expr": "10*2",
            "result": "20"
          },
          {
            "text": "甲乙路程差",
            "expr": "10*2-6*2",
            "result": "8"
          }
        ],
        "conclusion": "甲用了2小时，A、B相距20千米.乙走了12千米，距离终点还有8千米.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "甲用了2小时，A、B相距20千米.乙走了12千米，距离终点还有8千米."
        },
        "variation": "如果改为乙提前出发，两人的时间列还能都写x吗？"
      }
    ],
    "originalStem": "甲、乙两人同时从A地出发去B地，甲骑自行车，平均骑行速度为10 km/h，乙步行，平均行走速度为6 km/h.当甲到达B地时，乙距B地还有8 km.甲走了多少时间？A，B两地之间的路程是多少？",
    "originalStems": {
      "R16": "甲、乙两人同时从A地出发去B地，甲骑自行车，平均骑行速度为10 km/h，乙步行，平均行走速度为6 km/h.当甲到达B地时，乙距B地还有8 km.甲走了多少时间？A，B两地之间的路程是多少？"
    }
  },
  {
    "id": "TB-R17",
    "textbookItemId": "R17",
    "title": "沿长边拼桌子的座位数",
    "group": "教材·灵活运用",
    "source": "《数学 七年级上册》苏科版2026，136页 · 灵活运用 第21题",
    "kind": "linear",
    "stem": "一张长方形桌子四周可坐6人，图中两条长边各坐2人，两条短边各坐1人.按原图沿长边拼桌：1张、2张、3张分别可坐6、8、10人.多少张这样拼在一起可坐40人？",
    "tags": [
      "图形规律",
      "新增量来源"
    ],
    "facts": [
      {
        "id": "first",
        "text": "先放1张桌子，四周可坐6人.",
        "kind": "given"
      },
      {
        "id": "join",
        "text": "原图沿长边拼接；每次拼接处有2条长边，每条原可坐2人，这些座位被遮住.",
        "kind": "given"
      },
      {
        "id": "target",
        "text": "拼好后可坐40人.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设桌子张数为x",
        "variable": "x",
        "meaning": "桌子张数",
        "unit": "张",
        "domain": "x为正整数",
        "derivations": [
          {
            "id": "newSeats",
            "label": "每再拼入一张新增的座位",
            "expr": "6-2*2",
            "result": "2",
            "sources": [
              "first",
              "join"
            ],
            "explain": "新桌原有6个座位；相接的2条长边各有2个座位不能再坐人."
          }
        ],
        "table": {
          "headers": [
            "部分",
            "每张新增座位/个",
            "桌子数量/张",
            "座位/个"
          ],
          "rows": [
            {
              "label": "第一张",
              "cells": [
                {
                  "expr": "6",
                  "sources": [
                    "first"
                  ],
                  "given": true
                },
                {
                  "expr": "1",
                  "sources": [
                    "first"
                  ],
                  "given": true
                },
                {
                  "expr": "6*1",
                  "sources": [
                    "first"
                  ]
                }
              ]
            },
            {
              "label": "后来加的桌子",
              "cells": [
                {
                  "expr": "2",
                  "sources": [
                    "newSeats"
                  ],
                  "given": true
                },
                {
                  "expr": "x-1",
                  "sources": [
                    "unknown",
                    "first"
                  ]
                },
                {
                  "expr": "2*(x-1)",
                  "sources": [
                    "newSeats",
                    "unknown",
                    "first"
                  ]
                }
              ]
            },
            {
              "label": "合计",
              "cells": [
                {
                  "note": "首张与后加的不同"
                },
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "40",
                  "sources": [
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
            "总座位＝第一张座位＋后面各张新增座位",
            "每加一张：新桌6席－两条相接长边原有的座位"
          ],
          "multiply": [
            "后面新增座位＝每张新增量×后加桌数"
          ]
        },
        "closure": {
          "sources": [
            "target"
          ],
          "text": "拼出的总座位数为40.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "拼桌座位",
            "left": "6+2*(x-1)",
            "right": "40"
          }
        ],
        "answers": [
          {
            "label": "桌子张数",
            "expr": "18",
            "unit": "张"
          }
        ],
        "steps": [
          "6+2*(x-1)=40",
          "x-1=(40-6)/2",
          "x=(40-6)/2+1=18"
        ],
        "checks": [
          {
            "text": "18张桌子座位",
            "expr": "6+(6-2*2)*(18-1)",
            "result": "40"
          }
        ],
        "conclusion": "需要18张桌子.原图每加一张只增加2个座位；拼接方向是计数条件的一部分.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "需要18张桌子.原图每加一张只增加2个座位；拼接方向是计数条件的一部分."
        },
        "variation": "若改成沿短边拼接，每次会遮住几个座位？请重新推导新增量."
      }
    ],
    "notices": [],
    "originalStem": "一张长方形桌子四周可坐6人，如果按如图所示的方式拼桌子，那么多少张桌子拼在一起可以坐40人？",
    "originalStems": {
      "R17": "一张长方形桌子四周可坐6人，如果按如图所示的方式拼桌子，那么多少张桌子拼在一起可以坐40人？"
    },
    "sourceFigure": {
      "file": "figures/joined-tables.svg",
      "alt": "按教材方向拼1张、2张、3张长方形桌子"
    }
  },
  {
    "id": "TB-R18",
    "textbookItemId": "R18",
    "title": "直角三角形的两个锐角",
    "group": "教材·灵活运用",
    "source": "《数学 七年级上册》苏科版2026，136页 · 灵活运用 第22题",
    "kind": "linear",
    "stem": "直角三角形的一个锐角比另一个锐角的3倍小10°.这两个锐角分别是多少度？",
    "tags": [
      "角度",
      "已学性质"
    ],
    "facts": [
      {
        "id": "relation",
        "text": "一个锐角比另一个锐角的3倍小10°.",
        "kind": "given"
      },
      {
        "id": "right",
        "text": "直角为90°.",
        "kind": "property"
      },
      {
        "id": "triangle",
        "text": "三角形三个内角的度数和为180°.",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设作为倍数基准的锐角为x",
        "variable": "x",
        "meaning": "作为倍数基准的锐角",
        "unit": "度",
        "domain": "0<x<90，且0<3x−10<90",
        "derivations": [
          {
            "id": "acuteSum",
            "label": "两个锐角的度数和",
            "expr": "180-90",
            "result": "90",
            "sources": [
              "triangle",
              "right"
            ],
            "explain": "从三角形180°中去掉直角90°."
          }
        ],
        "table": {
          "headers": [
            "角",
            "度数/度"
          ],
          "rows": [
            {
              "label": "基准锐角",
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
              "label": "另一个锐角",
              "cells": [
                {
                  "expr": "3*x-10",
                  "sources": [
                    "relation",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "两个锐角之和",
              "cells": [
                {
                  "expr": "90",
                  "sources": [
                    "acuteSum"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "两个锐角度数和＝三角形内角和－直角度数",
            "另一个锐角＝基准锐角的3倍－10°"
          ],
          "multiply": [
            "基准锐角×3得到比较量"
          ]
        },
        "closure": {
          "sources": [
            "right",
            "triangle"
          ],
          "text": "两个锐角之和等于180°减去直角90°.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "锐角之和",
            "left": "x+(3*x-10)",
            "right": "90"
          }
        ],
        "answers": [
          {
            "label": "基准锐角",
            "expr": "25",
            "unit": "度"
          },
          {
            "label": "另一个锐角",
            "expr": "65",
            "unit": "度"
          }
        ],
        "steps": [
          "x+(3*x-10)=90",
          "x=(90+10)/(1+3)=25",
          "3*25-10=65"
        ],
        "checks": [
          {
            "text": "三角形内角和",
            "expr": "25+65+90",
            "result": "180"
          },
          {
            "text": "倍数与差",
            "expr": "3*25-65",
            "result": "10"
          }
        ],
        "conclusion": "两个锐角分别为25°和65°，均大于0°且小于90°.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "两个锐角分别为25°和65°，均大于0°且小于90°."
        },
        "variation": "若比较条件中的3倍改成2倍，和关系是否改变？"
      }
    ],
    "originalStem": "直角三角形的一个锐角比另一个锐角的3倍小10°，求这两个锐角.",
    "originalStems": {
      "R18": "直角三角形的一个锐角比另一个锐角的3倍小10°，求这两个锐角."
    }
  },
  {
    "id": "TB-R19",
    "textbookItemId": "R19",
    "title": "三折与四折测井",
    "group": "教材·灵活运用",
    "source": "《数学 七年级上册》苏科版2026，136页 · 灵活运用 第23题",
    "kind": "linear",
    "stem": "把同一根绳三折量井深，井外余4尺；把绳四折量井深，井外余1尺.绳长、井深各多少尺？",
    "tags": [
      "古代问题",
      "同量两表达"
    ],
    "facts": [
      {
        "id": "three",
        "text": "绳子等长三折，即每段为绳长的1/3，井外余4尺.",
        "kind": "given"
      },
      {
        "id": "four",
        "text": "绳子等长四折，即每段为绳长的1/4，井外余1尺.",
        "kind": "given"
      },
      {
        "id": "same",
        "text": "两次用同一根绳测同一口井，绳长与井深都没有改变.",
        "kind": "given"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设绳子原长为x",
        "variable": "x",
        "meaning": "绳子原长",
        "unit": "尺",
        "domain": "x为正数，计算结果还需符合题目的数量范围",
        "derivations": [],
        "table": {
          "headers": [
            "测量方式",
            "折数",
            "折后每段长/尺",
            "井外余长/尺",
            "井深/尺"
          ],
          "rows": [
            {
              "label": "三折测量",
              "cells": [
                {
                  "expr": "3",
                  "sources": [
                    "three"
                  ],
                  "given": true
                },
                {
                  "expr": "x/3",
                  "sources": [
                    "three",
                    "unknown"
                  ]
                },
                {
                  "expr": "4",
                  "sources": [
                    "three"
                  ],
                  "given": true
                },
                {
                  "expr": "x/3-4",
                  "sources": [
                    "three",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "四折测量",
              "cells": [
                {
                  "expr": "4",
                  "sources": [
                    "four"
                  ],
                  "given": true
                },
                {
                  "expr": "x/4",
                  "sources": [
                    "four",
                    "unknown"
                  ]
                },
                {
                  "expr": "1",
                  "sources": [
                    "four"
                  ],
                  "given": true
                },
                {
                  "expr": "x/4-1",
                  "sources": [
                    "four",
                    "unknown"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "折后每段长＝井深＋井外余绳"
          ],
          "multiply": [
            "原绳长＝折数×折后每段长"
          ]
        },
        "closure": {
          "sources": [
            "same"
          ],
          "text": "两种测量得到的井深必须相等.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "同一井深",
            "left": "x/3-4",
            "right": "x/4-1"
          }
        ],
        "answers": [
          {
            "label": "绳长",
            "expr": "36",
            "unit": "尺"
          },
          {
            "label": "井深",
            "expr": "8",
            "unit": "尺"
          }
        ],
        "steps": [
          "x/3-4=x/4-1",
          "(1/3-1/4)*x=4-1",
          "x=(4-1)/(1/3-1/4)=36",
          "36/3-4=8"
        ],
        "checks": [
          {
            "text": "三折后的井深",
            "expr": "36/3-4",
            "result": "8"
          },
          {
            "text": "四折后的井深",
            "expr": "36/4-1",
            "result": "8"
          }
        ],
        "conclusion": "绳长36尺，井深8尺.每次余绳都从折后单段长度中减去.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "绳长36尺，井深8尺.每次余绳都从折后单段长度中减去."
        },
        "variation": "若设井深为x，如何分别用三折、四折条件表示整根绳长？"
      }
    ],
    "originalStem": "我国古代问题：以绳测井，若将绳三折测之，绳多四尺；若将绳四折测之，绳多一尺.绳长、井深各几何？\n其大意是：用绳子量井深，把绳三折来量，井外余绳四尺；把绳四折来量，井外余绳一尺.绳长、井深各几尺？请你解决这个问题.",
    "originalStems": {
      "R19": "我国古代问题：以绳测井，若将绳三折测之，绳多四尺；若将绳四折测之，绳多一尺.绳长、井深各几何？\n其大意是：用绳子量井深，把绳三折来量，井外余绳四尺；把绳四折来量，井外余绳一尺.绳长、井深各几尺？请你解决这个问题."
    }
  },
  {
    "id": "TB-R20",
    "textbookItemId": "R20",
    "title": "两次使用铁丝的不同基准",
    "group": "教材·灵活运用",
    "source": "《数学 七年级上册》苏科版2026，136页 · 灵活运用 第24题",
    "kind": "linear",
    "stem": "第一次用去铁丝原长的一半少1米，第二次用去第一次剩下的一半多1米，最后剩3米.铁丝原来多长？",
    "tags": [
      "阶段",
      "基准量变化"
    ],
    "facts": [
      {
        "id": "first",
        "text": "第一次用去原长的一半少1米.",
        "kind": "given"
      },
      {
        "id": "second",
        "text": "第二次用去第一次剩余长度的一半多1米.",
        "kind": "given"
      },
      {
        "id": "left",
        "text": "最后还剩3米.",
        "kind": "given"
      },
      {
        "id": "half",
        "text": "一半表示把基准量平均分成2份，取其中1份.",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设铁丝原长为x",
        "variable": "x",
        "meaning": "铁丝原长",
        "unit": "米",
        "domain": "原长与每次用去、余下的长度均应非负",
        "derivations": [],
        "table": {
          "headers": [
            "阶段",
            "使用前/米",
            "本次用去/米",
            "使用后/米"
          ],
          "rows": [
            {
              "label": "第一次",
              "cells": [
                {
                  "expr": "x",
                  "sources": [
                    "unknown"
                  ],
                  "given": true
                },
                {
                  "expr": "x/2-1",
                  "sources": [
                    "unknown",
                    "first",
                    "half"
                  ]
                },
                {
                  "expr": "x-(x/2-1)",
                  "sources": [
                    "unknown",
                    "first",
                    "half"
                  ]
                }
              ]
            },
            {
              "label": "第二次",
              "cells": [
                {
                  "expr": "x-(x/2-1)",
                  "sources": [
                    "unknown",
                    "first",
                    "half"
                  ]
                },
                {
                  "expr": "(x-(x/2-1))/2+1",
                  "sources": [
                    "unknown",
                    "first",
                    "second",
                    "half"
                  ]
                },
                {
                  "expr": "3",
                  "sources": [
                    "left"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "使用前长度＝本次用去长度＋使用后长度"
          ],
          "multiply": [
            "两次的“一半”分别以原长和第一次剩余为基准"
          ]
        },
        "closure": {
          "sources": [
            "left"
          ],
          "text": "第二次用后剩下3米.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "两次使用后的剩余",
            "left": "(x-(x/2-1))-((x-(x/2-1))/2+1)",
            "right": "3"
          }
        ],
        "answers": [
          {
            "label": "铁丝原长",
            "expr": "14",
            "unit": "米"
          }
        ],
        "steps": [
          "(x-(x/2-1))-((x-(x/2-1))/2+1)=3",
          "(x/2+1)/2-1=3",
          "x/2+1=2*(3+1)",
          "x=2*(2*(3+1)-1)=14"
        ],
        "checks": [
          {
            "text": "第一次用去",
            "expr": "14/2-1",
            "result": "6"
          },
          {
            "text": "第二次用去",
            "expr": "(14-(14/2-1))/2+1",
            "result": "5"
          },
          {
            "text": "最后剩余",
            "expr": "14-6-5",
            "result": "3"
          }
        ],
        "conclusion": "铁丝原长14米.先用6米，余8米；再用5米，余3米.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "铁丝原长14米.先用6米，余8米；再用5米，余3米."
        },
        "variation": "把第二次条件改成“原长的一半多1米”，哪一个基准会变？"
      }
    ],
    "originalStem": "一根铁丝，第一次用去它的一半少1 m，第二次用去剩下的一半多1 m，结果还剩下3 m.这根铁丝原来有多长？",
    "originalStems": {
      "R20": "一根铁丝，第一次用去它的一半少1 m，第二次用去剩下的一半多1 m，结果还剩下3 m.这根铁丝原来有多长？"
    }
  },
  {
    "id": "TB-R21",
    "textbookItemId": "R21",
    "title": "折扣、成本与不亏本界限",
    "group": "教材·探索研究",
    "source": "《数学 七年级上册》苏科版2026，137页 · 探索研究 第25题",
    "kind": "linear",
    "stem": "服装按标价的5折出售亏20元，按8折出售赚40元.①每件标价与成本各多少元？②为保证不亏本，最多能打几折？",
    "tags": [
      "折扣",
      "成本守恒",
      "边界判断"
    ],
    "facts": [
      {
        "id": "low",
        "text": "按标价的5折出售，每件亏20元.",
        "kind": "given"
      },
      {
        "id": "high",
        "text": "按标价的8折出售，每件赚40元.",
        "kind": "given"
      },
      {
        "id": "discount",
        "text": "几折表示按标价的十分之几出售；例如a折的售价＝标价×a÷10.",
        "kind": "property"
      },
      {
        "id": "same",
        "text": "两种售价方案对应同一件服装，所以成本相同.",
        "kind": "given"
      },
      {
        "id": "breakeven",
        "text": "不亏本要求售价不低于成本；最低允许售价等于成本.",
        "kind": "property"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "设每件服装标价为x",
        "variable": "x",
        "meaning": "每件服装标价",
        "unit": "元",
        "domain": "x>0；最低折数必须对应不亏本的售价",
        "derivations": [
          {
            "id": "lowRate",
            "label": "五折：售价是标价的几倍",
            "expr": "5/10",
            "result": "0.5",
            "sources": [
              "low",
              "discount"
            ],
            "explain": "换算范例：五折→5÷10=0.5.意思是标价每10元，实际付5元；售价=标价×0.5.请写出换算算式."
          },
          {
            "id": "highRate",
            "label": "八折：售价是标价的几倍",
            "expr": "8/10",
            "result": "0.8",
            "sources": [
              "high",
              "discount"
            ],
            "explain": "换算范例：八折→8÷10=0.8.意思是标价每10元，实际付8元；售价=标价×0.8.请写出换算算式."
          }
        ],
        "table": {
          "headers": [
            "销售方案",
            "售价是标价的几倍",
            "售价/元",
            "盈亏关系表示的成本/元"
          ],
          "rows": [
            {
              "label": "5折出售",
              "cells": [
                {
                  "expr": "0.5",
                  "sources": [
                    "lowRate"
                  ],
                  "given": true
                },
                {
                  "expr": "0.5*x",
                  "sources": [
                    "lowRate",
                    "unknown"
                  ]
                },
                {
                  "expr": "0.5*x+20",
                  "sources": [
                    "lowRate",
                    "unknown",
                    "low"
                  ]
                }
              ]
            },
            {
              "label": "8折出售",
              "cells": [
                {
                  "expr": "0.8",
                  "sources": [
                    "highRate"
                  ],
                  "given": true
                },
                {
                  "expr": "0.8*x",
                  "sources": [
                    "highRate",
                    "unknown"
                  ]
                },
                {
                  "expr": "0.8*x-40",
                  "sources": [
                    "highRate",
                    "unknown",
                    "high"
                  ]
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "亏本时成本＝售价＋亏损",
            "盈利时成本＝售价－利润"
          ],
          "multiply": [
            "售价＝标价×折扣倍数",
            "折数＝售价÷标价×10"
          ]
        },
        "closure": {
          "sources": [
            "same"
          ],
          "text": "两种方案表示的成本必须相等.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "同一件衣服的成本",
            "left": "0.5*x+20",
            "right": "0.8*x-40"
          }
        ],
        "answers": [
          {
            "label": "每件标价",
            "expr": "200",
            "unit": "元"
          },
          {
            "label": "每件成本",
            "expr": "120",
            "unit": "元"
          },
          {
            "label": "不亏本的最低折数",
            "expr": "6",
            "unit": "折"
          }
        ],
        "steps": [
          "0.5*x+20=0.8*x-40",
          "x=(20+40)/(0.8-0.5)=200",
          "0.5*200+20=120",
          "120/200*10=6"
        ],
        "checks": [
          {
            "text": "5折出售的亏损",
            "expr": "120-200*(5/10)",
            "result": "20"
          },
          {
            "text": "8折出售的利润",
            "expr": "200*(8/10)-120",
            "result": "40"
          },
          {
            "text": "6折售价等于成本",
            "expr": "200*(6/10)",
            "result": "120"
          }
        ],
        "conclusion": "每件标价200元，成本120元.最低只能打6折，6折恰好不亏；低于6折会亏本.",
        "verdict": {
          "correct": "valid",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "每件标价200元，成本120元.最低只能打6折，6折恰好不亏；低于6折会亏本."
        },
        "variation": "若要求每件至少赚一定金额，最低允许售价和折数应怎样得到？"
      }
    ],
    "originalStem": "一家商店因换季将某种服装打折销售，如果每件服装按标价的5折出售将亏20元，而按标价的8折出售将赚40元.问：\n（1）每件服装的标价、成本各是多少元？\n（2）为保证不亏本，最多能打几折？",
    "originalStems": {
      "R21": "一家商店因换季将某种服装打折销售，如果每件服装按标价的5折出售将亏20元，而按标价的8折出售将赚40元.问：\n（1）每件服装的标价、成本各是多少元？\n（2）为保证不亏本，最多能打几折？"
    }
  },
  {
    "id": "TB-R22",
    "textbookItemId": "R22",
    "title": "解释水果方程并另编应用题",
    "group": "教材·探索研究",
    "source": "《数学 七年级上册》苏科版2026，137页 · 探索研究 第26题",
    "kind": "open",
    "stem": "水果单价（元/斤）：梨6，西瓜2.5，葡萄8，苹果9，橘子4.2，香蕉2.8；1斤＝0.5千克.①说明方程50−6x＝8.6的实际意义；②仿照它另编几个方程并说明意义.",
    "tags": [
      "方程编题",
      "单位",
      "条件自设"
    ],
    "facts": [
      {
        "id": "prices",
        "text": "原图单价为：梨6元/斤，西瓜2.5元/斤，葡萄8元/斤，苹果9元/斤，橘子4.2元/斤，香蕉2.8元/斤.",
        "kind": "given"
      },
      {
        "id": "equation",
        "text": "原题给定方程50−6x＝8.6.",
        "kind": "given"
      },
      {
        "id": "conversion",
        "text": "原题说明1斤＝0.5千克.",
        "kind": "given"
      },
      {
        "id": "story",
        "text": "一种合理解释：拿50元购买x斤梨，找回8.6元；这里的付款、购买、找零是对给定方程的情境解释.",
        "kind": "example"
      }
    ],
    "routes": [
      {
        "id": "table",
        "label": "分析原方程的一种合理解释",
        "variable": "x",
        "meaning": "这一种解释中买梨的质量",
        "unit": "斤",
        "domain": "x≥0，购买金额不超过支付金额",
        "derivations": [],
        "table": {
          "headers": [
            "项目",
            "单价/元每斤",
            "质量/斤",
            "金额/元"
          ],
          "rows": [
            {
              "label": "买梨",
              "cells": [
                {
                  "expr": "6",
                  "sources": [
                    "prices"
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
                    "prices",
                    "unknown"
                  ]
                }
              ]
            },
            {
              "label": "支付金额",
              "cells": [
                {
                  "note": "不适用"
                },
                {
                  "note": "不适用"
                },
                {
                  "expr": "50",
                  "sources": [
                    "equation",
                    "story"
                  ],
                  "given": true
                }
              ]
            },
            {
              "label": "找回金额",
              "cells": [
                {
                  "note": "不适用"
                },
                {
                  "note": "不适用"
                },
                {
                  "expr": "8.6",
                  "sources": [
                    "equation",
                    "story"
                  ],
                  "given": true
                }
              ]
            }
          ]
        },
        "relations": {
          "add": [
            "付款金额＝购买金额＋找回金额"
          ],
          "multiply": [
            "购买金额＝单价×质量"
          ]
        },
        "closure": {
          "sources": [
            "equation"
          ],
          "text": "用给定方程解释付款减购买金额等于找零.",
          "hint": "哪些条件已经用来填表，哪个条件还必须由等式满足？"
        },
        "equations": [
          {
            "label": "给定方程的一种解释",
            "left": "50-6*x",
            "right": "8.6"
          }
        ],
        "answers": [
          {
            "label": "这一种解释中买梨的质量",
            "expr": "6.9",
            "unit": "斤"
          },
          {
            "label": "换成千克",
            "expr": "3.45",
            "unit": "千克"
          }
        ],
        "steps": [
          "50-6*x=8.6",
          "x=(50-8.6)/6=6.9",
          "6.9*0.5=3.45"
        ],
        "checks": [
          {
            "text": "找回金额",
            "expr": "50-6*6.9",
            "result": "8.6"
          },
          {
            "text": "斤换成千克",
            "expr": "6.9*0.5",
            "result": "3.45"
          }
        ],
        "conclusion": "一种解释是买6.9斤梨（3.45千克），付50元，找8.6元.原题要求的是解释和编题，情境并非唯一；自编方程须与图中单价、斤和千克的单位对应.",
        "verdict": {
          "correct": "open",
          "prompt": "代回原条件，结果是否完整并符合实际意义？",
          "explain": "一种解释是买6.9斤梨（3.45千克），付50元，找8.6元.原题要求的是解释和编题，情境并非唯一；自编方程须与图中单价、斤和千克的单位对应."
        },
        "variation": "请利用原图另外两种水果，各编一个方程，并写清未知数、每个数和等号两边的实际意义.",
        "discussion": "先完整解释原方程，再为其他水果至少各编一个方程.写明未知数与单位；自选的付款、找零或质量要注明为自己编设的条件."
      }
    ],
    "notices": [
      "付款50元、找零8.6元是给定方程的一种解释，不是原图另给的购物记录.自编题中的新数必须标注为自设条件."
    ],
    "originalStem": "某超市的水果价格如图所示（1斤=0.5 kg）.\n（1）试说明方程50-6x=8.6的实际意义；\n（2）仿照（1），编写几个方程，说明其实际意义，并与同学交流.",
    "originalStems": {
      "R22": "某超市的水果价格如图所示（1斤=0.5 kg）.\n（1）试说明方程50-6x=8.6的实际意义；\n（2）仿照（1），编写几个方程，说明其实际意义，并与同学交流."
    },
    "sourceFigure": {
      "file": "figures/fruit-prices.svg",
      "alt": "原题水果价格，单位元每斤"
    }
  }
];
if(typeof module==='object'&&module.exports)module.exports=data;else(root.RatioWordProblemsData ||= []).push(...data);
})(typeof window==='undefined'?globalThis:window);
