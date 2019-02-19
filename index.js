//Dependent Library lodash
const _ = require('lodash');
//Import dummy data has over 5500 records of balls being dropped
const dummyData = require('./data/oneByOne.json');
// The amount of neighbors to find
const k = 10;
//Determines how big of a test set size
const testSetSize = 200;

// Calculate the distance between two points
function distance(pointA, pointB) {
  // multiple features
  return _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5;
}

//Splits data into a test set and a training set
function splitDataset(data, testCount) {
  // Shuffles data set to make a real random selection
  const shuffled = _.shuffle(data);
  // removes our test set from the data provided
  // starts at 0 and goes until our test count
  const testSet = _.slice(shuffled, 0, testCount);
  // removes our training set
  // grabs data from our testCount and beyond
  const trainingSet = _.slice(shuffled, testCount);
  // returns two arrays one representing our test set and the other returning our training set
  return [testSet, trainingSet];
}

// normalizes the data to be between 0 and 1
function normalizeData(data, featureCount) {
  // Makes a copy of the data
  const clonedData = _.cloneDeep(data);
  // Loops through the specific features
  for (let i = 0; i < featureCount; i++) {
    //return only that feature I.E [250, 400, 235, 150]
    const column = clonedData.map(row => row[i]);
    // Finds the min I.E 150 === 0
    const min = _.min(column);
    // Finds the max I.E 400 === 1
    const max = _.max(column);
    // loops through the entire array and normalizes the data
    for (let j = 0; j < clonedData.length; j++) {
      // replaces value in cloned data with normalized data
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
    }
  }
  // returns array with normalized data
  return clonedData;
}

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

// Determines a range for k
_.range(0, 3).forEach(feature => {
  const data = _.map(dummyData, row => [row[feature], _.last(row)])
  // Array destructuring into a test set and a training set
  const [testSet, trainingSet] = splitDataset(normalizeData(data, 1), testSetSize);
  // runs KNN on each range value and tests for accuracy
  const accuracy = _.chain(testSet)
    .filter(testPoint => knn(
      trainingSet,
      _.initial(testPoint),
      k) === _.last(testPoint))
    .size()
    .divide(testSetSize)
    .multiply(100)
    .value()

  //console logs the output
  console.log('Accuracy:', accuracy, "% for feature of", feature);
});