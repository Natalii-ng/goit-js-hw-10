import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import './css/styles.css';
import { fetchCountries } from '../src/Countries';

const DEBOUNCE_DELAY = 300;
const TIME_OUT = 5000;

const ref = {
  inputField: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

ref.inputField.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
  const valueInput = e.target.value.trim();

  if (valueInput.length === 0) {
    Notiflix.Notify.warning('Remember the countries you studied at school!', {
      timeout: TIME_OUT,
    });
    return;
  } else if (valueInput.length === 1) {
    Notiflix.Notify.info('Too few letters, write more :)', {
      timeout: TIME_OUT,
    });

    ref.countryList.innerHTML = '';
    ref.countryInfo.innerHTML = '';
    ref.inputField.removeEventListener('input', e);

    return;
  }

  fetchCountries(valueInput)
    .then(chooseCountry)
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name', {
        timeout: TIME_OUT,
      });
      ref.countryList.innerHTML = '';
      ref.countryInfo.innerHTML = '';
    });
}

function chooseCountry(countries) {
  const findCountriesNumber = countries.length;

  const findCountriesGrid = countries
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li class="country"><img src="${svg}" alt="Flag of ${official}" />
      <h1>${official}</h1></li>`
    )
    .join('');
  ref.countryList.innerHTML = findCountriesGrid;

  if (findCountriesNumber === 1) {
    const bigRenderCountry = document.querySelector('.country');
    bigRenderCountry.classList.add('big');

    const findCountryInfo = countries
      .map(
        ({ capital, population, languages }) =>
          `<p><img width="18px" src="https://cdn-icons-png.flaticon.com/128/2072/2072130.png"/><b>Capital: </b>${capital}</p>
         <p><img width="18px" src="https://cdn-icons-png.flaticon.com/512/4596/4596328.png"/><b>Population: </b>${population}</p>
         <p><img width="18px" src="https://cdn-icons-png.flaticon.com/512/7955/7955519.png"/><b>Languages: </b>${Object.values(
           languages
         )}</p>`
      )
      .join('');
    ref.countryInfo.innerHTML = findCountryInfo;
    return;
  }

  if (findCountriesNumber > 10) {
    Notiflix.Notify.warning(
      'Too many matches found. Please enter a more specific name.',
      {
        timeout: timeOut,
      }
    );
  }

  ref.countryInfo.innerHTML = '';
}