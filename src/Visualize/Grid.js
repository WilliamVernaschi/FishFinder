import { Column } from "./Column.js";
import { Container } from 'pixi.js';
import Denque from "denque"

class Grid extends Container{
    constructor(width, height, resolution){
        super();
        this.W = width;
        this.H = height;
        this.resolution = resolution;
        this.columns = []
        this.squareSize = height / resolution;
        this.sensorInfo = null;
        this.depthHistory = [];
        this.depthSum = 0;

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
    moveLeft(){
        this.columns.forEach(column => {
            column.moveLeft();
        });
        if(this.columns[0].x < -2*this.squareSize){
            this.pushColumn();
            this.popFrontColumn();
        }
    }
    pushColumn(){
        const newColumn = new Column(this.sensorInfo, this.squareSize, this.H, this.getMaxDepthView());
        newColumn.x = this.columns[this.columns.length - 1].x + this.squareSize;
        this.columns.push(newColumn);
        this.addChild(newColumn);
    }
    popFrontColumn(){
        this.removeChildAt(0);
        this.columns.shift();
    }
    getDepth(){
        if(!this.sensorInfo) return 0
        return this.sensorInfo.transducerData.reduce(
            (acc, curr) => curr.intensity > acc.intensity ? curr : acc)
            .depth
    }
    getMaxDepthView(){
        return Math.ceil(this.depthSum/this.depthHistory.length + 2);
    }
    adjustDepthView(depthView){
        this.columns.forEach(column => {
            column.redrawColumn(depthView);
        });
    }
        
    
}

export { Grid };