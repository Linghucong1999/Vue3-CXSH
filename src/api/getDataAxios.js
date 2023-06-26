import request from "../config/request";


/**
 * 登录
 */

export const login = data => request('/admin/login', data, 'POST');

/**
 * 获取管理员信息
 */

export const getAdminInfo = () => request('admin/info');

/**
 * api请求量
 */

export const apiCount=data=>request('/statis/api/'+data+'/count');

/**
 * 所有api请求量
 */

export const apiAllCount=data=>request('/statis/api/count');

/**
 * 用户注册量
 */

export const userCount=data=>request('/statis/user/'+data+'/count');

/**
 * 某一天的订单数量
 */

export const orderCount=data=>request('/statis/order/'+data+'/count');

/**
 * 某一天的管理员注册数量
 */

export const adminDayCount=data=>request('/statis/admin/'+data+'/count');

/**
 * 管理员列表
 */

export const adminList=data=>request('/admin/all',data);