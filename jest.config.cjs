module.exports = {
  testEnvironment: "node",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.js$",
  // Add any other Jest configuration options here
  collectCoverage: true,
  coverageDirectory: "coverage",
  transform: { "^.+\\.jsx?$": "babel-jest" },
  moduleFileExtensions: ["js", "json", "jsx", "node"],
};
