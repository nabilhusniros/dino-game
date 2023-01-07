var rootElem = document.querySelector(":root")
var gameElem = document.querySelector('#game')
var dinoElem = gameElem.querySelector('.dino')
var scoreElem = gameElem.querySelector('.score')
var groundElem = gameElem.querySelector('.ground')
var cactusElem = groundElem.querySelector('.cactus')


var gameSpeed = 4000
var jumpSpeed = 600
var maxJump = 250
var speedScale = 1

var score = 0
var gameStarted = false
var gameOver = false

function setCustomProperty (elem, prop, value) {
    elem.style.setProperty(prop, value)
}

function handleJump(e) {
    if (e.code !== 'Space') return;
    var audio = document.querySelector('.audio-jump')
    audio.play()
    dinoElem.classList.add('jump')
    dinoElem.addEventListener('animationend', function() {
        dinoElem.classList.remove('jump')
    })
}

function startGame() {
    gameStarted = true
    gameElem.classList.add('game-started')
    document.addEventListener('keydown', handleJump)
    window.requestAnimationFrame(updateGame)
}

function endGame() {
    gameOver = true
    var audio = document.querySelector('.audio-die')
    audio.play()
    gameElem.classList.add('game-over')
    document.removeEventListener('keydown', handleJump)
}

function updateGame() {
    setCustomProperty(rootElem, '--game-speed', gameSpeed)
    setCustomProperty(rootElem, '--jump-speed', jumpSpeed)
    setCustomProperty(rootElem, '--max-jump', maxJump)
    setCustomProperty(rootElem, '--speed-scale', speedScale)

    updateScore()
    updateCactus()
    if (checkGameOver()) {
        endGame()
        return
    }
    window.requestAnimationFrame(updateGame)
}

function isCollision(dinoRect, cactusRect) {  
    return (
        dinoRect.x < cactusRect.x + cactusRect.width &&
        dinoRect.x + dinoRect.width > cactusRect.x &&
        dinoRect.y < cactusRect.y + cactusRect.height &&
        dinoRect.y + dinoRect.height > cactusRect.y
        );
}

function checkGameOver() {
    if (gameOver) return true
    var dinoRect = dinoElem.getBoundingClientRect()
    var cactusRect = cactusElem.getBoundingClientRect()
    if (isCollision(dinoRect, cactusRect)) {
        return true
    }
    return false
}

var scoreInterval = 10
var currentScoreInterval = 0
function updateScore() {
    currentScoreInterval += 1
    if (currentScoreInterval % scoreInterval !== 0) {
    return
    }
    score += 1
    if (score === 0) return
    if (score % 100 === 0) {
        var audio = document.querySelector('.audio-point')
        audio.play()
        gameSpeed -= speedScale
    }

    var currentScoreElem = scoreElem.querySelector('.current-score')
    currentScoreElem.innerText = score.toString().padStart(5, '0')
}

function updateCactus() {
    var cactusXPos = cactusElem.getBoundingClientRect().x
    var isOffScreen = cactusXPos > window.innerWidth;
    if (isOffScreen === false) return

    var cacti = ['cactus-small-1', 'cactus-small-2', 'cactus-small-3']
    var randomNum = Math.floor(Math.random() * cacti.length)
    var cactus = cacti[randomNum]
    cactusElem.classList.remove(
        'cactus-small-1', 
        'cactus-small-2', 
        'cactus-small-3'
    )
    cactusElem.classList.add(cactus)
}

function fitScreen() {
    var width = window.innerWidth
    var height = window.innerHeight / 2;
    gameElem.style.width = width + 'px'
    gameElem.style.height = height + 'px'
    gameElem.style.zoom = 1.5
}

window.addEventListener('load', function() {
    fitScreen()

    window.addEventListener('resize', fitScreen)
    document.addEventListener('keydown', startGame, { once: true })
})