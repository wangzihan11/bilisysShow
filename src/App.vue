<template>
  <div id="app">
    <!-- 导航栏 -->
    <div>
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="1" @click="show1()">数据库画像</el-menu-item>
        <el-menu-item index="2" @click="show2()">数据库内容展示</el-menu-item>
        <el-menu-item index="3">视频上传</el-menu-item>
        <el-menu-item index="4">视频爬取</el-menu-item>
      </el-menu>
    </div>
    <!-- 几个不同的内容页面 -->
    <searchPage v-show="showCompent.showSearchPage" />
    <baseInfo v-show="showCompent.showbaseInfo" />
  </div>
</template>

<script>
import searchPage from "./components/searchPage.vue";
import baseInfo from "./components/baseInfo.vue";
export default {
  name: "App",
  components: {
    searchPage,
    baseInfo,
  },
  data() {
    return {
      showCompent: {
        showbaseInfo: true,
        showSearchPage: false,
      },
    };
  },
  methods: {
    closeAllComponent() {
      let oneComponent = "";
      for (oneComponent in this.showCompent) {
        this.showCompent[oneComponent] = false;
      }
    },
    show1() {
      this.closeAllComponent();
      this.showCompent.showbaseInfo = true;
    },
    show2() {
      this.closeAllComponent();
      this.showCompent.showSearchPage = true;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
