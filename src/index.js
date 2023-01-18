import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchInput: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info')
}

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  
  const countryName = evt.target.value.trim();
  
  clearMarkup();

    if (!countryName) {
        return
    }

    fetchCountries(countryName)
        .then(data => {
            if (data.length > 10) {
                specificNameInfo();
                return;
            }
            // createMarkup(data);
            let markup = '';
            let refsMarkup = '';

            if (data.length === 1) {
                markup = createMarkupItem(data);
                refsMarkup = refs.countryInfo;
            } else {
                markup = createMarkupList(data); 
                refsMarkup = refs.countryList;
            }

            drawMarkup(refsMarkup,markup);
        })
        .catch(error => {
            errorInfo();
        });
}

// function createMarkup(data) {
//     let markup = '';
//     let refsMarkup = '';

//     if (data.length === 1) {
//         markup = createMarkupItem(data);
//         refsMarkup = refs.countryInfo;
//     } else {
//         markup = createMarkupList(data); 
//         refsMarkup = refs.countryList;
//     }

//     drawMarkup(refsMarkup,markup);
// }

function createMarkupItem(element) {
    return element.map(
    ({ name, capital, population, flags, languages }) =>
      `
      <img
        src="${flags.svg}" 
        alt="${name.official}" 
        width="120" 
        height="80">
      <h1 class="country-info__title">${name.official}</h1>
      <ul class="country-info__list">
          <li class="country-info__item">
          <span>Capital:</span>
        ${capital}
          </li>
          <li class="country-info__item">
          <span>Population:</span>
          ${population}
          </li>
          <li class="country-info__item">
          <span>Lenguages:</span>
          ${Object.values(languages)}
          </li>
      </ul>
  `
  );
    
}

function createMarkupList(elements) {

    return elements
    .map(
      ({ name, flags }) => `
      <li class="country-list__item">
        <img class="country-list__img" 
          src="${flags.svg}" 
          alt="${name.official}" 
          width="60" 
          height="40">
        ${name.official}
      </li>`
    )
    .join('');
    
}

function specificNameInfo() {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}

function errorInfo() {
  Notiflix.Notify.failure(`Oops, there is no country with that name`);
}

function clearMarkup() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
}

function drawMarkup(refsMarkup,markup) {
     refsMarkup.innerHTML = markup;
}