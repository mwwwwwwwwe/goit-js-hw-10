import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateInput = document.querySelector('#datetime-picker');
const timerBtn = document.querySelector('[data-start]');

const daysLable = document.querySelector('[data-days]');
const hoursLable = document.querySelector('[data-hours]');
const minutesLable = document.querySelector('[data-minutes]');
const secondsLable = document.querySelector('[data-seconds]');

let selectedDate = null;
let interval = null;

timerBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    clearInterval(interval);
    const nowDate = Date.now();
    selectedDate = selectedDates[0].getTime();

    if (selectedDate <= nowDate) {
      iziToast.show({
        message: 'Please choose a date in the future',
        color: 'red',
        position: 'topRight',
      });
      timerBtn.disabled = true;
      selectedDate = null;
    } else {
      timerBtn.disabled = false;
    }
  },
};

flatpickr(dateInput, options);

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

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysLable.textContent = addLeadingZero(days);
  hoursLable.textContent = addLeadingZero(hours);
  minutesLable.textContent = addLeadingZero(minutes);
  secondsLable.textContent = addLeadingZero(seconds);
}

timerBtn.addEventListener('click', () => {
  if (!selectedDate) return;

  clearInterval(interval);

  timerBtn.disabled = true;
  dateInput.disabled = true;

  const startTime = Date.now();
  const timeLeft = selectedDate - startTime;

  updateTimerDisplay(convertMs(timeLeft));

  interval = setInterval(() => {
    const nowDate = Date.now();
    const remainingTime = selectedDate - nowDate;

    if (remainingTime > 0) {
      const calculatedTime = convertMs(remainingTime);
      updateTimerDisplay(calculatedTime);
    } else {

      clearInterval(interval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      dateInput.disabled = false;
    }
  }, 1000);
});