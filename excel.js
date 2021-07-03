const ExcelJS = require('exceljs');

const createWorkbook = () => {
  return new ExcelJS.Workbook();
};

const writeWorksheet = (workbook, title, columns, data) => {
  const worksheet = workbook.addWorksheet(title);
  worksheet.columns = columns;
  worksheet.addRows(data);
}

const writeWorkbook = async (workbook, filename) => {
  await workbook.xlsx.writeFile(filename);
}

exports.createWorkbook = createWorkbook;
exports.writeWorksheet = writeWorksheet;
exports.writeWorkbook = writeWorkbook;