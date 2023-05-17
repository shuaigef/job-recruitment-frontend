import myAxios from "../../plugins/myAxios.js";

// 分页获取学生信息列表
export function listStudentPageRequest(data) {
    return myAxios.get('/admin/user', {
        params: data
    })
}

// 修改学生信息
export function updateStudentRequest(company) {
    return myAxios.post('/admin/company', company)
}

// 批量删除学生
export function deleteStudentByIdsRequest(ids) {
    return myAxios.delete('/admin/user', {
        data: {
            ids
        }
    })
}

// 条件搜索
export function searchStudentPageRequest(student){
    return myAxios.get('/admin/user/like', {
        params: student
    })
}

// 添加学生
export function addStudentRequest(student) {
    return myAxios.put('/admin/add/user', student)
}
