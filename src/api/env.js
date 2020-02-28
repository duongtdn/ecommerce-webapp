"use strict"

module.exports = {
  urlAccount: process.env.URL_ACCOUNT,
  app: process.env.APP_NAME,
  urlBasePath: '',
  template: {
    avata: {
      male: process.env.DEFAULT_PIC_MALE,
      female: process.env.DEFAULT_PIC_FEMALE
    }
  },
  assets: {
    logo : {
      icon: process.env.URL_LOGO_ICON,
      png_trans: process.env.URL_LOGO_TRANS,
      png_bg: process.env.URL_LOGO_BG
    }
  },
  elearn: process.env.URL_ELEARN
}
