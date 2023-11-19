import { ElMessage } from "element-plus"
//判断上传图片文件
export const beforeAvatar = (file) => {
    const isRightType =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg";
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isRightType) {
        ElMessage.error("上传的图片只能是png格式或者jpg格式");
    }
    if (!isLt2M) {
        ElMessage.error("上传的头像大小不能超过2兆");
    }
    return isRightType && isLt2M;
}
