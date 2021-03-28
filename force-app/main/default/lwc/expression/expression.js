import { LightningElement, api } from 'lwc';

const defaultProps = { labels: { title: 'Conditions' } };

export default class expression extends LightningElement {
  @api resources;
  @api operators;

  _labels;
  _expression;

  @api
  get labels() {
    return Object.assign({}, defaultProps.labels, this._labels);
  }

  set labels(value) {
    this._labels = value;
  }

  @api get expression() {
    return this._expression;
  }

  handleExpressionChange(event) {
    this._expression = event.detail.expression;
  }
}
