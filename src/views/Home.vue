<template>
  <div class="home">
    <!-- 头部开始 -->
    <header>
      <div class="imgBox i1">
        <img src="~@/assets/home/logo-haitong.png" alt>
      </div>
      <div class="imgBox i2">
        <img src="~@/assets/home/logoFont.png" alt>
      </div>
      <div class="imgBox i3">账户中心应用监控</div>
      <div class="imgBox i5">
        <img src="~@/assets/home/icon-time.png" alt @click="dBoxClick">
      </div>
      <div class="imgBox i4">
        <div
          class="dBox"
          @click="dBoxClick"
          v-if="tBoxShow"
        >{{nowDate | moment('YYYY-MM-DD HH:mm:ss ')}}</div>
        <el-date-picker
          v-model="dateValue"
          type="datetimerange"
          range-separator="~"
          ref="myPicker"
          @change="pickerChange"
          v-else
        ></el-date-picker>
      </div>
    </header>
    <!-- 头部结束 -->
    <!-- 主体开始 -->
    <main class="clearfix">
      <div class="leftBox">
        <div class="m1">
          <h2 class="titleBox">功能号响应最慢Top10</h2>
          <div
            class="chartBox"
            v-loading="loading1"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.1)"
          >
            <ECharts :options="option1" auto-resize/>
          </div>
        </div>
        <div class="m1">
          <h2 class="titleBox">功能号响应次数Top10</h2>
          <div
            class="chartBox"
            v-loading="loading2"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.1)"
          >
            <ECharts :options="option2" auto-resize/>
          </div>
        </div>
        <div class="m1">
          <h2 class="titleBox">服务器应用负载Top10</h2>
          <div
            class="chartBox"
            v-loading="loading3"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.1)"
          >
            <ECharts :options="option3" auto-resize/>
          </div>
        </div>
      </div>
      <div class="centerBox">
        <div class="m2">
          <h3>业务量统计</h3>
          <ul class="clearfix">
            <li
              v-for="(item,index) in system"
              @click="systemClick(index)"
              :key="index"
              :class="index===activeKey?'active':''"
            >
              <div>{{item}}</div>
            </li>
          </ul>
        </div>
        <div class="m3">
          <div class="clearfix">
            <dl class="tBox">
              <dt>{{system[activeKey]}}经纪业务合计(人)</dt>
              <dd>今日: {{(pieData[activeKey][0].openAccount+pieData[activeKey][0].change+pieData[activeKey][0].cancellation)}}</dd>
              <dd>本周: {{(pieData[activeKey][1].openAccount+pieData[activeKey][1].change+pieData[activeKey][1].cancellation)}}</dd>
              <dd>本月: {{(pieData[activeKey][2].openAccount+pieData[activeKey][2].change+pieData[activeKey][2].cancellation)}}</dd>
            </dl>
            <ul class="dateBtn" v-if="dmyFlag">
              <li
                v-for="(item,index) in dateBtn"
                @click="dateBtnClick(index)"
                :class="index===activeKey1?'active':''"
                :key="index"
              >{{item}}</li>
            </ul>
          </div>
          <div
            class="chartBox"
            v-loading="loading4"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.1)"
          >
            <ECharts :options="option4" auto-resize/>
          </div>
        </div>
      </div>
      <div class="rightBox">
        <div class="m1">
          <h2 class="titleBox">在线用户数</h2>
          <div
            class="chartBox"
            v-loading="loading5"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.1)"
          >
            <ECharts :options="option5" auto-resize/>
          </div>
        </div>
        <div class="m4">
          <h2 class="titleBox">返回状态异常</h2>
          <div
            class="mBox clearfix"
            v-loading="loading6"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.0001)"
          >
            <ul class="lBox clearfix">
              <li
                @click="stateClick(item)"
                v-for="(item,index) in stateData.slice(0,16)"
                :key="index"
              >
                <time>{{item.time | moment('YYYY-MM-DD HH:mm:ss')}}</time>
                <span>{{stringHandle(item.message)}}</span>
              </li>
            </ul>
            <!-- <ul class="rBox">
              <li
                @click="stateClick(item.message)"
                v-for="(item,index) in stateData.slice(0,16)"
                :key="index"
              >{{item.time}}</li>
            </ul>-->
          </div>
        </div>
      </div>
    </main>
    <el-dialog title="返回状态异常信息详情" :visible.sync="dialogVisible" :width="dialogWidth+'px'">
      <ul class="timeBox clearfix">
        <li>告警时间：{{stateDetail.time | moment('YYYY-MM-DD HH:mm:ss')}}</li>
        <li>告警标题：{{stateDetail.title}}</li>
        <li>告警级别：{{stateDetail.severity}}</li>
        <li>告警类型：{{stateDetail.status}}</li>
      </ul>
      <div>{{stateDetail.message}}</div>
    </el-dialog>
    <!-- 主体结束 -->
  </div>
</template>

