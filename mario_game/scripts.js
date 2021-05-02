window.onload = function() {
    var canvas, ctx, altura, largura, frames = 0;

    //IMAGES
    const marioSprites = new Image();
    marioSprites.src = 'images/mario-cap.png';

    const chaoSprites = new Image();
    chaoSprites.src = 'images/chao.png';

    const imgInicio = new Image();
    imgInicio.src = 'images/logo.png';

    //AUDIOS
    const marioVoa = new Audio()
    marioVoa.src = 'audios/smw_cape_rise.wav';

    const marioMorre = new Audio()
    marioMorre.src = 'audios/smw_lost_a_life.wav';

    altura = window.innerHeigth;
    largura = window.innerWidth;

    if(largura >=500){
        largura = 900;
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
        spriteY: 0,
        largura: 15,
        altura: 15,
        x: 0,
        y: canvas.height-15,
        desenha(){
            for(let i=0; i < largura/chao.largura+1; i++){
                ctx.drawImage(chaoSprites, chao.spriteX, chao.spriteY, chao.largura, chao.altura, chao.x + chao.largura*i, chao.y, chao.largura, chao.altura);
            }
        },
        atualiza(){
            const movimentoChao = 2;
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
        forcaPulo: 11,
        pula(){
            mario.velocidade = - mario.forcaPulo;
            marioVoa.play();
        },
        atualiza(){
            if(fazColisao(mario, chao)){
                mudaTela(Telas.INICIO)
                marioMorre.play();
                return;
            }  
            mario.velocidade +=  this.gravidade;
            mario.y += mario.velocidade; 
        },
        desenha(){
            ctx.drawImage(marioSprites, mario.spriteX, mario.spriteY, mario.largura, mario.altura, mario.x, mario.y, mario.largura, mario.altura);
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
                chao.desenha();

            },
            click(){
                mudaTela(Telas.JOGO);
            },
            atualiza(){},
        }
    }

    Telas.JOGO = {
        desenha(){
            fundo.desenha();
            mario.desenha();
            chao.desenha();
        },
        click(){
            mario.pula()
        },
        atualiza(){
            mario.atualiza();
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