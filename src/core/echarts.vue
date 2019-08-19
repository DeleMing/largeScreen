<template>
  <div :id="id" :style="{width:width,height:height}"></div>
</template>

<script>
import Guid from "./guid";
import echarts from "echarts";

export default {
  data() {
    return {
      id: Guid.methods.getGuid(),
      echarts: null,
      width: "100%"
    };
  },
  props: [
    "title",
    "legend",
    "grid",
    "series",
    "xAxis",
    "yAxis",
    "tooltip",
    "color",
    "height"
  ],
  mounted: function() {
    this.echarts = echarts.init(document.getElementById(this.id + ""));
    this.initEchart();
  },
  methods: {
    initEchart: function() {
      let option = {
        title: this.title,
        xAxis: this.xAxis,
        tooltip: this.tooltip,
        legend: this.legend,
        grid: this.grid,
        yAxis: this.yAxis,
        series: this.series,
        color: this.color,
        animationEasing: "elasticOut"
      };
      this.echarts.setOption(option);
      this.echarts.on("click", params => {
        this.$emit("params", params);
      });
      this.echarts.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 0
      });
      this.echarts.on("mouseover", v => {
        if (v.dataIndex != 0) {
          this.echarts.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: 0
          });
        }
      });
      this.echarts.on("mouseout", v => {
        this.echarts.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: 0
        });
      });
    }
  },
  watch: {
    series: function(val) {
      this.initEchart();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
// 定义全局的背景色
@common: #ff6700;
.col-md-4 {
  div {
    background: @common;
    width: 100%;
    height: 100%;
  }
}
</style>
