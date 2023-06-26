<template>
  <div></div>
</template>

<script>
import env from "@/config/env.js";
import { singout } from "@/api/getData.js";
import { mapActions, mapState } from "vuex";
import { Expand, Fold, RefreshRight } from "@element-plus/icons-vue";

export default {
  data() {
    return {
      baseImgPath: env.baseImgPath,
      isCollapse: false,
    };
  },
  setup() {
    return {
      Expand,
      Fold,
      RefreshRight,
    };
  },
  methods: {
    ...mapActions(["getAdminData"]),
  },
  computed:{
    ...mapState(['adminInfo'])
  },
  created(){
    if(!this.adminInfo.id){
        this.getAdminData()
    }
  }
};
</script>
<style lang="sass" scoped>
</style>