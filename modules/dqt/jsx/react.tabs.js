/**
 *  The following file contains the components used for displaying the tab content
 *
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @author   Jordan Stirling <jstirling91@gmail.com>
*   @author   Alizée Wickenheiser <alizee.wickenheiser@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/mohadesz/Loris-Trunk
 */

import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';
import DataRequest from './components/datarequest';
import DataTable from './components/table';
import swal from 'sweetalert2';

let special = {
      // CandID: 'example',
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
 * Loading Component
 *
 * The following component is used to indicate to users
 * that their data is currently loading.
 *
 * @param {object} props - React Component properties
 * @return {JSX} - React markup for the component
 */
let Loading = (props) => {
  return (
    <div className='row' style={{padding: '60px 0 0 0'}}>
      <h2 className='text-center loading-header'>
        We are currently working hard to load your data.
      </h2>
      <h3 className='text-center loading-header'>
        Please be patient 😴
      </h3>
      <div className='spinner'>
        <div className='bounce1'/>
        <div className='bounce2'/>
        <div className='bounce3'/>
      </div>
    </div>
  );
};

/**
 * TabPane component
 * The following component is the base component for displaying the tab's content
 *
 * @param {object} props - React Component properties
 * @return {JSX} - React markup for the component
 */
const TabPane = (props) => {
  let classList = 'tab-pane';
  if (props.Active) {
    classList += ' active';
  }
  if (props.Loading) {
    return (
      <div className={classList} id={props.TabId}>
        <Loading/>
      </div>
    );
  }
  return (
    <div key={props.TabId}className={classList} id={props.TabId}>
      <h1>{props.Title}</h1>
      {props.children}
    </div>
  );
};

/**
 * InfoTabPane Component
 * The following component is used for displaying the info tab content
 *
 * @param {object} props - React Component properties
 * @return {JSX} - React markup for the component
 */
let InfoTabPane = (props) => {
  return (
    <TabPane
      Title='Welcome to the Data Query Tool'
      TabId={props.TabId}
      Active={props.Active}
      Loading={props.Loading}
    >
      <p>Data was last updated on {props.UpdatedTime}.</p>
      <p>Please define or use your query by using the following tabs.</p>
      <dl>
        <dt>Define Fields</dt>
        <dd>Define the fields to be added to your query here.</dd>
        <dt>Define Filters</dt>
        <dd>Define the criteria to filter the data for your query here.</dd>
        <dt>View Data</dt>
        <dd>See the results of your query.</dd>
        <dt>Statistical Analysis</dt>
        <dd>Visualize or see basic statistical
          &nbsp;measures from your query here.</dd>
        <dt>Load Saved Query</dt>
        <dd>Load a previously saved query (by name)
          &nbsp;by selecting from this menu.</dd>
        <dt>Manage Saved Queries</dt>
        <dd>Either save your current query or see the
          &nbsp;criteria of previously saved quer ies here.</dd>
      </dl>
    </TabPane>
  );
};

/**
 * FieldSelectTabPane Component
 * The following component is used for displaying the field select tab content
 *
 * @param {object} props - React Component properties
 * @return {JSX} - React markup for the component
 */
let FieldSelectTabPane = (props) => {
  return (
    <TabPane
      TabId={props.TabId}
      Loading={props.Loading}
      Active={props.Active}
    >
      <FieldSelector
        title='Fields'
        items={props.categories}
        onFieldChange={props.onFieldChange}
        selectedFields={props.selectedFields}
        Visits={props.Visits}
        fieldVisitSelect={props.fieldVisitSelect}
      />
    </TabPane>
  );
};

/**
 * FilterSelectTabPane Component
 * The following component is used for displaying the filter builder tab content
 *
 * @param {object} props - React Component properties
 * @return {JSX} - React markup for the component
 */
let FilterSelectTabPane = (props) => {
  return (
    <TabPane TabId={props.TabId} Loading={props.Loading}>
      <FilterBuilder items={props.categories}
                     updateFilter={props.updateFilter}
                     filter={props.filter}
                     Visits={props.Visits}
                     Active={props.Active}
      />
    </TabPane>
  );
};

/**
 * ViewDataTabPane Component
 * The following component is used for displaying the view data tab content
 *
 * @param {object} props - React Component properties
 * @return {JSX} - React markup for the component
 */
class ViewDataTabPane extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      sessions: [],
      dataDisplay: 'Longitudinal',
      runQueryClicked: false,
      dataRequestPrompt: false,
    };

    this.handleDataDisplay = this.handleDataDisplay.bind(this);
    this.runQuery = this.runQuery.bind(this);
    this.changeDataDisplay = this.changeDataDisplay.bind(this);
    this.getOrCreateProgressElement
      = this.getOrCreateProgressElement.bind(this);
    this.getOrCreateDownloadLink = this.getOrCreateDownloadLink.bind(this);
    this.downloadData = this.downloadData.bind(this);
    this.downloadDataCSV = this.downloadDataCSV.bind(this);
    this.exportToNeuroHub = this.exportToNeuroHub.bind(this);
  }

  /**
   * Handle data display
   *
   * @param {object} formElement
   * @param {string} value
   */
  handleDataDisplay(formElement, value) {
    const state = Object.assign({}, this.state);
    state.dataDisplay = value;
    this.setState(state);
    switch (value) {
      case 'Cross-sectional':
        this.changeDataDisplay(0);
        break;
      case 'Longitudinal':
        this.changeDataDisplay(1);
        break;
      default:
        break;
    }
  }

  /**
   * Run query clicked
   */
  runQuery() {
    this.setState({
      runQueryClicked: true,
    });
    this.props.runQuery(this.props.Fields, this.props.Sessions);
  }

  /**
   * Wrapper function to change the data display type
   *
   * @param {number} displayID
   */
  changeDataDisplay(displayID) {
    this.props.changeDataDisplay(displayID);
  }

  /**
   * Helper function to display the progress of downloading the downloadable
   * fields into a ZIP folder
   *
   * @param {string} id
   * @return {object}
   */
  getOrCreateProgressElement(id) {
    // Helper function to display the progress of downloading the downloadable
    // fields into a ZIP folder
    let element = document.getElementById(id);
    let progress;

    if (element) {
      return element;
    }

    progress = document.getElementById('progress');

    element = document.createElement('div');
    element.setAttribute('id', id);
    progress.appendChild(element);
    return element;
  }

  /**
   * Helper function to create and click a downloadable link to download the
   * downloadable fields into a ZIP folder
   *
   * @param {string} fileName
   * @param {string} type
   * @return {object}
   */
  getOrCreateDownloadLink(fileName, type) {
    // Helper function to create and click a downloadable link to download the
    // downloadable fields into a ZIP folder
    let element = document.getElementById('DownloadLink' + fileName);
    let parentEl;
    let el2;

    if (element) {
      return element;
    }


    parentEl = document.getElementById('downloadlinksUL');

    element = document.createElement('a');
    element.download = fileName;
    element.type = type;
    element.textContent = 'Zip file: ' + fileName;
    element.setAttribute('id', 'DownloadLink' + fileName);
    el2 = document.createElement('li');
    el2.appendChild(element);
    parentEl.appendChild(el2);
    return element;
  }

  /**
   * Download the downloadable fields into a ZIP folder
   * Makes use of a web worker to format and download the data
   */
  downloadData() {
    // Download the downloadable fields into a ZIP folder
    // Makes use of a web worker to format and download the data
    // eslint-disable-next-line no-unused-vars
    let zip = new JSZip();
    let FileList = this.props.FileData;
    let saveworker;
    let dataURLs = [];
    // eslint-disable-next-line no-unused-vars
    let multiLinkHandler = (buffer) => {
      return ((ce) => {
        let downloadLink = document.getElementById('DownloadLink');
          let dv = new DataView(buffer);
          let blb;

        ce.preventDefault();
        blb = new Blob([dv], {type: 'application/zip'});

        downloadLink.href = window.URL.createObjectURL(blb);
        downloadLink.download = this.download;
        downloadLink.type = 'application/zip';
        downloadLink.click();

        window.URL.revokeObjectURL(downloadLink.href);
      });
    };

    // Does this work if we hold a global reference instead of a closure
    // to the object URL?
    window.dataBlobs = [];

    if (FileList.length === 0) {
      alert('No files to download');
    }

    if (FileList.length < 100
      || confirm('You are trying to download more than 100 files. ' +
        'This may be slow or crash your web browser.\n\n' +
        'You may want to consider splitting your query into more, ' +
        'smaller queries by defining more restrictive filters.\n\n' +
        'Press OK to continue with attempting to download current ' +
        'files or cancel to abort.')) {
      saveworker = new Worker(loris.BaseURL + '/dqt/js/workers/savezip.js');
      saveworker.addEventListener('message', (e) => {
        let link;
        let progress;
        let FileName;
        let NewFileName;
        let downloadLinks;
        let i;
        if (e.data.cmd === 'SaveFile') {
          progress = this.getOrCreateProgressElement('download_progress');
          // progress.textContent = "Downloaded files";
          // hold a reference to the blob so that chrome doesn't release it. This shouldn't
          // be required.
          window.dataBlobs[e.data.FileNo - 1]
            = new Blob([e.data.buffer], {type: 'application/zip'});
          dataURLs[e.data.FileNo - 1]
            = window.URL.createObjectURL(window.dataBlobs[e.data.FileNo - 1]);
          link
            = this.getOrCreateDownloadLink(e.data.Filename, 'application/zip');
          link.href = dataURLs[e.data.FileNo - 1];
          // link.onclick = multiLinkHandler(e.data.buffer);
          // link.href = "#";
          progress = this.getOrCreateProgressElement('zip_progress');
          progress.textContent = '';
        } else if (e.data.cmd === 'Progress') {
          progress = this.getOrCreateProgressElement('download_progress');
          progress.innerHTML = 'Downloading files: <progress value="'
            + e.data.Complete + '" max="'
            + e.data.Total + '">'
            + e.data.Complete
            + ' out of '
            + e.data.Total
            + '</progress>';
        } else if (e.data.cmd === 'Finished') {
          if (dataURLs.length === 1) {
            $('#downloadlinksUL li a')[0].click();
          }

          if (dataURLs.length > 1) {
            progress = document.getElementById('downloadlinks');
            progress.style.display = 'initial';

            downloadLinks = $('#downloadlinksUL li a');
            for (i = 0; i < dataURLs.length; i += 1) {
              FileName
                = downloadLinks[i].id.slice('DownloadLinkFiles-'.length, -4);
              NewFileName
                = 'files-' + FileName + 'of' + e.data.NumFiles + '.zip';
              downloadLinks[i].download = NewFileName;
              downloadLinks[i].href = dataURLs[i];
              downloadLinks[i].textContent = 'Zip file: ' + NewFileName;
            }
          }
          progress = this.getOrCreateProgressElement('download_progress');
          progress.textContent = 'Finished generating zip files';
          // this.terminate();
        } else if (e.data.cmd === 'CreatingZip') {
          progress = this.getOrCreateProgressElement('zip_progress');
          progress.textContent = 'Creating a zip file with current batch ' +
            'of downloaded files. Process may be slow before proceeding.';
        }
      });

      saveworker.postMessage({Files: FileList, BaseURL: loris.BaseURL});
    }
  }

  /**
   * Download table data as csv.
   */
  downloadDataCSV() {
    document.querySelector('.downloadCSV').click();
  }

  /**
   * exportToNeuroHub
   */
  exportToNeuroHub() {
    // mimick downloadCSV but send csv file to /data/genetics/NeuroHub instead of browser
    let csvworker = new Worker(loris.BaseURL + '/js/workers/savecsv.js');
    const tableData = this.props.Data;
    csvworker.addEventListener('message', function(e) {
      if (e.data.cmd === 'SaveCSV' && tableData != undefined) {
        const postObject = new FormData();
        const dataDate = new Date().toISOString();
        const filename = 'data-' + dataDate + '.csv';
        postObject.append('file', e.data.message, filename);
        swal.fire({
          title: 'Proceed with export?',
          html: 'Please provide your NeuroHub API token.<br><br>' +
            'You can generate a new token in the `My account` page of NeuroHub' +
            ' using the `Generate new API token` button in the ' +
            '<a target="_blank" href="https://portal.cbrain.mcgill.ca/">CBRAIN`s user interface</a>.<br>' +
            'A CBRAIN file list will be created in your default dataprovider.',
          width: '60%',
          input: 'text',
          inputValidator: (value) => {
            if (!value) {
              return 'NeuroHub token is required.';
            }
          },
          inputPlaceholder: 'NeuroHub API token',
          showCancelButton: true,
          confirmButtonText: 'Yes, export',
          showLoaderOnConfirm: true,
          preConfirm: (token) => {
            postObject.append('token', token);
            return fetch(`${loris.BaseURL}/dqt/Export`, {
              method: 'POST',
              cache: 'no-cache',
              credentials: 'same-origin',
              body: postObject,
            })
            .then((resp) => {
              if (!resp.ok) {
                throw new Error(resp.statusText);
              }
              return resp.json();
            })
            .catch((error) => {
              swal.showValidationMessage(
                `Request failed: ${error}`
              );
            });
          },
          allowOutsideClick: false,
        }).then((result) => {
          console.log(result);
          swal.fire({
            title: 'Export Successful!',
            html: '<a href="' + result.value.images_location +
              '" target="_blank">Images</a><br>' +
              '<a href="' + result.value.data_location +
              '" target="_blank">Data</a>',
          });
        });
      }
    });
    // Modify table data for readable csv
    const correctReactLinks = (csvData) => {
      const newCsvData = csvData.map((data, dataIndex) => {
        const newData = data.map((value, valueIndex) => {
          let result = [value];
          if (value == null) {
            result = [''];
          } else {
            if (value.type === 'a') {
              result = [value.props.href];
            } else if (value.type === 'span') {
              if (Array.isArray(value.props.children)) {
                const children = value.props.children.map((child, childIndex) => {
                  let childresult = child;
                  if (child.props && child.props.href) {
                    childresult = child.props.href;
                  }
                  return childresult;
                });
                result = [children.join('')];
              } else {
                result = [value.props.children.props.href];
              }
            }
          }
          return result;
        });
        return newData;
      });
      return newCsvData;
    };
    const csvExport = correctReactLinks([...tableData]);
    // create CSV from data
    csvworker.postMessage({
      cmd: 'SaveFile',
      data: csvExport,
      headers: this.props.RowHeaders,
      identifiers: this.props.RowInfo,
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let otherButtons = this.state.runQueryClicked ? (
      <>
        <div className='flex-row-item'>
          <button className='action-btn visualized-data'
                  onClick={this.props.displayVisualizedData}>
            <span className='glyphicon glyphicon-picture'/>
            &nbsp;Visualized Data
          </button>
        </div>

        <div className='flex-row-item'>
          <button
            onClick={() => {
              this.setState({dataRequestPrompt: true});
            }}
            className='action-btn request-data'
          >
            <span className='glyphicon glyphicon-list-alt'/>
            &nbsp;Controlled Data Request
          </button>
        </div>
        <DataRequest
          show={this.state.dataRequestPrompt}
          onClose={() => {
            this.setState({dataRequestPrompt: false});
          }}
        />

        <div className='flex-row-item'>
          <div style={{
            width: 'auto',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <button className='btn btn-primary'
                    onClick={this.downloadDataCSV}
                    style={{minWidth: '200px',
                      minHeight: '30px',
                      alignSelf: 'center',
                      margin: '5px 0 5px 0',
                    }}>
              Download Table as CSV
              &nbsp;<span className='glyphicon glyphicon-download-alt'/>
            </button>
            <button className='btn btn-primary'
                    style={{
                      minWidth: '200px',
                      minHeight: '30px',
                      alignSelf: 'center',
                      margin: '5px 0 5px 0',
                    }}
                    onClick={this.downloadData}>
              Download Files
              &nbsp;<span className='glyphicon glyphicon-download-alt'/>
            </button>
            <button className='btn btn-primary'
                    style={{
                      minWidth: '200px',
                      minHeight: '30px',
                      alignSelf: 'center',
                      margin: '5px 0 5px 0',
                    }}
                    onClick={this.exportToNeuroHub}>
              Export Results To NeuroHub
            </button>
          </div>
        </div>
      </>
    ) : null;

    let sessionsEmpty = this.props.filter.session.length === 0;
    if (this.props.AllSessions.length > 0) {
      sessionsEmpty = false;
    }
    let disabledMessage = this.props.Fields === undefined ||
                      this.props.Fields.length === 0 ?
      'Define Field or load an existing query before query can run' : null;
    if (!disabledMessage && sessionsEmpty) {
      disabledMessage =
        'Data Query Tool is retrieving sessions before query can run';
    }
    let animationloading = disabledMessage
    === 'Data Query Tool is retrieving sessions before query can run' ? (
      <div className='spinner' style={{margin: '10px auto 0'}}>
        <div className='bounce1'/>
        <div className='bounce2'/>
        <div className='bounce3'/>
      </div>
    ) : null;

    let buttons = (
      <>
        <div className='flex-row-container'>
          <div className='flex-row-item'>
            {sessionsEmpty ||
            this.props.Fields === undefined ||
            this.props.Fields.length === 0 ? (
              <div style={{
                color: '#0b4681',
                textAlign: 'center',
                fontWeight: 'bolder',
              }}>
                {animationloading}{disabledMessage}
              </div>
            ) : null}
            <button className='action-btn run-query'
                    onClick={this.runQuery}
                    disabled={(sessionsEmpty ||
                      this.props.Fields === undefined ||
                      this.props.Fields.length === 0
                    )}
            >
              <span className='glyphicon glyphicon-play'/>
              &nbsp;Run Query
            </button>
          </div>
          {otherButtons}
        </div>
        <div className='row'>
          <div id='progress' className='col-xs-12'/>
          <div id='downloadlinks' className='col-xs-12'>
            <ul id='downloadlinksUL'/>
          </div>
        </div>
      </>
    );
    let criteria = [];
    for (let el in this.props.Criteria) {
      if (!this.props.Criteria.hasOwnProperty(el)) {
        continue;
      }
      let item = this.props.Criteria[el];
      if (item === undefined) {
        criteria.push(
          <div className='alert alert-warning' role='alert'>
            {el} has been added as a filter but not had criteria defined.
          </div>
        );
      } else {
        criteria.push(
          <div className='row'>
            <span className='col-sm-3'>{el}</span>
            <span className='col-sm-3'>{item.operator}</span>
            <span className='col-sm-3'>{item.value}</span>
          </div>
        );
      }
    }
    let rowHeaders = [];
    const numberLength = this.props.RowHeaders
      ? this.props.RowHeaders.length
      : 0;
    for (let i=0; i<numberLength; i++) {
      let myTemp = this.props.RowHeaders[i];
      const lastIndex = myTemp.lastIndexOf(',');
      const stringAfterComma = myTemp.substring(lastIndex + 1);
      const stringBeforeComma = myTemp.substring(0, lastIndex);
      myTemp = special[stringAfterComma]
        ? `${stringBeforeComma}, ${special[stringAfterComma]}`
        : myTemp;
      rowHeaders.push(myTemp);
    }

    const queryTable = this.state.runQueryClicked ? (
      <DataTable
        // Headers={this.props.RowHeaders}
        Headers={rowHeaders}
        RowNumLabel='Identifiers'
        Data={this.props.Data}
        RowNameMap={this.props.RowInfo}
      />
    ) : (
      <>
        <h2 className='col-xs-12' style={{color: '#0A3572'}}>
          The Query still needs to be run.
        </h2>
      </>
    );

    return (
      <TabPane
        TabId={this.props.TabId}
        Loading={this.props.Loading}
        Active={this.props.Active}
      >
        {criteria}
        {buttons}
        <div className='flex-row-container-second'>
          <div style={{
            maxWidth: '500px',
            border: '1px solid #b7ccd2',
            boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.05)',
          }}>
            <RadioElement
              name='dataDisplayRadioElement'
              options={{
                'Cross-sectional': 'Cross-sectional',
                'Longitudinal': 'Longitudinal',
              }}
              checked={this.state.dataDisplay}
              onUserInput={this.handleDataDisplay}
            />
          </div>
        </div>
        {queryTable}
      </TabPane>
    );
  }
}

ViewDataTabPane.propTypes = {
  runQuery: PropTypes.func.isRequired,
};

/**
 * ScatterplotGraph Component
 *
 * The following component is used for displaying the scatterplot graph
 * in the stats tab using flot. The following code is a modification of
 * code used in the couchApp implementation of the DQT
 */
class ScatterplotGraph extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {};
    this.lsFit = this.lsFit.bind(this);
    this.minmaxx = this.minmaxx.bind(this);
    this.updateScatterplot = this.updateScatterplot.bind(this);
  }

  /**
   * lsFit statistics
   * @param {[]} data
   * @return {number[]}
   */
  lsFit(data) {
    let i = 0;
      let means = jStat(data).mean();
      let xmean = means[0];
      let ymean = means[1];
      let numerator = 0;
      let denominator = 0;
      let slope;
      let xi;
      let yi;

    for (i = 0; i < data.length; i += 1) {
      xi = data[i][0];
      yi = data[i][1];
      numerator += (xi - xmean) * (yi - ymean);
      denominator += ((xi - xmean) * (xi - xmean));
    }

    slope = numerator / denominator;

    return [(ymean - slope * xmean), slope];
  }

  /**
   * minmaxx statistics
   * @param {[]} arr
   * @return {number[]}
   */
  minmaxx(arr) {
    let i; let min; let max;

    for (i = 0; i < arr.length; i += 1) {
      if (arr[i][0] < min || min === undefined) {
        if (arr[i][0] !== undefined && arr[i][0] !== null) {
          min = arr[i][0];
        }
      }
      if (arr[i][0] > max || max === undefined) {
        if (arr[i][0] !== undefined && arr[i][0] !== null) {
          max = arr[i][0];
        }
      }
    }
    return [min, max];
  }

  /**
   * updateScatterplot graph data
   */
  updateScatterplot() {
    let xaxis = document.getElementById('scatter-xaxis').value;
      let yaxis = document.getElementById('scatter-yaxis').value;
      let grouping = document.getElementById('scatter-group').value;
      let data = this.props.Data;
      let points = [];
      let min;
      let max;
      let field1 = [];
      let field2 = [];
      let groupedPoints = {};
      let i = 0;
      let groupLabel;
      let minmax;
      let LS;
      let slope;
      let start;
      let plots = [];
      let plotY = (x) => {
        return [x, start + (slope * x)];
      };
      let dataset;

    for (i = 0; i < data.length; i += 1) {
      points.push([data[i][xaxis], data[i][yaxis]]);
      field1.push(data[i][xaxis]);
      field2.push(data[i][yaxis]);
      if (grouping) {
        groupLabel = data[i][grouping];
        if (!(groupedPoints[groupLabel] instanceof Array)) {
          groupedPoints[groupLabel] = [];
        }
        groupedPoints[groupLabel].push([data[i][xaxis], data[i][yaxis]]);
      }
    }

    if (grouping === 'ungrouped') {
      minmax = this.minmaxx(points);
      min = minmax[0];
      max = minmax[1];
      LS = this.lsFit(points);
      slope = LS[1];
      start = LS[0];

      $.plot('#scatterplotdiv', [{

        label: 'Data Points',
        data: points,
        points: {show: true},
      }, // Least Squares Fit
        {
          label: 'Least Squares Fit',
          data: jStat.seq(min, max, 3, plotY),
          lines: {show: true},
        }], {});
    } else {
      minmax = this.minmaxx(points);
      min = minmax[0];
      max = minmax[1];
      i = 0;

      for (dataset in groupedPoints) {
        if (groupedPoints.hasOwnProperty(dataset)) {
          // let label = document.getElementById(
          //   'scatter-group'
          // ).selectedOptions.item(0).textContent
          //   + ' = ' + dataset;
          plots.push({
            color: i,
            label: dataset,
            data: groupedPoints[dataset],
            points: {show: true},
          });
          LS = this.lsFit(groupedPoints[dataset]);
          // LS = lsFit(groupedPoints[dataset].convertNumbers());
          slope = LS[1];
          start = LS[0];
          plots.push({
            color: i,
            // label: "LS Fit for " + dataset,
            data: jStat.seq(min, max, 3, plotY),
            lines: {show: true},
          });
          i += 1;
        }
      }
      $.plot('#scatterplotdiv', plots, {});
    }

    $('#correlationtbl tbody').children().remove();
    $('#correlationtbl tbody').append(
      '<tr><td>' + jStat.covariance(field1, field2)
      + '</td><td>' + jStat.corrcoeff(field1, field2) + '</td></tr>'
    );
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let options = this.props.Fields.map((element, key) => {
        return (
          <option key={key}
                  value={key}>
            {element}
          </option>
        );
      });
      let scatterStyle = {
        width: '500px',
        height: '500px',
      };
    return (
      <div>
        <h2>Scatterplot</h2>

        <div className='col-xs-4 col-md-3'>
          Column for X Axis
        </div>
        <div className='col-xs-8 col-md-3'>
          <select id='scatter-xaxis' onChange={this.updateScatterplot}>
            <option>None</option>
            {options}
          </select>
        </div>

        <div className='col-xs-4 col-md-3'>
          Column for Y Axis
        </div>
        <div className='col-xs-8 col-md-3'>
          <select id='scatter-yaxis' onChange={this.updateScatterplot}>
            <option>None</option>
            {options}
          </select>
        </div>

        <div className='col-xs-4 col-md-3'>
          Group by column
        </div>
        <div className='col-xs-8 col-md-3'>
          <select id='scatter-group' onChange={this.updateScatterplot}>
            <option>None</option>
            {options}
          </select>
        </div>
        <h3>Scatterplot</h3>
        <div id='scatterplotdiv' style={scatterStyle}></div>
        <h3>Statistics</h3>
        <table id='correlationtbl'>
          <thead>
          <tr>
            <th>Covariance</th>
            <th>Correlation Coefficient</th>
          </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    );
  }
}

