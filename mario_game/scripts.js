window.onload = function() {
    var canvas, ctx, canvasAltura, canvasLargura, frames = 0, pontos = 0;

    //IMAGES
    const marioSprites = new Image();
    marioSprites.src = 'images/mario-cap.png';

    const chaoSprites = new Image();
    chaoSprites.src = 'images/chao.png';

    const imgInicio = new Image();
    imgInicio.src = 'images/logo.png';

    const imgFundo = new Image();
    imgFundo.src = 'images/fundo.png'; 

    const blocoSprites = new Image();
    blocoSprites.src = 'images/bloco.png';

    const canoSprites = new Image();
    canoSprites.src = 'images/cano.png';

    const imgGameOver = new Image();
    imgGameOver.src = 'images/gameOver.png'

    //AUDIOS
    const marioVoa = new Audio()
    marioVoa.src = 'audios/smw_cape_rise.wav';

    const marioMorre = new Audio()
    marioMorre.src = 'audios/smw_lost_a_life.wav';

    const musicaFundo = new Audio()
    musicaFundo.src = 'audios/overworld_bgm.mp3';

    //CANVAS CONFIG

    telaAltura = window.innerHeigth;
    telaLargura = window.innerWidth;

    if(telaLargura >=500){
        canvasLargura = 850;
        canvasAltura = 600;
    }

    canvas = document.createElement("canvas");
    canvas.width = canvasLargura;
    canvas.height = canvasAltura;
    canvas.style.border = "1px solid #000";

    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);


    //JOGO
    const fundo = {
        altura: 436,
        largura: 512,
        x: 0,
        desenha(){
            console.log(this.y);
            ctx.fillStyle = '#f8e1b2'
            ctx.fillRect(0, 0, canvasLargura, canvasAltura);
            ctx.drawImage(imgFundo, 2, 438, this.largura, this.altura, this.x, canvasAltura-this.altura, this.largura, this.altura);
            ctx.drawImage(imgFundo, 2, 438, this.largura, this.altura, this.x+this.largura, canvasAltura-this.altura, this.largura, this.altura);
            ctx.drawImage(imgFundo, 2, 438, this.largura, this.altura, this.x+this.largura*2, canvasAltura-this.altura, this.largura, this.altura);
        },
        atualiza(){
            const movimentoFundo = 1;
            const repeteFundo = fundo.largura; 
            const movimento = fundo.x - movimentoFundo;
            fundo.x = movimento % repeteFundo;
        }
    }
    
    const chao = {
        spriteX: 18,
        spriteY: 0,
        largura: 15,
        altura: 15,
        x: 0,
        y: canvas.height-15,
        desenha(){
            for(let i=0; i <= canvasLargura/chao.largura+1; i++){
                ctx.drawImage(chaoSprites, chao.spriteX, chao.spriteY, chao.largura, chao.altura, chao.x + chao.largura*i, chao.y, chao.largura, chao.altura);
            }
        },
        atualiza(){
            const movimentoChao = 3;
            const repeteEm = chao.largura;
            const movimentacao = chao.x - movimentoChao;
            chao.x = movimentacao % repeteEm;
            
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
        y: 100,
        gravidade: 0.35,
        velocidade: 0,
        forcaPulo: 9,
        morre(){
            musicaFundo.pause();
            marioMorre.play();
            mudaTela(Telas.PERDEU);
        },
        pula(){
            mario.velocidade = - mario.forcaPulo;
            marioVoa.play();
            
        },
        atualiza(){
            if(fazColisao(mario, chao)){
                mario.morre();
                return;
            }  
            mario.velocidade +=  this.gravidade;
            mario.y += mario.velocidade;

            if(mario.velocidade < 0){
                this.frameAtual = 1;
            }else{
                this.frameAtual = 0;
            }
        },
        movimentos:[
            {spriteX: 0, spriteY: 0},
            {spriteX: 29, spriteY: 0},
            {spriteX: 60, spriteY: 0}
        ],
        frameAtual: 0,
        desenha(){
            const {spriteX, spriteY} = this.movimentos[this.frameAtual];
            ctx.drawImage(marioSprites,
            spriteX, spriteY,
            mario.largura, mario.altura,
            mario.x, mario.y,
            mario.largura, mario.altura);
        }
    }

    const canos = {
        largura: 32,
        altura: 32,
        chao:{
            spriteX: 0,
            spriteY: 34,
        },
        ceu:{
            spriteX: 0,
            spriteY: 34,
        },
        espaco: 80,
        desenha(){
            this.pares.forEach(function(par){
                const yRandom = par.y;
                const espacamentoCanos = 137;
                const tamanhoCano = 12;
                const alturaCanoCeu = (tamanhoCano+1)*canos.altura;
                const canoCeuX = par.x;
                //[Cano do Céu]
                for (let i = 0; i < tamanhoCano; i++) {
                    ctx.drawImage(canoSprites, 70+34, 36, canos.largura, canos.altura, canoCeuX, canos.altura*i+yRandom, canos.largura, canos.altura)
                }
                ctx.drawImage(canoSprites, 70+34, 70, canos.largura, canos.altura, canoCeuX, canos.altura*tamanhoCano+yRandom, canos.largura, canos.altura);

                //blocos de pedra
                ctx.drawImage(blocoSprites, 0, 34, 16, 16, canoCeuX + 16, 0, 16, 16);
                ctx.drawImage(blocoSprites, 0, 34, 16, 16, canoCeuX, 0, 16, 16);
                

                //[Cano do Chão]
                const canoChaoX = canoCeuX;
                const canoChaoY = 32;

                for (let i = 0; i <= tamanhoCano; i++){
                    ctx.drawImage(canoSprites, 70+34, 36, 32, 32, canoChaoX, canos.altura*i+alturaCanoCeu+espacamentoCanos+yRandom, 32, 32);
                }
                ctx.drawImage(canoSprites, 70+34, 2, 32, 32, canoChaoX, alturaCanoCeu+espacamentoCanos+yRandom, 32, 32);

                par.canoCeu = {
                    x: canoCeuX,
                    y: alturaCanoCeu + yRandom,
                }
                par.canoChao = {
                    x: canoCeuX,
                    y: alturaCanoCeu +espacamentoCanos + yRandom
                }
            });
        },
        
        temColisao(par){
            const cabecaMario = mario.y;
            const peMario = mario.y + mario.altura
            
            if(mario.x >= par.x && mario.x <= par.x+canos.largura ){
                if(cabecaMario <= par.canoCeu.y){
                    console.log('voce bateu no cano de cima')
                    return true;
                }
                if(peMario >=par.canoChao.y){
                    console.log('voce bateu no cano de baixo')
                    return true;
                }
            }
            return false;
        },
        pares: [],
        atualiza(){
            const passou100Frames = frames % 100 === 0;
            if(passou100Frames){
                canos.pares.push({
                    x: canvasLargura,
                    y: -Math.floor(Math.random() * (350 + 1) + 2)
                });
                
            }

            canos.pares.forEach(function(par){
                par.x -= 3;

                if(par.x + canos.largura <0){
                     canos.pares.shift();
                }
                if(mario.x == par.x+canos.largura){
                    placar.pontuacao +=1;
                }

                if(canos.temColisao(par)){
                    mario.morre();
                    mudaTela(Telas.PERDEU);
                }
            });
            
        }
    }

    const logo = {
        spriteX: 0,
        spriteY: 0,
        largura: 600,
        altura: 400,
        x: 200,
        y: 50,
        desenha(){
            ctx.drawImage(imgInicio, this.spriteX, this.spriteY, this.largura, this.altura, this.x, this.y, 400, 200);
        }
    }

    const placar = {
        pontuacao: 0,
        desenha(){
            ctx.font = '35px serif';
            ctx.textAlign = 'right'
            ctx.fillStyle = '#000'
            ctx.fillText(`PONTOS: ${placar.pontuacao}`, canvasLargura-35, 40)
        }
    }

    const telaFimJogo = {
        desenha(){
            ctx.drawImage(imgGameOver, 0, 0, 900, 400, 150, 150, 900, 400);
            ctx.font = '35px serif';
            ctx.textAlign = 'left'
            ctx.fillStyle = 'white';
            ctx.fillText(`RECORD: #     PONTOS: ${placar.pontuacao}`, 210, 465)
        }
    }

    //Telas
    let TelaAtiva = {};
    function mudaTela(novaTela){
        telaAtiva = novaTela;
    }
    const Telas = {
        INICIO: {
            desenha(){
                fundo.desenha();
                logo.desenha();
                
                mario.desenha();
                chao.desenha(); 
            },
            click(){
                musicaFundo.play();
                musicaFundo.currentTime = 0;
                mudaTela(Telas.JOGO);  
            },
            atualiza(){
                mario.y = 100;
                mario.velocidade = 0;
            },
        }
    }

    Telas.JOGO = {
        desenha(){
            fundo.desenha();
            mario.desenha();
            canos.desenha();
            placar.desenha();
            chao.desenha();
        },
        click(){
            mario.pula()
        },
        atualiza(){
            fundo.atualiza();
            mario.atualiza();
            canos.atualiza();
            chao.atualiza();
        },
    }

    Telas.PERDEU = {
        desenha(){
            fundo.desenha();
            mario.desenha();
            canos.desenha();
            placar.desenha();
            chao.desenha();
            telaFimJogo.desenha();
        },
        click(){
            canos.pares = [];
            placar.pontuacao = 0;
            marioMorre.pause();
            marioMorre.currentTime = 0;
            mudaTela(Telas.INICIO);
        },
        atualiza(){}
    }

    function loop() {
        frames++;
        telaAtiva.desenha();
        telaAtiva.atualiza();
        window.requestAnimationFrame(loop);
    }
    
    canvas.addEventListener('mousedown', function(){
        if(telaAtiva.click){
            telaAtiva.click();
        }
    });
    mudaTela(Telas.INICIO);
    loop();
}