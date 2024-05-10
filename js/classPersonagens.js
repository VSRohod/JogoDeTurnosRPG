function listarEstatisticas(){
    let main = document.querySelector("main");
    main.innerHTML = "";

    personagens.forEach((element) =>{
        main.innerHTML += `
        <div class="personagensInfo">
            <img src=${element.imgSrc} id=${element.nome} alt="">
            <div class="personagens">
                <p>🙂 Nome : ${element.nome}</p>
                <p>❤️ Vida : ${element.vida} / ${element.vidaMax}</p>
                <p>⚔️ Dano : ${element.dano}</p>
                <p>🎒 Items : ${element.items}</p>
                <p>🌟 Nivel : ${element.nivel}</p>
                <p>💫 XP : ${element.xp}</p>
                <button id="atacar" onclick="atacar(${element.id})">💣ATACAR</button>
                <button id="curar" onclick="curar(${element.id})">🩹CURAR</button>
            </div>
        </div>`
    });
}

// sprites
function atualizarSprites(alvo,sprite,tempo){
    if(tempo == 0){
        personagens[alvo].imgSrc = `images/${sprite}`;
        listarEstatisticas(); 
    }else{
        setTimeout(function(){
            personagens[alvo].imgSrc = `images/${sprite}`;
            listarEstatisticas(); 
        },300);
    }
}


class Personagem {
    constructor(id,nome,imgSrc,vidaMax,dano,itemPrincipal){
        this.id = id;
        this.nome = nome;
        this.imgSrc = imgSrc;
        this.vida = vidaMax;
        this.vidaMax = vidaMax;
        this.dano = dano;
        this.nivel = 0;
        this.xp = 0;
        this.items = [itemPrincipal];

        this.morrer = function(alvo){
            setTimeout(function(){
                personagens[alvo].ressucitar(alvo);
            },600);
        }
        
        this.ressucitar = function(alvo){
            let pocao = personagens[alvo].items.indexOf("Poção da fênix");
            if(pocao >= 1){
                let usarPocao = confirm("Deseja usar Poção da fênix?");

                if(usarPocao == true){
                    atualizarSprites(alvo,"playerrenascer.svg",0);
                    setTimeout(function(){
                        personagens[alvo].vida = personagens[alvo].vidaMax
                        personagens[alvo].items.splice(pocao,1);
                        alert("De volta para a ação ⚔");
                        atualizarSprites(alvo,"playernormal.svg",0);
                    },600);
                    
                }else{
                    alert("Game Over :(")
                }
            }
            else{
                if(personagens[alvo].id == 0){
                    let jogarNovamente = confirm("Você morreu! Tentar novamente?");
                    if(jogarNovamente == true){
                        location.reload();
                    }else{
                        alert("Game Over :(")
                    }
                }else{
                    atualizarSprites(alvo,"inimigorenascer.svg",0);
                    setTimeout(function(){
                        personagens[alvo].vida = personagens[alvo].vidaMax
                        alert("Mais um adversário!");
                        atualizarSprites(alvo,"inimigonormal.svg",0);
                    },600);
                }
            }
            listarEstatisticas();
        }

        this.atacar = function(atacante){
            if(atacante == 0){
                this.sofrerDano(this.dano, 0);
                if(personagens[1].vida <= 0){
                    this.morrer(1)
                    this.ganharXp(5);
                }
                listarEstatisticas();  
            }else{
                this.sofrerDano(this.dano, 1);
                if(personagens[0].vida <= 0){
                    this.morrer(0)
                    this.ganharXp(5);
                }
                listarEstatisticas();
            }

        }

        this.curar = function(alvo){
            if(alvo == 0){
                if(personagens[alvo].vida <= 0){
                    personagens[alvo].ressucitar(alvo);
                }else{
                    let pocao = personagens[alvo].items.indexOf("Poção de cura");
    
                    if(pocao >= 1){
                        let usarPocao = confirm("Deseja usar Poção de cura?");
    
                        if(usarPocao == true){
                            personagens[alvo].vida += 3;
                            personagens[alvo].items.splice(pocao,1);
                            alert("Poção da cura usada!");
                            atualizarSprites(alvo,"playercura.svg",0);
                            atualizarSprites(alvo,"playernormal.svg",3000);
                        }
                    }else{
                        alert("Você está sem poções!");
                    }
                    listarEstatisticas();
                }
            }else{
                let pocao = personagens[alvo].items.indexOf("Poção de cura");
    
                if(pocao >= 1){
                        personagens[alvo].vida += 3;
                        personagens[alvo].items.splice(pocao,1);
                        atualizarSprites(alvo,"inimigocura.svg",0);
                        atualizarSprites(alvo,"inimigonormal.svg",3000);
                }
                listarEstatisticas();
            }              
        }

        this.ganharXp = function(xp){
            this.xp += xp;
            this.evoluir();
            listarEstatisticas();
        }

        this.evoluir = function(){
            if(this.xp == 10){
                this.nivel += 1;
                this.dano = 3
                this.items.push("Poção da fênix");
                this.items.push("Poção de cura");
            }else if(this.xp == 20){
                this.nivel += 1;
                this.dano = 5
                this.items.push("Arco");
            }else if(this.xp == 50){
                this.nivel += 1;
                this.dano = 15
            }
            listarEstatisticas();
        }
        
        this.sofrerDano = function(danoSofrido,alvo){
            if(alvo == 0){
                alvo = 1;
                personagens[alvo].vida -= danoSofrido;

                atualizarSprites(alvo,"inimigodano.svg",0);
                atualizarSprites(alvo,"inimigonormal.svg",300);

                if(personagens[alvo].vida <= 0){
                    personagens[alvo].vida = 0;
                    atualizarSprites(alvo,"inimigomorte.svg",301);
                }
                listarEstatisticas(); 
            }else{
                alvo = 0
                personagens[alvo].vida -= danoSofrido;

                atualizarSprites(alvo,"playerdano.svg",0);
                atualizarSprites(alvo,"playernormal.svg",300);

                if(personagens[alvo].vida <= 0){
                    personagens[alvo].vida = 0;
                    atualizarSprites(alvo,"playermorte.svg",301);
                }
                listarEstatisticas(); 
            }
        }
    }
}

var personagens = [];

personagens.push(new Personagem(0,"Darkami, O destemido","images/playernormal.svg",10,1,"Espada"));
personagens.push(new Personagem(1,"Jack, O lendário","images/inimigonormal.svg",10,1,"Bastão"));

// listar personagens
listarEstatisticas();