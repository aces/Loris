import Instrument from "./Instrument";

window.setData = function (container_id, data) {
    ReactDOM.render(
        <Instrument data={data}/>,
        document.getElementById(container_id)
    );
};