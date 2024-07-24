import { curry } from 'ramda';


export default class Api {
  constructor(params = {}) {
    const { errorCountdown = 7, ebableErrors = true } = params;

    this.whiteListHost = ['api.tech', 'animals.tech'];
    this.errorCountdown = errorCountdown;
    this.ebableErrors = ebableErrors;
  }

  numbersBaseController = ({ from, to, number }) => {
    return { result: parseInt(number, from).toString(to) };
  }

  animalController = (id) => {
    const animals = ['cat', 'dog', 'bird', 'fish']

    return { result: animals[id] || 'zebra' };
  }

  get = curry((url, params) => {
    this.errorCountdown = this.errorCountdown - 1;

    if (this.ebableErrors && this.errorCountdown === 0) {
      this.errorCountdown = 7;

      return Promise.reject('Network error');
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const urlInstance = new URL(url);
        const host = urlInstance.host;
        const pathname = urlInstance.pathname;

        const paramsFromUrl = Object.fromEntries(new URLSearchParams(urlInstance.search));

        const query = {
          ...paramsFromUrl,
          ...params,
        };

        if (!this.whiteListHost.some(allowedHost => allowedHost === host)) {
          reject('Доступны только хосты "api.tech" и "animals.tech"');
        }

        switch (host) {
          case 'api.tech':
            if (pathname === '/numbers/base') {
              const { from, to, number } = params;

              if (!from || !to || !number) {
                reject('Не указаны все необходимые параметры from, to, number');
              }

              resolve(this.numbersBaseController(query));
            } else {
              reject('Неправильный путь в origin api.tech, убедись что /numbers/base прописан верно');
            }

            break;
          case 'animals.tech':
            const animalId = Number(pathname.slice(1))

            if (Number.isNaN(animalId)) {
              reject('Не получается распарсить id животного');
            }

            resolve(this.animalController(animalId));
            break;
          default:
        }

        reject('Something went wrong');
      }, 2000);
    });
  });
}
