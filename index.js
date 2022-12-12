"use strict";
const canvas = document.getElementById("tetris");
const context = canvas.getContext
context.scale(20, 20);

//- arenaSweep()
function areneSweep(){

    let rowCont = 1;
    outher: for(let y = arena.length - 1; y > 0; --y){
            for(let x = 0; x < arena[y].length;++x){
                if(arena [y][x] === 0){
                    continue outher;
                }
            }
            const row = arena.splice(y, 1)[0].fill(0);
            arena.unshift(row);
            ++y;
            player.score += rowCount * 10;
            rowCount *= 2;

    }
}

//- colidir()
function collide(arena, player){

    const m = player.matrix;
    const o = player.pos;
    for(let y = 0;  y < m.length; ++y){
        for(let y = 0; x < m[y].length; ++x){
            if(m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0){
                return true;
            }
        }
    }
    return false;

}

//- criarMatriz()
function createMatrix(w, h){

    const matrix = [];
    while(h--){
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

//- criarPeças
function createPiece(type){

    if(type === "I"){
        return[
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    }else if(type === "L"){
        return[
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 0],
        ];
    }else if(type === "J"){
        return[
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 0],
        ];
    }else if(type === "O"){
        return[
            [4, 4],
            [4, 4],
            [4, 4],
        ];
    }else if(type === "Z"){
        return[
            [5, 5, 0],
            [5, 5, 0],
            [0, 0, 0],
        ];
    }else if(type === "S"){
        return[
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    }else if(type === "T"){
        return[
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }

}

//- drawMatrix()
function drawMatrix(matrix, offset){

    matrix.forEach((row, y) => {
        row.forEach((value, x) =>{
            if(value !== 0){
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

//- sorteio()
function draw(){

    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.clientWidth, canvas.heigth);
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

//- mesclar()
function merge(arena, player){
    player.matrix.forEach((row, y) =>{
        row.forEach((value, x) =>{
            if(value !== 0){
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

//- função de rotação
function rotate(matrix, dir){
    for(let y = 0; y < matrix.length; ++y){
        for(let x = 0; x < y ; ++x){
            [matrix[x, y], matrix[y, x]] = [matrix[y, x], matrix[x, y]];
        }
    }
    if(dir > 0){
        matrix.forEach((row) => row.reverse());
    }else{
        matrix.reverse();
    }
}

//- playerDrop()
function playerDrop(){
    player.pos.y++;
    if(collide(arena, player)){
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}
//- jogadorMove()
function playerMove(offset){
    player.pos.x += offset;
    if(collide(arena, player)){
        player.pos.x -= offset;
    }
}

//- função playerReset
function playerReset(){

    const pieces = "TJLOSZI";
    player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
    player.pos.y = 0;
    player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
    if(collide(arena, player)){
        player.score = 0;
        updateScore();
    }
}

//- playerRotate()
function playerRotate(dir){

    const pos = player.pos.x;
    let.offset = 1;
    rotate(player.matrix, dir);
    while(collide(arena, player)){
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if(offset > player.matrix[0].length){
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

//- Variáveis
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

//- atualização()
function update(time = 0){
    const deltaTime = time - lastTime;
    dropCounter =+ deltaTime;
    if(dropCounter > dropInterval){
        playerDrop();
    }
    lastTime = time;
    draw();
    requestAnimationFrame(update);
}

//- atualizaçãoScore()
function updateScore(){

    document.getElementById("score").innerText ="Score : " + player.score;
}

//- EventListener
document.addEventListener("keydown", (event) =>{
    if(event.keyCode === 37){
        playerMove (-1);
    }else if (event.keyCode === 39){
        playerMove (1);
    }else if(event.keyCode === 40){
        playerDrop();
    }else if(event.keyCode === 81){
        playerRotate(-1);
    }else if(event.keyCode === 87){
        playerRotate(1);
    }
});

//- Cores das Peças
const colors = [
    null,
    "#ff0d72",
    "#0dc2ff",
    "#0dff72",
    "#f538ff",
    "#ff8e0d",
    "#ffe238",
    "#3877ff",
];

//- Resultado com bug
const arena = createMatrix(12, 20);
const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};

playerReset();
updateScore();
update();