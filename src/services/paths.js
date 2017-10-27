import * as settings from '../settings';

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: Math.round((centerX + (radius * Math.cos(angleInRadians))) * 10) / 10,
    y: Math.round((centerY + (radius * Math.sin(angleInRadians))) * 10) / 10
  };
}

function getColor(n, max) {
  return `hsl(0, 0, ${Math.round(100 * (settings.pathsCount - Math.abs(n)) / max)}%)`;
}

function describePath(y, n) {
  return {
    y: y + settings.viewBox.h / 2,
    sAnchors: sAnchors(y),
    dString(anchors = this.sAnchors, y = this.y) {
      return `M 0 ${this.y} ` +
        anchors.map(p => 'S ' + p.join(' ')) +
        `L ${settings.viewBox.h} ${this.y}`;
    },
    stroke: getColor(n, settings.pathsCount),
    main: n === 0,
    n: Math.abs(n)
  };
}

function sAnchors(y) {
  const padding = settings.anchorDistance / 2;
  const points = [];

  let anchors = 1 + settings.anchorsCount / 2;
  while(anchors) {
    points.unshift(sAnchor(anchors * settings.anchorDistance - padding, y, padding));
    anchors--;
  }

  return points
    .reduce((ar, p) => {
      return [
        [-p[0] - settings.anchorDistance, p[1], -p[2], p[3]],
        ...ar,
        p
      ];
    }, [])
    .map( p => p.map(a => a + settings.viewBox.h/2));
}

function sAnchor(x, y, padding) {
  return [x - padding, y, x, y];
}

function toPlayShape(paths) {

  const center = {x: settings.viewBox.w / 2, y: settings.viewBox.h / 2};
  const r = settings.viewBox.w / 3;

  function getTriangles(n) {
    const summits = [{x: center.x + r + n, y: center.y}];
    summits.push(
      Object.assign(polarToCartesian(center.x, center.y, r + n, -30)),
      Object.assign(polarToCartesian(center.x, center.y, r + n, -150))
    );

    return {d: `
      M ${summits[0].x} ${summits[0].y}
      L ${summits[1].x} ${summits[1].y}
      L ${summits[2].x} ${summits[2].y}
      Z`};
  }

  paths
    .forEach(p => p
      .snap
      .animate(getTriangles(p.n), 500)
    );
}

function spawnPaths(snapInstance) {
  const paths = [];
  let count = settings.pathsCount;
  while(count >= - settings.pathsCount) {
    paths.unshift(describePath(count * settings.pathsDistance, count));
    count--;
  }

  paths.forEach(p => {
    p.snap = snapInstance
      .path(p.dString())
      .attr({
        fill: 'transparent',
        stroke: p.stroke,
        strokeWidth: 0.1
      });
  });

  // animate paths to play button for a start
  setTimeout(() => toPlayShape(paths), 200);

  return paths;
}

function mapMove(paths, offsets) {
  // this is the best spreading algorithm I've found
  // equates to LOG^pathsCount(n) rounded to the first decimal
  const log = n => Math.round(10 * Math.log(n + 1) / Math.log(settings.pathsCount)) / 10;

  function off(n, offset, originalOffset, y) {
    // if there are no offset or it's the seed line, do nothing
    if(originalOffset === 0 || n === 0) {
      return originalOffset;
    }

    let total;
    // distance has been tweaked for visual purposes (cf 0.5 'magical' number)
    const distanceToPrevious = settings.pathsDistance - 0.5 * log(Math.abs(settings.pathsCount + 1 - n)) * settings.pathsDistance;
    const offsetChunk = offset - offset * log(n);
    if(originalOffset > 0) {
      if(y > settings.viewBox.h / 2) {
        total = Math.max(offset - distanceToPrevious, 0);
      } else {
        total = offsetChunk;
        return total;
      }
    } else {
      if(y < settings.viewBox.h / 2) {
        total = Math.min(offset + distanceToPrevious, 0);
      } else {
        total = offsetChunk;
        return total;
      }
    }

    n--;
    return n > 0 ? off(n, total, originalOffset, y) : total;
  }

  return paths
    .map((path) => path.sAnchors.map( (sp, i) => [
      sp[0],
      sp[1] + off(path.n, offsets[i], offsets[i], path.y),
      sp[2],
      sp[3] + off(path.n, offsets[i], offsets[i], path.y)
    ]));
}

function getRandomDashArray() {
  const length = settings.viewBox.w;
  const dashLength = 5;
  const point = Math.round(Math.random() * length);

  return {
    dashArray : `${length} 5`,
    dashOffset: `${point}`
  };
}

function animate(pathsSet, getData) {
  if (!this.playing) return;
  let done = 0 // move to next anim cycle when all anims are completed

  const dAttrs = mapMove(pathsSet, getData());

  pathsSet
    .forEach((path, i) => {
      path.snap.animate(
        {d: path.dString(dAttrs[i])},
        20,
        mina.linear,
        () => {
          done++;
          done === pathsSet.length ? this.animate(pathsSet, getData) : null;
        }
      );
    });
}

export default function(snapInstance) {
  return {
    playing: false,
    paths: spawnPaths(snapInstance),
    show: () => {},
    hide: () => {},
    animate,
    play(getData) {
      this.playing = true;

      const pathsSet = this.paths;

      this.paths
        .forEach(path => path.snap.animate(
          {d: path.dString()},
          500,
          mina.linear,
          () => this.animate(pathsSet, getData)
        ));
    },
    stop() {
      this.playing = false;
      toPlayShape(this.paths);
    }
  };
}