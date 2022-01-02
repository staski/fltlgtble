import Sheets from 'xlsx/xlsx';
import XLSX from 'xlsx/xlsx';

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

// objects of type Date will converted to "Date"-cells automatically
function spreadsheetTime(timer){
    // hack offset for UTC output in Excel!
    var date = new Date(timer * 1000)
    var offset = (date.getHours() - date.getUTCHours()) * 3600 
    return new Date((timer - offset)*1000)
}

// objects of type Number will converted to "Number"-cells automatically
function spreadsheetNumber(num){
    return Number(num)
}

let filename = 'FlightLog.xlsx';
let sheetname = 'FlightLog';

function exportExcel(columns, data) {
    let dataTableArray = [];
    let dataTableColumnsArray = [];
    let columnFormat = [];

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
        if (value.dataFormat)
        {
            columnFormat.push(value.dataFormat)
        }
        else 
        {
            columnFormat.push("")
        }
    });

    dataTableArray.push(dataTableColumnsArray);
    data.forEach(function(value, i) {
        let innerRowData = [];
        columns.forEach(function(val, j) {
            var fieldValue

            // here goes the content of the cell.
            // first case "sub": the cell is determined by a subcobject of the actual tablerow object
            // second case "field == row": the actual value is a function of the complete row
            // third case "normal": the content is either the actual field value or a function thereof
            if (val.sub){
                fieldValue = value[val.sub][val.field]
            } 
            else if (val.field === 'row')
            {
                fieldValue = value
            } else
            {
                fieldValue = value[val.field]
            }

            // determine whether the field value or a function therof goes into the cell's content
            if (val.dataCalc && typeof val.dataCalc === 'function')
            {
                
                innerRowData.push(val.dataCalc(fieldValue));
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

    // once the worksheet is available we can store the format of the individual cells
    columnFormat.forEach(function(val, i){
        if (val !== ""){       
            dataTableArray.forEach(function(row, num){
                if (num >= 1){                
                    const address = XLSX.utils.encode_cell({c: i, r: num})
                    const cell = workSheet[address]
                    delete cell.w
                    cell.z = val
                    XLSX.utils.format_cell(cell)
                }
            })
        }
    })
    Sheets.utils.book_append_sheet(workBook, workSheet, sheetname);
    Sheets.writeFile(workBook, filename);
}

export default { showDate, showTime, spreadsheetTime, spreadsheetNumber, exportExcel }
