import facebookLogo from '../image/icon/facebook-logo.png';

export const SOCIAL_LOGIN_URL = {
  NAVER: '/auth/naver',
  KAKAO: '/auth/kakao',
  GOOGLE: '/auth/google',
  FACEBOOK: '/auth/facebook',
};

export const SOCIAL_LOGIN_PROVIDER = {
  NAVER: {
    img: 'https://vendor-cdn.imweb.me/images/naver_login2x.png',
    url: SOCIAL_LOGIN_URL.NAVER,
    css: 'naver',
  },
  KAKAO: {
    img: 'https://vendor-cdn.imweb.me/images/kakao_icon.png',
    url: SOCIAL_LOGIN_URL.KAKAO,
    css: 'kakao',
  },
  GOOGLE: {
    img: 'https://vendor-cdn.imweb.me/images/google_icon.png',
    url: SOCIAL_LOGIN_URL.GOOGLE,
    css: 'google',
  },
  FACEBOOK: {
    img: facebookLogo,
    url: SOCIAL_LOGIN_URL.FACEBOOK,
    css: 'facebook',
  },
};

export const HTML_EDITOR_MODE = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
};

export const API_LOGIN_GOOGLE = `${SOCIAL_LOGIN_URL.GOOGLE}/google`;
export const API_LOGIN_FACEBOOK = `${SOCIAL_LOGIN_URL.FACEBOOK}/facebook`;
export const API_LOGIN_NAVER = `${SOCIAL_LOGIN_URL.NAVER}/naver`;
