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
                            name="chiefName"
                            label="名称"
                    >
                        <a-input v-model:value="formState.chiefName" placeholder="请输入名称"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item
                        name="chiefAddress"
                        label="地址"
                    >
                        <a-input v-model:value="formState.chiefAddress" placeholder="请输入地址"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item
                            name="chiefStatus"
                            label="状态"
                    >
                        <a-select v-model:value="formState.chiefStatus" placeholder="请选择状态">
                            <a-select-option value="审核">审核</a-select-option>
                            <a-select-option value="通过">通过</a-select-option>
                        </a-select>
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
        <div style="margin-bottom: 16px">
            <a-button type="primary" :disabled="!hasSelected" :loading="state.loading" @click="deleteRecruitment">
                删除
            </a-button>
            <a-button style="margin-left: 10px" type="primary" :loading="state.loading" @click="addRecruitmentButton">
                添加
            </a-button>
        </div>
        <a-table
                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange, fixed: true }"
                :columns="columns"
                :data-source="recruitmentDataList"
                :pagination="pagination"
                :row-key="record => record.id"
                :scroll="{ x: 1300, y: 1000 }"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="!['operation', 'chiefStatus'].includes(column.dataIndex) ">
                    <div>
                        <a-textarea
                                v-if="editableData[record.id]"
                                v-model:value="editableData[record.id][column.dataIndex]"
                                style="margin: -5px 0"
                        />
                        <template v-else>
                            {{ text }}
                        </template>
                    </div>
                </template>
                <template v-else-if="column.dataIndex === 'operation'">
                    <div class="editable-row-operations">
                        <span v-if="editableData[record.id]">
                            <span>
                                <a-typography-link @click="save(record.id)">保存</a-typography-link>
                            </span>
                            <span style="margin-left: 10px;">
                                <a-popconfirm title="确定取消吗?" @confirm="cancel(record.id)">
                                    <a>取消</a>
                                </a-popconfirm>
                            </span>
                        </span>
                        <span v-else>
                            <a @click="edit(record.id)">编辑</a>
                        </span>
                    </div>
                </template>
            </template>
        </a-table>
        <!--新增岗位弹窗-->
        <a-modal v-model:visible="visible" title="新增岗位" @ok="handleOk" :footer="null">
            <a-form
                :model="addFormState"
                name="basic"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }"
                autocomplete="off"
                @finish="onFinish"
            >
                <a-form-item
                    label="岗位名称"
                    name="chiefName"
                >
                    <a-input v-model:value="addFormState.chiefName" />
                </a-form-item>
                <a-form-item
                    label="岗位薪资"
                    name="chiefSalary"
                >
                    <a-input v-model:value="addFormState.chiefSalary" />
                </a-form-item>
                <a-form-item
                    label="工作地址"
                    name="chiefAddress"
                >
                    <a-input v-model:value="addFormState.chiefAddress" />
                </a-form-item>
                <a-form-item
                    label="岗位描述"
                    name="chiefDescription"
                >
                    <a-input v-model:value="addFormState.chiefDescription" />
                </a-form-item>
                <a-form-item
                    label="岗位要求"
                    name="chiefCommand"
                >
                    <a-input v-model:value="addFormState.chiefCommand" />
                </a-form-item>
                <a-form-item
                    label="工作时间"
                    name="chiefTime"
                >
                    <!--<a-range-picker v-model:value="addFormState.chiefTime" format="HH:mm:ss" />-->
                    <a-time-picker v-model:value="addFormState.chiefTime[0]" placeholder="开始时间" format="HH:mm:ss" value-format="HH:mm:ss" />
                    <span> - </span>
                    <a-time-picker v-model:value="addFormState.chiefTime[1]" placeholder="结束时间" format="HH:mm:ss" value-format="HH:mm:ss" />
                </a-form-item>
                <a-form-item
                    label="岗位人数"
                    name="chiefHc"
                >
                    <a-input v-model:value="addFormState.chiefHc" />
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                    <a-button type="primary" html-type="submit">提交</a-button>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref } from "vue";
import {cloneDeep} from "lodash-es";
import {
    addRecruitmentRequest,
    deleteRecruitmentByIdsRequest,
    searchRecruitmentPageRequest,
    updateRecruitmentRequest
} from "../../api/company/recruitment.js";
import {message} from "ant-design-vue";
import {useRouteStore} from "../../store/index.js";
import {storeToRefs} from "pinia";

