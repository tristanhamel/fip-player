<template>
  <div>
    <button @click="animate">Animate</button>
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
  import * as settings from '../settings';

  export default Vue.component('app', {
    data: () => ({
      snapInstance: {},
      paths: [],
      animated: false,
      showingPlayButton: false,
      showingLoader: false
    }),
    mounted() {
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

      // group our paths
      const pathsGroup = this.snapInstance.group(...this.paths.map(p => p.snap));
      const gradient = this.snapInstance.gradient('l(0, 0, 0, 1)red-red-orange-green-blue-indigo-violet');

      // create a gradient
      this.snapInstance.rect(0,0,200,200).attr({
        fill: gradient,
        mask: pathsGroup
      });
    },
    methods: {
      animate() {
        if(!this.animated) {
          const seed1 = [-10, -30, -25, -15, -5, -25, 0, -10];
          const seed2 = [-10, 30, -25, 15, -5, 25, -3, 10];
          const offsets = [0, ...seed2, ...seed2, ...seed2, ...seed2, 0];
          const dAttrs = paths.mapMove(this.paths, offsets);
          this.paths
            .forEach((path, i) => {
              path.snap.animate({d: path.dString(dAttrs[i])}, 500);
            });
        } else {
          this.paths.forEach(path => path.snap.animate({d: path.dString()}, 500));
        }
        this.animated = !this.animated;
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
            mina.easeinout(),
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
      }
    }
  });
</script>

<style lang="scss"></style>