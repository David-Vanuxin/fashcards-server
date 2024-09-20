export const remake = (text, separator = new RegExp(/\s–\s/g)) => {
  let res;
  res = text.replaceAll(/^!?[^а-я,А-Я]+/g, "")  
  res = res.replaceAll(separator, "...")
  const list = res.split("\n")
  const result = []
  for (let n = 0; n <= list.length; n++) {
    let string = list[n]
    try {
      let splitted_string = string.split("...")
      result.push({
        q: splitted_string[0],
        a: splitted_string[1].replace("\r", "")
      })
    } catch (err) {
      const reason = getReason(string)
      if (reason == null) continue
      const new_list = []
      Object.assign(new_list, list)
      let sample = new_list.splice(n - 2, n + 2).join("\n")
      sample = sample.replaceAll("...", " -> ")
      throw new Error(`\n${sample}\nНе удалось разобрать строку: "${string}"\nПричина: ${reason}`)
    }
  }
  return result 
}

const getReason = string => {
  let reason = ""
  if (typeof string === "undefined") {
    return null
  }
  if (!string.includes("...")) {
    reason += "отсутствует разделитель; "
  }
  if (typeof string.split("...")[0] === "undefined") {
    reason += "отсутствует вопрос; "
  }
  if (typeof string.split("...")[1] === "undefined") {
    reason += "отсутствует ответ; "
  }
  if (reason == "") {
    reason = "неизвестна"
  }
  reason = reason + "..."
  reason = reason.replace("; ...", "")
  return reason
}