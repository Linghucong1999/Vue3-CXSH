import { createStore } from 'vuex';
import { ElMessage } from 'element-plus';
// import { getAdminInfo } from '../api/getDataAxios.js';
import { getAdminInfo } from '../api/getData';

const ERR = '获取用户信息失败';

const state = {
    adminInfo: {
        user_name: 'Admin',
        avatar: 'default.jpg'
    }
}

const mutations = {
    saveAdminInfo(state, adminInfo) {
        state.adminInfo = adminInfo;
    }
}
const actions = {
    async getAdminData({ commit }) {        //{commit}相当于从context中拿出来，是es2015的参数解构
        try {
            const res = await getAdminInfo();
            if (res.status == 1) {
                commit('saveAdminInfo', res.data);  //通过commit唤醒mutations
            } else {
                throw new Error(res.type);
            }
        } catch (err) {
            // ElMessage.error(ERR);
        }
    }
}

export default createStore({
    state,
    actions,
    mutations,
})
