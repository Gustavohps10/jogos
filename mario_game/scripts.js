window.onload = function() {
    var canvas, ctx, altura, largura, frames = 0;

    const marioSprites = new Image();
    marioSprites.src = 'images/mario-cap.png';

    const chaoSprites = new Image();
    chaoSprites.src = 'images/chao.png';

    altura = window.innerHeigth;
    largura = window.innerWidth;

    if(largura >=500){
        largura = 400;
        altura = 600;
    }

    canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    canvas.style.border = "1px solid #000";

    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    const fundo = {
        
        
        desenha(){
            ctx.fillStyle = '#50beff'
            ctx.fillRect(0, 0, largura, altura);
        }
    }
    
    const chao = {
        spriteX: 18,
        spriteY: 1,
        largura: 15,
        altura: 15,
        x: 0,
        y: canvas.height-15,
        desenha(){
            for(let i=0; i < 27; i++){
                ctx.drawImage(chaoSprites, chao.spriteX, chao.spriteY, chao.largura, chao.altura, chao.x + chao.largura*i, chao.y, chao.largura, chao.altura);
            }
        }
    }
    function fazColisao(mario, chao) {
        const marioY = mario.y + mario.altura;
        const chaoY = chao.y;
        if (marioY >= chaoY) {
            return true
        }
        return false
    }

    const mario = {
        spriteX: 0,
        spriteY: 0,
        largura: 28,
        altura: 40,
        x: 39,
        y: 40,
        gravidade: 0.5,
        velocidade: 0,
        forcaPulo: 11,
        pula(){
            mario.velocidade = - mario.forcaPulo;
            //ctx.drawImage(marioSprites, mario.spriteX, mario.spriteY, mario.largura, mario.altura, mario.x, mario.y, mario.largura, mario.altura);
        },
        atualiza(){
            
            mario.velocidade +=  this.gravidade;
            mario.y += mario.velocidade;
            if(fazColisao(mario, chao)){
                mario.gravidade = 0;
                mario.velocidade = 0;
                mario.y = 20;
            }
            
        },
        desenha(){
            ctx.drawImage(marioSprites, mario.spriteX, mario.spriteY, mario.largura, mario.altura, mario.x, mario.y, mario.largura, mario.altura);
        }
    }
    function loop() {
        frames++;
        fundo.desenha();
        mario.atualiza();
        mario.desenha();
        chao.desenha();
        window.requestAnimationFrame(loop);
    }
    
    canvas.addEventListener('mousedown', mario.pula);
    loop();
}