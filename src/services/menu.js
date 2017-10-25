import * as settings from '../settings';

export default function(snapInstance) {
  return {
    paths: createPaths(snapInstance),
    opened: false,
    open() {
      this.opened = true;

      this.paths[1].snap.animate({d: `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*2} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*4}`}, 300);
      this.paths[2].snap.animate({d: `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*4} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*2}`}, 300);
      this.paths[3].snap.animate({opacity: 0}, 300);
    },
    close() {
      this.opened = false;

      this.paths[1].snap.animate({d: this.paths[1].dString}, 200);
      this.paths[2].snap.animate({d: this.paths[2].dString}, 200);
      this.paths[3].snap.animate({opacity: 1}, 200);
    }
  };
}

function createPaths(snapInstance) {
  const menuPathsDefs = [
    `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*2} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*2}`,
    `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*2.5} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*2.5}`,
    `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*3} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*3}`
  ];

  const menuPaths = menuPathsDefs
    .map(mp => ({dString:  mp}));

  menuPaths
    .forEach(mp => mp.snap = snapInstance
      .path(mp.dString)
      .attr({
        fill: 'transparent',
        stroke: 'white',
        strokeWidth: 0.2
      })
    );

  menuPaths.unshift({
    snap: snapInstance.rect(
      settings.pathsDistance,
      settings.pathsDistance,
      3 * settings.pathsDistance,
      3 * settings.pathsDistance,
      1.5 * settings.pathsDistance,
      1.5 * settings.pathsDistance
    )
      .attr({
        fill: 'transparent',
        stroke: 'white',
        strokeWidth: 0.2
      })
  });

  return menuPaths;
}
