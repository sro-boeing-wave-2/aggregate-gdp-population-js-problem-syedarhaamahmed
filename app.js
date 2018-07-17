const fs = require('fs');

const data = fs.readFileSync('./data/datafile.csv', 'utf8');

const csv2array = require('./csv2array.js', 'utf8');

// console.log(csv2array(data));


function header(headerValue) {
  // console.log('header: ' + headerValue)
  const head = headerValue[0].split(',');
  return head;
}

// console.log(header(csv2array(data)));

let i;
let j;
let k;
const countryObjList = [];

function value(inputValue) {
  const trial = [];
  const fileHeader = header(inputValue);

  // console.log(inputValue);
  for (i = 1; i < fileHeader.length; i += 1) {
    // console.log(fileHeader[i]);
    const valueString = inputValue[i];
    const yaadee = valueString.split(',');
    trial.push(yaadee);

    const countryObj = {};

    for (j = 0; j < yaadee.length; j += 1) {
      countryObj[fileHeader[j]] = yaadee[j];
    }
    countryObjList.push(countryObj);
  }
}


const continentList = ['Asia', 'Africa', 'Europe', 'North America', 'South America'];

const continentData = {};
for (k = 0; k < continentList.length; k += 1) {
  continentData[continentList[k]] = { POPULATION_2012: 0, GDP_2012: 0 };
}
value(csv2array(data));

console.log(continentData);

const continent = new Map([['Argentina', 'South America'],
  ['Australia', 'Asia'],
  ['Brazil', 'South America'],
  ['Canada', 'North America'],
  ['China', 'Asia'],
  ['France', 'Europe'],
  ['Germany', 'Europe'],
  ['India', 'Asia'],
  ['Indonesia', 'Asia'],
  ['Italy', 'Europe'],
  ['Japan', 'Asia'],
  ['Mexico', 'North America'],
  ['Russia', 'Asia'],
  ['Saudi Arabia', 'Asia'],
  ['South Africa', 'Africa'],
  ['Republic of Korea', 'Asia'],
  ['Turkey', 'Europe'],
  ['United Kingdom', 'Europe'],
  ['USA', 'North America']]);

// console.log(continent.get('Argentina'));


countryObjList.forEach((c) => {
  if (continent.has(c['Country Name']) && c['Country Name'] !== ' ') {
    console.log(c);
    const lala = continent.get(c['Country Name']);
    continentData[lala].POPULATION_2012 += parseFloat(c['Population (Millions) - 2012']);
    continentData[lala].GDP_2012 += parseFloat(c['GDP Billions (US Dollar) - 2012']);
  }
});
console.log(continentData);
