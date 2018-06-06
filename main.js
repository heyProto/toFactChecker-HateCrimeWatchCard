import React from 'react';
import { render } from 'react-dom';
import Card from './src/js/card.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};


ProtoGraph.Card.toIndiaSpendCard = function() {
    this.cardType = 'Card';
}

ProtoGraph.Card.toIndiaSpendCard.prototype.init = function(options) {
    this.options = options;
}

ProtoGraph.Card.toIndiaSpendCard.prototype.getData = function(data) {
    return this.containerInstance.exportData();
}

ProtoGraph.Card.toIndiaSpendCard.prototype.renderCol7 = function(data) {
    this.mode = 'col7';
    this.render();
}
ProtoGraph.Card.toIndiaSpendCard.prototype.renderCol4 = function(data) {
    this.mode = 'col4';
    this.render();
}
ProtoGraph.Card.toIndiaSpendCard.prototype.renderScreenshot = function(data) {
    this.mode = 'screenshot';
    this.render();
}

ProtoGraph.Card.toIndiaSpendCard.prototype.render = function() {
    render( <
        Card dataURL = { this.options.data_url }
        selector = { this.options.selector }
        clickCallback = { this.options.onClickCallback }
        siteConfigURL = { this.options.site_config_url }
        mode = { this.mode }
        ref = {
            (e) => {
                this.containerInstance = this.containerInstance || e;
            }
        }
        />,
        this.options.selector);
}