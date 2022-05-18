import { GetServerSideProps } from 'next';

import PublicLayout from '@components//Layout/Public';

import withServerSideProps from 'hoc/withServerSideProps';

const Home = () => {
  return (
    <PublicLayout>
      <div className='home-page'>Home</div>
    </PublicLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withServerSideProps((context: any) => context);

export default Home;
