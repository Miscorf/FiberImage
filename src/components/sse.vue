<template>
  <div id="message"></div>
</template>

<script>
export default {
  name: "sse",
  components: {},
  data() {
    return {
      messageData: [{ text: "正在初始化···" }],
      websocket: {},
    };
  },
  created() {},
  mounted() {
    // let websocket = null;

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
      document.getElementById("message").innerHTML += innerHTML + "<br/>";
    }
  },
  methods: {},
};
</script>
