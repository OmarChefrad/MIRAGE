const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

class Sprite {
  constructor({ position, velocity, color = "rgb(210, 218, 181)", offset }) {
    this.position = position
    this.velocity = velocity
    this.height = 150
    this.width = 50
    this.lastkey
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: offset,
      width: 100,
      height: 50,
    }
    this.color = color
    this.isAttacking
    this.health = 100
  }

  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
    // sword box
    if (this.isAttacking) {
      c.fillStyle = "gray"
      c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    }
  }

  update() {
    this.draw()
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0
    } else {
      this.velocity.y += gravity
    }
  }

  attack() {
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100)
  }
}

const player = new Sprite({
  position: {
    x: 400,
    y: 315,
  },
  velocity: {
    x: 0,
    y: 5,
  },
  offset: {
    x: 0,
    y: 0,
  },
})

const enemy = new Sprite({
  position: {
    x: 600,
    y: 315,
  },
  velocity: {
    x: 0,
    y: 4,
  },
  color: "rgba(56, 78, 110)",
  offset: {
    x: -50,
    y: 0,
  },
})

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

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function determmineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId)
  document.querySelector("#displayText").style.display = "flex"
  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Draw"
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins"
  } else if (player.health < enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 2 Wins"
  }
}

let timer = 61
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector("#timer").innerHTML = timer
  }
  if (timer === 0) {
    determmineWinner({ player, enemy })
  }
}
decreaseTimer()

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
    player.velocity.x = -10
  } else if (keys.q.pressed && lastkey === "q") {
    player.velocity.x = -10
  } else if (keys.d.pressed && player.lastkey === "d") {
    player.velocity.x = 10
  }

  // Enemy Movement //
  if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 10
  } else if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
    enemy.velocity.x = -10
  }

  //detect collition player
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false
    enemy.health -= 10
    document.querySelector("#enemyHealthBar").style.width = enemy.health + "%"
    console.log("hit")
  }
  //detect collition enemy
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false
    player.health -= 10
    document.querySelector("#playerHealthBar").style.width = player.health + "%"
    console.log("Enemy Attacked")
  }

  // end game base oin health

  if (enemy.health <= 0 || player.health <= 0) {
    determmineWinner({ player, enemy, timerId })
  }
}

animate()

//listners
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
    case "g":
      player.isAttacking = true
      break
    case "/":
      enemy.isAttacking = true
      break
  }
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
    case "g":
      player.isAttacking = false
      break
    case "/":
      enemy.isAttacking = false
      break
  }
})
