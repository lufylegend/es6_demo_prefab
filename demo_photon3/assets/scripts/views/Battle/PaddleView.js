import PrefabContainer from '../../../plugin/mvc/prefabs/PrefabContainer';
import BindSpriteView from '../../../plugin/mvc/views/BindSpriteView';
import LEvent from '../../../plugin/lufylegend/events/LEvent';
import EventManager from '../../managers/EventManager';
import masterClient from '../../utils/MasterClient';
//import LVec2 from '../../../plugin/lufylegend/geom/LVec2';
class PaddleView extends BindSpriteView {
    init(data) {
        super.init(data);
    }
    die() {
        super.die();
    }
    get ball() {
        this._ball = this._ball || this.getController().ball;
        return this._ball;
    }
    checkHitBall() {
        if (this.ball.alpha === 0 || this.ball.launcher.objectIndex === this.objectIndex) {
            return false;
        }
        if (this.ball.y + this.ball.size < this.y) {
            return false;
        }
        if (!this.hitTestObject(this.ball)) {
            return false;
        }
        if (this.ball.y + this.ball.size > this.y + this.getHeight() * 0.5) {
            return false;
        }
        this.shoot(this.ball.x, this.ball.y);
    }
    shoot(x, y, isStart) {
        this.ball.launcher = this;
        let event = new LEvent('ball:sendout');
        let params = {};
        params.x = x;
        params.y = y;
        let timeSum = 2000;

        if (isStart) {
            let rand = Math.random();
            let angle = 45 + 90 * rand;
            let angleX = angle * Math.PI / 180;
            let angleY = (angle - 90) * Math.PI / 180;
            this.ball.vec.x = Math.sin(angleX) * (rand > 0.5 ? -1 : 1);
            this.ball.vec.y = Math.abs(Math.cos(angleY)) * -1;
        } else {
            this.ball.vec.x = this.ball.x + this.ball.radius - this.x - this.getWidth() * 0.5;
            this.ball.vec.y = this.ball.y + this.ball.radius - this.y - this.getHeight() * 0.5;

            timeSum += Math.abs(this.ball.vec.x / this.ball.vec.y) * 1600;
        }
        let vec = this.ball.vec.normalize();
        params.speedX = vec.x;
        params.speedY = vec.y;
        params.paddleX = this.x;
        params.arrivalTime = masterClient.now + timeSum;
        event.params = params;
        this.ball.arrivalTime = params.arrivalTime;
        EventManager.dispatchEvent(event);
        masterClient.shoot(event);
    }
}
PrefabContainer.set('PaddleView', PaddleView);
export default PaddleView;