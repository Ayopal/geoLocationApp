'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

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

/*
//CALL BACK HELL 💥💢💢💥💥💥💥
const getCountry = function (country) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://restcountries.com/v2/name/${country}`);
  xhr.send();
  xhr.addEventListener('load', function () {
    const [result] = JSON.parse(xhr.responseText);
    console.log(result);
    renderUI(result, 'country')

        // GET neigbhouring COUNTRY
        const [,neigbour] = result?.borders;
        console.log(neigbour);
          const xhr2 = new XMLHttpRequest();
          xhr2.open('GET', `https://restcountries.com/v2/alpha/${neigbour}`);
          xhr2.send();
          xhr2.addEventListener(
            'load', function(){
                const result2 = JSON.parse(xhr2.responseText)
                console.log(result2);
          renderUI(result2, 'neighbour');


          //get neigbour of neighbour
          const [,neigbhour3] = result2?.borders;
                console.log(neigbhour3);
          const xhr3 = new XMLHttpRequest()
          xhr3.open('GET', `https://restcountries.com/v2/alpha/${neigbhour3}`);
          xhr3.send();

          xhr3.addEventListener('load', function(){
            const result3 = JSON.parse(xhr3.responseText);
            console.log(result3);
             renderUI(result3, 'country')
          })
            })
          })
  };

getCountry('usa');
// getCountry('usa');
*/

//Fetch function + .then
/*
function getCountry(country){
fetch(`https://restcountries.com/v2/name/${country}`)
  .then(result => {
    if (!result.ok) {
      throw new Error(`Country not found ${result.status}`);
    }
    return result.json();
  })
  .then(response => {
    // console.log(response);
    renderUI(response[0])
    const neigbhour = response[0].borders?.[0];
    // console.log(neigbhour);
    //country 2
    return fetch(`https://restcountries.com/v2/alpha/${neigbhour}`)
  })
    .then(result1 => {
      if (!result1.ok) {
        throw new Error(`neigbhour not found ${result1.status}`);
      }
      return result1.json()
    })
    .then(response1 => {
      console.log(response1);
      renderUI(response1, 'neigbhour');

      const [neigbhour1] = response1?.borders
      console.log(neigbhour1);
   return  fetch(`https://restcountries.com/v2/alpha/${neigbhour1}`)
    })
    .then(result2 => result2.json())
    .then(response2 => {
          renderUI(response2, 'neigbhour');
    })
    .catch(err => renderError(`Something went wrong ${err}`))
    .finally(() => {
          countriesContainer.style.opacity = 1;
    });
}

*/

//REFACTORING

const getJSON = function (url, errMsg = 'Something went wrong') {
  return fetch(url).then(result => {
    if (!result.ok) {
      throw new Error(`${errMsg} ${result.status}`);
    }
    return result.json();
  });
};

//Fetch function + .then

function getCountry(country) {
  getJSON(`https://restcountries.com/v2/name/${country}`)
    .then(response => {
      renderUI(response[0]);
      console.log(response[0]);
      const neigbhour = response[0].borders?.[0];

      //country 2
      return getJSON(
        `https://restcountries.com/v2/alpha/${neigbhour}`,
        'No neigbhour found'
      );
    })
    .then(response => {
      renderUI(response, 'neigbhour');
      const [neigbhour1] = response?.borders;

      //country 3
      return getJSON(
        `https://restcountries.com/v2/alpha/${neigbhour1}`,
        'No neigbhour found'
      );
    })
    .then(response => {
      renderUI(response, 'neigbhour');
    })
    .catch(err => renderError(`${err}`))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
}

// btn.addEventListener('click', function () {
//   const country = prompt(
//     'input a country name of your choice to see the neigbhour'
// );
//   getCountry(country);
// });

//Async Awaits
// async function getCountry(country){
// const result = await fetch(`https://restcountries.com/v2/name/${country}`);
// const response = await result.json()
// console.log(response);
// renderUI(response[0], 'country')
// console.log('fetch 1 success');

// //neigbhour 1
// const [neigbhour] = response[0].borders;
// console.log(neigbhour);
// const result1 = await fetch(`https://restcountries.com/v2/alpha/${neigbhour}`)
// const response1 =  await result1.json();
// console.log(response1);
// renderUI(response1, 'neigbhour');
// console.log('fetch 2 success');

// //neigbhour 2
// const [neigbhour2] = response1?.borders;
// console.log(neigbhour2);
// const result2 = await fetch(`https://restcountries.com/v2/alpha/${neigbhour2}`)
// const response2 = await result2.json();
// console.log(response2);
// renderUI(response2, 'neigbhour');
// console.log('fetch 3 success');
// }

//CHALLENGE
/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/
const whereAmI = function (lat, lng) {
  //   fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
  fetch(
    `https://geocode.xyz/${lat},${lng}?geoit=json&auth=841038720532362559934x84450`
  )
    .then(result => {
      if (!result.ok) {
        throw new Error('You are making too much request at a time');
      }
      return result.json();
    })
    .then(response => {
      // console.log(response);
      alert(`you are in ${response.city}, ${response.country}`);
      getCountry(response.country);
    })
    .catch(err => renderError(err));
};

btn.addEventListener('click', function () {
getPosition()
  .then(res => whereAmI(res.coords.latitude, res.coords.longitude))
  .catch(err => new Throw(err));
});

//Simple promise
// const lotteryPromise = new Promise(function(resolve, reject) {
//   if(Math.random() >= 0.5) {
//     resolve('YOU WIN ')
//   }
//   else {
//     reject('YOU LOST YOUR MONEY')
//   }
// })

// lotteryPromise.then(res => console.log(res)).catch(err => console.error(err))

// navigator.geolocation.getCurrentPosition(
//   position => console.log(position),
//   err => console.error(err)
// );

const getPosition = function(){
 return new Promise(function(resolve, reject){
  navigator.geolocation.getCurrentPosition(resolve, reject);
 })
}

// getPosition().then(res => console.log(res)).catch(err =>new Throw (err))

//Challenge throw

const wait = function(seconds) {
  return new Promise(function(resolve, reject){
    setTimeout(resolve, seconds=1000)
  })
};

const imgContainer = document.querySelector('.images');

const createImage = function(imgPath){
  return new Promise(function(resolve, reject) {
  let newImage = document.createElement('img');
  newImage.src = imgPath

  newImage.addEventListener('load', function(){
    imgContainer.append(newImage);
    resolve(newImage);
  });

  newImage.addEventListener('error', function(){
    reject(new Error('Image not found'))
  });
});
}

let currentImg;
createImage('img/img-1.jpg')
  .then(img => {
    currentImg = img;
    console.log('image-1 loaded');
    return wait(1);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('image-2 loaded');
    return wait(1);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-1.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('image-3 loaded');
    return wait(1);
  })
  .catch(err => {
    console.error(err);
  });







