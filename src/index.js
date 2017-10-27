import Snap from 'snapsvg-cjs';
import mask from './services/mask';
import paths from './services/paths';
import menu from './services/menu';
import * as getStream from './services/radio';
import * as settings from './settings';

import './styles/global.scss';

class App {
  constructor() {
    // temporary  - to be removed
    document.getElementById('animate-btn').addEventListener('click', () => this.toggleRadio());

    // radio stream
    getStream.init(document.querySelector('audio'));

    // svg ui
    this.snapInstance = Snap('#viewBox');
    this.paths = paths(this.snapInstance);
    this.menu = menu(this.snapInstance);

    // create mask
    const pathsGroup = this.snapInstance.group(
      ...this.menu.paths.burger.map(p => p.snap),
      this.menu.paths.frame.snap,
      ...this.menu.paths.options.map(p => p.snap),
      this.paths.group
    );
    mask(this.snapInstance, pathsGroup);

    // create toggle for the menu
    this.snapInstance.rect(settings.pathsDistance*2, settings.pathsDistance, settings.pathsDistance*3, settings.pathsDistance*3)
      .attr({
        fill: 'transparent',
      })
      .click(() => this.toggleMenu());

  }

  // toLoadShape() {
  //   function animateDash(snap, offset, n) {
  //
  //     snap.animate(
  //       {strokeDashoffset: n ? settings.viewBox.w - offset : offset},
  //       1000,
  //       mina.easeinout,
  //       () => {this.showingLoader ? animateDash.call(this, snap, offset, !n) : null}
  //     );
  //   }
  //
  //   if(!this.showingLoader) {
  //     this.paths
  //       .forEach(p => {
  //         const dashData = paths.getRandomDashArray();
  //         p
  //           .snap
  //           .attr({
  //             strokeDasharray: dashData.dashArray,
  //             strokeDashoffset: dashData.dashOffset
  //           });
  //
  //         animateDash.call(this, p.snap, dashData.dashOffset, true);
  //       });
  //   } else {
  //     this.paths.forEach(path => path.snap.attr({strokeDasharray: ''}));
  //   }
  //
  //   this.showingLoader = !this.showingLoader;
  // }

  startPlayback() {
    getStream.start();
    this.paths.play(getStream.getData);
  }

  stopPlayback() {
    getStream.stop();
    this.paths.stop();
  }

  openMenu() {
    this.menu.open();
    this.paths.fadeOut();
  }

  closeMenu() {
    this.menu.close();
    this.paths.fadeIn();
  }

  toggleMenu() {
    this.menu.opened ? this.closeMenu() : this.openMenu();
  }

  toggleRadio() {
    this.paths.playing ? this.stopPlayback() : this.startPlayback();
  }
}

new App();
