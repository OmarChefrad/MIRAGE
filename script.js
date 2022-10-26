const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

class Sprite {
  constructor({ position, velocity, color = "red" }) {
    this.position = position
    this.velocity = velocity
    this.height = 150
    this.lastkey
    this.attackbox = {
      positon: this.position,
      width: 100,
      height: 50,
    }
    this.color = color
  }
  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, 50, this.height)
    // sword box
    c.fillStyle = "gray"
    c.fillRect(this.attackbox.positon.x, this.attackbox.positon.y, this.attackbox.width, this.attackbox.height)
  }

  update() {
    this.draw()

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0
    } else {
      this.velocity.y += gravity
    }
  }
}

const player = new Sprite({
  position: {
    x: 10,
    y: 315,
  },
  velocity: {
    x: 0,
    y: 5,
  },
})

const enemy = new Sprite({
  position: {
    x: 315,
    y: 315,
  },
  velocity: {
    x: 0,
    y: 4,
  },
  color: "blue",
})

console.log(player)

const keys = {
  a: {
    pressed: false,
  },
  q: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
}

let lastkey

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = "black"
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // Check if two keys in  x axes dont get conflicted//
  // Player movement
  if (keys.a.pressed && player.lastkey === "a") {
    player.velocity.x = -7
  } else if (keys.q.pressed && lastkey === "q") {
    player.velocity.x = -7
  } else if (keys.d.pressed && player.lastkey === "d") {
    player.velocity.x = 7
  }

  // Enemy Movement //
  if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 7
  } else if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
    enemy.velocity.x = -7
  }
}
animate()

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    //right
    case "d":
      keys.d.pressed = true
      player.lastkey = "d"
      break
    case "ArrowRight":
      keys.ArrowRight.pressed = true
      enemy.lastkey = "ArrowRight"
      break
    //left
    case "a":
      keys.a.pressed = true
      player.lastkey = "a"
      break
    case "q":
      keys.q.pressed = true
      lastkey = "q"
      break
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true
      enemy.lastkey = "ArrowLeft"
      break
    //top
    case "w":
      player.velocity.y = -13
      break
    case "z":
      player.velocity.y = -13
      break
    case "ArrowUp":
      enemy.velocity.y = -13
      break
    //bottom
    case "s":
      player.velocity.y = 13
      break
    case "ArrowDown":
      enemy.velocity.y = 13
      break
  }
  console.log(event)
})

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    //right
    case "d":
      keys.d.pressed = false
      break
    case "ArrowRight":
      keys.ArrowRight.pressed = false
      break
    //left
    case "a":
      keys.a.pressed = false
      break
    case "q":
      keys.q.pressed = false
      break
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false
      break
    //top
    case "w":
      player.velocity.y = 0
      break
    case "z":
      player.velocity.y = 0
      break
    case "ArrowUp":
      enemy.velocity.y = 0
      break
    //bottom
    case "s":
      player.velocity.y = 0
      break
    case "ArrowDown":
      enemy.velocity.y = 0
      break
  }
  console.log(event)
})
