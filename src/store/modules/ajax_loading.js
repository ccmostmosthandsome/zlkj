const ajaxLoading = {
  state: {
    ajaxIsLoading: false
  },
  mutations: {
    ajaxStart (state) {
      state.ajaxIsLoading = true
    },
    ajaxEnd (state) {
      state.ajaxIsLoading = false
    }
  }
}

export default ajaxLoading