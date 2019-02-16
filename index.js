//Dependent Library lodash
const _ = require('lodash');

//Import dummy data has over 5500 records of balls being dropped
const outputs = require('./data/oneByOne.json');

//The K-nearest Neighbor Algorithm in practice
function knn(data, point, k) {
  return _.chain(data)
    .map(row => [distance(row[0], point), row[3]])
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value()
}

// Calculates the absolute distance between 2 points
function distance(pointA, pointB) {
  return Math.abs(pointA - pointB);
}

//Splits data into a test set and a training set
function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);
  return [testSet, trainingSet];
}

//Determines how big of a test set size
const testSetSize = 500;

// Array destructuring into a test set and a training set
const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

// Determines a range for k
_.range(1, 30).forEach(k => {
  // runs KNN on each range value and tests for accuracy
  const accuracy = _.chain(testSet)
    .filter(testPoint => knn(trainingSet, testPoint[0], k) === testPoint[3])
    .size()
    .divide(testSetSize)
    .multiply(100)
    .value()

  //console logs the output
  console.log('Accuracy:', accuracy, "K is equal to", k);
});