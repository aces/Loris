---
⚠️ ⚠️ ⚠️ ⚠️ ⚠️  
### This wiki is deprecated, see [[Guide to Loris React components]] instead 
⚠️ ⚠️ ⚠️ ⚠️ ⚠️ 

---


As of [[16.0|https://github.com/aces/Loris/releases]], elements of LORIS modules are handled using [[React|https://facebook.github.io/react/]] for better rendering.  Selection Filters and Pagination in Menu Filter pages are key examples.  

This page contains tips on working with React for new or existing custom modules, particularly when upgrading custom code to LORIS 16.0

## How to upgrade pagination - example

Change 
```xml
    <td align="right">{$page_links}</td>
``` 
to
```xml
    <td align="right" id="pageLinks"></td>
```

Then add the following script tag to the end of the template file
```xml
<script>
var pageLinks = RPaginationLinks(
{
    RowsPerPage : {$rowsPerPage},
    Total: {$numCandidates},
    onChangePage: function(pageNum) {
        location.href="{$baseurl}/main.php?test_name=candidate_list&pageID=" + pageNum
    },
    Active: {$pageID}
});
React.render(pageLinks, document.getElementById("pageLinks"));
</script>
```

Make sure you change the [[URL|How-LORIS-URLs-work]] in the location.href to the right module


### Pagination Example with Sorting

```
var pageLinks = RPaginationLinks(
{
    RowsPerPage : {$rowsPerPage},
    Total: {$numUploads},
    onChangePage: function(pageNum) {
        location.href="{$baseurl}/imaging_uploader/?filter[order][field]={$filterfield}&filter[order][fieldOrder]={$filterfieldOrder}&pageID=" + pageNum
    },
    Active: {$pageID}
});
React.render(pageLinks, document.getElementById("pageLinks"));
```