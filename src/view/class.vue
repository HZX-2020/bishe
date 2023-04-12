<template>
  <el-card class="box-card">
    <div class="top-box">
      <el-button type="primary" @click="add"
        ><el-icon><Plus /></el-icon>添加班级</el-button
      >
      <el-button
        type="danger"
        :disabled="selectArr.length == 0"
        @click="selectDel"
        ><el-icon><Delete /></el-icon>批量删除</el-button
      >
      <span>年级名称：</span>
      <el-select
        v-model="gradeName"
        class="m-2"
        placeholder="选择年级"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <div>班级名称：</div>
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
      <el-table-column prop="name" label="班级名称" width="180" />
      <el-table-column prop="number" label="班级人数" width="180" />
      <el-table-column prop="headmaster" label="班主任" />
      <el-table-column prop="telephone" label="联系电话" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column
        prop="introduction"
        label="班级介绍"
        show-overflow-tooltip
      />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="editClass(scope.row)"
            >修改</el-button
          >
          <el-button
            link
            type="danger"
            size="small"
            @click="deleteClass(scope.row)"
            >删除</el-button
          >
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
  <!-- <el-empty v-if="tableData.length == 0" description="description" /> -->
  <!-- 添加 修改弹窗 -->
  <el-dialog v-model="dialogFormVisible" :title="title" width="40%">
    <el-form
      :model="form"
      ref="ruleFormRef"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="班级名称" prop="name">
        <el-input
          v-model="form.name"
          autocomplete="off"
          placeholder="请输入班级名称"
        />
      </el-form-item>
      <el-form-item label="班级人数" prop="number">
        <el-input-number
          v-model="form.number"
          :min="0"
          autocomplete="off"
          placeholder="请输入班级人数"
        />
      </el-form-item>
      <el-form-item label="班主任姓名" prop="headmaster">
        <el-input
          v-model="form.headmaster"
          autocomplete="off"
          placeholder="请输入班主任姓名"
        />
      </el-form-item>
      <el-form-item label="班主任电话" prop="telephone">
        <el-input
          v-model="form.telephone"
          autocomplete="off"
          placeholder="请输入班主任电话"
        />
      </el-form-item>
      <el-form-item label="班主任邮箱" prop="email">
        <el-input
          v-model="form.email"
          autocomplete="off"
          placeholder="请输入班主任邮箱"
        />
      </el-form-item>
      <el-form-item label="所属年级" prop="gradeName">
        <el-select
          v-model="form.gradeName"
          class="m-2"
          placeholder="选择年级"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班级介绍">
        <el-input
          v-model="form.introduction"
          maxlength="100"
          show-word-limit
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="请输入班级介绍"
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
import { getGradesAllApi } from "../api/grade";
import {
  getClassApi,
  saveOrUpdateClassApi,
  deleteClassApi,
} from "../api/class";
const formLabelWidth = "140px";
const title = ref("");
const total = ref(0); // 分页总数
const page = ref(1);
const size = ref(10);
const loading = ref(false);
const keyword = ref("");
const selectArr = ref([]); // 选中的行id数组
const dialogFormVisible = ref(false); //修改 添加弹窗
const options = ref([]); // 年级列表
const gradeName = ref("");
const form = reactive({
  id: "",
  name: "",
  number: 0,
  headmaster: "",
  telephone: "",
  email: "",
  gradeName: "",
  introduction: "",
});
const tableData = ref([]);
const ruleFormRef = ref(); // 表单校验
const rules = reactive({
  name: [{ required: true, message: "班级名称必填", trigger: "change" }],
  number: [{ required: true, message: "班级人数必填", trigger: "change" }],
  headmaster: [
    { required: true, message: "班级任姓名必填", trigger: "change" },
  ],
  telephone: [
    { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: "请输入正确的手机号" },
    { required: true, message: "班主任电话必填", trigger: "change" },
  ],
  email: [
    {
      pattern:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: "请输入正确的邮箱",
    },
    { required: true, message: "班主任邮箱必填", trigger: "change" },
  ],
  gradeName: [{ required: true, message: "年级名称必选", trigger: "change" }],
});
// 查询所有年级
getGrades();
// 查询班级列表
await getClass();

async function getGrades() {
  loading.value = true;
  const { code, data, message } = await getGradesAllApi();
  loading.value = false;
  if (code == 200) {
    options.value = data;
  } else {
    ElMessage.error(message);
  }
}
async function getClass() {
  loading.value = true;
  const { code, data, message } = await getClassApi(
    page.value,
    size.value,
    gradeName.value,
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
// 添加班级按钮事件
function add() {
  title.value = "添加班级信息";
  dialogFormVisible.value = true;
}
// 修改班级
function editClass(item) {
  title.value = "修改信息";
  form.name = item.name;
  form.headmaster = item.headmaster;
  form.telephone = item.telephone;
  form.email = item.email;
  form.gradeName = item.gradeName;
  form.introduction = item.introduction;
  form.id = item.id;
  form.number = item.number;
  dialogFormVisible.value = true;
}
// 删除班级
async function deleteClass(item) {
  loading.value = true;
  const bodyData = [item.id];
  const { code, message } = await deleteClassApi(bodyData);
  loading.value = false;

  if (code == 200) {
    ElMessage.success(message);
    getClass();
  } else {
    ElMessage.error(message);
  }
}
// 批量删除
async function selectDel() {
  loading.value = true;
  const bodyData = selectArr.value;
  const { code, message } = await deleteClassApi(bodyData);
  loading.value = false;

  if (code == 200) {
    ElMessage.success(message);
    getClass();
  } else {
    ElMessage.error(message);
  }
}
// 搜索
function search() {
  page.value = 1;
  getClass();
}
// 列选中状态 触发
function handleSelectionChange(val) {
  selectArr.value = [];
  val.forEach((it) => {
    selectArr.value.push(it.id);
  });
}

// 添加
function saveForm() {
  ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      const { code, message } = await saveOrUpdateClassApi(form);
      loading.value = false;

      if (code == 200) {
        ElMessage.success(message);
        // 清空表单数据
        clearForm();
        // 关闭弹窗
        dialogFormVisible.value = false;
        //  刷新列表
        getClass();
      } else {
        ElMessage.error(message);
      }
    }
  });
}
// 重置搜索条件
function reset() {
  keyword.value = "";
  gradeName.value = "";
  getClass();
}
function clearForm() {
  const keys = Object.keys(form);
  let obj = {};
  keys.forEach((item) => {
    obj[item] = "";
  });
  obj.number = 0;
  Object.assign(form, obj);
}

// 分页事件
function pageChange(v) {
  console.log(typeof v);
  page.value = v;
  getClass();
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
