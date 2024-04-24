import random from 'random';

const DATAPOINTS_PER_SIGNAL = 20;
const UNDERGROUND_STRUCTURE_PROB = 0.001;
const FISH_PROB = 0.1;

export class SignalGenerator{
    constructor(){
        this.lastOceanFloor = random.float(2, 7);
        this.amplitude = random.float(0, 1);
    }

    nextSignal(){
        let signals = [];

        if(random.float(0, 1) < 0.5) this.lastOceanFloor = random.float(2, 7);

        
        if(this.lastOceanFloor/7 < random.float(0, 1)){
            this.lastOceanFloor += random.float(0, 0.1);
        }
        else {
            this.lastOceanFloor -= random.float(0, 0.1);
        }

        if(this.amplitude < random.float(0, 1)){
            this.amplitude += random.float(0, 0.01);
        }
        else{
            this.amplitude -= random.float(0, 0.01);
        }

        for(let i = 0; i < DATAPOINTS_PER_SIGNAL; i++){
            if(this.lastOceanFloor > i*7/20){
                signals.push({depth: i*7/20, intensity: 0});
            }
            else{
                signals.push({depth: i*7/20, intensity: Math.max(0, this.amplitude - random.float(0, 0.1))});
            }
        }
        return signals;
    }
}