import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/users/Login.vue'
import Register from '../views/users/Register.vue'
import Announcements from '../views/announcements/Announcements.vue'
import PendingStudents from '../views/students/admins/PendingStudents.vue'
import Quizzes from '../views/quizzes/shared/Quizzes.vue'
import AdminQuiz from '../views/quizzes/admins/Quiz.vue'
import StudentQuiz from '../views/quizzes/users/Quiz.vue'
import Grades from "@/views/grades/shared/Grades";

Vue.use(VueRouter)

const DEFAULT_TITLE = "Remote Tutor"
const routes = [
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: "Login"
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Create New User'
    }
  },
  {
    path: '/announcements',
    alias: '/',
    name: 'Announcements',
    component: Announcements,
    meta: {
      title: 'Announcements'
    }
  },
  {
    path: '/students',
    name: 'Students',
    component: PendingStudents,
    meta: {
      title: 'Students'
    } 
  },
  {
    path: '/quizzes',
    name: 'Quizzes',
    component: Quizzes,
    meta: {
      title: 'Quizzes'
    }
  },
  {
    path: '/quizzes/questions/:quizID',
    name: 'QuizQuestions',
    component: AdminQuiz,
    meta: {
      title: 'New Question'
    } 
  },
  {
    path: '/quizzes/:action/:quizID',
    name: 'SolveQuiz',
    component: StudentQuiz,
    meta: {
      title: 'Quiz'
    }
  },
  {
    path: '/grades',
    name: 'Grades',
    component: Grades,
    meta: {
      title: 'Grades'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
})

export default router
