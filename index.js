const canvas = document.getElementById('canvas');

const c = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 850;

const cDiv = document.getElementById('canvasContainer');

const scoreEl = document.querySelector('#scoreEl');
console.log(scoreEl);

const hakEl = document.querySelector('#hakEl');

canvas.width = innerWidth;
canvas.height = innerHeight;

var sesler = document.getElementById("sesler");
sesler.volume = 0.3;

let winButton = document.getElementById('winButton');

const GAME_STATES = {
    START: 0,
    RUNNING: 1,
    PAUSED: 2,
    GAME_OVER: 3
}
let gameState = GAME_STATES.START;

class Boundary {
    
    static width = 40;
    static height = 40;

    constructor({position, image}){
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image;
    }

    draw(){
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
}

class Player{
    constructor({ 
        position,
        velocity
    })
    {
        this.position = position;   
        this.velocity = velocity;
        this.radius = 19;
        this.radians = 0.75;
        this.openRate = 0.12;
        this.rotation = 0;
    }   

    draw() {

        c.save();
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation);
        c.translate(-this.position.x, -this.position.y)
        c.beginPath();
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            this.radians,  
            Math.PI * 2 - this.radians
        );

        c.lineTo(this.position.x, this.position.y);
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
        c.restore();
    };

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.radians < 0 ||this.radians > 0.75){
            this.openRate = -this.openRate; ;
        }

        this.radians += this.openRate;
    };
}

let validDirections = [
   
];

let directionTemp = [
    { x: 1.3, y: 0 },
    { x: -1.3, y: 0 },
];

class Ghost{
    static speed = 1.3;
    constructor({ 
        position,
        velocity,
        color = 'black',
        image,
        name
    })
    {
        this.name = name;
        this.position = position;   
        this.velocity = velocity;
        this.image = image;
        this.radius = 18;
        this.color = color;
        this.prevCollisions = [];
        this.speed = 1.3;
        this.scared = false;
        
    }

    draw() {
        c.beginPath();
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,  
            Math.PI * 2
        );
        c.fillStyle = this.color;
        c.fill();
        c.closePath();

        c.drawImage(
            this.image,
            this.position.x - this.radius,
            this.position.y - this.radius,
            this.radius * 2,
            this.radius * 2
        );
        
    };

    update(){
        this.draw();

        if (this.collidesWithWallInDirection(this.velocity.x, this.velocity.y)) {
            const newDirection = this.getValidDirection();
            if (newDirection) {
                this.velocity = newDirection;
            }
        }
    

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };

    collidesWithWallInDirection(dx, dy) {
        const nextX = this.position.x + dx;
        const nextY = this.position.y + dy;
        
        // Duvar veya engel kontrolü yapın
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circleCollidesWithRect({
                circle: { ...this, position: { x: nextX, y: nextY } },
                rectangle: boundary
            })) {
                return true;
            }
        }
        
        return false;
    }

    getValidDirection() {
        const possibleDirections = [
            { x: Ghost.speed, y: 0 },
            { x: -Ghost.speed, y: 0 },
            { x: 0, y: Ghost.speed },
            { x: 0, y: -Ghost.speed }
        ];

        if (directionTemp.length > 0){

            validDirections = directionTemp
            directionTemp = []
            return validDirections[Math.floor(Math.random() * directionTemp.length)];

        }

        // Geçerli bir yöne yönlendirin
        validDirections = possibleDirections.filter(direction => !this.collidesWithWallInDirection(direction.x, direction.y));
        
        console.log(validDirections)

        //eğer geçerli yönlerde şimdiki yönün zıttı bulunuyorsa 

        if (validDirections.length > 0) {
            return validDirections[Math.floor(Math.random() * validDirections.length)];
        }
        
        return null;
    }
}

class Pellet{
    constructor({ 
        position
    })
    {
        this.position = position;
        this.radius = 4;
    }

