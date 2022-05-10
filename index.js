const AWS = require('aws-sdk')

const TABLE_NAME = "test-remove"
const REGION = "us-east-1"

const documentClient = new AWS.DynamoDB.DocumentClient({ region: REGION});

async function getFavoriteComics(userId){
    const params = {
        TableName: TABLE_NAME,
        ExpressionAttributeNames: { 
            '#user_id': 'user_id' 
        },
        FilterExpression: '#user_id = :user_id',
        ExpressionAttributeValues: {
          ':user_id': userId,
        }
    }
    
    const response = await documentClient.scan(params).promise();
    const items = response["Items"]
    return items.map(item => item["comic_id"])
}

async function setFavoriteComic(userId, comicId){
    const params = {
        TableName: TABLE_NAME,
        Item: {
            "id": `${userId}-${comicId}`,
            "user_id": userId,
            "comic_id": comicId
        }
    }
    
    await documentClient.put(params).promise();
    return null
}

async function removeFavoriteComic(userId, comicId){
    const params = {
        TableName: TABLE_NAME,
        Key: {id: `${userId}-${comicId}`},
    }
    
    await documentClient.delete(params).promise();
    return null
}

async function routeRequest(event){
    const method = event.requestContext.http.method
    const query = event.queryStringParameters
    const body = event.body ? JSON.parse(event.body) : null

    switch(method){
        case "GET":
            return getFavoriteComics(query.userid)
        case "POST":
            return setFavoriteComic(body.userId, body.comicId)
        case "DELETE":
            return removeFavoriteComic(query.userid, query.comicid)
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
            body: JSON.stringify({
                message: error.message,
                error
            })
        }
    }
};
