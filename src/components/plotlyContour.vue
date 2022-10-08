<template>
  <div>
    <el-container>
      <el-aside width="75%" height="100%"
        ><div id="myDiv" style="width: 100%; height: 100%"></div
      ></el-aside>
      <el-main width="25%" height="100%">
        <el-header>
          <el-row>
            <el-col :span="24" style="text-align: right">
              <!-- <el-button type="primary" plain>Setting</el-button> -->
            </el-col>
          </el-row>
        </el-header>
        <el-main style="text-align: left">
          <!-- <el-tag type="info" style="text-align: left">Control</el-tag> -->
          <el-row>
            <el-col :span="24" style="font-size: 16; margin-bottom: 10px">Control</el-col>
          </el-row>
          <el-row>
            <el-button type="success" plain @click="click_start_handle('get')"
              >Get Data</el-button
            >
          </el-row>

          <el-row>
            <el-col
              :span="20"
              style="font-size: 16; margin-bottom: 10px; margin-top: 10px"
              >Settings</el-col
            >
          </el-row>
          <el-row>
            <el-row style="margin-left: 10px">fire address:</el-row>
            <el-input v-model="settings.baseUrl" placeholder="请输入内容"></el-input>
            <!-- <el-row style="margin-left: 10px">map size:</el-row>
            <el-input
              v-model="settings.xsize"
              placeholder="请输入内容"
              type="number"
            ></el-input> -->
            <el-button
              type="danger"
              style="margin-top: 10px"
              plain
              @click="click_change_settings"
              >Change Settings</el-button
            >
            <!-- <el-input placeholder="请输入内容" v-model="settings.xsize">
              <template slot="prepend">读取尺寸</template>
            </el-input> -->
            <!-- <el-checkbox v-model="settings.Allrun">All Run</el-checkbox>
            <el-checkbox v-model="checked">HDF5toSAC</el-checkbox>
            <el-checkbox v-model="checked">Calculate CCFs</el-checkbox>
            <el-checkbox v-model="checked">Plot CCFs</el-checkbox>
            <el-checkbox v-model="checked">Calculate Dispen</el-checkbox>
            <el-checkbox v-model="checked">pick Dispen</el-checkbox>
            <el-checkbox v-model="checked">DArrySurfTomo</el-checkbox> -->
          </el-row>

          <el-row>
            <el-col
              :span="20"
              style="font-size: 16; margin-bottom: 10px; margin-top: 10px"
              >Message</el-col
            >
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                :data="messageData"
                height="300"
                style="height: 300px; width: 100%"
                ref="messageData"
                :show-header="false"
              >
                <el-table-column type="index" width="38"> </el-table-column>
                <el-table-column prop="text"></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-main>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { loadContourData } from "@/api/contour";
