import { createRouter, createWebHashHistory} from 'vue-router'
// import layout from '../layout'
const routes = [
  {
    path: "/",
    component: () => import("../layout/index.vue"),
    children:[
      {
        path:'/home',
        component: () => import("@/view/home.vue"),

      },
      {
        path: '/student',
        component: () => import("@/view/student.vue"),
      },
      {
        path: '/grade',
        component: () => import("@/view/grade.vue"),
      },
      {
        path: '/class',
        component: () => import("@/view/class.vue"),
      },
      {
        path: '/admin',
        component: () => import("@/view/admin.vue"),
      },
      {
        path: '/teacher',
        component: () => import("@/view/teacher.vue"),
      },
      {
        path: '/userInfo',
        component: () => import("@/view/userInfo.vue"),
      }
    ]
  },
  {
    path: "/demo",
    component: () => import("@/view/demo.vue"),
  },
  {
    path: "/login",
    component: () => import("@/view/login.vue"),
  },
]
const router = createRouter({
  routes,
  history: createWebHashHistory(),
});
export default router;