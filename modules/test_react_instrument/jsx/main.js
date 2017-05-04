import Instrument from "./Instrument";

window.setData = function (container_id, metadata) {
    ReactDOM.render(
        <Instrument metadata={metadata}/>,
        document.getElementById(container_id)
    );
};