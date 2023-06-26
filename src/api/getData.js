import fetch from "../config/fetch";

/**
 * 登录
 */

export const login = data => fetch('/admin/login', data, 'post');

/**
 * 退出
 */

export const singout = () => fetch('/admin/singout');

/**
 * 获取用户信息
 */

export const getAdminInfo = () => fetch('/admin/info');

/**
 * api请求量
 */
export const apiCount = data => fetch('/statis/api/' + data + '/count');

/**
 * 所有api请求量
 */

export const apiAllCount = () => fetch('/statis/api/count');

/**
 * 所有api请求信息
 */

export const apiAllRecord = () => fetch('/statis/api/all');

/**
 * 用户注册量
 */

export const userCount = data => fetch('/statis/user/' + data + '/count');

/**
 * 某一天订单数量
 */

export const orderCount = data => fetch('/statis/order/' + data + '/count');

/**
 * 某一天的管理员注册数量
 */

export const adminDayCount = data => fetch('/statis/admin/' + data + '/count');

/**
 * 管理员列表
 */
export const adminList = data => fetch('/admin/all', data);

/**
 * 管理员数量
 */

export const adminCount = () => fetch('/admin/count');