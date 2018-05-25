import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
export default class toCard extends React.Component {

  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      optionalConfigJSON: {},
      languageTexts: undefined,
      siteConfigs: this.props.siteConfigs,
      activeCounter : 1
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.data.language);
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    this.state = stateVar;
  }

  exportData() {
    return document.getElementById('protograph_div').getBoundingClientRect();
  }

  componentDidMount() {
    if (this.state.fetchingData) {
      let items_to_fetch = [
        axios.get(this.props.dataURL)
      ];

      if (this.props.siteConfigURL) {
        items_to_fetch.push(axios.get(this.props.siteConfigURL));
      }

      axios.all(items_to_fetch).then(axios.spread((card, site_configs) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: card.data,
          optionalConfigJSON:{},
          siteConfigs: site_configs ? site_configs.data : this.state.siteConfigs,
          activeCounter:1
        };

        stateVar.dataJSON.data.language = stateVar.siteConfigs.primary_language.toLowerCase();
        stateVar.languageTexts = this.getLanguageTexts(stateVar.dataJSON.data.language);
        this.setState(stateVar);
      }));
    } 
    
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }

  getLanguageTexts(languageConfig) {
    let language = languageConfig ? languageConfig : "hindi",
      text_obj;

    switch(language.toLowerCase()) {
      case "hindi":
        text_obj = {
          font: "'Sarala', sans-serif"
        }
        break;
      default:
        text_obj = {
          font: undefined
        }
        break;
    }

    return text_obj;
  }


  selectTab(tab){
    this.setState({activeCounter:tab+1});
  }

  renderTabs(){
    let tabs =['description','details','sources'];
    let tabNames;
    let tabClass;

    tabNames = tabs.map((card,i)=>{
      tabClass = (this.state.activeCounter == i+1) ? ((this.state.mode=="col-7")?"single-tab active":"single-tab single-tab-mobile active") : (this.state.mode=="col-7")?"single-tab":"single-tab single-tab-mobile";
      return(
        <div key={i.toString()} className={tabClass} style={{cursor:"pointer"}} onClick={()=>this.selectTab(i)}>{tabs[i]}</div>
      )
    });
    return tabNames;
  }

  removeArrElem(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
    console.log(array, "Array")
  }

  renderTabContent(tab){
    switch(tab){
      case 1:
        let description = this.state.dataJSON.data.description_of_incident;
        return(
          <p>
            {description}
          </p>
        )
        break;
      case 2:
        let detail = this.state.dataJSON.data.details,
          victim_arr = [detail.religion_of_victim_1, detail.religion_of_victim_2, detail.religion_of_victim_3, detail.religion_of_other_victim],
          perp_arr = [detail.religion_of_perpetrator_1, detail.religion_of_perpetrator_2, detail.religion_of_perpetrator_3, detail.religion_of_other_perpetrator],
          victim_religion = [], perp_religion = [];
        victim_arr.forEach((d, i) =>{
          if (d !== 'N/A'){
            if (victim_religion.indexOf(d) === -1){
              victim_religion.push(d);
            } 
          } 
        })
        perp_arr.forEach((d, i) =>{
          if (d !== 'N/A'){
            if (perp_religion.indexOf(d) === -1){
              perp_religion.push(d);
            } 
          } 
        })
        console.log(victim_religion, perp_religion)
        return(
          <div>
            <div className="half-width-parameter">
              <div className="single-parameter">
                <div className="parameter-label">context</div>
                <p>{detail.pretext_to_incident}</p>
              </div>
              <div className="single-parameter">
                <div className="parameter-label">religion of the victim(s)</div>
                <p>{victim_religion.toString()}</p>
              </div>
              <div className="single-parameter">
                <div className="parameter-label">religion of the alleged perpetrator(s)</div>
                <p>{perp_religion.toString()}</p>
              </div>
            </div>
            <div className="half-width-parameter">
              <div className="single-parameter">
                <div className="parameter-label">action taken</div>
                <p>{detail.is_fir_registered}</p>
              </div>
              <div className="single-parameter">
                <div className="parameter-label">nature of assault</div>
                <p>{detail.type_of_assault}</p>
              </div>
              <div className="single-parameter">
                <div className="parameter-label">party in power in the state</div>
                <p>{detail.party_in_power}</p>
              </div>
            </div>
          </div>
        );
        break;
      case 3:
        let sources = this.state.dataJSON.data.sources;
        return(
          <div>
            <div className="single-parameter">
              <div className="parameter-label">Source</div>
              <p><a href={sources.link_1} target="_blank">{sources.link_1}</a></p>
               <p><a href={sources.link_2} target="_blank">{sources.link_2}</a></p>
            </div>
            <div className="single-parameter">
              <div className="parameter-label">Last Updated</div>
              <p>
                {sources.last_updated}
              </p>
            </div>
          </div>
        );
        break;    
    }
  }

  renderCol7() {
    if (this.state.fetchingData ){
      return(<div>Loading</div>)
    } else {
      let data = this.state.dataJSON.data,
        district = data.when_and_where.district,
        state = data.when_and_where.state,
        date = data.when_and_where.date;

      return (
        <div
          id="protograph_div"
          className="protograph-col7-mode"
          style={{ fontFamily: this.state.languageTexts.font }}>
          {/* content */}
          <div className="news-card">
            <button className="card-date" disabled="true">{date}</button>
            <div className="card-title">{district}, {state}</div>
            <div className="card-tabs">
              {this.renderTabs()}  
            </div>
            <div>
              {this.renderTabContent(this.state.activeCounter)}
            </div>
            <div className="card-footer">
              <img className="logo-img" src={'./src/images/is_logo.jpeg'}/>
            </div>
            </div> 
        </div>
      )
    }
  }

  renderCol4() {
    if (this.state.fetchingData) {
      return (<div>Loading</div>)
    } else {
     let data = this.state.dataJSON.data,
        district = data.when_and_where.district,
        state = data.when_and_where.state,
        date = data.when_and_where.date;
      return (
        <div
          id="protograph_div"
          className="protograph-col4-mode"
          style={{ fontFamily: this.state.languageTexts.font }}>
          {/* content */}
          <div className="news-card news-card-mobile">
            <button className="card-date" disabled="true">{date}</button>
            <div className="card-title">{district}, {state}</div>
            <div className="card-tabs card-tabs-mobile">
              {this.renderTabs()}  
            </div>
            <div>
              {this.renderTabContent(this.state.activeCounter)}
            </div>
            <div className="card-footer card-footer-mobile">
              <img className="logo-img" src={'./src/images/is_logo.jpeg'}/>
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    switch(this.props.mode) {
      case 'col7' :
        return this.renderCol7();
        break;
      case 'col4':
        return this.renderCol4();
        break;
    }
  }
}

 // <a href={data.explore_url}><div className="call-to-action-button call-to-action-mobile">Click here to explore data</div></a>
