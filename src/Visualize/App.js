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

        
        this.app.ticker.maxFPS = this.app.ticker.minFPS = this.config.framesPerSecond;

        this.start();
    }
    start(){
        
        this.app.ticker.add(() => {
            this.grid.moveLeft();
            this.grid.updateSensorInfo(this.getSensorInfo())
        });

    }
}

export const app = new Application();
