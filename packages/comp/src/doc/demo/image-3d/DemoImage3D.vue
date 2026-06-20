<script setup lang="ts">
import { Image3D } from "jsh-comp";
import type { ApiRow, ComponentApi } from "../../type/types";
import ApiTable from "../ApiTable.vue";
import DemoWidgetTabs from "../DemoWidgetTabs.vue";
import { demoCodes } from "../demoCodes";

const api: ComponentApi = {
  props: [
    { name: "src", type: "string", default: "—", required: true, desc: "图片地址" },
  ],
};
</script>

<template>
  <div class="doc-content__header">
    <h2>Image3D 3D 透视图片</h2>
    <p>鼠标悬停时产生 3D 透视旋转效果</p>
  </div>

  <DemoWidgetTabs :code="demoCodes.image3d">
    <div style="display: flex; justify-content: center; padding: 24px">
      <Image3D src="https://picsum.photos/seed/lib-img/300/200" />
    </div>
  </DemoWidgetTabs>

  <div class="api-section">
    <h3 class="api-section__title">Image3D Props</h3>
    <ApiTable type="props" :rows="api.props" />
  </div>
</template>

<style scoped lang="scss">
@use "../../style/variables" as *;
@use "../../style/demo";
</style>
