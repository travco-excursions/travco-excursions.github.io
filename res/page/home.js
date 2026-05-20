export default {
  
  
data() { return {
  deferredPrompt: null,
  canInstall: false
 }},


 methods: {
    // Helper method to detect if the user is currently browsing inside the PWA
    isAlreadyInstalled() {
      return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    },
    
    handleBeforeInstallPrompt(e) {
      e.preventDefault();
      this.deferredPrompt = e;
      this.canInstall = true; // Shows the button when installable
    },
    
    async installPWA() {
      if (!this.deferredPrompt) return;
      
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`PWA install choice: ${outcome}`);
      
      this.deferredPrompt = null;
      // Hide button immediately after prompt action (regardless of accept/dismiss)
      this.canInstall = false;
    },
    
    handleAppInstalled() {
      console.log('PWA installed successfully by user.');
      // Final absolute guarantee to hide the button on success
      this.canInstall = false;
    }
  },

  
mounted() {
  
  if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js') }) };


    // 1. Check if the app is already running as an installed standalone PWA
    if (this.isAlreadyInstalled()) { this.canInstall = false; return; }
    
    // 2. Listen for the browser installation readiness
    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    
    // 3. Listen for the exact moment the user finishes installing the app
    window.addEventListener('appinstalled', this.handleAppInstalled);
  },
  
beforeUnmount() {
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    window.removeEventListener('appinstalled', this.handleAppInstalled);
  },
  

  

template: `




<button  v-if="canInstall"  @click="installPWA" class=""> Install App </button>



`//template
};


