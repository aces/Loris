/**
 * progressBarBuilder - generates the graph content.
 *
 * @param {function} t - i18next React translation callback
 * @param {object} data - data needed to generate the graph content.
 * @return {JSX.Element} the charts to render to the widget panel.
 */
const progressBarBuilder = (t, data) => {
  const exceededTarget = Boolean(data['surpassed_recruitment']);
  const sexBreakdown = Array.isArray(data['sex_breakdown'])
    ? data['sex_breakdown']
    : [];
  const totalRecruitment = Number(data['total_recruitment']) || 0;
  const formatPercent = (value) => `${(Number(value) || 0).toFixed(1)}%`;
  const renderSegment = (sexData) => {
    const total = Number(sexData.total) || 0;
    const width = exceededTarget
      ? (totalRecruitment > 0 ? total / totalRecruitment * 100 : 0)
      : Number(sexData.target_percent) || 0;

    if (!width) {
      return null;
    }

    return <div
      key={sexData.key || sexData.label}
      className ='progress-bar'
      role ='progressbar'
      style ={{
        width: `${width}%`,
        backgroundColor: sexData.colour || '#000000',
      }}
      data-toggle ='tooltip'
      data-placement ='bottom'
      title ={
        `${sexData.label}:
          ${sexData.total} participants
          (${formatPercent(width)})`
      }>
      <p>
        {sexData.total}<br/>
        {sexData.label}
      </p>
    </div>;
  };

  let title;
  let content;
  title = <h5>
    {data['title']}
  </h5>;
  if (exceededTarget) {
    content = (
      <div>
        <div className ='progress'>
          {sexBreakdown.map(renderSegment)}
          <p className ='pull-right small target'>
            {t(
              'Target: {{target}}',
              {'target': data['recruitment_target'], 'ns': 'statistics'}
            )}
          </p>
        </div>
        {
          data['recruitment_target'] &&
            <small>
              {t(
                'Recruitment target of {{target}} was reached.',
                {'target': data['recruitment_target'], 'ns': 'statistics'}
              )}
              {' '}{t(
                '{{total}} total participants.',
                {'total': data['total_recruitment'], 'ns': 'statistics'}
              )}
            </small>
        }
      </div>
    );
  } else {
    content = (
      <>
        <div className ='progress'>
          {sexBreakdown.map(renderSegment)}
          {
            data['recruitment_target'] ?
              <p className ='pull-right small target'>
                {t(
                  'Target: {{target}}',
                  {'target': data['recruitment_target'], 'ns': 'statistics'}
                )}
              </p>
              : <p className ='pull-right small target'>
                {t('No target set', {ns: 'statistics'})}
              </p>
          }
        </div>
        {
          data['recruitment_target'] &&
            <small>
              {t(
                'Recruitment target of {{target}} was not reached.',
                {'target': data['recruitment_target'], 'ns': 'statistics'}
              )}
              {' '}{t(
                '{{total}} total participants.',
                {'total': data['total_recruitment'], 'ns': 'statistics'}
              )}
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
