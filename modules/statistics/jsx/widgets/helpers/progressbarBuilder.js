/**
 * progressBarBuilder - generates the graph content.
 *
 * @param  {object} data - data needed to generate the graph content.
 * @return {JSX.Element} the charts to render to the widget panel.
 */
const progressBarBuilder = (data) => {
  let title;
  let content;
  title = <h5>
    {data['title']}
  </h5>;
  if (data['surpassed_recruitment']) {
    content = (
      <div>
        <div className ='progress'>
          {
            data['female_percent'] &&
              <div className ='progress-bar progress-bar-female'
                role ='progressbar'
                style ={{width: `${data['female_full_percent']}%`}}
                data-toggle ='tooltip'
                data-placement ='bottom'
                title ={`${data['female_full_percent']}% female`}>
                <p>
                  {data['female_total']}<br/>Females
                </p>
              </div>
          }
          {
            data['male_percent'] &&
              <div className ='progress-bar progress-bar-male'
                data-toggle ='tooltip'
                data-placement ='bottom'
                role ='progressbar'
                style ={{width: `${data['male_full_percent']}%`}}
                title ={`${data['male_full_percent']}% male`}>
                <p>
                  {data['male_total']}<br/>Males
                </p>
              </div>
          }
          {
            data['non_binary_percent'] &&
              <div className ='progress-bar progress-bar-other'
                data-toggle ='tooltip'
                data-placement ='bottom'
                role ='progressbar'
                style ={{width: `${data['non_binary_percent']}%`}}
                title ={`${data['non_binary_percent']}% other`}>
                <p>
                  {data['non_binary_total']}<br/>Other
                </p>
              </div>
          }
          <p className ='pull-right small target'>
        Target: {data['recruitment_target']}
          </p>
        </div>
        {
          data['recruitment_target'] &&
            <small>
              Recruitment target of {data['recruitment_target']} was reached.
              {' '}{data['total_recruitment']} total participants.
            </small>
        }
      </div>
    );
  } else {
    content = (
      <>
        <div className ='progress'>
          {
            data['female_percent'] &&
              <div className ='progress-bar progress-bar-female'
                role ='progressbar'
                style ={{width: `${data['female_percent']}%`}}
                data-toggle ='tooltip'
                data-placement ='bottom'
                title ={`${data['female_percent']}% female`}>
                <p>
                  {data['female_total']}<br/>Females
                </p>
              </div>
          }
          {
            data['male_percent'] &&
              <div className ='progress-bar progress-bar-male'
                data-toggle ='tooltip'
                data-placement ='bottom'
                role ='progressbar'
                style ={{width: `${data['male_percent']}%`}}
                title ={`${data['male_percent']}% male`}>
                <p>
                  {data['male_total']}<br/>Males
                </p>
              </div>
          }
          {
            data['non_binary_percent'] &&
                <div className ='progress-bar progress-bar-other'
                  data-toggle ='tooltip'
                  data-placement ='bottom'
                  role ='progressbar'
                  style ={{width: `${data['non_binary_percent']}%`}}
                  title ={`${data['non_binary_percent']}% other`}>
                  <p>
                    {data['non_binary_total']}<br/>Other
                  </p>
                </div>
          }
          {
            data['recruitment_target'] ?
              <p className ='pull-right small target'>
                Target: {data['recruitment_target']}
              </p>
              : <p className ='pull-right small target'>
                No target set
              </p>
          }
        </div>
        {
          data['recruitment_target'] &&
            <small>
            Recruitment target of {data['recruitment_target']} not reached.
              {' '}{data['total_recruitment']} total participants.
            </small>
        }
      </>
    );
  }
  return (
    <>
      {title}
      {content}
    </>
  );
};

export {
  progressBarBuilder,
};
