## Frequently Asked Questions

#### Overview

### What is a Loris API?

Loris API provides stable, versioned REST interface to retrieve and upload data. It uses standard HTTP error codes and the body of any response will either be empty or contain only a JSON object for any request.
Please read [detailed introduction](https://github.com/aces/Loris/blob/master/modules/api/docs/LorisRESTAPI_v0.0.3.md) about Loris API.

### What is JSON?
JSON refers to [JavaScript Object Notation](https://www.json.org/json-en.html).

It is a lightweight data interchange format whose simplicity has resulted in widespread use among web developers. It is a minimal, readable format for structuring data, used primarily to transmit data between a server and web application, as an alternative to XML. It can be parsed by using any programming language.

### How REST is different? Why should I use it?

Fundamental networking protocols, such as HTTP provides basic building blocks for integration, without dealing with complex protocols, such as [SOAP](https://en.wikipedia.org/wiki/SOAP). REST provides [caching](https://restfulapi.net/caching/), greater variety of data formats, it is faster and uses less bandwidth. For more information about usage, please refer [HTTP methods](https://www.restapitutorial.com/lessons/httpmethods.html) and [Loris REST API usage](https://github.com/xlecours/loris-api-presentation/blob/master/LORIS-API_Part1-HTTP.ipynb)


### How do I authenticate the API?

Loris API requires one-step-authentication by using standard session mechanism, the user must be logged in to Loris for that. If the user is not logged in, they can use [JSON Web Tokens](https://jwt.io/) for authentication. For further detail, refer [LORIS API](https://github.com/aces/Loris/blob/master/modules/api/docs/LorisRESTAPI_v0.0.3.md), section 1.1.

### How can I obtain a file in different format using Loris API?

This can be done by addition of  ```/format/$FormatType```  in the URL in the API. <br />
For example,  <br />
```GET /candidates/$CandID/$VisitLabel/images/$Filename/format/raw``` <br />

Currently supported formats are, thumbnail, raw and brainbrowser format (more formats may be added in upcoming version).

### I have a feature request and a bug report. Where should I post?

For any request or bug report, create a [Github Issue](https://github.com/aces/Loris/issues) and add "proposal" or "bug" label respectively. For asking any query related to Loris API, you may ask our developers through [mailing list](https://mailman.bic.mni.mcgill.ca/mailman/listinfo/loris-dev) 

### Can I customize the output provided by Loris API ? 

No. Currently, we do not provide any outlets for customizing the API.

### Is there any expiration date for authentication token?
*To-be-answered

### What permissions do I require to use the API?
*To-be-answered

### What are some good tools for HTTP debugging?

Some of the most common tools are:

#### cURL
cURL is a command-line tool which can perform HTTP/HTTPS requests. It is very useful for quick testing of interactions with a service without having to first build HTTP support in your client.

#### Fiddler
Fiddler is a cross-platform web application debugging proxy. It can edit and manipulate web sessions. Besides, Fiddler can decrypt HTTPS traffic and display web application requests.
