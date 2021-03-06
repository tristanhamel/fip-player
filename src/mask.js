
export default function (snapInstance, paths, clickCallback) {
  // const gradient = snapInstance.gradient('l(0, 0, 0, 1)red-red-orange-green-blue-indigo-violet');
  const gradient = snapInstance.gradient('l(0, 0, 0, 1)#eea2a2-#bbc1bf:19-#57c6e1:42-#b49fda:79-#7ac5d8');

  // create a gradient
  const rect = snapInstance.paper
    .rect(0,0,200,200)
    .attr({
      fill: gradient,
      mask: paths
    });

  const playGhost = snapInstance.paper
    .rect(50,40,120,120)
    .attr({
      fill: 'transparent'
    })
    .click(() => clickCallback());

  snapInstance.prepend(playGhost);
  snapInstance.prepend(rect);
}

//gradients
// #2af598-#009efd
// #eea2a2-#bbc1bf:19-#57c6e1:42-#b49fda:79-#7ac5d8