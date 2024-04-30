import { Container, Sprite, Texture } from 'pixi.js'
import chroma from 'chroma-js';

class Column extends Container{
    constructor(signal, squareSize, height){
        super();
        this.H = height;
        this.squareSize = squareSize;

        const sprite = Sprite.from(Texture.WHITE);
        

        if(!signal){
            this._defaultColumn();
        }
        else if(signal.type === "samples"){
            this._columnFromSample(signal.transducerData);
        }
        else if(signal.type === "threshold"){
            this._columnFromThreshold(signal.transducerData)
        }
    }
    moveLeft(){
        this.x -= 1;
    }

    _defaultColumn(){
        const square = Sprite.from(Texture.WHITE);
        square.width = this.squareSize;
        this.addChild(square);
    }

    _tintFromIntensity(intensity){
        const scale = chroma.scale(['blue', 'green', 'yellow', 'red']);

        return scale(intensity).hex();

    }
    _columnFromSample(data){
        data.reverse();

        const range = data[0].depth;
        let maxHeight = this.H;
        const pixelsCoveredByEachDataPoint = maxHeight / data.length;
        //console.log(pixelsCoveredByEachDataPoint);
        

        for(let i = 0; i < data.length; i++){
            const square = Sprite.from(Texture.WHITE);
            square.width = this.squareSize;
            square.height = pixelsCoveredByEachDataPoint;
            square.tint = this._tintFromIntensity(data[i].intensity);

            square.y = maxHeight - square.height * (i+1);

            this.addChild(square);
        }  
    }
    _columnFromThreshold(data){
        // ...
    }
}

export { Column }