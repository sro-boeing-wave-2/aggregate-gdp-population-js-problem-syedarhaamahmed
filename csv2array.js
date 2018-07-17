function csv2array(input) {
  const data2string = input.toString();
  const withoutCommaAndSpace = data2string.replace(/['"]+/g, '');
  const splitarray = withoutCommaAndSpace.split('\n');
  return splitarray;
}

module.exports = csv2array;
