/**
 *  The following file contains the base component for the data query react app.
 *  It also contains the component for the saved queries dropdown.
 *
 *  @author   Jordan Stirling <jstirling91@gmail.com>
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
*   @author   Alizée Wickenheiser <alizee.wickenheiser@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/mohadesz/Loris-Trunk
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NavigationStepper, NavigationWithSave} from './react.navigationStepper';
import {StepperPanel, ProgressBar} from './components/stepper';
import SavedQueriesList from './react.savedqueries';
import ExpansionPanels from './components/expansionpanels';
import NoticeMessage from './react.notice';
// import StatisticsReport from './components/statisticsreport';
import DataRequest from './components/datarequest';
// let dqtWorker;

let special = {
      abcd_abcls01: 'ABCL Scores',
      abcd_adbc01: 'Adult Behavior Checklist',
      abcd_ant01: 'Youth Anthropometrics Modified From PhenX (ANT)',
      abcd_asrs01: 'Parent Adult Self Report Scores Aseba (ASR)',
      abcd_auto_postqc01: 'Automated Post-Processing QC Metrics',
      abcd_betnet02: 'rsfMRI Gordon Network Correlations',
      abcd_bisbas01: 'Youth Behavioral Inhibition/Behavioral Approach System Scales Modified from PhenX (BIS/BAS)',
      abcd_bkfs01: 'Youth Block Food Screen',
      abcd_bp01: 'Youth Blood Pressure',
      abcd_bpm01: 'Youth Brief Problem Monitor',
      abcd_bpmt01: 'Brief Problem Monitor-Teacher Form For Ages 6-18 (BPMT)',
      abcd_cb01: 'Cyber Bully',
      abcd_cbcl01: 'Parent Child Behavior Checklist Raw Scores Aseba (CBCL)',
      abcd_cbcls01: 'Parent Child Behavior Checklist Scores Aseba (CBCL)',
      abcd_cna01: 'Child Nutrition Assessment',
      abcd_crpf01: 'Parent Community Risk and Protective Factors (CRPF)',
      abcd_ddtidp101: 'dMRI DTI Destrieux Parcellations Part 1',
      abcd_ddtidp201: 'dMRI DTI Destrieux Parcellations Part 2',
      abcd_ddtifp101: 'dMRI DTI Full Destrieux Parcellation Part 1',
      abcd_ddtifp201: 'dMRI DTI Full Destrieux Parcellation Part 2',
      abcd_ddtlb01: 'Delay Discounting Trial Level Behavior',
      abcd_devhxss01: 'Summary Scores Developmental History',
      abcd_dmdtifp101: 'dMRI DTI Full Part 1',
      abcd_dmdtifp202: 'dMRI DTI Full Part 2',
      abcd_drsidp101: 'dMRI RSI Destrieux Parcellation Part 1',
      abcd_drsidp201: 'dMRI RSI Destrieux Parcellation Part 2',
      abcd_drsidp301: 'dMRI RSI Destrieux Parcellation Part 3',
      abcd_dti_p101: 'dMRI DTI Part 1',
      abcd_dti_p201: 'dMRI DTI Part 2',
      abcd_earsraw01: 'Mobil Tech from EARS Raw Data',
      abcd_eatqp01: 'Early Adolescent Temperament Questionnaire Parent',
      abcd_ehis01: 'Youth Edinburgh Handedness Inventory Short Form (EHIS)',
      abcd_esttlb01: 'Emotional Stroop Task Trial Level Behavior',
      abcd_fbdpas01: 'Youth Fitbit Daily Physical Activity Summaries',
      abcd_fbdss01: 'Youth Fitbit Daily Sleep Summaries',
      abcd_fbpap01: 'Post-assessment Parent Survey for Fitbit Protocol',
      abcd_fbpay01: 'Post-assessment Youth Survey for Fitbit Protocol',
      abcd_fbprp01: 'Pre-assessment Parent Survey for Fitbit Protocol',
      abcd_fbpry01: 'Pre-assessment Youth Survey for Fitbit Protocol',
      abcd_fbwpas01: 'Youth Fitbit Weekly Physical Activity Summaries',
      abcd_fbwss01: 'Youth Fitbit Weekly Sleep Summaries',
      abcd_fes01: 'Youth Family Environment Scale-Family Conflict Subscale Modified from PhenX (FES)',
      abcd_fhxssp01: 'Parent Family History Summary Scores',
      abcd_gdss01: 'Game of Dice Summary Scores',
      abcd_gdtlb01: 'Game of Dice Trial Level Behavior',
      abcd_gish2y01: 'Youth Gish2',
      abcd_hers01: 'Youth Hair Sample',
      abcd_hsss01: 'Hormone Saliva Salimetric Scores',
      abcd_imgincl01: 'Recommended Imaging Inclusion',
      abcd_ip01: 'Irma Substudy Parent',
      abcd_isc01: 'Irma Substudy Child',
      abcd_lmtlb01: 'Little Man Task Trial Level Behavior',
      abcd_lpds01: 'Longitudinal Parent Demographics Survey',
      abcd_lpksad01: 'Longitudinal Parent Diagnostic Interview for DSM-5 Background Items Full (KSAD)',
      abcd_lpmh01: 'Longitudinal Parent Medical History Questionnaire',
      abcd_lpohstbi01: 'Longitudinal Parent Ohio State Traumatic Brain Injury Screen-Short Modified (OTBI)',
      abcd_lpsaiq01: 'Longitudinal Parent Sports and Activities Involvement Questionnaire (SAIQ)',
      abcd_lssmh01: 'Longitudinal Summary Scores Medical History',
      abcd_lsssa01: 'Longitudinal Summary Scores Sports Activity',
      abcd_lsstbi01: 'Longitudinal Summary Scores Traumatic Brain Injury',
      abcd_lt01: 'Longitudinal Tracking',
      abcd_macvsy01: 'Youth Mexican American Cultural Values Scale',
      abcd_mcqc01: 'Youth Munich Chronotype Questionnaire',
      abcd_medhxss01: 'Summary Scores Medical History',
      abcd_meim01: 'Parent Multi-Group Ethnic Identity-Revised Survey (MEIM)',
      abcd_mhp02: 'Sum Scores Mental Health Parent',
      abcd_mhy02: 'Sum Scores Mental Health Youth',
      abcd_mid02: 'Task fMRI MID Behavior',
      abcd_midabwdp01: 'Task fMRI MID Average Beta Weights Destrieux Parcellations Part 1',
      abcd_midabwdp202: 'Task fMRI MID Average Beta Weights Destrieux Parcellations Part 2',
      abcd_midasemdp101: 'Task fMRI MID Average SEM Destrieux Parcellations Part 1',
      abcd_midasemdp202: 'Task fMRI MID Average SEM Destrieux Parcellations Part 2',
      abcd_midasemp102: 'Task fMRI MID Average Standard Error of the Mean Part 1',
      abcd_midasemp202: 'Task fMRI MID Average Standard Error of the Mean Part 2',
      abcd_midr1bwdp101: 'Task fMRI MID Run 1 Beta Weights Destrieux Parcellations Part 1',
      abcd_midr1bwdp202: 'Task fMRI MID Run 1 Beta Weights Destrieux Parcellations Part 2',
      abcd_midr1bwp102: 'Task fMRI MID Run 1 Beta Weights Part 1',
      abcd_midr1bwp202: 'Task fMRI MID Run 1 Beta Weights Part 2',
      abcd_midr2semp102: 'Task fMRI MID Run 2 Standard Error of the Mean Part 1',
      abcd_midr2semp202: 'Task fMRI MID Run 2 Standard Error of the Mean Part 2',
      abcd_midsemp102: 'Task fMRI MID Run 1 Standard Error of the Mean Part 1',
      abcd_midsemp202: 'Task fMRI MID Run 1 Standard Error of the Mean Part 2',
      abcd_midtlb01: 'Task fMRI MID Trial Level Behavior',
      abcd_monet01: 'Youth Monetary Incentive Delay Task Survey Post Scan Questionnaire',
      abcd_mrfindings02: 'MR Findings',
      abcd_mri01: 'MRI Info',
      abcd_mrinback02: 'Task fMRI nBack Behavior',
      abcd_mrirsfd01: 'rsfMRI Destrieux',
      abcd_mrirstv02: 'rsfMRI Temporal Variance',
      abcd_mrisdp101: 'sMRI Destrieux Parcellation Part 1',
      abcd_mrisdp201: 'sMRI Destrieux Parcellation Part 2',
      abcd_mte01: 'Mobil Tech from EARS Company',
      abcd_mtpa01: 'Parent Mobil Tech Postassessment',
      abcd_mtpap01: 'Parent Mobil Tech Preassessment',
      abcd_mtpay01: 'Youth Mobil Tech Postassessment',
      abcd_mtpry01: 'Youth Mobil Tech Preassessment',
      abcd_mtv01: 'Mobil Tech from Vibrent Company',
      abcd_mx01: 'Parent Medical History Questionnaire (MHX)',
      abcd_nbacktlb01: 'Task fMRI nBack Trial Level Behavior',
      abcd_nsc01: 'Youth Neighborhood Safety/Crime Survey Modified from PhenX (NSC)',
      abcd_occsp01: 'Occupation Survey Parent',
      abcd_otbi01: 'Parent Ohio State Traumatic Brain Injury Screen-Short Modified (OTBI)',
      abcd_pbp01: 'Youth Peer Behavior Profile',
      abcd_peq01: 'Peer Experiences Questionnaire',
      abcd_pfb01: 'Parent Fitbit Baseline',
      abcd_pff01: 'Parent Fitbit Followup',
      abcd_pgbi01: 'Parent Parent General Behavior Inventory-Mania (PGBI)',
      abcd_pgi01: 'Parent Gender Identity',
      abcd_pksadscd01: 'Parent KSADS Conduct Disorder',
      abcd_ple01: 'Parent Life Events',
      abcd_plus01: 'Youth Participant Last Use Survey Day 1 2 3 4 (PLUS)',
      abcd_pnhps01: 'Youth Peer Network Health Protective Scaler',
      abcd_pnsc01: 'Parent Neighborhood Safety/Crime Survey Modified from PhenX (NSC)',
      abcd_ppdms01: 'Parent Pubertal Development Scale and Menstrual Cycle Survey History (PDMS)',
      abcd_pq01: 'Pain Questionnaire',
      abcd_prepost01: 'Youth Rescan Monetary Incentive Delay Task Survey Post Scan Questionnaire',
      abcd_ps01: 'Pearson Scores',
      abcd_psb01: 'Youth Prosocial Behavior Survey',
      abcd_pssrs01: 'Parent Short Social Responsiveness Scale',
      abcd_pssudse01: 'Parent Survey of Substance Use Density, Storage, and Exposure',
      abcd_ptsd01: 'Parent Diagnostic Interview for DSM-5 (KSADS) Traumatic Events',
      abcd_pxccp01: 'Parent PhenX Community Cohesion',
      abcd_ra01: 'RA Scanning Checklist and Notes',
      abcd_rhds01: 'Residential History Derived Scores',
      abcd_saag01: 'Parent School Attendance and Grades',
      abcd_saiq02: 'Parent Sports and Activities Involvement Questionnaire (SAIQ)',
      abcd_screen01: 'Screener',
      abcd_screen02: 'Follow-Up Scheduling Screener',
      abcd_sds01: 'Parent Sleep Disturbance Scale for Children (SDS)',
      abcd_siss01: 'Social Influence Summary Scores',
      abcd_sitlb01: 'Social Influence Task Trial Level Behavior',
      abcd_smrip101: 'sMRI Part 1',
      abcd_smrip201: 'sMRI Part 2',
      abcd_socdev_child_alabam01: 'Social Development Child Alabama Parenting Questionnaire',
      abcd_socdev_child_emr01: 'Social Development Child Difficulties in Emotion Regulation',
      abcd_socdev_child_fa01: 'Social Development Child Firearms',
      abcd_socdev_child_fb01: 'Social Development Child Feedback',
      abcd_socdev_child_pb01: 'Social Development Child Peer Behavior',
      abcd_socdev_child_pdis01: 'Social Development Child Personality Disposition',
      abcd_socdev_child_rde01: 'Social Development Child Reported Delinquency',
      abcd_socdev_child_vic01: 'Social Development Child Victimization',
      abcd_socdev_ctr01: 'Social Development Contact Track',
      abcd_socdev_p_alabama01: 'Social Development Parent Alabama Parenting Questionnaire',
      abcd_socdev_p_emr01: 'Social Development Parent Difficulties in Emotion Regulation',
      abcd_socdev_p_fa01: 'Social Development Parent Firearms',
      abcd_socdev_p_fb01: 'Social Development Parent Feedback',
      abcd_socdev_p_nbh01: 'Social Development Parent Neighborhood',
      abcd_socdev_p_pdis01: 'Social Development Parent Personality Disposition',
      abcd_socdev_p_rde01: 'Social Development Parent Reported Delinquency',
      abcd_socdev_p_vic01: 'Social Development Parent Victimization',
      abcd_socdev_vt01: 'Social Development Visit Type',
      abcd_spacss01: 'Summary Scores Sports Activity',
      abcd_ssbpmtf01: 'Summary Scores Brief Problem Monitor-Teacher Form for Ages 6-18',
      abcd_sscep01: 'Sum Scores Culture & Environment Parent',
      abcd_sscey01: 'Sum Scores Culture & Environment Youth',
      abcd_ssmty01: 'Sum Scores Mobil Tech Youth',
      abcd_ssphp01: 'Sum Scores Physical Health Parent',
      abcd_ssphy01: 'Sum Scores Physical Health Youth',
      abcd_sss01: 'Specialty Summary Score',
      abcd_sst02: 'Task fMRI SST Behavior',
      abcd_sst_tlb01: 'Task fMRI SST Trial Level Behavior',
      abcd_stq01: 'Youth Screen Time Survey (STQ)',
      abcd_suss01: 'Summary Scores Substance Use',
      abcd_svs01: 'Youth Snellen Vision Screener (SVS)',
      abcd_tbi01: 'Sum Scores Traumatic Brain Injury',
      abcd_tbss01: 'Youth NIH TB Summary Scores',
      abcd_tb_tlb01: 'NIH Toolbox Trial Level Behavior',
      abcd_tfabwdp101: 'Task fMRI nBack Average Beta Weights Destrieux Parcellations Part 1',
      abcd_tfabwdp201: 'Task fMRI nBack Average Beta Weights Destrieux Parcellations Part 2',
      abcd_tfnbr1semdp101: 'Task fMRI nBack Run 1 SEM Destrieux Parcellations Part 1',
      abcd_tfnbr1semdp201: 'Task fMRI nBack Run 1 SEM Destrieux Parcellations Part 2',
      abcd_tfnbr2bwdp101: 'Task fMRI nBack Run 2 Beta Weights Destrieux Parcellations Part 1',
      abcd_tfnbr2bwdp201: 'Task fMRI nBack Run 2 Beta Weights Destrieux Parcellations Part 2',
      abcd_tfnbr2dp101: 'Task fMRI nBack Run 2 SEM Destrieux Parcellations Part 1',
      abcd_tfnbr2dp201: 'Task fMRI nBack Run 2 SEM Destrieux Parcellations Part 2',
      abcd_tfncr1bwdp101: 'Task fMRI nBack Run 1 Beta Weights Destrieux Parcellations Part 1',
      abcd_tfncr1bwdp201: 'Task fMRI nBack Run 1 Beta Weights Destrieux Parcellations Part 2',
      abcd_tfsstabwdp101: 'Task fMRI SST Average Beta Weights Destrieux Parcellations Part 1',
      abcd_tfsstabwdp201: 'Task fMRI SST Average Beta Weights Destrieux Parcellations Part 2',
      abcd_tfsstasemdp101: 'Task fMRI SST Average SEM Destrieux Parcellations Part 1',
      abcd_tfsstasemdp201: 'Task fMRI SST Average SEM Destrieux Parcellations Part 2',
      abcd_tfsstr1bwdp101: 'Task fMRI SST Run 1 Beta Weights Destrieux Parcellations Part 1',
      abcd_tfsstr1bwdp201: 'Task fMRI SST Run 1 Beta Weights Destrieux Parcellations Part 2',
      abcd_tfsstr1semdp101: 'Task fMRI SST Run 1 SEM Destrieux Parcellations Part 1',
      abcd_tfsstr1semdp201: 'Task fMRI SST Run 1 SEM Destrieux Parcellations Part 2',
      abcd_tfsstr2bwdp101: 'Task fMRI SST Run 2 Beta Weights Destrieux Parcellations Part 1',
      abcd_tfsstr2bwdp201: 'Task fMRI SST Run 2 Beta Weights Destrieux Parcellations Part 2',
      abcd_tfsstr2semdp101: 'Task fMRI SST Run 2 SEM Destrieux Parcellations Part 1',
      abcd_tfsstr2semdp201: 'Task fMRI SST Run 2 SEM Destrieux Parcellations Part 2',
      abcd_tlfb01: 'Timeline Follow-back Survey Calendar Scores (TLFB)',
      abcd_tmidr1semdp101: 'Task fMRI MID Run 1 SEM Destrieux Parcellations Part 1',
      abcd_tmidr1semdp202: 'Task fMRI MID Run 1 SEM Destrieux Parcellations Part 2',
      abcd_tnbasemdp101: 'Task fMRI nBack Average SEM Destrieux Parcellations Part 1',
      abcd_tnbasemdp201: 'Task fMRI nBack Average SEM Destrieux Parcellations Part 2',
      abcd_tr2bwdp01: 'Task fMRI MID Run 2 Beta Weights Destrieux Parcellations Part 1',
      abcd_tr2bwdp202: 'Task fMRI MID Run 2 Beta Weights Destrieux Parcellations Part 2',
      abcd_tr2semdp101: 'Task fMRI MID Run 2 SEM Destrieux Parcellations Part 1',
      abcd_tr2semdp202: 'Task fMRI MID Run 2 SEM Destrieux Parcellations Part 2',
      abcd_tztab01: 'Twin Zygosity Rating',
      abcd_upps01: 'UPPS-P for Children Short Form (ABCD-version)',
      abcd_via01: 'Parent Vancouver Index of Acculturation-Short Survey (VIA)',
      abcd_y10ids01: 'Youth 10 Item Delinquency Scale',
      abcd_y7mi01: 'Youth 7-Up Mania Items',
      abcd_yam01: 'Youth Alcohol Measures',
      abcd_ybd01: 'Youth Blood Analysis',
      abcd_ycrpf01: 'Youth Community Risk and Protective Factors',
      abcd_yddss01: 'Youth Delay Discounting Sum Scores',
      abcd_ydmes01: 'Youth Discrimination Measure',
      abcd_yest01: 'Youth Emotional Stroop Task',
      abcd_yfb01: 'Youth Fitbit Baseline',
      abcd_yff01: 'Youth Fitbit Followup',
      abcd_ygi01: 'Youth Gender Identity',
      abcd_ygs01: 'Youth Genetic Saliva (RUCDR)',
      abcd_yhr01: 'Youth Hair Results',
      abcd_yksad01: 'Youth Diagnostic Interview for DSM-5 Background Items 5 (KSADS-5)',
      abcd_yle01: 'Youth Life Events',
      abcd_ymidm01: 'Youth Marijuana Illicit Drug Measures',
      abcd_ymypisu01: 'Youth Mid Year Phone Interview Substance Use',
      abcd_yn01: 'Youth Nicalert',
      abcd_ynm01: 'Youth Nicotine Measures',
      abcd_ypdms01: 'Youth Pubertal Development Scale and Menstrual Cycle Survey History (PDMS)',
      abcd_ypre101: 'Youth Pre Scan Questionnaire 1',
      abcd_ypre201: 'Youth Pre Scan Questionnaire 2',
      abcd_ypsq101: 'Youth Post Scan Questionnaire 1',
      abcd_ypsq201: 'Youth Post Scan Questionnaire 2',
      abcd_yrb01: 'Youth Youth Risk Behavior Survey Exercise Physical Activity (YRB)',
      abcd_ysaag01: 'Youth School Attendance and Grades',
      abcd_ysr01: 'Other Resilience',
      abcd_yssbpm01: 'Youth Summary Scores BPM and POA',
      abcd_ysu02: 'Youth Substance Use Interview',
      abcd_ysua01: 'Youth Substance Use Attitudes',
      abcd_ysuip01: 'Youth Substance Use Introduction and Patterns',
      abcd_ytbpai01: 'Youth NIH Toolbox Positive Affect Items',
      abcd_ytt01: 'Youth Toxicology Test',
      abcd_ywpss01: 'Youth Wills Problem Solving Scale',
      acspsw03: 'ACS Post Stratification Weights',
      aurora01: 'Mobile Data',
      biocf01: 'Youth Genetic Blood (RUCDR)',
      bteeth01: 'Youth Teeth Collection',
      cct01: 'Cash Choice Task',
      crpbi01: 'Children\'s Report of Parental Behavioral Inventory',
      dhx01: 'Developmental History Questionnaire',
      dibf01: 'Parent Diagnostic Interview for DSM-5 Background Items Full (KSADS-5)',
      dmriqc01: 'dMRI Post Processing QC',
      fes02: 'Parent Family Environment Scale-Family Conflict Subscale Modified from PhenX (FES)',
      fhxp102: 'Family History Assessment Part 1',
      fhxp201: 'Family History Assessment Part 2',
      fmriqc01: 'Manual fMRI Post-Processing QC',
      fmriresults01: 'Processed MRI Data',
      freesqc01: 'FreeSurfer QC',
      genomics_sample03: 'Genomics Sample',
      lmtp201: 'Little Man Task Summary Scores',
      macv01: 'Parent Mexican American Cultural Values Scale Modified (MACV)',
      medsy01: 'Parent Medications Survey Inventory Modified from PhenX (PMP)',
      midaparc03: 'Task fMRI MID Average Beta Weights Part 1',
      midaparcp203: 'Task fMRI MID Average Beta Weights Part 2',
      midr2bwp102: 'Task fMRI MID Run 2 Beta Weights Part 1',
      midr2bwp202: 'Task fMRI MID Run 2 Beta Weights Part 2',
      mribrec02: 'Task fMRI REC Behavior',
      mriqcrp102: 'MRI QC Raw Part 1',
      mriqcrp202: 'MRI QC Raw Part 2',
      mriqcrp302: 'MRI QC Raw Part 3',
      mrirscor02: 'rsfMRI Network to Subcortical ROI Correlations',
      mrisst02: 'Task fMRI SST Average Beta Weights',
      mrisstr1bw01: 'Task fMRI SST Run 1 Beta Weights',
      mrisstr1sem01: 'Task fMRI SST Run 1 Standard Error of the Mean',
      mrisstr2bw01: 'Task fMRI SST Run 2 Beta Weights',
      mrisstr2bwsem01: 'Task fMRI SST Run 2 Standard Error of the Mean',
      mrisstsem01: 'Task fMRI SST Average Standard Error of the Mean',
      mri_rsi_p102: 'dMRI RSI Part 1',
      mri_rsi_p202: 'dMRI RSI Part 2',
      nbackallsem01: 'Task fMRI nBack Average Standard Error of the Mean',
      nbackr101: 'Task fMRI nBack Run 1 Beta Weights',
      nbackr1sem01: 'Task fMRI nBack Run 1 Standard Error of the Mean',
      nbackr201: 'Task fMRI nBack Run 2 Beta Weights',
      nbackr2sem01: 'Task fMRI nBack Run 2 Standard Error of the Mean',
      nback_bwroi02: 'Task fMRI nBack Average Beta Weights',
      pacc01: 'Parent Acculturation Survey Modified from PhenX (ACC)',
      pasr01: 'Parent Adult Self Report Raw Scores Aseba (ASR)',
      pdem02: 'Parent Demographics Survey',
      plus01: 'Parent Participant Last Use Survey Day 2 3 4 (PLUS)',
      pmq01: 'Parental Monitoring Survey',
      pps01: 'Prodromal Psychosis Scale',
      prq01: 'Parental Rules on Substance Use',
      psb01: 'Parent Prosocial Behavior Survey',
      sph01: 'Pubertal Hormone Saliva',
      srpf01: 'School Risk and Protective Factors Survey',
      stq01: 'Parent Screen Time Survey (STQ)',
      yacc01: 'Youth Acculturation Survey Modified from PhenX (ACC)',
      yalcs01: 'Youth Alcohol Screen',
    };

/**
 * DataQueryApp component
 *
 * The following component is the data queries base element. It controls which tab is currently
 * shown, along with keeping the state of the current query being built and running the query.
 *
 */
