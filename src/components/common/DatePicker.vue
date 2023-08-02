<template>
  <div class="demo-date-picker">
    <div class="block">
      <el-date-picker
        v-model="modelValue"
        :type="typeValue"
        placeholder="选择日期"
        range-separator="至"
        start-placeholder="Start date"
        end-placeholder="End date"
        unlink-panels
        :disabled-date="disabledDate"
        :shortcuts="shortcuts"
      ></el-date-picker>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    setType: String,
    setSize: String,
    setDateValue: Array,
  },
  data() {
    return {
      modelValue: this.setDateValue,
      typeValue: this.setType,
      sizeValue: this.setSize,
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      shortcuts: [
        {
          text: "上一周",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
          },
        },
        {
          text: "上一个月",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
          },
        },
        {
          text: "前三个月",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            return [start, end];
          },
        },
      ],
    };
  },
  watch: {
    setDateValue() {
      this.modelValue = this.setDateValue;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>