export const state = () => ({ userInfo: null })

export const mutations = {
  SET_USERINFO (state, userInfo) {
    state.userInfo = userInfo || null
  }
}

export const getters = {
  getUserInfo (state) {
    return state.userInfo
  }
}
