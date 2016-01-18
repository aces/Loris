var SubprojectRelations = React.createClass({
    getDefaultProps: function() {
        return {
            "Relations" : { }
        }
    },
    render: function() {
        var subprojectIDs = Object.keys(this.props.Relations);
        var that = this;
        var subprojectList = subprojectIDs.map(function(key) {
            return <li>{that.props.Relations[key]}</li>;
        });


        return (
            <div>
                <h2>Related Subprojects</h2>
                <ul>
                    {subprojectList}
                </ul>
            </div>
        );
    }
});
RSubprojectRelations = React.createFactory(SubprojectRelations);

