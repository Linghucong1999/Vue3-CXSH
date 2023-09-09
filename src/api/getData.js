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
 * 获取管理员信息
 */

export const getAdminInfo = () => fetch('/admin/info');

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

/**
 * 获取特定的管理员
 */

export const conditionGetAdmin = data => fetch('/admin/conditionget/admin', data);

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
 * 获取用户数量
 */

export const getUserCount = () => fetch('/v1//users/count');

/**
 *  获取用户所在城市
 */

export const getUserCity = () => fetch('/v1/user/city/count')

/**
 * 获取用户信息
 */

export const getUserList = data => fetch('/v1/users/list', data);

/** 
 * 根据时间段,地区,用户名筛选用户
*/

export const conditionGetUser = data => fetch('/v1/user/condition/userlist', data);

/**
 * 某一天订单数量
 */

export const orderCount = data => fetch('/statis/order/' + data + '/count');

/**
 * 添加商铺
 */

export const addShop = data => fetch('/shopping/addshop', data, 'POST');

/**
 * 获取商铺列表
 */

export const shopList = (
    latitude,
    longitude,
    offset,
    restaurant_category_id = '',
    restaurant_category_ids = [],
    order_by = '',
    delivery_mode = '',
    support_ids = []
) => {
    let supportStr = '';
    support_ids.forEach(item => {
        if (item.status) {
            supportStr += '&support_ids[]=' + item.restaurant_category_id
        }
    })

    const data = {
        latitude,
        longitude,
        offset,
        limit: 20,
        keyword: '',
        'extras[]': 'activities',
        restaurant_category_id,
        restaurant_category_ids: restaurant_category_ids,
        order_by,
        delivery_mode: delivery_mode + supportStr
    }
    return fetch('/shopping/restaurants', data);
}



/**
 * 
 * 获取餐馆列表
 */

export const getRestaurants = data => fetch('/shopping/restaurants', data);


/**
 * 搜索关键字数据量
 */

export const searchTatol = data => fetch('/v2/categorydatalist/search', data);

/**
 * 搜索
 */

export const addSearchFodd = data => fetch('/v2/categorydatalist', data);

/**
 * 
 * 获取搜索地址
 */

export const searchplace = (cityid, value) => fetch('/v1/pois', {
    type: 'search',
    city_id: cityid,
    keyword: value
})


/**
 * 获取省市区列表
 */

export const getFindCity = () => fetch('/findcity/citydistrict');

/**
 * 获取下级市
 */

export const getLowerCity = data => fetch('/findcity/citychilder', data);


/**
 * 获取定位城市
 */
export const cityGuess = data => fetch('/v1/cities', { type: data });
