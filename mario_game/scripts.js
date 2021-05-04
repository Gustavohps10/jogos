window.onload = function() {
    var canvas, ctx, altura, largura, frames = 0;

    //IMAGES
    const marioSprites = new Image();
    marioSprites.src = 'images/mario-cap.png';

    const chaoSprites = new Image();
    chaoSprites.src = 'images/chao.png';

    const imgInicio = new Image();
    imgInicio.src = 'images/logo.png';

    const blocoSprites = new Image();
    blocoSprites.src = 'images/bloco.png';

    const canoSprites = new Image();
    canoSprites.src = 'images/cano.png';

    //AUDIOS
    const marioVoa = new Audio()
    marioVoa.src = 'audios/smw_cape_rise.wav';

    const marioMorre = new Audio()
    marioMorre.src = 'audios/smw_lost_a_life.wav';

    const musicaFundo = new Audio()
    musicaFundo.src = 'audios/overworld_bgm.mp3';

    


    ////////

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
    const fundo = {
        desenha(){
            ctx.fillStyle = '#50beff'
            ctx.fillRect(0, 0, canvasLargura, canvasAltura);
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
        y: 150,
        gravidade: 0.35,
        velocidade: 0,
        forcaPulo: 8,
        pula(){
            mario.velocidade = - mario.forcaPulo;
            marioVoa.play();
            
        },
        atualiza(){
            if(fazColisao(mario, chao)){
                mudaTela(Telas.INICIO);
                musicaFundo.pause();
                marioMorre.play();
                return;
            }  
            mario.velocidade +=  this.gravidade;
            mario.y += mario.velocidade; 
        },
        movimentos:[
            {spriteX: 0, spriteY: 0},
            {spriteX: 29, spriteY: 0},
            {spriteX: 60, spriteY: 0}
        ],
        frameAtual: 0,
        atualizaFrameAtual(){

        },
        desenha(){
            this.atualizaFrameAtual();
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
                const espacamentoCanos = 150;
                const tamanhoCano = 12;
                const alturaCanoCeu = (tamanhoCano+1)*canos.altura;
                const canoCeuX = par.x;
                //[Cano do Céu]
                for (let i = 0; i < tamanhoCano; i++) {
                    ctx.drawImage(canoSprites, 70, 36, canos.largura, canos.altura, canoCeuX, canos.altura*i+yRandom, canos.largura, canos.altura)
                }
                ctx.drawImage(canoSprites, 70, 70, canos.largura, canos.altura, canoCeuX, canos.altura*tamanhoCano+yRandom, canos.largura, canos.altura);

                //blocos de pedra
                ctx.drawImage(blocoSprites, 0, 34, 16, 16, canoCeuX + 16, 0, 16, 16);
                ctx.drawImage(blocoSprites, 0, 34, 16, 16, canoCeuX, 0, 16, 16);
                

                //[Cano do Chão]
                const canoChaoX = canoCeuX;
                const canoChaoY = 32;

                for (let i = 0; i <= tamanhoCano; i++){
                    ctx.drawImage(canoSprites, 70, 36, 32, 32, canoChaoX, canos.altura*i+alturaCanoCeu+espacamentoCanos+yRandom, 32, 32);
                }
                ctx.drawImage(canoSprites, 70, 2, 32, 32, canoChaoX, alturaCanoCeu+espacamentoCanos+yRandom, 32, 32);

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

                if(canos.temColisao(par)){
                    mudaTela(Telas.INICIO);
                }

                if(par.x + canos.largura <0){
                     canos.pares.shift();
                }
            });
            
        }
    }

    const logo = {
        spriteX: 0,
        spriteY: 0,
        largura: 600,
        altura: 400,
        x: 40,
        y: 90,
        desenha(){
            ctx.drawImage(imgInicio, this.spriteX, this.spriteY, this.largura, this.altura, this.x, this.y, 400, 200);
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
                canos.desenha();
                chao.desenha();    
            },
            click(){
                musicaFundo.play();
                mudaTela(Telas.JOGO);  
            },
            atualiza(){},
        }
    }

    Telas.JOGO = {
        desenha(){
            fundo.desenha();
            mario.desenha();
            canos.desenha();
            chao.desenha();
        },
        click(){
            mario.pula()
        },
        atualiza(){
            mario.atualiza();
            canos.atualiza();
            chao.atualiza();
        },
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