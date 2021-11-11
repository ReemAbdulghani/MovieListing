<template>
  <span v-if="movieData && movieData.imdbID">
    <v-container
      fluid
    > 
      <v-row 
          align="center"
          justify="center"
          class="my-8"
      >
        <v-col
          v-if="movieData.Poster !== 'N/A'"
          class="d-flex align-center"
          cols="12"
          lg="3"
          md="3"
          sm="12"
          
        >
          <v-card
            elevation="24"
            class="mx-auto"
          >
            <v-img
              :src="movieData.Poster"
              :lazy-src="movieData.Poster"
              class=" grey lighten-2"
              max-height="550"
            />
          </v-card>
        </v-col>

        <v-col
          cols="12"
          lg="8"
          md="8"
          sm="12"
          class="mt-4"
        >
          <div class="text-h2 font-weight-bold">
            {{ movieData.Title }}
          </div>
          <div class="my-3">
            <span class="mr-2">{{ movieData.Year === "N/A" ? '' : movieData.Year }}</span>
            <span v-if="movieData.Runtime !== 'N/A'">
              <span class="mx-2 orange--text">|</span>
              {{ movieData.Runtime }}
            </span>
            <span v-if="movieData.Genre !== 'N/A'">
              <span class="mx-2 orange--text">|</span>
              {{ movieData.Genre }}
            </span>
          </div>
          <div>
            {{ movieData.Plot === 'N/A' ? '' : movieData.Plot }}
          </div>
          <div class="mt-5 hidden-sm-and-down" align="right">
            <v-btn
              x-large
              color="warning"
              dark
              class="mt-5"
            >
              WATCH IT NOW 
            </v-btn>
          </div>
          <div class="mt-10 hidden-md-and-up" align="center">
            <v-btn
              large
              color="warning"
              dark
              class="px-10 mt-5"
            >
              WATCH IT NOW 
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <div class="mb-10 block">
      <v-container>
        <div class="headline text-left">More Details</div>
        <v-divider color="orange" />
        <v-row>
          <span v-for="item in moreDetailsList" :key="item.attribute" class="mr-5">
            <v-col cols="12" v-show="movieData[item.attribute] && movieData[item.attribute] !== 'N/A'">
              <span >
                <h4 class="mt-3 grey--text font-weight-bold">
                  {{item.title}}
                </h4>
                <div>
                  {{ movieData[item.attribute] }}
                </div>
              </span>
            </v-col>
          </span>
        </v-row>
      </v-container>
    </div>
  </span>
  <span v-else>
    <v-row 
      class="fill-height"
      align="center"
      justify="center"
      
    >
      <v-progress-circular
        :size="50"
        color="amber"
        indeterminate
      />
    </v-row>
  </span>
</template>
<script>
import { onBeforeMount, ref } from '@vue/composition-api';

export default {
  props: ['movieId'],
  setup(props) {
    const cachedMovies = ref([]);
    const movieData = ref({});
    onBeforeMount(() => {
      // Retrieve movies in the cache (cachedMovies in the localStorage), if exists.
      if (localStorage.getItem('cachedMovies')) {
        try {
          cachedMovies.value = JSON.parse(localStorage.getItem('cachedMovies'));
        } catch(e) {
          localStorage.removeItem('cachedMovies');
        }
      }
      
      // If the selected movie is cached, retrive it from the cache, otherwise fetch it from omdbapi
      const movieFromCache = findIfCached(props['movieId'])
      if (movieFromCache.length > 0) {
          movieData.value = movieFromCache[0];
      } else {
        console.log('after checking the cache, no, so will fetch it')
        fetch(`http://www.omdbapi.com/?apikey=9c121b50&i=${props['movieId']}&plot=full`)
          .then(res => res.json())
          .then(resData => {
          movieData.value = resData;

          cachedMovies.value.push(movieData.value)
          const stringifiedCachedMovies = JSON.stringify(cachedMovies.value);
          localStorage.setItem('cachedMovies', stringifiedCachedMovies);
          });
      }
    })

    const findIfCached = (movieId) => {
      const movie = cachedMovies.value.filter(
          movie => movie.imdbID === movieId
        )
        return movie
    }


    const moreDetailsList = [
      {
        title: 'Acting Cast',
        attribute: 'Actors'
      },
      {
        title: 'Writer',
        attribute: 'Writer'
      },
      {
        title: 'Country',
        attribute: 'Country'
      },
      {
        title: 'IMDB Raiting',
        attribute: 'imdbRating'
      },
      {
        title: 'Subtitles',
        attribute: 'Language'
      }
    ];

    return {
      movieData,
      cachedMovies,
      moreDetailsList,
      findIfCached
    }
  }
};
</script>
