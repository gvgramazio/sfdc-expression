import { LightningElement, api, track } from 'lwc';

const defaultProps = {
  assistiveText: {
    addCondition: 'Add condition',
    addGroup: 'Add group',
    deleteIcon: 'Delete',
    label: ''
  },
  labels: {
    addCondition: 'Add Condition',
    addGroup: 'Add Group',
    customLogic: 'Custom Logic',
    label: '',
    takeAction: 'Take Action When',
    triggerAll: 'All Conditions Are Met',
    triggerAny: 'Any Condition Is Met',
    triggerCustom: 'Custom Logic Is Met'
  }
};

export default class expressionGroup extends LightningElement {
  @api isRoot = false;
  @api index;
  @api resources;
  @api operators;

  _assistiveText;
  _labels;
  _selectedTriggerType;
  @track _conditions = [];
  _customLogic = '';

  @api
  get assistiveText() {
    return Object.assign({}, defaultProps.assistiveText, this._assistiveText);
  }

  set assistiveText(value) {
    this._assistiveText = value;
  }

  @api
  get conditions() {
    return this._conditions;
  }

  set conditions(value) {
    this._conditions = value;
  }

  @api
  get labels() {
    return Object.assign({}, defaultProps.labels, this._labels);
  }

  set labels(value) {
    this._labels = value;
  }

  get triggers() {
    return [
      { label: this.labels.triggerAll, value: 'all' },
      { label: this.labels.triggerAny, value: 'any' },
      { label: this.labels.triggerCustom, value: 'custom' }
    ];
  }

  get triggerType() {
    switch (this._selectedTriggerType) {
      case 'all':
        return 'AND';
      case 'any':
        return 'OR';
      default:
        return '';
    }
  }

  get isCustomLogic() {
    return this._selectedTriggerType == 'custom';
  }

  handleTriggerChange(event) {
    this._selectedTriggerType = event.detail.value;
    if (this._conditions.length) {
      this.refreshConditions();
      this.refreshExpression();
    } else {
      this.addCondition();
    }
  }

  handleCustomLogicChange(event) {
    this._customLogic = event.detail.value;
    this.refreshExpression();
  }

  handleExpressionChange(event) {
    const index = event.detail.index;
    const expression = event.detail.expression;
    this._conditions[index].expression = expression;
    this.refreshExpression();
  }

  addCondition() {
    const conditionLabels = {
      label:
        this._selectedTriggerType == 'custom'
          ? this._conditions.length
          : this._conditions.length == 0
            ? ''
            : this.triggerType
    };
    const newCondition = {
      index: this._conditions.length,
      isGroup: false,
      labels: conditionLabels,
      resource: '',
      operator: '',
      value: ''
    };
    this._conditions.push(newCondition);
  }

  addGroup() {
    const groupLabels = {
      label:
        this._selectedTriggerType == 'custom'
          ? this._conditions.length
          : this._conditions.length == 0
            ? ''
            : this.triggerType
    };
    const newGroup = {
      index: this._conditions.length,
      isGroup: true,
      labels: groupLabels,
      triggerType: null,
      conditions: []
    };
    this._conditions.push(newGroup);
  }

  deleteCondition(event) {
    this._conditions.splice(event.detail.index, 1);
    this.refreshConditions();
    this.refreshExpression();
  }

  refreshConditions() {
    this._conditions.forEach((condition, index) => {
      condition.index = index;
      condition.labels.label =
        this._selectedTriggerType == 'custom'
          ? index
          : index == 0
            ? ''
            : this.triggerType;
    }, this);
  }

  refreshExpression() {
    let expression;
    if (this.isCustomLogic) {
      expression = this._customLogic
        .split(' ')
        .map((element) =>
          isNaN(element) ? element : this._conditions[+element].expression
        )
        .join(' ');
    } else {
      expression = this._conditions
        .map((condition) =>
          condition.isGroup && !condition.isRoot
            ? '(' + condition.expression + ')'
            : condition.expression
        )
        .join(' ' + this.triggerType + ' ');
    }
    this.dispatchEvent(
      new CustomEvent('expressionchange', {
        detail: { index: this.index, expression: expression }
      })
    );
  }
}
