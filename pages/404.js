import Error from 'next/error'

Error.getInitialProps = async () => ({
  namespacesRequired: [],
})

export default Error;
