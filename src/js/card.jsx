import React from "react";
import axios from "axios";
import moment from "moment";

export default class toCard extends React.Component {
  constructor(props) {
    super(props);

    this.tagMap = {
      English: {
        tabs: ["Overview", "Details", "Sources"],
        context: "Context",
        victims_killed: "No. of victims killed",
        victims_injured: "No. of victims injured",
        victim_religion: "Religion of the victim(s)",
        perp_religion: "Religion of the alleged perpetrator(s)",
        action_taken: "Action taken",
        nature_of_assault: "Nature of assault",
        party_in_power: "Party in power in the state",
        source: "Source",
        last_updated: "Last updated",
      },
      Hindi: {
        tabs: ["अवलोकन", "विवरण", "संदर्भ"],
        context: "प्रसंग",
        victims_killed: "मारे गए पीड़ितों की संख्या",
        victims_injured: "घायल पीड़ितों की संख्या",
        victim_religion: "पीड़ित/पीड़ितों का धर्म",
        perp_religion: "कथित अपराधी/अपराधियों का धर्म",
        action_taken: "कार्रवाई",
        nature_of_assault: "हमले का प्रकार",
        party_in_power: "राज्य में सत्ताधारी पार्टी",
        source: "संदर्भ",
        last_updated: "आखरी अपडेट",
      },
    };

    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      languageTexts: undefined,
      siteConfigs: this.props.siteConfigs,
      activeCounter: 1,
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      stateVar.tags =
        this.tagMap[this.props.dataJSON.data.language] ||
        this.tagMap["English"];
    }

