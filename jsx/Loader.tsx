interface LoaderProps {
  size?: number;
}

/**
 * Loader component renders a spinner wheel of a specified size.
 *
 * @param {LoaderProps} props - The properties for the Loader component
 * @returns {JSX.Element} A div representing the loading spinner
 */
const Loader = ({size = 120}: LoaderProps) => {
  const loaderStyle = {
    width: size,
    height: size,
    borderWidth: size/15,
  };

  return <div className='loader' style={loaderStyle}/>;
};

export default Loader;
