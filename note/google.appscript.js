function fetchDataFromAPI() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const url = 'https://allergyjom.shop/api/v1/query?offset=0&limit=10000';

    const response = UrlFetchApp.fetch(url);
    const parsed = JSON.parse(response.getContentText());

    const dataArray = parsed?.rows || [];

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        Logger.log('No data received or data is not an array.');
        return;
    }

    const headers = Object.keys(dataArray[0]);
    const data = dataArray.map(obj => headers.map(header => obj[header]));

    // Clear existing data
    sheet.clear();

    // Write headers
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Write data
    sheet.getRange(2, 1, data.length, headers.length).setValues(data);
}

fetchDataFromAPI();