/**
 * StatsVisualizationTabPane Component
 *
 * The following component is used for displaying the stats tab content
 */
class StatsVisualizationTabPane extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      displayed: false,
    };
  }

  /**
   * shouldComponentUpdate
   * @param {object} nextProps - next props
   * @param {object} nextState - next state
   * @return {boolean} update component if true.
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.Active && !this.props.Active) {
      return true;
    } else if (!nextProps.Active && this.props.Active) {
      return true;
    }
    return false;
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let content;
    if (this.props.Data.length === 0) {
      content = (
        <h1 className='col-xs-12' style={{color: '#0A3572'}}>
          Visualized Data cannot be calculated until query is run.
        </h1>
      );
    } else {
      let stats = jStat(this.props.Data);
        let min = stats.min();
        let max = stats.max();
        let stddev = stats.stdev();
        let mean = stats.mean();
        let meandev = stats.meandev();
        let meansqerr = stats.meansqerr();
        let quartiles = stats.quartiles();
        let rows = [];

      for (let i = 0; i < this.props.Fields.length; i += 1) {
        rows.push(<tr key={'fields_' + i}>
          <td>{this.props.Fields[i]}</td>
          <td>{min && min[i] ? min[i].toString() : ''}</td>
          <td>{max && max[i] ? max[i].toString() : ''}</td>
          <td>{stddev && stddev[i] ? stddev[i].toString() : ''}</td>
          <td>{mean && mean[i] ? mean[i].toString() : ''}</td>
          <td>{meandev && meandev[i] ? meandev[i].toString() : ''}</td>
          <td>{meansqerr && meansqerr[i] ? meansqerr[i].toString() : ''}</td>
          <td>{quartiles && quartiles[i] && quartiles[i][0]
            ? quartiles[i][0].toString()
            : ''}</td>
          <td>{quartiles && quartiles[i] && quartiles[i][1]
            ? quartiles[i][1].toString()
            : ''}</td>
          <td>{quartiles && quartiles[i] && quartiles[i][2]
            ? quartiles[i][2].toString()
            : ''}</td>
        </tr>);
      }

      let statsTable = (
        <table className='table table-hover table-primary
         table-bordered colm-freeze'>
          <thead>
          <tr className='info'>
            <th>Measure</th>
            <th>Min</th>
            <th>Max</th>
            <th>Standard Deviation</th>
            <th>Mean</th>
            <th>Mean Deviation</th>
            <th>Mean Squared Error</th>
            <th>First Quartile</th>
            <th>Second Quartile</th>
            <th>Third Quartile</th>
          </tr>
          </thead>
          <tbody>
          {rows}
          </tbody>
        </table>
      );

      content = (
        <div>
          <h2>Basic Statistics</h2>
          {statsTable}

          <ScatterplotGraph
            Fields={this.props.Fields}
            Data={this.props.Data}
          />
        </div>
      );
    }
    return (
      <TabPane TabId={this.props.TabId}
               Loading={this.props.Loading}
               Active={this.props.Active}>
        {content}
      </TabPane>
    );
  }
}

StatsVisualizationTabPane.defaultProps = {
  Data: [],
};

StatsVisualizationTabPane.propTypes = {
  Data: PropTypes.array,
};

/**
 * SaveQueryDialog Component
 * The following component is used for displaying a popout dialog for saving the current
 * query
 *
 * @param {object} props - React Component properties
 * @return {JSX} - React markup for the component
 */
