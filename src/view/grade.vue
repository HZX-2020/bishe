<template>
<el-card class="box-card">
  <div class="top-box">
    <el-button type="primary" @click="add"><el-icon><Plus /></el-icon>添加年级</el-button>
    <el-popconfirm title="确定批量删除?" 
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="selectDel">   
          <template #reference>
            <el-button
              type="danger"
              :disabled="selectArr.length == 0"
              ><el-icon><Delete /></el-icon>批量删除</el-button
            >
          </template>
        </el-popconfirm>
    
    <div>年级名称：</div>
    <el-input v-model="keyword" placeholder="输入关键字" class="input-select">
      <template #append>
        <el-button @click="search">搜索</el-button>
      </template>
    </el-input>
    <el-button type="info" @click="reset">重置</el-button>
  </div>
  <el-table
    v-loading="loading"
    :data="tableData"
    style="width: 100%"
    ref="multipleTableRef"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="Id" width="80" />
    <el-table-column prop="name" label="名称" width="180" />
    <el-table-column prop="manager" label="年级主任" />
    <el-table-column prop="telephone" label="联系电话" />
    <el-table-column prop="email" label="邮箱" />
    <el-table-column
      prop="introduction"
      label="年级介绍"
      show-overflow-tooltip
    />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click="editGrade(scope.row)"
          >修改</el-button
        >
        <el-popconfirm title="确定删除?" 
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="deleteGrade(scope.row)">   
          <template #reference>
            <el-button
                link
                type="danger"
                size="small"
                >删除</el-button
              >
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
    <template #empty>
      <el-empty description="暂无数据" />
    </template>
  </el-table>
  <div class="page-pagination">
    <el-pagination
      background
      layout="prev, pager, next"
      v-model:currentPage="page"
      v-model:page-size="size"
      @current-change="pageChange"
      :total="total"
    />
  </div>
</el-card>
  <!-- 添加 修改弹窗 -->
  <el-dialog v-model="dialogFormVisible" :title="title" width="40%">
    <el-form
      :model="form"
      ref="ruleFormRef"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入年级名称"/>
      </el-form-item>
      <el-form-item label="年级主任" prop="manager">
        <el-input v-model="form.manager" autocomplete="off" placeholder="请输入年级主任姓名"/>
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="form.telephone" autocomplete="off" placeholder="请输入联系电话"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" autocomplete="off" placeholder="请输入邮箱"/>
      </el-form-item>
      <el-form-item label="年级介绍">
        <el-input
          v-model="form.introduction"
          maxlength="100"
          show-word-limit
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="请输入年级介绍"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted } from "vue";
import {
  getGradesApi,
  saveOrUpdateGradeApi,
  deleteGradeApi,
} from "../api/grade";
const formLabelWidth = "140px";
const title = ref("");
const total = ref(0); // 分页总数
const page = ref(1);
const size = ref(10);
const loading = ref(false);
const keyword = ref("");
const selectArr = ref([]); // 选中的行id数组
const dialogFormVisible = ref(false); //修改 添加弹窗
const form = reactive({
  id: "",
  name: "",
  manager: "",
  telephone: "",
  email: "",
  introduction: "",
});
const tableData = ref([]);
const ruleFormRef = ref(); // 表单校验
const rules = reactive({
  name: [{ required: true, message: "年级名称必填", trigger: "change" }],
  manager: [{ required: true, message: "年级主任姓名必填", trigger: "change" }],
  telephone: [
    { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: "请输入正确的手机号" },
    { required: true, message: "联系电话必填", trigger: "change" },
  ],
  email: [
    {
      pattern:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: "请输入正确的邮箱",
    },
    { required: true, message: "邮箱必填", trigger: "change" },
  ],
});
await getGrades();

async function getGrades() {
  loading.value = true;
  const { code, data, message } = await getGradesApi(
    page.value,
    size.value,
    keyword.value
  );
  loading.value = false;

  if (code == 200) {
    tableData.value = data.records || [];
    total.value = data.total;
  } else {
    ElMessage.error(message);
  }
}
// 添加年级按钮事件
function add() {
  title.value = "添加年级信息";
  dialogFormVisible.value = true;
 
}
// 修改年级
function editGrade(item) {
  title.value = "修改信息";
  form.name = item.name;
  form.manager = item.manager;
  form.telephone = item.telephone;
  form.email = item.email;
  form.introduction = item.introduction;
  form.id = item.id;
  console.log(form);
  dialogFormVisible.value = true;
}
// 删除年级
async function deleteGrade(item) {
  loading.value = true;
  const bodyData = [item.id];
  const { code, message } = await deleteGradeApi(bodyData);
  loading.value = false;

  if (code == 200) {
    ElMessage.success(message);
    getGrades();
  } else {
    ElMessage.error(message);
  }
}
// 批量删除
async function selectDel() {
  loading.value = true;
  const bodyData = selectArr.value;
  const { code, message } = await deleteGradeApi(bodyData);
  loading.value = false;

  if (code == 200) {
    ElMessage.success(message);
    getGrades();
  } else {
    ElMessage.error(message);
  }
}
// 搜索
function search() {
  page.value = 1;
  getGrades();
}
// 列选中状态 触发
function handleSelectionChange(val) {
  selectArr.value = [];
  val.forEach((it) => {
    selectArr.value.push(it.id);
  });
}

// 添加
async function saveForm() {
  ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      const { code, message } = await saveOrUpdateGradeApi(form);
      loading.value = false;

      if (code == 200) {
        ElMessage.success(message);
        // 清空表单数据
        clearForm();
        // 关闭弹窗
        dialogFormVisible.value = false;
        //  刷新列表
        getGrades();
      } else {
        ElMessage.error(message);
      }
    }
  });
}
// 重置搜索条件
function reset() {
  keyword.value = ''
  getGrades();
}

function clearForm() {
  const keys = Object.keys(form);
  let obj = {};
  keys.forEach((item) => {
    obj[item] = "";
  });
  Object.assign(form, obj);
}

// 分页事件
function pageChange(v) {
  console.log(typeof v);
  page.value = v;
  getGrades();
}
</script>

<style scoped lang="less">
.top-box {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
}
.input-select {
  width: 30%;
}

.page-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
