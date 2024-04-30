import { Column } from "./Column.js";
import { Container } from 'pixi.js';

class Grid extends Container{
    constructor(width, height, resolution){
        super();
        this.W = width;
        this.H = height;
        this.resolution = resolution;
        this.columns = [];
        this.squareSize = height / resolution;
        this.sensorInfo = null;

        this.setupGrid();
    }

    setupGrid(){
        for(let pos = -2*this.squareSize; pos < 2*this.squareSize + this.W; pos += this.squareSize){
            const column = new Column(0, this.squareSize, this.H);
            column.x = pos;
            this.columns.push(column);
            this.addChild(column);
        }
    }

    updateSensorInfo(sensorInfo){
        this.sensorInfo = sensorInfo;
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
        const newColumn = new Column(this.sensorInfo, this.squareSize, this.H);
        newColumn.x = this.columns[this.columns.length - 1].x + this.squareSize;
        this.columns.push(newColumn);
        this.addChild(newColumn);
    }
    popFrontColumn(){
        this.removeChildAt(0);
        this.columns.shift();
    }
}

export { Grid };