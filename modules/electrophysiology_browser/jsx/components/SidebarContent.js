/**
 * Created by Alizée Wickenheiser on 6/25/18.
 */

import PropTypes from 'prop-types';

const styles = {
  sidebar: {
    width: 150,
    height: 'calc(100vh)',
    backgroundColor: '#1a487e',
    fontWeight: 200,
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
  sidebarLink: {
    color: '#fff',
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
          color: '#fff',
          fontSize: '24px',
          fontWeight: 'bold',
          padding: '80px 0 0 10px',
          backgroundColor: '#1a487e',
        }
      }>
        Navigation
      </div>
      <div style={styles.content}>
        <a id={'nav_previous'} href={props.previous} target={'_self'} style={
          {
            color: '#fff',
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
