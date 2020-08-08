const url = require('../helpers/base-url')
const { default: Axios } = require('axios')
const cheerio = require('cheerio')
const errors = require('../helpers/errors')

class AnimeController{
    detailAnime = (req,res)=>{
        const id = req.params.id
        const fullUrl = url.baseUrl+`anime/${id}`
        // console.log(fullUrl);
        Axios.get(fullUrl).then(response=>{
            const $ = cheerio.load(response.data)
            const detailElement = $('.venser').find('.fotoanime')
            const epsElement = $('.episodelist')
            let object = {}
            let episode_list = []
            object.thumb = detailElement.find('img').attr('src')
            let genre_name,genre_id,genre_link
            let genreList = []
            detailElement.find('.infozin').filter(function(){
                object.title = $(this).find('p').children().eq(0).text().replace('Judul: ','')
                object.japanase = $(this).find('p').children().eq(1).text().replace('Japanese: ','')
                object.score = $(this).find('p').children().eq(2).text().replace('Skor: ','')
                object.producer = $(this).find('p').children().eq(3).text().replace('Produser:  ','')
                object.type = $(this).find('p').children().eq(4).text().replace('Tipe: ','')
                object.status = $(this).find('p').children().eq(5).text().replace('Status: ','')
                object.total_episode = $(this).find('p').children().eq(6).text().replace('Total Episode: ','')
                object.duration = $(this).find('p').children().eq(7).text().replace('Durasi: ','')
                object.release_date = $(this).find('p').children().eq(8).text().replace('Tanggal Rilis: ','')
                object.studio = $(this).find('p').children().eq(9).text().replace('Studio: ','')
                $(this).find('p').children().eq(10).find('span > a').each(function() {
                    genre_name = $(this).text()
                    genre_id = $(this).attr('href').replace('https://otakudesu.org/genres/','')
                    genre_link = $(this).attr('href')
                    genreList.push({genre_name,genre_id,genre_link})
                    object.genre_list = genreList
                })
            })
            epsElement.eq(0).find('ul').filter(function (){
                console.log($(this).find('span:nth-child(1) > a').text());
            })
            // console.log(epsElement.eq(0).children().last().text());
            res.json(object)
        }).catch(err=>{
            errors.requestFailed(req,res,err)
        })
    }
}

module.exports = new AnimeController()