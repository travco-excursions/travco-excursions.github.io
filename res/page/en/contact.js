export default {

components: { 
  
'team': { props: ['img','name','description','phone','whatsapp','mail'], template: `
<article class="s12 m6 no-round">
  <div class="row">
    <img class="circle large" :src="img" loading="lazy">
    <div class="max">
      <h5 v-text="name"></h5>
      <div v-text="description"></div>
    </div>
  </div>
  <nav>
    <a v-if="phone" class="button border" :href="'tel:' + phone"><i>call</i></a>
    <a v-if="whatsapp" class="button border" :href="'whatsapp://send?phone=' + whatsapp"><i><img :src="$store.pics + 'svg/whatsapp.svg'" alt="icon"></i></a>
    <a v-if="mail" class="button border" :href="'mailto://' + mail"><i>mail</i></a>
  </nav>
</article>
`},

},

template: `
<h2>contact Us</h2>

 <nav class="">   
 <a class="button border" :href="'tel:' + $store.WAnumber"><i>phone</i></a>
 <a class="button border" :href="'whatsapp://send?phone=' + $store.WAnumber"><i><img :src="$store.pics + 'svg/whatsapp.svg'" alt="icon"></i></a>
 <a class="button border" href=""><i>mail</i><span>Email</span></a>
</nav>

<br />





<h2 class="h3">Contact Our Team:</h2>

<div class="grid">
<team v-for="t in 7" img="res/pics/pic.svg" name="Younan" description="english" phone="01550579981" whatsapp="201550579981" mail="test@gmail.com"></team>
</div>





  `
};
