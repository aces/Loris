# Meta documentation module

This module use [Swagger-UI](https://swagger.io/tools/swagger-ui/) to present this LORIS instance modules API endpoints. By selecting a module name in the *Select  a spec* dropdown, it will provide a description of each of the selected module endpoints.

Feel free to test the *Try it out* button for each endpoints.

*NOTE*  
If accessing this module as a guest (Unauthenticated user), you will have to authenticate yourself before using most of the endpoints. To do so, select the
**api** spec, then use the login endpoint *Try it out*. You will have to fill the *Request body* section with the appropriate credentials then hit the *Execute* bu
tton. If successfull, rhe *Response* section will contain the JWT token to put in the *Value* field when clicking the *Authorize* button. The token value must be prefixed with Bearer.  

Ex: Bearer fyJ0eXAi11iJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJp...

