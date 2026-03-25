import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const sbmBtn = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

sbmBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const timeLeft = selectedDate - Date.now();

    if (timeLeft <= 0) {
      userSelectedDate = null;
      sbmBtn.disabled = true;
      iziToast.show({
        message: 'Please choose a date in the future',
        color: 'red',
        position: 'topRight',
      });
    } else {
      userSelectedDate = selectedDate;
      sbmBtn.disabled = false;
    }
  },
};

flatpickr(input, options);

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
  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

sbmBtn.addEventListener('click', () => {
  if (timerId !== null) return;

  input.disabled = true;
  sbmBtn.disabled = true;

  const timeLeft = userSelectedDate - Date.now();
  updateTimerDisplay(convertMs(timeLeft));

  timerId = setInterval(() => {
    const remainingTime = userSelectedDate - Date.now();

    if (remainingTime <= 0) {
      clearInterval(timerId);
      timerId = null;

      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      input.disabled = false;
      return;
    }

    updateTimerDisplay(convertMs(remainingTime));
  }, 1000);
});