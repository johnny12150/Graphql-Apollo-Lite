# Graphql-Apollo-Lite
採用apollo server & express實作graphql的api

(使用簡單的express框架，無MVC)

### 檔案架構
* server.js: 採用apollo server的相關套件搭配express js, 而非直接使用apollo作為server
* apollo.js: 採用apollo server，而不使用express作為server

### 使用到的Package
#### server.js
> https://github.com/stubailo/schema-stitching-demo/blob/master/index.ts

* apollo-server-express: 在express中使用部分apollo server的功能, 2版以後的寫法如下:
> https://medium.com/@jeffrey.allen.lewis/graphql-migrating-from-apollo-server-express-1-0-to-2-0-be80f5c61bee

* graphql-tools: apollo開發的graphql工具，可以協助處理schema
> https://www.apollographql.com/docs/graphql-tools/schema-stitching.html

* ~~apollo-fetch: 也是apollo開發的graphql工具，可以協助fetch現有的API(REST/ GrapQL類型的都可)並將其格式轉為schema~~ `已經被拋棄使用跟apollo-server-express 1版一樣`
* graphql必備
* apollo-datasource-rest
> https://www.apollographql.com/docs/apollo-server/features/data-sources.html


#### apollo.js
> https://ithelp.ithome.com.tw/articles/10202644

* apollo-server: Apollo Server 套件，將會提供大部分的功能(讓我們啟動 server 的 class ，不但實作許多 GraphQL 功能也提供 web application 的功能 (背後還是使用 express))
* graphql: Facebook 開發的套件，不會被程式直接引用，但會被其他 GraphQL 套件引用。
