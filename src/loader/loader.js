import { Spinner } from 'spin.js';
import './loader.scss';

class Loader {
  loader = {};

  constructor(target) {
    this.target = target;

    this.loader = new Spinner();
  }

  start() {
    this.loader.spin(this.target);
  }

  stop() {
    this.loader.stop();
  }
}

export default Loader;
