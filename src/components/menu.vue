<template>
  <g id="menu-group">
    <path :d="pathDefs[0] class=menu-path"></path>
    <path :d="pathDefs[1] class=menu-path"></path>
    <path :d="pathDefs[2] class=menu-path"></path>
  </g>
</template>

<style></style>

<script>
  import Vue from 'vue';
  import Snap from 'snapsvg-cjs';
  import * as settings from '../settings';

  export default Vue.component('svg-menu', {
    data: () => ({
      group: {}
    }),
    props: {
      snapInstance: {},
      menuPaths: [],
      isOpened: Boolean
    },
    mounted() {
      const pathDefs = [
      `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*2} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*2}`,
        `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*2.5} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*2.5}`,
        `M ${settings.pathsDistance*1.5} ${settings.pathsDistance*3} L ${settings.pathsDistance*3.5} ${settings.pathsDistance*3}`
      ];

      this.group = this.snapInstance.select('#menu-group');

      // add menuElements
      this.menuPaths = pathDefs
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

      this.group.append(this.menuPaths);
    },
    methods: {
      openMenu() {},
      closeMenu() {},
    },
    computed: {}
  })
</script>