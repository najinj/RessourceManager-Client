
import React from 'react';
import {  Link, withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';



const breadcrumbNameMap = {
  '/Assets': 'Assets',
  '/Spaces': 'Spaces',
  '/RessourceTypes': 'RessourceTypes'
};
const Breadcrumbs = withRouter(props => {
  const { location ,style} = props;
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);
  return (
      <Breadcrumb style= {style}>{breadcrumbItems}</Breadcrumb>
  );
});

export default Breadcrumbs;
          