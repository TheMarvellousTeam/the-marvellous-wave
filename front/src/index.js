import 'file-loader?name=index.html!./index.html'
import * as config              from './config'
import pixi 			        from 'pixi.js'

import {create as createController}     from './service/controller'
import {create as createCom}            from './service/com'

import {create as createIoHandler}      from './handler/io'
import {create as createInputHandler}   from './handler/input'
import {create as createMenuUI}         from './handler/ui/menu'

// bootsrap
const state   = { surfers:[{ id:1, position: {x:50, y:0},velocity : {x:0, y:4} }], waves:[], myId:null}
const service = {}
{

    Promise.all([
        createController().then( x => service.controller = x ),
        createCom( config.com ).then( x => service.com = x ),
    ])
        .then( () =>
            Promise.all([

                createIoHandler( state, service ),
                createInputHandler( state, service ),
                createMenuUI( state, service ),
               
            ])
        )

}

//Permet de definir l'id du joueur associe au client
let playerId = 1;

let sprites = {};
let waterBackground = {
	id:'background',
	position: { x:-200, y:50000},
	velocity: { x:0, y:0}
}

//Permet de definir l'etat du jeu (action a effectuer dans la game loop)
let gameState = play;


let 	Container 		= PIXI.Container,
	autoDetectRenderer 	= PIXI.autoDetectRenderer,
	loader 			= PIXI.loader,
	resources 		= PIXI.loader.resources,
	TextureCache 		= PIXI.utils.TextureCache,
	Texture 		= PIXI.Textture,
	Sprite 			= PIXI.Sprite;

let 	stage = new Container(),
	renderer = autoDetectRenderer(512,512);

document.body.appendChild(renderer.view);

loader
	.add('surfer1',require('./assets/surfer1.png'))
	.add('surfer2',require('./assets/surfer2.png'))
	.add('water',require('./assets/water.jpg'))
	.add('wave',require('./assets/wave.png'))
	.load(setup);

function getSurfer(surferId) {

	return state.surfers.filter((surfer) => surfer.id == surferId)[0];

}


function setup(){

	let surferTexture = loader.resources.surfer1.texture;
	let playerTexture = loader.resources.surfer2.texture;
	let waterTexture = loader.resources.water.texture;
	let waveTexture = loader.resources.wave.texture;

	sprites['background'] = new PIXI.extras.TilingSprite(waterTexture, waterTexture.baseTexture.width, waterTexture.baseTexture.height*100);
	sprites['background'].position.x = 0;
	sprites['background'].position.y = 0;
	sprites['background'].tilePosition.x = 0;
	sprites['background'].tilePosition.y = 0;
	stage.addChild(sprites['background']);

	state.waves.forEach((wave) => {

		let waveSprite = new Sprite(waveTexture);

		stage.addChild(waveSprite);
		sprites[wave.id] = waveSprite;

	});

	state.surfers.forEach((item) => {

		let surferSprite = item.id == playerId
			?new Sprite(playerTexture)
			:new Sprite(surferTexture);

		stage.addChild(surferSprite);
		sprites[item.id] = surferSprite;

	});


	let playerSprite = sprites[playerId];
	playerSprite.x = renderer.width / 2 - (playerSprite.width /2);
	playerSprite.y = renderer.height * 0.66 - (playerSprite.height : 2);

	gameLoop();
}

function gameLoop() {

	requestAnimationFrame(gameLoop);

	gameState();

	renderer.render(stage);

}

function play() {



	[...state.surfers, ...state.waves, waterBackground].forEach((entity) => {

		let coords = computeCoords(entity);
		sprites[entity.id].x = coords.x;
		sprites[entity.id].y = coords.y;

		entity.position.x += entity.velocity.x;
		entity.position.y += entity.velocity.y;
	});

}


//Cette fonction permet de definir le delta a appliquer au (position.x,position.y) d'une entite
//(sa position dans le monde) pour obtenir son (sprite.x,sprite.y) (sa position a l'ecran)
function computeCoords(entity) {

	let playerSprite = sprites[playerId];
	let player = getSurfer(playerId);

	let x = playerSprite.x + (entity.position.x - player.position.x);
	let y = playerSprite.y - (entity.position.y - player.position.y);

	return {x:x, y:y};
}
