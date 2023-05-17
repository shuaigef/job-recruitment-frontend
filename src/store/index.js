import {defineStore} from "pinia";
import {ref} from "vue";

export const useIndexStore = defineStore('index', () => {
    const currentRecruitmentId = ref()
    const currentCompanyId = ref()

    return { currentRecruitmentId, currentCompanyId }
})

export const useRouteStore = defineStore('route', () => {
    const currentUserRole = ref(localStorage.getItem('role'))
    const currentUserId = ref(localStorage.getItem('userId'))
    const currentUser = ref({
        userName: '',
        avatarUrl: '',
        gender: '',
        phone: '',
        userEmail: ''
    })
    const currentCompany = ref({
        companyAccount: '',
        companyName: '',
        companyIndustry: '',
        scale: '',
        address: '',
        companyEmail: '',
        companyPhone: '',
        mark: ''
    })
    const currentAdmin = ref({
        adminAccount: ''
    })

    function logout() {
        localStorage.removeItem('userId')
        localStorage.removeItem('role')
        this.currentUserId = 0
        this.currentUserRole = ''
        this.currentUser = {
            userName: '',
            avatarUrl: '',
            gender: '',
            phone: '',
            userEmail: ''
        }
        this.currentCompany = {
            companyAccount: '',
            companyName: '',
            companyIndustry: '',
            scale: '',
            address: '',
            companyEmail: '',
            companyPhone: '',
            mark: ''
        }
        this.currentAdmin = {
            adminAccount: ''
        }
    }

    return {
        currentUserRole,
        currentUserId,
        currentUser,
        currentCompany,
        currentAdmin,
        logout
    }
})

export const useTalkStore = defineStore('talk', () => {
    const chatCompanyName = ref('')
    const chatCompanyAvatar = ref('')

    const userChatList = ref([])

    return {
        chatCompanyName,
        chatCompanyAvatar,
        userChatList
    }
})

