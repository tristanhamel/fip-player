<template>
  <div>
    <audio></audio>
    <button @click="toggleAnimation">Animate</button>
    <button @click="toPlayShape">To play shape</button>
    <button @click="toLoadShape">To load shape</button>
    <svg id="viewBox" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    </svg>
  </div>

</template>

<script>
  import Vue from 'vue';
  import Snap from 'snapsvg-cjs';

  import * as paths from '../services/paths';
  import * as getStream from '../services/radio';
  import * as settings from '../settings';

  export default Vue.component('app', {
    data: () => ({
      snapInstance: {},
      paths: [],
      pathsGroup: [],
      menuPaths: [],
      frequencyData: [],
      animated: false,
      showingPlayButton: false,
      showingLoader: false,
      openedMenu: false
    }),
    mounted() {
      // radio stream
      const audioElement = document.querySelector('audio');
      getStream.init(audioElement);

      // svg ui
      this.snapInstance = Snap('#viewBox');
      this.paths = paths.spawnPaths();

      this.paths.forEach(p => {
        p.snap = this.snapInstance
          .path(p.dString())
          .attr({
            fill: 'transparent',
            stroke: p.stroke,
            strokeWidth: 0.1
          });

      });

      // create menu elements
      const menuPathsDefs = [
        `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*2} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*2}`,
        `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*2.5} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*2.5}`,
          `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*3} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*3}`
      ];

      this.menuPaths = menuPathsDefs
        .map(mp => ({dString:  mp}));

      this.menuPaths
        .forEach(mp => mp.snap = this.snapInstance
          .path(mp.dString)
          .attr({
            fill: 'transparent',
            stroke: 'white',
            strokeWidth: 0.2
          })
        );

      this.menuPaths.unshift({
        snap: this.snapInstance.rect(
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

      const menuPathsGroup = this.snapInstance.group(...this.menuPaths.map(p => p.snap));

      // group our paths
      this.pathsGroup = this.snapInstance.group(...this.paths.map(p => p.snap));

      const gradient = this.snapInstance.gradient('l(0, 0, 0, 1)red-red-orange-green-blue-indigo-violet');

      // create a gradient
      this.snapInstance.rect(0,0,200,200).attr({
        fill: gradient,
        mask: this.snapInstance.group(this.pathsGroup, menuPathsGroup)
      });

      const clickGhost = this.snapInstance.rect(settings.pathsDistance*2, settings.pathsDistance, settings.pathsDistance*3, settings.pathsDistance*3)
        .attr({
          fill: 'transparent',
        })
        .click(this.openMenu);
    },
    methods: {
      animate() {
          const dAttrs = paths.mapMove(this.paths, getStream.getData());
          this.paths
            .forEach((path, i) => {
              path.snap.animate({d: path.dString(dAttrs[i])}, 500);
            });

        setTimeout(() => this.animate(), 500);
      },
      toggleAnimation() {
        this.animated = !this.animated;
        this.animated ? this.startAnimation() : this.stopAnimation();
      },
      startAnimation() {
        getStream.start();
        this.animate();
      },
      stopAnimation() {
        getStream.stop();
        this.paths.forEach(path => path.snap.animate({d: path.dString()}, 500));
      },
      toPlayShape() {
        if(!this.showingPlayButton) {
          const summits = paths.toPlayShape(this.paths);
          this.paths
            .forEach((p, i) => p
              .snap
              .animate(summits[i], 500)
            );
        } else {
          this.paths.forEach(path => path.snap.animate({d: path.dString()}, 500));
        }

        this.showingPlayButton = !this.showingPlayButton;
      },
      toLoadShape() {
        function animateDash(snap, offset, n) {

          snap.animate(
            {strokeDashoffset: n ? settings.viewBox.w - offset : offset},
            1000,
            mina.easeinout,
            () => {this.showingLoader ? animateDash.call(this, snap, offset, !n) : null}
          );
        }

        if(!this.showingLoader) {
          this.paths
            .forEach(p => {
              const dashData = paths.getRandomDashArray();
              p
                .snap
                .attr({
                  strokeDasharray: dashData.dashArray,
                  strokeDashoffset: dashData.dashOffset
                });

              animateDash.call(this, p.snap, dashData.dashOffset, true);
            });
        } else {
          this.paths.forEach(path => path.snap.attr({strokeDasharray: ''}));
        }

        this.showingLoader = !this.showingLoader;
      },
      openMenu() {
        if(!this.openedMenu) {
            this.pathsGroup.animate({opacity: 0}, 100, null, () => {
              this.menuPaths[0].snap.animate({
                width: settings.viewBox.w - settings.pathsDistance * 2,
                height: settings.viewBox.h - settings.pathsDistance * 2,
              }, 300);
            });

          this.menuPaths[1].snap.animate({d: `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*2} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*4}`}, 300);
          this.menuPaths[2].snap.animate({d: `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*4} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*2}`}, 300);
          this.menuPaths[3].snap.animate({opacity: 0}, 300);


        } else {
          this.menuPaths[0].snap.animate({
            width: settings.pathsDistance * 3,
            height: settings.pathsDistance * 3,
          }, 300, () => {
            this.pathsGroup.animate({opacity: 1}, 100);
          });
          this.menuPaths[1].snap.animate({d: this.menuPaths[1].dString}, 200);
          this.menuPaths[2].snap.animate({d: this.menuPaths[2].dString}, 200);
          this.menuPaths[3].snap.animate({opacity: 1}, 200);

        }
        this.openedMenu = !this.openedMenu;
      }
    }
  });
</script>

<style lang="scss"></style>