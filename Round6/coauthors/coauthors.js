function constructTableRowsHtml (rowData) {
  let row = ""
  for(let e of rowData){
      row = row+"<tr>"
      for(let i of e){
          row = row+"<td> "+i+" </td>"
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
          row = row+"<th> "+e+" </th>"
      }
  row = row+"</tr>"
  return row
}

/**
* Get publications classified by year
*
* @param {*} publicationsData Original publications JSON data
* @returns {object} Publications by year, each publication containing title, year, and authors
*/
const getPublications = publicationsData => {
  const result = {}
  for(const obj of publicationsData){
      if(obj.authors === undefined){

      }else{
          let elem = {
          "title": obj.title,
          "authors": obj.authors,
          "year": obj.year
      }
      if(result[obj.year] === undefined){
          result[obj.year] = []
      }
      result[obj.year].push(elem)
      }
  }
  return result
};

/**
* Get sorted list of unique years from publications
*
* @param {object} publications
* @returns {Array<number>} unique years sorted in ascending order
*/
const getYears = publications => {
  let years1 = Object.keys(publications)
  let years = []
  for(let i = 0; i < years1.length; i++){
      years[i] = parseInt(years1[i])
  }
  years.sort((a,b) =>{
      if(a > b){
          return 1
      }else if (a < b){
          return -1
      }else{
          return 0
      }
  });
  return years
};

/**
* Fill options list of select with years
*
* @param {Array} years
*/
const fillOptionList = years => {
  let HTML = ""
  for(let year of years){
      HTML = HTML + '<option value='+year+'>'+year+'</option>'
  }
  HTML = HTML+'<option value="all">All</option>'
  document.getElementById("select-year").innerHTML = HTML
};

/**
* Construct publication row data suitable for constructTableRowsHtml()
*
* @param {object} publications publications classified by year
* @param {Array<number>} years years which should be included in the data
* @returns {Array} rowData
*/
const constructPublicationRowData = (publications, years) => {
  const result = [];
  let i = 0;
  if(years == null){
      for(const year of Object.entries(publications)){
          for(const pub of year[1]){
              let row = [];
              row.push(year[0])
              row.push(pub.title)
              if(Array.isArray(pub.authors.author)){
                      let coauthors = []
                      let idx = 0;
                      for(const author of Object.entries(pub.authors.author)){
                          if(idx === 0){
                              row.push(author[1].text)
                              idx++;
                          }else{
                              coauthors.push(author[1].text)
                          }
                      }
                      row.push(coauthors)
                  }else{
                      row.push(pub.authors.author.text)
                      row.push("")
                  }
              result.push(row)
          }
          i++;
      }
  }else{
      for(const year of Object.entries(publications)){
          if(years.includes(Number(year[0]))){
              for(const pub of year[1]){
                  let row = [];
                  row.push(year[0])
                  row.push(pub.title)
                  if(Array.isArray(pub.authors.author)){
                      let coauthors = []
                      let idx = 0;
                      for(const author of Object.entries(pub.authors.author)){
                          if(idx === 0){
                              row.push(author[1].text)
                              idx++;
                          }else{
                              coauthors.push(author[1].text)
                          }
                      }
                      row.push(coauthors)
                  }else{
                      row.push(pub.authors.author.text)
                      row.push("")
                  }
                  result.push(row)
              }
          }
          i++;
      }
  }
  return result;
};

/**
* Construct HTML for publications table based on selected year or all
* publications if year is not given
*
* @param {object} publications publications classified by year
* @param {number|null} year The selected year
* @returns {string} table HTML
*/
const constructPublicationsTableHtml = (publications, year = null) => {
  if(year != null){
      let years = [year]
      const rowdata = constructPublicationRowData(publications, years)
      const tableRow = constructTableRowsHtml (rowdata)
      const tableHead = constructTableHeadHtml(["Year", "Title", "The 1st author", "Co-authors"])
      document.getElementById("table").innerHTML = tableHead+tableRow
  }else{
      const rowdata = constructPublicationRowData(publications, null)
      const tableRow = constructTableRowsHtml (rowdata)
      const tableHead = constructTableHeadHtml(["Year", "Title", "The 1st author", "Co-authors"])
      document.getElementById("table").innerHTML = tableHead+tableRow
  }
};

/**
* Initialize the application
* (load all needed data, update DOM, attach event handlers)
*
* - get publications
* - get years
* - fill select options
* - set table to show publications from the first year in the list
* - on form submit update table based on the selection
*/
const init = () => {
  const publications = getPublications(publicationsData)
  const years = getYears(publications)
  fillOptionList(years)
  let table = document.createElement("table")
  table.setAttribute("id","table")
  document.getElementById("container").appendChild(table)
  constructPublicationsTableHtml(publications, 2009)
  const form = document.getElementById('form')
  const elem = document.getElementById('select-year')
  form.addEventListener('submit', e =>{
      e.preventDefault()
      if(elem.value === "all"){
          constructPublicationsTableHtml(publications, null)
      }else{
          constructPublicationsTableHtml(publications, Number(elem.value))
      }
  });
};
