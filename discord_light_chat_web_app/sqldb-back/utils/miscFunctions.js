function toCamelCase(str) {
  return str.replace(/[-_\s]+(.)?/g, function (match, chr) {
    return chr ? chr.toUpperCase() : "";
  });
}

module.exports = {
  toCamelCase,
};
