/**
 * Created by Alizée Wickenheiser on 6/25/18.
 */

import PropTypes from 'prop-types';

const styles = {
  sidebar: {
    width: 150,
    height: 'calc(100vh)',
    background: '#E4EBF2',
    border: '1px solid #C3D5DB',
    fontWeight: 200,
  },
  sidebarLink: {
    color: '#064785',
    fontSize: '16px',
    display: 'none',
    padding: '10px 0 0 30px',
    textDecoration: 'none',
  },
  divider: {
    height: 1,
    width: '60%',
    margin: '4px 0',
    display: 'inline-block',
    backgroundColor: '#123860',
  },
  content: {
    padding: '10px',
  },
};

const SidebarContent = (props) => {
  return (
    <div style={styles.sidebar}>
      <div style={
        {
          color: '#064785',
          fontSize: '24px',
          fontWeight: 'bold',
          padding: '80px 0 0 10px',
        }
      }>
        Navigation
      </div>
      <div style={styles.content}>
        <a id={'nav_previous'} href={props.previous} target={'_self'} style={
          {
            color: '#064785',
            fontSize: '16px',
            display: 'none',
            padding: '0 0 0 10px',
            textDecoration: 'none',
          }
        }>
          &#171; Previous
        </a>
        <a id={'nav_next'}
           href={props.next}
           target={'_self'}
           style={styles.sidebarLink}
        >
          Next &#187;
        </a>
      </div>
    </div>
  );
};

SidebarContent.propTypes = {
  previous: PropTypes.string,
  next: PropTypes.string,
};

export default SidebarContent;
