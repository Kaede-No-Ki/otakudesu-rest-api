const url = require("../helpers/base-url");
const { default: Axios } = require("axios");
const cheerio = require("cheerio");
const errors = require("../helpers/errors");
const episodeHelper = require("../helpers/episodeHelper");
const { baseUrl } = require("../helpers/base-url");

exports.detailAnime = async (req, res) => {
  const id = req.params.id;
  const fullUrl = url.baseUrl + `anime/${id}`;
  try {
    const response = await Axios.get(fullUrl);
    const $ = cheerio.load(response.data);

    const temp = $(".infozingle b")
      .map((i, elem) => $(elem).text() + ": ")
      .get();
    const information = $(".infozingle")
      .text()
      .split(new RegExp(temp.join("|")));

    const synopsis = $(".sinopc > p")
      .toArray()
      .map((ele) => $(ele).text())
      .join("\n\n")
      .split("Tonton")[0]
      .trim();

    let episode_list = $("#venkonten > div.venser > div:nth-child(8) > ul > li")
      .toArray()
      .map((element) => {
        return {
          title: $(element).find("span > a").text(),
          id: $(element).find("span > a").attr("href").split("/")[3],
          link: $(element).find("span > a").attr("href"),
          uploaded_on: $(element).find(".zeebr").text(),
        };
      });

    episode_list = episode_list.length
      ? episode_list
      : [
          {
            title: "Masih kosong gan",
            id: "Masih kosong gan",
            link: "Masih kosong gan",
            uploaded_on: "Masih kosong gan",
          },
        ];
    const batch_link = {
      id: $("div.venser > div:nth-child(6) > ul").text()
        ? $("div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a")
            .attr("href")
            .split("/")[4]
        : "Masih kosong gan",
      link: $("div.venser > div:nth-child(6) > ul").text().length
        ? $(
            "div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a"
          ).attr("href")
        : "Masih kosong gan",
    };
    //console.log(epsElement);
    res.json({
      anime_id: req.params.id,
      thumb: $(".fotoanime img").attr("src"),
      title: information[1],
      japanese: information[2],
      score: parseFloat(information[3]),
      producer: information[4],
      type: information[5],
      status: information[6],
      total_episode: parseInt(information[7]),
      duration: information[8],
      release_date: information[9],
      studio: information[10],
      genre_list: $(".infozingle span")
        .last()
        .find("a")
        .toArray()
        .map((g) => {
          return {
            genre_name: $(g).text(),
            genre_id: $(g).attr("href").split("/")[4],
            genre_link: $(g).attr("href"),
          };
        }),
      synopsis,
      episode_list,
      batch_link,
    });
  } catch (err) {
    console.log(err);
    errors.requestFailed(req, res, err);
  }
};
exports.batchAnime = async (req, res) => {
  const id = req.params.id;
  const fullUrl = `${baseUrl}batch/${id}`;
  Axios.get(fullUrl)
    .then((response) => {
      const $ = cheerio.load(response.data);
      res.json({
        title: $(".batchlink > h4").text(),
        status: "success",
        baseUrl: fullUrl,
        download_list: {
          low_quality: _batchQualityFunction(0, response.data),
          medium_quality: _batchQualityFunction(1, response.data),
          high_quality: _batchQualityFunction(2, response.data),
        },
      });
    })
    .catch((err) => {
      errors.requestFailed(req, res, err);
    });
};
exports.epsAnime = async (req, res) => {
  const id = req.params.id;
  const fullUrl = `${url.baseUrl}${id}`;
  try {
    const response = await Axios.get(fullUrl);
    const $ = cheerio.load(response.data);
    const streamElement = $("#lightsVideo").find("#embed_holder");
    const obj = {};
    obj.title = $(".venutama > h1").text();
    obj.baseUrl = fullUrl;
    obj.id = fullUrl.replace(url.baseUrl, "");
    const streamLink = streamElement.find("iframe").attr("src");
    // const streamLinkResponse = await Axios.get(streamLink)
    // const stream$ = cheerio.load(streamLinkResponse.data)
    // const sl = stream$('body').find('script').html().search('sources')
    // const endIndex = stream$('body').find('script').eq(0).html().indexOf('}]',sl)
    // const val = stream$('body').find('script').eq(0).html().substr(sl,endIndex - sl+1).replace(`sources: [{'file':'`,'')
    // console.log(val);
    // console.log(val.replace(`','type':'video/mp4'}`,''));
    obj.link_stream = await episodeHelper.get(streamLink);
    let low_quality;
    let medium_quality;
    let high_quality;
    if (
      $(
        "#venkonten > div.venser > div.venutama > div.download > ul > li:nth-child(1)"
      ).text() === ""
    ) {
      console.log("ul is empty");
      low_quality = _notFoundQualityHandler(response.data, 0);
      medium_quality = _notFoundQualityHandler(response.data, 1);
      high_quality = _notFoundQualityHandler(response.data, 2);
    } else {
      console.log("ul is not empty");
      low_quality = _epsQualityFunction(0, response.data);
      medium_quality = _epsQualityFunction(1, response.data);
      high_quality = _epsQualityFunction(2, response.data);
    }
    obj.quality = { low_quality, medium_quality, high_quality };
    res.send(obj);
  } catch (err) {
    console.log(err);
    errors.requestFailed(req, res, err);
  }
};

