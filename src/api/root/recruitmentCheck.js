// 条件搜索
import myAxios from "../../plugins/myAxios.js";

export function searchRecruitmentCheckPageRequest(data){
    return myAxios.get('/admin/check/chief', {
        params: data
    })
}

// 修改招聘状态
export function passRecruitmentRequest(id){
    return myAxios.post('/admin/check/chief', {
        id
    })
}
