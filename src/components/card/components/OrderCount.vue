<template>
  <base-card title="订单数量" time="月" :value="orderMonth">
    <template v-slot:inner>
      <v-chart :option="getOptions()"></v-chart>
    </template>
    <template v-slot:footer>
      <div class="footer">
        <span>订单总数</span>
        <span>{{ allOrderCount }}</span>
      </div>
    </template>
  </base-card>
</template>
<script>
import baseCardMixin from "@/mixins/baseCardMixin.js";

export default {
  mixins: [baseCardMixin],
  props: ["orderMonth", "allOrderCount", "thirtyDate"],
  methods: {
    getOptions() {
      return {
        xAxis: [
          {
            type: "category",
            show: false,
            data: this.thirtyDate[3].map((num, index) => {
              return `${index + 1}天`;
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
        },
        series: [
          {
            type: "line",
            data: this.thirtyDate[3],
            areaStyle: {
              color: "purple",
            },
            lineStyle: {
              width: 0,
            },
            itemStyle: {
              opacity: 0,
            },
            smooth: true,
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
  align-items: center;
  color: #515a6e;
}
</style>