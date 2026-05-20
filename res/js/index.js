const { createApp, reactive, computed, defineAsyncComponent } = Vue
const { createRouter, createWebHistory, createWebHashHistory } = VueRouter





const router = createRouter({
  
history: createWebHashHistory(), 
scrollBehavior(to, from) { return {top: 0}  },
routes: [
{ path: '/', redirect: '/en/tours' },

  {path: '/en', component: () => import('../page/en.js'), redirect: '/en/tours' ,children: [
    {path: 'tours', component: () => import('../page/en/tours.js')},
    {path: 'tours/:id(\\d+)', component: () => import('../page/en/tour.js')},
    {path: 'tag', redirect: '/en/tours'},
    {path: 'tag/:tag', component: () => import('../page/en/tours.js')},
    {path: 'search', component: () => import('../page/en/tours.js')},
    {path: 'contact', component: () => import('../page/en/contact.js')},
    {path: 'about', component: () => import('../page/en/about.js')},
    {path: ':pathMatch(.*)*', component: () => import('../page/en/404.js')},
  ]},


{path: '/:pathMatch(.*)*', component: () => import('../page/404.js')},
],

});//router

const store = reactive({

device: {type:"", display:"", os:"", browser:""}, 

title: "Travco Tours",

mail: "ibrahimyounan1997@gmail.com",
WAnumber: 201550579981,

pics: "res/pics/",

  tours: [], 
  favorite: [],
  tags:[],
  team: [],


})//store



const app = createApp()
app.config.globalProperties.$store =  store;
app.use(router)
app.mount('#app')




