/**
 * The function fetches data from our library API:
 * the URL is hard-coded.
 *
 * Your duty is to handle the data, in then branch
 * 1. first, parse json. Parsing json is async operation.
 * 2. get the data from the previous then branch,
 * and convert it to be of a right format.
 * This file contains the right function.
 *
 * Next, you have to check force.js:
 * constrct a sociogram by initializing it.
 * Then update it with the found publications and
 * a brand new sociogram. Done.
 *
 *
 * @param {*} q the search term that is passed to library API
 * @returns search result visualized as a sociogram, where root is
 * the search term
 */
async function constructSociogram(q) {
  const url = `https://tie-lukioplus.rd.tuni.fi/cais/api/publ?q=${q}`;
  return fetch(url)
    /*TODO*/
    .catch(err => console.log(err));
}

/**
 * clean function gets a text and replaces
 * special entities as their UTF-8 conterparts.
 * @param {string} text
 * @returns more readable "clean" text
 */
function clean(text) {
  rules = [/{'{a}}/g, /{'{e}}/g, /{'{o}}/g, /{\"{e}}/g, /{\"{a}}/g, /{\"{o}}/g, /{-}/g, /{/g, /}/g, /&apos;/g, /&amp;/g];
  const chars = ['á', 'é', 'ó', 'ë', 'ä', 'ö', '-', '', '', '\'', '&'];
  rules.forEach((rule, ind) => text = text.replace(rule, chars[ind]));
  return text.endsWith(".") ? text.slice(0, -1) : text;
}

/**
 * For some unknown reasons it seemed that force graph remembered old nodes.
 * The removal seemed to help for this.
 * Consider this function as not that desirable work-around.
 */
function rmSVG() {
  const body = document.querySelector("body")
  const svg_elems = body.querySelectorAll("svg");
  svg_elems.forEach(e => body.removeChild(e));
}


/**
 * Function constructs a data object that is understood by
 * the force graph
 * @param {*} name
 * @param {*} pid
 * @param {*} titles
 * @param {*} tmpChildren
 * @returns
 */
function dataObj(name, pid = null, titles = [], tmpChildren = []) {
  const children = tmpChildren ? tmpChildren.filter(child => child != null) : [];
  const res = ((!children) || children.length < 1 || children == null || children == [null]) ?
    { name: name, pid: pid, titles: titles, size: `${1000 * titles.length + 500}` } :
    { name: name, pid: pid, titles: titles, size: `${1000 * children.length + 1000 * titles.length + 500}`, children: children };
  return res;
}

/**
 * Gets children as string array, constructs object array as a return
 * @param {*} children array
 * @returns Object array
 */
function getAsObjArr(children) {
  return (children == null) ? [] : children.map(child => new Object({ name: child, size: 500 }));
}

/**
 * A helper function for removeDuplicates,
 * returns item and in which indices the item if found in the array a
 * @param {*} a initial array
 * @returns object where items are unique array items and values the index array
 * where each item is found, if found once, the array size is one
 */
function getDuplicates(a) {
  return a.reduce(function (obj, b, ind) {
    (obj[b] = obj[b] || []).push(ind);
    return obj;
  }, {});
}

/**
 * If an author has many articles, the function merges
 * them under one author, having many titles and potential children (=co-authors)
 * @param {*} publications
 * @returns merged publications
 */
function removeDuplicates(publications) {
  const tmpNames = publications.map(p => p.name);
  const duplicates = getDuplicates(tmpNames);
  const names = [...new Set(tmpNames)];
  // no duplicates - return publications
  const res = (names.length == tmpNames.length) ? publications
    : names.map(name => {
      duplArr = duplicates[name];
      const tmpTitles = duplArr.map(ind => publications[ind].titles).flat()
      const pid = duplArr.map(ind => publications[ind].pid).filter(p => p)[0];
      const finalTitles = [...new Set(tmpTitles)];
      const tmpChildren = duplArr.map(ind => publications[ind].children).flat().filter(a => a);
      const tmpNames = tmpChildren.map(o => o.name);
      const finalChildren = getAsObjArr([...new Set(tmpNames)]);
      return dataObj(name, pid, finalTitles, finalChildren);
    });
  return res;
}

/**
 * A function to be called in fetch once data is solved
 * @param {*} data is the raw JSON data that is got from the library API endpoint
 * @returns publications in a JSON format ("graph") that is understood by the force graph
 * in order to construct the sociogram.
 */
function publJSON(data) {
  let publications = data.map(d => {
    if (!Object.keys(d).includes("authors")) return;
    const authors = Array.isArray(d.authors.author) ? d.authors.author : [];
    const author = authors.length ? authors[0] : undefined;
    if (!author) return undefined;
    const title = clean(d.title);
    const children = authors.splice(1).map(a => clean(a.text));
    return dataObj(clean(author.text), author["@pid"], [title], getAsObjArr(children));
  });
  // to remove undefined
  publications = publications.filter(p => p);
  const root = document.querySelector("#q").value;
  return dataObj(root, null, [], removeDuplicates(publications));
}
