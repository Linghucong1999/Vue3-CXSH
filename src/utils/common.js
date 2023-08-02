import { dayjs } from "element-plus";

//千分位算法
export const thousandFormat = (v) => {
    const reg = /\d{1,3}(?=(\d{3})+$)/g;
    return `${v}`.replace(reg, '$&,');
}

//取消千分位
export const cancalThousand = (s) => {
    return s.replace(/,/g, '');
}


//百分比算法
export const wrapperPercentage = (o, k) => {
    return o && o[k] ? `${o[k]}%` : '0%';
}

export const wrapperNumber = (o, k) => {
    return o && o[k] ? thousandFormat(o[k]) : 0;
}

//生成特定时间段的日期
export const compareArr = (start_time, end_time) => {
    const arr = [];
    const data = [start_time, end_time];
    let timeA = dayjs(data[0] || dayjs().subtract(2, 'day')).valueOf();
    let timeB = dayjs(data[1] || dayjs()).valueOf();
    do {
        arr.push(dayjs(timeA).format("YYYY-MM-DD"));
        timeA = Number(timeA) + (24 * 3600 * 1000);
    } while (timeA <= timeB)
    return arr;
}