import { set_contour_settings } from "@/api/contour";
import * as contourApi from "@/api/contour";
export default {
  name: "plotyContour",
  components: {},
  data() {
    return {
      messageData: [{ text: "正在初始化···" }],
      option: {},
      myChart: "",
      ydata: [],
      settings: {
        id: 0,
        baseUrl: "",
        xsize: 0,
        ysize: 0,
        Allrun: true,
        HDF5toSAC: 0,
        CalculateCCFs: 0,
        PlotCCFs: 0,
        CalculateDispen: 0,
        pickDispen: 0,
        DArrySurfTomo: 0,
      },
    };
  },
  created() {
    let _this = this;
    // this.dataRefreh();
    this.load_contour_settings();
    this.click_start_handle("get");

    // window.timer = setInterval(() => {
    //   setTimeout(this.click_start_handle(), 0);
    // }, 5000);

    // 用时间戳模拟登录用户
    const username = new Date().getTime();
    // alert(username)
    //判断当前浏览器是否支持WebSocket
    if ("WebSocket" in window) {
      console.log("浏览器支持Websocket");
      this.websocket = new WebSocket("ws://localhost:9088/websocket/" + username);
    } else {
      alert("当前浏览器 不支持 websocket");
    }
    //连接发生错误的回调方法
    this.websocket.onerror = function () {
      setMessageInnerHTML("WebSocket连接发生错误");
    };

    //连接成功建立的回调方法
    this.websocket.onopen = function () {
      setMessageInnerHTML("WebSocket连接成功");
    };

    //接收到消息的回调方法
    this.websocket.onmessage = function (event) {
      setMessageInnerHTML(event.data);
      _this.click_start_handle();
      loadContourData();
    };

    //连接关闭的回调方法
    this.websocket.onclose = function () {
      setMessageInnerHTML("WebSocket连接关闭");
    };

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    this.window.onbeforeunload = function () {
      closeWebSocket();
    };

    //关闭WebSocket连接
    function closeWebSocket() {
      websocket.close();
    }

    //将消息显示在网页上
    function setMessageInnerHTML(innerHTML) {
      console.log(innerHTML);
    }
  },
  beforeDestroy() {
    clearInterval(timer);
  },
  destroyed() {
    // 在页面销毁后，清除计时器
    this.clear();
  },
  mounted() {
    this.draw();
  },

  methods: {
    doUpdate() {
      this.$refs["scrollBoard"].updateRows(rows, index);
    },
    click_start_handle(flag) {
      loadContourData().then(
        (res) => {
          if (res.data.code == 200) {
            console.log(res);
            var update = {
              z: [res.data.data],
            };
            Plotly.restyle("myDiv", update, 0);
            var time =
              new Date().getHours().toString() + ":" + new Date().getMinutes().toString();
            if (flag == "get") this.messageData.push({ text: "获取最新数据成功" + time });
            else {
              this.messageData.push({ text: "服务器推送最新数据成功" + time });
            }
          } else {
            this.messageData.push({ text: res.data.message });
          }
          this.$nextTick(() => {
            console.log(this.$refs.messageData.data);
            this.$refs["messageData"].bodyWrapper.scrollTop = this.$refs[
              "messageData"
            ].bodyWrapper.scrollHeight;
          });
        },
        (err) => {
          console.log(err); // err: timeout  接口超时
          this.messageData.push({ text: "服务器连接失败" });
          this.$nextTick(() => {
            console.log(this.$refs.messageData.data);
            this.$refs["messageData"].bodyWrapper.scrollTop = this.$refs[
              "messageData"
            ].bodyWrapper.scrollHeight;
          });
        }
      );
    },
    load_contour_settings() {
      contourApi.get_contour_settings().then(
        (res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.settings = res.data.data;
            this.messageData.push({ text: "服务器连接成功" });
          } else {
            this.messageData.push({ text: "服务器连接失败" });
          }
          this.$nextTick(() => {
            console.log(this.$refs.messageData.data);
            this.$refs["messageData"].bodyWrapper.scrollTop = this.$refs[
              "messageData"
            ].bodyWrapper.scrollHeight;
          });
        },
        (err) => {
          console.log(err); // err: timeout  接口超时
          this.messageData.push({ text: "服务器连接失败" });
          this.$nextTick(() => {
            console.log(this.$refs.messageData.data);
            this.$refs["messageData"].bodyWrapper.scrollTop = this.$refs[
              "messageData"
            ].bodyWrapper.scrollHeight;
          });
        }
      );
    },
    click_change_settings() {
      set_contour_settings(this.settings).then(
        (res) => {
          console.log(res);
          if (res.data.code == 200) this.messageData.push({ text: "配置修改成功！" });
          else {
            this.messageData.push({ text: res.data.message });
          }
          this.$nextTick(() => {
            console.log(this.$refs.messageData.data);
            this.$refs["messageData"].bodyWrapper.scrollTop = this.$refs[
              "messageData"
            ].bodyWrapper.scrollHeight;
          });
        },
        (err) => {
          console.log(err); // err: timeout  接口超时
          this.messageData.push({ text: "服务器连接失败" });
          this.$nextTick(() => {
            console.log(this.$refs.messageData.data);
            this.$refs["messageData"].bodyWrapper.scrollTop = this.$refs[
              "messageData"
            ].bodyWrapper.scrollHeight;
          });
        }
      );
    },
    draw() {
      var data = [
        {
          // x0: [0, 1, 2, 3, 4, 5],
          // y0: [0, 1, 2, 3, 4, 5],
          z: [
            // [10, 10.625, 12.5, 15.625, 20, 10],
            // [5.625, 6.25, 8.125, 11.25, 15.625, 13],
            // [2.5, 3.125, 20, 8.125, 10, 14],
            // [0.625, 1.25, 3.125, 6.25, 10.625, 15],
            // [0, 0.625, 10, 5.625, 10, 16],
            // [0, 0.625, 10, 5.625, 10, 16],
          ],
          type: "contour",
          colorscale: "Jet",
          // colorscale: [
          //   [0, rgb(5, 10, 172)],
          //   [0.2, rgb(40, 60, 190)],
          //   [0.4, rgb(70, 100, 245)],
          //   [0.6, rgb(90, 120, 245)],
          //   [0.8, rgb(106, 137, 247)],
          //   [1, rgb(220, 220, 220)],
          // ],
          contours: {
            coloring: "heatmap",
            showlabels: true,
            labelfont: {
              family: "Raleway",
              size: 12,
              color: "black",
            },
            start: 60,
            end: 140,
            size: 2,
          },
        },
      ];

      var layout = {
        title: "CONTOUR MAP",
        // colorscale: [
        //   [0, rgb(5, 10, 172)],
        //   [0.2, rgb(40, 60, 190)],
        //   [0.4, rgb(70, 100, 245)],
        //   [0.6, rgb(90, 120, 245)],
        //   [0.8, rgb(106, 137, 247)],
        //   [1, rgb(220, 220, 220)],
        // ],
      };
      var config = {
        scrollZoom: false,
        displaylogo: false,
      };

      Plotly.newPlot("myDiv", data, layout, config);
    },
  },
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  padding: 8px 0;
}

.box-card {
  width: 180px;
}
.el-aside {
  padding: 0 !important;
}
.el-main {
  padding: 10 !important;
}
</style>
