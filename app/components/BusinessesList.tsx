import React from 'react';
import { BusinessListTable, BusinessListTableProps } from './BusinessListTable';

type BusinessesListProps = BusinessListTableProps;

const BusinessesList: React.FC<BusinessesListProps> = (props) => (
  <BusinessListTable {...props} />
);

export default BusinessesList;