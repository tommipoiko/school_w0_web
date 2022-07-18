/**
 * Build row data to be shown in a table
 *
 * @param {object} yearlyTechStats Year by year stats of technologies mentioned in StackOverflow
 * @param {Array<string>} selectedTechs Technologies selected
 * @param {number} firstYear First year of data selected
 * @param {number} lastYear Last year of data selected
 * @returns {Array<string|number>}
 */
function buildRowData (yearlyTechStats, selectedTechs, firstYear, lastYear) {
  let table = [];
  for (let y in yearlyTechStats) {
    if (y >= firstYear && y <= lastYear) {
      let year = yearlyTechStats.y;
      for (let tech in year) {
        if (selectedTechs.includes(tech)) {
          if (table.length < 1) {
            let row = [tech, year[tech]];
            table.push(row);
          } else {
            let found = false;
            for (let row of table) {
              if (row[0] == tech) {
                row.push(year[tech]);
                found = true;
              }
            }
            if (found == false) {
              let row = [tech];
              for (let i = 0; i < y-firstYear; i++) {
                row.push(0);
              }
              row.push(year[tech]);
              table.push(row);
            }
          }
        }
      }
    }
  }
  return table;
}

/**
 * Get HTML of table rows
 *
 * @param {Array<string|number>} rowData
 * @returns {string} HTML of the table rows
 */
function constructTableRowsHtml (rowData) {
  for (let row of rowData) {
    //
  }
}

/**
 * Get HTML of table heading row
 *
 * @param {Array<string|number>} headings Table headings
 * @returns {string} HTML of the heading row
 */
function constructTableHeadHtml (headings) {
  // TODO: Write your code here
}
