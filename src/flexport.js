import XLSX from 'xlsx/xlsx';

//var columns = [];
//var data = [];
let filename = 'flexport.xlsx';
let sheetname = 'FlightLog';

exportExcel = function (columns, data) {
    let createXLSLFormatObj = [];
    let newXlsHeader = [];
    if (columns.length === 0){
        console.log("Add columns!");
        return;
    }
    if (data.length === 0){
        console.log("Add data!");
        return;
    }
    forEach(columns, function(index, value) {
        newXlsHeader.push(value.label);
    });
    createXLSLFormatObj.push(newXlsHeader);
    forEach(data, function(index, value) {
        let innerRowData = [];
        forEach(columns, function(index, val) {
            if (val.dataFormat && typeof val.dataFormat === 'function')
            {
                innerRowData.push(val.dataFormat(value[val.field]));
            }
            else
            {
                innerRowData.push(value[val.field]);
            }
        });
        createXLSLFormatObj.push(innerRowData);
    });
    let wb = XLSX.utils.book_new(),
    ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, filename);
}

