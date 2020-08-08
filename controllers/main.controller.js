const cheerio = require('cheerio')
const url = require('../helpers/base-url')
const { default: Axios } = require('axios')
const baseUrl = url.baseUrl
const completeAnime = url.completeAnime
const onGoingAnime = url.onGoingAnime
const errors = require('../helpers/errors')

class MainController{
     home =  (req,res)=>{
        let home = {}
        let on_going = []
        let complete = []
        Axios.get(baseUrl).then((response)=>{
            const $ = cheerio.load(response.data)
            const element = $('.venz')
            let episode,uploaded_on,day_updated,thumb,title,link,id
            element.children().eq(0).find('ul > li').each(function(){
                 $(this).find('.thumb > a').filter(function(){
                     title = $(this).find('.thumbz > h2').text()
                     thumb = $(this).find('.thumbz > img').attr('src')
                     link = $(this).attr('href')
                     id = link.replace(`${baseUrl}anime/`,'')
                 })
                 uploaded_on = $(this).find('.newnime').text()
                 episode = $(this).find('.epz').text().replace(' ','')
                 day_updated = $(this).find('.epztipe').text().replace(' ','')
                 on_going.push({title,id,thumb,episode,uploaded_on,day_updated,link})
            })
            home.on_going = on_going
            return response
        }).then(response=>{
            const $ = cheerio.load(response.data)
            const element = $('.venz')
            let episode,uploaded_on,score,thumb,title,link,id
            element.children().eq(1).find('ul > li').each(function(){
                 $(this).find('.thumb > a').filter(function(){
                     title = $(this).find('.thumbz > h2').text()
                     thumb = $(this).find('.thumbz > img').attr('src')
                     link = $(this).attr('href')
                     id = link.replace(`${baseUrl}anime/`,'')
                     
                 })
                 uploaded_on = $(this).find('.newnime').text()
                 episode = $(this).find('.epz').text().replace(' ','')
                 score = $(this).find('.epztipe').text().replace(' ','')
                 complete.push({title,id,thumb,episode,uploaded_on,score,link})
            })
            home.complete = complete
            res.status(200).json({
                status:'success',
                baseUrl:baseUrl,
                home
            })
        })
        .catch((e)=>{
            console.log(e.message);
        })
    }
    completeAnimeList = (req,res) => {
        const params = req.params.page
        const page = typeof params === 'undefined'
        ?''
        :params === '1'
        ? ''
        :`page/${params}`;
        const fullUrl = `${baseUrl}${completeAnime}${page}`
        console.log(fullUrl);
        Axios.get(fullUrl).then(response =>{
            const $ = cheerio.load(response.data)
            const element = $('.venz')
            let animeList = []
            let episode,uploaded_on,score,thumb,title,link,id
            element.children().eq(0).find('ul > li').each(function(){
                 $(this).find('.thumb > a').filter(function(){
                     title = $(this).find('.thumbz > h2').text()
                     thumb = $(this).find('.thumbz > img').attr('src')
                     link = $(this).attr('href')
                     id = link.replace(`${baseUrl}anime/`,'')
                 })
                 uploaded_on = $(this).find('.newnime').text()
                 episode = $(this).find('.epz').text().replace(' ','')
                 score = $(this).find('.epztipe').text().replace(' ','')
                 animeList.push({title,id,thumb,episode,uploaded_on,score,link})
            })
            res.status(200).json({
                status:'success',
                baseUrl:fullUrl,
                animeList})
        }).catch(err=>{
            console.log(err.message);
        })
    }
    onGoingAnimeList = (req,res) => {
        const url = `${baseUrl}${onGoingAnime}`
        console.log(url);
        Axios.get(url).then(response =>{
            const $ = cheerio.load(response.data)
            const element = $('.venz')
            let animeList = []
            let episode,uploaded_on,day_updated,thumb,title,link,id
            element.children().eq(0).find('ul > li').each(function(){
                 $(this).find('.thumb > a').filter(function(){
                     title = $(this).find('.thumbz > h2').text()
                     thumb = $(this).find('.thumbz > img').attr('src')
                     link = $(this).attr('href')
                     id = link.replace(`${baseUrl}anime/`,'')
                 })
                 uploaded_on = $(this).find('.newnime').text()
                 episode = $(this).find('.epz').text().replace(' ','')
                 day_updated = $(this).find('.epztipe').text().replace(' ','')
                 animeList.push({title,id,thumb,episode,uploaded_on,day_updated,link})
            })
            res.status(200).json({
                status:'success',
                baseUrl:url,
                animeList})
        }).catch(err=>{
            console.log(err.message);
        })
    }
    schedule = (req,res)=>{
        Axios.get(baseUrl+url.schedule).then(response=>{
            const $ = cheerio.load(response.data)
            const element = $('.kgjdwl321')
            let animeList = []
            let scheduleList = []
            let day
            let anime_name,link,id
            element.find('.kglist321').each(function(){
                day = $(this).find('h2').text()
                animeList = []
                $(this).find('ul > li').each(function(){
                    anime_name = $(this).find('a').text()
                    link = $(this).find('a').attr('href')
                    id = link.replace(baseUrl+'anime/','')
                    animeList.push({anime_name,id,link})
                })
                scheduleList.push({day,animeList})
            })
            res.json({scheduleList})
        })
    }
    genre = (req,res)=>{
        const fullUrl = baseUrl+url.genreList
        Axios.get(fullUrl).then(response=>{
            const $ = cheerio.load(response.data)
            const element = $('.genres')
            let genreList = []
            element.find('li > a').each(function(){
                let object = {}
                object.genre_name = $(this).text()
                object.id = $(this).attr('href').replace('/genres/','')
                object.link = baseUrl+$(this).attr('href')
                genreList.push(object)
            })
            res.json({genreList})
        }).catch(err =>{
            console.log(err.message);
        })
    }
    animeByGenre = (req,res) => {
        const pageNumber = req.params.pageNumber
        const id = req.params.id
        const fullUrl = baseUrl+`genres/${id}/page/${pageNumber}`
        console.log(fullUrl);
        Axios.get(fullUrl).then(response=>{
            const $ = cheerio.load(response.data)
            const element = $('.page')
            let animeList = []
            let genreList = []
            let object = {}
            let genre_name,genre_link,genre_id
            element.find('.col-md-4').each(function(){
                object = {}
                object.anime_name = $(this).find('.col-anime-title').text()
                object.link = $(this).find('.col-anime-title > a').attr('href')
                object.id = $(this).find('.col-anime-title > a').attr('href').replace('https://otakudesu.org/anime/','')
                object.studio = $(this).find('.col-anime-studio').text()
                object.episode = $(this).find('.col-anime-eps').text()
                object.score = $(this).find('.col-anime-rating').text()
                object.release_date = $(this).find('.col-anime-date').text()
                genreList = []
                $(this).find('.col-anime-genre > a').each(function(){
                    genre_name = $(this).text()
                    genre_link = $(this).attr('href')
                    genre_id = genre_link.replace('https://otakudesu.org/genres/','')
                    genreList.push({genre_name,genre_link,genre_id})
                    object.genre_list = genreList
                    
                })
                animeList.push(object)
            })
            res.send({
                'status': 'success',
                baseUrl: fullUrl,
                animeList})
        }).catch(err =>{
            errors.requestFailed(req,res,err)
        })
    }
}
module.exports = new MainController();