**[[HOME|Home]]** > **[[TECHNICAL|Technical]]** > **[[How LORIS URLs work]]**

---

> **Note:** If you are looking for information about **LORIS module creation**, please see [[How to make a LORIS module]]❗


**Things to know about LORIS URLs**

1. All URLs must end with a backslash ```/``` 

2. Query string parameters can be passed to any URL in the format `$LORIS$/$ModuleName$?key=value`. This parameters can be accessed in PHP using a standard `$_GET` object.

3. When implementing links to different parts of the module, always use relative URLs instead of absolute URLs. 

---

**Example**

In PHP, you can get $baseURL as such: 
```php
$factory = NDB_Factory::singleton();
$baseURL = $factory->settings()->getBaseURL();
... = $baseURL . "/$ModuleName$/...";
```

In Javascript, a global `loris` object has a `BaseUrl` property which you can use as such:
```js
... = loris.BaseURL + "/$ModuleName$/";
```

>**Important**: The base url does not contain trailing slash, so every link to a specific module should start with slash as shown above.