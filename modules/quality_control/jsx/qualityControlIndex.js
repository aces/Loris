class QualityControlIndex extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>Quality Control!</h1>
        <h2>Other Useless thing</h2>
        <h3> UselessURL: {this.props.UselessURL}</h3>
      </div>
    );
  }
}

$(function() {
  const qualityControlIndex = (
    <div className="page-qualityControl">
      <QualityControlIndex UselessURL={`${loris.BaseURL}/quality_control`}/>
    </div>
  );

  ReactDOM.render(qualityControlIndex, document.getElementById("lorisworkspace"));
});




/*
  

$(function() {
  const qualityControl = (
    <div className="page-qualityControl">
     <h1>Quality Control Module!</h1>
    </div>
  );

  ReactDOM.render(qualityControl, document.getElementById("lorisworkspace"));
});
*/