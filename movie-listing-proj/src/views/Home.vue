<template>
  <div class="pb-5 mb-5">
    <v-img 
      src="https://www.teahub.io/photos/full/220-2205714_get-the-latest-movies-data-src-kodi-tv..jpg"
      class="align-end py-5 "
      v-bind:class="[imageShrinked ? 'shrinked' : 'expanded' ]"
      gradient="to bottom, rgba(0,0,0,.3), rgba(0,0,0,.8)"
      elevation="24" 
    >
      <div class="display-1 font-weight-medium text-center white--text mb-5 hidden-sm-and-down">2020 MOVIES COLLECTION WITH OVER 10000 MOVIE!</div>
      <div class="headline font-weight-medium text-center white--text hidden-md-and-up px-4">2020 MOVIES COLLECTION ! <br> CHECK THEM OUT</div>
      <v-form @submit.prevent="searchForMovies()">
        <v-row >
          <v-col col="1" />

          <v-col
            class="d-flex align-center my-5"
            cols="6"
            sx="3"
          >
            <v-autocomplete
              v-model="selected"
              :items="searchAutocompleteList"
              item-text="Title"
              item-value="Title"
              :search-input.sync="searchText"
              hide-no-data
              hide-selected
              placeholder="What do you want to watch tonight ..."
              background-color="grey darken-4"
              color="orange"
              append-icon=""
              filled
              rounded
              solo
            ></v-autocomplete>
          </v-col>

          <v-col
            cols="1"
          >
            <v-btn
              class="my-5"
              type="submit"
              color="orange"
              fab
              dark
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-col>
          <v-col col="2" />
        </v-row>
      </v-form>
    </v-img>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="yellow darken-2"
    ></v-progress-linear>

    <v-row
      v-if="searchResults && searchResults.length > 0"
      align="center"
      justify="center"
      class="ma-3"
    >
      <div v-for="movie in searchResults" :key="movie.imdbID">
        <router-link :to="'/Movie/' + movie.imdbID" >
          <v-hover v-slot="{ hover }">
            <v-card
              class="ma-2"
              width="210"
              min-height="300"
              elevation="24"
              
            >
            <v-card-title>
              <v-img
                v-if="movie.Poster !== 'N/A'"
                :src="movie.Poster"
                min-height="300"
              />
              <div 
                v-else
                fill-height
              >
                <v-icon 
                  align="center"
                  justify="center"
                  x-large 
                  color="grey"
                  >
                    mdi-movie-open
                </v-icon>
              </div>
              
            </v-card-title>
            <v-expand-transition >

              <div
                v-if="hover"
                class="px-3 v-card--reveal transition-fast-in-fast-out white black--text"
                style="height: 50%;"
              >
                <v-row
                  class="pa-4"
                  
                >
                  <v-col class="text-center">
                    <div style="font-size: 1.2rem;" >
                      {{ movie.Title }}
                    </div>
                      <span class="font-weight-bold" style="font-size: 0.9rem;">({{ movie.Type }})</span>
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
            </v-card>
          </v-hover>
        </router-link>
      </div>
    </v-row>
    <v-row
      v-if="noMatchingResutls"
      align="center"
      justify="center"
      class="ma-3"
    >
      <div class="title orange--text font-weight-thin my-5 py-5">
        No Matching Results, Try Again.
      </div>
    </v-row>
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api';
import env from '@/env.js';

export default {
  setup () {

    // variableas, watch, and function related to the autocomplete.
    const searchText = ref("");
    const searchAutocompleteList = ref([]);
    const isLoading = ref(false);
    watch(searchText, () => {
      if (searchText.value === null || searchText.value === "") {
        searchAutocompleteList.value = [];
        isLoading.value = false;
        return
      }
      if (isLoading.value) {
        return // Means Items have already been requested.
      }
      isLoading.value = true;
      autocompleteSearchText();
    });
    const autocompleteSearchText = () => {
      console.log('1')
      fetch(`http://www.omdbapi.com/?apikey=${env.api_key}&s=${searchText.value}&y=2020`)
        .then(res => res.json())
        .then(resData => {
          if (resData.Search && resData.Search.length > 0) {
            searchAutocompleteList.value = resData.Search;
            // Added this part to this function just to save one extra api request in the search func.
            if (selected.value !== null && selected.value !== '') {
              searchResults.value = resData.Search;
              noMatchingResutls.value = false;
              isLoading.value = false;
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
        //.finally(() => (isLoading.value = false));
    };
    
    //variableas, watch, and function related to the search.
    const selected = ref("");
    const searchResults = ref([]);
    const noMatchingResutls =  ref(false);
    const imageShrinked = ref(false);
    watch(searchResults, () => {
      if (searchResults.value !== [] || searchResults.value !== undefined) {
         imageShrinked.value = true;
         //noMatchingResutls.value = false;
         searchAutocompleteList.value = [];
         selected.value = "";
         searchText.value = "";
      } else {
        imageShrinked.value = false;
      }
    });

    const searchForMovies = () => {
      console.log('2')
      if (selected.value === "") {
        if (searchText.value !== null && searchText.value !== '') {
          console.log('here')
          selected.value = searchText.value;
        } else {
          return
        }
      }
      fetch(`http://www.omdbapi.com/?apikey=${env.api_key}&s=${selected.value}&y=2020`)
        .then(res => res.json())
        .then(resData => {
           if (resData.Search && resData.Search.length > 0) {
            searchResults.value = resData.Search;
            noMatchingResutls.value = false;
          } else {
            console.log('noMatchingResutls.value = true;')
            noMatchingResutls.value = true;
            searchResults.value = null;
          }
          searchAutocompleteList.value = [];
          selected.value = "";
          isLoading.value = false;
        });
    };

    return {
      searchText,
      searchAutocompleteList,
      isLoading,
      selected,
      searchResults,
      noMatchingResutls,
      imageShrinked,
      autocompleteSearchText,
      searchForMovies
    }
  }
};
</script>

<style>
.v-card--reveal {
align-items: center;
bottom: 0;
justify-content: center;
opacity: .8;
position: absolute;
width: 100%;
}

.v-image {
  transition: max-height 0.7s;
}

.v-image.shrinked {
  max-height: 250px;
}

.v-image.expanded {
  max-height: 500px;
}
</style>
