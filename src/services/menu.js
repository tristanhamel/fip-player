import * as settings from '../settings';
import radioOptions from '../radio-options';


export default function(snapInstance) {
  const obj = Object.assign(createPaths(snapInstance), {
    opened: false,
    open() {
      this.opened = true;
      this.paths.frame.snap.animate({width: settings.viewBox.w - 2*settings.pathsDistance, height: settings.viewBox.h - 2*settings.pathsDistance}, 300);

      this.paths.burger[0].snap.animate({d: `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*2} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*4}`}, 300);
      this.paths.burger[1].snap.animate({d: `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*4} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*2}`}, 300);
      this.paths.burger[2].snap.animate({opacity: 0}, 300);

      this.paths.options
        .forEach(o => o.snap.animate({opacity: 1}, 300));
    },
    close() {
      this.opened = false;
      this.paths.frame.snap.animate({width: 3 * settings.pathsDistance, height: 3 * settings.pathsDistance}, 300);

      this.paths.burger[0].snap.animate({d: this.paths.burger[0].dString}, 200);
      this.paths.burger[1].snap.animate({d: this.paths.burger[1].dString}, 200);
      this.paths.burger[2].snap.animate({opacity: 1}, 200);

      this.paths.options
        .forEach(o => o.snap.animate({opacity: 0}, 300));

    }
  });

  return obj;
}

function createPaths(snapInstance) {
  const burger = [
    `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*2} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*2}`,
    `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*2.5} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*2.5}`,
    `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*3} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*3}`
  ]
    .map(mp => ({
      dString: mp,
      snap: snapInstance
        .path(mp)
        .attr({
          fill: 'transparent',
          stroke: 'white',
          strokeWidth: 0.2
        })
    }));

  // main menu frame
  const frame = {
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
  };

  // options
  const optionsTop = settings.pathsDistance * 5;
  const optionsMargin = settings.pathsDistance;
  const optionsHeight = (settings.viewBox.h - optionsTop - optionsMargin*radioOptions.length - settings.pathsDistance) / radioOptions.length;

  const options = radioOptions
    .map((option, i) => ({
      snap: snapInstance.rect(
        settings.pathsDistance * 2,
        optionsTop + i * (optionsMargin + optionsHeight),
        settings.viewBox.w - 4 * settings.pathsDistance,
        optionsHeight
      )
        .attr({
          fill: 'black',
          stroke: 'white',
          strokeWidth: 0.2,
          opacity: 0,
          class: 'option'
        })
    }));

  return {paths: {burger, frame, options}};
}
