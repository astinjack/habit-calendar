const datesContainer = document.getElementById("dates");
const monthYear = document.getElementById("monthYear");
const tasksDiv = document.getElementById("tasks");
const taskDate = document.getElementById("taskDate");
const taskItems = document.querySelectorAll('.task-item');

const today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
const currentDate = today.getDate();
let selectedDay = null;

function renderCalendar() {
  datesContainer.innerHTML = "";
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  monthYear.innerText = new Date(year, month).toLocaleString("default", { month: "long" }) + " " + year;

  for (let i = 0; i < firstDay; i++) datesContainer.appendChild(document.createElement("div"));
  for (let d = 1; d <= lastDate; d++) {
    const day = document.createElement("div");
    day.innerText = d;
    updateDayColor(day, d);
    day.addEventListener("click", () => {
      const dateObj = new Date(year, month, d);
      if (selectedDay === day) { day.classList.remove("selected"); tasksDiv.style.display = "none"; selectedDay = null; return; }
      document.querySelectorAll(".dates div").forEach(el => el.classList.remove("selected"));
      day.classList.add("selected"); selectedDay = day;
      taskDate.innerText = "Tasks for " + d + " " + monthYear.innerText;
      tasksDiv.style.display = "block";

      const saved = JSON.parse(localStorage.getItem(`tasks-${year}-${month}-${d}`)) || [false, false, false, false];
      taskItems.forEach((item, i) => {
        const checkbox = item.querySelector('input');
        checkbox.checked = saved[i];
        if (dateObj > today) { item.classList.add('disabled'); checkbox.disabled = true; }
        else { item.classList.remove('disabled'); checkbox.disabled = false; }
        item.classList.toggle('checked', saved[i]);
        item.onclick = () => {
          if (checkbox.disabled) return;
          checkbox.checked = !checkbox.checked;
          saved[i] = checkbox.checked;
          item.classList.toggle('checked', checkbox.checked);
          localStorage.setItem(`tasks-${year}-${month}-${d}`, JSON.stringify(saved));
          updateDayColor(day, d);
        };
      });
    });
    datesContainer.appendChild(day);
  }
}

function updateDayColor(dayElem, d) {
  dayElem.classList.remove("red", "blue", "green", "future", "today");
  const dateObj = new Date(year, month, d);
  const isToday = (year === today.getFullYear() && month === today.getMonth() && d === currentDate);
  const saved = JSON.parse(localStorage.getItem(`tasks-${year}-${month}-${d}`)) || [false, false, false, false];
  const checkedCount = saved.filter(Boolean).length;
  if (isToday) { dayElem.classList.add("today"); if (checkedCount === saved.length) dayElem.classList.add("green"); else if (checkedCount > 0) dayElem.classList.add("blue"); }
  else if (dateObj > today) dayElem.classList.add("future");
  else { if (checkedCount === 0) dayElem.classList.add("red"); else if (checkedCount === saved.length) dayElem.classList.add("green"); else dayElem.classList.add("blue"); }
}

document.getElementById("prev").onclick = () => { month--; if (month < 0) { month = 11; year--; } selectedDay = null; tasksDiv.style.display = "none"; renderCalendar(); };
document.getElementById("next").onclick = () => { const maxMonth = today.getMonth() + 4; if (year === today.getFullYear() && month >= maxMonth) return; month++; if (month > 11) { month = 0; year++; } selectedDay = null; tasksDiv.style.display = "none"; renderCalendar(); };
renderCalendar();

// Service Worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(()=>console.log('Service Worker Registered'))
    .catch(err=>console.log(err));
}

// Ask for notification permission
if ('Notification' in window) {
  Notification.requestPermission().then(p => console.log("Notification permission:", p));
}

// Local 11 PM notifications
function scheduleNotifications() {
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 23 && now.getMinutes() === 0) {
      const today = new Date();
      const saved = JSON.parse(localStorage.getItem(`tasks-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`)) || [false,false,false,false];
      if (saved.filter(Boolean).length < saved.length && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification('Habit Calendar', { body: 'You have incomplete tasks today!', icon: 'icon.png' });
        });
      }
    }
  }, 60000);
}
scheduleNotifications();
