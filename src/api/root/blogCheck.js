import myAxios from "../../plugins/myAxios.js";

// 管理员查看被举报和带审核的文章
export function listBlogByAdminRequest(){
    return myAxios.get('/admin/blog/report')
}

// 通过被举报文章和审核文章
export function passReportBlogRequest(data){
    return myAxios.post('/admin/check/blog', data)
}
