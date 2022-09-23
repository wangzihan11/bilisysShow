<template>
  <div>
    <h1>数据库画像</h1>
    <p>视频数目 {{ baseInfo["videoCount"] }}</p>
    <p>标签数目:{{ baseInfo["tagCountSet"] }}</p>
    <p>视频的分区数:{{ baseInfo["tname2Number"].length }}</p>
    <p>视频标题的词包: {{ baseInfo["titleWordSet"] }}</p>
    <p>视频长度的分布</p>
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <div style="overflow: scroll; width: 100%; white-space: nowrap">
          <table class="table table-dark" style="display: inline-table">
            <tr>
              <th>时长</th>
              <th v-for="(i, item) in baseInfo['duration']" :key="item">
                {{ i[0] }}
              </th>
            </tr>
            <tr>
              <th>数目</th>
              <th v-for="(i, item) in baseInfo['duration']" :key="item">
                {{ i[1] }}
              </th>
            </tr>
          </table>
        </div>
      </el-col>
    </el-row>

    <p>视频分区</p>
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <div style="overflow: scroll; width: 100%; white-space: nowrap">
          <table class="table table-dark">
            <tr>
              <th>rk</th>
              <th v-for="item in baseInfo['tname2Number'].length" :key="item">
                {{ item }}
              </th>
            </tr>
            <tr>
              <th>分区</th>
              <th v-for="(i, item) in baseInfo['tname2Number']" :key="item">
                {{ i[0] }}
              </th>
            </tr>
            <tr>
              <th>数目</th>
              <th v-for="(i, item) in baseInfo['tname2Number']" :key="item">
                {{ i[1] }}
              </th>
            </tr>
          </table>
        </div>
      </el-col>
    </el-row>

    <!-- <json-viewer :value="baseInfo"></json-viewer> -->
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "baseInfo",
  data() {
    return {
      baseInfo: {},
    };
  },
  created() {
    axios
      .get("http://10.77.110.150:10009/databaseBaseInfo")
      .then((response) => {
        this.baseInfo = response.data;
        this.baseInfo["index"] = 0;
      });
  },
};
</script>
<style>
</style>