import * as settings from '../settings';
import radioOptions from '../radio-options';


export default function(snapInstance, clickCallBack) {
  const obj = Object.assign(createPaths(snapInstance), {
    opened: false,

    open() {
      this.opened = true;

      //animate paths bound to bg mask
      this.paths.frame.snap.animate({width: settings.viewBox.w - 2*settings.pathsDistance, height: settings.viewBox.h - 2*settings.pathsDistance}, 300);

      this.paths.burger[0].snap.animate({d: `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*2} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*4}`}, 300);
      this.paths.burger[1].snap.animate({d: `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*4} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*2}`}, 300);
      this.paths.burger[2].snap.animate({opacity: 0}, 300);

      setTimeout(() => {
        this.paths.options
          .forEach(o => o.snap.animate({opacity: 1}, 300));

        this.paths.texts
          .forEach(o => o.snap.animate({opacity: 1}, 300));
      }, 200);

      this.optionsGhosts.forEach(o => o.snap.attr({display: 'block'}));
    },

    close() {
      this.opened = false;
      this.paths.frame.snap.animate({width: 3 * settings.pathsDistance, height: 3 * settings.pathsDistance}, 300);

      this.paths.burger[0].snap.animate({d: this.paths.burger[0].dString}, 200);
      this.paths.burger[1].snap.animate({d: this.paths.burger[1].dString}, 200);
      this.paths.burger[2].snap.animate({opacity: 1}, 200);

      this.optionsGhosts.forEach(o => {
        o.snap.attr({display: 'none'});
      });

      this.paths.options
        .forEach(o => o.snap.animate({opacity: 0}, 300));

      this.paths.texts
        .forEach(o => o.snap.animate({opacity: 0}, 300));

    },
  });

  // add 'ghost' elements to handle clicks
  obj.optionsGhosts = obj.paths.options
    .map((o, i) => ({
      snap: o.snap.clone()
        .attr({
          'display': 'none',
          fill: 'transparent'
        })
        .click(() => {
          clickCallBack(i);
          obj.paths.options.forEach((o, j) => {
            const fill = i === j ? 'white' : 'black';
            o.snap.animate({fill}, 300);
          });

          obj.paths.texts.forEach((o, j) => {
            const fill = i === j ? 'black' : 'white';
            o.snap.animate({fill}, 300);
          });
        })
        .appendTo(snapInstance)
    }));

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
          fill: 'black',
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
  const optionsHeight = Math.round(
    (settings.viewBox.h - optionsTop - optionsMargin*radioOptions.length - settings.pathsDistance) / radioOptions.length
  );

  const options = radioOptions
    .map((option, i) => ({
      snap: snapInstance.rect(
        settings.pathsDistance * 2,
        optionsTop + i * (optionsMargin + optionsHeight),
        settings.viewBox.w - 4 * settings.pathsDistance,
        optionsHeight
      )
        .attr({
          fill: i ? 'black' : 'white',
          stroke: 'white',
          strokeWidth: 0.2,
          opacity: 0,
          class: option
        })
    }));

  const texts = radioOptions
    .map((option, i) => ({
      snap: snapInstance.text(
        settings.viewBox.w / 2,
        optionsTop + i * (optionsMargin + optionsHeight) + optionsHeight - 5,
        option.label
      )
        .attr({
          opacity: 0,
          'font-size': optionsHeight,
          'text-anchor': 'middle',
          'font-family': 'Montserrat, sans-serif',
          'font-weight': 'lighter',
          fill: i ? 'white' : 'black'
        })
    }));

  return {paths: {burger, frame, options, texts}};
}
