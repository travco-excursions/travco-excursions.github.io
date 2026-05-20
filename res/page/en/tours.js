export default {

data() {return {
search:  this.$route.query.q || "",

}},


computed: {


filteredTours() { 
  if (this.$route.query.q) {return this.$store.tours.filter(tour => tour.title.toLowerCase().includes(this.$route.query.q.toLowerCase()) || tour.description.toLowerCase().includes(this.$route.query.q.toLowerCase()) || tour.tags.some(tag => tag.toLowerCase().includes(this.$route.query.q.toLowerCase())) )}
  else if (this.$route.params.tag) {return this.$store.tours.filter(tour => tour.tags.some(tag => tag === this.$route.params.tag )) } 
  else {return this.$store.tours} 
},


},

template: `

<div v-show="!$route.path.includes('/en/tag/')"  class="grid">
<form class="s12 m6 l4" @submit.prevent="$router.push({path: '/en/search/', query: {q: search} });">
  <div class="max field prefix border no-round">
    <i class="front">search</i>
    <input name="q" type="text" v-model="search" placeholder="Search for tours...">
  </div>
</form>
</div>

<div v-show="$route.path === '/en/search/'">
<p v-if="filteredTours.length === 0" class="s12 m12 l12"> No Tours found.</p>
<p v-else-if="$route.query.q !== ''" class="s12 m12 l12"><b v-text="filteredTours.length"></b> Tours match your search.</p>
</div>


<div v-show="$route.path !== '/en/search/'" class="small-padding">
<nav class="scroll">
<RouterLink to="/en/tours/" activeClass="active primary"  class="button chip">All</RouterLink>
<RouterLink :to="'/en/tag/' + tag" activeClass="primary medium"  class="button chip"  v-for="tag in $store.tags" :key="tag"><span v-text="tag"></span></RouterLink>
</nav>
</div>


<div class="small-space"></div>


<div class="grid">

<article class="s12 m6 l4 padding large-elevate" v-for="tour in filteredTours" :key="tour.id">
  <img class="responsive medium elevate" :src="$store.pics +'tours/'+ tour.imgs[0]" loading="lazy">
  
  <div class="mediu-padding">
    <h5 class="large-text bold" v-text="tour.title"></h5>
  </div>

  <div class="row small-padding no-margin">
    <p class="max"><span class="bold green-text large-text" v-text="tour.price"></span> <b>PP</b></p>
    <p><i>timer</i><span class="bold black-text large-text" v-text="tour.time"></span></p>
  </div>

    <nav class="no-margin">
    <RouterLink class="button responsive no-round" :to="'/en/tours/' + tour.id">Details</RouterLink>
    </nav>
</article>


</div>


<div class="space"></div>


`//template
};

