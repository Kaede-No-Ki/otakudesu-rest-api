const cheerio = require('cheerio')
const url = require('../helpers/base-url')
const { default: Axios } = require('axios')
const baseUrl = url.baseUrl
const completeAnime = url.completeAnime
const onGoingAnime = url.onGoingAnime
// const on404 = require('../helpers/errors')


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
            let episode,uploaded_on,day_updated,thumb,title,link,id
            element.children().eq(1).find('ul > li').each(function(){
                 $(this).find('.thumb > a').filter(function(){
                     title = $(this).find('.thumbz > h2').text()
                     thumb = $(this).find('.thumbz > img').attr('src')
                     link = $(this).attr('href')
                     id = link.replace(`${baseUrl}anime/`,'')
                     
                 })
                 uploaded_on = $(this).find('.newnime').text()
                 episode = $(this).find('.epz').text().replace(' ','')
                 day_updated = $(this).find('.epztipe').text().replace(' ','')
                 complete.push({title,id,thumb,episode,uploaded_on,day_updated,link})
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
                baseUrl:fullUrl,
                animeList})
        }).catch(err=>{
            console.log(err.message);
        })
    }
    onGoingAnimeList = (req,res) => {
        const params = req.params.page
        const page = typeof params === 'undefined'
        ?''
        :params === '1'
        ? ''
        :`page/${params}`;
        const fullUrl = `${baseUrl}${onGoingAnime}${page}`
        console.log(fullUrl);
        Axios.get(fullUrl).then(response =>{
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
                baseUrl:fullUrl,
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
}
module.exports = new MainController();