    this.state = stateVar;
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  componentDidMount() {
    if (this.state.fetchingData) {
      let items_to_fetch = [axios.get(this.props.dataURL)];

      axios.all(items_to_fetch).then(
        axios.spread(card => {
          let stateVar = {
            fetchingData: false,
            dataJSON: card.data,
            activeCounter: 1,
            tags:
              this.tagMap[card.data.data.language] || this.tagMap["English"],
          };
          this.setState(stateVar);
        })
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON,
        tags:
          this.tagMap[nextProps.dataJSON.data.language] ||
          this.tagMap["English"],
      });
    }
  }

  formatDate(date, language) {
    if (date) {
      switch (language) {
        case "Hindi":
          moment.locale("hi");
          break;
        case "English":
        default:
          moment.locale("en");
      }

      let localDate = moment(date);
      return localDate.format("LL");
    } else return "-";
  }

  selectTab(tab) {
    this.setState({ activeCounter: tab + 1 });
  }

  renderTabs() {
    let tabs = this.state.tags.tabs;
    let tabNames;
    let tabClass;

    tabNames = tabs.map((card, i) => {
      tabClass =
        this.state.activeCounter == i + 1
          ? this.state.mode == "col-7"
            ? "single-tab active"
            : "single-tab single-tab-mobile active"
          : this.state.mode == "col-7"
          ? "single-tab"
          : "single-tab single-tab-mobile";
      return (
        <div
          key={i.toString()}
          className={tabClass}
          style={{ cursor: "pointer" }}
          onClick={() => this.selectTab(i)}
        >
          {tabs[i]}
        </div>
      );
    });
    return tabNames;
  }

  removeArrElem(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
    console.log(array, "Array");
  }

  renderTabContent(tab) {
    switch (tab) {
      case 1:
        let description = this.state.dataJSON.data.description_of_incident;
        return <p>{description}</p>;
      case 2:
        let detail = this.state.dataJSON.data,
          victim_arr = [
            detail.religion_of_victim_1,
            detail.religion_of_victim_2,
            detail.religion_of_victim_3,
            detail.religion_of_other_victim,
          ],
          perp_arr = [
            detail.religion_of_perpetrator_1,
            detail.religion_of_perpetrator_2,
            detail.religion_of_perpetrator_3,
            detail.religion_of_other_perpetrator,
          ],
          victim_religion = [],
          perp_religion = [];
        victim_arr.forEach((d, i) => {
          if (d !== "N/A") {
            if (victim_religion.indexOf(d) === -1) {
              victim_religion.push(d);
            }
          }
        });
        perp_arr.forEach((d, i) => {
          if (d !== "N/A") {
            if (perp_religion.indexOf(d) === -1) {
              perp_religion.push(d);
            }
          }
        });
        return (
          <div>
            <div className="half-width-parameter">
              <div className="single-parameter">
                <div className="parameter-label">{this.state.tags.context}</div>
                <p>{detail.pretext_to_incident}</p>
              </div>
              <div className="single-parameter">
                <div className="parameter-label">
                  {this.state.tags.victims_killed}
                </div>
                <p>{detail.no_of_victims_killed}</p>
              </div>
              <div className="single-parameter">
                <div className="parameter-label">
                  {this.state.tags.victims_injured}
                </div>
                <p>{detail.no_of_victims_injured}</p>
              </div>
              <div className="single-parameter">
                <div className="parameter-label">
                  {this.state.tags.victim_religion}
                </div>
                <p>{victim_religion.toString()}</p>
              </div>
              <div className="single-parameter">
                <div className="parameter-label">
                  {this.state.tags.perp_religion}
                </div>
                <p>{perp_religion.toString()}</p>
              </div>
            </div>
            <div className="half-width-parameter">
              <div className="single-parameter">
                <div className="parameter-label">
                  {this.state.tags.action_taken}
                </div>
                <p>{detail.is_fir_registered}</p>
              </div>
              <div className="single-parameter">
                <div className="parameter-label">
                  {this.state.tags.nature_of_assault}
                </div>
                <p>{detail.type_of_assault.join(",")}</p>
              </div>
              <div className="single-parameter">
                <div className="parameter-label">
                  {this.state.tags.party_in_power}
                </div>
                <p>{detail.party_in_power}</p>
              </div>
            </div>
          </div>
        );
      case 3:
        let data = this.state.dataJSON.data;
        return (
          <div>
            <div className="single-parameter">
              <div className="parameter-label">{this.state.tags.source}</div>
              <p>
                <a href={data.link_1} target="_blank">
                  {data.link_1}
                </a>
              </p>
              <p>
                <a href={data.link_2} target="_blank">
                  {data.link_2}
                </a>
              </p>
            </div>
            <div className="single-parameter">
              <div className="parameter-label">
                {this.state.tags.last_updated}
              </div>
              <p>{this.formatDate(data.last_updated, data.language)}</p>
            </div>
          </div>
        );
        break;
    }
  }

  renderCol7() {
    if (this.state.fetchingData) {
      return <div>Loading</div>;
    } else {
      let data = this.state.dataJSON.data,
        district = data.district,
        state = data.state;

      return (
        <div id="protograph_div" className="protograph-col7-mode">
          <div className="news-card">
            <button className="card-date" disabled="true">
              {this.formatDate(data.date, data.language)}
            </button>
            <div className="card-title">
              {district}, {state}
            </div>
            <div className="card-tabs">{this.renderTabs()}</div>
            <div className="tab-content">
              {this.renderTabContent(this.state.activeCounter)}
            </div>
            <div className="card-footer">
              <img
                className="logo-img"
                src={
                  "https://cdn.protograph.pykih.com/79c10f895565f79dca4b/is_logo.jpeg"
                }
              />
            </div>
          </div>
        </div>
      );
    }
  }

  renderCol4() {
    if (this.state.fetchingData) {
      return <div>Loading</div>;
    } else {
      let data = this.state.dataJSON.data,
        district = data.district,
        state = data.state,
        date = data.date;
      return (
        <div id="protograph_div" className="protograph-col4-mode">
          {/* content */}
          <div className="news-card news-card-mobile">
            <button className="card-date" disabled="true">
              {date}
            </button>
            <div className="card-title">
              {district}, {state}
            </div>
            <div className="card-tabs card-tabs-mobile">
              {this.renderTabs()}
            </div>
            <div className="tab-content">
              {this.renderTabContent(this.state.activeCounter)}
            </div>
            <div className="card-footer card-footer-mobile">
              <img
                className="logo-img"
                src={
                  "https://cdn.protograph.pykih.com/79c10f895565f79dca4b/is_logo.jpeg"
                }
              />
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    switch (this.props.mode) {
      case "col7":
        return this.renderCol7();
        break;
      case "col4":
        return this.renderCol4();
        break;
    }
  }
}

// <a href={data.explore_url}><div className="call-to-action-button call-to-action-mobile">Click here to explore data</div></a>
