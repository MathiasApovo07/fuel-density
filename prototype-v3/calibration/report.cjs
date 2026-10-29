const fs=require('fs'),path=require('path'),crypto=require('crypto');const p=__dirname;const data=JSON.parse(fs.readFileSync(path.join(p,'density60-validation.json')));const engine=fs.readFileSync(path.join(p,'../engine.js'));if(crypto.createHash('sha256').update(engine).digest('hex')!==data.engineSHA256)throw Error('Engine changed during experiments');
const report=`FUEL DENSITY V3 - Calibration de la densite 60 - 29 octobre 2026

Perimetre : essais uniquement. Aucun changement des probabilites dans le jeu.
20 arbres + 40 buissons, suppression minimale, temperature 70 F, precipitation 80 jours.
Portee conservee : buisson 1 case, arbre 2 cases, diagonales incluses. Depart aleatoire unique, tentatives par chaque voisin en combustion.
Methode : moteur v3 charge en memoire avec remplacement controle de la seule fonction de probabilites. Population verifiee a chaque essai. 10 points exploratoires x 1000 essais puis 5 configurations x 5000 essais avec graines distinctes de l'exploration. Les meme graines de validation sont utilisees entre configurations. Resultats en pourcentages moyens, et non promesse par partie.

Probabilite arbre | Probabilite buisson | Arbres brules moyens | Buissons brules moyens
${data.rows.map(r=>[100*r.treeIgnition,100*r.shrubIgnition,r.treeMean,r.shrubMean].join(' | ')).join('\n')}

Conclusion : aucun reglage explore ne satisfait simultanement arbres <10% et buissons >80% en moyenne. A 4%/100%, arbres 9.21%, buissons 64.03%. A 4.5%/100%, arbres 10.30%, buissons 64.80%. Diminuer l'inflammation des buissons a 95% ou 90% reduit encore leur taux brule. Ces essais ne constituent pas une preuve mathematique d'impossibilite pour toute combinaison.
Les intervalles approximatifs a 95% sur les moyennes et la proportion des parties satisfaisant les deux seuils sont dans density60-validation.json. A 4%/100% : demi-largeurs 0.24 et 0.84 points ; 7.86% des parties satisfont les deux seuils stricts.
Les moyennes sont une convention d'analyse provisoire : Ileah n'a pas encore confirme moyenne versus chaque essai.
Decision : ne pas presenter la calibration comme validee, ne pas injecter 4%/100% dans le jeu, ne pas modifier la portee, la disposition ou les effectifs sans accord. La calibration temperature/pluie reste en attente.
Prochaine discussion : demander a Ileah si elle souhaite essayer une densite de depart plus elevee ou une autre composition, en conservant les portees et les seuils comme demande.
Verification : hash du moteur identique avant/apres ; 10 tests de regression passes. Aucun fichier hors prototype-v3 modifie par cette etape.
`;fs.writeFileSync(path.join(p,'Rapport-calibration.txt'),report);console.log('Report saved. Engine SHA256 unchanged: '+data.engineSHA256);
