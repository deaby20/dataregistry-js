const fs = require('fs');
const readline = require('readline');

const CSV_FILE_PATH = 'hours.csv';

let timeEntries = [];

function clockIn(userId) {
    const timestamp = new Date();
    timeEntries.push({ userId, timestamp, action: 'Clock In' });
    console.log('Clocked in at', timestamp.toLocaleString());
}

function clockOut(userId) {
    const timestamp = new Date();
    timeEntries.push({ userId, timestamp, action: 'Clock Out' });
    console.log('Clocked out at', timestamp.toLocaleString());
}
//calculator
function calculateTotalHours(userId) {
    const userEntries = timeEntries.filter(entry => entry.userId === userId);
    let totalHours = 0;
    for (let i = 0; i < userEntries.length; i += 2) {
        const clockInTime = userEntries[i].timestamp.getTime();
        const clockOutTime = userEntries[i + 1].timestamp.getTime();
        const hoursWorked = (clockOutTime - clockInTime) / (1000 * 60 * 60);
        totalHours += hoursWorked;
    }
    return totalHours.toFixed(2);
}

//export data
function exportToCSV() {
    try {
        const header = 'User ID, Timestamp, Action\n';
        let csvContent = header;
        timeEntries.forEach(entry => {
            const row = `${entry.userId},${entry.timestamp},${entry.action}\n`;
            csvContent += row;
        });
        fs.writeFileSync(CSV_FILE_PATH, csvContent);
        console.log(`Data exported to ${CSV_FILE_PATH}`);
    } catch (error) {
        console.error('Error exporting data to CSV:', error);
    }
}

//cmd
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function displayMenu() {
    console.log('\n1. Clock In');
    console.log('2. Clock Out');
    console.log('3. View Total Hours Worked');
    console.log('4. Export Data to CSV');
    console.log('5. Exit');
}

// Main
function main() {
    displayMenu();
    rl.question('\nEnter your choice: ', choice => {
        switch (choice) {
            case '1':
                rl.question('Enter User ID: ', userId => {
                    clockIn(userId);
                    main();
                });
                break;
            case '2':
                rl.question('Enter User ID: ', userId => {
                    clockOut(userId);
                    main();
                });
                break;
            case '3':
                rl.question('Enter User ID: ', userId => {
                    console.log('Total Hours Worked:', calculateTotalHours(userId));
                    main();
                });
                break;
            case '4':
                exportToCSV();
                main();
                break;
            case '5':
                console.log('Exiting...');
                rl.close();
                break;
            default:
                console.log('Invalid choice');
                main();
                break;
        }
    });
}

// start
main();
