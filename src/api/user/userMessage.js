import myAxios from "../../plugins/myAxios.js";

// 用户获取系统通知
export function listSystemMessageRequest(userId){
    return myAxios.get('/user/information', {
        params: {
            userId
        }
    })
}
