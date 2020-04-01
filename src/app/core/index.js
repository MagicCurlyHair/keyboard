import { alphaDigital } from '../buttons/alpha-digital';
import { services } from '../buttons/services';

class MainKeyboard {
  constructor() {
    this.createNodes = (el) => {
      const node = document.createElement('input');
      node.name = el.id;
      node.value = String.fromCodePoint(el.current);
      node.type = 'button';
      node.classList = `button ${el.id.toLowerCase()}`;
      return node;
    };

    this.createServices = (node, obj, option) => {
      node.insertAdjacentHTML(option, `
       <input name="${obj.id}" type="button" value="${obj.name}" class="button ${obj.id.toLowerCase()}">`);
    };

    this.createServicesNodes = (el) => {
      const node = document.createElement('input');
      node.name = el.id;
      node.value = el.name;
      node.type = 'button';
      node.classList = `button ${el.id.toLowerCase()}`;
      return node;
    };

    this.servicesKeys = Object.values(services).flat();
    this.alphaDigKeys = Object.values(alphaDigital).flat();
    this.alphaDigitNodes = [];

    this.nodesData = () => {
      const obj = {};
      this.alphaDigKeys.forEach((data) => {
        obj[data.id] = data;
      });
      return obj;
    };
  }

  start() {
    this.init();
    this.pressKey();
    this.upKey();
    this.setObserve();
  }

  init() {
    const appKeyboard = document.querySelector('#app-keyboard');
    this.render(appKeyboard);
    this.addServices(appKeyboard);
    const area = document.querySelector('#keyboard-print');
    area.onkeypress = () => false;
    area.onkeydown = () => false;
    area.onblur = () => area.focus();
  }

  render(appKeyboard) {
    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');

    Object.keys(alphaDigital).forEach((key) => {
      const node = alphaDigital[key].map(this.createNodes);
      const row = document.createElement('div');
      row.classList.add('row');
      row.append(...node);
      keyboard.append(row);
      appKeyboard.append(keyboard);
      this.alphaDigitNodes = this.alphaDigitNodes.concat(node);
    });
  }

  addServices(appKeyboard) {
    const rows = appKeyboard.getElementsByTagName('div');
    const keyboard = appKeyboard.querySelector('.keyboard');
    this.createServices(rows[1], services.row1[0], 'beforeend');
    this.createServices(rows[2], services.row2[0], 'afterbegin');
    this.createServices(rows[3], services.row3[0], 'afterbegin');
    this.createServices(rows[3], services.row3[1], 'beforeend');
    this.createServices(rows[4], services.row4[0], 'afterbegin');
    this.createServices(rows[4], services.row4[1], 'beforeend');
    this.createServices(rows[4], services.row4[2], 'beforeend');
    const servicesNodes = services.row5.map(this.createServicesNodes);
    const row = document.createElement('div');
    row.classList.add('row');
    row.append(...servicesNodes);
    keyboard.append(row);
  }

  pressKey() {
    const area = document.querySelector('#keyboard-print');
    document.addEventListener('keydown', (e) => {
      this.alphaDigKeys.forEach((key) => {
        if (key.id === e.code) {
          area.focus();
          if (key.ctrl) return;
          area.value += String.fromCodePoint(key.current);
        }
      });

      [...this.alphaDigKeys, ...this.servicesKeys].forEach((key) => {
        if (key.id === e.code) {
          key.setActive();
        }
      });
    });
  }

  upKey() {
    document.addEventListener('keyup', (e) => {
      [...this.alphaDigKeys, ...this.servicesKeys].forEach((key) => {
        if (key.id === e.code) {
          key.removeActive();
        }
      });
    });
  }

  setObserve() {
    const regexp = /CapsLock|ShiftLeft|ShiftRight|ControlLeft|ControlRight/i;
    const serviceKeys = this.servicesKeys.filter((btn) => regexp.test(btn.id));
    this.alphaDigKeys.forEach((key) => serviceKeys.forEach((obj) => obj.register(key)));
    this.handleServicesBtn(serviceKeys);
  }

  handleServicesBtn(serviceKeys) {
    const nodesData = this.nodesData();

    const render = () => {
      this.alphaDigitNodes.forEach((input) => {
        input.value = String.fromCodePoint(nodesData[input.name].current);
      });
    };

    const shiftHandle = (e) => {
      serviceKeys.forEach((btn) => {
        if (e.code !== btn.id) return;
        if (btn.name === 'Shift') {
          e.type === 'keydown' ? btn.keyDown() : btn.keyUp();
          render();
        } else if (btn.name === 'CapsLock') {
          if (e.type !== 'keydown') return;
          btn.keyDown();
          render();
        } else if (btn.name === 'Ctrl') {
          e.type === 'keydown' ? btn.keyDown() : btn.keyUp();
        }
      });
    };

    document.addEventListener('keydown', shiftHandle);
    document.addEventListener('keyup', shiftHandle);
  }
}

export const mainKeyboard = new MainKeyboard();
