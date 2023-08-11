<template>
  <div class="analysis">
    <el-card shadow="hover" :body-style="{ padding: '0 0 20px 0' }">
      <template #header>
        <div class="menu-wrapper">
          <el-menu
            :default-active="avtiveIndex"
            mode="horizontal"
            @select="onMenuSelect"
            class="elmenu"
          >
            <el-menu-item index="2"
              ><el-icon><TrendCharts /></el-icon>折线图</el-menu-item
            >
            <el-menu-item index="1"
              ><el-icon><Histogram /></el-icon>柱状图</el-menu-item
            >
          </el-menu>

          <div class="menu-right">
            <el-radio-group v-model="radioSelect" size="samll">
              <el-radio-button
                label="今日"
                @click="changeDate(1)"
              ></el-radio-button>
              <el-radio-button
                label="本周"
                @click="changeDate(2)"
              ></el-radio-button>
              <el-radio-button
                label="本月"
                @click="changeDate(3)"
              ></el-radio-button>
              <el-radio-button
                label="今年"
                @click="changeDate(4)"
              ></el-radio-button>
            </el-radio-group>

            <date-picker
              :setType="'daterange'"
              :setSize="small"
              :setDateValue="dateValue"
            ></date-picker>
          </div>
        </div>
      </template>

      <div class="chart-wrap">
        <skeleton-bar v-show="barSkeleton"></skeleton-bar>
        <v-chart :option="chartOptions"></v-chart>
        <skeleton-list v-show="listSkeleton"></skeleton-list>

        <div class="chart-list">
          <div class="chart-list-title">排行榜</div>
          <div class="list-item-wrapper">
            <div
              class="list-item"
              v-for="(item, index) in shopListArr"
              :key="index"
            >
              <div :class="['list-item-sort', +index <= 2 ? 'sortby' : '']">
                {{ index + 1 }}
              </div>
              <div class="list-item-name">{{ item.name }}</div>
              <div class="list-item-category">{{ item.category }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import DatePicker from "../common/DatePicker.vue";
import SkeletonBar from "../skeleton/Bar.vue";
import SkeletonList from "../skeleton/List.vue";
import { shopList } from "../../api/getData";
import { TrendCharts, Histogram } from "@element-plus/icons-vue";
import { dayjs } from "element-plus";
export default {
  components: {
    DatePicker,
    TrendCharts,
    Histogram,
    SkeletonBar,
    SkeletonList,
  },
  props: ["sevenDate", "sevenDay"],
  data() {
    return {
      avtiveIndex: "1",
      radioSelect: "今日",
      shopListArr: [], //店铺列表数据
      latitude: 33,
      longitude: 100,
      offset: 0, //批次加载店铺列表，每次加载20个 limit = 20
      sortByType: 4, //排序方式id： 1：起送价、2：配送速度、3:评分、4: 智能排序(默认)、5:距离最近、6:销量最高
      chartOptions: {},
      dateValue: [],
      barSkeleton: true, //柱状图骨架加载
      listSkeleton: true, //列表图骨架加载
    };
  },
  watch: {
    sevenDate: {
      immediate: true,
      handler(newval) {
        let that = this;
        newval.forEach((item, index) => {
          if (that.isAllZero(item)) {
            that.sevenDate[index] = that.getRandomNumbers();
          }
        });
      },
    },
  },
  mounted() {
    this.initData();
  },
  updated() {
    this.render("bar", true);
  },
  methods: {
    async initData() {
      const res = await shopList(
        this.latitude,
        this.longitude,
        this.offset,
        "",
        "",
        this.sortByType
      );
      this.shopListArr = [...res];
      //写完效果记得删掉
      if (this.shopListArr.length === 0) {
        this.shopListArr = [
          {
            name: "蜜雪冰城",
            category: "饮料",
          },
          {
            name: "沪上阿姨",
            category: "饮料",
          },
          {
            name: "茅台",
            category: "饮料",
          },
          {
            name: "天下第一烧",
            category: "烧烤",
          },
          {
            name: "麻辣香锅",
            category: "麻辣烫",
          },
          {
            name: "姜太公",
            category: "姜太公的鱼",
          },
        ];
      }
      this.listSkeleton = false;
    },
    onMenuSelect(index) {
      this.avtiveIndex = index;
      if (index === "1") {
        this.render("bar", true);
      } else {
        this.render("line", false);
      }
    },
    //当数据传过来没有数据的时候我们随机显示先
    isAllZero(arr) {
      return arr.every((subArr) => subArr === 0);
    },
    getRandomNumbers() {
      return Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000));
    },
    render(type, gap) {
      this.chartOptions = {
        title: {
          text: "一周新趋势",
          textStyle: {
            fontSize: 12,
            color: "#666",
          },
          left: 25,
          top: 20,
        },
        legend: {
          data: ["新注册用户", "新增订单", "新增管理员"],
          top: 20,
        },
        grid: {
          top: 70,
          left: 60,
          right: 60,
          bottom: 50,
        },
        xAxis: {
          type: "category",
          boundaryGap: gap,
          data: this.sevenDay,
          axisTick: {
            //坐标轴刻度相关设置。
            alignWithLabel: true,
            lineStyle: {
              color: "#999",
            },
          },
          axisLine: {
            //坐标轴轴线相关设置。
            lineStyle: {
              color: "#333",
            },
          },
          axisLabel: {
            //坐标轴刻度标签的相关设置。
            color: "#333",
          },
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            //坐标轴在 grid 区域中的分隔线。
            lineStyle: {
              type: "dotted",
              color: "#eee",
            },
          },
        },
        tooltip: {
          //提示框组件。
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        series: [
          {
            name: "新注册用户",
            type: type,
            seriesLayoutBy: "row",
            data: this.sevenDate[0],
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#83bff6", // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: "#188df0", //50%处的颜色
                  },
                  {
                    offset: 1,
                    color: "#188df0", //100%处的颜色
                  },
                ],
                global: false,
              },
            },
          },
          {
            name: "新增订单",
            type: type,
            seriesLayoutBy: "row",
            data: this.sevenDate[2],
            itemStyle: {
              opacity: 0.8,
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgb(128,255,165)",
                  },
                  {
                    offset: 1,
                    color: "rgb(1,191,236)",
                  },
                ],
                global: false,
              },
            },
          },
          {
            name: "新增管理员",
            type: type,
            seriesLayoutBy: "row",
            data: this.sevenDate[1],
            itemStyle: {
              opacity: 0.8,
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgb(255,191,0)",
                  },
                  {
                    offset: 1,
                    color: "rgb(224,62,76)",
                  },
                ],
                global: false,
              },
            },
          },
        ],
      };

      //方法加载完成后，取消骨架
      this.barSkeleton = false;
    },
    changeDate(type) {
      switch (type) {
        //今日
        case 1:
          {
            const start = dayjs().format("YYYY-MM-DD");
            const end = dayjs().format("YYYY-MM-DD");
            this.dateValue = [start, end];
          }
          break;

        //本周
        case 2:
          {
            const start = dayjs()
              .startOf("week")
              .add(1, "day")
              .format("YYYY-MM-DD");

            const end = dayjs()
              .endOf("week")
              .add(1, "day")
              .format("YYYY-MM-DD");
            this.dateValue = [start, end];
          }
          break;

        //本月
        case 3:
          {
            const start = dayjs().startOf("months").format("YYYY-MM-DD");
            const end = dayjs().endOf("months").format("YYYY-MM-DD");
            this.dateValue = [start, end];
          }
          break;

        //今年
        case 4:
          {
            const start = dayjs().startOf("years").format("YYYY-MM-DD");
            const end = dayjs().endOf("years").format("YYYY-MM-DD");
            this.dateValue = [start, end];
          }
          console.log(this.dateValue);
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@media (prefers-color-scheme: dark) {
  body {
    color: #fff;
  }
}
.analysis {
  width: 100%;
  margin-top: 30px;
  .menu-wrapper {
    position: relative;
    display: flex;
    .elmenu {
      width: 100%;
      padding-left: 20px;
      .el-menu-item {
        height: 50px;
        line-height: 50px;
      }
    }
    .menu-right {
      position: absolute;
      right: 20px;
      top: 0;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .chart-wrap {
    display: flex;
    height: 270px;
    .echarts {
      flex: 0 0 70%;
      width: 70%;
      height: 100%;
    }

    .chart-list {
      flex: 1;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .chart-list-title {
        margin-top: 20px;
        font-size: 20px;
        color: #666;
        font-weight: 700;
      }

      .list-item-wrapper {
        margin-top: 15px;

        .list-item {
          display: flex;
          align-items: center;
          font-size: 15px;
          height: 20px;
          padding: 6px 20px 6px 0;

          .list-item-sort {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            color: #333;
            &.sortby {
              background-color: #fba700;
              border-radius: 50%;
              color: #fff;
              font-weight: 500;
            }
          }

          .list-item-name {
            margin-left: 10px;
            color: #333;
          }

          .list-item-category {
            flex: 1;
            text-align: right;
          }
        }
      }
    }
  }
}

.el-card :deep(.el-card__header) {
  border-bottom: none;
  padding: 0;
}
.demo-date-picker {
  display: inline-block;
  margin-left: 20px;
}
</style>