const recruitmentDataList = ref([])
const routeStore = useRouteStore()
const { currentUserId } = storeToRefs(routeStore)

// 分页配置项
const pagination = reactive({
    current: ref(1),
    pageSize: ref(10),
    total: ref(recruitmentDataList.value.length),
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
    chiefName: '',
    chiefStatus: '',
    chiefAddress: ''
});

const searchRecruitmentList = async (data) => {
    // pagination.current = 1
    await searchRecruitmentPageRequest({
        ...data,
        companyId: currentUserId.value
    }).then((res) => {
        console.log('onMounted res', res)
        recruitmentDataList.value = res.data
    })
}

onMounted(async () => {
    await searchRecruitmentPageRequest({
        ...formState,
        companyId: currentUserId.value
    }).then((res) => {
        console.log('onMounted res', res)
        recruitmentDataList.value = res.data
    })
})

const search = values => {
    console.log('Received values of form: ', values);
    console.log('formState: ', formState);
    searchRecruitmentList(values)
};

// 表头
const columns = [
    {
        title: '名称',
        dataIndex: 'chiefName',
        fixed: 'left'
    }, {
        title: '薪水',
        dataIndex: 'chiefSalary',
    }, {
        title: '地址',
        dataIndex: 'chiefAddress',
    }, {
        title: '描述',
        dataIndex: 'chiefDescription',
    }, {
        title: '要求',
        dataIndex: 'chiefCommand',
    }, {
        title: '工作时间',
        dataIndex: 'chiefTime',
    }, {
        title: '岗位人数',
        dataIndex: 'chiefHc',
    }, {
        title: '岗位实际人数',
        dataIndex: 'chiefRealHc',
    }, {
        title: '岗位状态',
        dataIndex: 'chiefStatus',
    }, {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 150
    }];

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

// 删除岗位
const deleteRecruitment = async () => {
    await deleteRecruitmentByIdsRequest([...state.selectedRowKeys])
        .then(res => {
            console.log('deleteRecruitment', res)
            message.success('删除成功')
        })
    await searchRecruitmentList(formState)
}

const updateRecruitment = async (updateRecruit) => {
    await updateRecruitmentRequest(updateRecruit)
        .then((res) => {
            console.log('updateRecruit', res)
        })
}

const editableData = reactive({});
const edit = id => {
    editableData[id] = cloneDeep(recruitmentDataList.value.filter(item => id === item.id)[0]);
};
const save = id => {
    Object.assign(recruitmentDataList.value.filter(item => id === item.id)[0], editableData[id]);
    updateRecruitment({
        id: editableData[id].id,
        ...editableData[id]
    })
    delete editableData[id];
};
const cancel = id => {
    delete editableData[id];
};


const visible = ref(false);
const addRecruitmentButton = () => {
    visible.value = true;
}
const handleOk = e => {
    console.log(e);
    visible.value = false;
};

// 新增岗位表单数据对象
const addFormState = ref({
    chiefName: '',
    chiefSalary: '',
    chiefAddress: '',
    chiefDescription: '',
    chiefCommand: '',
    chiefTime: ['', ''],
    chiefHc: '',
})

const addRecruitment = async (addRecruitment) => {
    await addRecruitmentRequest({
        ...addRecruitment,
        chiefTime: addRecruitment.chiefTime[0] + '-' + addRecruitment.chiefTime[1],
        companyId: currentUserId.value
    }).then(res => {
        console.log('addRecruitment', res)
        if (res.code === 0) {
            visible.value = false;
            message.success('新增招聘成功!')
        } else {
            message.error('操作失败')
        }
    })
}

const onFinish = async values => {
    console.log('Success:', values);
    await addRecruitment(values)
    await searchRecruitmentList(formState)
};

</script>

<style scoped>

</style>
