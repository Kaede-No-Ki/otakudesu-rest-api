const cheerio = require('cheerio')
const url = require('../helpers/base-url')
const { default: Axios } = require('axios')
const baseUrl = url.baseUrl


class HomeController{
    onGoingHome = (req,res)=>{
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
        })
        Axios.get(baseUrl).then((response)=>{
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
            res.send({on_going,complete})
        })
    }
}
module.exports = new HomeController();