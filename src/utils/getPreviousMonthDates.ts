export function getPreviousMonthDates(currentDate: Date = new Date()): {
    firstDate: Date;
    lastDate: Date;
} {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDayOfPreviousMonth = new Date(currentYear, currentMonth - 1, 1);

    const lastDayOfPreviousMonth = new Date(currentYear, currentMonth, 0);

    lastDayOfPreviousMonth.setHours(23, 59, 59, 999);

    return {
        firstDate: firstDayOfPreviousMonth,
        lastDate: lastDayOfPreviousMonth,
    };
}
