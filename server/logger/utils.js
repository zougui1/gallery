exports.getPreviousDir = path => {
  const pathArr = path.split('/');
  pathArr.pop();
  return pathArr.join('/');
}
