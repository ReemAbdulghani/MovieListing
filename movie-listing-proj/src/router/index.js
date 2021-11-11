import Home from "../views/Home.vue";
import Movie from "../views/Movie.vue";


export default [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/Movie/:movieId",
    name: "Movie",
    component: Movie,
    props: true
  }
];