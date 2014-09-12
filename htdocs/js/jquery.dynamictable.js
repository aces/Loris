(function ($ ) {
    $.fn.DynamicTable = function() {
        this.filter("table").each(function() {
            var table = $( this );
        })
        return this;
    }
}(jQuery ));
