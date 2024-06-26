import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";
import { Grid } from './Grid.js'
import { getSensorInfo } from './../Simulate/Listener.js'

function gsapTest(pixiObj){
    setInterval(() => {gsap.to(pixiObj, {pixi : {scaleY: 1.5}, duration: 0.75} )}, 2000);
    setTimeout(() => {setInterval(() => {gsap.to(pixiObj, {pixi: { scaleY: 1}, duration: 0.75} )}, 2000)}, 1000 );            
}

class Application {
    async run(config){

        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.config = config;

        // Cria a aplicação PIXI
        this.app = new PIXI.Application();
        await this.app.init({resizeTo: window, background: 0x000000});
        
        // Adiciona o canvas ao HTML
        document.body.appendChild(this.app.canvas);

        // Cria a grid de quadrados
        this.grid = new Grid(this.app.canvas.width,
                            this.app.canvas.height, 
                            this.config.resolution);
        this.app.stage.addChild(this.grid);

        // Cria o listener
        this.getSensorInfo = getSensorInfo;
        this.grid.updateSensorInfo(this.getSensorInfo())
        
        // Quando a janela for redimensionada, atualiza o tamanho dos quadrados para manter a resolução
        this.app.renderer.on('resize', (width, height) => {
            this.grid.updateSize(width, height);
        });

        // Adiciona o texto da profundidade
        const depthText = new PIXI.Text({text: 'Depth', style: this.config.depthStyle});
        depthText.x = 10;
        depthText.y = 10;

        // Adiciona o texto da temperatura
        const tempText = new PIXI.Text({text: '25ºC', style: this.config.temperatureStyle});
        tempText.x = 10;
        tempText.y = this.config.depthStyle.fontSize + 10;

        this.app.stage.addChild(depthText)
        this.app.stage.addChild(tempText)

        depthText.text = `${this.grid.getDepth().toFixed(2)}m`;


        this.maxDepthView = 30;
        
        this.scale = new PIXI.Container();
        this._placeScale(this.maxDepthView);

        setInterval(() => {
            depthText.text = `${this.grid.getDepth().toFixed(2)}m`;
            
            //console.log(this.maxDepthView)
        }, 1000)

        setInterval(() => {
            this.maxDepthView = this.grid.getMaxDepthView();
            this.grid.adjustDepthView(this.maxDepthView);
            this.adjustScale(this.maxDepthView)
        }, 3000)

        


        
        this.app.ticker.maxFPS = this.config.framesPerSecond;
        this.app.ticker.minFPS = this.config.framesPerSecond;

        this.start();
    }
    adjustScale(maxDepthView){
        this.scale.removeChildren();
        this._placeScale(maxDepthView);
    }
    _placeScale(maxDepthView){
        
        for(let i = 1; i < maxDepthView; i+=3){
            const text = new PIXI.Text({text: `${i}`, style: this.config.scaleStyle});
            text.x = this.app.canvas.width - this.config.scaleStyle.fontSize;
            text.y = i*this.app.canvas.height/maxDepthView;
            text.anchor.set(0.5);
            this.scale.addChild(text);
        }
        this.app.stage.addChild(this.scale);
    }
    
    start(){
        
        this.app.ticker.add((time) => {
            this.grid.moveLeft(time.deltaTime);
            this.grid.updateSensorInfo(this.getSensorInfo())


        });
        /*
        for(let i = 0; i < this.grid.columns.length; i++){
            gsapTest(this.grid.columns.peekAt(i));
        }
        */


    }
}

export const app = new Application();
