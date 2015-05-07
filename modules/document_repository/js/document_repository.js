/*global $, document, window, location */

function editCategory() {
    "use strict";

    var id,
        value;
    $('.categorycomments').bind('blur', function (event) {
        event.stopImmediatePropagation();
        id = event.target.id;
        value = $("#" + id).text();
        id = id.replace("categorycomment", "");
        $.get("AjaxHelper.php?Module=document_repository&script=categoryEdit.php&id=" + id + "&comments=" + value);
    }).keypress(function (e) {
        if (e.which === 13) { // Determine if the user pressed the enter button
            $(this).blur();
        }
    });
}


//Checks that all fields required for file upload are entered 
function isEmpty(element) {
    "use strict";

    if (element.val() === " ") {
        element.focus();
        element.parent().addClass('has-error');
        $(".upload-error").show();
        return true;
    }
    return false;
}

//Checks that file has been selected for upload
function isFileEmpty(element) {
    "use strict";

    if (element.length === 0) {
        $(".file-error").show();
        return true;
    }
    return false;
}

//Pre-populates the Edit form with fields already associated with that file
function selectElement(element, valueToSelect) {
    "use strict";

    $("#" + element).val(valueToSelect);
}

function postDelete(id) {
    "use strict";

    $.ajax({
        url: "AjaxHelper.php?Module=document_repository&script=documentDelete.php",
        type: "POST",
        data: {id: id},
        success: function () {
            $("#" + id).parent().parent().remove();
            $('.delete-success').show();
            setTimeout(function () {
                $('.delete-success').hide();
            }, 3000);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR) {
                console.log("Error: " + textStatus + " " + errorThrown);
            }
        }
    });
}

function deleteModal() {
    "use strict";

    var id = this.id;
    $('#deleteModal').modal();
    $("#postDelete").click(function () {
        postDelete(id);
    });

    return false;
}

function postCategory() {
    "use strict";

    $.ajax({
        url: "AjaxHelper.php?Module=document_repository&script=addCategory.php",
        type: "POST",
        data: $("#addCategoryForm").serialize(),
        success: function () {
            $("#addCategoryModal").modal('hide');
            $("#addCategoryCategory").removeClass("has-error");
            $("#categoryAddError").hide();
            $('.add-success').show();
            setTimeout(function () {
                $('.add-success').hide();
            }, 3000);
            setTimeout(function () {
                location.reload();
            }, 3000);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 400) {
                $("#addCategoryCategory").addClass("has-error");
                $("#categoryAddError").show()
            }
        }
    });
}

function postEdit(id) {
    var data = {
                idEdit: id,
                categoryEdit: $(categoryEdit).val(),
                siteEdit: $(siteEdit).val(),
                instrumentEdit: $(instrumentEdit).val(),
                pscidEdit: $(pscidEdit).val(),
                visitEdit: $(visitEdit).val(),
                commentsEdit: $(commentsEdit).val(),
                versionEdit: $(versionEdit).val(),
                action: $(actionEdit).val(),
                submit: 'yeah!!!!'
            };

    $.ajax({
        type: "POST",
        url: "AjaxHelper.php?Module=document_repository&script=documentEditUpload.php",
        data: data,
        success: function() {
            $('.edit-success').show();
            $("#editModal").modal('hide');
            $("#editFileCategory").removeClass("has-error");
            $("#categoryEditError").hide();
            setTimeout(function() { location.reload() }, 3000);
        },
        error: function() {
            $("#editFileCategory").addClass("has-error");
            $("#categoryEditError").show();
        }
    });
}

function editModal() {
    "use strict";

    var id = this.id;
    $("#editModal").modal();

    $.ajax({
        type: "GET",
        url: "AjaxHelper.php?Module=document_repository&script=getFileData.php",
        data: {id: id},
        async: false,
        dataType: "json",
        success: function (data) {

            //Pre-populate the form with the existing values
            selectElement("categoryEdit", data.File_category);
            selectElement("siteEdit", data.For_site);
            selectElement("instrumentEdit", data.Instrument);
            selectElement("pscidEdit", data.PSCID);
            selectElement("visitEdit", data.visitLabel);
            selectElement("commentsEdit", data.comments);
            selectElement("versionEdit", data.version);

        }
    });

    $("#postEdit").click(function(e){
        e.preventDefault();
        postEdit(id);
    });
    $("#cancelEditButton").click(function() {
        $(".dialog-form-edit").dialog("close");
    });

    return false;
}

function uploadForm() {
    var elements = $(this).get(0).elements,
        category_isEmpty = isEmpty($(elements).filter("[name=category]")),
        site_isEmpty = isEmpty($(elements).filter("[name=site]")),
        file_isEmpty = isFileEmpty($("[name=file]").get(0).files);
    if(category_isEmpty || site_isEmpty || file_isEmpty) {
        return false;
    }
}

