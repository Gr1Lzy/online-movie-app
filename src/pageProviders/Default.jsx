import React from 'react';

import PageContainer from './components/PageContainer';

const Default = (props) => {
  return (
    <PageContainer>
      <Default {...props} />
    </PageContainer>
  );
};

export default Default;
