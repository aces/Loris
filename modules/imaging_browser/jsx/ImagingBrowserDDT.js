/**
 * Created by dblader on 7/25/17.
 */
/* exported RImagingBrowserDDT */
class ImagingBrowserDDT extends DynamicDataTable {
//var ImagingBrowserDDT = DynamicDataTable.extend({
  render() {
    if (!this.state.isLoaded) {
      if (this.state.error !== undefined) {
        return <div className="alert alert-danger">
          <strong>
            {this.state.error}
          </strong>
        </div>;
      }

      return <button className="btn-info has-spinner">
        Loading
        <span className="glyphicon
                     glyphicon-refresh glyphicon-refresh-animate">
                     </span>
      </button>;
    }

    return (
      <ImagingBrowserSDT Headers={this.state.Headers}
                       Data={this.state.Data}
                       Filter={this.props.Filter}
                       getFormattedCell={this.props.getFormattedCell}
                       freezeColumn={this.props.freezeColumn}
      />
    );
  }
}

var RImagingBrowserDDT = React.createFactory(ImagingBrowserDDT);

window.ImagingBrowserDDT = ImagingBrowserDDT;
window.RImagingBrowserDDT = RImagingBrowserDDT;

export default ImagingBrowserDDT;