    draw() {
        c.beginPath();
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,  
            Math.PI * 2
        );
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    };
}

class PowerUp{
    constructor({ 
        position
    })
    {
        this.position = position;
        this.radius = 8;
    }

    draw() {
        c.beginPath();
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,  
            Math.PI * 2
        );
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    };
}


function createImage(src){
    const image = new Image();
    image.src = src;
    return image;
}

const ghostImages = [
    createImage("./imgs/red.png"),
    createImage("./imgs/pink.png"),
    createImage("./imgs/orn.png"),
    createImage("./imgs/lblue.png")
];

var pellets = [];

let powerUps = [];

const boundaries = [];

const ghosts = [
    new Ghost({
        position: {
            x: Boundary.width * 9 + Boundary.width / 2,
            y: Boundary.height * 9 + Boundary.height / 2
        },
        velocity: {
            x: 0,
            y: -Ghost.speed
        },
        name : 'g1red',
        image: ghostImages[0]
    }),
    new Ghost({
        position: {
            x: Boundary.width * 9 + Boundary.width / 2,
            y: Boundary.height * 9 + Boundary.height / 2
        },
        velocity: {
            x: 0,
            y: -Ghost.speed
        },
        name : 'g2pink',
        image: ghostImages[1]
    }),
    new Ghost({
        position: {
            x: Boundary.width * 9 + Boundary.width / 2,
            y: Boundary.height * 9 + Boundary.height / 2
        },
        velocity: {
            x: 0,
            y: -Ghost.speed
        },
        name : 'g3ornge',
        image: ghostImages[2]
    }),

];


const player = new Player({
    position: {
        x: Boundary.width * 9 +  Boundary.width / 2,
        y: Boundary.height * 15  + Boundary.height / 2
    },      
    velocity: {
        x: 0,
        y: 0
    }
});

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

var win = false;

let lastKey = '';
let score = 0;

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', 'T', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
    ['|', 'p', '<', '>', ' ', '<', '-', '>', ' ', 'V', ' ', '<', '-', '>', ' ', '<', '>', 'p', '|'],
    ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
    ['|', ' ', '<', '>', ' ', 'A', ' ', '<', '-', 'T', '-', '>', ' ', 'A', ' ', '<', '>', ' ', '|'],
    ['|', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', '|'],
    ['4', '-', '-', '2', ' ', '(', '-', '>', ' ', 'V', ' ', '<', '-', ')', ' ', '1', '-', '-', '3'],
    ['s', 's', 's', '|', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|', 's', 's', 's'],
    ['1', '-', '-', '3', ' ', 'V', ' ', '1', '>', 'g', '<', '2', ' ', 'V', ' ', '4', '-', '-', '2'],
    ['|', 'p', ' ', ' ', ' ', ' ', ' ', '|', 'g', 'g', 'g', '|', ' ', ' ', ' ', ' ', ' ', 'p', '|'],
    ['4', '-', '-', '2', ' ', 'A', ' ', '4', '-', '-', '-', '3', ' ', 'A', ' ', '1', '-', '-', '3'],
    ['s', 's', 's', '|', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|', 's', 's', 's'],
    ['1', '-', '-', '3', ' ', 'V', ' ', '<', '-', 'T', '-', '>', ' ', 'V', ' ', '4', '-', '-', '2'],
    ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
    ['|', ' ', '<', '2', ' ', '<', '-', '>', ' ', 'V', ' ', '<', '-', '>', ' ', '1', '>', ' ', '|'],
    ['|', 'p', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', 'p', '|'],
    ['(', '>', ' ', 'V', ' ', 'A', ' ', '<', '-', 'T', '-', '>', ' ', 'A', ' ', 'V', ' ', '<', ')'],
    ['|', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', '|'],
    ['|', ' ', '<', '-', '-', '_', '-', '>', ' ', 'V', ' ', '<', '-', '_', '-', '-', '>', ' ', '|'],
    ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3'],
];

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch(symbol){ 
            case '-':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/pipeHorizontal.png")
                }));
                break;
            case ' ':
                pellets.push(new Pellet({
                    position: {
                        x: Boundary.width * j + Boundary.width / 2,
                        y: Boundary.height * i +  Boundary.height / 2
                    }
                }));
                break
            case '|':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j  ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/pipeVertical.png")
                }));
                break;
            case '1':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/pipeCorner1.png")
                }));
                break;
            case '2':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/pipeCorner2.png")
                }));
                break;
            case '3':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/pipeCorner3.png")
                }));
                break;
            case '4':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/pipeCorner4.png")
                }));
                break;
            case 'b':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/block.png")
                }));
                break;
            case 'A':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/capTop.png")
                }));
                break;
            case 'T':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/pipeConnectorBottom.png")
                }));
                break;
            case 'V':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/capBottom.png")
                }));
                break;
            case '<':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/capLeft.png")
                }));
                break;
            case '>':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/capRight.png")
                }));
                break;
            case '_':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/pipeConnectorTop.png")
                }));
                break;
            case '(':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/pipeConnectorRight.png")
                }));
                break;
            case ')':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j ,
                        y: Boundary.height * i 
                    },
                    image: createImage("./imgs/pipeConnectorLeft.png")
                }));
                break;
            case 'p':
                powerUps.push(new PowerUp({
                    position: {
                        x: Boundary.width * j + Boundary.width / 2,
                        y: Boundary.height * i  + Boundary.height / 2
                    },
                }));
                break;

        }
    })
});

