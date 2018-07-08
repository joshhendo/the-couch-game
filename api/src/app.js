"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('source-map');
const er = require("express-return");
const bodyParser = require("body-parser");
const cors = require("cors");
const roomController = require("./controllers/room-controller");
const app = er.createApplication();
app.use(cors());
app.set('etag', 'strong');
app.get('/', function () {
    return {
        body: { test: 'hello world' }
    };
});
app.post('/rooms', bodyParser.json(), roomController.postCreateRoom);
app.get('/rooms/:room_code', roomController.getRoom);
app.put('/rooms/:room_code', bodyParser.json(), roomController.putUpdateRoom);
app.post('/rooms/:room_code/participants', bodyParser.json(), roomController.postAddParticipant);
exports.default = app;
//# sourceMappingURL=app.js.map