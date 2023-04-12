<template>
  <div class="container" v-loading="loading">
    <div class="left">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>个人信息</span>
            <!-- <el-button class="button" text>编辑信息</el-button> -->
          </div>
        </template>
        <div class="text item">姓名：{{ user.name }}</div>
        <div class="text item">性别：{{ user.gender }}</div>
        <div class="text item">联系电话：{{ user.telephone }}</div>
        <div class="text item">邮箱：{{ user.email }}</div>
        <div class="text item">地址：{{ user.address }}</div>
      </el-card>
    </div>
    <div class="right">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>修改信息</span>
          </div>
        </template>
        <el-divider content-position="left">修改密码</el-divider>
        <el-button class="my-btn" @click="handlePwd">修改密码</el-button>
        <el-divider content-position="left">修改信息</el-divider>
        <el-button class="my-btn" @click="handleInfo">修改信息</el-button>
      </el-card>
    </div>
  </div>

  <!-- 添加 修改弹窗 -->
  <el-dialog v-model="showPassword" title="修改密码" width="40%">
    <el-form
      :model="passwordForm"
      :label-width="formLabelWidth"
    >
      <el-form-item label="原密码">
        <el-input
          v-model="passwordForm.oldPassword"
          autocomplete="off"
          type="password"
          show-password
          placeholder="请输入原密码"
        />
      </el-form-item>
      <el-form-item
        label="新密码"
      >
        <el-input
          v-model="passwordForm.password"
          autocomplete="off"
          type="password"
          show-password
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item
        label="确认新密码"
      >
        <el-input
          v-model="passwordForm.password2"
          autocomplete="off"
          type="password2"
          show-password
          placeholder="请输入新密码"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showPassword = false">取消</el-button>
        <el-button type="primary" @click="savePassword">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogFormVisible" :title="title" width="40%">
    <el-form
      :model="form"
      ref="ruleFormRef"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="form.name"
          autocomplete="off"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender" class="ml-4">
          <el-radio label="男" size="large">男</el-radio>
          <el-radio label="女" size="large">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input
          v-model="form.telephone"
          autocomplete="off"
          placeholder="请输入联系电话"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="form.email"
          autocomplete="off"
          placeholder="请输入邮箱"
        />
      </el-form-item>
      <!-- <el-form-item v-if="editStatus == 'add'" label="密码" prop="password">
        <el-input
          v-model="form.password"
          autocomplete="off"
          type="password"
          show-password
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item
        v-if="editStatus == 'add'"
        label="确认密码"
        prop="password2"
      >
        <el-input
          v-model="form.password2"
          autocomplete="off"
          type="password"
          show-password
          placeholder="确认密码"
        />
      </el-form-item> -->
      <el-form-item label="住址" prop="address">
        <el-input
          v-model="form.address"
          autocomplete="off"
          placeholder="请输入住址"
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
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import { updatePwd } from "../api/user";
import { saveOrUpdateAdminApi } from "../api/admin";
import { saveOrUpdateStudentApi } from "../api/student";
import { saveOrUpdateTeacherApi } from "../api/teacher";
import { ElMessage } from "element-plus";
const store = useStore();
const router = useRouter();
const formLabelWidth = "100px";
const title = ref("");
const dialogFormVisible = ref(false); //修改 添加弹窗
const ruleFormRef = ref(); // 表单校验
const loading = ref(false);
const rules = reactive({
  name: [{ required: true, message: "姓名必填", trigger: "change" }],
  gender: [{ required: true, message: "性别必选", trigger: "change" }],

  // password: [{ required: true, message: "密码必填", trigger: "change" }],
  // password2: [{ required: true, message: "密码必填", trigger: "change" }],
  address: [{ required: true, message: "住址必填", trigger: "change" }],
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
let form = reactive({
  name: "1",
  gender: "",
  telephone:'',
  email: "",
  address: "",
  introduction:""
})
const passwordForm = reactive({
  oldPassword: "",
  password:"",
  password2:"",
})
const showPassword = ref(false)
const user = store.getUser;
const userType = store.getUserType;

function handlePwd() {
  showPassword.value = true
}
async function savePassword() {
  if(passwordForm.password !== passwordForm.password2) {
    return ElMessage.warning("两次新密码不一致")
  }
  loading.value = true;
  const { code, message } = await updatePwd(passwordForm);
  loading.value = false;
  if (code == 200) {
    showPassword.value = false
    logout()
  } else {
    ElMessage.error(message);
  }
}
function logout() {
  router.push('/login')
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem("userType")
  store.$reset()
  ElMessage.success("修改密码成功，请重新登录")
}
function handleInfo() {
  title.value = "修改个人信息";
  form.name = user.name;
  form.gender = user.gender;
  form.telephone = user.telephone;
  form.email = user.email;
  form.address = user.address;
  form.id = user.id;
  dialogFormVisible.value = true;

}
function saveForm() {
  switch (String(userType)) {
    case "1":
      saveOrUpdateAdminApi(form);
      break;
    case "2":
      saveOrUpdateStudentApi(form);
      break;
    case "3":
      saveOrUpdateTeacherApi(form);
      break;
  }
}

async function saveAdmin(bodyData) {
  loading.value = true;
  const { code, message } = await saveOrUpdateAdminApi(bodyData);
  loading.value = false;
  if (code == 200) {
    dialogFormVisible.value = false
  } else {
    ElMessage.error(message);
  }
}
async function saveStudent(bodyData) {
  loading.value = true;
  const { code, message } = await saveOrUpdateStudentApi(bodyData);
  loading.value = false;
  if (code == 200) {
    dialogFormVisible.value = false

  } else {
    ElMessage.error(message);
  }
}
async function saveTeacher(bodyData) {
  loading.value = true;
  const { code, message } = await saveOrUpdateTeacherApi(bodyData);
  loading.value = false;
  if (code == 200) {
    dialogFormVisible.value = false
  } else {
    ElMessage.error(message);
  }
}
</script>

<style scoped lang="less">
.container {
  display: flex;
  gap: 30px;
}
.box-card {
  width: 500px;
  .item {
    margin-bottom: 20px;
  }
}
.card-header {
  text-align: left;
}
.right {
  text-align: right;
}
</style>
