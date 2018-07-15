require('source-map');

import * as er from 'express-return';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import * as roomController from './controllers/room-controller';

const app = er.createApplication();

app.use(cors());
app.set('etag', 'strong');

app.get('/', function() { return {
    body: {test: 'hello world again'}
  }
});


app.post('/rooms', bodyParser.json(), roomController.postCreateRoom);
app.get('/rooms/:room_code', roomController.getRoom);
app.put('/rooms/:room_code', bodyParser.json(), roomController.putUpdateRoom);
app.post('/rooms/:room_code/participants', bodyParser.json(), roomController.postAddParticipant);
app.post('/rooms/:room_code/actions/select_player', bodyParser.json(), roomController.actionSelectParticipant);

export default app;