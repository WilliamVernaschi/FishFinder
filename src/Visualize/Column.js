import { Container, Sprite, Texture } from 'pixi.js'
import chroma from 'chroma-js';

class Column extends Container{
    constructor(signal, squareSize, height){
        super();
        this.H = height;
        console.log(this.H);
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
        const scale = chroma.scale(['blue', 'red', 'yellow']);

        return scale(intensity).hex();

    }
    _columnFromSample(data){
        data.reverse();

        const range = data[0].depth;
        const maxHeight = this.H * 0.3
        const pixelsCoveredByEachDataPoint = maxHeight / range;
        let distanceCovered = 0;

        for(let yPos = 0, i = 0; yPos < maxHeight; yPos += this.squareSize){
            const square = Sprite.from(Texture.WHITE);
            square.width = this.squareSize;
            square.height = this.squareSize;
            square.tint = this._tintFromIntensity(data[i].intensity);

            square.y = this.H - this.squareSize - yPos;
            distanceCovered += this.squareSize;

            console.log(square.y);

            if(distanceCovered >= pixelsCoveredByEachDataPoint){
                distanceCovered = 0;
                i++; // go to next data point
            }
            this.addChild(square);
        }  
    }
    _columnFromThreshold(data){
        // ...
    }
}

export { Column }