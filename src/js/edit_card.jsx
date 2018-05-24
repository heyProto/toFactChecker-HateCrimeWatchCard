import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Card from './card.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form';

export default class editToCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {},
      mode: "col7",
      publishing: false,
      schemaJSON: undefined,
      fetchingData: true,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined,
      uiSchemaJSON: {}
    }
    this.toggleMode = this.toggleMode.bind(this);
  }

  exportData() {
    let getDataObj = {
      step: this.state.step,
      dataJSON: this.state.dataJSON,
      schemaJSON: this.state.schemaJSON,
      optionalConfigJSON: this.state.optionalConfigJSON,
      optionalConfigSchemaJSON: this.state.optionalConfigSchemaJSON
    }
    getDataObj["name"] = getDataObj.dataJSON.data.title.substr(0,225); // Reduces the name to ensure the slug does not get too long
    return getDataObj;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object.
    if (this.state.fetchingData){
      axios.all([
        axios.get(this.props.dataURL),
        axios.get(this.props.schemaURL),
        axios.get(this.props.optionalConfigURL),
        axios.get(this.props.optionalConfigSchemaURL),
        axios.get(this.props.uiSchemaURL)
      ])
      .then(axios.spread((card, schema, opt_config, opt_config_schema, uiSchema, linkSources) => {
        let stateVars = {
          fetchingData: false,
          dataJSON: card.data,
          schemaJSON: schema.data,
          optionalConfigJSON: opt_config.data,
          optionalConfigSchemaJSON: opt_config_schema.data,
          uiSchemaJSON: uiSchema.data
        };

        this.setState(stateVars);
      }));
    }
  }

  formatPublishDate(date){
    let new_date = date.split("-"),
      frDate = new_date[1] + "/" +new_date[2] + "/" +new_date[0]
    return frDate;
    // if(date.indexOf(' ')==-1){
    //   let year = date.substr(0,4);
    //   let month = date.substr(5,2);
    //   let day = date.substr(8,2);
    //   let frDate = '';
    //   let months = ["Jan" , "Feb" ,"Mar" , "Apr" , "May", "Jun" ,"Jul" ,"Aug","Sept","Oct","Nov","Dec"];
    //   frDate += day+" ";
    //   frDate += months[parseInt(month)-1]+", ";
    //   frDate += year; 
    //   return frDate; 
    // }
    // else{
    //   return date;
    // }  
  } 

  formatUpdateDate(date){
    if(date.indexOf(',')==-1){
      let year = date.substr(0,4);
      let month = date.substr(5,2);
      let day = date.substr(8,2);
      let months = ["January" , "February" ,"March" , "April" , "May", "June" ,"July" ,"August","September","October","November","December"];
      let frDate = '';
      frDate += months[parseInt(month)-1]+" ";
      frDate += day + ", ";
      frDate += year;
      return frDate; 
    }
    else{
      return date;
    } 
  }


  onChangeHandler({formData}) {
    this.setState((prevState,prop)=>{
      let dataJSON = prevState.dataJSON;
      formData.date = this.formatPublishDate(formData.date);
      formData.sources.lastUpdated = this.formatUpdateDate(formData.sources.lastUpdated);
      dataJSON.data = formData;
      return{
        dataJSON : dataJSON
      }
    })  
  }

  onSubmitHandler({formData}) {

    if (typeof this.props.onPublishCallback === "function") {
      let dataJSON = this.state.dataJSON;
      dataJSON.data.section = dataJSON.data.title;
      this.setState({ publishing: true, dataJSON: dataJSON });
      let publishCallback = this.props.onPublishCallback();
      publishCallback.then((message) => {
        this.setState({ publishing: false });
      });
    }
  }


  renderSEO() {
    let d = this.state.dataJSON.data;

    let blockquote_string = `<h1>${d.title}</h1>`;
    // Create blockqoute string.
    blockquote_string += `<p>${d.date}</p>`;
    blockquote_string += `<p>${d.description}</p>`;
    blockquote_string += `<p>${d.detail.context}</p>`;
    blockquote_string += `<p>${d.detail.action}</p>`;
    blockquote_string += `<p>${d.detail.religion}</p>`;
    blockquote_string += `<p>${d.detail.nature}</p>`;
    blockquote_string += `<p>${d.detail.religionAlleged}</p>`;
    blockquote_string += `<p>${d.detail.party}</p>`;
    blockquote_string += `<p>${d.sources.source}</p>`;
    blockquote_string += `<p>${d.sources.lastUpdated}</p>`;
    blockquote_string += `<p>${d.explore_url}</p>`;

    let seo_blockquote = '<blockquote>' + blockquote_string + '</blockquote>'
    return seo_blockquote;
  }

  renderSchemaJSON() {
    return this.state.schemaJSON.properties.data; 
    
  }

  renderFormData() {
    let data = this.state.dataJSON.data;
    return data;
    
  }

  showLinkText() {
    switch(this.state.step) {
      case 1:
        return '';
        break;
      case 2:
      case 3:
      case 4:
      case 5:
        return '< Back';
        break;
    }
  }

  showButtonText() {
    return 'Publish';
  }

  getUISchemaJSON() {
    return this.state.uiSchemaJSON.data;
  }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    });
  }

  toggleMode(e) {
    let element = e.target.closest('a'),
      mode = element.getAttribute('data-mode');

    this.setState((prevState, props) => {
      let newMode;
      if (mode !== prevState.mode) {
        newMode = mode;
      } else {
        newMode = prevState.mode
      }

      return {
        mode: newMode
      }
    })
  }

  render() {
    if (this.state.fetchingData) {
      return(<div>Loading</div>)
    } else {
      return (
        <div className="proto-container">
          <div className="ui grid form-layout">
            <div className="row">
              <div className="four wide column proto-card-form protograph-scroll-form">
                <div>
                  <div className="section-title-text">Fill the form</div>
                  <div className="ui label proto-pull-right">
                    toIndiaSpendCard
                  </div>
                </div>
                <JSONSchemaForm schema={this.renderSchemaJSON()}
                  onSubmit={((e) => this.onSubmitHandler(e))}
                  onChange={((e) => this.onChangeHandler(e))}
                  uiSchema={this.getUISchemaJSON()}
                  formData={this.renderFormData()}>
                  <br/>
                  {/* <a id="protograph-prev-link" className={`${this.state.publishing ? 'protograph-disable' : ''}`} onClick={((e) => this.onPrevHandler(e))}>{this.showLinkText()} </a> */}
                  <button type="submit" className={`${this.state.publishing ? 'ui primary loading disabled button' : ''} default-button protograph-primary-button`}>{this.showButtonText()}</button>
                </JSONSchemaForm>
              </div>
              <div className="twelve wide column proto-card-preview proto-share-card-div">
                <div className="protograph-menu-container">
                  <div className="ui compact menu">
                    <a className={`item ${this.state.mode === 'col7' ? 'active' : ''}`}
                      data-mode='col7'
                      onClick={this.toggleMode}
                    >
                      col-7
                    </a>
                    <a className={`item ${this.state.mode === 'col4' ? 'active' : ''}`}
                      data-mode='col4'
                      onClick={this.toggleMode}
                    >
                      col-4
                    </a>
                  </div>
                </div>
                <div className="protograph-app-holder">
                  <Card
                    mode={this.state.mode}
                    dataJSON={this.state.dataJSON}
                    schemaJSON={this.state.schemaJSON}
                    optionalConfigJSON={this.state.optionalConfigJSON}
                    optionalConfigSchemaJSON={this.state.optionalConfigSchemaJSON}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
