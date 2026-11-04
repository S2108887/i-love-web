const REGEX_XML = /^<div .*"resultaatcontainer">(.*)<\/div>$/s
const REGEX_VERVANGLOCATIE = /\{\}/dg

const xmlSerializer = new XMLSerializer()

const formulier = document.querySelector(".alineamaker")
const knoppen = formulier.querySelector(".knoppen")

const kopieerknop = knoppen.children[2]


kopieerknop.addEventListener("click", kopieerActie)

const nieuweLinkKnop = knoppen.children[0]
nieuweLinkKnop.addEventListener("click", nieuweLinkActie)

const TYPE_TEKST = 0;
const TYPE_LINK = 1;

function kopieerActie(event) {
    //Schakel de formulier-submit-actie uit.
    event.preventDefault()

    const container = document.querySelector("#resultaatcontainer")

    //Maak de container leeg.
    container.textContent = null

    const alineasInfo = verzamelAlineaInformatie()
    console.log(JSON.stringify(alineasInfo, null, 4))

    plaatsAlineasViaInfo(container, alineasInfo)

    const xmlMetNamespace = xmlSerializer.serializeToString(container)

    //xmlMetNamespace begint met `<div xmlns="http://www.w3.org/1999/xhtml" id="resultaatcontainer">`
    //en eindigt met `</div>`. Gebruik een regex om wat ertussen zit te verkrijgen.
    const regexResultaat = REGEX_XML.exec(xmlMetNamespace)

    const xml = regexResultaat ? regexResultaat[1] : ""

    navigator.clipboard.writeText(xml)

}

function verzamelAlineaInformatie() {

    return Array
        .from(formulier.querySelectorAll(".alineas"))
        .map(maakAlineablokInformatie)
        .flatMap(blok => blok.alineas)
}

function maakAlineablokInformatie(alineablok) {
    let vervangLocaties = []

    let alineas = alineablok
        .querySelector("textarea")
        .value
        .split("\n\n")
        .map(tekst => maakAlineaInfo(tekst, vervangLocaties))

    vulVervanglocaties(alineablok, vervangLocaties)

    return { alineas: alineas }
}

function vulVervanglocaties(alineablok, vervangLocaties) {
    let sibling = alineablok.nextElementSibling;
    let index = 0;

    while (sibling && index < vervangLocaties.length) {
        if (sibling.classList.contains("linkblok")) {
            const invoer = Array
                .from(sibling.querySelectorAll("input"))
                .map(input => input.value)

            const item = vervangLocaties[index];
            item.tekst = invoer[0]
            item.href = invoer[1]
            item.type = TYPE_LINK;
        }
        else {
            break;
        }

        index++;
        sibling = sibling.nextElementSibling;
    }
}

function maakAlineaInfo(tekst, vervangLocaties) {
    const items = []

    let positie = 0

    for (const match of tekst.matchAll(REGEX_VERVANGLOCATIE)) {
        const begin = match.indices[0][0]
        const eind = match.indices[0][1]

        if (positie < begin) {
            items.push(tekstItem(tekst.substring(positie, begin)))
        }

        let vervangLocatie = {}
        vervangLocaties.push(vervangLocatie)
        items.push(vervangLocatie)

        positie = eind
    }

    if (positie < tekst.length) {
        items.push(tekstItem(tekst.substring(positie)))
    }

    return { items: items }
}

function tekstItem(tekst) {
    return { type: TYPE_TEKST, tekst: tekst }
}

function plaatsAlineasViaInfo(container, alineasInfo) {
    alineasInfo.forEach(alinea => plaatsAlinea(container, alinea))
}

function plaatsAlinea(container, alinea) {
    const p = document.createElement("p")

    for( const item of alinea.items) {
        if (item.type === TYPE_TEKST) {
            p.appendChild(document.createTextNode(item.tekst))
        }
        else if (item.type === TYPE_LINK) {
            const link = document.createElement("a")
            link.setAttribute("href", item.href)
            link.append(item.tekst)
            p.appendChild(link)
        }
    }

    container.appendChild(p)

}

function nieuweLinkActie(event) {
    //Schakel de formulier-submit-actie uit.
    event.preventDefault()

    const linkBlok = document.createElement("div")
    linkBlok.classList.add("linkblok")

    const blokTekst = document.createElement("div")
    blokTekst.append("Link")
    linkBlok.appendChild(blokTekst)

    const invoerBlok = document.createElement("div")
    invoerBlok.appendChild(maakTekstInvoer("Tekst"))
    invoerBlok.appendChild(maakTekstInvoer("href"))
    linkBlok.appendChild(invoerBlok)

    knoppen.insertAdjacentElement("beforebegin", linkBlok)
}

function maakTekstInvoer(labeltekst) {
    const label = document.createElement("label")

    const span = document.createElement("span")
    span.append(labeltekst)
    label.appendChild(span)

    const invoer = document.createElement("input")
    invoer.setAttribute("type", "text")
    label.appendChild(invoer)

    return label;

}