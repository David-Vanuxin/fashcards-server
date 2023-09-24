const checkboxWrappers = document.querySelectorAll(".buttons-wrapper")
for (let cbw of checkboxWrappers) {
  cbw.addEventListener("click", event => {
    let checkbox = event.target.getElementsByTagName("input")[0]
    checkbox.checked = !checkbox.checked
  })
}