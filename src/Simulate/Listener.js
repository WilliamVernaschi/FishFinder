let lastSensorEvent = null;

const eventSource = new EventSource('http://localhost:3000/sensor');

eventSource.onmessage = (event) => {
    lastSensorEvent = JSON.parse(event.data);
};

export function getSensorInfo(){
    return lastSensorEvent;
}