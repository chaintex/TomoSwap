function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const avalableLanguages = [
    { name: 'English', code: 'en' },
    { name: 'Tiếng Việt', code: 'vi' }
];

function currentLanguage(){
  const defaultLanguage = "en";
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

  const langItem = avalableLanguages.find(x => x.code === packName);

  return {
    data: languagePack,
    code: packName,
    name: langItem.name,
  }
}

export { currentLanguage, avalableLanguages };