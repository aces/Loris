import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import i18n from 'I18nSetup';
import Loader from 'Loader';
import Panel from 'Panel';
import {setupCharts} from './helpers/chartBuilder';
import {useTranslation} from 'react-i18next';
import jaStrings from '../../locale/ja/LC_MESSAGES/statistics.json';
import hiStrings from '../../locale/hi/LC_MESSAGES/statistics.json';
import zhStrings from '../../locale/zh/LC_MESSAGES/statistics.json';
import frStrings from '../../locale/fr/LC_MESSAGES/statistics.json';

/**
 * AdminStats - a widget containing admin account statistics.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
const AdminStats = (props) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  let json = props.data;

  const [chartDetails, setChartDetails] = useState({
    'adminStats': {
      'userregistrations_bydate': {
        sizing: 11,
        title: t('User Registrations', {ns: 'statistics'}),
        filters: '',
        chartType: 'line',
        dataType: 'line',
        label: t('Registrations', {ns: 'statistics'}),
        legend: '',
        options: {line: 'line'},
        chartObject: null,
        includeTotal: false,
        titlePrefix: t('Month', {ns: 'loris'}),
        dateFormat: '%m-%Y',
      },
      'uniquelogins_bymonth': {
        sizing: 11,
        title: t('Unique Monthly Logins', {ns: 'statistics'}),
        filters: '',
        chartType: 'line',
        dataType: 'line',
        label: t('Logins', {ns: 'statistics'}),
        legend: '',
        options: {line: 'line'},
        chartObject: null,
        includeTotal: false,
        titlePrefix: t('Month', {ns: 'loris'}),
        dateFormat: '%m-%Y',
      },
    },
  });

  useEffect(() => {
    i18n.addResourceBundle('ja', 'statistics', jaStrings);
    i18n.addResourceBundle('zh', 'statistics', zhStrings);
    i18n.addResourceBundle('hi', 'statistics', hiStrings);
    i18n.addResourceBundle('fr', 'statistics', frStrings);

    let newdetails = {...chartDetails};
    newdetails['adminStats']['userregistrations_bydate']['label']
      = t('Registrations', {ns: 'statistics'});
    newdetails['adminStats']['userregistrations_bydate']['title']
      = t('User Registrations', {ns: 'statistics'});
    newdetails['adminStats']['userregistrations_bydate']['titlePrefix']
      = t('Month', {ns: 'loris'});
    newdetails['adminStats']['uniquelogins_bymonth']['label']
      = t('Logins', {ns: 'statistics'});
    newdetails['adminStats']['uniquelogins_bymonth']['title']
      = t('Unique Monthly Logins', {ns: 'statistics'});
    newdetails['adminStats']['uniquelogins_bymonth']['titlePrefix']
      = t('Month', {ns: 'loris'});
    setChartDetails(newdetails);
  }, []);

  const showChart = (section, chartID) => {
    return props.showChart(section, chartID, chartDetails, setChartDetails);
  };

  useEffect(() => {
    if (json && Object.keys(json).length !== 0) {
      const newChartDetails = {
        'adminStats': {
          ...chartDetails.adminStats,
          'userregistrations_bydate': {
            ...chartDetails.adminStats.userregistrations_bydate,
            data: json['adminstats']?.['User Registrations'],
          },
          'uniquelogins_bymonth': {
            ...chartDetails.adminStats.uniquelogins_bymonth,
            data: json['adminstats']?.['Unique Monthly Logins'],
          },
        },
      };

      setLoading(false);
      setTimeout(() => {
        setupCharts(
          t,
          false,
          newChartDetails,
          t('Total', {ns: 'loris'})
        ).then((data) => {
          setChartDetails(data);
        });
      }, 0);
      json = props.data;
    }
  }, [props.data]);

  const title = (subtitle) => t('Admin stats', {ns: 'statistics'})
    + ' — ' + t(subtitle, {ns: 'statistics'});

  return loading ? <Panel title='Admin stats'><Loader/></Panel> : (
    <Panel
      title={t('Admin stats', {ns: 'statistics'})}
      id='statistics_adminstats'
      onChangeView={() => {
        setupCharts(t, false, chartDetails, t('Total', {ns: 'loris'}));
      }}
      views={[
        {
          content:
            showChart('adminStats', 'userregistrations_bydate'),
          title: title('User Registrations'),
        },
        {
          content:
            showChart('adminStats', 'uniquelogins_bymonth'),
          title: title('Unique Monthly Logins'),
        },
      ]}
    />
  );
};

AdminStats.propTypes = {
  data: PropTypes.object,
  baseURL: PropTypes.string,
  showChart: PropTypes.func,
};

AdminStats.defaultProps = {
  data: {},
};

export default AdminStats;
