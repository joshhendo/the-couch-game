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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRXRCLHFDQUFxQztBQUNyQywwQ0FBMEM7QUFDMUMsNkJBQTZCO0FBRTdCLGdFQUFnRTtBQUVoRSxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUVuQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFMUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7SUFBYSxPQUFPO1FBQzdCLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxhQUFhLEVBQUM7S0FDNUIsQ0FBQTtBQUNILENBQUMsQ0FBQyxDQUFDO0FBR0gsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLElBQUksRUFBRSxFQUFFLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNyRSxHQUFHLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyRCxHQUFHLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDOUUsR0FBRyxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxVQUFVLENBQUMsSUFBSSxFQUFFLEVBQUUsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFakcsa0JBQWUsR0FBRyxDQUFDIn0=