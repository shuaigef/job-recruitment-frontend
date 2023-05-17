import myAxios from "../../plugins/myAxios.js";

// 添加通告
export function addNoticeRequest(notice){
    return myAxios.put('/notice/add', notice)
}

// 搜索通告
export function searchNoticeRequest(notice){
    return myAxios.get('/notice', {
        params: notice
    })
}

// 修改通告
export function updateNoticeRequest(notice){
    return myAxios.post('/notice', notice)
}

// 删除通告
export function deleteNoticeRequest(ids){
    return myAxios.delete('/notice/delete', {
        data: {
            ids
        }
    })
}
