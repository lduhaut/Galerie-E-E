var sheetId = "1j7imS2KLKND8ir36mxBSDpdMtzWRuwwNV2pY2JWREBg";

var lignePremierItem = 4;

var idxCol = 0;
var IDX_COL_TITRE = idxCol++;
var IDX_COL_LIEN = idxCol++;
var IDX_COL_ETAT = idxCol++;
// Index de la colonne représentant le premier icone
var IDX_COL_FIRST_ICON = idxCol++;

var infosGenerales_;

function doGet(request) {
  var template = HtmlService.createTemplateFromFile('Portail');
  // Chargement de la donnée de façon asynchrone ? cf https://developers.google.com/apps-script/guides/html/best-practices
    
  return template.evaluate()
    .setFaviconUrl(getInfosGenerales().favicon)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');;
}

function getData() {
  
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Data");
  
  var infos = getInfosGenerales();
  
  // icons["nomIcone"] = "http://....png";
  var icons = getIcons();
  var nbIcons = 0;
  
  var res = {};
  
  res.iconeAppli = infos.icone;
  
  res.icons = [];
  res.iconsLinks = [];
  for (var iconName in icons) {
    res.icons.push(iconName);
    res.iconsLinks.push(icons[iconName]);
    nbIcons++;
  }
  
  var datas = sheet.getRange(lignePremierItem, 1, sheet.getLastRow() + 1 - lignePremierItem, IDX_COL_FIRST_ICON + nbIcons).getValues();
  
  res.titre = infos.titre;
  
  var datasJs = [];
  
  for (var i = 0; i < datas.length; i++) {
    var dataJs = {};
    
    var ligne = datas[i];
    
    var etat = ligne[IDX_COL_ETAT];
    dataJs.etat = etat;
    dataJs.bgColor = getBgColorEtat(etat);
    
    dataJs.titre = ligne[IDX_COL_TITRE];
    dataJs.url = ligne[IDX_COL_LIEN];
    
    dataJs.use = [];
    
    for (var j = 0; j < res.icons.length; j++) {
      var iconName = res.icons[j];
      var lien = res.iconsLinks[j];
      
      if (datas[i][IDX_COL_FIRST_ICON + j] == 1) {
        dataJs.use.push(iconName);
      }
      
    }
                       
    datasJs[i] = dataJs;
    
  }
  
  res.datas = datasJs;
  return res;
}

/**
 * Retourne les icônes paramétrés dans la feuille Icones
 */
function getIcons() {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Icones");
  var iconesRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  
  var icones = [];
  
  for (var i = 0; i < iconesRange.length; i++) {
    icones[iconesRange[i][0]] = iconesRange[i][1];
  }
  
  return icones;
}

function getInfosGenerales() {
  if (!infosGenerales_) {
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Infos generales");
    
    var range = sheet.getRange(2, 2, sheet.getLastRow() - 1).getValues();
    
    infosGenerales_ = {};
    infosGenerales_.titre = range[0][0];
    infosGenerales_.icone = range[1][0];
    infosGenerales_.favicon = range[2][0];
  }
  return infosGenerales_;
}

/**
 * Retourne la couleur de fond en fonction de l'état
 */
function getBgColorEtat(etat) {
   var sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Etats");
   var rangeEtats = sheet.getRange(2, 1, sheet.getLastRow() - 1);
   var etats = rangeEtats.getValues();
   var bgColors = rangeEtats.getBackgrounds();
  
  for (var i = 0; i < etats.length; i++) {
    if (etats[i][0] == etat) {
      return  bgColors[i][0];
    }
  }
  
  return '#ffffff';
}

/**
 * inclue une ressource (ex : css)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}