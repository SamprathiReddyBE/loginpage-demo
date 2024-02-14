import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import Login from '../views/LoginView.vue';
import Profile from '../views/Profile.vue';
import About from '../views/AboutView.vue';
import Register from '@/views/RegisterView.vue';
import UpdatePassword from '../views/UpdatePasswordView.vue'
const routes = [
 { path: '/', component: Home },
 { path: '/login', component: Login ,meta:{ hideNavbar: true}},
 { path: '/profile', component: Profile },
 { path: '/about', component: About},
 { path: '/register', component: Register,meta:{ hideNavbar: true} },
 {path: '/UpdatePassword', component: UpdatePassword}
];

const router = createRouter({
 history: createWebHistory(),
 routes,
});

export default router;
