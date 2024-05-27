import { Column } from "./Column.js";
import { Container } from 'pixi.js';
import { Queue } from '@datastructures-js/queue';
import Denque from "denque";
import { gsap } from 'gsap';





class Grid extends Container{
    constructor(width, height, resolution){
        super();
        this.W = width;
        this.H = height;
        this.resolution = resolution;
        this.columns = new Denque();
        this.squareSize = height / resolution;
        this.sensorInfo = null;
        this.depthHistory = [];
        this.depthSum = 0;
        this.currDepthView = 30;

        this.setupGrid();
    }

    setupGrid(){
        for(let pos = -2*this.squareSize; pos < 2*this.squareSize + this.W; pos += this.squareSize){
            const column = new Column(null, this.squareSize, this.H);
            column.x = pos;
            this.columns.push(column);
            this.addChild(column);
            
        }
    }

    updateSensorInfo(sensorInfo){
        this.sensorInfo = sensorInfo;
        if(this.depthHistory.length >= 100) this.depthSum -= this.depthHistory[0], this.depthHistory.shift();
        this.depthHistory.push(this.getDepth()), this.depthSum += this.getDepth();
    }

    updateSize(width, height){
        this.width = width;
        this.height = height;
    }
    moveLeft(deltaTime){
        for(let i = 0; i < this.columns.length; i++){
            this.columns.peekAt(i).moveLeft(deltaTime);
        }
        if(this.columns.peekAt(0).x < -2*this.squareSize){
            const col = this.columns.shift();
            col.x = this.columns.peekBack().x + this.squareSize;
            col.redrawColumn(this.sensorInfo);
            this.columns.push(col);
        }
    }
    getDepth(){
        if(!this.sensorInfo) return 0
        return this.sensorInfo.transducerData.reduce(
            (acc, curr) => curr.intensity > acc.intensity ? curr : acc)
            .depth
    }
    getMaxDepthView(){
        return Math.ceil(this.depthSum/this.depthHistory.length) + 2;
    }
    adjustDepthView(depthView){
        //if(depthView === this.columns.peekFront().currMVD) return;
        
        for(let i = 0; i < this.columns.length; i++){
            this.columns.peekAt(i).adjustDepth(depthView);
        }
        this.currDepthView = depthView;

    }
        
    
}

export { Grid };