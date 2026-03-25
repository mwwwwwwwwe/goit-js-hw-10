import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', e => {

  e.preventDefault();
  const data = new FormData(form);
  const delay = Number(data.get('delay'));
  const state = data.get('state');

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);

  });

  promise
    .then(delay =>
      iziToast.show({

        message: `✅ Fulfilled promise in ${delay}ms`,

        color: '#59a10d',
        position: 'topRight',
      })
    )
    .catch(delay =>
      iziToast.show({

        message: `❌ Rejected promise in ${delay}ms`,

        color: '#ef4040',
        position: 'topRight',
      })
    )
    
    .finally(() => {
      form.reset();
    });
});