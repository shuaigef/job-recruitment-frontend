import myAxios from "../../plugins/myAxios.js";

// 根据 companyId 获取企业信息
export function getCompanyInfoRequest(companyId){
    return myAxios.get('/company', {
        params: {
            id: companyId
        }
    })
}

// 修改企业信息
export function updateCompanyInfoRequest(company){
    return myAxios.post('/company/update', company)
}
