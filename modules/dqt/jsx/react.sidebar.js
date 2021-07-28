import React, {Component} from 'react';
import PropTypes from 'prop-types';

let special = {
      demographics: 'test example',
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
 * Sidebar Component
 *
 * React wrapper for a sidebar
 */
class Sidebar extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
    };
    this.toggleHidden = this.toggleHidden.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
  }

  /**
   * toggle hidden for sidebar
   */
  toggleHidden() {
    this.setState({hidden: !this.state.hidden});
  }

  /**
   * hide sidebar
   */
  hide() {
    this.setState({hidden: true});
  }

  /**
   * show sidebar
   */
  show() {
    this.setState({hidden: false});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    if (this.state.hidden) {
      return <div/>;
    }
    return (
      <div>
        <h2>{this.props.Name}</h2>
        {this.props.children}
      </div>
    );
  }
}

/**
 * FieldsSidebar Component
 *
 * React wrapper for a FieldsSidebar
 */
class FieldsSidebar extends Component {
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
    if ((!this.props.Fields || this.props.Fields.length === 0)
      &&
      (!this.props.Criteria || Object.keys(this.props.Criteria).length === 0)) {
      return null;
    }

    let fieldList = [];
    if (this.props.Fields) {
      for (let i = this.props.Fields.length - 1; i >= 0; i--) {
        let fieldInfo = this.props.Fields[i].split(',');
        fieldList.push(
          <div className='list-group-item row hideScrollbar'
               style={{
                 overflowX: 'scroll',
                 color: '#fff',
                 backgroundColor: '#4c8ad5',
               }}
               key={this.props.Fields[i]}>
            <h4 className='list-group-item-heading col-xs-12'
                style={{color: '#fff'}}
            >
              {special[fieldInfo[0]] ? special[fieldInfo[0]] : fieldInfo[0]}
              {/* {fieldInfo[0]} */}
            </h4>
            <span className='col-xs-12'>
              {fieldInfo[1]}
            </span>
          </div>
        );
      }
    }
    return (
      <Sidebar Name='Fields'>
        <div className='form-group'>
          <button className='btn btn-primary'
                  onClick={this.props.resetQuery}>Clear Query</button>
        </div>
        {fieldList}
      </Sidebar>);
  }
}

FieldsSidebar.propTypes = {
  Fields: PropTypes.array,
  Criteria: PropTypes.object,
};

FieldsSidebar.defaultProps = {
  Fields: [],
  Criteria: {},
};

window.Sidebar = Sidebar;
window.FieldsSidebar = FieldsSidebar;

export default {
  Sidebar,
  FieldsSidebar,
};
