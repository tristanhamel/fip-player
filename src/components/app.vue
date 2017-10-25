<template>
  <div>



  </div>

</template>

<script>
  import Vue from 'vue';
  import Snap from 'snapsvg-cjs';

  import * as paths from '../services/paths';
  import * as getStream from '../services/radio';
  import * as settings from '../settings';

  import menu from './menu.vue';

  export default Vue.component('app', {
    components:{
      menu
    },
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

      });

    },
    methods: {
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




        } else {
          this.menuPaths[0].snap.animate({
            width: settings.pathsDistance * 3,
            height: settings.pathsDistance * 3,
          }, 300, () => {
            this.pathsGroup.animate({opacity: 1}, 100);
          });

        }
        this.openedMenu = !this.openedMenu;
      }
    }
  });
</script>

<style lang="scss"></style>