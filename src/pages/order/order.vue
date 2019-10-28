<template>
  <div class="orderDetail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="所有订单信息" name="info">
        <div class="order">
          <!-- 按钮 -->
          <div>
            <el-button size="small" type="danger" @click="batchDeleteHandler">批量删除</el-button>
          </div>
          <!-- 表格 -->
          <div v-loading="loading">
            <el-table :data="orders" size="mini" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="编号" />
              <el-table-column prop="orderTime" label="下单时间" />
              <el-table-column prop="total" label="数量" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="顾客编号" />
              <el-table-column prop="waiterId" label="员工编号" />
              <el-table-column prop="addressId" label="地址编号" />
              <el-table-column label="操作">
                <template #default="record">
                  <i class="el-icon-delete" href="" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 模态框 -->

          <!-- /模态框 -->
          <!--分页-->

          <!--分页结束-->
        </div>
      </el-tab-pane>
      <el-tab-pane label="待派单" name="orders">
        <!-- 表格 -->
        <div v-loading="loading">
          <el-table :filters="ordersD[{status:待派单}]" :data="ordersD" size="mini" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="编号" />
            <el-table-column prop="orderTime" label="下单时间" />
            <el-table-column prop="total" label="数量" />
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="customerId" label="顾客编号" />
            <el-table-column prop="waiterId" label="员工编号" />
            <el-table-column prop="addressId" label="地址编号" />
            <el-table-column label="操作">
              <template #default="record">
                <i class="el-icon-delete" href="" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="待接单" name="address" />
    </el-tabs>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      activeName: 'info',
      order: {},
      ids: [],
      rules: {
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('order', ['orders', 'ordersD', 'visible', 'title', 'loading']),
    ...mapGetters('order', ['orderOrder', 'orderSize'])
  },
  created() {
    this.findAllOrders()
    this.findAllOrdersD()
  },
  methods: {
    ...mapMutations('order', ['showModal', 'closeModal', 'setTitle']),
    ...mapActions('order', ['findAllOrders', 'findAllOrdersD', 'saveOrUpdateOrder', 'deleteOrderById', 'batchDeleteOrder']),
    // 普通方法
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
    },
    submitHandler() {
      // 校验
      this.$refs.orderForm.validate((valid) => {
        // 如果校验通过
        if (valid) {
          const promise = this.saveOrUpdateOrder(this.order)
          promise.then((response) => {
            // promise为action函数的返回值，异步函数的返回值就是promise的then回调函数的参数
            this.$message({ type: 'success', message: response.statusText })
          })
        } else {
          return false
        }
      })
    },
    dialogCloseHandler() {
      this.$refs.orderForm.resetFields()
    },
    editHandler(row) {
      this.order = row
      this.setTitle('修改顾客信息')
      this.showModal()
    },
    deleteHandler(id) {
      this.deleteOrderById(id)
        .then((response) => {
          if (response.status === 200) {
            this.$message({ type: 'success', message: '删除成功' })
          } else {
            this.$message({ type: 'error', message: '删除失败' })
          }
        })
    },
    batchDeleteHandler() {
      this.batchDeleteOrder(this.ids)
        .then((response) => {
          this.$message({ type: 'success', message: response.statusText })
        })
    }

  }

}
</script>
<style scoped>

</style>
