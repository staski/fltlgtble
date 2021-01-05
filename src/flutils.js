import Sheets from 'xlsx/xlsx';

function showDate (timer){
    var date = new Date(timer * 1000)
    var day  = date.getDate ()
    day = (day >= 10 ? day : "0" + day)
    var month = date.getMonth () + 1
    month = (month >= 10 ? month : "0" + month)
    var year = date.getFullYear ()
    return day + "." + month + "." + year
}

function  showTime (timer){
            var date = new Date(timer * 1000)
            var hours = date.getUTCHours()
            hours = (hours >= 10 ? hours : "0" + hours)
            var minutes = date.getUTCMinutes ()
            var seconds = date.getUTCSeconds ()
            minutes = seconds < 30 ? minutes : minutes + 1
            minutes = (minutes >= 10 ? minutes : "0" + minutes)

            return hours + ":" + minutes
    }

let filename = 'FlightLog.xlsx';
let sheetname = 'FlightLog';

function exportExcel(columns, data) {
    let dataTableArray = [];
    let dataTableColumnsArray = [];

    if (columns.length === 0){
        console.log("Empty Columns");
        return;
    }
    if (data.length === 0){
        console.log("No Data");
        return;
    }
    columns.forEach(function(value, index) {
        dataTableColumnsArray.push(value.label);
    });
    dataTableArray.push(dataTableColumnsArray);
    data.forEach(function(value, i) {
        let innerRowData = [];
        columns.forEach(function(val, j) {
            var fieldValue

            if (val.field === 'row')
            {
                fieldValue = value
            } else
            {
                fieldValue = value[val.field]
            }

            if (val.dataFormat && typeof val.dataFormat === 'function')
            {
                
                innerRowData.push(val.dataFormat(fieldValue));
            }
            else
            {
                innerRowData.push(fieldValue);
            }
        });
        dataTableArray.push(innerRowData);
    });
    let workBook = Sheets.utils.book_new();
    let workSheet = Sheets.utils.aoa_to_sheet(dataTableArray);
    Sheets.utils.book_append_sheet(workBook, workSheet, sheetname);
    Sheets.writeFile(workBook, filename);
}

export default { showDate, showTime, exportExcel }