let SaveQueryDialog = (props) => {
  const [queryName, setQueryName] = useState('');
  const [shared, setShared] = useState(false);

  const editName = (e) => {
    setQueryName(e.target.value);
  };

  const editPublic = (e) => {
    setShared(e.target.checked);
  };

  const onSaveClicked = () => {
    // Should do validation before doing anything here.. ie query name is entered, doesn't already
    // exist, there are fields selected..
    if (props.onSaveClicked) {
      props.onSaveClicked(queryName, shared);
    }
  };

  const onDismissClicked = () => {
    if (props.onDismissClicked) {
      props.onDismissClicked();
    }
  };

  return (
    <div className='modal show'>
      <div className='modal-dialog-save-query'>
        <div className='modal-content'>
          <div className='modal-header'>
            <button type='button'
                    className='close'
                    aria-label='Close'
                    onClick={onDismissClicked}
            >
              <span aria-hidden='true'>&times;</span>
            </button>
            <h4 className='modal-title'
                id='myModalLabel'
                style={{color: '#fff'}}>
              Save Current Query
            </h4>
          </div>
          <div className='modal-body'>
            <p>Enter the name you would like to save your query under here:</p>
            <div className='input-group'>
              Query Name:&nbsp;
              <input type='text'
                     className='form-control'
                     placeholder='My Query'
                     value={queryName}
                     onChange={editName}/>
            </div>
            <p>Make query a publicly shared query?&nbsp;
              <input type='checkbox'
                     checked={shared ? 'checked' : ''}
                     onChange={editPublic}
                     aria-label='Shared Query'/>
            </p>
          </div>
          <div className='modal-footer'>
            <button type='button'
                    className='btn btn-default'
                    onClick={onDismissClicked}>
              Close
            </button>
            <button type='button'
                    className='btn btn-primary'
                    onClick={onSaveClicked}>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ManageSavedQueryFilter Component
 *
 * The following component is used for displaying the filter of a individual query in a tree
 * like structure
 */
class ManageSavedQueryFilter extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let filterItem;
    let filter = this.props.filterItem;
    if (filter.activeOperator) {
      let children = filter.children.map((element, key) => {
        return <ManageSavedQueryFilter
          filterItem={element}
        />;
      });
      let logicOp = filter.activeOperator === 1
        ? 'OR'
        : 'AND';
      return (
        <li>
          <span>{logicOp}</span>
          <ul className='savedQueryTree'>
            {children}
          </ul>
        </li>
      );
    } else {
      filter = this.props.filterItem;
      if (filter.instrument) {
        let operator;
        switch (filter.operator) {
          case 'equal':
            operator = '=';
            break;
          case 'notEqual':
            operator = '!=';
            break;
          case 'lessThanEqual':
            operator = '<=';
            break;
          case 'greaterThanEqual':
            operator = '>=';
            break;
          default:
            operator = filter.operator;
            break;
        }
        filterItem = (
          <span>{filter.instrument},
            {filter.field} {operator} {filter.value}</span>
        );
      } else {
        filterItem = (
          <span>{filter.Field} {filter.Operator} {filter.Value}</span>
        );
      }
    }
    return (
      <li>{filterItem}</li>
    );
  }
}

