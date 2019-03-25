import Language from "../assets/translations/index"
import { initialize, addTranslationForLanguage } from 'react-localize-redux';
const defaultLanguage = 'en';

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function initLanguage(store){
  let languagePack, packName
  try {
    packName = getParameterByName('lang')
    if (packName === null) {
      var rawPackName = getParameterByName('locale')
      switch (rawPackName) {
        case "en-EN":
          packName = "en"
          break
        case "zh-CN":
          packName = "cn"
      }
    }
    if (packName){
      languagePack = require("../assets/translations/" + packName + ".json")
    }else{
      packName = defaultLanguage
      languagePack = require("../assets/translations/" + packName + ".json")  
    }
  } catch (e) {
    console.log(e)
    packName = defaultLanguage
    languagePack = require("../assets/translations/" + packName + ".json")
  }
  
  console.log("________________ load loanguage ", packName)
  store.dispatch(initialize({
    languages: [
      { name: "", code: packName },      
    ],
    options: {
      renderToStaticMarkup: false,
      renderInnerHtml: true
    }
  }))
  store.dispatch(addTranslationForLanguage(languagePack, packName));

}

export function getLanguage(key){
  let langData = require("../assets/translations/" + key + ".json")
  return langData
}