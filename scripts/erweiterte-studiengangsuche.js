/*

Generate input file:

curl https://www.hochschulkompass.de/studium/studiengangsuche/erweiterte-studiengangsuche.html
  | tidy -q -asxml --numeric-entities yes
  | sed -e 's/xmlns=".*"//g'
  | xmllint --xpath '//div[@class="col sachgebiet-filter"]' -
  | xmllint --format -
  > systematik.xml

*/

var xpath = require('xpath')
var dom = require('xmldom').DOMParser
var fs = require('fs')

var xml = fs.readFileSync('systematik.xml', 'utf8')

var doc = new dom().parseFromString(xml)
var nodes = xpath.select('//li', doc)
var topConcepts = []
var childConcepts = []

nodes.forEach(node => {
  var [ prefix, id, level, parent ] = node.getAttribute('class').split('-')
  var label = node.getElementsByTagName('label')[0].textContent.replace(/\r?\n|\r/, ' ')
  parent == 0
    ? topConcepts.push({id, parent, label})
    : childConcepts.push({id, parent, label})
})

console.log(`
@base <http://w3id.org/class/hochschulkompass/> .
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
@prefix dct: <http://purl.org/dc/terms/> .

<scheme#> a skos:ConceptScheme ;
  dct:title "Klassifikation des Hochschulkompass" ;
  skos:hasTopConcept ${topConcepts.map(concept => '<' + concept.id + '#>').join(', ')} .
`)

topConcepts.forEach(concept => console.log(`
<${concept.id}#> a skos:Concept ;
  skos:prefLabel "${concept.label}"@de ;
  ${
    childConcepts.some(child => child.parent === concept.id) &&
    'skos:narrower ' + childConcepts.filter(child => child.parent === concept.id).map(child => '<' + child.id + '#>').join(', ') + ';'
    || ''
  }
  skos:topConceptOf <scheme#> .
`))

childConcepts.forEach(concept => console.log(`
<${concept.id}#> a skos:Concept ;
  skos:prefLabel "${concept.label}"@de ;
  ${
    childConcepts.some(child => child.parent === concept.id) &&
    'skos:narrower ' + childConcepts.filter(child => child.parent === concept.id).map(child => '<' + child.id + '#>').join(', ') + ';'
    || ''
  }
  skos:broader <${concept.parent}#> ;
  skos:inScheme <scheme#> .
`))
