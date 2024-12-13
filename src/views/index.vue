<template>
  <div style="height: 100%;">
    <div class="list" v-if="list.length > 1">
      <el-select v-model="url" placeholder="Select" style="width: 240px">
        <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.url" />
      </el-select>
    </div>
    <iframe :src="url" frameborder="0" width="100%" height="100%" allowtransparency></iframe>
  </div>
</template>

<script setup>
import { getBIData } from "@/api/system/config";
let url = ref("")
let list = ref([])
getBIData().then(res => {
  list.value = res.data
  url.value = res.data[0]?.url
})

</script>

<style scoped lang="scss">
#container {
  width: 100%;
  height: 100%;
}

.list {
  background: white;
  padding: 5px;
  position: absolute;
  right: 20px;
  align-content: center;

  .label {
    display: flex;
    align-items: center;
    margin: 0 10px;
  }
}
</style>
