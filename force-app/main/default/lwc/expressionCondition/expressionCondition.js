import { LightningElement, api } from 'lwc';

const defaultProps = {
  assistiveText: {
    addCondition: 'Add condition',
    addGroup: 'Add group',
    deleteIcon: 'Delete',
    label: ''
  },
  labels: {
    label: '',
    operator: 'Operator',
    resource: 'Resource',
    value: 'Value',
    deleteCondition: 'Delete Condition'
  }
};

export default class expressionCondition extends LightningElement {
  @api index;
  @api resources;
  @api operators;

  _assistiveText;
  _labels;
  _selectedResource;
  _selectedOperator;
  _value;

  @api
  get assistiveText() {
    return Object.assign({}, defaultProps.assistiveText, this._assistiveText);
  }

  set assistiveText(value) {
    this._assistiveText = value;
  }

  @api
  get labels() {
    return Object.assign({}, defaultProps.labels, this._labels);
  }

  set labels(value) {
    this._labels = value;
  }

  get isOperatorDisabled() {
    return !this._selectedResource;
  }

  get isValueDisabled() {
    return !this._selectedOperator;
  }

  handleResourceChange(event) {
    this._selectedResource = event.detail.value;
    this.handleExpressionChange();
  }

  handleOperatorChange(event) {
    this._selectedOperator = event.detail.value;
    this.handleExpressionChange();
  }

  handleValueChange(event) {
    this._value = event.detail.value;
    this.handleExpressionChange();
  }

  handleExpressionChange() {
    const expression = [
      this._selectedResource,
      this._selectedOperator,
      this._value
    ].join(' ');
    this.dispatchEvent(
      new CustomEvent('expressionchange', {
        detail: { index: this.index, expression: expression }
      })
    );
  }

  deleteCondition(event) {
    this.dispatchEvent(
      new CustomEvent('delete', {
        detail: { index: this.index }
      })
    );
  }
}
