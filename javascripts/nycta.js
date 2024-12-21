document$.subscribe(() => {
  const HOUR_MS = 3600000;
  const MINUTE_MS = 60000;
  const SECOND_MS = 1000;
  const RESTART_HOURS = [10, 14, 18, 22, 2, 6];

  function formatTime(time) {
    return time.toString().padStart(2, '0');
  }

  function getNextRestartTime(now) {
    const target = new Date(now);
    const currentHour = now.getHours();
    const nextRestartHour = RESTART_HOURS.find(hour => hour > currentHour) || RESTART_HOURS[0];
    
    if (nextRestartHour <= currentHour) {
      target.setDate(target.getDate() + 1);
    }
    
    target.setHours(nextRestartHour, 0, 0, 0);
    return target;
  }

  function updateCountdown() {
    const now = new Date();
    const target = getNextRestartTime(now);
    const timeDiff = target - now;

    const hours = Math.floor(timeDiff / HOUR_MS);
    const minutes = Math.floor((timeDiff % HOUR_MS) / MINUTE_MS);
    const seconds = Math.floor((timeDiff % MINUTE_MS) / SECOND_MS);

    const formattedTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;

    document.getElementById('nycta-reboot-timer').textContent = `🔄 Next reboot in: ${formattedTime}`;

    setTimeout(updateCountdown, SECOND_MS);
  }

  function getCurrentWeekOfMonth(date = new Date()) {
    const clonedDate = new Date(date.getTime());
    const firstDayOfMonth = new Date(clonedDate.getFullYear(), clonedDate.getMonth(), 1);
    const daysDifference = Math.floor((clonedDate - firstDayOfMonth) / (24 * 60 * 60 * 1000));
    return Math.floor(daysDifference / 7) + 1;
  }

  function getEventCycle(now) {
    const cycles = [
      { week: 1, description: "🌲 Impact Crater is filled with redwoods forest." },
      { week: 2, description: "🔥 The forest has some fire in the middle and a lava pond in crater's water." },
      { week: 3, description: "🌋 Crater is desolate of any forest while the lava pond still remains." },
      { week: 4, description: "🌱 Crater is filled with some redwoods trees in a sign of the forest recovering." },
      { week: 5, description: "⏳ Soon, a new cycle will begin." }
    ];

    const currentWeek = getCurrentWeekOfMonth(now);
    const currentCycle = cycles.find(cycle => currentWeek <= cycle.week) || cycles[cycles.length - 1];
    return {
      cycleNumber: currentCycle.week,
      description: currentCycle.description,
    };
  }

  function displayEventCycle() {
    const { description, cycleNumber } = getEventCycle(new Date());

    document.getElementById('nycta-map-cycle').innerHTML = `
      ${description}
    `;
  }

  updateCountdown();
  displayEventCycle();
  setInterval(displayEventCycle, MINUTE_MS);
});
