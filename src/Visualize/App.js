import * as PIXI from 'pixi.js';
import { Grid } from './Grid.js'
import { getSensorInfo } from './../Simulate/Listener.js'


class Application {
    async run(config){

        this.config = config;

        // Cria a aplicação PIXI
        this.app = new PIXI.Application();
        await this.app.init({resizeTo: window, background: 0x0000ff});
        
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

        depthText.text = `${this.grid.getDepth()}m`;

        

        

        

        this.maxDepthView = 30;

        this._placeScale(this.maxDepthView);

        setInterval(() => {
            depthText.text = `${this.grid.getDepth()}m`;
            
            //console.log(this.maxDepthView)
        }, 1000)

        setInterval(() => {
            this.maxDepthView = this.grid.getMaxDepthView();
            this.grid.adjustDepthView(this.maxDepthView);
            this.adjustScale(this.maxDepthView)
        }, 3000)

        


        
        this.app.ticker.maxFPS = this.app.ticker.minFPS = this.config.framesPerSecond;

        this.start();
    }
    adjustScale(maxDepthView){
        this.scale.removeChildren();
        this._placeScale(maxDepthView);
    }
    _placeScale(maxDepthView){
        this.scale = new PIXI.Container();

        
        for(let i = 1; i < maxDepthView; i+=3){
            const text = new PIXI.Text({text: `${i}`, style: this.config.scaleStyle});
            text.x = this.app.canvas.width - this.config.scaleStyle.fontSize;
            text.y = i*this.app.canvas.height/maxDepthView;
            text.anchor.set(0.5);
            this.scale.addChild(text);
            //console.log(text.y)
        }
        this.app.stage.addChild(this.scale);
    }
    start(){
        
        this.app.ticker.add(() => {
            this.grid.moveLeft();
            this.grid.updateSensorInfo(this.getSensorInfo())
        });

    }
}

export const app = new Application();