function circleCollidesWithRect({
    circle,
    rectangle
}){ 
    const padding = 0;//Boundary.width / 2 - circle.radius - 1;
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding && 
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding && 
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding && 
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
    )
}

function ghostCollidesWithRect({
    ghost,
    rectangle
}){
    const padding = Boundary.width / 2 - ghost.radius - 1;
    return (ghost.position.y - ghost.radius + ghost.velocity.y <= rectangle.position.y + rectangle.height + padding &&
        ghost.position.x + ghost.radius + ghost.velocity.x >= rectangle.position.x - padding &&
        ghost.position.y + ghost.radius + ghost.velocity.y >= rectangle.position.y - padding &&
        ghost.position.x - ghost.radius + ghost.velocity.x <= rectangle.position.x + rectangle.width + padding  
    )
}

function drawPause() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    c.fillStyle = 'black';

    c.font = '48px Arial';

    c.fillStyle = 'white'; // Yazı rengini beyaz yapın
    c.fillText('Paused', canvas.width / 2 - 650, canvas.height / 2 - 50);

    c.font = '24px Arial';

    c.fillStyle = 'white'; // Yazı rengini beyaz yapın
    c.fillText('Press SPACE to resume', canvas.width / 2 - 670, canvas.height / 2 + 50);
}
var hak = 3;

function drawMenu() {

    let startButton = document.getElementById('startButton');
    startButton.style.display = 'block';


    c.clearRect(0, 0, canvas.width, canvas.height);

    c.fillStyle = 'black';

    c.font = '48px Arial';

    c.fillStyle = 'white'; // Yazı rengini beyaz yapın
    c.fillText('Pacman Oyunu', canvas.width / 2 - 650, canvas.height / 2 - 50);

    c.font = '24px Arial';

    c.fillStyle = 'white'; // Yazı rengini beyaz yapın
    c.fillText('Oyuna başlamak için butona basın', canvas.width / 2 - 670, canvas.height / 2 + 50);
    
}