/**
 * ManageSavedQueryRow Component
 *
 * The following component is used for displaying the individual saved queries in the
 * manage saved queries tab
 */
class ManageSavedQueryRow extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let fields = [];
    let filters;
    if (this.props.Query.Fields && Array.isArray(this.props.Query.Fields)) {
      for (let i = 0; i < this.props.Query.Fields.length; i += 1) {
        fields.push(
          <li key={i}>
            {this.props.Query.Fields[i]}
          </li>
        );
      }
    } else if (this.props.Query.Fields) {
      for (let instrument in this.props.Query.Fields) {
        if (this.props.Query.Fields.hasOwnProperty(instrument)) {
          for (let field in this.props.Query.Fields[instrument]) {
            if (this.props.Query.Fields[instrument].hasOwnProperty(field)
              && field !== 'allVisits'
            ) {
              fields.push(
                <li key={instrument + field}>
                  {instrument},{field}
                </li>
              );
            }
          }
        }
      }
    }

    if (fields.length === 0) {
      fields.push(<li key={'no_fields_defined'}>No fields defined</li>);
    }

    if (this.props.Query.Conditions) {
      let operator;
        let filter;
      if (this.props.Query.Conditions.activeOperator) {
        if (this.props.Query.Conditions.children) {
          if (this.props.Query.Conditions.activeOperator === '0') {
            operator = (<span>AND</span>);
          } else {
            operator = (<span>OR</span>);
          }
          filter = this.props.Query.Conditions.children.map((element, key) => {
            return (
              <ManageSavedQueryFilter
                key={key}
                filterItem={element}
              />
            );
          });
        } else {
          operator = (<span>No filters defined</span>);
        }
      } else {
        if (this.props.Query.Conditions.length === 0) {
          operator = (<span>No filters defined</span>);
        } else {
          operator = (<span>AND</span>);
          filter = this.props.Query.Conditions.map((element, key) => {
            return (
              <ManageSavedQueryFilter
                key={key}
                filterItem={element}
              />
            );
          });
        }
      }
      filters = (
        <div className='tree'>
          <ul className='firstUL savedQueryTree'>
            <li>
              {operator}
              <ul className='savedQueryTree'>
                {filter}
              </ul>
            </li>
          </ul>
        </div>
      );
    }
    if (!filters) {
      filters = (<strong>No filters defined</strong>);
    }
    return (
      <tr>
        <td>
          <div className={'tableNamesCell'}>
            {this.props.Name}
          </div>
        </td>
        <td>
          <div className={'tableFieldsCell'}>
            <ul>{fields}</ul>
          </div>
        </td>
        <td>
          <div className={'tableFiltersCell'}>
            {filters}
          </div>
        </td>
      </tr>
    );
  }
}

