const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

class Sprite {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.height = 150
  }
  draw() {
    c.fillStyle = "blue"
    c.fillRect(this.position.x, this.position.y, 50, this.height)
  }

  update() {
    this.draw()
    // this.position.x += 10
    this.position.y -= this.velocity.y

    if(this.position.y + this.height)
  }
}

const player = new Sprite({
  position: {
    x: 10,
    y: 315,
  },
  velocity: {
    x: 0,
    y: 2,
  },
})

const enemy = new Sprite({
  position: {
    x: 715,
    y: 315,
  },
  velocity: {
    x: 0,
    y: 1,
  },
})

console.log(player)

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = "black"
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()
}
animate()
