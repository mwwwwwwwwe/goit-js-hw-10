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
sbmBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const timeLeft = selectedDates[0] - Date.now();
    if (timeLeft <= 0) {
      sbmBtn.disabled = true;
      iziToast.show({
        message: 'Please choose a date in the future',
        color: 'red',
        position: 'topRight',
      });
    } else {
      userSelectedDate = selectedDates[0];
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

function updateTimerDisplay(value) {
  daysValue.textContent = addLeadingZero(value.days);
  hoursValue.textContent = addLeadingZero(value.hours);
  minutesValue.textContent = addLeadingZero(value.minutes);
  secondsValue.textContent = addLeadingZero(value.seconds);
}

function resetTimerDisplay() {
  daysValue.textContent = addLeadingZero(0);
  hoursValue.textContent = addLeadingZero(0);
  minutesValue.textContent = addLeadingZero(0);
  secondsValue.textContent = addLeadingZero(0);
}

sbmBtn.addEventListener('click', () => {
  const intervalId = setInterval(() => {
    const timeLeft = userSelectedDate - Date.now();
    const result = convertMs(timeLeft);
    if (timeLeft <= 0) {
      resetTimerDisplay();
      clearInterval(intervalId);
      input.disabled = false;
      iziToast.show({
        message: 'The timer finished',
        color: 'yellow',
        position: 'topRight',
      });
      return;
    }
    updateTimerDisplay(result);
  }, 1000);
  input.disabled = true;
  sbmBtn.disabled = true;
  iziToast.show({
    message: 'The timer activated',
    color: 'green',
    position: 'topRight',
  });
});
