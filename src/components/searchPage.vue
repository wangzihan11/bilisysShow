<template>
  <div>
    <h1>数据库内容展示</h1>
    <!-- input部分 -->
    <el-row style="padding-bottom: 2%" id="input">
      <el-col :span="8" :offset="8">
        <el-input
          class="inputStyle"
          v-model="input"
          size="medium"
          placeholder="输入想要查询的标签或者bv"
          @keyup.enter.native="search"
        ></el-input
      ></el-col>
    </el-row>
    <!-- 浏览数据库内容的按钮 -->
    <el-row id="infoButtons">
      <el-button type="primary" round @click="tname">tname</el-button>
      <el-button type="success" round @click="userTag">userTag</el-button>
      <el-button type="info" round @click="k400Tags">K400</el-button>
      <el-button type="info" round @click="cazTags">cazTags</el-button>
    </el-row>
    <!-- 展示tags -->
    <el-row class="myBox" id="showingTags" v-show="shwoComponents.tagGroup">
      <el-badge
        :value="item[1]"
        :max="990000"
        class="item"
        v-for="(item, i) in tagAreaContent"
        :key="i"
        style="padding: 1%"
      >
        <el-button size="small" @click="refreshWaitingBvs(item[0])">{{
          item[0]
        }}</el-button>
      </el-badge>
    </el-row>
    <!-- 展示videoList部分 -->
    <el-row id="showVideoList" v-show="shwoComponents.videoList">
      <el-col :span="16" :offset="4">
        <!-- <p v-for="(item,i) in temVideoInfos" :key="i">
          {{item["_id"]}}
        </p> -->
        <el-table :data="videoTableData" stripe style="width: 100%">
          <el-table-column prop="bv" label="视频编号"> </el-table-column>
          <el-table-column prop="title" label="视频名称"> </el-table-column>
          <el-table-column prop="src" label="视频地址">
            <!-- eslint-disable-next-line -->
            <template slot-scope="scope">
              <video
                :src="scope.row.src"
                height="100px"
                width="200px"
                controls="controls"
              ></video>
            </template>
          </el-table-column>
          <el-table-column prop="buttonInput" label="视频具体信息">
            <!-- eslint-disable-next-line -->
            <template slot-scope="scope">
              <el-button
                type="info"
                plain
                @click="showOneVideoInfo(scope.row.buttonInput)"
                >点击查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="1"
          layout="prev, pager, next, jumper"
          :total="waitingBvs.length"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 展示一个videoDeital部分 -->
    <div id="oneVideoInfo" v-show="shwoComponents.videoInfo">
      <el-row>
        <el-col :span="16" :offset="4">
          <h3 v-if="showingOneVideoInfo['baseInfo']">
            {{ showingOneVideoInfo["baseInfo"]["title"] }}
            <br>
            
            <el-link @click="get_origin_video(showingOneVideoInfo['baseInfo']['url'])">访问原视频</el-link>
            <br>
            {{ showingOneVideoInfo["baseInfo"]["url"]}}
            <!-- <a :href="showingOneVideoInfo['baseInfo']['url']">访问原视频(右键,在新标签页打开)</a> -->
          </h3>
          <video
            :src="oneVideoUrl"
            height="400px"
            width="auto"
            controls="controls"
          ></video>
          <el-table :data="oneVideoTags" stripe style="width: 100%">
            <el-table-column
              prop="k400tags"
              label="k400标签"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="clipTags"
              label="vidual_genome_palace365"
              width="280"
            ></el-table-column>
            <el-table-column
              prop="captions"
              label="句词池生成的数据"
              width="580"
            ></el-table-column>
          </el-table>
          <!-- {{}} -->
          <el-button type="info" plain @click="info2List()" style="margin: 1%"
            >返回列表</el-button
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          基本信息
          <div style="overflow: scroll; height: 300px">
            <!-- {{showingOneVideoInfo['baseInfo']}} -->
            <json-viewer :value="showingOneVideoInfo['baseInfo']"></json-viewer>
          </div>
        </el-col>
        <el-col :span="6">
          弹幕
          <div style="overflow: scroll; height: 300px">
            <json-viewer
              :value="showingOneVideoInfo['danmaku']"
              expand-depth="2"
            ></json-viewer>
          </div>
        </el-col>
        <el-col :span="6">
          评论
          <div style="overflow: scroll; height: 300px">
            <json-viewer :value="showingOneVideoInfo['comment']"></json-viewer>
          </div>
        </el-col>
        <el-col :span="6">
          标签
          <div style="overflow: scroll; height: 300px">
            <json-viewer :value="showingOneVideoInfo['tags']"></json-viewer>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import tagArea from "./tagArea.vue"