class DataQueryApp extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      displayType: 'Cross-sectional',
      fields: [],
      criteria: {},
      sessiondata: {},
      grouplevel: 1,
      queryIDs: {
        user: [],
        shared: [],
      },
      savedQueries: {},
      queriesLoaded: false,
      alertLoaded: false,
      alertSaved: false,
      alertConflict: {
        show: false,
      },
      ActiveTab: 'Info',
      rowData: {},
      filter: {
        type: 'group',
        activeOperator: 0,
        children: [
          {
            type: 'rule',
          },
        ],
        session: [],
      },
      selectedFields: {},
      downloadableFields: {},
      loading: false,
      progressbar: {
        hidden: false,
        percentage: 0,
        message: 'LORIS is retrieving data...',
      },
      savePrompt: false,
      dataRequestPrompt: false,
      navigation: {
        disable: {
          previous: true,
          save: false,
          next: false,
        },
        index: 0,
      },
      // preload
      categories: [],
      UpdatedTime: 'Fetching when data was last updated information...',
      SavedQueries: {
        User: [],
        Shared: [],
      },
      AllSessions: [],
      Visits: [],
    };
    this.saveFilterRule = this.saveFilterRule.bind(this);
    this.saveFilterGroup = this.saveFilterGroup.bind(this);
    this.saveCurrentQuery = this.saveCurrentQuery.bind(this);
    this.overrideQuery = this.overrideQuery.bind(this);
    this.loadFilterRule = this.loadFilterRule.bind(this);
    this.loadFilterGroup = this.loadFilterGroup.bind(this);
    this.loadSavedQuery = this.loadSavedQuery.bind(this);
    this.fieldVisitSelect = this.fieldVisitSelect.bind(this);
    this.fieldChange = this.fieldChange.bind(this);
    this.getSessions = this.getSessions.bind(this);
    this.runQuery = this.runQuery.bind(this);
    this.getRowData = this.getRowData.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.resetQuery = this.resetQuery.bind(this);
    this.changeDataDisplay = this.changeDataDisplay.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.stepperClicked = this.stepperClicked.bind(this);
    this.navigationClicked = this.navigationClicked.bind(this);
    this.getSideBarVisibleStatus = this.getSideBarVisibleStatus.bind(this);
    this.displayVisualizedData = this.displayVisualizedData.bind(this);
    this.loadSavedQueries = this.loadSavedQueries.bind(this);
    this.handleProgressBarSetup = this.handleProgressBarSetup.bind(this);
    this.requestSessions = this.requestSessions.bind(this);
  }

  /**
   * display visualized data.
   */
  displayVisualizedData() {
    const state = Object.assign({}, this.state);
    state.ActiveTab = 'Statistics';
    state.navigation.index = 4;
    this.setState(state);
  }

  /**
   * Load Saved Queries
   */
  loadSavedQueries() {
    // Load the save queries' details
    let promises = [];
    for (let key in this.state.queryIDs) {
      if (this.state.queryIDs.hasOwnProperty(key)) {
        for (let i = 0; i < this.state.queryIDs[key].length; i += 1) {
          let curRequest;
          curRequest = Promise.resolve(
            $.ajax(loris.BaseURL
              + '/AjaxHelper.php?Module=dqt&script=GetDoc.php&DocID='
              + encodeURIComponent(this.state.queryIDs[key][i])), {
              data: {
                DocID: this.state.queryIDs[key][i],
              },
              dataType: 'json',
            }).then((value) => {
              let queries = this.state.savedQueries;
              queries[value._id] = value;
              this.setState({savedQueries: queries});
          });
          promises.push(curRequest);
        }
      }
    }
    Promise.all(promises).then((value) => {
      this.setState({'queriesLoaded': true});
    });
  }

  /**
   * Handle ProgressBar Setup
   * @param {function} callback
   */
  async handleProgressBarSetup(callback) {
    const response = await fetch(
      `${loris.BaseURL}/dqt/dqt_setup/?format=json`,
      {credentials: 'same-origin', method: 'GET'}
    );
    const reader = await response.body.getReader();
    const contentLength = await response.headers.get('Content-Length');
    let receivedLength = 0; // received that many bytes at the moment
    let chunks = ''; // array of received binary chunks (comprises the body)
    for (;;) {
      const {done, value} = await reader.read();
      if (done) {
        // finished reading chunks from stream reader.
        this.setState((prevState) => {
          return {
            ...prevState,
            progressbar: {
              message: 'Data Query Tool is configuring data!',
              hidden: prevState.progressbar.hidden,
              percentage: 100,
            },
          };
        });
        reader.closed.then(() => {
          let data;
          try {
            data = JSON.parse(chunks);
          } catch (exception) {
            return callback(false);
          }
          let categories = [];
          for (const [key, value] of Object.entries(data.categories)) {
            categories.push({
              category: key,
              numFields: value,
            });
          }
          data.categories = categories;
          setTimeout(async () => {
            await this.setState((prevState) => {
              return {
                ...prevState,
                progressbar: {
                  message: prevState.progressbar.message,
                  hidden: true,
                  percentage: prevState.progressbar.percentage,
                },
                queryIDs: data.savedqueries,
                categories: data.categories,
                UpdatedTime: `Data was last updated on ${data.updatetime}`,
                SavedQueries: data.savedqueries,
                Visits: data.visits,
              };
            }, () => {
              return callback(true);
            });
          }, 1200); // wait 1.2 seconds
        }).catch((error) => {
          if (error) {
            return callback(false);
          }
        });
        break;
      } else {
        // Continue reading chunks from stream reader.
        const decode = new TextDecoder('utf-8').decode(value);
        chunks += decode;
        receivedLength += value.length;
        this.setState((prevState) => {
          return {
            ...prevState,
            progressbar: {
              hidden: prevState.progressbar.hidden,
              percentage: Math.round((receivedLength / contentLength) * 100),
              message: prevState.progressbar.message,
            },
          };
        });
      }
    }
  }

  /**
   * getSessions - takes awhile if large couchdb instance.
   * @param {function} callback
   */
  async requestSessions(callback) {
    const response = await fetch(
      `${loris.BaseURL}/dqt/sessions/?format=json`,
      {credentials: 'same-origin', method: 'GET'}
    );
    const reader = await response.body.getReader();
    let chunks = ''; // array of received binary chunks (comprises the body)
    for (;;) {
      const {done, value} = await reader.read();
      if (done) {
        // finished reading chunks from stream reader.
        reader.closed.then(async () => {
          let data;
          try {
            data = JSON.parse(chunks);
          } catch (exception) {
            return callback(false);
          }
          await this.setState((prevState) => {
            return {
              ...prevState,
              filter: {
                ...prevState.filter,
                session: data.sessions,
              },
              AllSessions: data.sessions,
            };
          }, () => {
            return callback(true);
          });
        }).catch((error) => {
          if (error) {
            return callback(false);
          }
        });
        break;
      } else {
        // Continue reading chunks from stream reader.
        const decode = new TextDecoder('utf-8').decode(value);
        chunks += decode;
      }
    }
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  async componentDidMount() {
    // dqtWorker = new Worker(`${loris.BaseURL}/dqt/js/workers/dqt.worker.js`);
    // dqtWorker.onmessage = (event) => {
    //   if (event && event.data) {
    //     console.log('event is ');
    //     console.log(event);
    //   }
    // };
    // dqtWorker.postMessage({msg: 'setupCouchDB'});
    // dqtWorker.postMessage({msg: 'test', lastUpdate: 'todo'});
    // Handle Progress Bar Setup
    this.handleProgressBarSetup((success) => {
      if (success) {
        this.loadSavedQueries();
        this.requestSessions((success) => {
          if (success) {} else {
            console.error('requestSessions failed');
          }
        });
      } else {
        console.error('handleProgressBarSetup failed');
      }
    });
  }

  /**
   * save filter rule
   * @param {object} rule - sets the filter rule
   * @return {object}
   */
  saveFilterRule(rule) {
    // Used to build a filter rule for saving query
    return {
      field: rule.field,
      operator: rule.operator,
      value: rule.value,
      instrument: rule.instrument,
      visit: rule.visit,
    };
  }

  /**
   * save filter group
   * @param {object} group - sets the filter group for saving query.
   * @return {object}
   */
  saveFilterGroup(group) {
    // Used to build a filter group for saving query

    let savedFilter = {
      activeOperator: group.activeOperator,
      children: [],
    };
    // Recursively build the filter groups children
    for (let i = 0; i < group.children.length; i++) {
      if (group.children[i].type === 'rule') {
        savedFilter.children.push(this.saveFilterRule(group.children[i]));
      } else if (group.children[i].type === 'group') {
        savedFilter.children.push(this.saveFilterGroup(group.children[i]));
      }
    }
    return savedFilter;
  }

  /**
   * save current query
   * @param {string} name
   * @param {string} shared
   * @param {boolean} override
   */
  saveCurrentQuery(name, shared, override) {
    // Used to save the current query

    let filter = this.saveFilterGroup(this.state.filter);

    $.post(loris.BaseURL
      + '/AjaxHelper.php?Module=dqt&script=saveQuery.php', {
      Fields: this.state.selectedFields,
      Filters: filter,
      QueryName: name,
      SharedQuery: shared,
      OverwriteQuery: override,
    }, (data) => {
      // Once saved, add the query to the list of saved queries
      const id = JSON.parse(data).id;
      const queryIDs = this.state.queryIDs;
      if (!override) {
        if (shared === true) {
          queryIDs.Shared.push(id);
        } else {
          queryIDs.User.push(id);
        }
      }
      $.get(loris.BaseURL
        + '/AjaxHelper.php?Module=dqt&script=GetDoc.php&DocID='
        + id,
        (value) => {
          let queries = this.state.savedQueries;

          queries[value._id] = value;
          this.setState({
            savedQueries: queries,
            queryIDs: queryIDs,
            alertLoaded: false,
            alertSaved: true,
            alertConflict: {
              show: false,
            },
          });
        });
    }).fail((data) => {
      if (data.status === 409) {
        this.setState({
          alertConflict: {
            show: true,
            QueryName: name,
            SharedQuery: shared,
          },
        });
      }
    });
  }

  /**
   * override query
   */
  overrideQuery() {
    this.saveCurrentQuery(
      this.state.alertConflict.QueryName,
      this.state.alertConflict.SharedQuery,
      true
    );
  }

  /**
   * Used to load in a filter rule
   * @param {object} rule
   * @return {object} rule
   */
  loadFilterRule(rule) {
    // Used to load in a filter rule

    let script;
    if (!rule.type) {
      rule.type = 'rule';
    }

    // Get given fields of the instrument for the rule.
    // This call is made synchronously
    $.ajax({
      url: loris.BaseURL
        + '/AjaxHelper.php?Module=dqt&script=datadictionary.php',
      success: (data) => {
        rule.fields = data;
      },
      async: false,
      data: {category: rule.instrument},
      dataType: 'json',
    });

    // Find the rules selected field's data type
    for (let i = 0; i < rule.fields.length; i++) {
      if (rule.fields[i].key[1] === rule.field) {
        rule.fieldType = rule.fields[i].value.Type;
        break;
      }
    }

    // Get the sessions which meet the rules criterias.
    // TODO:    Build the sessions in the new format
    switch (rule.operator) {
      case 'equal':
      case 'isNull':
        script = 'queryEqual.php';
        break;
      case 'notEqual':
      case 'isNotNull':
        script = 'queryNotEqual.php';
        break;
      case 'lessThanEqual':
        script = 'queryLessThanEqual.php';
        break;
      case 'greaterThanEqual':
        script = 'queryGreaterThanEqual.php';
        break;
      case 'startsWith':
        script = 'queryStartsWith.php';
        break;
      case 'contains':
        script = 'queryContains.php';
        break;
      default:
        break;
    }
    $.ajax({
      url: loris.BaseURL + '/AjaxHelper.php?Module=dqt&script=' + script,
      success: (data) => {
        let i;
        let allSessions = {};
        let allCandiates = {};
        // Loop through data and divide into individual visits with unique PSCIDs
        // storing a master list of unique PSCIDs
        for (i = 0; i < data.length; i++) {
          if (!allSessions[data[i][1]]) {
            allSessions[data[i][1]] = [];
          }
          allSessions[data[i][1]].push(data[i][0]);
          if (!allCandiates[data[i][0]]) {
            allCandiates[data[i][0]] = [];
          }
          allCandiates[data[i][0]].push(data[i][1]);
        }
        rule.candidates = {
          allCandiates: allCandiates,
          allSessions: allSessions,
        };
        if (rule.visit === 'All') {
          rule.session = Object.keys(allCandiates);
        } else {
          if (allSessions[rule.visit]) {
            rule.session = allSessions[rule.visit];
          } else {
            rule.session = [];
          }
        }
      },
      async: false,
      data: {
        category: rule.instrument,
        field: rule.field,
        value: rule.value,
      },
      dataType: 'json',
    });

    return rule;
  }

  /**
   * Used to load in a filter group
   * @param {object} group
   * @return {object} group
   */
  loadFilterGroup(group) {
    // Used to load in a filter group

    // Recursively load the children on the group
    for (let i = 0; i < group.children.length; i++) {
      if (group.children[i].activeOperator) {
        if (!group.children[i].type) {
          group.children[i].type = 'group';
        }
        group.children[i] = this.loadFilterGroup(group.children[i]);
      } else {
        group.children[i] = this.loadFilterRule(group.children[i]);
      }
    }
    group.session = getSessions(group);
    return group;
  }

  /**
   * Used to load a saved query
   * Query can be saved in 2 formats:
   * params can be arrays or objects
   *
   * @param {string[]|object} fields
   * @param {object[]|object} criteria
   */
  loadSavedQuery(fields, criteria) {
    let filterState = {};
    let selectedFields = {};
    let fieldsList = [];
    this.setState({loading: true});
    if (Array.isArray(criteria)) {
      // This is used to load a query that is saved in the old format
      // so translate it into the new format, grouping the given critiras
      // into a filter group

      filterState = {
        type: 'group',
        activeOperator: 0,
        children: [],
      };
      filterState.children = criteria.map((item) => {
        let fieldInfo = item.Field.split(',');
        let rule = {
          instrument: fieldInfo[0],
          field: fieldInfo[1],
          value: item.Value,
          type: 'rule',
          visit: 'All',
        };
        switch (item.Operator) {
          case '=':
            rule.operator = 'equal';
            break;
          case '!=':
            rule.operator = 'notEqual';
            break;
          case '<=':
            rule.operator = 'lessThanEqual';
            break;
          case '>=':
            rule.operator = 'greaterThanEqual';
            break;
          default:
            rule.operator = item.Operator;
            break;
        }
        return rule;
      });

      let fieldSplit;
      fieldsList = fields;
      for (let i = 0; i < fields.length; i++) {
        fieldSplit = fields[i].split(',');
        if (!selectedFields[fieldSplit[0]]) {
          selectedFields[fieldSplit[0]] = {};
          selectedFields[fieldSplit[0]][fieldSplit[1]] = {};
          selectedFields[fieldSplit[0]].allVisits = {};
          for (let key in this.state.Visits) {
            if (this.state.Visits.hasOwnProperty(key)) {
              selectedFields[fieldSplit[0]].allVisits[key] = 1;
              selectedFields[fieldSplit[0]][fieldSplit[1]][key] = [key];
            }
          }
        } else {
          selectedFields[fieldSplit[0]][fieldSplit[1]] = {};
          for (let key in this.state.Visits) {
            if (this.state.Visits.hasOwnProperty(key)) {
              selectedFields[fieldSplit[0]].allVisits[key]++;
              selectedFields[fieldSplit[0]][fieldSplit[1]][key] = [key];
            }
          }
        }
      }
    } else {
      // Query was saved in the new format
      filterState = criteria;
      selectedFields = fields ? fields : {};
      for (let instrument in fields) {
        if (fields.hasOwnProperty(instrument)) {
          for (let field in fields[instrument]) {
            if (field !== 'allVisits') {
              fieldsList.push(instrument + ',' + field);
            }
          }
        }
      }
    }
    if (filterState.children && filterState.children.length > 0) {
      filterState = this.loadFilterGroup(filterState);
    } else {
      filterState.children = [
        {
          type: 'rule',
        },
      ];
      filterState.session = this.state.AllSessions;
    }
    this.setState({
      fields: fieldsList,
      selectedFields: selectedFields,
      filter: filterState,
      alertLoaded: true,
      alertSaved: false,
      loading: false,
    });
    for (let i = 0; i < fieldsList.length; i++) {
      $.ajax({
        url: loris.BaseURL + '/dqt/ajax/datadictionary.php',
        success: (data) => {
          if (data[0].value.IsFile) {
            let key = data[0].key[0] + ',' + data[0].key[1];
            let downloadable = this.state.downloadableFields;
            downloadable[key] = true;
            this.setState({
              downloadableFields: downloadable,
            });
          }
        },
        data: {key: fieldsList[i]},
        dataType: 'json',
      });
    }
  }

  /**
   * Used to select visits for a given field
   *
   * @param {string} action
   * @param {string} visit
   * @param {object} field
   */
  fieldVisitSelect(action, visit, field) {
    // Used to select visits for a given field
    this.setState((state) => {
      let temp = state.selectedFields[field.instrument];
      if (action === 'check') {
        // Adding a new visit for field, add visit to field and
        // increase count of visit in allVisits
        temp[field.field][visit] = visit;
        if (temp.allVisits[visit]) {
          temp.allVisits[visit]++;
        } else {
          temp.allVisits[visit] = 1;
        }
      } else {
        // Removing visit, delete visit from field
        delete temp[field.field][visit];
        // delete visit from allVisits
        delete temp.allVisits[visit];
      }
      return temp;
    });
  }

  /**
   * Used to add and remove fields from the current query being built
   * @param {object} fieldName
   * @param {object} category
   * @param {object} downloadable
   */
  fieldChange(fieldName, category, downloadable) {
    // Used to add and remove fields from the current query being built

    this.setState((state) => {
      let selectedFields = state.selectedFields;
      let fields = state.fields.slice(0);
      if (!selectedFields[category]) {
        // The given category has no selected fields, add the category to the selectedFields
        selectedFields[category] = {};
        // Add all visits to the given field for the given category
        selectedFields[category][fieldName] = JSON.parse(
          JSON.stringify(this.state.Visits)
        );
        // Add all visits to the given category, initializing their counts to 1
        selectedFields[category].allVisits = {};
        for (let key in this.state.Visits) {
          if (this.state.Visits.hasOwnProperty(key)) {
            selectedFields[category].allVisits[key] = 1;
          }
        }

        // Add field to the field list
        fields.push(category + ',' + fieldName);

        if (downloadable) {
          // If the field is downloadable add to the list of downloadable fields
          state.downloadableFields[category + ',' + fieldName] = true;
        }
      } else if (selectedFields[category][fieldName]) {
        // Remove the field from the selectedFields
        for (let key in selectedFields[category][fieldName]) {
          if (selectedFields[category][fieldName].hasOwnProperty(key)) {
            // Decrement the count of field's visits, delete visit if count is 1
            if (selectedFields[category].allVisits[key] === 1) {
              delete selectedFields[category].allVisits[key];
            } else {
              selectedFields[category].allVisits[key]--;
            }
          }
        }
        delete selectedFields[category][fieldName];

        // Find the given field in the fields list and remove it
        let idx = fields.indexOf(category + ',' + fieldName);
        fields.splice(idx, 1);

        if (Object.keys(selectedFields[category]).length === 1) {
          // If no more fields left for category, delete category from
          // selectedFields
          delete selectedFields[category];
        }

        if (downloadable) {
          // If the field was downloadable, delete it from the downloadable list
          delete state.downloadableFields[category + ',' + fieldName];
        }
      } else {
        // The category already has fields but not the desired one, add it
        if (!selectedFields[category][fieldName]) {
          selectedFields[category][fieldName] = {};
        }

        // Increment the visit count for the visit, setting it to 1 if doesn't exist
        for (let key in selectedFields[category].allVisits) {
          if (key === 'allVisits') {
            continue;
          }
          if (selectedFields[category].allVisits.hasOwnProperty(key)) {
            selectedFields[category].allVisits[key]++;
            selectedFields[category][fieldName][key] = key;
          }
        }
        fields.push(category + ',' + fieldName);
        if (downloadable) {
          // If the field is downloadable add to the list of downloadable fields
          state.downloadableFields[category + ',' + fieldName] = true;
        }
      }
      return {
        selectedFields: selectedFields,
        fields: fields,
      };
    });
  }

  /**
   * Get the sessions to be selected
   * @return {[]}
   */
  getSessions() {
    if (this.state.filter.children.length > 0) {
      // If filter exists return filter sessions
      return this.state.filter.session;
    } else {
      // Else return all sessions
      return this.state.AllSessions;
    }
  }

  /**
   * Run the current query
   * @param {string[]} fields
   */
  runQuery(fields) {
    let DocTypes = [];
    let semaphore = 0;
    let sectionedSessions;
    let ajaxComplete = () => {
        // Wait until all ajax calls have completed before computing the rowdata
        if (semaphore == 0) {
          let rowdata = this.getRowData(this.state.grouplevel);
          this.setState({
            rowData: rowdata,
            loading: false,
          });
        }
      };

    // Reset the rowData and sessiondata
    this.setState({
      rowData: {},
      sessiondata: {},
      loading: true,
    });

    // Get list of DocTypes to be retrieved
    for (let i = 0; i < fields.length; i += 1) {
      let fieldSplit = fields[i].split(',');
      let category = fieldSplit[0];

      // Check if the current category has already been queried, if so skip
      if (DocTypes.indexOf(category) === -1) {
        let sessionInfo = [];

        // Build the session data to be queried for the given category
        for (let j = 0; j < this.state.filter.session.length; j++) {
          if (Array.isArray(this.state.filter.session[j])) {
            if (this.state.selectedFields[category].allVisits[
              this.state.filter.session[j][1]
              ]) {
              sessionInfo.push(this.state.filter.session[j]);
            }
          } else {
            for (let key in this.state.selectedFields[category].allVisits) {
              if (this.state.selectedFields[
                category
                ].allVisits.hasOwnProperty(key)) {
                let temp = [];

                temp.push(this.state.filter.session[j]);
                // Add the visit to the temp variable then add to the sessions to be queried
                temp.push(key);
                sessionInfo.push(temp);
              }
            }
          }
        }

        DocTypes.push(category);
        // keep track of the number of requests waiting for a response
        semaphore++;
        sectionedSessions = JSON.stringify(sessionInfo);
        $.ajax({
          type: 'POST',
          url: loris.BaseURL
            + '/AjaxHelper.php?Module=dqt&script='
            + 'retrieveCategoryDocs.php',
          data: {
            DocType: category,
            Sessions: sectionedSessions,
          },
          dataType: 'text',
          success: (data) => {
            if (data) {
              let i;
              let row;
              let rows;
              let identifier;
              let sessiondata = this.state.sessiondata;
              data = JSON.parse(data);
              rows = data.rows;
              for (i = 0; i < rows.length; i += 1) {
                /*
                 * each row is a JSON object of the
                 * form:
                 * {
                 *  "key" : [category, pscid, vl],
                 *  "value" : [pscid, vl],
                 *  "doc": {
                 *      Meta: { stuff }
                 *      data: { "FieldName" : "Value", .. }
                 * }
                 */
                row = rows[i];
                identifier = row.value;
                if (!sessiondata.hasOwnProperty(identifier)) {
                  sessiondata[identifier] = {};
                }
                sessiondata[identifier][row.key[0]] = row.doc;
              }
              this.setState({'sessiondata': sessiondata});
            }
            semaphore--;
            ajaxComplete();
          },
        });
      }
    }
  }

  /**
   * Build the queried data to be displayed in the data table
   * @param {number} displayID
   * @return {object}
   */
  getRowData(displayID) {
    let sessiondata = this.state.sessiondata;
    let fields = this.state.fields.sort();
    let downloadableFields = this.state.downloadableFields;
    let i;
    let rowdata = [];
    let currow = [];
    let Identifiers = [];
    let RowHeaders = [];
    let fileData = [];
    let href;

    if (displayID === 0) {
      // Displaying the data in the cross-sectional way

      // Add the fields as the tables headers
      for (i = 0; fields && i < fields.length; i += 1) {
        const tempM = fields[i].split(',');
        const temp3 = special[tempM[0]]
          ? [special[tempM[0]], ',', tempM[1]]
          : fields[i];
        RowHeaders.push(fields[i]);
      }

      // Build the table rows, using the session data as the row identifier
      for (let session in sessiondata) {
        if (sessiondata.hasOwnProperty(session)) {
          currow = [];
          for (i = 0; fields && i < fields.length; i += 1) {
            let fieldSplit = fields[i].split(',');
            currow[i] = '.';
            let sd = sessiondata[session];
            if (sd[fieldSplit[0]]
              && sd[fieldSplit[0]].data[fieldSplit[1]]
              && downloadableFields[fields[i]]) {
              // If the current field has data and is downloadable, create a download link
              href = loris.BaseURL
                + '/mri/jiv/get_file.php?file='
                + sd[fieldSplit[0]].data[fieldSplit[1]];
              currow[i] = (
                <a href={href}>
                  {sd[fieldSplit[0]].data[fieldSplit[1]]}
                </a>
              );
              fileData.push('file/'
                + sd[fieldSplit[0]]._id
                + '/'
                + encodeURIComponent(sd[fieldSplit[0]].data[fieldSplit[1]])
              );
            } else if (sd[fieldSplit[0]]) {
              // else if field is not null add data and string
              currow[i] = sd[fieldSplit[0]].data[fieldSplit[1]];
            }
          }
          rowdata.push(currow);
          Identifiers.push(session);
        }
      }
    } else {
      // Displaying the data in the longitudinal way

      let Visits = {};
      let visit;
      let identifier;
      let temp;
      let colHeader;
      let index;
      let instrument;
      let fieldSplit;

      // Loop trough session data building the row identifiers and desired visits
      for (let session in sessiondata) {
        if (sessiondata.hasOwnProperty(session)) {
          temp = session.split(',');
          visit = temp[1];
          if (!Visits[visit]) {
            Visits[visit] = true;
          }
          identifier = temp[0];
          if (Identifiers.indexOf(identifier) === -1) {
            Identifiers.push(identifier);
          }
        }
      }

      // Loop through the desired fields, adding a row header for each visit if it
      // has been selected in the build phase
      for (i = 0; fields && i < fields.length; i += 1) {
        for (visit in Visits) {
          if (Visits.hasOwnProperty(visit)) {
            temp = fields[i].split(',');
            instrument = this.state.selectedFields[temp[0]];
            if (instrument
              && instrument[temp[1]]
              && instrument[temp[1]][visit]
            ) {
              const temp1 = special[temp[0]]
                ? [special[temp[0]], temp[1]]
                : fields[i];
              // RowHeaders.push(visit + ' ' + temp1);
              RowHeaders.push(visit + ' ' + fields[i]);
            }
          }
        }
      }

      // Build the row data for the giving identifiers and headers
      for (identifier in Identifiers) {
        if (Identifiers.hasOwnProperty(identifier)) {
          currow = [];
          for (colHeader in RowHeaders) {
            if (RowHeaders.hasOwnProperty(colHeader)) {
              temp = Identifiers[identifier]
                + ','
                + RowHeaders[colHeader].substr(
                  0,
                  RowHeaders[colHeader].lastIndexOf(' ')
                );
              index = sessiondata[temp];
              if (!index) {
                currow.push('.');
              } else {
                const instrument = RowHeaders[colHeader].substr(
                  RowHeaders[colHeader].lastIndexOf(' ') + 1
                ).split(',')[0];
                temp = index[instrument];
                fieldSplit = RowHeaders[colHeader].substr(
                  RowHeaders[colHeader].lastIndexOf(' ') + 1
                ).split(',');
                if (temp) {
                  if (temp.data[RowHeaders[colHeader].split(',')[1]]
                    && downloadableFields[fieldSplit[0]
                    + ',' + fieldSplit[1]]) {
                    // Add a downloadable link if the field is set and downloadable
                    href = loris.BaseURL
                      + '/mri/jiv/get_file.php?file='
                      + temp.data[RowHeaders[colHeader].split(',')[1]];
                    fileData.push('file/'
                      + temp._id
                      + '/'
                      + encodeURIComponent(temp.data[fieldSplit[1]])
                    );
                    temp = (
                      <a href={href}>
                        {temp.data[RowHeaders[colHeader].split(',')[1]]}
                      </a>
                    );
                  } else {
                    temp = temp.data[RowHeaders[colHeader].split(',')[1]];
                  }
                } else {
                  temp = '.';
                }
                currow.push(temp);
              }
            }
          }
          rowdata.push(currow);
        }
      }
    }
    return {
      rowdata: rowdata,
      Identifiers: Identifiers,
      RowHeaders: RowHeaders,
      fileData: fileData,
    };
  }

  /**
   * Used to dismiss alerts
   */
  dismissAlert() {
    this.setState({
      alertLoaded: false,
      alertSaved: false,
      alertConflict: {
        show: false,
      },
    });
  }

  /**
   * Used to reset the current query
   */
  resetQuery() {
    this.setState({
      fields: [],
      criteria: {},
      selectedFields: {},
    });
  }

  /**
   * Change the display format of the data table
   * @param {number} displayID
   */
  changeDataDisplay(displayID) {
    let rowdata = this.getRowData(displayID);
    this.setState({
      grouplevel: displayID,
      ...(rowdata.rowdata.length > 0
        ? {rowData: rowdata}
        : {rowData: {}}),
    });
  }

  /**
   * Update the filter
   * @param {object} filter
   */
  updateFilter(filter) {
    if (filter.children.length === 0) {
      filter.session = this.state.AllSessions;
    }
    this.setState({filter});
  }

  /**
   * navigation clicked
   * @param {string} command
   */
  navigationClicked(command) {
    let state = Object.assign({}, this.state);
    let step = state.ActiveTab;
    const steps = [
      'Info',
      'DefineFields',
      'DefineFilters',
      'ViewData',
      'Statistics',
    ];
    let index = steps.indexOf(step);
    switch (command) {
      case 'previous':
        index--;
        step = steps[index];
        this.stepperClicked(step, index);
        break;
      case 'next':
        index++;
        step = steps[index];
        this.stepperClicked(step, index);
        break;
      case 'save':
        this.setState({savePrompt: true});
        break;
      default:
        break;
    }
  }

  /**
   * stepper clicked
   * @param {string} step
   * @param {number} index
   */
  stepperClicked(step, index) {
    switch (step) {
      case 'Info':
        this.setState({
          activeTab: 'Info',
          navigation: {
          disable: {
            previous: true,
            save: false,
            next: false,
          },
          index: index,
        }});
        break;
      case 'ViewData':
        this.setState({
          activeTab: 'ViewData',
          navigation: {
            disable: {
              previous: false,
              save: false,
              next: true,
            },
            index: index,
        }});
        break;
      case 'Statistics':
        break;
      default:
        this.setState({navigation: {
            disable: {
              previous: false,
              save: false,
              next: false,
            },
            index: index,
          }});
        break;
    }
    this.setState({ActiveTab: step});
  }

  /**
   * get sidebar visible status
   * @return {boolean}
   */
  getSideBarVisibleStatus() {
    return (this.state.fields.length > 0
      && this.state.ActiveTab !== 'ViewData'
      && this.state.ActiveTab !== 'Statistics'
      && this.state.ActiveTab !== 'Info');
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let tabs = [];

    // Create or Load tab.
    tabs.push(
      <StepperPanel
        key={'Info'}
        TabId='Info'
        active={this.state.ActiveTab === 'Info'}
        content={(
          <>
            <h1 style={{
              color: '#0a3572',
              textAlign: 'center',
              padding: '30px 0 0 0',
            }}>
              Welcome to the ABCD Repository (Data Query Tool)
            </h1>
            <p style={{textAlign: 'center', margin: '10px 0 20px 0'}}>
              {this.state.UpdatedTime}.
            </p>
            {/* <StatisticsReport*/}
            {/*  loris={loris}*/}
            {/* />*/}
            <ExpansionPanels
              panels={[
                {
                  title: 'Instructions on how to create a query',
                  content: (
                    <>
                      <p>
                        To start a new query, use the above navigation
                        and or click on <i style={{color: '#596978'}}>
                        "Define Fields"</i>
                        &nbsp;to begin building the fields for the query.
                      </p>
                      <p>
                        You may choose to then click the navigation
                        again for the <i style={{color: '#596978'}}>
                        "Define Filters (Optional)"</i>
                        &nbsp;and define how you will filter the query data.
                      </p>
                      <p>Lastly, navigate to the <i style={{color: '#596978'}}>
                        "Run Query"</i> and run the query you built. 🙂</p><br/>
                      <p style={{textAlign: 'center'}}>
                        Please read the&nbsp;
                        <a style={{textDecoration: 'underline'}}
                           href={'https://docs.google.com/document/d/' +
                        '1E8BC9guVrXUd2KDKlX9pu0xch5Ex56lgKw34cEchaek'}
                        target='_blank'>
                          "C-BIG Repository Data Portal - Manual Of Operations"
                        </a>
                        &nbsp;document for additional information.</p>
                    </>
                  ),
                  alwaysOpen: false,
                },
                {
                  title: 'Load Existing Query',
                  content: (
                    <>
                      <ManageSavedQueriesTabPane
                        key='SavedQueriesTab'
                        TabId='SavedQueriesTab'
                        userQueries={this.state.queryIDs.user}
                        globalQueries={this.state.queryIDs.shared}
                        onSaveQuery={this.saveCurrentQuery}
                        queryDetails={this.state.savedQueries}
                        onSelectQuery={this.loadSavedQuery}
                        queriesLoaded={this.state.queriesLoaded}
                        Loading={this.state.loading}
                        savePrompt={this.state.savePrompt}
                      />
                      <SavedQueriesList
                        userQueries={this.state.queryIDs.user}
                        globalQueries={this.state.queryIDs.shared}
                        queryDetails={this.state.savedQueries}
                        queriesLoaded={this.state.queriesLoaded}
                        onSelectQuery={this.loadSavedQuery}
                        loadedQuery={this.state.loadedQuery}
                      />
                    </>
                  ),
                },
              ]}
            />
            <div className='container-fluid' style={{margin: '0px auto', maxWidth: '900px'}}>
              <button
                onClick={() => {
                  this.setState({dataRequestPrompt: true});
                }}
                style={{width: '100%',
                    padding: '18px',
                    outline: 'none',
                    color: '#fff',
                    fontSize: '15px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    backgroundColor: '#246EB6',
                    border: '1px solid #246EB6',
                    transition: '0.4s',
                }}
              >
                Controlled Data Request
              </button>
              <DataRequest
                show={this.state.dataRequestPrompt}
                onClose={() => {
                  this.setState({dataRequestPrompt: false});
                }}
              />
            </div>
          </>
        )}
      />
    );
    // Define Fields tab.
    tabs.push(
      <StepperPanel
        key={'DefineFields'}
        TabId='DefineFields'
        active={this.state.ActiveTab === 'DefineFields'}
        content={(
          <FieldSelectTabPane
            key='DefineFields'
            TabId='DefineFields'
            categories={this.state.categories}
            onFieldChange={this.fieldChange}
            selectedFields={this.state.selectedFields}
            Visits={this.state.Visits}
            fieldVisitSelect={this.fieldVisitSelect}
            Loading={this.state.loading}
            Active={this.state.ActiveTab === 'DefineFields'}
          />
        )}
      />
    );
    // Define Filters (Optional) tab.
    tabs.push(
      <StepperPanel
        key={'DefineFilters'}
        TabId='DefineFilters'
        active={this.state.ActiveTab === 'DefineFilters'}
        content={(
          <FilterSelectTabPane
            key='DefineFilters'
            TabId='DefineFilters'
            categories={this.state.categories}
            filter={this.state.filter}
            updateFilter={this.updateFilter}
            Visits={this.state.Visits}
            Loading={this.state.loading}
            Active={this.state.ActiveTab === 'DefineFilters'}
          />
        )}
      />
    );

    // Define the data displayed type and add the view data tab
    let displayType = (this.state.grouplevel === 0)
      ? 'Cross-sectional'
      : 'Longitudinal';

    // Run Query tab.
    tabs.push(
      <StepperPanel
        key={'ViewData'}
        TabId='ViewData'
        active={this.state.ActiveTab === 'ViewData'}
        content={(
          <ViewDataTabPane
            key='ViewData'
            TabId='ViewData'
            Active={this.state.ActiveTab === 'ViewData'}
            Fields={this.state.fields}
            Criteria={this.state.criteria}
            AllSessions={this.state.AllSessions}
            filter={this.state.filter}
            Sessions={this.getSessions()}
            Data={this.state.rowData.rowdata}
            RowInfo={this.state.rowData.Identifiers}
            RowHeaders={this.state.rowData.RowHeaders}
            FileData={this.state.rowData.fileData}
            onRunQueryClicked={this.runQuery}
            displayType={displayType}
            changeDataDisplay={this.changeDataDisplay}
            Loading={this.state.loading}
            runQuery={this.runQuery}
            displayVisualizedData={this.displayVisualizedData}
          />
        )}
      />
    );

    // Add the stats tab
    tabs.push(<StatsVisualizationTabPane
      key='Statistics'
      TabId='Statistics'
      Active={this.state.ActiveTab === 'Statistics'}
      Fields={this.state.rowData.RowHeaders}
      Data={this.state.rowData.rowdata}
      Loading={this.state.loading}
    />);

    let sideBar = this.getSideBarVisibleStatus()
      ? (
        <div className='col-md-3'>
          <FieldsSidebar
            Fields={this.state.fields}
            Criteria={this.state.criteria}
            resetQuery={this.resetQuery}
          />
        </div>
      )
      : null;

    let widthClass = this.getSideBarVisibleStatus()
      ? 'col-md-9'
      : 'col-md-12';

    let mySavePrompt = this.state.savePrompt ? (
      <SaveQueryDialog
        onDismissClicked={() => {
          this.setState({savePrompt: false});
        }}
        onSaveClicked={(name, shared) => {
          this.saveCurrentQuery(name, shared, 'false');
          this.setState({savePrompt: false});
        }}
      />
    ) : null;

    return (
      <>
        <ProgressBar
          message={this.state.progressbar.message}
          visible={!this.state.progressbar.hidden}
          percentage={this.state.progressbar.percentage}
        />
        <NavigationWithSave
          index={this.state.navigation.index}
          disable={this.state.navigation.disable}
          onClickHandler={this.navigationClicked}
          visible={this.state.progressbar.hidden}
        />
        <NavigationStepper
          setIndex={this.state.ActiveTab}
          stepperClicked={this.stepperClicked}
          visible={this.state.progressbar.hidden}
        />
        <NoticeMessage
          dismissAlert={this.dismissAlert}
          overrideQuery={this.overrideQuery}
          alertConflict={this.state.alertConflict}
          alertSaved={this.state.alertSaved}
          alertLoaded={this.state.alertLoaded}
        />
        {mySavePrompt}
        <div className={widthClass}>
          <div className='tab-content'>
            {tabs}
          </div>
        </div>
        {sideBar}
      </>
    );
  }
}

DataQueryApp.propTypes = {
  baseURL: PropTypes.string,
  title: PropTypes.string,
  SavedQueries: PropTypes.object,
  AllSessions: PropTypes.array,
  categories: PropTypes.array,
  Visits: PropTypes.array,
  UpdatedTime: PropTypes.string,
};
DataQueryApp.defaultProps = {
  title: 'Fields',
  SavedQueries: {
    User: [],
    Shared: [],
  },
  AllSessions: [],
  categories: [],
  Visits: [],
  UpdatedTime: 'Fetching when data was last updated information...',
};

/**
 * Render DataQueryApp on page load.
 */
window.addEventListener('load', () => {
  ReactDOM.render(
    <DataQueryApp
      baseURL={loris.BaseURL}
    />,
    document.getElementById('lorisworkspace')
  );
});
