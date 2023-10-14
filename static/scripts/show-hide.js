const tableRows = document.querySelectorAll("tr")

for (let tr of tableRows) {
  const td = document.createElement("td")
  td.className = "hide-button-wrapper"
  td.hidden = true

  const link = document.createElement("a")
  link.className = "link"
  link.textContent = "Скрыть"


  link.addEventListener("click", event => {
    event.target.parentNode.parentNode.hidden = true

    const showAllBtn = event.target.parentNode.parentNode.parentNode.parentNode.querySelector(".show-all")
    if (showAllBtn.hidden) showAllBtn.hidden = false
  })

  td.append(link)

  tr.append(td)
}

const showButtons = document.querySelectorAll(".show-all")

for (let showBtn of showButtons) {
  showBtn.addEventListener("click", event => {
    const table = event.target.parentNode.parentNode
    const rows = table.querySelectorAll("tr")

    for (let row of rows) {
      if (row.hidden) row.hidden = false
    }
    event.target.hidden = true
  })
}

const hideButtonsList = document.querySelectorAll(".show-buttons")

for (let button of hideButtonsList) {
  button.addEventListener("click", event => {
    const hideButtonWrappersList = event.target.parentNode.parentNode.querySelectorAll("td.hide-button-wrapper")
      
    if (event.target.textContent == "Скрыть кнопки") {
      event.target.textContent = "Показать кнопки"
      for (let td of hideButtonWrappersList) {
        td.hidden = true
      }
    } else {
      event.target.textContent = "Скрыть кнопки"
      for (let td of hideButtonWrappersList) {
        if (td.hidden) {
          td.hidden = false
        }
      }
    }
  })
}