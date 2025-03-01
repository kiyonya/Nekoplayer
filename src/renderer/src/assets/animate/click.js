export default function useClickAnimation() {
  document.querySelectorAll(".canClick").forEach((i) => {
    i.addEventListener("click", () => {
      i.classList.add("click_scale");
      setTimeout(() => {
        i.classList.remove("click_scale");
      }, 10);
    });
  });
}
