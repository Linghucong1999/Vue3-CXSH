<template>
  <base-card title="注册管理员" time="月" :value="adminMonth">
    <template v-slot:inner>
      <v-chart :option="getOptions()"></v-chart>
    </template>
    <template v-slot:footer>
      <div class="footer">
        <span>总注册量</span>
        <span>{{ allAdminCount }}</span>
      </div>
    </template>
  </base-card>
</template>

<script>
import baseCardMixin from "@/mixins/baseCardMixin.js";

export default {
  mixins: [baseCardMixin],
  props: ["allAdminCount", "adminMonth", "sevenDate", "thirtyDate"],
  methods: {
    getOptions() {
      return {
        xAxis: [
          {
            type: "category",
            show: true,
            data: this.thirtyDate[1].map((num, index) => {
              return `${index + 1}日`;
            }),
          },
        ],
        yAxis: [
          {
            show: true,
          },
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
            axis: "x",
          },
        },
        series: [
          {
            type: "bar",
            data: this.thirtyDate[1].filter((num, index) => {
              return index < 30;
            }),
            barWidth: "60%",
            emphasis: {
              itemStyle: {
                shadowBlur: 5,
                shadowColor: "rgba(0,0,0,0.3)",
              },
            },
          },
        ],
        grid: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-content: center;
  color: #515a6e;
}
</style>