<template>
  <!--搜索-->
    <div style="margin: 20px 0">
        <a-form
                ref="formRef"
                name="advanced_search"
                class="ant-advanced-search-form"
                :model="formState"
                @finish="search"
        >
            <a-row :gutter="24">
                <a-col :span="8">
                    <a-form-item
                            name="noticeTitle"
                            label="项目名称"
                    >
                        <a-input v-model:value="formState.noticeTitle" placeholder="请输入通告名称"></a-input>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="24" style="text-align: right">
                    <a-button type="primary" html-type="submit">搜索</a-button>
                    <a-button style="margin: 0 8px" @click="() => formRef.resetFields()">清空</a-button>
                </a-col>
            </a-row>
        </a-form>
    </div>
  <!--数据表格-->
    <div>
        <div style="margin: 16px 0">
            <a-button type="primary" :disabled="!hasSelected" :loading="state.loading" @click="deleteNotice">
                删除
            </a-button>
            <a-button style="margin-left: 10px" type="primary" :loading="state.loading" @click="addNoticeButton">
                添加
            </a-button>
        </div>
        <a-table
                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange, fixed: true }"
                :columns="columns"
                :data-source="noticeDataList"
                :pagination="pagination"
                :row-key="record => record.id"
                :scroll="{ x: 1300, y: 1000 }"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'noticeContent'">
                    <div>
                        <a-textarea
                            v-if="editableData[record.id]"
                            v-model:value="editableData[record.id][column.dataIndex]"
                            :auto-size="true"
                        />
                        <template v-else>
                            {{ text }}
                        </template>
                    </div>
                </template>
                <template v-else-if="column.dataIndex !== 'operation'">
                    <div>
                        <a-input
                                v-if="editableData[record.id]"
                                v-model:value="editableData[record.id][column.dataIndex]"
                                style="margin: -5px 0"
                        />
                        <template v-else>
                            {{ text }}
                        </template>
                    </div>
                </template>
<!--                <template v-else-if="column.dataIndex === 'operation'">
                    <div class="editable-row-operations">
                        <span v-if="editableData[record.id]">
                            <a-typography-link @click="save(record.id)">Save</a-typography-link>
                            <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.id)">
                                <a>Cancel</a>
                             </a-popconfirm>
                            </span>
                        <span v-else>
                            <a @click="edit(record.id)">编辑</a>
                        </span>
                    </div>
                </template>-->
            </template>
        </a-table>
        <!--新增通告弹窗-->
        <a-modal v-model:visible="visible" title="新增通告" @ok="handleOk" :footer="null">
            <a-form
                    :model="addFormState"
                    name="addNotice"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                    autocomplete="off"
                    @finish="addNotice"
            >
                <a-form-item
                        name="noticeTitle"
                        label="通告名称"
                >
                    <a-input v-model:value="addFormState.noticeTitle" placeholder="请输入通告名称"></a-input>
                </a-form-item>
                <a-form-item
                        name="noticeContent"
                        label="通告内容"
                >
                    <a-textarea :auto-size="{ minRows:6, maxRows:8 }" :maxlength="1000" show-count v-model:value="addFormState.noticeContent" placeholder="请输入通告内容"></a-textarea>
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                    <a-button type="primary" html-type="submit">创建项目</a-button>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref } from "vue";
import {cloneDeep} from "lodash-es";
import {message} from "ant-design-vue";
import {storeToRefs} from "pinia";
import {
    addNoticeRequest,
    deleteNoticeRequest,
    searchNoticeRequest,
    updateNoticeRequest
} from "../../../api/root/notice.js";
import {useRouteStore} from "../../../store/index.js";

const routeStore = useRouteStore()
const { currentUserId, currentUserRole } = storeToRefs(routeStore)

const noticeDataList = ref([])
const companyId = 2132

// 分页配置项
const pagination = reactive({
    current: ref(1),
    pageSize: ref(10),
    total: ref(noticeDataList.value.length),
    showTotal(total) {
        return '总共 ' + total + ' 条记录'
    },
    onChange(page, pageSize){
        console.log(page, pageSize)
        this.current = page
    }
})

const formRef = ref();
const formState = reactive({
    noticeTitle: '',
});

const searchNoticeList = async (data) => {
    // pagination.current = 1
    await searchNoticeRequest({
        ...data,
        adminId: currentUserId.value
    }).then((res) => {
        console.log('搜索通告', res)
        noticeDataList.value = res.data
    })
}

onMounted(async () => {
    await searchNoticeRequest({
        ...formState,
        companyId: currentUserId.value
    }).then((res) => {
        console.log('onMounted 搜索项目', res)
        noticeDataList.value = res.data
    })
})

const search = async values => {
    console.log('Received values of form: ', values);
    console.log('formState: ', formState);
    await searchNoticeList(values)
};

// 表头
const columns = [
    {
        title: '通告标题',
        dataIndex: 'noticeTitle',
        width: 200,
        fixed: 'left'
    }, {
        title: '通告内容',
        dataIndex: 'noticeContent',
    }, {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 200
    },
    /*{
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 80
    }*/
    ];

const state = reactive({
    selectedRowKeys: [],
    // Check here to configure the default column
    loading: false,
});

const hasSelected = computed(() => state.selectedRowKeys.length > 0);

const onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    state.selectedRowKeys = selectedRowKeys;
};

// 删除项目
const deleteNotice = async () => {
    await deleteNoticeRequest([...state.selectedRowKeys], currentUserId.value)
        .then(res => {
            console.log('删除项目', res)
            if (res.data) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        })
    await searchNoticeList(formState)
}

const updateNotice = async (updateNotice) => {
    await updateNoticeRequest(updateNotice)
        .then((res) => {
            console.log('修改项目', res)
        })
}

const editableData = reactive({});
const edit = id => {
    editableData[id] = cloneDeep(noticeDataList.value.filter(item => id === item.id)[0]);
};
const save = id => {
    Object.assign(noticeDataList.value.filter(item => id === item.id)[0], editableData[id]);
    updateNotice({
        noticeId: editableData[id].id,
        ...editableData[id]
    })
    delete editableData[id];
};
const cancel = id => {
    delete editableData[id];
};


const visible = ref(false);
const addNoticeButton = () => {
    visible.value = true;
}
const handleOk = e => {
    console.log(e);
    visible.value = false;
};

// 新增通告表单数据对象
const addFormState = ref({
    noticeTitle: '',
    noticeContent: ''
})

// 创建通告方法
const addNoticeMethod = async (addNotice) => {
    await addNoticeRequest({
        ...addNotice,
        adminId: currentUserId.value
    }).then(res => {
        console.log('添加通告', res)
        if (res.data){
            message.success('通告创建成功')
        } else {
            message.error('通告创建失败')
        }
    })
}

const addNotice = async values => {
    console.log('点击创建', values)
    await addNoticeMethod(values)
    visible.value = false;
    await searchNoticeList(formState)
};

</script>

<style scoped>

</style>
