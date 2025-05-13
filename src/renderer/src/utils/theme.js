import { computed, ref } from "vue";
import { watch } from "vue";
import { store } from "../store";
const mtch = window.matchMedia("(prefers-color-scheme: dark)");
const utheme = computed(()=>{return store.state.appColormode})
const currentTheme = ref(
  utheme === "follow" ? (mtch.matches ? "dark" : "light") : utheme.value
);
mtch.onchange = (event) => {
  if (utheme === "follow") {
    updateTheme(mtch.matches ? "dark" : "light");
  }
}; 

watch(utheme,() => {
  console.log("bianhua")
  updateTheme(utheme.value);
},{immediate:true});


function updateTheme(type) {
  console.log(type)
  let theme;
  if (type === "follow") {
    theme = mtch.matches ? "dark" : "light";
  } else {
    theme = type;
  }
  currentTheme.value = theme;
  if (theme === "light" || theme === "dark") {
    document.documentElement.setAttribute("data-theme", theme);
  } else if (theme === "custom") {
    document.documentElement.setAttribute("data-theme", "custom");
  }
}
updateTheme(utheme);
export { utheme, currentTheme };
