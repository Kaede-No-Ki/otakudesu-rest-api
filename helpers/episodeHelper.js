const { default: Axios } = require("axios");
const cheerio = require("cheerio");
const get = async (url) => {
  try {
    const response = await Axios.get(url);
    const $ = cheerio.load(response.data);
    let source1 = $.html().search('"file":');
    let source2 = $.html().search("'file':");
    console.log(source1);
    console.log(source2);
    if (source1 !== -1) {
      const end = $.html().indexOf('","');
      return $.html().substring(source1 + 8, end);
    } else if (source2 !== -1) {
      const end = $.html().indexOf("','");
      return $.html().substring(source2 + 8, end);
    }
    return "-";
  } catch (error) {
    return "-";
  }
};

module.exports = { get };
