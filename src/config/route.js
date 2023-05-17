import Index from "../pages/user/Index.vue";
import StudentCenter from "../pages/root/userCenter/StudentCenter.vue";
import CompanyCenter from "../pages/root/userCenter/CompanyCenter.vue";
import Recruitment from "../pages/company/Recruitment.vue";
import RecruitmentCheck from "../pages/root/check/RecruitmentCheck.vue";
import CurrentRecruitment from "../pages/user/CurrentRecruitment.vue";
import Community from "../pages/user/Community.vue";
import Login from "../pages/Login.vue";
import UserDetail from "../pages/user/UserDetail.vue";
import Task from "../pages/company/Task.vue";
import Resume from "../pages/company/Resume.vue";
import CompanyDetail from "../pages/company/CompanyDetail.vue";
import BlogCheck from "../pages/root/check/BlogCheck.vue";
import NoticeCenter from "../pages/root/userCenter/NoticeCenter.vue";
import UserMessage from "../pages/user/UserMessage.vue";
import CompanyTaskCenter from "../pages/user/CompanyTaskCenter.vue";
import CompanyMessage from "../pages/company/CompanyMessage.vue";
import CommentCheck from "../pages/root/check/CommentCheck.vue";

const routes = [
    {
        path: '/index',
        component: Index,
        meta: { roles: ['user', 'company']},
    },
    { path: '/login', component: Login, },
    { path: '/', redirect: '/index' },
    {
        path: '/company',
        meta: { roles: ['company']},
        children: [
            {
                path: 'recruitment',
                component: Recruitment,
                meta: { roles: ['company']},
            },
            {
                path: 'resume',
                component: Resume,
                meta: { roles: ['company']},
            },
            {
                path: 'task',
                component: Task,
                meta: { roles: ['company']},
            },
            {
                path: 'companyDetail',
                component: CompanyDetail,
                meta: {roles: ['company']},
            },
            {
                path: 'companyMessage',
                component: CompanyMessage,
                meta: {roles: ['company']},
            },
        ]
    },
    {
        path: '/root',
        meta: {roles: ['admin']},
        children: [
            {
                path: 'center/studentCenter',
                component: StudentCenter,
                meta: {roles: ['admin']},
            },
            {
                path: 'center/companyCenter',
                component: CompanyCenter,
                meta: {roles: ['admin']},
            },
            {
                path: 'center/noticeCenter',
                component: NoticeCenter,
                meta: {roles: ['admin']},
            },
            {
                path: 'check/recruitmentCheck',
                component: RecruitmentCheck,
                meta: {roles: ['admin']},
            },
            {
                path: 'check/blogCheck',
                component: BlogCheck,
                meta: {roles: ['admin']},
            },
            {
                path: 'check/commentCheck',
                component: CommentCheck,
                meta: {roles: ['admin']},
            },

        ]
    },
    {
        path: '/user',
        meta: {roles: ['user']},
        children: [
            {
                path: 'currentRecruitment',
                component: CurrentRecruitment,
                meta: {roles: ['user']},

            },
            {
                path: 'community',
                component: Community,
                meta: {roles: ['user']},

            },
            {
                path: 'userDetail',
                component: UserDetail,
                meta: {roles: ['user']},
            },
            {
                path: 'userMessage',
                component: UserMessage,
                meta: {roles: ['user']},
            },
            {
                path: 'companyTaskCenter',
                component: CompanyTaskCenter,
                meta: {roles: ['user']},
            },
        ]
    }
]

export default routes;
