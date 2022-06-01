
const dummy = (blogList)=>{
    return 1
}

const totalLikes = (blogList) =>{
    return blogList.reduce((sum,blog)=>{
        return sum +blog.likes
    },0)
}

const favoriteBlog = (blogList) =>{
    if (blogList.length===0){
        return null
    }else if (blogList.length===1){
        return {
            title : blogList[0].title,
            author : blogList[0].author,
            likes : blogList[0].likes
        }
    }else{
        const likes = blogList.map(b =>b.likes)
        let maxValue = Math.max(...likes)
        let favBlog= blogList.find(b=>b.likes === maxValue)
        return {
            title : favBlog.title,
            author : favBlog.author,
            likes : favBlog.likes
        }
    } 
    
}
const mostBlogs = (blogList) =>{
    let authors = blogList.map(blog => blog.author)
    let max = 0
    let indexOfMax =0
    for (let i =0;i<authors.length;i++)
    {
        let count = 0
        for (let j=0;j<authors.length;j++){
            if(authors[j] === authors[i]){
                count = count +1
            }
        }
        if(count>max){
            max = count
            indexOfMax = i
        }
    }
    return {
        author : authors[indexOfMax],
        blogs : max
    }
}

const mostLikes = (blogList)=>{
    authorsAndLikes = blogList.map(b => {
        return {author : b.author, likes : b.likes}
    })
    let max = 0
    let indexOfMax =0
    for (let i =0;i<authorsAndLikes.length;i++)
    {
        let count = 0
        for (let j=0;j<authorsAndLikes.length;j++){
            if(authorsAndLikes[j].author === authorsAndLikes[i].author){
                count = count + authorsAndLikes[j].likes
            }
        }
        if(count>max){
            max = count
            indexOfMax = i
        }
    }
    return {
        author : authorsAndLikes[indexOfMax].author,
        likes : max
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}