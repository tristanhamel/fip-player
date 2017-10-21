<template>
  <div>
    <button @click="animate">Animate</button>
    <svg id="viewBox" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    </svg>
  </div>

</template>

<script>
  import Vue from 'vue';
  import Snap from 'snapsvg-cjs';

  import * as paths from '../services/paths';

  export default Vue.component('app', {
    data: () => ({
      snapInstance: {},
      paths: [],
      animated: false
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

//        debug(this.snapInstance, dAttrs);

      }
    }
  });

  function debug(snapInstance, paths) {
    snapInstance.path('M 0 100 H 200').attr({stroke: 'red', strokeWidth: 1});
    snapInstance.path('M 100 0 V 200').attr({stroke: 'red', strokeWidth: 1});

    paths
      .forEach(anchors => {
        anchors
          .forEach(a => {
//            snapInstance.circle(a[0], a[1], 0.5)
//              .attr({fill: 'lightGreen'});
            snapInstance.circle(a[2], a[3], 0.5)
              .attr({fill: 'green'});
          });
    });
  }
</script>

<style lang="scss"></style>