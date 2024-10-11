module.exports = (url) =>{
    const pattern =/\/v\d+\/(.+)\.[a-z]+$/
    const match = url.match(pattern)
    console.log(match)
    if(match){
        return match[1]
    }
    return url
}
