document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const monthYearEl = document.getElementById('month-year');

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Set header to current month and year
    monthYearEl.textContent = today.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Get the number of days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Generate calendar days
    for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('day');
        dayEl.textContent = i;
        dayEl.dataset.day = i;
        calendarEl.appendChild(dayEl);
    }

    // Add click event listener to the calendar
    calendarEl.addEventListener('click', function(event) {
        if (event.target.classList.contains('day')) {
            event.target.classList.toggle('completed');
        }
    });
});
