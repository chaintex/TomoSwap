function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function initLanguage(){
  const defaultLanguage = "vi";
  let languagePack, packName;
  try {
    packName = getParameterByName('lang')
    if (packName === null) {
      var rawPackName = getParameterByName('locale')
      switch (rawPackName) {
        case "en-EN":
          packName = "en";
          break;
        case "vi-VN":
          packName = "vi";
          break;
        default:
          break;
      }
    }

    if (packName){
      languagePack = require("../assets/translations/" + packName + ".json")
    } else {
      packName = defaultLanguage
      languagePack = require("../assets/translations/" + packName + ".json")  
    }
  } catch (e) {
    packName = defaultLanguage
    languagePack = require("../assets/translations/" + packName + ".json")
  }

  return {
    languagePack,
    packName
  }
}