ManageSavedQueryRow.propTypes = {
  Name: PropTypes.object,
  Query: PropTypes.object,
};

ManageSavedQueryRow.defaultProps = {
  Name: null,
  Query: {
    Fields: [],
  },
};

/**
 * ManageSavedQueriesTabPane Component
 * The following component is used for displaying the manage saved queries tab content
 *
 * @param {object} props - React Component properties
 * @return {JSX} - React markup for the component
 */
let ManageSavedQueriesTabPane = (props) => {
  const loadQuery = (queryName) => {
    // Loads in the selected query
    props.onSelectQuery(
      props.queryDetails[queryName].Fields,
      props.queryDetails[queryName].Conditions
    );
  };

  let queryRows = [];
  if (props.queriesLoaded) {
    for (let i = 0; i < props.userQueries.length; i += 1) {
      let query = props.queryDetails[props.userQueries[i]];
      let name = 'Unnamed Query: ' + props.userQueries[i];
      if (query.Meta.name) {
        name = query.Meta.name;
      }
      const queryName = (
        <a href='#' onClick={() => loadQuery(props.userQueries[i])}>
          {name}
        </a>
      );
      queryRows.push(
        <ManageSavedQueryRow key={name} Name={queryName} Query={query}/>
      );
    }
  } else {
    queryRows.push(
      <tr key='loading'>
        <td colSpan='3'>Loading saved query details</td>
      </tr>
    );
  }

  let content = (
    <>
      <h2 style={{
        color: 'rgb(10, 53, 114)',
        textAlign: 'center',
        paddingTop: '0',
      }}>User Saved Queries</h2>
      <table className='table table-hover table-primary
       table-bordered colm-freeze'>
        <thead>
        <tr key='info' className='info'>
          <th>Query Name</th>
          <th>Fields</th>
          <th>Filters</th>
        </tr>
        </thead>
        <tbody>
        {queryRows}
        </tbody>
      </table>
    </>
  );

  return (
    <TabPane TabId={props.TabId} Loading={props.Loading}>
      {content}
    </TabPane>
  );
};

