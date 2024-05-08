import { Container, Sprite, Texture } from 'pixi.js'
import chroma from 'chroma-js';

class Column extends Container{
    constructor(signal, squareSize, height, MVD){
        super();
        this.H = height;
        this.squareSize = squareSize;
        this.signal = signal;

        //const sprite = Sprite.from(Texture.WHITE);
        

        if(!signal){
            this._defaultColumn();
        }
        else if(signal.type === "samples"){
            this._columnFromSample(signal.transducerData, MVD);
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
        square.tint = 0x0000ff;
        square.width = this.squareSize; 
        this.addChild(square);
    }

    _tintFromIntensity(intensity){
        const scale = chroma.scale(['blue', 'green', 'yellow', 'red']);

        return scale(intensity).hex();

    }
    _columnFromSample(data, maxViewDepth){
        
        

        if(data[0].depth < data[data.length - 1].depth)
            data.reverse();
        
        console.log(`MVD : ${maxViewDepth}`);
        const range = maxViewDepth || data[0].depth;

        console.log(`Range : ${range}`);

        let dataPointsUsed = 0;
        for(let i = data.length - 1; i >= 0; i--){
            if(data[i].depth > range) break;
            dataPointsUsed++;
        }

        console.log(dataPointsUsed)
        
        
        let maxHeight = this.H;
        const pixelsCoveredByEachDataPoint = maxHeight / dataPointsUsed;
        //console.log(pixelsCoveredByEachDataPoint);
        
        

        for(let i = data.length - dataPointsUsed, j = 0; i < data.length; i++, j++){
            const square = Sprite.from(Texture.WHITE);
            square.width = this.squareSize;
            square.height = pixelsCoveredByEachDataPoint;
            square.tint = this._tintFromIntensity(data[i].intensity);

            square.y = maxHeight - square.height * (j+1);

            this.addChild(square);
        }  
    }
    redrawColumn(maxViewDepth){
        if(!this.signal || maxViewDepth === this.currMVD) return;
        this.currMVD = maxViewDepth;
        this.removeChildren();
        this._columnFromSample(this.signal.transducerData, maxViewDepth);
    }
    _columnFromThreshold(data){
        // ...
    }
}

export { Column }