// La carte affichée sur la page Facebook d'Au Bagel Gourmand (septembre). Prix en cents.
// « coco » = œuf. Ne rien ajouter qui n'est pas sur leur carte.

export const BAGEL_CHOICE = { key: 'bagel', label: 'Ton bagel préféré', ticket: 'BAGEL AU CHOIX', price: 175 }

const VIANDES_CLASSIQUE = { key: 'viande', label: 'Ton choix', options: ['Jambon', 'Bacon', 'Saucisses italiennes', 'Creton'] }
const VIANDES_REPENTIGNY = { key: 'viande', label: 'Ton choix', options: ['Jambon', 'Saucisse', 'Bacon'] }
const VINAIGRETTE = { key: 'vinaigrette', label: 'La vinaigrette', options: ['Crémeuse à la framboise et pavots', 'Balsamique et sirop d’érable'] }
const ACCOMP = { key: 'accomp', label: 'À côté', options: ['Salade', 'Salade de pâtes'] }
const SUISSE = { key: 'suisse', label: 'Avec fromage suisse', ticket: 'FROMAGE SUISSE', price: 175 }

export const MENU = [
  {
    id: 'dejeuners',
    title: 'Déjeuners',
    note: 'Avec une portion de fruits frais et le café à volonté.',
    incl: 'FRUITS FRAIS · CAFÉ À VOLONTÉ',
    items: [
      { id: 'enfant', name: 'Menu enfant', price: 1050, desc: 'Bagel, fruits frais, fromage à la crème et petit jus.' },
      { id: 'ptit', name: 'Le P’tit Déjeuner', price: 1350, desc: 'Bagel grillé et fromage à la crème au choix.' },
      { id: 'fruite', name: 'Le Fruité', price: 1650, desc: 'Bagel grillé, fromage à la crème au choix et double portion de fruits.' },
      { id: 'classique', name: 'Le Classique', price: 1700, desc: 'Bagel grillé, 2 « cocos » et 1 choix : jambon, bacon, saucisses italiennes ou creton.', choices: [VIANDES_CLASSIQUE] },
      { id: 'coupe', name: 'La Coupe fruitée', price: 1800, desc: 'Yogourt vanille, céréales, morceaux de chocolat et coulis de miel.', noBagel: true },
      { id: 'blt', name: 'Le BLT', price: 1750, desc: 'Bagel grillé, tomates, laitue, bacon. Avec un « coco » : +1,75 $.', extras: [{ key: 'coco', label: 'Avec un « coco »', ticket: 'UN « COCO »', price: 175 }] },
    ],
  },
  {
    id: 'benedictines',
    title: 'Les bénédictines',
    note: 'Sauce hollandaise maison. Avec fromage suisse : +1,75 $.',
    items: [
      { id: 'bene-jambon', name: 'Jambon', price: 1800, desc: 'Bagel grillé, un « coco » et jambon.', extras: [SUISSE] },
      { id: 'florentine', name: 'La Florentine', price: 1800, desc: 'Bagel grillé, un « coco » et épinards.', extras: [SUISSE] },
      { id: 'bene-bacon', name: 'Bacon croustillant', price: 1950, desc: '', extras: [SUISSE] },
      { id: 'suedois', name: 'Le Suédois', price: 2000, desc: 'Bagel grillé, « coco » et saumon fumé.', extras: [SUISSE] },
    ],
  },
  {
    id: 'gratines',
    title: 'Les gratinés',
    note: 'Gratinés au fromage suisse.',
    items: [
      { id: 'repentigny', name: 'Le Repentigny', price: 1800, desc: 'Bagel grillé, un « coco », jambon, saucisse ou bacon et fromage suisse.', choices: [VIANDES_REPENTIGNY] },
      { id: 'gourmand', name: 'Le Gourmand', price: 2050, desc: 'Bagel grillé, un « coco », 3 viandes (jambon, saucisses, bacon), fromage suisse et creton maison.' },
    ],
  },
  {
    id: 'salades',
    title: 'Salades',
    note: 'Avec le potage du jour et le café à volonté. Vinaigrettes : crémeuse à la framboise et pavots, ou balsamique et sirop d’érable.',
    incl: 'POTAGE DU JOUR · CAFÉ À VOLONTÉ',
    noBagel: true,
    items: [
      { id: 'sal-thon', name: 'Thon et pommes vertes', price: 1800, desc: '', choices: [VINAIGRETTE] },
      { id: 'sal-jardin', name: 'Du jardin avec « coco » dur', price: 1800, desc: '', choices: [VINAIGRETTE] },
      { id: 'sal-jambon', name: 'Jambon et fromage suisse', price: 1800, desc: '', choices: [VINAIGRETTE] },
      { id: 'sal-saumon', name: 'Saumon fumé', price: 2000, desc: '', choices: [VINAIGRETTE] },
    ],
  },
  {
    id: 'diners',
    title: 'Dîners',
    note: 'Avec le potage du jour, une salade ou une salade de pâtes, et le café à volonté.',
    incl: 'POTAGE DU JOUR · CAFÉ À VOLONTÉ',
    items: [
      { id: 'brie', name: 'Brie et Pommes', price: 1950, desc: 'Jambon, pommes vertes, brie fondant, noix de Grenoble caramélisées.' },
      { id: 'sicilien', name: 'Le Sicilien', price: 1900, desc: 'Saucisses italiennes douces, légumes grillés, mozzarella.' },
      { id: 'jambon-fromage', name: 'Jambon fromage', price: 1800, desc: 'Jambon, poivrons et fromage suisse.' },
      { id: 'bruschetta', name: 'La Bruschetta', price: 1850, desc: 'Tomates, olives noires, oignons rouges, pesto basilic et fromage mozzarella.' },
      { id: 'pizza', name: 'La Pizza', price: 1850, desc: 'Sauce à la viande maison, pepperoni, mozzarella et poivrons.' },
      { id: 'saumon', name: 'Le Saumon fumé', price: 2100, desc: 'Oignons rouges, câpres et fromage à la crème.' },
      { id: 'truite', name: 'Mousse de truite fumée', price: 1750, desc: 'Bagel grillé, tartinade maison à la truite fumée.' },
      { id: 'vege', name: 'Le Végé', price: 1850, desc: 'Courgettes, oignons rouges, brocoli, tomates séchées, pesto basilic, réduit balsamique, gratiné au fromage suisse.' },
      { id: 'club', name: 'Le Club', price: 1800, desc: 'Poitrine de poulet, bacon croustillant, laitue et tomates.' },
      { id: 'asperges', name: 'Jambon-Asperges', price: 1800, desc: 'Fromage suisse et sauce hollandaise maison.' },
      { id: 'thon-pommes', name: 'Thon et Pommes', price: 1800, desc: 'Salade de thon froide, poivrons, pommes vertes et fromage suisse.' },
      { id: 'thai', name: 'Le Thaïlandais', price: 1950, desc: 'Poitrine de poulet, poireaux, carottes, sauce thaï, ananas et sésames grillés.' },
      { id: 'bagel-salade', name: 'Bagel et Salade', price: 1600, desc: 'Bagel grillé, fromage à la crème au choix, façon dîner.' },
    ].map((i) => ({ ...i, choices: [ACCOMP] })),
  },
]

export const money = (cents) => (cents / 100).toFixed(2).replace('.', ',') + ' $'
export const ticketMoney = (cents) => (cents / 100).toFixed(2).replace('.', ',')

export const findDish = (id) => {
  for (const cat of MENU) {
    const item = cat.items.find((i) => i.id === id)
    if (item) return { cat, item }
  }
  return { cat: MENU[0], item: MENU[0].items[0] }
}

export const extrasFor = (cat, item) => [...(item.extras || []), ...(cat.noBagel || item.noBagel ? [] : [BAGEL_CHOICE])]
