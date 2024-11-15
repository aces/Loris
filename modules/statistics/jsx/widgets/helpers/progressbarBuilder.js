/**
 * progressBarBuilder - generates the graph content.
 *
 * @param {object} data - data needed to generate the graph content.
 * @return {JSX.Element} the charts to render to the widget panel.
 */
const progressBarBuilder = (data) => {
  let title;
  let content;
  if (data['recruitment_target']) {
    title = <h5>
      {data['title']}
    </h5>;
    if (data['surpassed_recruitment']) {
      content = (
        <div>
          <p>
              The recruitment target (
            {data['recruitment_target']}
              ) has been passed.
          </p>
          <div className='progress'>
            <div className='progress-bar progress-bar-female'
              role='progressbar'
              style={{width: `${data['female_full_percent']}%`}}
              data-toggle='tooltip'
              data-placement='bottom'
              title={`${data['female_full_percent']}%`}>
              <p>
                {data['female_total']}<br/>Females
              </p>
            </div>
            <div className='progress-bar progress-bar-male'
              data-toggle='tooltip'
              data-placement='bottom'
              role='progressbar'
              style={{width: `${data['male_full_percent']}%`}}
              title={`${data['male_full_percent']}%`}>
              <p>
                {data['male_total']}<br/>Males
              </p>
            </div>
            <p className='pull-right small target'>
                Target: {data['recruitment_target']}
            </p>
          </div>
        </div>
      );
    } else {
      content = (
        <div className='progress'>
          <div className='progress-bar progress-bar-female'
            role='progressbar'
            style={{width: `${data['female_percent']}%`}}
            data-toggle='tooltip'
            data-placement='bottom'
            title={`${data['female_percent']}%`}>
            <p>
              {data['female_total']}<br/>Females
            </p>
          </div>
          <div className='progress-bar progress-bar-male'
            data-toggle='tooltip'
            data-placement='bottom'
            role='progressbar'
            style={{width: `${data['male_percent']}%`}}
            title={`${data['male_percent']}%`}>
            <p>
              {data['male_total']}<br/>Males
            </p>
          </div>
          <p className='pull-right small target'>
              Target: {data['recruitment_target']}
          </p>
        </div>
      );
    }
  } else {
    content = (
      <div>
          Please add a recruitment target for {data['title']}.
      </div>
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