export default {
  name: "searchPage",
  components: {
    // tagArea,
  },
  data() {
    return {
      input: "",
      shwoComponents: {
        tagGroup: true,
        videoList: false,
        videoInfo: false,
      },
      tags: [],
      tnames: [],
      k400s: [],
      caztag:[],
      url: "http://10.77.110.150:10009",
      tagAreaContent: [], //<!-- 展示tags -->部分的数据
      showTags: [],
      showTagSource: "",
      waitingBvs: [],//videoList表格中的列表
      currentPage: 1,//控制翻页，记录当前的页数
      temVideoInfos: [], //记录现在展示的5个视频的总特征
      showingOneVideoInfo: {},//展示一个视频的具体信息
      oneVideoTags: {},//一个视频所含有标签所构成表格的信息来源
    };
  },
  methods: {
    get_origin_video(url){
      window.open(url);

    },
    // 得到一个视频需要展示的部分
    getoneVideoTags() {
      let temData = [];
      for (let i = 0; i < 10; i++) {
        let temdict = {};
        temdict["captions"] =
          this.showingOneVideoInfo["Captions"][i]["content"];
        temdict["clipTags"] = this.showingOneVideoInfo["CazTags"][i];
        temdict["k400tags"] = this.showingOneVideoInfo["K400Tags"][i];
        temData.push(temdict);
      }
      return temData;
    },
    // 展示一个视频的具体信息
    showOneVideoInfo(index) {
      // index的含义指的是这个video在temVideoInfos中所占的位置
      console.log(this.temVideoInfos[index]);
      // this.showingOneVideoInfo = {};
      this.showingOneVideoInfo = this.temVideoInfos[index];
      this.showingOneVideoInfo["baseInfo"]['url'] = " https://www.bilibili.com/video/"+this.showingOneVideoInfo["baseInfo"]['bvid']
      this.showingOneVideoInfo["index"] = index;
      console.log(this.showingOneVideoInfo);
      try{
          this.oneVideoTags = this.getoneVideoTags();
      }catch(error){
        console.log("暂时不利")
      }finally{
                this.shwoComponents.videoInfo = true;
      this.shwoComponents.videoList = false;
      }
        
      

    },
    // 视频页面的返回函数
    info2List() {
      this.shwoComponents.videoInfo = false;
      this.shwoComponents.videoList = true;
    },
    // 点击翻页时候的处理函数
    handleCurrentChange() {
      console.log(this.currentPage);
      this.getVideoDetailInfo(this.waitingBvs[this.currentPage - 1]);
    },
    // 获取一个array的video中的所有信息
    getVideoDetailInfo(videNames) {
      console.log(videNames);
      this.temVideoInfos = [];
      for (let i = 0; i < videNames.length; i++) {
        axios.get(`${this.url}/info/${videNames[i]}`).then((response) => {
          this.temVideoInfos.push(response.data);
        });
      }
    },

    // 点击tag获取videoinfos
    refreshWaitingBvs(data) {
      // 展示表格
      this.shwoComponents.tagGroup = false;
      this.shwoComponents.videoList = true;
      console.log(`${this.url}/content/video/${this.showTagSource}/${data}`);
      axios
        .get(`${this.url}/content/video/${this.showTagSource}/${data}`)
        .then((response) => {
          this.waitingBvs = [];
          for (let i = 0; i < response.data.length; i++) {
            this.waitingBvs.push(response.data[i]);
          }
          console.log(this.waitingBvs);
          // console.log(this.waitingBvs);
          this.getVideoDetailInfo(this.waitingBvs[0]);
        });
    },
    // 搜索的配套函数
    search() {
      console.log(this.input);
      //检查搜索视频是否根据bv符号
      if (this.input.startsWith("BV")) {
        // let temReult = []
        axios.get(`${this.url}/info/${this.input}`).then((response) => {
          console.log(response.data);
          if (!response.data["canFind"]) {
            // 声明一个警告
            console.log("无法查新");
            this.bvFailed();
            return;
          } else {
            this.showingOneVideoInfo = response.data;
            this.showingOneVideoInfo["baseInfo"]['url'] = " https://www.bilibili.com/video/"+this.showingOneVideoInfo["baseInfo"]['bvid']
            this.shwoComponents["index"] = 0;
            try{
            this.oneVideoTags = this.getoneVideoTags();
            }catch{
              console.log("出了点小错")
            }finally{
            // alert("得到了数字")
            console.log(this.showingOneVideoInfo)
            this.shwoComponents.videoInfo = true;
            this.shwoComponents.videoList = false;
            this.shwoComponents.tagGroup = false;}
          }
        });
        return;
      }
      console.log(`${this.url}/search/tags/${this.input}`);
      // 首先假设根据tags
      axios.get(`${this.url}/search/tags/${this.input}`).then((response) => {
        this.tagAreaContent = [];
        for (let i = 0; i < response.data.length; i++) {
          this.tagAreaContent.push(response.data[i]);
        }
        this.tagAreaContent.concat(response.data);
        this.shwoComponents.tagGroup = true;
        this.shwoComponents.videoList = false;
        this.shwoComponents.videoInfo = false;
        this.showTagSource = "userTag";
        console.log(this.tagAreaContent);
        // 缺少搜索成功的提示
        this.open2();
      });
    },
    // 搜索成功的弹窗
    open2() {
      this.$message({
        message: "搜索成功",
        type: "success",
      });
    },
    // 搜索bv搜索不到带来的弹窗
    bvFailed() {
      this.$message.error("数据库中没有这个bv");
    },
    // 点击tname的时候
    tname() {
      this.currentPage = 1;
      this.shwoComponents.tagGroup = true;
      this.shwoComponents.videoList = false;
      this.shwoComponents.videoInfo = false;
      this.showTagSource = "tname";
      console.log("获取后台的分区");
      // console.log(this.tnames)
      this.tagAreaContent = [];
      for (let i = 0; i < this.tnames.length; i++) {
        this.tagAreaContent.push(this.tnames[i]);
      }
    },
    // 点击userTag
    userTag() {
      this.currentPage = 1;
      this.shwoComponents.tagGroup = true;
      this.shwoComponents.videoList = false;
      this.shwoComponents.videoInfo = false;
      console.log("输入用户的标签");
      (this.showTagSource = "userTag"), (this.tagAreaContent = []);
      for (let i = 0; i < 100; i++) {
        this.tagAreaContent.push(
          this.tags[Math.floor(Math.random() * this.tags.length)]
        );
      }
    },
    // 点击k400
    k400Tags() {
      this.currentPage = 1;
      this.shwoComponents.tagGroup = true;
      this.shwoComponents.videoList = false;
      this.shwoComponents.videoInfo = false;
      console.log("获取k400标签");
      this.showTagSource = "k400";
      this.tagAreaContent = [];
      console.log(this.k400s)
      for (let i = 0; i < 90; i++) {
        this.tagAreaContent.push(
          this.k400s[Math.floor(Math.random() * this.k400s.length)]
        );
      }
    },
    // 点击cazTags
    cazTags(){
      this.currentPage = 1;
      this.shwoComponents.tagGroup = true;
      this.shwoComponents.videoList = false;
      this.shwoComponents.videoInfo = false;
      this.showTagSource = "cazTags"
      this.tagAreaContent = []
      this.tagAreaContent = [];
      for (let i = 0; i < this.caztag.length; i++) {
        this.tagAreaContent.push(this.caztag[i]);
      }
    }
  },

  // 创建的时候获取数据
  created() {
    axios.get(`${this.url}/content/tname`).then((response) => {
      this.tnames = response.data;
    });
    axios.get(`${this.url}/content/tags`).then((response) => {
      this.tags = response.data;
    });
    axios.get(`${this.url}/content/K400`).then((response) => {
      this.k400s = response.data;
    });
    axios.get(`${this.url}/cazTags/tagArea`).then((response) => {
      this.caztag = response.data;
    });
    console.log("数据获取完成");
    // this.temVideoInfos = [
    //   { baseInfo: { title: "xxx" }, _id: "BV1gk4y1y7Tm", bv: "BV1gk4y1y7Tm" },
    // ];
    // this.oneVideoTags = {
    //   captions: [],
    //   clipTags: [],
    //   k400tags: [],
    // };
    // 获取waitingBvs
    // this.showTagSource = "userTag"
    // this.refreshWaitingBvs("熊猫")
    // this.getVideoDetailInfo(this.waitingBvs[0])
    // console.log(this.temVideoInfos)
    // this.showOneVideoInfo(0)
  },
  computed: {
    // videList展示的数据
    videoTableData: function () {
      let temData = [];
      for (let i = 0; i < this.temVideoInfos.length; i++) {
        let temdict = {};
        temdict["title"] = this.temVideoInfos[i]["baseInfo"]["title"];
        temdict["bv"] = this.temVideoInfos[i]["_id"];
        temdict["src"] = `${this.url}/static/Video/${temdict["bv"]}.mp4`;
        temdict["buttonInput"] = i;
        temData.push(temdict);
      }
      return temData;
    },
    oneVideoUrl: function () {
      let bv = this.showingOneVideoInfo["_id"];
      return `${this.url}/static/Video/${bv}.mp4`;
    },
  },
};
</script>
<style>
.myBox {
  padding-left: 10%;
  padding-right: 10%;
  padding-top: 1%;
}
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>