function renderTree(){
    var fileDir = JSON.parse($("#json_data").html()),
        filtered = JSON.parse($("#isFiltered").html()).filtered;

    for(var i in fileDir){
        if(fileDir[i]){
            var dir = fileDir[i];
            var path = dir.CategoryName.split(">");
            var depth = path.length;

            //new table layout
            var directory = $('#dir').html();
            Mustache.parse(directory);
            if(!filtered){
                var dirData = {
                    name: path[depth - 1],
                    id: path[depth - 1].replace(/[ >()]/g,"_"),
                    Comment: dir.Comment,
                    parentID: function(){
                        if(depth >= 2)
                         return path[depth - 2].replace(/[ >()]/g,"_");
                        return null;
                    },
                    indent: function(){
                        return (depth - 1)*60;
                    },
                    depth: function(){
                        var depthArray = [];
                        for (var i = 0; i < depth - 1; i++) {
                            if(i === 0){
                                var firstSpacer = {first: "dfg "}
                                depthArray.push(firstSpacer);
                            } else {
                                depthArray.push(" ");
                            }
                        };
                        return depthArray;
                    }
                }
                var renderDir = Mustache.render(directory, dirData);

                if(depth == 1) {
                    //new table layout
                    $("#dir-tree").append(renderDir);
                } else {
                    //new table layout
                    $("#" + path[depth - 2].replace(/[ >()]/g,"_") + "a").after(renderDir);
                }
            }
            var files = fileDir[i].Files;
            for(var ii in files) {

                //new table layout
                var file = $('#file').html();
                Mustache.parse(file);   // optional, speeds up future uses
                if(!filtered){
                    files[ii].indent = (depth)*60;
                    files[ii].parentID = path[depth - 1].replace(/[ >()]/g,"_");
                    files[ii].depth =   function(){
                                            var depthArray = [];
                                            for (var i = 0; i < depth; i++) {
                                                if(i === 0){
                                                    var firstSpacer = {first: "dfg "}
                                                    depthArray.push(firstSpacer);
                                                } else {
                                                    depthArray.push(" ");
                                                }
                                            };
                                            return depthArray;
                                        }
                    var renderedFile = Mustache.render(file, files[ii]);
                    $("#" + path[depth - 1].replace(/[ >()]/g,"_") + "a").after(renderedFile);
                } else {
                    files[ii].filtered = true;
                    var renderedFile = Mustache.render(file, files[ii]);
                    $("#dir-tree").append(renderedFile);
                }
            }
        }
    }
}

function toggleDirectory(){
    var elmID;
    if($(this).hasClass("glyphicon-chevron-down")){
        $(this).removeClass("glyphicon-chevron-down");
        $(this).addClass("glyphicon-chevron-right");
        elmID = $(this).closest('tr').attr("id");
        $("." + elmID).each(collapseDir);
    } else {
        $(this).removeClass("glyphicon-chevron-right");
        $(this).addClass("glyphicon-chevron-down");
        elmID = $(this).closest('tr').attr("id");
        $("." + elmID).each(expandDir);
    }
}

function collapseDir(key, value){
    var elmID;
    if($(value).hasClass("directoryRow")){
        elmID = $(value).attr("id");
        $("." + elmID).each(collapseDir);
    }
    $(value).hide();
}
function expandDir(key, value){
    var elmID;
    if($(value).hasClass("directoryRow") && $(value).find('span.glyphicon-chevron-down').length != 0){
        elmID = $(value).attr("id");
        $("." + elmID).each(expandDir);
    }
    $(value).show();
}


$(document).ready(function () {
    "use strict";

    //Hide error and success messages on load
    $('.upload-success').hide();
    $('.delete-success').hide();
    $('.add-success').hide();
    $('.edit-success').hide();
    $('.upload-error').hide();
    $('.file-error').hide();
    $('.no-files').hide();

    renderTree();
    editCategory();

    //Open confirmation dialog on Delete click
    var id;
    $('.thedeletelink').click(deleteModal);

    //Add category modal
    $('#addCategory').click(function(){
        $('.addCategory').dialog('open');
    });

    //Upload dialog
    //File input wrapper
    //$('.file-wrapper input[type=file]').bind('change', fileInputs);

    $(".dialog-form").dialog({
        autoOpen: false,
        height: 500,
        width: 666,
        modal: true
     });

    $("#cancelButton").click(function() {
        $(".dialog-form").dialog("close");
    });

    $("#upload").click(deleteModal);

    $("#postCategory").click(postCategory);

    //The Edit file function
    $(".theeditlink").click(editModal);


    //Check form inputs before upload
    $("#uploadForm").submit(uploadForm);

    $(".loading").hide();
    $(".directory").click(toggleDirectory);

    $('.directory').popover({ trigger: "hover" });
});