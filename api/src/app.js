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
        body: { test: 'hello world again' }
    };
});
app.post('/rooms', bodyParser.json(), roomController.postCreateRoom);
app.get('/rooms/:room_code', roomController.getRoom);
app.put('/rooms/:room_code', bodyParser.json(), roomController.putUpdateRoom);
app.post('/rooms/:room_code/participants', bodyParser.json(), roomController.postAddParticipant);
app.post('/rooms/:room_code/actions/select_player', bodyParser.json(), roomController.actionSelectParticipant);
exports.default = app;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRXRCLHFDQUFxQztBQUNyQywwQ0FBMEM7QUFDMUMsNkJBQTZCO0FBRTdCLGdFQUFnRTtBQUVoRSxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUVuQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFMUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7SUFBYSxPQUFPO1FBQzdCLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBQztLQUNsQyxDQUFBO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFHSCxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsSUFBSSxFQUFFLEVBQUUsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3JFLEdBQUcsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JELEdBQUcsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsVUFBVSxDQUFDLElBQUksRUFBRSxFQUFFLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM5RSxHQUFHLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxjQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNqRyxHQUFHLENBQUMsSUFBSSxDQUFDLHlDQUF5QyxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUUvRyxrQkFBZSxHQUFHLENBQUMifQ==