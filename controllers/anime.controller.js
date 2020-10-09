const url = require("../helpers/base-url");
const { default: Axios } = require("axios");
const cheerio = require("cheerio");
const errors = require("../helpers/errors");
const episodeHelper = require("../helpers/episodeHelper");

exports.detailAnime = async (req, res) => {
  const id = req.params.id;
  const fullUrl = url.baseUrl + `anime/${id}`;
  // console.log(fullUrl);
  try {
    const response = await Axios.get(fullUrl);

    const $ = cheerio.load(response.data);
    const detailElement = $(".venser").find(".fotoanime");
    const epsElement = $("#_epslist").html();
    let object = {};
    let episode_list = [];
    object.thumb = detailElement.find("img").attr("src");
    object.anime_id = req.params.id;
    let genre_name, genre_id, genre_link;
    let genreList = [];

    object.synopsis = $("#venkonten > div.venser > div.fotoanime > div.sinopc")
      .find("p")
      .text();

    detailElement.find(".infozin").filter(function () {
      object.title = $(this)
        .find("p")
        .children()
        .eq(0)
        .text()
        .replace("Judul: ", "");
      object.japanase = $(this)
        .find("p")
        .children()
        .eq(1)
        .text()
        .replace("Japanese: ", "");
      object.score = parseFloat(
        $(this).find("p").children().eq(2).text().replace("Skor: ", "")
      );
      object.producer = $(this)
        .find("p")
        .children()
        .eq(3)
        .text()
        .replace("Produser:  ", "");
      object.type = $(this)
        .find("p")
        .children()
        .eq(4)
        .text()
        .replace("Tipe: ", "");
      object.status = $(this)
        .find("p")
        .children()
        .eq(5)
        .text()
        .replace("Status: ", "");
      object.total_episode = parseInt(
        $(this).find("p").children().eq(6).text().replace("Total Episode: ", "")
      );
      object.duration = $(this)
        .find("p")
        .children()
        .eq(7)
        .text()
        .replace("Durasi: ", "");
      object.release_date = $(this)
        .find("p")
        .children()
        .eq(8)
        .text()
        .replace("Tanggal Rilis: ", "");
      object.studio = $(this)
        .find("p")
        .children()
        .eq(9)
        .text()
        .replace("Studio: ", "");
      $(this)
        .find("p")
        .children()
        .eq(10)
        .find("span > a")
        .each(function () {
          genre_name = $(this).text();
          genre_id = $(this)
            .attr("href")
            .replace("https://otakudesu.tv/genres/", "");
          genre_link = $(this).attr("href");
          genreList.push({ genre_name, genre_id, genre_link });
          object.genre_list = genreList;
        });
    });

    $("#venkonten > div.venser > div:nth-child(8) > ul > li").each(
      (i, element) => {
        const dataList = {
          title: $(element).find("span > a").text(),
          id: $(element)
            .find("span > a")
            .attr("href")
            .replace("https://otakudesu.tv/", ""),
          link: $(element).find("span > a").attr("href"),
          uploaded_on: $(element).find(".zeebr").text(),
        };
        episode_list.push(dataList);
      }
    );
    object.episode_list =
      episode_list.length === 0
        ? [
            {
              title: "Masih kosong gan",
              id: "Masih kosong gan",
              link: "Masih kosong gan",
              uploaded_on: "Masih kosong gan",
            },
          ]
        : episode_list;
    const batch_link = {
      id:
        $("div.venser > div:nth-child(6) > ul").text().length !== 0
          ? $("div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a")
              .attr("href")
              .replace("https://otakudesu.tv/batch/", "")
          : "Masih kosong gan",
      link:
        $("div.venser > div:nth-child(6) > ul").text().length !== 0
          ? $(
              "div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a"
            ).attr("href")
          : "Masih kosong gan",
    };
    const empty_link = {
      id: "Masih kosong gan",
      link: "Masih kosong gan",
    };
    object.batch_link = batch_link;
    //console.log(epsElement);
    res.json(object);
  } catch (err) {
    console.log(err);
    errors.requestFailed(req, res, err);
  }
};
exports.batchAnime = async (req, res) => {
  const id = req.params.id;
  const fullUrl = `https://otakudesu.tv/batch/${id}`;
  Axios.get(fullUrl)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const obj = {};
      obj.title = $(".batchlink > h4").text();
      obj.status = "success";
      obj.baseUrl = fullUrl;
      let low_quality = _batchQualityFunction(0, response.data);
      let medium_quality = _batchQualityFunction(1, response.data);
      let high_quality = _batchQualityFunction(2, response.data);
      obj.download_list = { low_quality, medium_quality, high_quality };
      res.send(obj);
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
    let low_quality = _epsQualityFunction(0, response.data);
    let medium_quality = _epsQualityFunction(1, response.data);
    let high_quality = _epsQualityFunction(2, response.data);
    obj.quality = { low_quality, medium_quality, high_quality };
    res.send(obj);
  } catch (err) {
    errors.requestFailed(req, res, err);
  }
};

function _batchQualityFunction(num, res) {
  const $ = cheerio.load(res);
  const element = $(".download").find(".batchlink");
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
