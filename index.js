const db = require('./database');
const excel = require('./excel');

const client_id = 1240;
const output_path = './output/output.xlsx';
const queries = [
  {
    title: 'Domestic Standard Rates',
    locale: 'domestic',
    shippingSpeed: 'standard',
    columns: [{header:'Start Weight', key:'start_weight'}, {header:'End Weight', key:'end_weight'}, {header:'Zone 1', key:'1'}, {header:'Zone 2', key:'2'}, {header:'Zone 3', key:'3'}, {header:'Zone 4', key:'4'}, {header:'Zone 5', key:'5'}, {header:'Zone 6', key:'6'}, {header:'Zone 7', key:'7'}, {header:'Zone 8', key:'8'}],
  },
  {
    title: 'Domestic Expedited Rates',
    locale: 'domestic',
    shippingSpeed: 'expedited',
    columns: [{header:'Start Weight', key:'start_weight'}, {header:'End Weight', key:'end_weight'}, {header:'Zone 1', key:'1'}, {header:'Zone 2', key:'2'}, {header:'Zone 3', key:'3'}, {header:'Zone 4', key:'4'}, {header:'Zone 5', key:'5'}, {header:'Zone 6', key:'6'}, {header:'Zone 7', key:'7'}, {header:'Zone 8', key:'8'}],
  },
  {
    title: 'Domestic Next Day Rates',
    locale: 'domestic',
    shippingSpeed: 'nextDay',
    columns: [{header:'Start Weight', key:'start_weight'}, {header:'End Weight', key:'end_weight'}, {header:'Zone 1', key:'1'}, {header:'Zone 2', key:'2'}, {header:'Zone 3', key:'3'}, {header:'Zone 4', key:'4'}, {header:'Zone 5', key:'5'}, {header:'Zone 6', key:'6'}, {header:'Zone 7', key:'7'}, {header:'Zone 8', key:'8'}],
  },
  {
    title: 'International Economy Rates',
    locale: 'international',
    shippingSpeed: 'intlEconomy',
    columns: [{header:'Start Weight', key:'start_weight'}, {header:'End Weight', key:'end_weight'}, {header:'Zone A', key:'A'}, {header:'Zone B', key:'B'}, {header:'Zone C', key:'C'}, {header:'Zone D', key:'D'}, {header:'Zone E', key:'E'}, {header:'Zone F', key:'F'}, {header:'Zone G', key:'G'}, {header:'Zone H', key:'H'}, {header:'Zone I', key:'I'}, {header:'Zone J', key:'J'}, {header:'Zone K', key:'K'}, {header:'Zone L', key:'L'}, {header:'Zone M', key:'M'}, {header:'Zone N', key:'N'}, {header:'Zone O', key:'O'}],
  },
  {
    title: 'International Expedited Rates',
    locale: 'international',
    shippingSpeed: 'intlExpedited',
    columns: [{header:'Start Weight', key:'start_weight'}, {header:'End Weight', key:'end_weight'}, {header:'Zone A', key:'A'}, {header:'Zone B', key:'B'}, {header:'Zone C', key:'C'}, {header:'Zone D', key:'D'}, {header:'Zone E', key:'E'}, {header:'Zone F', key:'F'}, {header:'Zone G', key:'G'}, {header:'Zone H', key:'H'}, {header:'Zone I', key:'I'}, {header:'Zone J', key:'J'}, {header:'Zone K', key:'K'}, {header:'Zone L', key:'L'}, {header:'Zone M', key:'M'}, {header:'Zone N', key:'N'}, {header:'Zone O', key:'O'}],
  }
];

(async () => {
  db.connect();
  const workbook = excel.createWorkbook()
  
  for (const query of queries) {
    const data = await db.query(
      `SELECT start_weight, end_weight, zone, rate
      FROM rates WHERE client_id=? AND locale=? AND shipping_speed=?
      ORDER BY start_weight ASC, zone ASC`,
      [client_id, query.locale, query.shippingSpeed]
    );
    const filtered_data = data.reduce((accum, d) => {
      if (!accum[d.start_weight]) {
        accum[d.start_weight] = {
          'start_weight': d.start_weight,
          'end_weight': d.end_weight
        };
      }
      accum[d.start_weight][d.zone] = d.rate;
      return accum;
    }, {});
    await excel.writeWorksheet(workbook, query.title, query.columns, Object.values(filtered_data))
  };
  
  await excel.writeWorkbook(workbook, output_path);
  await db.end();
})();