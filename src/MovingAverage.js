import Denque from "denque"

export class MovingAverage{
    constructor(interval){
        this.interval = interval;
        this.values = new Denque();
        this.sum = 0;
    }

    add(value){
        this.values.push(value);
        this.sum += value;
        if(this.values.length > this.interval){
            this.sum -= this.values.shift();
        }
    }

    getAverage(){
        return this.sum / this.values.length;
    }
}