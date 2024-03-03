import './style.css'
import cat from './public/assets/cat.png'
import mapJSON from './public/assets/map.json'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const CANVAS_WIDTH = canvas.width
const CANVAS_HEIGHT = canvas.height
const shots = 3

let keyPress = false
let direction = 0
let characterX = 0
let characterY = 0

let lastTimeUpdated = 0

function draw(timeStamp) {
  const deltaTime = timeStamp - lastTimeUpdated
  if (ctx) {
    const img = new Image()
    img.src = cat
    img.onload = function () {
      const { layers } = mapJSON
      const { data } = layers[0]

      for (let ceil = 0; ceil < data.length; ceil++) {
        const col = ceil % 30
        const row = Math.floor(ceil / 30)
        const tileNumber = data[ceil]
        const { x, y } = calculateTilePosition({
          tileNumber: tileNumber - 1,
        })

        ctx.drawImage(img, x, y, 32, 32, col * 32, row * 32, 64, 64)
      }

      function calculateTilePosition({
        tileNumber = 0,
        columns = 16,
        width = 32,
        height = 32,
      }) {
        const x = (tileNumber % columns) * width
        const y = Math.floor(tileNumber / columns) * height
        return { x, y }
      }

      let step = 0

      if (keyPress) {
        step = Math.floor(step + timeStamp / 100) % shots
        if (direction === 0) characterY += 0.1 * deltaTime
        if (direction === 3) characterY -= 0.1 * deltaTime
        if (direction === 1) characterX -= 0.1 * deltaTime
        if (direction === 2) characterX += 0.1 * deltaTime
      }

      if (characterX < 0) characterX = 0
      if (characterX > CANVAS_WIDTH - 64) characterX = CANVAS_WIDTH - 64
      if (characterY < 0) characterY = 0
      if (characterY > CANVAS_HEIGHT - 64) characterY = CANVAS_HEIGHT - 64

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctx.drawImage(
        img,
        32 * step,
        32 * direction,
        32,
        32,
        characterX,
        characterY,
        64,
        64
      )
    }
  }
  lastTimeUpdated = timeStamp
  window.requestAnimationFrame(draw)
}
window.requestAnimationFrame(draw)

function keyDownHandler(event) {
  if (event.key === 'ArrowUp' || event.key === 'Up') {
    keyPress = true
    direction = 3
  } else if (event.key === 'ArrowRight' || event.key === 'Right') {
    keyPress = true
    direction = 2
  } else if (event.key === 'ArrowDown' || event.key === 'Down') {
    keyPress = true
    direction = 0
  } else if (event.key === 'ArrowLeft' || event.key === 'Left') {
    keyPress = true
    direction = 1
  }
}

function keyUpHandler() {
  keyPress = false
  direction = 0
}

document.addEventListener('keydown', keyDownHandler)
document.addEventListener('keyup', keyUpHandler)
