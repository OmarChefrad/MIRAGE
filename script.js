const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1200
canvas.height = 689

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./GameAssets/Dunes.png",
  scale: 1,
  framesMax: 1,
})

const player = new Fighter({
  position: {
    x: 200,
    y: 220,
  },
  velocity: {
    x: 0,
    y: 5,
  },

  imageSrc: "./GameAssets/Martial Hero/Sprites/Idle.png",
  scale: 4,
  framesMax: 8,
  offset: {
    x: 70,
    y: 0,
  },
  sprites: {
    idle: { imageSrc: "./GameAssets/Heavy Bandit/HeavyBanditIdle.png", framesMax: 8 },
    run: { imageSrc: "./GameAssets/Heavy Bandit/HeavyBanditRun.png", framesMax: 8 },
    jump: { imageSrc: "./GameAssets/Heavy Bandit/HeavyBanditJump.png", framesMax: 1 },
    attack: { imageSrc: "./GameAssets/Heavy Bandit/HeavyBanditAttack.png", framesMax: 4 },
    takeahit: { imageSrc: "./GameAssets/Heavy Bandit/HeavyBanditHit.png", framesMax: 3 },
    death: { imageSrc: "./GameAssets/Heavy Bandit/HeavyBanditDeath.png", framesMax: 8 },
    fall: { imageSrc: "./GameAssets/Heavy Bandit/HeavyBanditFall.png", framesMax: 2 },
  },
  attackBox: {
    offset: {
      x: 0,
      y: 0,
    },
    width: 70,
    height: 50,
  },
})

const enemy = new Fighter({
  position: {
    x: 900,
    y: 250,
  },
  velocity: {
    x: 0,
    y: 4,
  },
  color: "rgba(56, 78, 110)",
  offset: {
    x: 30,
    y: 0,
  },
  imageSrc: "GameAssets/light Bandit/LightBanditIdle.png",
  scale: 4,
  sprites: {
    idle: { imageSrc: "./GameAssets/Light Bandit/LightBanditIdle.png", framesMax: 8 },
    run: { imageSrc: "./GameAssets/Light Bandit/LightBanditRun.png", framesMax: 8 },
    jump: { imageSrc: "./GameAssets/Light Bandit/LightBanditJump.png", framesMax: 1 },
    attack: { imageSrc: "./GameAssets/Light Bandit/LightBanditAttack.png", framesMax: 4 },
    takeahit: { imageSrc: "./GameAssets/Light Bandit/LightBanditTakeAHit.png", framesMax: 4 },
    death: { imageSrc: "./GameAssets/Light Bandit/LightBanditDeath.png", framesMax: 8 },
    fall: { imageSrc: "./GameAssets/Light Bandit/LightBanditFall.png", framesMax: 2 },
  },
  attackBox: {
    offset: {
      x: 0,
      y: 0,
    },
    width: 70,
    height: 50,
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

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = "black"
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // Check if two keys in  x axes dont get conflicted//
  // Player movement

  if (keys.a.pressed && player.lastkey === "a") {
    player.velocity.x = -10
    player.switchSprite("run")
  } else if (keys.q.pressed && lastkey === "q") {
    player.velocity.x = -10
    player.switchSprite("run")
  } else if (keys.d.pressed && player.lastkey === "d") {
    player.velocity.x = 10
    player.switchSprite("run")
  } else {
    player.switchSprite("idle")
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump")
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall")
  }

  //Enemy Mouvement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5
  } else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 5
  }

  // Enemy Movement //

  if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 10
    enemy.switchSprite("run")
  } else if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
    enemy.velocity.x = -10
    enemy.switchSprite("run")
  } else {
    enemy.switchSprite("idle")
  }
  //
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump")
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall")
  }

  //detect collition player
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    enemy.takeahit()
    player.isAttacking = false

    document.querySelector("#enemyHealthBar").style.width = enemy.health + "%"
  }
  //detect collition enemy
  if (
    rectangularCollision({
      rectangle1: enemy,

      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    player.takeahit()
    enemy.isAttacking = false
    player.health -= 10
    document.querySelector("#playerHealthBar").style.width = player.health + "%"
  }

  // end game base oin health

  if (enemy.health <= 0 || player.health <= 0) {
    determmineWinner({ player, enemy, timerId })
  }
}

animate()

//listners
window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      //right
      case "d":
        keys.d.pressed = true
        player.lastkey = "d"
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
      //top
      case "w":
        player.velocity.y = -13
        break
      case "z":
        player.velocity.y = -13
        break
      //bottom
      case "s":
        player.velocity.y = 13
        break
      // attack
      case "g":
        player.attack()
        break
    }
    if (!enemy.dead)
      switch (event.key) {
        case "ArrowRight":
          keys.ArrowRight.pressed = true
          enemy.lastkey = "ArrowRight"
          break
        case "ArrowLeft":
          keys.ArrowLeft.pressed = true
          enemy.lastkey = "ArrowLeft"
          break
        case "ArrowUp":
          enemy.velocity.y = -13
          break
        case "ArrowDown":
          enemy.velocity.y = 13
          break
        // attack
        case "/":
          enemy.attack()
          break
      }
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
