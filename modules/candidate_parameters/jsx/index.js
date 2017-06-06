import CandidateParameters from './CandidateParameters';

const args = QueryString.get(document.currentScript.src);

/**
 * Render candidate-parameters on page load
 */
$(function() {
  const candidateParameters = (
    <div className="page-candidate-parameters">
      <CandidateParameters
        Module="candidate_parameters"
        candID={args.candID}
      />
    </div>
  );

  ReactDOM.render(candidateParameters, document.getElementById("lorisworkspace"));
});
