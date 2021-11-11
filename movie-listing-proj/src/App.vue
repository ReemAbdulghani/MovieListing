<template>
  <v-app>
    <v-app-bar app color="black" class="text-center" justify="space-around" dark>
        <div class="text-h5 font-weight-bold">
      <router-link :to="'/'" style="text-decoration: none" >
          <span class="white--text">Movie</span><span class="orange--text">DB</span>
          <v-divider color="orange" />
      </router-link>
        </div>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <v-footer class="mt-5" color="black">
      <v-spacer />
      <strong class="white--text">&copy; MovieDB | 2021 </strong>
      <v-spacer />
    </v-footer>
  </v-app>
  
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
