import myAxios from "../../plugins/myAxios.js";

// 学生查看招聘首页

export function searchRecruitmentRequest(data){
    return myAxios.get('/user/list/chief', {
        params: data
    })
}

// 查看某个岗位的具体信息
export function getCurrentRecruitmentRequest(id){
    return myAxios.get('/user/chief', {
        params: {
            id
        }
    })
}

// 登录
export function loginRequest(data) {
    return myAxios.post('/user/login', data)
}

// 用户注册
export function registerUserRequest(data) {
    return myAxios.post('/user/register', data)
}

// 企业注册
export function registerCompanyRequest(data) {
    return myAxios.post('/company/register', data)
}

// 根据 id, role 获取用户信息
export function getUserInfoRequest(id, role){
    return myAxios.post('/common/getInfo', {
        id,
        role
    })
}

// 修改用户
export function updateUserInfoRequest(userInfo){
    return myAxios.post('/user/update', userInfo)
}

// 根据用户id获取简历信息
export function getResumeInfoRequest(id){
    return myAxios.get('/user/note', {
        params: {
            id
        }
    })
}

// 修改简历
export function updateResumeInfoRequest(resumeInfo){
    return myAxios.post('/user/note', resumeInfo)
}

// 投简历
export function sendResumeRequest(userId, companyId, chiefId){
    return myAxios.put('/user/commit/note', {
        userId,
        companyId,
        chiefId
    })
}

// 发表文章
export function createBlogRequest(blog){
    return myAxios.post('/blog/add', blog)
}

// 按类型、标题搜索文章
export function searchBlogRequest(blog){
    return myAxios.get('/blog/list', {
        params: blog
    })
}

export function searchReportBlogRequest(blog){
    return myAxios.get('/admin/blog/report', {
        params: blog
    })
}

// 点赞
export function blogLikeRequest(userId, blogId){
    return myAxios.post('/blog/like', {
        userId,
        blogId
    })
}

// 收藏
export function blogCollectRequest(userId, blogId){
    return myAxios.post('/blog/collect', {
        userId,
        blogId
    })
}

// 获取一级评论
export function getBlogCommentLevel1Request(blogId){
    return myAxios.get('/blogComment', {
        params: {
            blogId
        }
    })
}

// 获取二级评论
export function getBlogCommentLevel2Request(CommentLevel1Id){
    return myAxios.get('/blogComment/getDetail', {
        params: {
            id: CommentLevel1Id
        }
    })
}

// 发评论
export function addCommentRequest(data){
    return myAxios.post('/blogComment/add',data)
}

// 举报文章
export function reportBlogRequest(blogId, userId){
    return myAxios.post('/blog/report', {
        blogId,
        userId
    })
}

// 举报评论
export function reportBlogCommentRequest(commentId){
    return myAxios.post('/blogComment/report', {
        commentId
    })
}

// 获取用户收藏文章
export function listCollectBlogRequest(userId){
    return myAxios.get('/user/share', {
        params: {
            id: userId
        }
    })
}

// 获取用户写的文章
export function listUserBlogRequest(userId) {
    return myAxios.get('/blog/me', {
        params: {
            userId
        }
    })
}

// 删除用户写的文章
export function deleteUserBlogRequest(blogId){
    return myAxios.delete('/blog', {
        data: {
            blogId
        }
    })
}

// 删除用户收藏
export function deleteCollectBlogRequest(blogId,userId){
    return myAxios.delete('/user/delete/share', {
        data: {
            blogId,
            userId
        }
    })
}






