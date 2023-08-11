<template>
  <el-card shadow="hover">
    <template #header>
      <div class="title-wrapper">关键词搜索量</div>
    </template>
    <div class="container">
      <div class="char-wrapper">
        <div class="chart-view" v-loading="loading">
          <div class="chart-title">搜索量</div>
          <div class="chart-data">
            {{ search_total }}
          </div>
          <v-chart :option="usersOptions(this.search_nums)"></v-chart>
        </div>
      </div>

      <skeleton-list v-show="listSkeleton"></skeleton-list>

      <div class="table-wrapper">
        <el-table
          :data="
            categoryDetailData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
        >
          <el-table-column
            label="名称"
            name="名称"
            prop="product_name"
            width="260"
          ></el-table-column>
          <el-table-column
            label="价格(元)"
            name="价格"
            prop="price"
          ></el-table-column>
          <el-table-column
            label="销量"
            name="销量"
            prop="total_sales"
          ></el-table-column>
        </el-table>

        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="->,prev,pager,next,jumper"
          :total="categoryDetailData.length"
        ></el-pagination>
      </div>
    </div>
  </el-card>
</template>

<script>
import { searchTatol } from "../../api/getData";
import { thousandFormat } from "../../utils/common";
import SkeletonList from "../skeleton/List.vue";

export default {
  data() {
    return {
      //只显示前20的数据量
      search_nums: [], //前五的搜索量
      search_total: 0, //搜索总量
      categoryDetailData: [],
      currentPage: 1,
      pageSize: 5,
      loading: true,
      listSkeleton: true, //列表图骨架加载
      chartsList: {},
    };
  },
  components: {
    SkeletonList,
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      let listRes = await searchTatol();
      this.categoryDetailData = listRes.data;
      if (this.categoryDetailData.length !== 0) {
        this.search_nums = this.categoryDetailData
          .slice(0, 5)
          .map((item, index) => ({
            product_name: item.product_name,
            search_number: item.search_number,
          }));
        this.categoryDetailData.forEach((item) => {
          this.search_total += item.search_number;
        });
        this.search_total = thousandFormat(this.search_total);
      }
      this.loading = false;
      this.listSkeleton = false;
    },
    usersOptions(data) {
      return {
        grid: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data.map((item) => {
            return item.product_name;
          }),
        },
        yAxis: {
          type: "value",
          show: false,
        },
        tooltip: {
          trigger: "axis",
        },
        series: [
          {
            data: data.map((item) => {
              return item.search_number;
            }),
            type: "line",
            areaStyle: {},
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#f723b0" },
                  { offset: 0.5, color: "#f33636" },
                  { offset: 1, color: "#f683c2" },
                ],
                global: false,
              },
              opacity: 1,
            },
            smooth: true,
          },
        ],
      };
    },
    handleSizeChange(val) {
      //这个函数只是看后续显示条数有变化再变化
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.title-wrapper {
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
.container {
  height: 452px;
  .char-wrapper {
    display: flex;
    padding: 0 10px;
    .chart-view {
      flex: 1;
      padding: 0 10px;

      .chart-title {
        color: rgb(85, 78, 78);
        font-size: 14px;
        margin-bottom: 5px;
        font-weight: 700;
      }
      .chart-data {
        font-size: 22px;
        color: #333;
        font-weight: 700;
        letter-spacing: 2px;
      }
      .echarts {
        height: 100px;
      }
    }
  }
}
</style>
