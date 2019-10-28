import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
import { AST_Conditional } from '_terser@4.3.9@terser'

export default {
  namespaced: true,
  state: {
    ordersD: [],
    orders: [],
    visible: false,
    loading: false
  },
  getters: {
    orderSize(state) {
      return state.orders.length
    },
    orderOrder: (state) => {
      return function(flag) {
        state.orders.sort((a, b) => {
          if (a[flag] > b[flag]) {
            return -1
          } else {
            return 1
          }
        })
        return state.orders
      }
    }
  },
  mutations: {
    showModal(state) {
      state.visible = true
    },
    closeModal(state) {
      state.visible = false
    },
    refreshOrders(state, orders) {
      state.orders = orders
    },
    setTitle(state, title) {
      state.title = title
    },
    beginLoading(state) {
      state.loading = true
    },
    endLoading(state) {
      state.loading = false
    },
    refreshOrdersD(state, ordersD) {
      state.ordersD = ordersD
    }
  },
  actions: {
    async batchDeleteOrder(context, ids) {
      // 1. 批量删除
      const response = await post_array('/order/batchDelete', { ids })
      // 2. 分发
      context.dispatch('findAllOrders')
      // 3. 返回结果
      return response
    },
    async deleteOrderById(context, id) {
      const response = await request.get('/order/deleteById?id=' + id)
      context.dispatch('findAllOrders')
      return response
    },
    async findAllOrders({ dispatch, commit }) {
      // 1. ajax查询
      commit('beginLoading')
      const response = await request.get('/order/findAll')
      // 2. 将查询结果更新到state中
      commit('refreshOrders', response.data)
      setTimeout(() => {
        commit('endLoading')
      }, 1000)
    },
    async findAllOrdersD({ dispatch, commit }) {
      // 1. ajax查询
      commit('beginLoading')
      const response = await request.get('/order/findAll')
      // 2. 将查询结果更新到state中
      console.log(response.data)
      if (response.data.status === '待派单') {
        commit('refreshOrdersD', response.data)
      }
      setTimeout(() => {
        commit('endLoading')
      }, 1000)
    },
    // payload 顾客信息
    async saveOrUpdateOrder({ commit, dispatch }, payload) {
      // 1. 保存或更新
      const response = await post('/order/saveOrUpdate', payload)
      // 2. 刷新页面
      dispatch('findAllOrders')
      // 3. 关闭模态框
      commit('closeModal')
      // 4. 提示
      return response
    }
  }
}
