import { Graphics, Sprite, Texture } from 'pixi.js'
import chroma from 'chroma-js';

const scale = chroma.scale(['blue', 'green', 'yellow', 'red']);

class Column extends Graphics{
    constructor(signal, squareSize, height, MVD){
        super();
        this.H = height;
        this.squareSize = squareSize;
        this.signal = signal;        

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
    moveLeft(deltaTime){
        this.x -= 1 * deltaTime;
    }

    _defaultColumn(){
        this.rect(0, 0, this.squareSize, this.H)
            .fill(scale(0).hex());
    }

    _tintFromIntensity(intensity){

        return scale(intensity).hex();

    }
    _columnFromSample(data, maxViewDepth){
        
        

        if(data[0].depth < data[data.length - 1].depth)
            data.reverse();
        
        const range = maxViewDepth || data[0].depth;


        let dataPointsUsed = 0;
        for(let i = data.length - 1; i >= 0; i--){
            if(data[i].depth > range) break;
            dataPointsUsed++;
        }

        let maxHeight = this.H;
        const pixelsCoveredByEachDataPoint = maxHeight / dataPointsUsed;

        function getToDraw(){
            const toDraw = [];
            let length = pixelsCoveredByEachDataPoint;

            for(let i = data.length - dataPointsUsed, j = 0; i < data.length; i++, j++){
                if(i === data.length-1 || data[i+1].intensity != data[i].intensity){
                    toDraw.push({endHeight : maxHeight - pixelsCoveredByEachDataPoint * (j+1), length, intensity : data[i].intensity});
                    length = pixelsCoveredByEachDataPoint;
                }
                else{
                    length += pixelsCoveredByEachDataPoint;
                }
            }
            return toDraw;
        }
        const toDraw = getToDraw();
        
        toDraw.forEach(point => {
            this.rect(0, point.endHeight, this.squareSize, point.length)
                .fill(this._tintFromIntensity(point.intensity));
        });
        

    }
    redrawColumn(maxViewDepth, signal){

        if(signal) this.signal = signal;
        if(!this.signal) return;

        this.currMVD = maxViewDepth;
        this.clear();

        this._columnFromSample(this.signal.transducerData, maxViewDepth);
    }
    _columnFromThreshold(data){
        // ...
    }
}

export { Column }