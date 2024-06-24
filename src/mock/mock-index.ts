import Mock from "mockjs";
//处理路径传参
import { parameteUrl } from "@/utils/query-param";

function ArrSet(Arr: any[], id: string): any[] {
  let obj: any = {};
  const arrays = Arr.reduce((setArr, item) => {
    obj[item[id]] ? "" : (obj[item[id]] = true && setArr.push(item));
    return setArr;
  }, []);
  return arrays;
}
/**
 * @description: min ≤ r ≤ max  随机数
 * @param {*} Min
 * @param {*} Max
 * @return {*}
 */
function RandomNumBoth(Min: any, Max: any) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}
//左中
export default [
  {
    url: "/bigscreen/centerMap",
    type: "get",
    response: (options: any) => {
      let params = parameteUrl(options.url);
      //不是中国的时候
      if (params.regionCode && !["huanan"].includes(params.regionCode)) {
        const a = Mock.mock({
          success: true,
          data: {
            "dataList|100": [
              {
                name: "@city()",
                value: "@integer(1, 1000)",
              },
            ],
            // regionCode: params.regionCode,//-代表中国
            regionCode: params.regionCode, //-代表中国
          },
        });
        return a;
      } else {
        const a = Mock.mock({
          success: true,
          data: {
            "dataList|12": [
              {
                name: "@province()",
                value: "@integer(1, 1100)",
              },
            ],
            regionCode: "huanan",
          },
        });
        // 去重
        a.data.dataList = ArrSet(a.data.dataList, "name");
        return a;
      }
    },
  },

  // 左上--全民健康_医疗基本数据概况
  {
    url: "/ygtbi_qmjk_yljbsjgk",
    type: "post",
    response: () => {
      const a = Mock.mock({
        msg: "成功",
        result: {
          区域内医疗机构: "@integer(1, 400)",
          已接入: "@integer(1, 300)",
          健康档案主索引注册数: "@float(1, 200, 2, 2)",
          常住人口数: "@float(1, 200, 2, 2)",
          电子健康档案: "@float(1, 200, 2, 2)",
          电子病例数: "@float(1, 300, 2, 2)",
          数据存储量: "@float(1, 300, 2, 2)",
          数据存储条数: "@float(1, 20, 2, 3)",
          昨日增长量: "@integer(1, 1000)",
          昨日增长数: "@integer(1, 10000)",
        },
        code: "10000",
      });
      return a;
    },
  },
  // 左下--全民健康_卫生资源概况
  {
    url: "/ygtbi_qmjk_wszygk",
    type: "post",
    response: () => {
      const a = Mock.mock({
        msg: "成功",
        "result|3-10": [
          {
            名称: "@city",
            每千人口技术人员数目: "@integer(1, 100)",
            每千人口职业教师数: "@integer(1, 100)",
            每千人口注册护士数: "@integer(1, 100)",
            每千人口床位数: "@integer(1, 100)",
          },
        ],
        code: "10000",
      });
      return a;
    },
  },
  // 右上左上--全民健康_电子病历库
  {
    url: "/ygtbi_qmjk_dzblk",
    type: "post",
    response: () => {
      const a = Mock.mock({
        msg: "成功",
        result: [
          {
            类型: "住院",
            份数: "@integer(1, 10000)",
          },
          {
            类型: "门诊",
            份数: "@integer(1, 10000)",
          },
        ],
        code: "10000",
      });
      return a;
    },
  },
  // 右上右上--全民健康_健康档案库
  {
    url: "/ygtbi_qmjk_jkdak",
    type: "post",
    response: () => {
      const a = Mock.mock({
        msg: "成功",
        "result": [
          {
            类别: "健康档案",
            数量: "@integer(1, 1400)",
          },
          {
            类别: "疾病管理",
            数量: "@integer(1, 1400)",
          },
          {
            类别: "疾病控制",
            数量: "@integer(1, 1400)",
          },
          {
            类别: "医疗服务",
            数量: "@integer(1, 1400)",
          },
          {
            类别: "妇幼保健",
            数量: "@integer(1, 1400)",
          },
        ],
        code: "10000",
      });
      return a;
    },
  },
  // 右上左下--全民健康_全员人口库
  {
    url: "/ygtbi_qmjk_qyrkk",
    type: "post",
    response: () => {
      const a = Mock.mock({
        msg: "成功",
        result: [
          {
            类别: "婴儿",
            数量: "@integer(1, 100)",
          },
          {
            类别: "幼儿",
            数量: "@integer(1, 100)",
          },
          {
            类别: "儿童",
            数量: "@integer(1, 100)",
          },
          {
            类别: "少年",
            数量: "@integer(1, 100)",
          },
          {
            类别: "青年",
            数量: "@integer(1, 100)",
          },
          {
            类别: "中年",
            数量: "@integer(1, 100)",
          },
          {
            类别: "老年",
            数量: "@integer(1, 100)",
          },
        ],
        code: "10000",
      });
      return a;
    },
  },
  // 右上右下--全民健康_卫生资源库
  {
    url: "/ygtbi_qmjk_wszyk",
    type: "post",
    response: () => {
      const a = Mock.mock({
        msg: "成功",
        result: [
          {
            类别: "医技",
            数量: "@integer(1, 100)",
          },
          {
            类别: "药师",
            数量: "@integer(1, 100)",
          },
          {
            类别: "护士",
            数量: "@integer(1, 100)",
          },
          {
            类别: "医师",
            数量: "@integer(1, 100)",
          },
        ],
        code: "10000",
      });
      return a;
    },
  },
  // 右下--全民健康_月增长量指标
  {
    url: "/ygtbi_qmjk_yzzlzb",
    type: "post",
    response: () => {
      // 创建一个连续的月份数组
      const months = [];
      const startYear = 2022;
      const endYear = 2022;
      for (let y = startYear; y <= endYear; y++) {
        for (let m = 1; m <= 12; m++) {
          months.push(`${y}-${m < 10 ? "0" + m : m}`);
        }
      }

      const a = Mock.mock({
        msg: "成功",
        "result|3-10": months.map((month) => ({
          日期: month,
          健康档案: "@integer(20000, 1000000)",
          电子病历: "@integer(20000, 1000000)",
          全员人口: "@integer(20000, 1000000)",
          卫生资源: "@integer(20000, 1000000)",
        })),
        code: "10000",
      });
      return a;
    },
  },
];
