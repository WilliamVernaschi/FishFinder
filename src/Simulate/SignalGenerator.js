import random from 'random';
import { MovingAverage } from '../MovingAverage.js';


function distancePointToCircle(x, y, cx, cy, r){
    return Math.abs(Math.sqrt((x - cx)**2 + 3*(y - cy)**2) - r);
}

export class SignalGenerator{
    constructor(fishProbability, undergroundStructureProbability, datapointsPerSignal, maxDepth){

        this.fishProbability = fishProbability;
        this.undergroundStructureProbability = undergroundStructureProbability;
        this.datapointsPerSignal = datapointsPerSignal;
        this.maxDepth = maxDepth;

        this.y = random.float(2, maxDepth);
        this.x = 0;

        this.movingAverage = new MovingAverage(300);

        this.fishes = [];

        
    }

    nextSignal(){

        

        if(random.float() < this.fishProbability){
            this.fishes.push({
                x: this.x + random.int(0, 5),
                deltaY: random.float(0, 6), // altura acima do leito
                size : random.float(0.5, 1.0)
            });
        }

        if(this.y/this.maxDepth < random.float()){
            this.y += random.float(0.25, 2);
            this.y = Math.min(this.y, this.maxDepth);
        }
        else{
            this.y -= random.float(0.25, 2);
            this.y = Math.max(this.y, 0);
        }
        this.movingAverage.add(this.y);
        
        
        
        let signal = [];
        for(let i = 0; i < this.datapointsPerSignal; i++){
            const depth = i*this.maxDepth/this.datapointsPerSignal;

            let fishSignal = 0;

            this.fishes.forEach(fish => {
                if(!fish.y) fish.y = Math.max(2, this.y - fish.deltaY);
            })
            this.fishes.forEach(fish => {
                let dpc =  distancePointToCircle(this.x, depth, fish.x, fish.y, fish.size/2);
                if(dpc < fish.size/2) fishSignal = Math.max(fishSignal, dpc/(fish.size/2))
            })

            signal.push({
                depth,
                intensity: depth >= this.movingAverage.getAverage() ? this.movingAverage.getAverage() / depth : fishSignal
            })
        }
        this.x += 0.01;
        return signal;
    }
}


