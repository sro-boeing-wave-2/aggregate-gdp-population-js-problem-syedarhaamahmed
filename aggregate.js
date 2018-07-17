// Note this is for the synchronous assignment

const fs = require('fs');

const csv2array = require('./csv2array.js', 'utf8');

function fileReader(filePath) {
  return new Promise(((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, datatable) => {
      if (err) {
        reject(err);
      } else {
        resolve(datatable);
      }
    });
  }));
}

function fileWriter(writePath, data) {
  return new Promise(((resolve, reject) => {
    fs.writeFile(writePath, data, 'utf8', (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  }));
}

// const writeFilePromise = (writeFilePath, data) => new Promise((resolve, reject) => {
//   fs.writeFile(writeFilePath, data, (err) => {
//     if (err) reject(err);
//     else resolve(data);
//   });
// });

const aggregate = filePath => fileReader(filePath).then((data) => {
  const tabularData = csv2array(data);
  const [headerTxt, ...dataTableTxt] = tabularData;
  const headerText = headerTxt.replace(/['"]+/g, '');
  const finalHeaderText = headerText.split(',');
  const indexOfCountry = finalHeaderText.indexOf('Country Name');
  const indexOfGDP2012 = finalHeaderText.indexOf('GDP Billions (US Dollar) - 2012');
  const indexOfPopulation2012 = finalHeaderText.indexOf('Population (Millions) - 2012');
  return Promise.all([fileReader('./data/datafile.csv'), fileReader('./mapping.json')]).then((value) => {
    const mapData = JSON.parse(value[1]);
    const aggregateData = {};
    dataTableTxt.forEach((row) => {
      const rowData = row.replace(/"/g, '').split(',');
      if (mapData[rowData[indexOfCountry]] !== undefined) {
        const getContinent = mapData[rowData[indexOfCountry]];
        if (aggregateData[getContinent] === undefined) {
          aggregateData[getContinent] = {};
          aggregateData[getContinent]
            .POPULATION_2012 = parseFloat(rowData[indexOfPopulation2012]);
          aggregateData[getContinent].GDP_2012 = parseFloat(rowData[indexOfGDP2012]);
        } else {
          aggregateData[getContinent]
            .POPULATION_2012 += parseFloat(rowData[indexOfPopulation2012]);
          aggregateData[getContinent].GDP_2012 += parseFloat(rowData[indexOfGDP2012]);
        }
      }
    });
    return fileWriter('./output/output.json', JSON.stringify(aggregateData));
  });
});

aggregate('./data/datafile.csv');

module.exports = aggregate;
