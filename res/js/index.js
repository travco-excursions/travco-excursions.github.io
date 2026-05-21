const { createApp, createSSRApp, defineComponent, defineAsyncComponent, defineCustomElement, provide, inject, h, createVNode, cloneVNode, mergeProps, toRaw, markRaw, nextTick, version: vueVersion } = Vue
const { createRouter, createWebHistory, createWebHashHistory, createMemoryHistory, NavigationFailureType, isNavigationFailure, START_LOCATION, parseQuery, stringifyQuery, version: routerVersion } = VueRouter
const { createStore, createLogger, mapState, mapGetters, mapMutations, mapActions, createNamespacedHelpers, version: vuexVersion } = Vuex






const router = createRouter({
  
history: createWebHashHistory(), 
scrollBehavior(to, from) { return {top: 0}  },
routes: [
//{path: '/', redirect: '/en'},
{path: '/', component: () => import('../page/home.js')},

  {path: '/en', component: () => import('../page/en.js'), redirect: '/en/tours' ,children: [
    {path: 'tours', component: () => import('../page/en/tours.js')},
    {path: 'tours/:id(\\d+)', component: () => import('../page/en/tour.js')},
    {path: 'tag', redirect: '/en/tours'},
    {path: 'tag/:tag', component: () => import('../page/en/tours.js')},
    {path: 'search', component: () => import('../page/en/tours.js')},
    {path: 'contact', component: () => import('../page/en/contact.js')},
    {path: 'about', component: () => import('../page/en/about.js')},
    {path: ':pathMatch(.*)*', redirect: '/en'},
  ]},


{path: '/:pathMatch(.*)*', redirect: '/'},
],

});//router



const store = createStore({
  
state() {return {
  device: {}, 
  title: "Travco Excursions",
  number: "+201025077704",
  whatsapp: "+201025077704",
  mail: "travco@gmail.com",
  pics: "/res/pics/",
  tours: [], 
  tags: [],
  favorite: [],
  team: [],
}},
  
  
mutations: {

SET_DEVICE(state) {
      const ua = navigator.userAgent;
      const width = window.innerWidth;
      const screenWidth = window.screen.width;
      
      let display = "medium";
      if (width < 601) display = "small";
      else if (width >= 993) display = "large";
      
      let os = "unknown";
      if (/Android/i.test(ua)) os = "android";
      else if (/iPhone|iPad|iPod/i.test(ua)) os = "ios";
      else if (/Harmony|HUAWEI/i.test(ua)) os = "harmony";
      else if (/Windows NT/i.test(ua)) os = "windows";
      else if (/Macintosh|Mac OS X/i.test(ua)) os = "mac";
      else if (/Linux/i.test(ua)) os = "linux";
      else if (/CrOS/i.test(ua)) os = "chromeOs";
      
      let browser = "unknown";
      if (/Edg|Edge/i.test(ua)) browser = "edge";
      else if (/Firefox/i.test(ua)) browser = "firefox";
      else if (/Chrome/i.test(ua)) browser = "chrome";
      else if (/Safari/i.test(ua)) browser = "safari";
      
      let type = "unknown";
      if (/Mobile|iPhone|Android/i.test(ua) && screenWidth < 601) type = "mobile";
      else if (/Tablet|iPad|Android/i.test(ua) || (screenWidth >= 601 && screenWidth < 993)) type = "tablet";
      else if (screenWidth >= 993) type = "desktop";
      
      const language = (navigator.language || "en").split("-")[0];
      const share = !!navigator.share;
      
      
      // Directly update the state object
      state.device = { display, type, os, browser, language, share };
    },
    
    
},
 
})//store





createApp().use(router).use(store).mount('#app')



if (typeof navigator.serviceWorker !== 'undefined') { navigator.serviceWorker.register('sw.js') }