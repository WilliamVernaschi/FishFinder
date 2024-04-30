import { SignalGenerator } from './SignalGenerator.js';
import express from 'express';
import random from 'random'

const app = express();

let clients = []

function genUniqId(){
    return Date.now() + '-' + Math.floor(Math.random() * 1000000000);
}

// envia um sinal para todos os clientes conectados
function sendToAllUsers(data) {
    for(let i=0; i<clients.length; i++){
       clients[i].res.write(`data: ${data}\n\n`);
    }
}

let sending = false;

const generator = new SignalGenerator(0.01, 0.05, 200, 30);

app.get('/sensor', (req, res) => {
    const SSE = {
        'Content-Type': 'text/event-stream',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };

    res.writeHead(200, SSE);
    res.write('event: connected\n');

    const clientId = genUniqId();
    const newClient = {
        id : clientId,
        res
    }
    clients.push(newClient);


    

    // envia um sinal a cada 20 + um valor aleatório entre 0 e 5 milissegundos
    // para simular um sinal real
    function sendSignals(){
        if(!sending) return;
        sendToAllUsers(JSON.stringify({type: "samples", transducerData: generator.nextSignal()}));
        setTimeout(sendSignals, 20 + random.float(0, 5));
    }

    if(!sending){
        sending = true;
        sendSignals();
    }

    req.on('close', () => {
        clients = clients.filter(client => client.id !== clientId);
        if(clients.length === 0){
            sending = false;
        }
    });
});


app.listen(3000, () => {
    console.log('App listening: http://localhost:3000');
});
