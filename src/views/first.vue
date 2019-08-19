<template>
  <div class="main" :style="{'height':windowHeight}">
    <el-row :gutter="20" class="first-line">
      <el-col :span="8" class="logo"><img src="~@/assets/img/logo-haitong.png">海通证券</el-col>
      <el-col :span="8" class="title">海通日志分析应用</el-col>
      <el-col :span="8" class="time">{{dateTime}}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-row class="gutter split" v-loading="loading1" element-loading-text="数 据 加 载 中  . . ." element-loading-spinner="fa fa-spinner fa-pulse" element-loading-background="#052362">
          <el-col :span="12">
            <Echart :height="'150px'" :series="top5Data.series" :xAxis="top5Data.xAxis" :tooltip="top5Data.tooltip" :grid="top5Data.grid" :legend="top5Data.legend" :title="top5Data.title" :yAxis="top5Data.yAxis" :color="top5Data.color"></Echart>
          </el-col>
          <el-col :span="12" style="height:150px;text-align:center">
            <div style="font-size:80px;color:#fff">{{top5DataText}}</div>
            <div style="font-size:20px;color:#fff">TOP 5占总传输量比率</div>
          </el-col>
        </el-row>
        <div class="split">
          <el-row class="gutter" v-loading="loading1" element-loading-text="数 据 加 载 中  . . ." element-loading-spinner="fa fa-spinner fa-pulse" element-loading-background="#052362">
            <el-col :span="24" :style="{'height':firstcolumn}">
              <h4 style="color: #355FD0;font-weight:bold;letter-spacing:1px;margin-bottom:20px">系统组件日志条数（今日）</h4>
              <el-table :data="top5TableList" :row-style="{'background':'transparent','color':'#fff','font-size':'14px'}" :header-row-style="{'background':'transparent','color':'#3B76FB','font-size':'14px'}" :header-cell-style="{'background':'transparent','text-align': 'center'}">
                <el-table-column width="80">
                  <template slot-scope="scope">
                    <span style="color:#3B76FB">{{ scope.row.index }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="systemName" label="系统名称">
                </el-table-column>
                <el-table-column prop="componentName" label="组件名称">
                </el-table-column>
                <el-table-column prop="logCount" label="日志条数">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row v-loading="loading1" element-loading-text="数 据 加 载 中  . . ." element-loading-spinner="fa fa-spinner fa-pulse" element-loading-background="#052362">
            <el-col :span="24">
              <Echart :height="firstcolumn" :series="singleLogData.series" :xAxis="singleLogData.xAxis" :tooltip="singleLogData.tooltip" :grid="singleLogData.grid" :legend="singleLogData.legend" :title="singleLogData.title" :yAxis="singleLogData.yAxis" :color="singleLogData.color"></Echart>
            </el-col>
          </el-row>
        </div>
        <el-row class="split" v-loading="loading1" element-loading-text="数 据 加 载 中  . . ." element-loading-spinner="fa fa-spinner fa-pulse" element-loading-background="#052362">
          <el-col :span="24">
            <Echart :height="firstcolumn" :series="saveData.series" :xAxis="saveData.xAxis" :tooltip="saveData.tooltip" :grid="saveData.grid" :legend="saveData.legend" :title="saveData.title" :yAxis="saveData.yAxis" :color="saveData.color"></Echart>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="10">
        <el-row class="gutter split" v-loading="loading2" element-loading-text="数 据 加 载 中  . . ." element-loading-spinner="fa fa-spinner fa-pulse" element-loading-background="#052362">
          <el-col :span="6" style="height:150px;padding:12px 0;text-align:center">
            <h4 style="font-size:30px;color:#fff">{{allSysCount}}</h4>
            <h5 style="font-size:18px;color:#4598FF">总接入系统数</h5>
            <el-carousel height="36px" indicator-position='none'>
              <el-carousel-item v-for="item in allSysList" :key="item">
                <h5 style="font-size:20px;color:#4598FF">{{ item }}</h5>
              </el-carousel-item>
            </el-carousel>
          </el-col>
          <el-col :span="6">
            <Echart :height="'150px'" :series="saveDataPie.series" :xAxis="saveDataPie.xAxis" :tooltip="saveDataPie.tooltip" :grid="saveDataPie.grid" :legend="saveDataPie.legend" :title="saveDataPie.title" :yAxis="saveDataPie.yAxis" :color="saveDataPie.color"></Echart>
          </el-col>
          <el-col :span="5" style="height:150px;padding:22px 0;text-align:left">
            <div style="font-size:50px;color:#fff">{{saveDataPieText}}</div>
            <div style="font-size:20px;color:#4598FF">存储占比</div>
          </el-col>
          <el-col :span="7" style="height:150px;text-align:left;padding-left:10px">
            <div>
              <span style="font-size:18px;color:#4598FF;margin-right:10px">日志储存大小</span>
              <span style="font-size:30px;color:#fff">{{String(documentMemory/1024/1024/1024/1024).slice(0,4)}}T</span>
            </div>
            <div style="margin-top:10px">
              <span style="font-size:18px;color:#4598FF;margin-right:10px">已储存大小</span>
              <span style="font-size:30px;color:#fff">{{String(availableMemory/1024/1024/1024/1024).slice(0,4)}}T</span>
            </div>
            <div style="margin-top:10px">
              <span style="font-size:18px;color:#4598FF;margin-right:10px">总储存大小</span>
              <span style="font-size:30px;color:#fff">{{String(totalMemory/1024/1024/1024/1024).slice(0,4)}}T</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="gutter split" v-loading="loading3" element-loading-text="数 据 加 载 中  . . ." element-loading-spinner="fa fa-spinner fa-pulse" element-loading-background="#052362">
          <el-col :span="24">
            <Echart :height="secondcolumn" :series="allSystemData.series" :xAxis="allSystemData.xAxis" :tooltip="allSystemData.tooltip" :grid="allSystemData.grid" :legend="allSystemData.legend" :title="allSystemData.title" :yAxis="allSystemData.yAxis" :color="allSystemData.color"></Echart>
          </el-col>
        </el-row>
        <el-row class="gutter split" v-loading="loading4" element-loading-text="数 据 加 载 中  . . ." element-loading-spinner="fa fa-spinner fa-pulse" element-loading-background="#052362">
          <el-col :span="24">
            <Echart :height="secondcolumn" :series="weekData.series" :xAxis="weekData.xAxis" :tooltip="weekData.tooltip" :grid="weekData.grid" :legend="weekData.legend" :title="weekData.title" :yAxis="weekData.yAxis" :color="weekData.color"></Echart>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="7">
        <el-row class="gutter split" v-loading="loading6" element-loading-text="数 据 加 载 中  . . ." element-loading-spinner="fa fa-spinner fa-pulse" element-loading-background="#052362">
          <el-col :span="12">
            <Echart :height="'150px'" :series="lastTop3Data.series" :xAxis="lastTop3Data.xAxis" :tooltip="lastTop3Data.tooltip" :grid="lastTop3Data.grid" :legend="lastTop3Data.legend" :title="lastTop3Data.title" :yAxis="lastTop3Data.yAxis" :color="lastTop3Data.color"></Echart>
          </el-col>
          <el-col :span="12" style="text-align:center">
            <div style="font-size:80px;color:#fff">{{lastTop3Text}}</div>
            <div style="font-size:20px;color:#fff">TOP后3 占总传输量比率</div>
          </el-col>
        </el-row>

        <div class="split">
          <el-row class="gutter" v-loading="loading6" element-loading-text="数 据 加 载 中  . . ." element-loading-spinner="fa fa-spinner fa-pulse" element-loading-background="#052362">
            <el-col :span="24" :style="{'height':thirdcolumn}">
              <h4 style="color: #355FD0;font-weight:bold;letter-spacing:1px;margin-bottom:20px">系统组件日志条数（今日）</h4>
              <el-table :data="lastTop3TableList" :row-style="{'background':'transparent','color':'#fff','font-size':'14px'}" :header-row-style="{'background':'transparent','color':'#3B76FB','font-size':'14px'}" :header-cell-style="{'background':'transparent','text-align': 'center'}">
                <el-table-column width="80">
                  <template slot-scope="scope">
                    <span style="color:#3B76FB">{{ scope.row.index }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="systemName" label="系统名称">
                </el-table-column>
                <el-table-column prop="componentName" label="组件名称">
                </el-table-column>
                <el-table-column prop="logCount" label="日志条数">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row v-loading="loading6" element-loading-text="数 据 加 载 中  . . ." element-loading-spinner="fa fa-spinner fa-pulse" element-loading-background="#052362">
            <el-col :span="24">
              <Echart :height="thirdcolumn" :series="lastTop3singleLogData.series" :xAxis="lastTop3singleLogData.xAxis" :tooltip="lastTop3singleLogData.tooltip" :grid="lastTop3singleLogData.grid" :legend="lastTop3singleLogData.legend" :title="lastTop3singleLogData.title" :yAxis="lastTop3singleLogData.yAxis" :color="lastTop3singleLogData.color"></Echart>
            </el-col>
          </el-row>
        </div>
        <el-row class="split" v-loading="loading6" element-loading-text="数 据 加 载 中  . . ." element-loading-spinner="fa fa-spinner fa-pulse" element-loading-background="#052362">
          <el-col :span="24">
            <Echart :height="thirdcolumn" :series="lastTop3saveData.series" :xAxis="lastTop3saveData.xAxis" :tooltip="lastTop3saveData.tooltip" :grid="lastTop3saveData.grid" :legend="lastTop3saveData.legend" :title="lastTop3saveData.title" :yAxis="lastTop3saveData.yAxis" :color="lastTop3saveData.color"></Echart>
          </el-col>
        </el-row>
        <el-row class="gutter split" v-loading="loading5" element-loading-text="数 据 加 载 中  . . ." element-loading-spinner="fa fa-spinner fa-pulse" element-loading-background="#052362">
          <el-col :span="24">
            <el-table :data="dataAndCount" :height="'100px'" :row-style="{'background':'transparent','color':'#fff','font-size':'14px'}" :header-row-style="{'background':'transparent','color':'#3B76FB','font-size':'14px'}" :header-cell-style="{'background':'transparent','text-align': 'center'}">
              <el-table-column width="80">
                <template slot-scope="scope">
                  <span style="color:#3B76FB">{{ scope.row.index }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="today" label="今天">
              </el-table-column>
              <el-table-column prop="yestoday" label="昨天">
              </el-table-column>
              <el-table-column prop="yestodaySofar" label="昨日当前时间段">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Echart from "@/core/echarts";
import echarts from "echarts";
import Service from "@/service/service.js";
export default {
  data() {
    return {
      dateTime: "",
      firstcolumn: (window.innerHeight - 430) / 3 + "px",
      secondcolumn: (window.innerHeight - 410) / 2 + "px",
      thirdcolumn: (window.innerHeight - 574) / 3 + "px",
      windowHeight: window.innerHeight + "px",
      allSysCount: 0,
      allSysList: [],
      saveDataPieText: 0,
      availableMemory: 0,
      totalMemory: 0,
      documentMemory: 0,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      loading6: false,
      top5Data: {
        title: "",
        legend: "",
        color: ["#9966CC", "#5BA2FF"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          position: ["50%", "50%"]
        },
        grid: "",
        xAxis: "",
        yAxis: "",
        series: []
      }, //TOP 5占总传输量比率
      top5DataText: 0,
      top5TableList: [], //TOP 5占总传输量表格
      saveData: {
        title: {
          text: "存储数据条数（今日）",
          textStyle: {
            color: "#355FD0"
          }
        },
        legend: "",
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "0",
          right: "10%",
          bottom: "0",
          top: "20%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          show: false
        },
        yAxis: {
          type: "category",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#fff",
            fontSize: "14"
          },
          data: []
        },
        series: []
      }, //存储数量占比
      singleLogData: {
        title: {
          text: "单独日志占比（今日）",
          textStyle: {
            color: "#355FD0"
          }
        },
        legend: "",
        tooltip: {
          trigger: "axis",
          formatter: val => {
            return (
              val[0].axisValue +
              "<br/>" +
              "单独日志占比：" +
              String(val[0].value).slice(0, 4) +
              "%"
            );
          }
        },
        grid: {
          left: "0",
          right: "10%",
          bottom: "0",
          top: "20%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          show: false
        },
        yAxis: {
          type: "category",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#fff",
            fontSize: "14"
          },
          data: []
        },
        series: []
      }, //单独日志占比
      saveDataPie: {
        title: "",
        legend: "",
        color: ["#9966CC", "#5BA2FF"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          position: ["50%", "50%"]
        },
        grid: "",
        xAxis: "",
        yAxis: "",
        series: []
      }, //存储占比
      allSystemData: {
        title: {
          text: "所有系统传输量统计图（条）",
          textStyle: {
            color: "#355FD0"
          }
        },
        legend: {
          data: ["今日传输量", "过去5日传输量平均值"],
          x: "right",
          y: "top",
          itemWidth: 50,
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "0",
          right: "5%",
          bottom: "0",
          top: "20%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: [],
          boundaryGap: false,
          axisTick: {
            show: false,
            alignWithLabel: false
          },
          axisLabel: {
            color: "#fff",
            fontSize: "14"
          },
          axisLine: {
            lineStyle: {
              color: "#224E97",
              width: 2
            }
          }
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#fff",
            fontSize: "14"
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#224E97",
              width: 2
            }
          }
        },
        series: []
      }, //所有系统传输量统计图
      weekData: {
        title: {
          text: "一周传输量对比图（条）",
          textStyle: {
            color: "#355FD0"
          }
        },
        legend: {
          data: ["上周", "这周"],
          x: "right",
          y: "top",
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "0",
          right: "5%",
          bottom: "0",
          top: "20%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          // nameLocation: "end",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          // name: "日期",
          axisTick: {
            show: false,
            alignWithLabel: false
          },
          axisLabel: {
            color: "#fff",
            fontSize: "14"
          },
          axisLine: {
            lineStyle: {
              color: "#224E97",
              width: 2
            }
          }
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#fff",
            fontSize: "14"
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#224E97",
              width: 2
            }
          }
        },
        series: []
      }, //一周传输量对比图
      dataAndCount: [], //今日，昨日数据条数和数据量
      lastTop3Text: 0,
      lastTop3Data: {
        title: "",
        legend: "",
        color: ["#9966CC", "#5BA2FF"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        grid: "",
        xAxis: "",
        yAxis: "",
        series: []
      }, //TOP后3占总传输量比率
      lastTop3TableList: [], //TOP后3占总传输量表格
      lastTop3saveData: {
        title: {
          text: "存储数据条数（今日）",
          textStyle: {
            color: "#355FD0"
          }
        },
        legend: "",
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "0",
          right: "10%",
          bottom: "0",
          top: "20%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          show: false
        },
        yAxis: {
          type: "category",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#fff",
            fontSize: "14"
          },
          data: []
        },
        series: []
      }, //TOP后3存储数量占比
      lastTop3singleLogData: {
        title: {
          text: "单独日志占比（今日）",
          textStyle: {
            color: "#355FD0"
          }
        },
        legend: "",
        tooltip: {
          trigger: "axis",
          formatter: val => {
            return (
              val[0].axisValue +
              "<br/>" +
              "单独日志占比：" +
              String(val[0].value).slice(0, 4) +
              "%"
            );
          }
        },
        grid: {
          left: "0",
          right: "10%",
          bottom: "0",
          top: "20%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          show: false
        },
        yAxis: {
          type: "category",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#fff",
            fontSize: "14"
          },
          data: []
        },
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: [],
            label: {
              normal: {
                show: true,
                position: "right",
                color: "#25B3FE"
              }
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#1056EE" },
                  { offset: 1, color: "#26B4FF" }
                ])
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#1056EE" },
                  { offset: 1, color: "#26B4FF" }
                ])
              }
            }
          }
        ]
      } //TOP后3单独日志占比
    };
  },
  components: {
    Echart
  },
  methods: {
    formatDateTime() {
      let dateTime = new Date();
      let y = dateTime.getFullYear();
      let M = dateTime.getMonth() + 1;
      let d = dateTime.getDate();
      let h = dateTime.getHours();
      let m = dateTime.getMinutes();
      let s = dateTime.getSeconds();
      if (m < 10) {
        m = "0" + m;
      }
      if (s < 10) {
        s = "0" + s;
      }
      return `${y}-${M}-${d} ${h}:${m}`;
    },
    left() {
      this.loading1 = true;
      Service.get(
        `esStatistics/statisticsTopOrBot.do?topType=top5`
      ).then(data => {
        if (data.data.code == "000000") {
          this.loading1 = false;
          this.top5Data.series = [
            {
              name: "日志量占比",
              type: "pie",
              radius: ["60%", "80%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: data.data.data[0].system_unitTop5Percent.split("%")[0],
                  name: "TOP 5占总传输量比率"
                },
                {
                  value:
                    100 -
                    data.data.data[0].system_unitTop5Percent.split("%")[0],
                  name: "其它 占总传输量比率"
                }
              ]
            }
          ];
          this.top5DataText = data.data.data[0].system_unitTop5Percent;
          let syss = [];
          let arr = [];
          let sysp = [];
          data.data.data[0].system_unitTop5List.forEach((val, i) => {
            arr.push({
              index: i + 1,
              systemName: val.system,
              componentName: val.unit,
              logCount: val.count
            });
            syss.push(val.system);
            sysp.push(val.percent.split("%")[0]);
          });
          this.top5TableList = arr;
          this.singleLogData.yAxis.data = syss.reverse();
          this.singleLogData.series = [
            {
              name: "单独日志占比",
              type: "bar",
              barWidth: "60%",
              data: sysp.reverse(),
              label: {
                normal: {
                  show: true,
                  position: "right",
                  color: "#25B3FE",
                  formatter: val => {
                    if (val.value > 0) {
                      return String(val.value).slice(0, 4) + "%";
                    } else {
                      return "";
                    }
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#1056EE" },
                    { offset: 1, color: "#26B4FF" }
                  ])
                },
                emphasis: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#1056EE" },
                    { offset: 1, color: "#26B4FF" }
                  ])
                }
              }
            }
          ];
          let saveDataXaxis = [];
          let saveDataData = [];
          data.data.data[0].systemTop5_list.forEach(val => {
            saveDataXaxis.push(val.system);
            saveDataData.push(val.count);
          });
          this.saveData.yAxis.data = saveDataXaxis.reverse();
          this.saveData.series = [
            {
              name: "存储占比",
              type: "bar",
              barWidth: "60%",
              data: saveDataData.reverse(),
              label: {
                normal: {
                  show: true,
                  position: "right",
                  color: "#25B3FE"
                }
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#1056EE" },
                    { offset: 1, color: "#26B4FF" }
                  ])
                },
                emphasis: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#1056EE" },
                    { offset: 1, color: "#26B4FF" }
                  ])
                }
              }
            }
          ];
        } else {
          this.loading1 = false;
          this.top5Data.series = [];
          this.top5DataText = 0;
          this.top5TableList = [];
          this.singleLogData.series = [];
          this.saveData.series = [];
        }
      });
    },
    middleOne() {
      this.loading2 = true;
      Service.get(`esStatistics/statisticsMemory.do`).then(data => {
        if (data.data.code == "000000") {
          this.loading2 = false;
          this.allSysCount = data.data.data[0].documentCount;
          this.allSysList = data.data.data[0].documents;
          this.saveDataPieText = data.data.data[0].percent;
          this.availableMemory = data.data.data[0].availableMemory;
          this.totalMemory = data.data.data[0].totalMemory;
          this.documentMemory = data.data.data[0].documentMemory;
          this.saveDataPie.series = [
            {
              name: "存储数据条数",
              type: "pie",
              radius: ["60%", "80%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: data.data.data[0].percent.split("%")[0],
                  name: "已存储占比"
                },
                {
                  value: 100 - data.data.data[0].percent.split("%")[0],
                  name: "剩余存储占比"
                }
              ]
            }
          ];
        } else {
          this.loading2 = false;
          this.allSysCount = 0;
          this.saveDataPieText = 0;
          this.availableMemory = 0;
          this.totalMemory = 0;
          this.saveDataPie.series = [];
        }
      });
    },
    middleTwo() {
      this.loading3 = true;
      Service.get(`esStatistics/statistics5Days.do`).then(data => {
        if (data.data.code == "000000") {
          this.loading3 = false;
          let xAxis = [];
          let dataTody = [];
          let dataLast = [];
          data.data.data[0].today.forEach(val => {
            xAxis.push(val.hour);
            dataTody.push(val.count);
          });
          data.data.data[0].last5days.forEach(val => {
            dataLast.push(val.count);
          });
          this.allSystemData.xAxis.data = xAxis;
          this.allSystemData.series = [
            {
              name: "今日传输量",
              type: "line",
              data: dataTody,
              itemStyle: {
                normal: {
                  color: "#9966CC",
                  opacity: 0
                }
              },
              lineStyle: {
                width: 4
              }
            },
            {
              name: "过去5日传输量平均值",
              type: "line",
              data: dataLast,
              itemStyle: {
                normal: {
                  color: "#628EF2",
                  opacity: 0
                }
              },
              lineStyle: {
                color: "rgba(0,0,0,0)"
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#6D93FF" },
                  { offset: 0.7, color: "#2CB5F5" },
                  { offset: 1, color: "#2CB5F5" }
                ])
              }
            }
          ];
        } else {
          this.loading3 = false;
          this.allSystemData.series = [];
        }
      });
    },
    middleThree() {
      this.loading4 = true;
      Service.get(`esStatistics/statisticsWeek.do`).then(data => {
        if (data.data.code == "000000") {
          this.loading4 = false;
          this.weekData.series = [
            {
              name: "上周",
              type: "bar",
              data: data.data.data[0].lastWeek,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#26B4FF" },
                    { offset: 1, color: "#1056EE" }
                  ])
                }
              }
            },
            {
              name: "这周",
              type: "bar",
              data: data.data.data[0].thisWeek,
              itemStyle: {
                normal: {
                  color: "#6A30FF"
                }
              }
            }
          ];
        } else {
          this.loading4 = false;
          this.weekData.series = [];
        }
      });
    },
    rightOne() {
      this.loading5 = true;
      Service.get(`esStatistics/statisticsT_Y_YC.do`).then(data => {
        if (data.data.code == "000000") {
          this.loading5 = false;
          this.dataAndCount = [
            {
              index: "数据条数",
              today: data.data.data[0].T_totalCount,
              yestoday: data.data.data[0].Y_totalCount,
              yestodaySofar: data.data.data[0].YC_totalCount
            },
            {
              index: "占比",
              today: data.data.data[0].T_Tprecent,
              yestoday: data.data.data[0].T_Yprecent,
              yestodaySofar: data.data.data[0].T_YCprecent
            }
          ];
        } else {
          this.loading5 = false;
          this.dataAndCount = [];
        }
      });
    },
    rightRest() {
      this.loading6 = true;
      Service.get(
        `esStatistics/statisticsTopOrBot.do?topType=bottom3`
      ).then(data => {
        if (data.data.code == "000000") {
          this.loading6 = false;
          this.lastTop3Text = data.data.data[0].system_unitTop5Percent;
          this.lastTop3Data.series = [
            {
              name: "",
              type: "pie",
              radius: ["60%", "80%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: data.data.data[0].system_unitTop5Percent.split("%")[0],
                  name: "TOP后3 占总传输量比率"
                },
                {
                  value:
                    100 -
                    data.data.data[0].system_unitTop5Percent.split("%")[0],
                  name: "其它 占总传输量比率"
                }
              ]
            }
          ];

          let syss = [];
          let arr = [];
          let sysp = [];
          data.data.data[0].system_unitTop5List.forEach((val, i) => {
            arr.push({
              index: i + 1,
              systemName: val.system,
              componentName: val.unit,
              logCount: val.count
            });
            syss.push(val.system);
            sysp.push(val.percent.split("%")[0]);
          });
          this.lastTop3TableList = arr;

          this.lastTop3singleLogData.yAxis.data = syss.reverse();
          this.lastTop3singleLogData.series = [
            {
              name: "单独日志占比",
              type: "bar",
              barWidth: "60%",
              data: sysp.reverse(),
              label: {
                normal: {
                  show: true,
                  position: "right",
                  color: "#25B3FE",
                  formatter: val => {
                    if (val.value > 0) {
                      return String(val.value).slice(0, 4) + "%";
                    } else {
                      return "";
                    }
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#1056EE" },
                    { offset: 1, color: "#26B4FF" }
                  ])
                },
                emphasis: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#1056EE" },
                    { offset: 1, color: "#26B4FF" }
                  ])
                }
              }
            }
          ];
          let saveDataXaxis = [];
          let saveDataData = [];
          data.data.data[0].systemTop5_list.forEach(val => {
            saveDataXaxis.push(val.system);
            saveDataData.push(val.count);
          });
          this.lastTop3saveData.yAxis.data = saveDataXaxis.reverse();
          this.lastTop3saveData.series = [
            {
              name: "存储占比",
              type: "bar",
              barWidth: "60%",
              data: saveDataData.reverse(),
              label: {
                normal: {
                  show: true,
                  position: "right",
                  color: "#25B3FE"
                }
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#1056EE" },
                    { offset: 1, color: "#26B4FF" }
                  ])
                },
                emphasis: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#1056EE" },
                    { offset: 1, color: "#26B4FF" }
                  ])
                }
              }
            }
          ];
        } else {
          this.loading6 = false;
          this.lastTop3Text = 0;
          this.lastTop3Data.series = [];
          this.lastTop3TableList = [];
          this.lastTop3singleLogData.series = [];
          this.lastTop3saveData.series = [];
        }
      });
    }
  },
  created() {
    this.left();
    this.rightRest();
    this.middleOne();
    this.middleTwo();
    this.rightOne();
    this.middleThree();

    setInterval(() => {
      this.dateTime = this.formatDateTime();
    }, 1000);
    setInterval(() => {
      this.left();
      this.rightRest();
    }, 10 * 60 * 1000);
    setInterval(() => {
      this.middleOne();
      this.middleTwo();
      this.rightOne();
    }, 30 * 60 * 1000);
    setInterval(() => {
      this.middleThree();
    }, 24 * 60 * 60 * 1000);
  }
};
</script>
<style lang="css">
.gutter {
  padding-bottom: 20px;
}
.main {
  background-color: #052362;
  padding: 0 40px;
}
.first-line {
  line-height: 100px;
  margin-bottom: 20px;
}
.logo {
  font-size: 24px;
  color: #3b76fb;
  text-align: left;
}
.logo > img {
  width: 58px;
  vertical-align: middle;
}
.title {
  font-size: 48px;
  color: #3b76fb;
  text-align: center;
}
.time {
  font-size: 24px;
  color: #3b76fb;
  text-align: right;
}
.el-table {
  background-color: transparent !important;
  box-shadow: 0 0 10px 1px #1159fb;
  padding: 5px;
}
.el-table td,
.el-table th.is-leaf {
  border: none !important;
  padding: 3px 0 !important;
}
.el-table--border th {
  border: none;
}
.el-table .el-table__body-wrapper .el-table__body .el-table__row:hover td {
  background-color: transparent !important;
}
.el-table::before {
  background: transparent !important;
}
.split {
  border: 2px solid !important;
  border-image: linear-gradient(to right, #103582, #26b5ff, #103582) 2 !important;
  padding: 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
}
</style>


