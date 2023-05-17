import myAxios from "../../plugins/myAxios.js";

// 添加公司项目
export function addCompanyTaskRequest(task){
    return myAxios.put('/company/add/task', task)
}

// 搜索项目
export function searchCompanyTaskRequest(task){
    return myAxios.get('/company/task', {
        params: task
    })
}

// 删除项目
export function deleteCompanyTaskRequest(ids, companyId){
    return myAxios.delete('/company/task', {
        data: {
            ids,
            companyId
        }
    })
}

// 修改项目
export function updateCompanyTaskRequest(task){
    return myAxios.post('/company/task/update', task)
}

// 查看用户提交的项目列表
export function getUserCommitRequest(companyId, taskType, taskTitle){
    return myAxios.get('/company/user/commit', {
        params: {
            companyId,
            taskType,
            taskTitle
        }
    })
}