function drawGameOver() {

    if (hak == 0){
        c.clearRect(0, 0, canvas.width, canvas.height);

        c.fillStyle = 'black';

        c.font = '48px Arial';

        c.fillStyle = 'white'; // Yazı rengini beyaz yapın
        c.fillText('Oyun bitti', canvas.width / 2 - 600, canvas.height / 2 - 50);

        c.font = '24px Arial';

        c.fillStyle = 'white'; // Yazı rengini beyaz yapın
        c.fillText('Yeniden başlamak için sayfayı yenileyin', canvas.width / 2 - 620, canvas.height / 2 + 50);

        winButton.style.display = 'block';
        restartButton.style.display = 'none';
    }

    c.clearRect(0, 0, canvas.width, canvas.height);

    c.fillStyle = 'black';

    c.font = '48px Arial';  

    c.fillStyle = 'white'; // Yazı rengini beyaz yapın
    c.textAlign = 'center'; // Metni yatayda ortala
    c.textBaseline = 'middle'; // Metni dikeyde ortala
    c.fillText('Kaybettiniz', canvas.width / 2 - 600, canvas.height / 2 - 50);

    c.font = '24px Arial';

    c.margin = 'auto';

    c.fillStyle = 'white'; // Yazı rengini beyaz yapın
    c.textAlign = 'center'; // Metni yatayda ortala
    c.textBaseline = 'middle'; // Metni dikeyde ortala
    c.fillText('Yeniden başlamak için butona basın', canvas.width / 2 - 620, canvas.height / 2 + 50);
    
}

function drawWin() {

    winButton.style.display = 'block';

    c.clearRect(0, 0, canvas.width, canvas.height);

    c.fillStyle = 'black';

    c.font = '48px Arial';

    c.fillStyle = 'white'; // Yazı rengini beyaz yapın

    c.fillText('KAZANDINIZ', canvas.width / 2 - 650, canvas.height / 2 - 50);

    c.font = '24px Arial';

    c.fillStyle = 'white'; // Yazı rengini beyaz yapın

    c.fillText('Yeniden oynayabilirsiniz veya Level 2 ye geçebilirsiniz!', canvas.width / 2 - 750, canvas.height / 2 + 50);

}

startButton.addEventListener('click', () => {
    gameState = GAME_STATES.RUNNING;
    startButton.style.display = 'none'; // Düğmeyi tekrar gizleyin
    sesler.play();

});

winButton.addEventListener('click', () => {
    location.reload();
    winButton.style.display = 'none'; // Düğmeyi tekrar gizleyin
});


let IsCollided = false;

let animationId;

const initialPlayerPosition = { x: Boundary.width * 9 + Boundary.width / 2,
    y: Boundary.height * 15 + Boundary.height / 2};
const initialGhostPositions = [
  { x: Boundary.width * 9 + Boundary.width / 2, y: Boundary.height * 9 + Boundary.height / 2 },
  // Diğer hayaletlerin başlangıç pozisyonlarını da burada tanımlayın
];

function restartGame(){ 
    
    cancelAnimationFrame(animationId);

    player.position = { ...initialPlayerPosition };
    player.velocity = { x: 0, y: 0 };
  
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].position.x = Boundary.width * 9+ Boundary.width / 2;
        ghosts[i].position.y = Boundary.height * 9 + Boundary.height / 2;
        ghosts[i].velocity = { x: 0, y: -Ghost.speed };
    }
    
    score = 0;
    scoreEl.innerHTML = score;

}

let level2 = false;


function drawLevel2(){

    cancelAnimationFrame(animationId);

    ghosts.push(new Ghost({
        position: {
            x: Boundary.width * 9 +  Boundary.width / 2,
            y: Boundary.height * 9 + Boundary.height / 2
        },
        velocity: {
            x: 0,
            y: -Ghost.speed
        },
        name : 'g4blue',
        image: createImage("./imgs/lblue.png")
    }))

    player.position = { ...initialPlayerPosition };
    player.velocity = { x: 0, y: 0 };
  
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].position.x = Boundary.width * 9 + Boundary.width / 2;
        ghosts[i].position.y = Boundary.height * 9 + Boundary.height / 2;
        ghosts[i].velocity = { x: 0, y: -Ghost.speed };
    }
    
    score = 0;
    scoreEl.innerHTML = score;
    
    win = false;
    
    pellets = [];
    powerUps = [];

    map.forEach((row, i) => {
        row.forEach((symbol, j) => {
            switch(symbol){ 
                case ' ':
                    pellets.push(new Pellet({
                        position: {
                            x: Boundary.width * j + Boundary.width / 2,
                            y: Boundary.height * i + Boundary.height / 2
                        }
                    }));
                    break
                case 'p':
                    powerUps.push(new PowerUp({
                        position: {
                            x: Boundary.width * j + Boundary.width / 2,
                            y: Boundary.height * i + Boundary.height / 2
                        },
                    }));
                    break;
            }
        })
    });

    hak = 3;

    gameState = GAME_STATES.RUNNING;

    animate();

}

