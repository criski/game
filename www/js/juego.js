var app = {
  inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    cambiafondo = false;
    color = '#f27d0c';
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload(){

      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = color;
      game.load.image('bola', 'assets/bola.png');
      game.load.image('objetivo', 'assets/objetivo.png');
      game.load.image('objetivo10', 'assets/objetivo10.png');
    }

    function create(){
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });
      scoreTextdif = game.add.text(90, 90, dificultad, { fontSize: '200px', fill: '#1cb5b5' });

      objetivo10 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo10');
      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
      
      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);
      game.physics.arcade.enable(objetivo10);

      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(function(){
      	cambiafondo = true;
      	app.decrementaPuntuacion();
      }, this);
    }

    function update(){
      if (cambiafondo){
      	game.stage.backgroundColor = '#f11f0b';
      	cambiafondo = false;
      } else {
      	game.stage.backgroundColor = color;
      }


      var factorDificultad = (300 + (dificultad * 100));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      game.stage.backgroundColor = color;


      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
      game.physics.arcade.overlap(bola, objetivo10, app.incrementaPuntuacion10, null, this);
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;

    color = app.controlColor(color,-1);
  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion+1;
    scoreText.text = puntuacion;

    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();

    if (puntuacion > 0){
      dificultad = dificultad+1;
      scoreTextdif.text = dificultad;
      color = app.controlColor(color,5);
    } else {
	  dificultad = 0;
	  color = '#f27d0c';	    	
    }
      scoreTextdif.text = dificultad;
  },

  incrementaPuntuacion10: function(){
    puntuacion = puntuacion+10;
    scoreText.text = puntuacion;
    
    objetivo10.body.x = app.inicioX();
    objetivo10.body.y = app.inicioY();

    if (puntuacion > 0){
      dificultad = dificultad+6;
      color = app.controlColor(color,10);

    } else {
      dificultad = 0;
      color = '#f27d0c';
    }
      scoreTextdif.text = dificultad;
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  },

  controlColor: function(color, amt){
    var almo = false;
  
	    if (color[0] == "#") {
	        color = color.slice(1);
	        almo = true;
	    }
 
    var num = parseInt(color,16);

    var r = (num >> 16) + amt;
 
	    if (r > 255){
	     	r = 255;
	    } else {if  (r < 0){
	    			 r = 0;
	    		}
	    }
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    	if (b > 255){
    		b = 255;
   		} else {if (b < 0){
   				    b = 0;
   				}
   		}
 
    var g = (num & 0x0000FF) + amt;
 
   		if (g > 255){
   		     g = 255;
    	} else {if (g < 0){
    			    g = 0;
    			}
    	}
 
    return (almo?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
	},
}

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}