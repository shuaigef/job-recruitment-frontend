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
                            label="岗位名称"
                    >
                        <a-input v-model:value="formState.chiefName" placeholder="请输入名称"></a-input>
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
        <a-table
                :columns="columns"
                :data-source="recruitmentCheckDataList"
                :pagination="pagination"
                :row-key="record => record.id"
                :scroll="{ x: 1300, y: 1000 }"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'operation'">
                    <span>
                        <a @click="passRecruitment(record.id)">通过</a>
                    </span>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {passRecruitmentRequest, searchRecruitmentCheckPageRequest} from "../../../api/root/recruitmentCheck.js";
import {message} from "ant-design-vue";


const recruitmentCheckDataList = ref([])

// 分页配置项
const pagination = reactive({
    current: ref(1),
    pageSize: ref(10),
    total: ref(recruitmentCheckDataList.value.length),
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
});

const searchRecruitmentCheck = async (data) => {
    await searchRecruitmentCheckPageRequest(data)
        .then((res) => {
            console.log('onMounted res', res)
            recruitmentCheckDataList.value = res.data
        })
}

onMounted(async () => {
    await searchRecruitmentCheckPageRequest(formState)
        .then((res) => {
            console.log('onMounted resume', res)
            recruitmentCheckDataList.value = res.data
        })
})

const search = values => {
    console.log('Received values of form: ', values);
    console.log('formState: ', formState);
    searchRecruitmentCheck(values)
};

// 表头
const columns = [
    {
        title: '公司名称',
        dataIndex: 'companyName',
        fixed: 'left',
        width: 100
    },
    {
        title: '岗位名称',
        dataIndex: 'chiefName',
        fixed: 'left',
        width: 100
    }, {
        title: '公司地址',
        dataIndex: 'companyAddress',
    }, {
        title: '行业',
        dataIndex: 'companyIndustry',
    }, {
        title: '状态',
        dataIndex: 'chiefStatus',
    }, {
        title: '岗位薪资',
        dataIndex: 'chiefSalary',
    }, {
        title: '岗位描述',
        dataIndex: 'chiefDescription',
    }, {
        title: '岗位要求',
        dataIndex: 'chiefCommand',
    }, {
        title: '工作时间',
        dataIndex: 'chiefTime',
    }, {
        title: '招聘人数',
        dataIndex: 'chiefHc',
    }, {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 100
    }];

const passRecruitment = async (id) => {
    console.log('id', id)
    await passRecruitmentRequest(id)
        .then(res => {
            console.log('passRecruitment', res)
            if (res.data) {
                message.success('通过成功')
            } else {
                message.error('通过成功')
            }
        })
    await searchRecruitmentCheck(formState)
}



</script>

<style scoped>

</style>