<script>
import ECharts from "vue-echarts/components/ECharts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/chart/line";
import { httpGet } from "@/server/api";
// import { requestData } from "@/js/requestData.js";
import "@/js/test.js";
import moment from "moment";
export default {
  name: "home",
  data() {
    var baseMultiple = 1;
    return {
      dialogWidth: 1016 * baseMultiple,
      startDate: new Date(moment().format("YYYY/MM/DD")),
      endDate: new Date(),
      nowDate: new Date(), //当前时间
      tBoxShow: true, //是否显示当前时间
      dateValue: [new Date(moment().format("YYYY/MM/DD")), new Date()], //时间段
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      loading6: false,
      timerByMy: null, //定时器
      timer1: null, //定时器
      timer2: null, //定时器
      timer3: null, //定时器
      timer4: null, //定时器
      dialogVisible: false, //弹出是否显示
      dmyFlag:true,//显示 日 月 周
      timeBtnFlag:true,//点击时间选择器后是否点击了确认或者清除按钮
      pieData: [
        [
          //普通
          {//日
            openAccount: 0, //开户
            change: 0, //变更
            cancellation: 0 //销户
          },
          {//周
            openAccount: 0,
            change: 0,
            cancellation: 0
          },
          {//月
            openAccount: 0,
            change: 0,
            cancellation: 0
          },
          {//自定义时间
            openAccount: 0,
            change: 0,
            cancellation: 0
          }
        ],
        [
          //信用
          {
            openAccount: 0,
            change: 0,
            cancellation: 0
          },
          {
            openAccount: 0,
            change: 0,
            cancellation: 0
          },
          {
            openAccount: 0,
            change: 0,
            cancellation: 0
          },
          {//自定义时间
            openAccount: 0,
            change: 0,
            cancellation: 0
          }
        ],
        [
          //期权
          {
            openAccount: 0,
            change: 0,
            cancellation: 0
          },
          {
            openAccount: 0,
            change: 0,
            cancellation: 0
          },
          {
            openAccount: 0,
            change: 0,
            cancellation: 0
          },
          {//自定义时间
            openAccount: 0,
            change: 0,
            cancellation: 0
          }
        ],
        [
          //贵金属
          {
            openAccount: 0,
            change: 0,
            cancellation: 0
          },
          {
            openAccount: 0,
            change: 0,
            cancellation: 0
          },
          {
            openAccount: 0,
            change: 0,
            cancellation: 0
          },
          {//自定义时间
            openAccount: 0,
            change: 0,
            cancellation: 0
          }
        ]
      ],
      system: ["普通", "信用", "期权", "贵金属"], //系统名
      dateBtn: ["天", "周", "月"], //时间切换按钮
      activeKey: 0, //系统切换key
      activeKey1: 0, //时间切换按钮key
      stateData: [], //返回状态异常数据
      stateDetail: {}, //返回状态异常详情数据
      option1: {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: params => {
            console.log(params[0]);
            let v = this.timeFormat(params[0].value);
            return `${params[0].name}<br/>${params[0].seriesName}:${v}`;
          }
        },
        legend: {
          data: [
            {
              name: "响应时间",
              textStyle: {
                color: "#36C6FF",
                fontSize: 12 * baseMultiple
              }
            }
          ],
          itemWidth: 12 * baseMultiple,
          itemHeight: 12 * baseMultiple,
          top: "4%",
          right: "3%",
          align: "left"
        },
        grid: {
          left: "5%",
          right: "2%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              rotate: 45,
              textStyle: {
                color: "#36C6FF",
                fontSize: 12 * baseMultiple
              },
              formatter: value => {
                return value.slice(-15); //截取后15位字符。防止字符过长
              }
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: "value",

            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              rotate: 0,
              textStyle: {
                color: "#36C6FF",
                fontSize: 12 * baseMultiple
              },
              formatter: value => {
                if (value < 1000) {
                  return value + "ms";
                } else if (value >= 1000 && value < 60000) {
                  return this.toFixed(value / 1000, 2) + "s";
                } else if (value >= 60000 && value < 3600000) {
                  return this.toFixed(value / 60000, 2) + "min";
                } else if (value >= 3600000) {
                  return this.toFixed(value / 3600000, 2) + "h";
                }
              }
            }
          }
        ],
        series: [
          {
            name: "响应时间",
            type: "bar",
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
                    color: "#5E7CFF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#3046FF" // 100% 处的颜色
                  }
                ]
              }
            },
            barWidth: "60%",
            data: []
          }
        ]
      }, //功能号响应最慢Top10
      option2: {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: [
            {
              name: "访问次数",
              textStyle: {
                color: "#36C6FF",
                fontSize: 12 * baseMultiple
              }
            }
          ],
          itemWidth: 12 * baseMultiple,
          itemHeight: 12 * baseMultiple,
          top: "4%",
          right: "3%",
          align: "left"
        },
        grid: {
          left: "5%",
          right: "2%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              rotate: 45,
              textStyle: {
                color: "#36C6FF",
                fontSize: 12 * baseMultiple
              },
              formatter: value => {
                return value.slice(-15); //截取后15位字符。防止字符过长
              }
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              rotate: 0,
              textStyle: {
                color: "#36C6FF",
                fontSize: 12 * baseMultiple
              }
            }
          }
        ],
        series: [
          {
            name: "访问次数",
            type: "bar",
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
                    color: "#26D9FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#1086EE" // 100% 处的颜色
                  }
                ]
              }
            },
            barWidth: "60%",
            data: []
          }
        ]
      }, //功能号响应次数Top10
      option3: {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: [
            {
              name: "负载",
              textStyle: {
                color: "#36C6FF",
                fontSize: 12 * baseMultiple
              }
            }
          ],
          itemWidth: 12 * baseMultiple,
          itemHeight: 12 * baseMultiple,
          top: "4%",
          right: "3%",
          align: "left"
        },
        grid: {
          left: "5%",
          right: "2%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              rotate: 45,
              textStyle: {
                color: "#36C6FF",
                fontSize: 12 * baseMultiple
              }
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              rotate: 0,
              textStyle: {
                color: "#36C6FF",
                fontSize: 12 * baseMultiple
              }
            }
          }
        ],
        series: [
          {
            name: "负载",
            type: "bar",
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
                    color: "#AD89F9" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#8A31F3" // 100% 处的颜色
                  }
                ]
              }
            },
            barWidth: "60%",
            data: []
          }
        ]
      }, //服务器应用负载Top10
      option4: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "50%",
            center: ["50%", "50%"],
            data: [
              {
                value: 2771,
                name: "开户：2771人",
                itemStyle: { color: "#45ECFF" }
              },
              {
                value: 10162,
                name: "变更：10162人",
                itemStyle: { color: "#5D64F3" }
              },
              {
                value: 0,
                name: "销户：0人",
                itemStyle: { color: "#A17AFF" }
              }
            ],
            label: {
              fontSize: 14 * baseMultiple
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }, //普通经纪业务合计(人)
      option5: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: [
            {
              name: "在线用户数",
              textStyle: {
                color: "#36C6FF",
                fontSize: 12 * baseMultiple
              },
              borderColor: "#f00"
            }
          ],
          itemWidth: 54 * baseMultiple,
          itemHeight: 8 * baseMultiple,
          top: "4%",
          right: "3%",
          align: "left"
        },
        xAxis: {
          type: "category",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            rotate: 45,
            textStyle: {
              color: "#36C6FF",
              fontSize: 12 * baseMultiple
            }
          },
          data: []
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#2a3759",
              type: "dashed"
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            rotate: 0,
            textStyle: {
              color: "#36C6FF",
              fontSize: 12 * baseMultiple
            }
          }
        },
        series: [
          {
            name: "在线用户数",
            data: [],
            type: "line",
            itemStyle: {
              color: "#39F1FF",
              borderColor: "#39F1FF",
              borderWidth: 4
            },
            symbol: "circle",
            lineStyle: {
              color: "#39F1FF"
            }
          }
        ]
      } //在线用户数
    };
  },
  components: {
    ECharts
  },
  created() {
    // httpGet('user/login.do?username=admin&password=zorkdata&role=1')
    this.startTimer();
    this.getDataFn();
    this.getOption6();
    // this.getOption7();
    // console.log(moment().format('YYYY/MM/DD'));
  },
  beforeDestroy() {
    //组件销毁前停止定时器
    this.clearTimer();
  },
  methods: {
    toFixed(num, d) {
      num *= Math.pow(10, d);
      num = Math.round(num);
      return num / Math.pow(10, d);
    },
    //清除定时器
    clearTimer() {
      if (this.timer1) {
        clearInterval(this.timer1);
      }
      if (this.timer2) {
        clearInterval(this.timer2);
      }
      if (this.timer3) {
        clearInterval(this.timer3);
      }
      if (this.timer4) {
        clearInterval(this.timer4);
      }
      if(this.timerByMy){
        clearInterval(this.timerByMy)
      }
    },
    //开启循环获取系统时间,天、周、月循环切换。切换完毕后再进行系统切换
    startTimer() {
      this.clearTimer();
      this.timer1Run();
      this.timer2Run();
      this.timer3Run();
      this.timer4Run();
    },
    timer1Run() {
      this.timer1 = setInterval(() => {
        let activeKey1 = this.activeKey1;
        let activeKey = this.activeKey;
        activeKey1++;
        if (activeKey1 == 3) {
          this.activeKey1 = 0;
          activeKey++;
          if (activeKey == 4) {
            this.activeKey = 0;
          } else {
            this.activeKey = activeKey;
          }
        } else {
          this.activeKey1 = activeKey1;
        }
        this.pieDataChange();
        // this.dateBtnClick();
        // console.log(this.activeKey);
        // console.log(this.activeKey1);
      }, 5000);
    },
    // timerRunByMyTime(){
    //   this.activeKey1=0
    //   this.timerByMy = setInterval(()=>{
    //     let activeKey = this.activeKey
    //         activeKey++;
    //      if (activeKey == 4) {
    //         this.activeKey = 0;
    //       } else {
    //         this.activeKey = activeKey;
    //       }
    //       console.log('====',this.activeKey,this.activeKey1)
    //        this.pieDataChange();
    //   },15000)
    // },
    timer2Run() {
      this.timer2 = setInterval(() => {
        this.nowDate = new Date();
        this.endDate = new Date();
      }, 1000);
    },
    timer3Run() {
      this.timer3 = setInterval(() => {
        this.getDataFn();
      }, 1000 * 60 * 10);
    },
    timer4Run() {
      this.timer4 = setInterval(() => {
        this.getOption6();
      }, 1000 * 60);
    },
    //执行请求方法
    getDataFn() {
      this.getOption1();
      this.getOption2();
      this.getOption3();
      this.getOption4();
      this.getOption5();
      this.getOpenDataByBuenessAndTime()
    },
    timeFormat(value) {
      if (value < 1000) {
        return value + "ms";
      } else if (value >= 1000 && value < 60000) {
        return this.toFixed(value / 1000, 2) + "s";
      } else if (value >= 60000 && value < 3600000) {
        return this.toFixed(value / 60000, 2) + "min";
      } else if (value >= 3600000) {
        return this.toFixed(value / 3600000, 2) + "h";
      }
    },
    getOption1() {
      this.loading1 = true;
      httpGet("/esStatistics/statisticsRequestTime.do", {
        startTime: this.startDate.getTime(),
        endTime: this.endDate.getTime()
      })
        .then(response => {
          this.loading1 = false;
          if (response.code === "000000") {
            let arrY = [];
            let arrX = [];
            for (let index = 0; index < response.data.length; index++) {
              arrY.push(response.data[index].functionTime);
              let string = response.data[index].functionName;
              let i1 = string.lastIndexOf("/");
              let i2 = string.lastIndexOf(".action");
              arrX.push(string.slice(i1 + 1, i2));
            }
            this.option1.series[0].data = arrY;
            this.option1.xAxis[0].data = arrX;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getOption2() {
      this.loading2 = true;
      httpGet("/esStatistics/statisticsRequestCount.do", {
        startTime: this.startDate.getTime(),
        endTime: this.endDate.getTime()
      })
        .then(response => {
          this.loading2 = false;
          if (response.code === "000000") {
            let arrY = [];
            let arrX = [];
            for (let index = 0; index < response.data.length; index++) {
              arrY.push(response.data[index].functionCount);
              let string = response.data[index].functionName;
              let i1 = string.lastIndexOf("/");
              let i2 = string.lastIndexOf(".action");
              arrX.push(string.slice(i1 + 1, i2));
            }
            this.option2.series[0].data = arrY;
            this.option2.xAxis[0].data = arrX;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getOption3() {
      this.loading3 = true;
      httpGet("/esStatistics/statisticsLoadCount.do", {
        startTime: this.startDate.getTime(),
        endTime: this.endDate.getTime()
      })
        .then(response => {
          this.loading3 = false;
          if (response.code === "000000") {
            let arrY = [];
            let arrX = [];
            for (let index = 0; index < response.data.length; index++) {
              arrY.push(response.data[index].IpCount);
              let string = response.data[index].IpName;
              arrX.push(string);
            }
            this.option3.series[0].data = arrY;
            this.option3.xAxis[0].data = arrX;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getOption4() {
      // const {
      //   metric,
      //   tagFilterJson,
      //   aggregateType,
      //   interval,
      //   samplingAggregate
      // } = window.requestData.Business_statistics;
      // let rData = {
      //   metric,
      //   tagFilterJson: encodeURIComponent(JSON.stringify(tagFilterJson)),
      //   aggregateType,
      //   interval,
      //   samplingAggregate,
      //   startTime: this.startDate.getTime(),
      //   endTime: this.endDate.getTime()
      // };
      // httpGet("/metric/getMetricHistory.do?" + qs.stringify(rData))
     
    },
    //求和
    getSumValue(value) {
        if (JSON.stringify(value) != '{}') {
            let sum= 0
            for (let key in value) {
                if (value[key] == "NaN")
                    value[key] = 0
                sum = sum + Number(value[key])
            }
            return parseInt(String(sum))
        } else {
            return 0
        }
    },
    //取5分钟内最大值  取整
    getIntValue(value) {
        if (JSON.stringify(value) != '{}') {
            let arr = []
            for (let key in value) {
                if (value[key] == "NaN")
                    value[key] = 0
                arr.push(value[key])
            }
            return Math.ceil(Math.max.apply(null, arr))
        } else {
            return 0
        }
    },
    getOpenDataByBuenessAndTime(){
       //普通---日--开户
      let normal_open_account = window.requestData.normal_open_account
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(normal_open_account,'today'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[0][0]['openAccount'] = 0
           }else{
                 this.pieData[0][0]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //普通---周--开户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(normal_open_account,'week'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[0][1]['openAccount'] = 0
           }else{
                 this.pieData[0][1]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
        })
        .catch(error => {
          console.log(error);
        });
        //普通---月--开户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(normal_open_account,'month'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[0][2]['openAccount'] = 0
           }else{
                 this.pieData[0][2]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //普通---日--销户
      let normal_close_account = window.requestData.normal_close_account
       httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(normal_close_account,'today'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[0][0]['cancellation'] = 0
           }else{
                 this.pieData[0][0]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //普通---周--销户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(normal_close_account,'week'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[0][1]['cancellation'] = 0
           }else{
                 this.pieData[0][1]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
        })
        .catch(error => {
          console.log(error);
        });
        //普通---月--销户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(normal_close_account,'month'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[0][2]['cancellation'] = 0
           }else{
                 this.pieData[0][2]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });

          //普通---日--变更
      let normal_change_account = window.requestData.normal_change_account
       httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(normal_change_account,'today'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[0][0]['change'] = 0
           }else{
                 this.pieData[0][0]['change'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //普通---周--变更
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(normal_change_account,'week'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[0][1]['change'] = 0
           }else{
                 this.pieData[0][1]['change'] = this.getSumValue(data[0][0]['dps'])
           }
        })
        .catch(error => {
          console.log(error);
        });
        //普通---月--变更
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(normal_change_account,'month'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[0][2]['change'] = 0
           }else{
                 this.pieData[0][2]['change'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });


        //--------------------------信用---------------------------------------------
       //信用---日--开户
      let credit_open_account = window.requestData.credit_open_account
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(credit_open_account,'today'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[1][0]['openAccount'] = 0
           }else{
                 this.pieData[1][0]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //信用---周--开户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(credit_open_account,'week'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[1][1]['openAccount'] = 0
           }else{
                 this.pieData[1][1]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
        })
        .catch(error => {
          console.log(error);
        });
        //信用---月--开户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(credit_open_account,'month'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[1][2]['openAccount'] = 0
           }else{
                 this.pieData[1][2]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //信用---日--销户
      let credit_close_account = window.requestData.credit_close_account
       httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(credit_close_account,'today'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[1][0]['cancellation'] = 0
           }else{
                 this.pieData[1][0]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //信用---周--销户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(credit_close_account,'week'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[1][1]['cancellation'] = 0
           }else{
                 this.pieData[1][1]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
        })
        .catch(error => {
          console.log(error);
        });
        //信用---月--销户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(credit_close_account,'month'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[1][2]['cancellation'] = 0
           }else{
                 this.pieData[1][2]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });

          //信用---日--变更
      let credit_change_account = window.requestData.credit_change_account
       httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(credit_change_account,'today'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[1][0]['change'] = 0
           }else{
                 this.pieData[1][0]['change'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //信用---周--变更
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(credit_change_account,'week'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[1][1]['change'] = 0
           }else{
                 this.pieData[1][1]['change'] = this.getSumValue(data[0][0]['dps'])
           }
        })
        .catch(error => {
          console.log(error);
        });
        //信用---月--变更
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(credit_change_account,'month'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[1][2]['change'] = 0
           }else{
                 this.pieData[1][2]['change'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });

        //--------------------------期权-----------------------------
        //期权---日--开户
      let option_open_account = window.requestData.option_open_account
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(option_open_account,'today'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[2][0]['openAccount'] = 0
           }else{
                 this.pieData[2][0]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //期权---周--开户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(option_open_account,'week'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[2][1]['openAccount'] = 0
           }else{
                 this.pieData[2][1]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
        })
        .catch(error => {
          console.log(error);
        });
        //期权---月--开户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(option_open_account,'month'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[2][2]['openAccount'] = 0
           }else{
                 this.pieData[2][2]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //期权---日--销户
      let option_close_account = window.requestData.option_close_account
       httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(option_close_account,'today'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[2][0]['cancellation'] = 0
           }else{
                 this.pieData[2][0]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //期权---周--销户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(option_close_account,'week'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[2][1]['cancellation'] = 0
           }else{
                 this.pieData[2][1]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
        })
        .catch(error => {
          console.log(error);
        });
        //期权---月--销户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(option_close_account,'month'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[2][2]['cancellation'] = 0
           }else{
                 this.pieData[2][2]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });

          //期权---日--变更
      let option_change_account = window.requestData.option_change_account
       httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(option_change_account,'today'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[2][0]['change'] = 0
           }else{
                 this.pieData[2][0]['change'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //期权---周--变更
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(option_change_account,'week'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[2][1]['change'] = 0
           }else{
                 this.pieData[2][1]['change'] = this.getSumValue(data[0][0]['dps'])
           }
        })
        .catch(error => {
          console.log(error);
        });
        //期权---月--变更
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(option_change_account,'month'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[2][2]['change'] = 0
           }else{
                 this.pieData[2][2]['change'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
      
      //--------------------------------贵金属-----------------------------------------

      //贵金属---日--开户
      let metal_open_account = window.requestData.metal_open_account
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(metal_open_account,'today'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[3][0]['openAccount'] = 0
           }else{
                 this.pieData[3][0]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //贵金属---周--开户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(metal_open_account,'week'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[3][1]['openAccount'] = 0
           }else{
                 this.pieData[3][1]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
        })
        .catch(error => {
          console.log(error);
        });
        //贵金属---月--开户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(metal_open_account,'month'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[3][2]['openAccount'] = 0
           }else{
                 this.pieData[3][2]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //贵金属---日--销户
      let metal_close_account = window.requestData.metal_close_account
       httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(metal_close_account,'today'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[3][0]['cancellation'] = 0
           }else{
                 this.pieData[3][0]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //贵金属---周--销户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(metal_close_account,'week'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[3][1]['cancellation'] = 0
           }else{
                 this.pieData[3][1]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
        })
        .catch(error => {
          console.log(error);
        });
        //贵金属---月--销户
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(metal_close_account,'month'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[3][2]['cancellation'] = 0
           }else{
                 this.pieData[3][2]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });

          //贵金属---日--变更
      let metal_change_account = window.requestData.metal_change_account
       httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(metal_change_account,'today'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[3][0]['change'] = 0
           }else{
                 this.pieData[3][0]['change'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //贵金属---周--变更
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(metal_change_account,'week'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[3][1]['change'] = 0
           }else{
                 this.pieData[3][1]['change'] = this.getSumValue(data[0][0]['dps'])
           }
        })
        .catch(error => {
          console.log(error);
        });
        //贵金属---月--变更
      httpGet("/metric/getMetricHistory.do?" + this.formatRateUrl(metal_change_account,'month'))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[3][2]['change'] = 0
           }else{
                 this.pieData[3][2]['change'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
      
    },
    getOpenDataByBusnessForMySelf(){
      console.log('jinlaile')
       //普通--开户
      let normal_open_account = window.requestData.normal_open_account
      httpGet("/metric/getMetricHistory.do?" + this.formatUrlByTime(normal_open_account))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[0][3]['openAccount'] = 0
           }else{
                 this.pieData[0][3]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
       
        //普通--销户
      let normal_close_account = window.requestData.normal_close_account
       httpGet("/metric/getMetricHistory.do?" + this.formatUrlByTime(normal_close_account))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[0][3]['cancellation'] = 0
           }else{
                 this.pieData[0][3]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });

          //普通---变更
      let normal_change_account = window.requestData.normal_change_account
       httpGet("/metric/getMetricHistory.do?" + this.formatUrlByTime(normal_change_account))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[0][3]['change'] = 0
           }else{
                 this.pieData[0][3]['change'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        //--------------------------信用---------------------------------------------
       //信用---日--开户
      let credit_open_account = window.requestData.credit_open_account
      httpGet("/metric/getMetricHistory.do?" + this.formatUrlByTime(credit_open_account))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[1][3]['openAccount'] = 0
           }else{
                 this.pieData[1][3]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
       
        //信用---日--销户
      let credit_close_account = window.requestData.credit_close_account
       httpGet("/metric/getMetricHistory.do?" + this.formatUrlByTime(credit_close_account))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[1][3]['cancellation'] = 0
           }else{
                 this.pieData[1][3]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
       
          //信用---日--变更
      let credit_change_account = window.requestData.credit_change_account
       httpGet("/metric/getMetricHistory.do?" + this.formatUrlByTime(credit_change_account))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[1][3]['change'] = 0
           }else{
                 this.pieData[1][3]['change'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
      
        //--------------------------期权-----------------------------
        //期权---日--开户
      let option_open_account = window.requestData.option_open_account
      httpGet("/metric/getMetricHistory.do?" + this.formatUrlByTime(option_open_account))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[2][3]['openAccount'] = 0
           }else{
                 this.pieData[2][3]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
       
        //期权---日--销户
      let option_close_account = window.requestData.option_close_account
       httpGet("/metric/getMetricHistory.do?" + this.formatUrlByTime(option_close_account))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[2][3]['cancellation'] = 0
           }else{
                 this.pieData[2][3]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
      
          //期权---日--变更
      let option_change_account = window.requestData.option_change_account
       httpGet("/metric/getMetricHistory.do?" + this.formatUrlByTime(option_change_account))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[2][3]['change'] = 0
           }else{
                 this.pieData[2][3]['change'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
       
      //--------------------------------贵金属-----------------------------------------

      //贵金属---日--开户
      let metal_open_account = window.requestData.metal_open_account
      httpGet("/metric/getMetricHistory.do?" + this.formatUrlByTime(metal_open_account))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[3][3]['openAccount'] = 0
           }else{
                 this.pieData[3][3]['openAccount'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
       
        //贵金属---日--销户
      let metal_close_account = window.requestData.metal_close_account
       httpGet("/metric/getMetricHistory.do?" + this.formatUrlByTime(metal_close_account))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[3][3]['cancellation'] = 0
           }else{
                 this.pieData[3][3]['cancellation'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
          //贵金属---日--变更
      let metal_change_account = window.requestData.metal_change_account
       httpGet("/metric/getMetricHistory.do?" + this.formatUrlByTime(metal_change_account))
        .then(data => {
           if (data[0] == null || data[0][0] == null) {
                 this.pieData[3][3]['change'] = 0
           }else{
                 this.pieData[3][3]['change'] = this.getSumValue(data[0][0]['dps'])
           }
          
        })
        .catch(error => {
          console.log(error);
        });
        console.log(this.pieData)
    },
    //系统默认时间url拼接
    formatRateUrl(data,type) {
        if (!data) {
            return
        }
        let now = new Date()
        let endTime = now.getTime() 
        let startTime = ''
        if(type=='today'){
          startTime = Date.parse(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " 00:00:00") - 60*60*24*1000
          endTime = endTime - 60*60*24*1000
        }else if(type=='month'){
          startTime = Date.parse(now.getFullYear() + "-" + (now.getMonth() + 1) + "-01" + " 00:00:00")
        }else{
          startTime = Date.parse(this.getTime(0))
        }
        this.startTime = startTime
        this.endTime = endTime
        // console.log(this.startTime,this.endTime)
        return "metric=" + data.metric + "&tagFilterJson=" + encodeURIComponent(JSON.stringify(data.tagFilterJson)) + "&interval=" + data.interval + "&samplingAggregate=" + data.samplingAggregate + "&aggregateType=" + data.aggregateType + "&startTime="
            + startTime + "&endTime=" + endTime
    },
    //用户自主设置时间url拼接
    formatUrlByTime(data) {
        if (!data) {
            return
        }
         if (!this.dateValue || this.dateValue.length === 0) {
           return;
         }
        let now = new Date()
        let todayStart = Date.parse(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " 00:00:00")
        let todayEnd = Date.parse(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " 23:59:59")
        let startTime = Date.parse(this.dateValue[0])
        let endTime = Date.parse(this.dateValue[1])
        if(startTime>=todayStart&&endTime<=todayEnd){
              startTime = startTime - 60*60*24*1000
              endTime = endTime - 60*60*24*1000
        }
        this.startTime = startTime
        this.endTime = endTime
        // console.log(this.startTime,this.endTime)
        return "metric=" + data.metric + "&tagFilterJson=" + encodeURIComponent(JSON.stringify(data.tagFilterJson)) + "&interval=" + data.interval + "&samplingAggregate=" + data.samplingAggregate + "&aggregateType=" + data.aggregateType + "&startTime="
            + startTime + "&endTime=" + endTime
    },
    //获取本周起始时间
    getTime(n){
				var now=new Date();
				var year=now.getFullYear();
				//因为月份是从0开始的,所以获取这个月的月份数要加1才行
				var month=now.getMonth()+1;	
				var date=now.getDate();
				var day=now.getDay();
				//判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
				if(day!==0){
					n=n+(day-1);
				}
				else{
					n=n+day;
				}
				if(day){
					//这个判断是为了解决跨年的问题
					if(month>1){
            let a = month
						month = a;
					}
					//这个判断是为了解决跨年的问题,月份是从0开始的
					else{
						year=year-1;
						month=12;
					}
				}
				now.setDate(now.getDate()-n);				
				year=now.getFullYear();
				month=now.getMonth()+1;
				date=now.getDate();
				var s=year+"/"+(month<10?('0'+month):month)+"/"+(date<10?('0'+date):date)+" 00:00:00";
				return s;
			},
    getOption7() {
     
    },
    getOption5() {
      this.loading5 = true;
      httpGet("/esStatistics/statisticsOnline.do", {
        startTime: this.startDate.getTime(),
        endTime: this.endDate.getTime()
      })
        .then(response => {
          this.loading5 = false;
          if (response.code === "000000") {
            let arrY = [];
            let arrX = [];
            for (let index = 0; index < response.data.length; index++) {
              arrY.push(response.data[index].clientCount);
              let string = moment(response.data[index].time).format(
                "MM/DD HH:mm:ss"
              );
              arrX.push(string);
            }
            this.option5.series[0].data = arrY;
            this.option5.xAxis.data = arrX;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getOption6() {
      this.loading6 = true;
      httpGet("/esStatistics/statisticsAlarm.do", {
        startTime: this.startDate.getTime(),
        endTime: this.endDate.getTime()
      })
        .then(response => {
          this.loading6 = false;
          if (response.code === "000000") {
            this.stateData = response.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //返回状态异常数据截取处理
    stringHandle(value) {
      let reg1 = /-\[\S+\]\S*$/i;
      let reg2 = /.*(org.*)$/i;
      let reg3 = /[error][\s\S]+/i;
      if (reg1.test(value)) {
        return value.match(reg1)[0].slice(1);
      } else if (reg2.test(value)) {
        let arr = value.match(reg2);
        return arr[arr.length - 1];
      } else if (reg3.test(value)) {
        return value.match(reg3)[0];
      } else {
        return value;
      }
    },
    //饼形图数据切换
    pieDataChange() {
      if(!this.dmyFlag){
        this.activeKey1 = 3
      }
      console.log(this.pieData)
      let data = this.pieData[this.activeKey][this.activeKey1];
      const { openAccount, change, cancellation } = data;
      this.option4.series[0].data = [
        {
          value: openAccount,
          name: "开户：" + openAccount + "人",
          itemStyle: { color: "#45ECFF" }
        },
        {
          value: change,
          name: "变更：" + change + "人",
          itemStyle: { color: "#5D64F3" }
        },
        {
          value: cancellation,
          name: "销户：" + cancellation + "人",
          itemStyle: { color: "#A17AFF" }
        }
      ];
    },
    //日周月切换
    dateBtnClick(index) {
      if (this.timer1) {
        clearInterval(this.timer1);
      }
      this.activeKey1 = index;
      this.pieDataChange();
      this.timer1Run();
    },
    //系统切换
    systemClick(index) {
      if (this.timer1) {
        clearInterval(this.timer1);
      }
      this.activeKey = index;
      this.pieDataChange();
      if(this.dmyFlag)this.timer1Run();
    },
    //时间change
    pickerChange() {
      this.formatUrlByTime('{}')
      this.timeBtnFlag = false //对时间控件进行了操作
      if (!this.dateValue || this.dateValue.length === 0) {
        // console.log('清除自选的时间')
        this.timer1Run()
        if(this.timerByMy){
        clearInterval(this.timerByMy)
        }
        this.dmyFlag = true
        this.tBoxShow = true;
        this.startDate = new Date(moment().format("YYYY/MM/DD"));
        this.endDate = new Date();
        this.startTimer();
        this.getDataFn();
        this.getOption6();
      } else {
        //时间段选中
        // console.log('时间段选中')
        this.startDate = new Date(
          moment(this.dateValue[0]).format("YYYY/MM/DD HH:mm:ss")
        );
        this.endDate = new Date(
          moment(this.dateValue[1]).format("YYYY/MM/DD HH:mm:ss")
        );
        this.clearTimer();
        this.getDataFn();
        this.getOption6();
        this.getOpenDataByBusnessForMySelf()
        this.timerByMy = setInterval(()=>{
            this.getOpenDataByBusnessForMySelf()
        }, 1000 * 60 * 10)
      }
    },
    //时间选择唤醒
    dBoxClick() {
      this.timeBtnFlag = true //唤醒了时间选择器
      // console.log('时间选择唤醒')
      clearInterval(this.timer1);
      // this.timerRunByMyTime()
      this.dmyFlag = false
      this.tBoxShow = false;
      this.dateValue = [new Date(moment().format("YYYY/MM/DD")), new Date()]; //86400000
      this.$nextTick(() => {
        this.$refs.myPicker.focus();
      });
    },
    //状态异常详情唤起
    stateClick(data) {
      this.stateDetail = data;
      this.dialogVisible = true;
    }
  }
};
</script>
<style scoped lang="less">
@baseMultiple: 1;
@messgaeWidth: ~" 100% - 170px ";
@timeWidth: 170px * @baseMultiple;
.home {
  height: 100%;
  .imgBox {
    position: relative;
    img {
      max-width: 100%;
      max-height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  header {
    height: 91px * @baseMultiple;
    line-height: 80px * @baseMultiple;
    padding-bottom: 11px * @baseMultiple;
    position: relative;
    .imgBox {
      float: left;
    }
    .i1 {
      width: 41px * @baseMultiple;
      height: 39px * @baseMultiple;
      margin-top: 20px * @baseMultiple;
      margin-left: 1.8%;
    }
    .i2 {
      width: 141px * @baseMultiple;
      height: 48px * @baseMultiple;
      margin-top: 15px * @baseMultiple;
      margin-left: 1.3%;
    }
    .i3 {
      height: 80px * @baseMultiple;
      line-height: 80px * @baseMultiple;
      font-size: 36px * @baseMultiple;
      color: #73eeff;
      letter-spacing: 4px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .i4 {
      width: 504px;
      height: 100%;
      font-size: 24px * @baseMultiple;
      color: #36c6ff;
      letter-spacing: 1px * @baseMultiple;
      margin-right: 0.5%;
      float: right;
      position: relative;
      .dBox {
        text-align: right;
      }
    }
    .i5 {
      width: 27px * @baseMultiple;
      height: 27px * @baseMultiple;
      float: right;
      margin-top: 25px * @baseMultiple;
      margin-right: 1.2%;
    }
  }
  main {
    padding-bottom: 21px * @baseMultiple;
    .leftBox {
      width: 28.5%;
      margin-left: 2.1%;
      float: left;
    }
    .centerBox {
      width: 34.6%;
      margin-left: 2%;
      float: left;
    }
    .rightBox {
      width: 28.5%;
      margin-right: 2.1%;
      float: right;
    }
    .titleBox {
      height: 43px * @baseMultiple;
      line-height: 48px * @baseMultiple;
      font-size: 18px * @baseMultiple;
      color: #36c6ff;
      text-align: left;
      padding-left: 25px * @baseMultiple;
      background-image: url("~@/assets/home/zst.png");
      background-repeat: no-repeat;
      background-size: 90% auto;
      background-position: center bottom;
    }
    .m1 {
      height: 300px * @baseMultiple;
      background-image: url("~@/assets/home/border-z.png");
      background-repeat: no-repeat;
      background-size: 99.9% 100%;
      margin-bottom: 32px * @baseMultiple;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .m2 {
      height: 295px * @baseMultiple;
      background-image: url("~@/assets/home/border-m.png");
      background-repeat: no-repeat;
      background-size: 99.9% 100%;
      margin-bottom: 33px * @baseMultiple;
      padding-top: 38px * @baseMultiple;
      h3 {
        height: 33px * @baseMultiple;
        line-height: 33px * @baseMultiple;
        text-align: center;
        font-size: 24px * @baseMultiple;
        color: #bdddff;
      }
      ul {
        padding: 38px * @baseMultiple 68px * @baseMultiple;
        li {
          width: 18.1474%;
          padding-top: 18.1474%;
          border-radius: 50%;
          -ms-border-radius: 50%;
          background-image: linear-gradient(-180deg, #4573c1 0%, #0f2d77 100%);
          filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#4573c1', endColorstr='#0f2d77',GradientType=0 );
          float: left;
          font-size: 20px * @baseMultiple;
          color: #25b3ff;
          text-align: center;
          margin-right: 9.07372%;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          div {
            width: 100%;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
          &:last-child {
            margin-right: 0;
          }
          &.active {
            background-image: linear-gradient(
              -180deg,
              #9efff8 1%,
              #0ba4ff 100%
            );
            font-size: 24px * @baseMultiple;
            color: #174293;
          }
        }
      }
    }
    .m3 {
      height: 640px * @baseMultiple;
      background-image: url("~@/assets/home/border.png");
      background-repeat: no-repeat;
      background-size: 99.9% 100%;
      padding-top: 30px * @baseMultiple;
      .chartBox {
        height: 391px * @baseMultiple;
      }
      .tBox {
        width: 236px * @baseMultiple;
        height: 211px * @baseMultiple;
        background-image: url("~@/assets/home/bottom.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-left: 37px * @baseMultiple;
        text-align: left;
        padding-top: 39px * @baseMultiple;
        padding-left: 39px * @baseMultiple;
        float: left;
        dt {
          height: 22px * @baseMultiple;
          line-height: 22px * @baseMultiple;
          font-size: 16px * @baseMultiple;
          color: #84f5f8;
          letter-spacing: 1.33px * @baseMultiple;
          margin-bottom: 13px * @baseMultiple;
        }
        dd {
          height: 28px * @baseMultiple;
          line-height: 28px * @baseMultiple;
          font-size: 20px * @baseMultiple;
          color: #84f5f8;
          letter-spacing: 1.67px * @baseMultiple;
          margin-bottom: 4px * @baseMultiple;
        }
      }
      .dateBtn {
        height: 32px * @baseMultiple;
        float: right;
        padding-right: 48px * @baseMultiple;
        li {
          width: 48px * @baseMultiple;
          height: 32px * @baseMultiple;
          line-height: 32px * @baseMultiple;
          border: 1px * @baseMultiple solid #3389ff;
          border-radius: 4px * @baseMultiple;
          font-size: 12px * @baseMultiple;
          color: #3388ff;
          float: left;
          margin-right: 24px * @baseMultiple;
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
          &.active {
            background-image: linear-gradient(
              -180deg,
              #93fff8 0%,
              #009efb 100%
            );
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#93fff8', endColorstr='#009efb',GradientType=0 );
            border: 0;
            line-height: 32px * @baseMultiple;
            font-size: 14px * @baseMultiple;
            color: #174293;
          }
        }
      }
    }
    .m4 {
      height: 632px * @baseMultiple;
      background-image: url("~@/assets/home/copy.png");
      background-repeat: no-repeat;
      background-size: 99.9% 100%;
      .mBox {
        min-height: 588px * @baseMultiple;
        font-size: 14px * @baseMultiple;
        color: #bdddff;
        padding: 0 25px * @baseMultiple;
        padding-top: 15px * @baseMultiple;
        text-align: left;
        li {
          width: 100%;
          height: 20px * @baseMultiple;
          line-height: 20px * @baseMultiple;
          margin-bottom: 16px * @baseMultiple;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          time {
            margin-right: 20px * @baseMultiple;
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      .lBox {
        width: 100%;
        // width: ( 548px - 50px - 320px ) * @baseMultiple;
        // width: calc(@messgaeWidth);
        // float: left;
      }
      // .rBox {
      //   width: @timeWidth;
      //   text-align: right;
      //   float: right;
      // }
    }
  }
  .chartBox {
    height: 257px * @baseMultiple;
  }
  .echarts {
    width: 100%;
    height: 100%;
  }
}
</style>

