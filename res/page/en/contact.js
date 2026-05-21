export default {

computed: {

...mapState(['title', 'pics','number', 'whatsapp', 'mail', 'device']),

  
},




template: `
<h2>contact Us</h2>

 <nav class="">   
 <a class="button border" :href="'tel:' + number"><i>phone</i></a>
 <a class="button border" :href="(device.type === 'mobile' ? 'whatsapp://send?phone=' : 'https://wa.me/?phone=') + whatsapp"><i><img :src="pics + 'svg/whatsapp.svg'" alt="icon"></i></a>
 <a class="button border" :href="'mailto:' + mail"><i>mail</i><span>Email</span></a>
</nav>

<br />





<h2 class="h3">Contact Our Team:</h2>

<div class="grid">

<article class="s12 m6 no-round">
  <div class="row">
    <img class="circle large" src="" loading="lazy">
    <div class="max">
      <h5>Ibrahim Younan</h5>
    </div>
  </div>
  <nav>
    <a class="button border" :href="'tel:' + number"><i>call</i></a>
    <a v-if="whatsapp" class="button border" :href="(device.type === 'mobile' ? 'whatsapp://send?phone=' : 'https://wa.me/?phone=') + whatsapp"><i><img :src="pics + 'svg/whatsapp.svg'" alt="icon"></i></a>
    <a v-if="mail" class="button border" :href="'mailto:' + mail"><i>mail</i></a>
  </nav>
</article>

</div>





  `
};