let level2button = document.getElementById('level2');

level2button.addEventListener('click', () => {
    level2button.style.display = 'none'; // Düğmeyi tekrar gizleyin
    drawLevel2();
});

let gameOverCooldown = false;

function handleGameOverState() {


  if (!gameOverCooldown) {
    drawGameOver();

    const restartButton = document.getElementById('restartButton');
    if (hak === 0){
        restartButton.style.display = 'none';
    }else {
        restartButton.style.display = 'block';
    }
    

    restartButton.addEventListener('click', () => {
        gameState = GAME_STATES.RUNNING;
        restartButton.style.display = 'none'; // Düğmeyi tekrar gizleyin
        restartGame();
        animate(); // Oyunu yeniden başlatın
    });
    gameOverCooldown = true; // Bekleme süresini başlatın
  }
}

let eatingSound = false;

function playEatingSound() {
    if (!eatingSound) {
        sesler.src = "./imgs/hamham.mp3";
        sesler.play();
        
        eatingSound = true;
    }
}

sesler.addEventListener('ended', () => {
    eatingSound = false;
});

function animate () {

    

    

    if (gameState === GAME_STATES.START) {

        drawMenu();
        keys.space.pressed = false;

    }
    else if (gameState === GAME_STATES.PAUSED) {
        drawPause();
        if (keys.space.pressed) {
            gameState = GAME_STATES.RUNNING;
        }
        keys.space.pressed = false;
    }
    else if (gameState === GAME_STATES.GAME_OVER) {

        gameOverCooldown = false;
        handleGameOverState();
        keys.space.pressed = false;

    }
    else {

        c.clearRect(0, 0, canvas.width, canvas.height);
        
        if (keys.w.pressed && lastKey === 'w'){
            for (let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i];
                if (circleCollidesWithRect({
                    circle : {...player, velocity : {
                        x: 0,
                        y: -1.8
                    }},
                    rectangle : boundary
                })){
                    player.velocity.y = 0;
                    break;
                }else{
                    player.velocity.y = -1.8;
                }
            }
        }
        else if (keys.a.pressed && lastKey === 'a'){
            for (let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i];
                if (circleCollidesWithRect({
                    circle : {...player, velocity : {
                        x: -1.8,
                        y: 0
                    }},
                    rectangle : boundary
                })){
                    player.velocity.x = 0;
                    break;
                }else{
                    player.velocity.x = -1.8;
                }
            }
        }
        else if (keys.s.pressed && lastKey === 's'){
            for (let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i];
                if (circleCollidesWithRect({
                    circle : {...player, velocity : {
                        x: 0,
                        y: 1.8
                    }},
                    rectangle : boundary
                })){
                    player.velocity.y = 0;
                    break;
                }else{
                    player.velocity.y = 1.8;
                }
            }
        }
        else if (keys.d.pressed && lastKey === 'd'){
            for (let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i];
                if (circleCollidesWithRect({
                    circle : {...player, velocity : {
                        x: 2.5,
                        y: 0
                    }},
                    rectangle : boundary
                })){
                    player.velocity.x = 0;
                    break;
                }else{
                    player.velocity.x = 1.8;
                }
            }
        }
    
        for (let i = ghosts.length - 1; 0 <= i; i-- ){
            const ghost = ghosts[i];
            if (
                Math.hypot(ghost.position.x - player.position.x, 
                ghost.position.y - player.position.y) < 
                (ghost.radius + player.radius)
                )
            {
    
                if (ghost.scared) {
    
                    ghosts.splice(i, 1)
                    score += 200;
                    scoreEl.innerHTML = score;
                
                } else {
    
                    console.log('GAME OVER');
                    gameState = GAME_STATES.GAME_OVER;
                    IsCollided = true;
                    hak--;
                    hakEl.innerHTML = hak;

                    break;
                
                }
            }
        }
    
        for (let i = powerUps.length - 1; 0 <= i; i-- ){
            const powerUp = powerUps[i];
            powerUp.draw();
            if (Math.hypot(powerUp.position.x - player.position.x, 
                powerUp.position.y - player.position.y) < 
                (powerUp.radius + player.radius))
                {
                    console.log('POWERUP');
                    powerUps.splice(i, 1);
                    ghosts.forEach(ghost =>{
                        ghost.scared = true;
                        ghost.image = createImage("C:/Dersler/Pacman2/imgs/scared.png");
                        setTimeout(()=>{
                            ghost.scared = false;
                            console.log(ghost.scared)
                            ghost.image = ghostImages[Math.floor(Math.random() * ghostImages.length)];
                        }, 5500)
                    })
    
                }
    
        }
    
        for (let i = pellets.length - 1; i >= 0; i--){
            const pellet = pellets[i];
            pellet.draw();
    
            if (Math.hypot(pellet.position.x - player.position.x,   
                pellet.position.y - player.position.y) < 
                (pellet.radius + player.radius))
                {
                
                console.log('touching');
                pellets.splice(i, 1);
                score += 10;
                scoreEl.innerHTML = score;
                playEatingSound();
                
                if (powerUps.length === 0){
                    win = true;
                    level2 = true;
                    level2button.style.display = 'block'
                }
                   
            }
        }
        boundaries.forEach(boundary => {
            boundary.draw()
            
            if (circleCollidesWithRect({
                circle : player,
                rectangle : boundary
            })
            ){
                console.log('collided');
                player.velocity.y = 0;
                player.velocity.x = 0;
            }
        });
        player.update();
        //player.velocity.y= 0;
        //player.velocity.x= 0;
    
        ghosts.forEach((ghost, i) => {
            
            ghost.update();

        }
        );
    
        if (player.velocity.x > 0) player.rotation = 0;
        else if (player.velocity.x < 0) player.rotation = Math.PI;
        else if (player.velocity.y > 0) player.rotation = Math.PI / 2;
        else if (player.velocity.y < 0) player.rotation = Math.PI * 3 / 2;
        else player.rotation = 0;
    }

    if (IsCollided) {
        sesler.src = "./imgs/gameover.mp3"
        sesler.play();
        gameState = GAME_STATES.GAME_OVER;
        IsCollided = false;
        animate();
    } else if (win){

        drawWin();        

    }
    else {
        animationId = requestAnimationFrame(animate);
    }

}
animate();

addEventListener(('keydown'), ({key}) => {
    console.log(key);
    switch(key){
        case 'w' || 'up':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 'a' || 'ArrowLeft':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 's' || 'ArrowDown':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'd' || 'ArrowRight':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
    console.log(player.velocity);
})

addEventListener(('keyup'), ({key}) => {
    console.log(key);
    switch(key){
        case 'w' || 'ArrowUp':
            keys.w.pressed = false;
            break;
        case 'a' || 'ArrowLeft':
            keys.a.pressed = false;
            break;
        case 's' || 'ArrowDown':
            keys.s.pressed = false;
            break;
        case 'd' || 'ArrowRight':
            keys.d.pressed = false;
            break;
        case ' ':
            keys.space.pressed = true;
            break;
    }
    console.log(player.velocity);
})