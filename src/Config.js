import * as PIXI from 'pixi.js'

export const config = {
    "resolution": 300, // número de quadrados em uma coluna do visor
    "receiverDelay": 20, // período de recepção do sinal emitido pelo transmissor, em milissegundos
    "framesPerSecond" : 10 
}

config.depthStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 72,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: '#ffffff',
    stroke: { color: '#4a1850', width: 5, join: 'round' },
});

config.temperatureStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: '#ffffff',
    stroke: { color: '#4a1850', width: 4, join: 'round' },
});


config.scaleStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: '#ffffff',
    stroke: { color: '#4a1850', width: 4, join: 'round' },
    alpha: 0.8
});