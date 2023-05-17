<template>
    <a-row style="margin: 40px 0" :gutter="[32,48]">
        <!--导航菜单-->
        <a-col :span="6" :offset="2">
            <a-card title="消息中心"
                    :headStyle="{
                        fontSize: '32px'
                    }"
                    :bodyStyle="{
                        padding: '0',

                    }"
            >
                <a-menu
                        key="center"
                        style="text-align: center; font-size: 20px"
                        @click="toPage"
                >
                    <a-menu-item key="myMessage">我的消息</a-menu-item>
                    <a-menu-item key="systemNotice">系统通知</a-menu-item>
                </a-menu>
            </a-card>
        </a-col>
        <!--我的消息-->
        <a-col v-if="menuName === 'myMessage'" :span="14">
            <a-layout>
                <a-layout-sider style="height: 575px; background-color: white; border: #CCCCCC 1px solid">
                    <template v-for="remoteUser in remoteUserList" :key="remoteUser.userChatId">
                        <a-card
                            :hoverable="true"
                            :bodyStyle="{
                            padding: '10px'
                        }"
                            @click="clickRemoteUser(remoteUser)"
                        >
                            <a-card-meta>
                                <template #avatar>
                                    <a-avatar :size="48" :src="remoteUser.receiveAvatar"/>
                                </template>
                                <template #title>
                                    <span>{{ remoteUser.receiveName }}</span>
                                </template>
                            </a-card-meta>
                        </a-card>
                    </template>
                </a-layout-sider>
                <a-layout>
                    <a-layout-header style="padding: 0; height: 50px; background-color: white; border: #CCCCCC 1px solid; border-left: 0; border-bottom: 0; text-align: center">
                        <span style="font-size: 18px">{{ remoteUser.receiveName }}</span>
                    </a-layout-header>
                    <a-layout-content style="background-color: white;padding: 0;border: #CCCCCC 1px solid; border-left: 0; overflow-y: scroll; height: 375px">
                        <template v-for="(chatData, index) in remoteUserMessageHistory" :key="index">
                            <a-card>
                                <a-card-meta>
                                    <template #avatar>
                                        <a-avatar :size="40" :src="chatData.fromAvatar"/>
                                    </template>
                                    <template #title>
                                        <span>{{ chatData.fromName }}</span>
                                    </template>
                                    <template #description>
                                        <span>{{ chatData.content }}</span>
                                    </template>
                                </a-card-meta>
                            </a-card>
                        </template>
                    </a-layout-content>
                    <a-layout-footer
                        style="position: relative;padding: 0; height: 150px; background-color: white; border: 1px #CCCCCC solid; border-left: 0;border-top: 0;"
                    >
                        <a-textarea
                            style="background-color: white ;height: 80%; border: 0; "
                            :autoSize="{ minRows: 4, maxRows: 4 }"
                            :maxlength="500"
                            v-model:value="text"
                        />
                        <a-button style="position: absolute; right: 10px; bottom: 10px; width: 100px" type="primary"
                            @click="send"
                        >
                            发送
                        </a-button>
                    </a-layout-footer>
                </a-layout>
            </a-layout>
        </a-col>
        <!--系统通知-->
        <a-col v-if="menuName === 'systemNotice'" :span="14">
            <a-card
                :headStyle="{
                    fontSize: '28px',
                }"
                :bodyStyle="{
                    padding: 0
                }"
                title="系统通知"
            >
                <div v-for="systemNotice in systemNoticeDataList" :key="systemNotice.id">
                    <a-card>
                        <a-card-meta>
                            <template #title>
                                <span style="font-size: 20px">{{ systemNotice.informationTitle }}</span>
                                <span style="margin-left: 20px">{{ systemNotice.createTime}}</span>
                            </template>
                            <template #description>
                                <span style="font-size: 16px">{{ systemNotice.informationContent }}</span>
                            </template>
                        </a-card-meta>
                    </a-card
                        >
                </div>
            </a-card>
        </a-col>
    </a-row>

</template>

<script setup>
import {onMounted, ref} from "vue";
import {listSystemMessageRequest} from "../../api/user/userMessage.js";
import {useRouteStore, useTalkStore} from "../../store/index.js";
import {storeToRefs} from "pinia";
import {getUserInfoRequest} from "../../api/user/index.js";
import {message} from "ant-design-vue";
import {
    getUserChatHistoryRequest,
    getUserChatListRequest
} from "../../api/user/talk.js";

const routeStore = useRouteStore()
const { currentUserId,currentUserRole } = storeToRefs(routeStore)
const talkStore = useTalkStore()
const { chatCompanyName, chatCompanyAvatar } = storeToRefs(talkStore)

