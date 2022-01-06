module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: { '^.+\\.ts?$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coverageDirectory: 'coverage',
  reporters: ['default', 'jest-sonar'],
  testRegex: '(/tests/unit-tests.*|(\\.|/)(test|spec))\\.[jt]sx?$',
};
