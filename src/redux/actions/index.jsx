import {
    GET_ARTICLES,
    GET_CLASSES,
    LOGIN,
    GET_POEM,
    GET_TAGS,
    GET_DRAFTS,
    GET_GALLERIES,
    GET_SAYS,
    GET_LINKS,
    GET_SHOWS,
    GET_ABOUT,
    GET_LOGS,
    GET_MSGS,
    GET_NOTICE,
} from '../constant';

// 登录
export const login = data => ({
    type: LOGIN,
    data,
});

// 获得所有文章
export const getArticles = data => ({
    type: GET_ARTICLES,
    data,
});

// 获得所有草稿
export const getDrafts = data => ({
    type: GET_DRAFTS,
    data,
});

// 获得所有分类
export const getClasses = data => ({
    type: GET_CLASSES,
    data,
});

// 获得所有标签
export const getTags = data => ({
    type: GET_TAGS,
    data,
});

// 获得每日诗句信息
export const getPoem = data => ({
    type: GET_POEM,
    data,
});

export const getGalleries = data => ({
    type: GET_GALLERIES,
    data,
});
export const getSays = data => ({
    type: GET_SAYS,
    data,
});
export const getLinks = data => ({
    type: GET_LINKS,
    data,
});
export const getShows = data => ({
    type: GET_SHOWS,
    data,
});
export const getAbout = data => ({
    type: GET_ABOUT,
    data,
});
export const getLogs = data => ({
    type: GET_LOGS,
    data,
});

export const getMsgs = data => ({
    type: GET_MSGS,
    data,
});

export const getNotice = data => ({
    type: GET_NOTICE,
    data,
});