const systemNoticeDataList = ref([])

const menuName = ref('myMessage')
const toPage = ({ key }) => {
    menuName.value = key
    console.log('menuName', menuName.value)
}

const nowUser = ref({})
const remoteUser = ref({})

const remoteUserMessageHistory = ref([])
const isClick = ref(false)
const clickRemoteUser = async (remoteUserData) => {
    remoteUser.value = remoteUserData
    await getUserChatHistoryRequest(remoteUser.value.userChatId)
        .then(res => {
            console.log('getUserChatHistoryRequest', res)
            remoteUserMessageHistory.value = res.data
        })
    init()
}

onMounted(async () => {

    await listSystemMessageRequest(currentUserId.value)
        .then(res => {
            console.log('获取系统通知', res)
            systemNoticeDataList.value = res.data
            // console.log('systemNoticeDataList', systemNoticeDataList.value[0].informationTitle)
        })
    await getUserInfoRequest(currentUserId.value, currentUserRole.value)
        .then(res => {
            console.log('getUserInfoRequest', res)
            userInfo.value = res.data
            nowUser.value = {
                nowUserId: userInfo.value.id,
                nowUserName: userInfo.value.userName,
                nowUserAvatar: userInfo.value.avatarUrl
            }
        })
    await getUserChatListRequest(userInfo.value.id)
        .then(res => {
            console.log('获取聊天列表', res)
            remoteUserList.value = res.data

        })
})

const userInfo = ref({})
const remoteUserList = ref([])
const text = ref("")
let socket

const send = () => {
    if (!remoteUser.value) {
        message.warn('请选择聊天对象')
        return;
    }
    if (!text.value) {
        message.warn('请输入内容')
    } else {
        if (typeof (WebSocket) == "undefined") {
            console.log("您的浏览器不支持WebSocket");
        } else {
            console.log("您的浏览器支持WebSocket");
            // 组装待发送的消息 json
            // {"from": {nowUserId: '1', nowUserName: '名称', nowUserAvatar: ''}, "to": {remoteUserId: '1', remoteUserName: '名称', remoteUserAvatar: ''}, "text": "聊天文本"}
            // let message = {from: nowUser.value, to: remoteUser.value, text: text.value}
            // socket.send(JSON.stringify(message));  // 将组装好的json发送给服务端，由服务端进行转发
            socket.send(text.value);  // 将组装好的json发送给服务端，由服务端进行转发
            console.log('message', message)
            // 构建消息内容，本人消息
            // remoteUserMessageHistory.value.push({remoteUser: null, nowUser: nowUser.value, message: text.value})
            remoteUserMessageHistory.value.push({fromName: userInfo.value.userName, fromAvatar: userInfo.value.avatarUrl, content: text.value})
            console.log('remoteUserMessageHistory', remoteUserMessageHistory.value)
            // createContent(remoteUser.value, nowUser.value, text.value)
            text.value = '';
        }
    }
}


const init = () => {
    let userChatId = remoteUser.value.userChatId
    if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
    } else {
        console.log("您的浏览器支持WebSocket");
        let socketUrl = "ws://localhost:8080/api/chat/" + userChatId;
        if (socket != null) {
            socket.close();
            socket = null;
        }
        // 开启一个websocket服务
        socket = new WebSocket(socketUrl);
        //打开事件
        socket.onopen = function () {
            console.log("websocket已打开");
        };
        //  浏览器端收消息，获得从服务端发送过来的文本消息
        socket.onmessage = function (msg) {
            console.log("收到数据====" + msg.data)
            let data = JSON.parse(msg.data)  //
            //  // {fromName:"zhang", fromAvatar:'', "content": "hello"}
            if (data.fromName === remoteUser.value.receiveName) {
                // 构建消息内容
                // remoteUserMessageHistory.value.push({remoteUser: { remoteUserName: data.fromName, remoteUserAvatar: data.fromAvatar }, nowUser: null, message: data.content})
                remoteUserMessageHistory.value.push(data)
                console.log('remoteUserMessageHistory', remoteUserMessageHistory.value)
                // createContent(data.from, null, data.content)
            }
        };
        //关闭事件
       /* socket.onclose = function () {
            console.log("websocket已关闭");
        };*/
        //发生了错误事件
       /* socket.onerror = function () {
            console.log("websocket发生了错误");
        }*/
    }
}

const createContent = (remoteUser, nowUser, text) => {  // 这个方法是用来将 json的聊天消息数据转换成 html的。
    console.log('remoteUser', remoteUser)
    console.log('nowUser', nowUser)
    console.log('text', text)
    remoteUserMessageHistory.value.push({
        remoteUser,
        nowUser,
        text
    })

}



</script>

<style scoped>

</style>