function _batchQualityFunction(num, res) {
  const $ = cheerio.load(res);
  const element = $(".download").find(".batchlink");
  return element
    .find("ul")
    .toArray()
    .map((ul) => {
      return {
        quality: $(ul).find("li").eq(num).find("strong").text(),
        size: $(ul).find("li").eq(num).find("i").text(),
        download_links: $(ul)
          .find("li")
          .eq(num)
          .find("a")
          .toArray()
          .map((li) => {
            return {
              host: $(li).text(),
              link: $(li).attr("href"),
            };
          }),
      };
    });
}
function _epsQualityFunction(num, res) {
  const $ = cheerio.load(res);
  const element = $(".download");
  const download_links = [];
  let response;

  element.find("ul").filter(function () {
    const quality = $(this).find("li").eq(num).find("strong").text();
    const size = $(this).find("li").eq(num).find("i").text();
    $(this)
      .find("li")
      .eq(num)
      .find("a")
      .each(function () {
        const _list = {
          host: $(this).text(),
          link: $(this).attr("href"),
        };
        download_links.push(_list);
        response = { quality, size, download_links };
      });
  });
  return response;
}

function _notFoundQualityHandler(res, num) {
  const $ = cheerio.load(res);
  const download_links = [];
  const element = $(".download");
  let response;

  element.filter(function () {
    if ($(this).find(".anime-box > .anime-title").eq(0).text() === "") {
      $(this)
        .find(".yondarkness-box")
        .filter(function () {
          const quality = $(this)
            .find(".yondarkness-title")
            .eq(num)
            .text()
            .split("[")[1]
            .split("]")[0];
          const size = $(this)
            .find(".yondarkness-title")
            .eq(num)
            .text()
            .split("]")[1]
            .split("[")[1];
          $(this)
            .find(".yondarkness-item")
            .eq(num)
            .find("a")
            .each((idx, el) => {
              const _list = {
                host: $(el).text(),
                link: $(el).attr("href"),
              };
              download_links.push(_list);
              response = { quality, size, download_links };
            });
        });
    } else {
      $(this)
        .find(".anime-box")
        .filter(function () {
          const quality = $(this)
            .find(".anime-title")
            .eq(num)
            .text()
            .split("[")[1]
            .split("]")[0];
          const size = $(this)
            .find(".anime-title")
            .eq(num)
            .text()
            .split("]")[1]
            .split("[")[1];
          $(this)
            .find(".anime-item")
            .eq(num)
            .find("a")
            .each((idx, el) => {
              const _list = {
                host: $(el).text(),
                link: $(el).attr("href"),
              };
              download_links.push(_list);
              response = { quality, size, download_links };
            });
        });
    }
  });
  return response;
}
