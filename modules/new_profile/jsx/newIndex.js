import FilterForm from 'FilterForm';
import NewProfileForm from './NewProfileForm';
 class NewIndex extends React.Component {
 render() {
         return ( 
           <div>
              <NewProfileForm />
           </div>
         );
 }
}
 $(function() {
  const newIndex = (
    <div className="page-document">
      <NewIndex />
    </div>
  );
   ReactDOM.render(newIndex, document.getElementById('lorisworkspace'));
});
