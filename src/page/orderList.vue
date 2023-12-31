<template>
    <div class="orderlist_container">
        <!-- 搜索模块 -->
        <el-card>
            <el-form :model="ruleForm" :inline="true" ref="ruleFormRef">
                <el-form-item label="订单ID：" prop="id">
                    <el-input v-model="ruleForm.id" placeholder="订单ID"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                    <el-button type="primary" @click="onReset('ruleFormRef')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 列表模块 -->
        <el-card class="table_container">
            <el-table :data="tableData" @expand="expand" :expand-row-keys="expandRow" :row-key="row => row.index"
                style="width:100%;">
                <el-table-column type="expand">
                    <template #default="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="用户名">
                                <span>{{ props.row.user_name }}</span>
                            </el-form-item>
                            <el-form-item label="店铺名称">
                                <span>{{ props.row.restaurant_name }}</span>
                            </el-form-item>
                            <el-form-item label="收获地址">
                                <span>{{ props.row.address }}</span>
                            </el-form-item>
                            <el-form-item label="店铺ID">
                                <span>{{ props.row.restaurant_id }}</span>
                            </el-form-item>
                            <el-form-item label="店铺地址">
                                <span>{{ props.row.restaurant_address }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="订单ID" prop="id"></el-table-column>
                <el-table-column label="总价格" prop="total_amount"></el-table-column>
                <el-table-column label="订单状态" prop="status"></el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination :total="count" :current-page="currentPage" :page-size="20" @current-change="handleCurrentChange"
                @size-change="handelSizeChange" layout="->, total, prev, pager, next, jumper"></el-pagination>
        </el-card>
    </div>
</template>

<script>
import { getOrderCount, getOrderList, getRestaurantDetail, getUserInfo, getAddressById, findOrderIdList } from "../api/getData";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
    data() {
        return {
            ruleForm: {
                id: '',
            },
            tableData: [],
            currentPage: 1,
            count: 0,
            offset: 0,
            limit: 0,
            currentRow: null,
            expandRow: [],
            restaurant_id: null
        }
    },
    created() {
        if (this.$route.query.restaurant_id) {
            this.restaurant_id = this.$route.query.restaurant_id;
        } else {
            this.restaurant_id = Math.ceil(Math.random() * 145);
            ElMessageBox.confirm(
                "查看订单需要选择一个商铺,先去选择商铺吗？",
                "Warning",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    this.$router.push("/shopList");
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消",
                    });
                });
        }
    },
    methods: {
        async initData() {
            try {
                const countData = await getOrderCount({ restaurant_id: this.restaurant_id });
                if (countData.status === 1) {
                    this.count = countData.count;
                } else {
                    throw new Error('订单数量获取失败');
                }
                this.getOrders();
            } catch (err) {
                ElMessage.warning('订单数量获取失败');
            }
        },
        async getOrders() {
            const Orders = await getOrderList({ offset: this.offset, limit: this.limit, restaurant_id: this.restaurant_id });
            this.tableData = [];
            if (Orders.status) {
                Orders.forEach((item, index) => {
                    const tableData = {};
                    tableData.id = item.id;
                    tableData.total_amount = item.total_amount;
                    tableData.status = item.status_bar.title;
                    tableData.user_id = item.user_id;
                    tableData.restaurant_id = item.restaurant_id;
                    tableData.address_id = item.address_id;
                    tableData.index = index;
                    this.tableData.push(tableData);
                })
            } else {
                ElMessage.warning(Orders.message);
            }

        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.offset = (val - 1) * this.limit;
            this.getOrders();
        },
        handelSizeChange(val) { },
        async expand(row, status) {
            if (status) {
                const restaurant = await getRestaurantDetail(row.restaurant_id);
                const userInfo = await getUserInfo(row.user_id);
                const addressInfo = await getAddressById(row.address_id);
                this.tableData.splice(row.index, 1, { ...row, ...{ restaurant_name: restaurant.name, restaurant_address: restaurant.address, address: addressInfo.address, user_name: userInfo.username } });
                this.$nextTick(() => {
                    this.expandRow.push(row.index);
                })
            } else {
                const index = this.expandRow.indexOf(row.index);
                this.expandRow.splice(index, 1);
            }
        },
        async onSubmit() {
            const res = await findOrderIdList({ restaurant_id: this.restaurant_id, keywords: this.ruleForm.id });
            if (res.status) {
                this.tableData = [];
                // res.orderData.forEach((item, index) => {
                //     let data = {};
                //     data.id = item.id;
                //     data.total_amount = item.total_amount;
                //     data.status = item.status_bar.title;
                //     data.user_id = item.user_id;
                //     data.restaurant_id = item.restaurant_id;
                //     data.address_id = item.address_id;
                //     data.index = index;
                //     this.tableData.push(data);
                // })
                let data = res.orderData;
                this.tableData.push({
                    id: data.id,
                    total_amount: data.total_amount,
                    status: data.status_bar.title,
                    user_id: data.user_id,
                    restaurant_id: data.restaurant_id,
                    address_id: data.address_id,
                    index: data.length

                })
            } else {
                ElMessage.success(res.message);
            }
        },
        onReset(form) {
            this.$refs[form].resetFields();
            this.initData();
        },
    }
}
</script>

<style></style>