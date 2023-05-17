import myAxios from "../../plugins/myAxios.js";

// 新增岗位
export function addRecruitmentRequest(recruitment) {
    return myAxios.put('/company/add/chief', recruitment)
}

// 批量删除岗位
export function deleteRecruitmentByIdsRequest(ids) {
    return myAxios.delete('/company/dele/chief', {
        data: {
            ids
        }
    })
}

// 条件搜索
export function searchRecruitmentPageRequest(recruitment) {
    return myAxios.get('/company/list/chief', {
        params: recruitment
    })
}

// 修改岗位信息
export function updateRecruitmentRequest(recruitment) {
    return myAxios.post('/company/update/chief', recruitment)
}
