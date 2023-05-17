import myAxios from "../../plugins/myAxios.js";


export function getUserChatListRequest(userId){
    return myAxios.get('/user/list/chat', {
        params: {
            userId
        }
    })
}

export function addUserChatListRequest(sendId, receiveId){
    return myAxios.post('/common/add/relation', {
        sendId, receiveId
    })
}

export function getUserChatHistoryRequest(userChatId){
    return myAxios.get('/user/memory', {
        params: {
            userChatId
        }
    })
}
