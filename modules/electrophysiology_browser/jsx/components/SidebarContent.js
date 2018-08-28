/**
 * Created by Alizée Wickenheiser on 6/25/18.
 * Les contes de fées sont faits pour être défaits...
 */

const styles = {
  sidebar: {
    width: 256,
    height: 'calc(100vh)',
    backgroundColor: '#1a487e',
    fontWeight: 200,
    fontFamily: 'Helvetica, Arial, sans-serif'
  },
  sidebarLink: {
    color: '#fff',
    fontSize: '16px',
    display: 'block',
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
          padding: '80px 0 0 20px',
          backgroundColor: '#1a487e',
        }
      }>
        Navigation
      </div>
      <div style={styles.content}>
        <a href='index.html' style={
          {
            color: '#fff',
            fontSize: '16px',
            display: 'block',
            padding: '0 0 0 20px',
            textDecoration: 'none',
          }
        }>
          &#171; Back to list
        </a>
        <a href='other.html' style={styles.sidebarLink}>
          Next &#187;
        </a>
      </div>
    </div>
  );
};

SidebarContent.propTypes = {
};

export default SidebarContent;