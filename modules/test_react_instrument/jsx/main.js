import Instrument from "./Instrument";

window.setData = function(containerId, metadata) {
  ReactDOM.render(
        <Instrument metadata={metadata}/>,
        document.getElementById(containerId)
    );
};
