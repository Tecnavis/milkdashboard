import { useState } from 'react';
import Footer from '../components/footer/Footer';
import AudienceHeader from '../components/header/AudienceHeader';
import AudienceTable from '../components/tables/AudienceTable';
import { DigiContextProvider } from '../context/DigiContext';
import { audienceData } from '../data/Data';

const AudienceMainContent = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="main-content">
      <div className="row">
        <div className="col-12">
          <div className="panel">
            <AudienceHeader onSearch={setSearchQuery} />
            <div className="panel-body">
              <div className="table-filter-option">
              </div>
              {/* <DigiContextProvider dataArray={audienceData}> */}
                <AudienceTable searchQuery={searchQuery} />
              {/* </DigiContextProvider> */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AudienceMainContent;



