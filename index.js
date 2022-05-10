const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08"});
// const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});

async function getItems(user_id){
    
    const params = {
        TableName: "marvel-bookmarks",
        ExpressionAttributeNames: { 
            '#user_id': 'user_id' 
        },
        FilterExpression: '#user_id = :user_id',
        ExpressionAttributeValues: {
          ':user_id': user_id,
        }
        // ProjectionExpression: 'Episode'
    }
    
    // return await documentClient.scan(params).promise();
    return await ddb.getItem(params).promise();
}

exports.handler = async (event, context) => {
    // TODO implement
    
    const items = await getItems("1")
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(items),
    };
    return response;
};