import myAxios from "../../plugins/myAxios.js";

// 添加企业项目评论
export function addTaskCommentRequest(comment){
    return myAxios.put('/user/add/taskComment', comment)
}

// 获取企业项目评论
export function listTaskCommentRequest(taskId){
    return myAxios.get('/user/task', {
        params: {
            taskId
        }
    })
}

// 上传项目
export function uploadTaskFileRequest(data){
    return myAxios.post('/common/upload', data, {
        headers: {'Content-Type': 'multipart/form-data'},
    })
}
