
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
const timerBtn = document.querySelector('.btn-start');

const daysLable = document.querySelector('.value[data-days]');
const hoursLable = document.querySelector('.value[data-hours]');
const minutesLable = document.querySelector('.value[data-minutes]');
const secondsLable = document.querySelector('.value[data-seconds]');

let selectedDate = null;
let nowDate = null;

let calculatedTime = convertMs(selectedDate - nowDate);
let interval = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    clearInterval(interval);
    nowDate = Date.now();
    selectedDate = selectedDates[0].getTime();
    if (selectedDate < nowDate) {
      iziToast.show({
        backgroundColor: 'red',
        title: 'Please choose a date in the future',
        position: 'topRight',
      });
      timerBtn.disabled = true;
    } else {
      timerBtn.disabled = false;

    }
  },
};

flatpickr('input#datetime-picker', options);

function convertMs(ms) {

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

timerBtn.addEventListener('click', e => {
  clearInterval(interval);
  e.target.disabled = true;
  calculatedTime = convertMs(selectedDate - nowDate);
  daysLable.textContent = addLeadingZero(`${calculatedTime.days}`);
  hoursLable.textContent = addLeadingZero(`${calculatedTime.hours}`);
  minutesLable.textContent = addLeadingZero(`${calculatedTime.minutes}`);
  secondsLable.textContent = addLeadingZero(`${calculatedTime.seconds}`);
  interval = setInterval(() => {
    nowDate = new Date();
    if (nowDate < selectedDate) {
      calculatedTime = convertMs(selectedDate - nowDate);

      daysLable.textContent = addLeadingZero(`${calculatedTime.days}`);
      hoursLable.textContent = addLeadingZero(`${calculatedTime.hours}`);
      minutesLable.textContent = addLeadingZero(`${calculatedTime.minutes}`);
      secondsLable.textContent = addLeadingZero(`${calculatedTime.seconds}`);
    } else {
      clearInterval(interval);
    }
  }, 1000);
});

function addLeadingZero(value) {
  return `${value}`.padStart(2, [0]);
}