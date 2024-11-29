document$.subscribe(() => {
  const HOUR_MS = 3600000;
  const MINUTE_MS = 60000;
  const SECOND_MS = 1000;

  function formatTime(time) {
    return time.toString().padStart(2, '0');
  }

  function getNextEvenHour(now) {
    const target = new Date(now);
    target.setHours(now.getHours() + (now.getHours() % 2 ? 1 : 2), 0, 0, 0);
    return target;
  }

  function updateCountdown() {
    const now = new Date();
    const target = getNextEvenHour(now);
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
