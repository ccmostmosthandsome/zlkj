const getters = {
  userInfo: state => state.user.userInfo,
  isAjaxLoading: state => state.ajaxLoading.ajaxIsLoading,
  isLoading: state => state.loading.isLoading,
  isHome: state => state.allnav.isHome,
  isLogin: state => state.user.isLogin,
  token: state => state.user.token,
  newAvatar: state => state.user.newAvatar,
  account: state => state.user.account,
  userInfo: state => state.user.userInfo,
  viewer: state => state.map3d.viewer,
  startTime: state => state.camera.startTime,
  stopTime: state => state.camera.stopTime,
  timeDifferenceA: state => state.camera.timeDifferenceA,
  flyComplete: state => state.camera.flyComplete,
  billboards: state => state.bz.billboards,
  icons: state => state.bz.icons,
  czml: state => state.czml.czml,
  czmlTemporaryBh: state => state.czml.czmlTemporaryBh,
  czmlTemporaryDth: state => state.czml.czmlTemporaryDth,
  czmlTemporaryBz: state => state.czml.czmlTemporaryBz,
  czmlTemporaryModel: state => state.czml.czmlTemporaryModel,
  czmlStream: state => state.czml.czmlStream
}

export default getters