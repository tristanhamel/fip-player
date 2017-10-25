export default function (snapInstance, paths) {
  const gradient = snapInstance.gradient('l(0, 0, 0, 1)red-red-orange-green-blue-indigo-violet');

  // create a gradient
  snapInstance.rect(0,0,200,200).attr({
    fill: gradient,
    mask: paths
  });

}