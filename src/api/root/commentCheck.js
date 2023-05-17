import myAxios from "../../plugins/myAxios.js";
import {passReportBlogRequest} from "./blogCheck.js";

// 获取被举报评论
export function searchCommentReportListRequest(data){
    return myAxios.get('/admin/reportComment', {
        params: data
    })
}

// 管理员审核评论
export function passReportCommentRequest(commentId, choice){
    return myAxios.post('/admin/blogComment', {
        commentId, choice
    })
}
