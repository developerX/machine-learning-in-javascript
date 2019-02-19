//Dependent Library lodash
const _ = require('lodash');

//Import dummy data has over 5500 records of balls being dropped
const outputs = require('./data/oneByOne.json');

//The K-nearest Neighbor Algorithm in practice
function knn(data, point, k) {
  return _.chain(data)
    // loop through every data point and do a calculation
    .map(row => {
      return [
        distance(
          _.initial(row),
          point
        ),
        _.last(row)
      ]
    })
    // sort by the distance
    .sortBy(row => row[0])
    // return the data by the amount of K
    .slice(0, k)
    // Organize by most common outcome
    .countBy(row => row[1])
    // Turn them back into an array
    .toPairs()
    // Sort them in ascending order
    .sortBy(row => row[1])
    // return the last array (most common output)
    .last()
    // return the value of most likely return
    .first()
    //convert back into a number
    .parseInt()
    // return the chain
    .value()
}

// Calculates the absolute distance between 2 points
function distance(pointA, pointB) {
  // multiple features
  return _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5;

  // single feature based off point
  // return Math.abs(pointA - pointB);
}

//Splits data into a test set and a training set
function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);
  return [testSet, trainingSet];
}

function normalizeData(data, featureCount) {
  const clonedData = _.cloneDeep(data);
  for (let i = 0; i < featureCount; i++) {
    const column = clonedData.map(row => row[i]);
    const min = _.min(column);
    const max = _.max(column);
    for (let j = 0; j < clonedData.length; j++) {
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
    }
  }

  return clonedData;
}

//Determines how big of a test set size
const testSetSize = 200;

// Array destructuring into a test set and a training set
const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

// Determines a range for k
_.range(1, 30).forEach(k => {
  // runs KNN on each range value and tests for accuracy
  const accuracy = _.chain(testSet)
    .filter(testPoint => knn(
      normalizeData(trainingSet, 3),
      _.initial(testPoint),
      k) === testPoint[3])
    .size()
    .divide(testSetSize)
    .multiply(100)
    .value()

  //console logs the output
  console.log('Accuracy:', accuracy, "% K is equal to", k);
});