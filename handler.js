"use strict";


const { tagEvent } = require("./serverless_sdk");

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.bookGetAll = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(await dynamoDb.scan({'TableName' : 'Book'}).promise())
  }
}
module.exports.bookGet = async event => {
  id = event.pathParameters.bookUuId
  return {
    statusCode: 200,
    body: JSON.stringify(await dynamoDb.scan({'TableName' : 'Book', 'Key' : id}).promise())
  }
}
module.exports.bookDelete = async event => {
  id = event.pathParameters.bookUuId
  return {
    statusCode: 200,
    body: JSON.stringify(await dynamoDb.delete({'TableName' : 'Book', 'Key' : id}).promise())
  }
}
module.exports.bookUpdate = async event => {
  id = event.pathParameters.bookUuId

  const name = requestBody.name;
  const releaseDate = requestBody.releaseDate;
  const authorName = requestBody.authorName;

  return {
    statusCode: 200,
    body: JSON.stringify(await dynamoDb.update({'TableName' : 'Book', 'Key' : id, Item:
      { 
        Uuid: id,
        name : name,
        releaseDate: releaseDate,
        authorName: authorName
      }}).promise())
  }
}


module.exports.bookAdd = async event => {
  const requestBody = JSON.parse(event.body);
  if(requestBody.name === undefined || requestBody.releaseDate === undefined || requestBody.authorName === undefined)
  {
    return {
      statusCode: 400,
      body: JSON.stringify({
        'message' : 'Missing Fields.'
      })
    }
  }
  const name = requestBody.name;
  const releaseDate = requestBody.releaseDate;
  const authorName = requestBody.authorName;
  try {
    var response = await dynamoDb.put({'TableName' : 'Book', Item: { 
    Uuid: makeid(10),
    name : name,
    releaseDate: releaseDate,
    authorName: authorName
    }}).promise()
  }
  catch(e){
    response = e;
  }
  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify(['User Added with uuid'+response.Uuid] ,null,2)
  }
}


function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



module.exports.hello = async event => {
  tagEvent("custom-tag", "hello world", { custom: { tag: "data" } });
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify(
      {
        message: "Hello World!"
      },
      null,
      2
    )
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
}