ManageSavedQueriesTabPane.defaultProps = {
  userQueries: [],
  globalQueries: [],
  queriesLoaded: false,
  queryDetails: {},
};

ManageSavedQueriesTabPane.propTypes = {
  userQueries: PropTypes.array,
  globalQueries: PropTypes.array,
  queriesLoaded: PropTypes.bool,
  queryDetails: PropTypes.object,
};

window.Loading = Loading;
window.TabPane = TabPane;
window.InfoTabPane = InfoTabPane;
window.FieldSelectTabPane = FieldSelectTabPane;
window.FilterSelectTabPane = FilterSelectTabPane;
window.ViewDataTabPane = ViewDataTabPane;
window.ScatterplotGraph = ScatterplotGraph;
window.StatsVisualizationTabPane = StatsVisualizationTabPane;
window.SaveQueryDialog = SaveQueryDialog;
window.ManageSavedQueryFilter = ManageSavedQueryFilter;
window.ManageSavedQueryRow = ManageSavedQueryRow;
window.ManageSavedQueriesTabPane = ManageSavedQueriesTabPane;

export default {
  Loading,
  TabPane,
  InfoTabPane,
  FieldSelectTabPane,
  FilterSelectTabPane,
  ViewDataTabPane,
  ScatterplotGraph,
  StatsVisualizationTabPane,
  SaveQueryDialog,
  ManageSavedQueryFilter,
  ManageSavedQueryRow,
  ManageSavedQueriesTabPane,
};
