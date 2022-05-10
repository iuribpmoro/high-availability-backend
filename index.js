async function getFavoriteComics(userId){
    return []
}

async function setFavoriteComic(userId, comicId){
    return null
}

async function removeFavoriteComic(userId, comicId){
    return null
}

async function routeRequest(event){
    const method = event.requestContext.http.method
    const query = event.queryStringParameters
    const body = event.body ? JSON.parse(event.body) : null

    switch(method){
        case "GET":
            return getFavoriteComics(query.userId)
        case "POST":
            return setFavoriteComic(body.userId, body.comicId)
        case "DELETE":
            return removeFavoriteComic(query.userId, query.comicId)
    }
}

exports.handler = async (event) => {
    try{
        const response = await routeRequest(event)

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
    }catch(error){
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
};
