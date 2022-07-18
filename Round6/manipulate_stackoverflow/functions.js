/**
 * Build yearly technology stats
 *
 * @param {object} techStats StackOverfow stats
 * @returns {object} Year by year stats of technologies mentioned in StackOverflow
 */
 function buildYearlyTechStats (techStats) {
  const result = {}

  for(const [year,group] of Object.entries(techStats)){
      for(const item of Object.entries(group)){
          if(item[0] === "currentTech"){
              result[year] = item[1]
          }
      }

  }
  return result
}

/**
* Update table contents
*
* @param {HTMLTableElement} table DOM element for the table
* @param {object} yearlyTechStats Year by year stats of technologies mentioned in StackOverflow
* @param {Array<string>} selectedTechs Technologies selected
* @param {number} firstYear First year of data selected
* @param {number} lastYear Last year of data selected
*/
function updateTable (table, yearlyTechStats, selectedTechs, firstYear, lastYear) {

  const years = ["Technology", firstYear]
  for(let i = firstYear+1; i <= lastYear; i++){
      years.push(i)
  }

  const rowData = buildRowData(yearlyTechStats,selectedTechs,firstYear,lastYear)
  const tableRows = constructTableRowsHtml(rowData)
  const tableHead = constructTableHeadHtml(years)

  table.innerHTML = tableHead+tableRows

}

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

  const result = [];
  let found = false;
  for(const lang of selectedTechs){
      let row = [];
      row.push(lang)
      for(const [year,item] of Object.entries(yearlyTechStats)){

          if(year >= firstYear && year <= lastYear) {
              for(const e of Object.entries(item)){
                  if(String(e[0]) === lang){
                      row.push(e[1])
                      found = true
                  }
              }
              if(!found){row.push(0)}
          }
          found = false
      }
      result.push(row)
  }

  return result;
}

/**
* Get HTML of table rows
*
* @param {Array<string|number>} rowData
* @returns {string} HTML of the table rows
*/
function constructTableRowsHtml (rowData) {
  
  let row = ""

  for(let e of rowData){
      row = row+"<tr>"
      for(let i of e){
          row = row+"<td>"+i+"</td>"
      }
       row = row+"</tr>"
  }

  return row
}

/**
* Get HTML of table heading row
*
* @param {Array<string|number>} headings Table headings
* @returns {string} HTML of the heading row
*/
function constructTableHeadHtml (headings) {
  let row = "<tr>"
  for(let e of headings){
          row = row+"<th>"+String(e)+"</th>"
      }

  row = row+"</tr>"

  return row
}

