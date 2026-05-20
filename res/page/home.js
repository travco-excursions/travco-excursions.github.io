export default {
  data() {return {
      // Stores the secure browser install token
      deferredPrompt: null
  }},
  
  
  
  
 methods: {
    // 1. Saves the token so the button method can use it
    captureInstallToken(e) {
      e.preventDefault();
      this.deferredPrompt = e;
    },
    
    // 2. The click method to prompt installation
    async installApp() {
      // If the browser hasn't fired the event yet, this will do nothing
      if (!this.deferredPrompt) {
        console.warn("The browser is not ready to install this app yet.");
        return;
      }
      
      // Trigger the native browser install dialog box
      this.deferredPrompt.prompt();
      
      // Handle the user's action
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`User installation choice: ${outcome}`);
      
      // Clear token after use (it can only be used once)
      this.deferredPrompt = null;
    }
  },

  
  
  
  mounted() {
  
    // Automatically capture the install token when the browser allows it
    window.addEventListener('beforeinstallprompt', this.captureInstallToken);
  },
  
  beforeUnmount() {
    window.removeEventListener('beforeinstallprompt', this.captureInstallToken);
  },
  
  
  template: `
  
  
  
    <button @click="installApp">Install App</button>
    
    
    
    
  `
};
