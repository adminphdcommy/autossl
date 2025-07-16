module.exports = "SIT" // Production = "PROD"

let unitPerRow = 30
let border = "===================================================="
let chunks = border.split("")
let space = chunks.map((x, i) => { return i < chunks.length - 4 ? " " : "" }).join("")
let side = chunks.map((x, i) => { return i < ((chunks.length - (module.exports).length) / 2 - 3) ? " " : "" }).join("")
console.log(border)
console.log("|", space, "|")
console.log("|", side, module.exports, side, "|")
console.log("|", space, "|")
console.log(border)
