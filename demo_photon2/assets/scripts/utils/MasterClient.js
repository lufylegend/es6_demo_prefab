import LEventDispatcher from '../../plugin/lufylegend/events/LEventDispatcher';
import LEvent from '../../plugin/lufylegend/events/LEvent';
const ClientEvent = {
    ATTACK: 1
};
class MasterClient extends LEventDispatcher {
    gameStart() {
        let event = new LEvent('game:start');
        event.enemyPlayer = this.enemy;
        this.dispatchEvent(event);
    }
    onEvent(code, content, actorNr) {
        console.error('MasterClient', code, content);
        let event;
        switch (code) {
        case ClientEvent.ATTACK:
            console.error('this.photonClient.myActor().getId()=' + this.photonClient.myActor().getId());
            console.error('content.id=' + content.id);
            if (this.photonClient.myActor().getId() !== content.id) {
                event = new LEvent('enemy:attack');
                event.index = content.index;
                event.hert = content.hertValue;
                this.dispatchEvent(event);
            }
            break;
        }
    }
    get enemy() {
        return this.photonClient.myRoomActorsArray()[1];
    }
    get player() {
        return this.photonClient.myRoomActorsArray()[0];
    }
    get playerId() {
        return this.player.id;
    }
    get enemyId() {
        return this.enemy.id;
    }
    attack(index, hertValue) {
        this.photonClient.raiseEventAll(ClientEvent.ATTACK, { 'id': this.photonClient.myActor().getId(), index: index, hertValue: hertValue });
    }
}
let client = new MasterClient();
let photonClient = new window.PhotonClient(client);
client.photonClient = photonClient;
export default client;