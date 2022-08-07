'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const curLocation = document.querySelector('.pop');


//UI COMPONENT
const renderUI = function (result, className = '') {
  const html = `
       <article class='country ${className}'>
          <img class="country__img" src="${result.flags.svg}" />
          <div class="country__data">
            <h3 class="country__name">${result.name}</h3>
            <h4 class="country__region">${result.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +result.population / 1000000
            ).toFixed(1)}m</p>
            <p class="country__row"><span>🗣️</span>${
              result.languages[0].name
            }</p>
            <p class="country__row"><span>💰</span>${
              result.currencies[0].code
            }</p>
          </div>
        </article>
    `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentHTML('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  //geolocation
  const myLocation = await getPosition();
  // console.log(myLocation);
  const { latitude: lat, longitude: lng } = myLocation.coords;

  //reverse my location to a place
  const reverseGeo = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  );
  const reverseGeoData = await reverseGeo.json();
  // console.log(reverseGeoData);

  //get country data from api
  const country = reverseGeoData.countryName;
  // console.log(country);
  const result = await fetch(`https://restcountries.com/v2/name/${country}`);
  //   console.log(result);
  const response = await result.json();
  //   console.log(response);
  const [countryDat] = response;
  // console.log(countryDat);
  curLocation.innerText = `you are in ${reverseGeoData.principalSubdivision}, ${reverseGeoData.countryName} and Capital is ${countryDat.capital}`;

  // render to UI
  renderUI(countryDat);

  //render neighbouring company
  const [neigbhour] = countryDat?.borders;

  const neigbhourCountry = await fetch(
    `https://restcountries.com/v2/alpha/${neigbhour}`
  );
  const neigbhourDat = await neigbhourCountry.json();
  renderUI(neigbhourDat, 'neigbhour');
  // console.log(neigbhourDat);

  //render neighbouring company
  const [neigbhour1] = neigbhourDat?.borders;
  const neigbhourCountry1 = await fetch(
    `https://restcountries.com/v2/alpha/${neigbhour1}`
  );
  const neigbhourDat1 = await neigbhourCountry1.json();
  renderUI(neigbhourDat1, 'neigbhour');
  // console.log(neigbhourDat1);
};

btn.addEventListener('click', function () {
  whereAmI().catch(err => new Throw(err));
});


// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=37.42159&longitude=-122.0837&localityLanguage=en
// https://www.bigdatacloud.com/docs/api/free-reverse-geocode-to-city-api