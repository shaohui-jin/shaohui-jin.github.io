export const operator = [
  {
    operaDict: '计算运算符',
    operaList: [
      {
        operaValue: '=',
        operaDesc: '等于，判断两值是否相等',
        operaTemplate: '5 = 5 → TRUE name =“张三”'
      },
      {
        operaValue: '<>',
        operaDesc: '不等于，判断两值是否不等',
        operaTemplate: '10 <> 5 → TRUE'
      },
      {
        operaValue: '>',
        operaDesc: '大于，判断左值是否大于右值',
        operaTemplate: '8 > 3 → TRUE'
      },
      {
        operaValue: '<',
        operaDesc: '小于，判断左值是否小于右值',
        operaTemplate: '2 < 7 → TRUE'
      },
      {
        operaValue: '>=',
        operaDesc: '大于等于，判断左值是否大于或等于右值',
        operaTemplate: '10 >= 10 → TRUE'
      },
      {
        operaValue: '<=',
        operaDesc: '小于等于，判断左值是否小于或等于右值',
        operaTemplate: '3 <= 5 → TRUE'
      },
      {
        operaValue: '+',
        operaDesc: '加法，数值相加或字符串连接',
        operaTemplate: '3 + 2 → 5'
      },
      {
        operaValue: '-',
        operaDesc: '减法，数值相减或取负数',
        operaTemplate: '10 - 4 → 6；-5 → -5'
      },
      {
        operaValue: '*',
        operaDesc: '乘法',
        operaTemplate: '7 * 3 → 21'
      },
      {
        operaValue: '/',
        operaDesc: '除法',
        operaTemplate: '15 / 3 → 5'
      },
      {
        operaValue: 'in ()',
        operaDesc: '判断值是否在指定列表中',
        operaTemplate: '3 in (1,2,3) → TRUE；Blue in ("Red", "Green") → FALSE',
        operaOffset: -1
      },
      {
        operaValue: 'not in ()',
        operadesc: '判断值是否不在指定列表中',
        operaTemplate: '5 NOT in (1,2,3) → TRUE',
        operaOffset: -1
      },
      {
        operaValue: 'and',
        operaDesc: '逻辑与，所有条件均为真时结果为真',
        operaTemplate: '(3 > 1) and (5 < 10) → TRUE'
      },
      {
        operaValue: 'or',
        operaDesc: '逻辑或，任一条件为真时结果为真',
        operaTemplate: '(2 < 0) or (4 > 1) → TRUE'
      },
      {
        operaValue: 'not ()',
        operaDesc: '逻辑非，取反',
        operaTemplate: 'not (5 = 3) → TRUE',
        operaOffset: -1
      },
      {
        operaValue: 'like',
        operaDesc: '模糊匹配（支持通配符 % 表示任意字符）',
        operaTemplate: '"Apple" like "A%" → TRUE（以"A"开头）'
      },
      {
        operaValue: 'not like',
        operaDesc: '排除模糊匹配',
        operaTemplate: '"Orange" not like "%e%" → FALSE（包含字母"e"）'
      },
      {
        operaValue: 'rows()',
        operaDesc: '计算数组长度',
        operaTemplate: 'rows(RST)计算素材列表的长度',
        operaOffset: -1
      }
    ]
  },
  {
    operaDict: '字符处理运算符',
    operaList: [
      {
        operaValue: '&',
        operaDesc: '字符串拼接',
        operaTemplate: '"Power" & "Point" → "PowerPoint"'
      },
      {
        operaValue: ',',
        operaDesc: '函数参数分隔或数组元素分隔',
        operaTemplate: 'SUM(A1, A2, A3)'
      },
      {
        operaValue: '""',
        operaDesc: '定义字符串内容',
        operaTemplate: '"Hello, World!"',
        operaOffset: -1
      }
    ]
  },
  {
    operaDict: '逻辑处理运算符',
    operaList: [
      {
        operaValue: 'if(condition, true, false)',
        operaDesc: '条件分支判断',
        operaTemplate: 'if(成绩 >= 60, "及格", "不及格")'
      },
      {
        operaValue: 'eval(ruleId, rst)',
        operaDesc: '执行ruleId规则',
        operaTemplate: 'eval(rst.ruleId, rst)'
      },
      {
        operaValue: 'Parent.Width',
        operaDesc: '获取父对象的属性（示例为伪代码）',
        operaTemplate: 'Parent.Width → 获取父级的宽度'
      },
      {
        operaValue: 'TParent.Width',
        operaDesc: '获取顶级对象属性（示例为伪代码）',
        operaTemplate: 'TParent.Uid → 获取顶级的uid'
      }
    ]
  },
  {
    operaDict: '数据处理运算符',
    operaList: [
      {
        operaValue: 'roundup(value, 小数位)',
        operaDesc: '向上取整（如：1.1 → 2，-1.1 → -2）',
        operaTemplate: 'roundup(3.14, 0) → 4'
      },
      {
        operaValue: 'rounddown(value, 小数位)',
        operaDesc: '向下取整（如：1.9 → 1，-1.9 → -1）',
        operaTemplate: 'rounddown(3.14, 0) → 3'
      },
      {
        operaValue: 'round(value, 小数位)',
        operaDesc: '四舍五入',
        operaTemplate: 'round(3.1415, 2) → 3.14，round(2.718, 0) → 3'
      },
      {
        operaValue: '()',
        operaDesc: '改变运算优先级或包裹函数参数',
        operaTemplate: '(2 + 3) * 4 → 20；IF(条件, 值1, 值2)',
        operaOffset: -1
      },
      {
        operaValue: 'abs(value)',
        operaDesc: '返回值的绝对值',
        operaTemplate: 'abs(-5) → 5，abs(3.14) → 3.14)'
      }
    ]
  }
]
