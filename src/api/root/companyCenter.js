import myAxios from "../../plugins/myAxios.js";

// 分页获取企业信息列表
export function listCompanyPageRequest(data) {
    return myAxios.get('/admin/company', {
        params: data
    })
}

// 修改公司信息
export function updateCompanyRequest(company) {
    return myAxios.post('/admin/company', company)
}

// 批量删除公司
export function deleteCompanyByIdsRequest(ids) {
    return myAxios.delete('/admin/company', {
        data: {
            ids
        }
    })
}

// 条件搜索
export function searchCompanyPageRequest(company) {
    return myAxios.get('/admin/company/like', {
        params: company
    })
}

// 添加企业
export function addCompanyRequest(company) {
    return myAxios.put('/admin/add/company', company)
}
